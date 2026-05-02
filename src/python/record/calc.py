from __future__ import annotations

import argparse
import base64
import json
import math
import urllib.parse
import urllib.request
import zlib
from dataclasses import dataclass
from pathlib import Path
from typing import Any


CHOICE_ACTION_TYPES = {2, 3, 4, 5, 6, 8, 9}
# 固定的 ri 偏移量：ri = action_index + FIXED_RI_OFFSET
# 等同于 TS 中 ri = tz.stp - 18（stp 比 action_index 多 17，最终都是 ri = action_index - 1）
FIXED_RI_OFFSET = -1
GAME_URL_TEMPLATE = "https://tziakcha.net/_qry/game/?id={game_id}"
RECORD_URL = "https://tziakcha.net/_qry/record/"
REVIEW_URL_TEMPLATE = "https://tc-api.pesiu.org/review/?id={session_id}&seat={seat}"


def bz2tc(tile_code: str) -> int:
	if not tile_code or len(tile_code) < 2:
		return -1
	tile_type = tile_code[0]
	try:
		number = int(tile_code[1:]) - 1
	except ValueError:
		return -1

	if tile_type == "W":
		return number
	if tile_type == "T":
		return number + 9
	if tile_type == "B":
		return number + 18
	if tile_type == "F":
		return number + 27
	if tile_type == "J":
		return number + 31
	if tile_type == "H":
		return number + 34
	return -1


def tc2bz(tile_index: int) -> str | None:
	if 0 <= tile_index <= 8:
		return f"W{tile_index + 1}"
	if 9 <= tile_index <= 17:
		return f"T{tile_index - 8}"
	if 18 <= tile_index <= 26:
		return f"B{tile_index - 17}"
	if 27 <= tile_index <= 30:
		return f"F{tile_index - 26}"
	if 31 <= tile_index <= 33:
		return f"J{tile_index - 30}"
	if 34 <= tile_index <= 41:
		return f"H{tile_index - 33}"
	return None


def tile_code_to_human(tile_code: str) -> str:
	"""将 bz 牌码转为人类可读名称，与 JS 中 tc2tile(bz2tc(x)) 等效。
	bz2tc: W→0-8(万), T→9-17(条), B→18-26(筒), F→27-30(风), J→31-33(中发白), H→34-41(花)
	TILE 数组: [0..35]=1m..9m(万), [36..71]=1s..9s(条), [72..107]=1p..9p(筒),
	           [108..111]=E, [112..115]=S, [116..119]=W, [120..123]=N,
	           [124..127]=C(中), [128..131]=F(发), [132..135]=P(白), [136..]=1f..8f(花)
	"""
	code = tile_code.strip()
	if not code or len(code) < 2:
		return code
	tile_type = code[0]
	try:
		number = int(code[1:])
	except ValueError:
		return code

	if tile_type == "W":
		return f"{number}万"
	if tile_type == "T":
		return f"{number}条"
	if tile_type == "B":
		return f"{number}筒"
	if tile_type == "F":
		wind_names = {1: "东", 2: "南", 3: "西", 4: "北"}
		return wind_names.get(number, code)
	if tile_type == "J":
		honor_names = {1: "中", 2: "发", 3: "白"}
		return honor_names.get(number, code)
	if tile_type == "H":
		return f"{number}f"
	return code


def humanize_action(action_text: str | None) -> str | None:
	"""将 AI 候选动作字符串转为人类可读格式，参考 JS act2str 实现。
	对 Chi 特殊处理：将顺子格式化为 (n-1)n(n+1)suit 形式。
	"""
	if action_text is None:
		return None
	action_text = action_text.strip()
	if not action_text:
		return action_text

	parts = action_text.split()
	if not parts:
		return action_text

	verb = parts[0]

	if verb.startswith("Chi") and len(parts) >= 2:
		# Chi W2 → 吃 1万2万3万 (中张)；tile 是顺子中间牌
		tile_raw = parts[-1]
		tc = bz2tc(tile_raw)
		if tc >= 0:
			# 确定花色和数字
			if 0 <= tc <= 8:
				suit = "万"; n = tc + 1
			elif 9 <= tc <= 17:
				suit = "条"; n = tc - 8
			elif 18 <= tc <= 26:
				suit = "筒"; n = tc - 17
			else:
				suit = None; n = None
			if suit and n:
				return f"吃 {n-1}{n}{n+1}{suit}"
		return f"吃 {tile_code_to_human(parts[-1])}"

	if verb == "Play" and len(parts) >= 2:
		return f"打 {tile_code_to_human(parts[-1])}"

	if verb == "Peng" and len(parts) >= 2:
		return f"碰 {tile_code_to_human(parts[-1])}"

	if verb in ("Gang", "BuGang") and len(parts) >= 2:
		return f"杠 {tile_code_to_human(parts[-1])}"

	if verb == "Hu":
		return "胡"

	if verb == "Pass":
		return "过"

	if verb == "Abandon":
		return "弃"

	return action_text


@dataclass(frozen=True)
class Choice:
	seat: int
	action_index: int
	kind: str
	value: int | None

	@property
	def label(self) -> str:
		if self.kind == "play" and self.value is not None:
			tile_code = tc2bz(self.value)
			human = tile_code_to_human(tile_code) if tile_code else f"#{self.value}"
			return f"打 {human}"
		if self.kind == "chi":
			return "吃"
		if self.kind == "peng":
			return "碰"
		if self.kind == "gang":
			return "杠"
		if self.kind == "hu":
			return "胡"
		if self.kind == "pass":
			return "过"
		if self.kind == "abandon":
			return "弃"
		return self.kind.capitalize()


def load_json(path: Path) -> Any:
	with path.open("r", encoding="utf-8") as handle:
		return json.load(handle)


def dump_json(path: Path, data: Any) -> None:
	path.parent.mkdir(parents=True, exist_ok=True)
	with path.open("w", encoding="utf-8") as handle:
		json.dump(data, handle, ensure_ascii=False, indent=2)


def fetch_json(
	url: str,
	*,
	method: str = "GET",
	payload: dict[str, Any] | None = None,
	timeout: float = 30.0,
) -> Any:
	headers = {
		"accept": "application/json, text/plain, */*",
		"user-agent": "Mozilla/5.0",
	}
	body: bytes | None = None
	request_method = method.upper()

	if request_method == "POST":
		if payload is None:
			body = b""
		else:
			body = urllib.parse.urlencode(payload).encode("utf-8")
			headers["content-type"] = "application/x-www-form-urlencoded; charset=UTF-8"

	request = urllib.request.Request(url, data=body, headers=headers, method=request_method)
	with urllib.request.urlopen(request, timeout=timeout) as response:
		content = response.read().decode("utf-8")
	return json.loads(content)


def fetch_session_data(session_id: str) -> dict[str, Any]:
	data = fetch_json(GAME_URL_TEMPLATE.format(game_id=urllib.parse.quote(session_id)), method="POST")
	if not isinstance(data, dict):
		raise ValueError("session 接口返回的不是对象")
	return data


def fetch_record_raw(record_id: str) -> dict[str, Any]:
	data = fetch_json(RECORD_URL, method="POST", payload={"id": record_id})
	if not isinstance(data, dict):
		raise ValueError(f"record={record_id} 接口返回的不是对象")
	return data


def fetch_ai_response(session_id: str, seat: int) -> Any:
	return fetch_json(REVIEW_URL_TEMPLATE.format(session_id=urllib.parse.quote(session_id), seat=seat))


def decode_record_script(raw_record: dict[str, Any]) -> dict[str, Any]:
	script = raw_record.get("script")
	if not isinstance(script, str) or not script:
		raise ValueError("牌谱中缺少 script 字段")

	decoded_bytes = base64.b64decode(script)
	decoded_bytes = zlib.decompress(decoded_bytes)
	decoded_json = json.loads(decoded_bytes.decode("utf-8"))
	if not isinstance(decoded_json, dict):
		raise ValueError("解密后的牌谱不是对象")
	return decoded_json


def extract_record_ids(session_data: dict[str, Any]) -> list[str]:
	records = session_data.get("records")
	if not isinstance(records, list):
		raise ValueError("session 数据中缺少 records 数组")

	record_ids: list[str] = []
	for item in records:
		if not isinstance(item, dict):
			continue
		record_id = item.get("i")
		if isinstance(record_id, str) and record_id:
			record_ids.append(record_id)

	if not record_ids:
		raise ValueError("session 中没有可用的 record id")
	return record_ids


def get_player_name(players: Any, seat: int) -> str | None:
	if not isinstance(players, list) or not (0 <= seat < len(players)):
		return None
	player = players[seat]
	if not isinstance(player, dict):
		return None
	name = player.get("n")
	return name if isinstance(name, str) and name else None


def get_player_id(players: Any, seat: int) -> str | None:
	if not isinstance(players, list) or not (0 <= seat < len(players)):
		return None
	player = players[seat]
	if not isinstance(player, dict):
		return None
	player_id = player.get("i")
	return player_id if isinstance(player_id, str) and player_id else None


def format_seat_names(players: Any, seats: list[int]) -> list[str]:
	return [get_player_name(players, seat) or f"Seat {seat}" for seat in seats]


def extract_record_winner_seats(step_data: dict[str, Any]) -> list[int]:
	result = step_data.get("y")
	if not isinstance(result, list):
		return []

	winners: list[int] = []
	for seat, item in enumerate(result):
		if not isinstance(item, dict):
			continue
		hu_info = item.get("h")
		if isinstance(hu_info, dict):
			winners.append(seat)
	return winners


def extract_ai_winner_seats(response_data_by_seat: dict[int, Any], round_index: int) -> list[int]:
	winners: list[int] = []
	for seat, response_data in response_data_by_seat.items():
		try:
			response_rows = get_response_rows(response_data)
		except ValueError:
			continue
		for row in response_rows:
			if row.get("rr") != round_index:
				continue
			if row.get("r") == 6:
				winners.append(seat)
				break
	return winners

# 平台标准：初始风位的玩家在四圈中的风位顺序
# key = 初始风位，value = 圈1/2/3/4 依次坐的风位
CIRCLE_WIND_STANDARD: dict[str, list[str]] = {
    "东": ["东", "南", "北", "西"],
    "南": ["南", "东", "西", "北"],
    "北": ["北", "西", "南", "东"],
    "西": ["西", "北", "东", "南"],
}


def build_seat_analysis(round_summaries: list[dict[str, Any]]) -> dict[str, Any]:
	if not round_summaries:
		return {
			"rounds": [],
			"circle_starts": [],
			"within_circle_left_rotate": True,
			"inter_circle_standard_ok": True,
			"platform_wind_order": ["东", "南", "北", "西"],
		}

	platform_wind_order = ["东", "南", "北", "西"]
	first_round_seats = sorted(round_summaries[0].get("seats", []), key=lambda x: x.get("seat", 0))
	first_round_names = [seat_item.get("player_name") or f"Seat {seat_item.get('seat', 0)}" for seat_item in first_round_seats]
	name_to_wind: dict[str, str] = {}
	for index, name in enumerate(first_round_names):
		if index < len(platform_wind_order):
			name_to_wind[name] = platform_wind_order[index]

	round_rows: list[dict[str, Any]] = []
	for round_info in round_summaries:
		seats = sorted(round_info.get("seats", []), key=lambda x: x.get("seat", 0))
		seat_names = [seat_item.get("player_name") or f"Seat {seat_item.get('seat', 0)}" for seat_item in seats]
		seat_winds = [name_to_wind.get(name, "?") for name in seat_names]
		round_rows.append(
			{
				"round_no": round_info.get("round_no"),
				"record_id": round_info.get("record_id"),
				"seat_order": seat_names,
				"wind_order": seat_winds,
			}
		)

	# 每 4 盘取一盘作为一圈起点
	raw_circle_starts = [row for row in round_rows if isinstance(row.get("round_no"), int) and (row["round_no"] - 1) % 4 == 0]

	# ── 圈间跳转：对比平台标准表 ──────────────────────────────────────────────
	# name_to_wind 给出每位玩家的初始风位（圈1时的风位）
	circle_starts: list[dict[str, Any]] = []
	inter_circle_standard_ok = True
	for circle_idx, row in enumerate(raw_circle_starts):
		expected: list[str | None] = []   # 按 seat 0-3 的期望风位
		mismatches: list[str] = []
		for seat_idx, (name, actual_wind) in enumerate(zip(row["seat_order"], row["wind_order"])):
			init_wind = name_to_wind.get(name)
			if init_wind is None or init_wind not in CIRCLE_WIND_STANDARD:
				expected.append(None)
				continue
			exp_wind = CIRCLE_WIND_STANDARD[init_wind][circle_idx]
			expected.append(exp_wind)
			if exp_wind != actual_wind:
				mismatches.append(f"seat{seat_idx}({name}) 期望{exp_wind} 实际{actual_wind}")
		circle_match = len(mismatches) == 0
		if not circle_match:
			inter_circle_standard_ok = False
		circle_starts.append({
			**row,
			"expected_wind_order": expected,
			"standard_match": circle_match,
			"mismatches": mismatches,
		})

	def is_left_rotate(prev_names: list[str], cur_names: list[str]) -> bool:
		if len(prev_names) != 4 or len(cur_names) != 4:
			return False
		return cur_names == prev_names[1:] + prev_names[:1]

	within_circle_ok = True
	within_circle_violations: list[str] = []
	for i in range(len(round_rows) - 1):
		round_no = round_rows[i]["round_no"]
		next_round_no = round_rows[i + 1]["round_no"]
		if not isinstance(round_no, int) or not isinstance(next_round_no, int):
			continue
		if round_no % 4 == 0:
			continue
		if next_round_no != round_no + 1:
			continue
		if not is_left_rotate(round_rows[i]["seat_order"], round_rows[i + 1]["seat_order"]):
			within_circle_ok = False
			within_circle_violations.append(f"第{round_no}→{next_round_no}盘不是左移")

	return {
		"rounds": round_rows,
		"circle_starts": circle_starts,
		"within_circle_left_rotate": within_circle_ok,
		"within_circle_violations": within_circle_violations,
		"inter_circle_standard_ok": inter_circle_standard_ok,
		"platform_wind_order": platform_wind_order,
		"first_round_name_to_wind": name_to_wind,
	}


def action_to_choice(action_index: int, combined: int, data: int) -> Choice | None:
	seat = (combined >> 4) & 3
	action_type = combined & 15

	if action_type not in CHOICE_ACTION_TYPES:
		return None

	if action_type == 2:
		tile_id = data & 0xFF
		return Choice(seat=seat, action_index=action_index, kind="play", value=tile_id // 4)

	if action_type == 3:
		return Choice(seat=seat, action_index=action_index, kind="chi", value=None)

	if action_type == 4:
		return Choice(seat=seat, action_index=action_index, kind="peng", value=None)

	if action_type == 5:
		return Choice(seat=seat, action_index=action_index, kind="gang", value=None)

	if action_type == 6:
		is_auto_hu = bool(data & 1)
		if is_auto_hu:
			return None
		return Choice(seat=seat, action_index=action_index, kind="hu", value=None)

	if action_type == 8:
		pass_mode = data & 3
		if pass_mode != 0:
			return None
		return Choice(seat=seat, action_index=action_index, kind="pass", value=None)

	if action_type == 9:
		return Choice(seat=seat, action_index=action_index, kind="abandon", value=None)

	return None


def extract_choices(step_data: dict[str, Any]) -> list[Choice]:
	actions = step_data.get("a")
	if not isinstance(actions, list):
		raise ValueError("step.json 中缺少动作数组 a")

	choices: list[Choice] = []
	for action_index, action in enumerate(actions):
		if not isinstance(action, list) or len(action) < 2:
			continue
		combined, data = action[0], action[1]
		if not isinstance(combined, int) or not isinstance(data, int):
			continue
		choice = action_to_choice(action_index, combined, data)
		if choice is not None:
			choices.append(choice)
	return choices


def find_round_start_index(step_data: dict[str, Any]) -> int | None:
	actions = step_data.get("a")
	if not isinstance(actions, list):
		return None
	for action_index, action in enumerate(actions):
		if not isinstance(action, list) or len(action) < 1:
			continue
		combined = action[0]
		if not isinstance(combined, int):
			continue
		if (combined & 15) == 0:
			return action_index
	return None


def get_response_rows(response_data: Any) -> list[dict[str, Any]]:
	if isinstance(response_data, list):
		return [row for row in response_data if isinstance(row, dict)]
	if isinstance(response_data, dict):
		data = response_data.get("data")
		if isinstance(data, list):
			return [row for row in data if isinstance(row, dict)]
	raise ValueError("response.json 不是可识别的 CHAGA 返回格式")


def decode_response_row_action(row: dict[str, Any]) -> tuple[str | None, int | None]:
	r = row.get("r")
	v = row.get("v")
	if not isinstance(r, int):
		return None, None

	if r == 2 and isinstance(v, int):
		return "play", v // 4
	if r == 3 and isinstance(v, int):
		return ("pass", None) if v == 0 else ("chi", None)
	if r == 4 and isinstance(v, int):
		return ("pass", None) if v == 0 else ("peng", None)
	if r == 5 and isinstance(v, int):
		return ("pass", None) if v == 0 else ("gang", None)
	if r == 6:
		return "hu", None
	if r == 1:
		return "abandon", None
	return None, None


def group_response_rows_by_round(response_rows: list[dict[str, Any]]) -> dict[int, dict[int, dict[str, Any]]]:
	grouped: dict[int, dict[int, dict[str, Any]]] = {}
	for row in response_rows:
		rr = row.get("rr")
		ri = row.get("ri")
		if not isinstance(rr, int) or not isinstance(ri, int):
			continue
		if rr not in grouped:
			grouped[rr] = {}
		if ri not in grouped[rr]:
			grouped[rr][ri] = row
	return grouped


def score_alignment(
	choices: list[Choice],
	response_map: dict[int, dict[str, Any]],
	offset: int,
) -> tuple[int, int, int]:
	matched = 0
	hit = 0
	for choice in choices:
		ri = choice.action_index + offset
		row = response_map.get(ri)
		if row is None:
			continue
		hit += 1
		row_kind, row_val = decode_response_row_action(row)
		if row_kind != choice.kind:
			continue
		if choice.kind == "play" and row_val != choice.value:
			continue
		matched += 1
	return matched, hit, len(choices)


def detect_round_and_offset(
	step_data: dict[str, Any],
	choices: list[Choice],
	response_rows: list[dict[str, Any]],
	seat: int,
) -> tuple[int, int]:
	seat_choices = [choice for choice in choices if choice.seat == seat]
	if not seat_choices:
		raise ValueError(f"seat={seat} 在 step 中没有可选动作")

	grouped = group_response_rows_by_round(response_rows)
	if not grouped:
		raise ValueError("response.json 中没有可用于对齐的 rr/ri 数据")

	start_index = find_round_start_index(step_data)
	default_offset = -1
	if start_index is not None:
		default_offset = (start_index - 1) - start_index

	candidate_offsets = sorted(set([default_offset, -2, -1, 0, 1, 2, 3]))

	best: tuple[int, int, int, int, int] | None = None
	for rr, rr_map in grouped.items():
		for offset in candidate_offsets:
			matched, hit, total = score_alignment(seat_choices, rr_map, offset)
			candidate = (matched, hit, -abs(offset - default_offset), -offset, rr)
			if best is None or candidate > best:
				best = candidate

	if best is None:
		raise ValueError("无法从 response 中检测到对应的小局(rr)")

	matched, hit, _, _, rr = best
	if matched == 0 and hit == 0:
		raise ValueError("未找到可对齐的 rr/ri，请检查 step 与 response 是否属于同一牌谱")

	# 重新取回当前 rr 最优 offset（避免 tie 时丢失）
	best_offset = default_offset
	best_local: tuple[int, int, int] | None = None
	rr_map = grouped[rr]
	for offset in candidate_offsets:
		cur = score_alignment(seat_choices, rr_map, offset)
		rank = (cur[0], cur[1], -abs(offset - default_offset))
		if best_local is None or rank > best_local:
			best_local = rank
			best_offset = offset

	return rr, best_offset


def detect_offset_for_round(
	step_data: dict[str, Any],
	choices: list[Choice],
	response_rows: list[dict[str, Any]],
	seat: int,
	round_index: int,
) -> int:
	seat_choices = [choice for choice in choices if choice.seat == seat]
	if not seat_choices:
		raise ValueError(f"seat={seat} 在 step 中没有可选动作")

	response_map = build_response_map(response_rows, round_index)
	if not response_map:
		raise ValueError(f"response.json 中找不到 rr={round_index} 的数据")

	start_index = find_round_start_index(step_data)
	default_offset = -1
	if start_index is not None:
		default_offset = (start_index - 1) - start_index

	candidate_offsets = sorted(set([default_offset, -2, -1, 0, 1, 2, 3]))
	best_offset = default_offset
	best_rank: tuple[int, int, int] | None = None

	for offset in candidate_offsets:
		matched, hit, _ = score_alignment(seat_choices, response_map, offset)
		rank = (matched, hit, -abs(offset - default_offset))
		if best_rank is None or rank > best_rank:
			best_rank = rank
			best_offset = offset

	return best_offset


def normalize_ai_action(action_text: str) -> tuple[str, int | None] | None:
	action_text = action_text.strip()
	if not action_text:
		return None
	if action_text.startswith("Play "):
		tile_index = bz2tc(action_text.split()[-1])
		return ("play", tile_index if tile_index >= 0 else None)
	if action_text.startswith("Chi"):
		return ("chi", None)
	if action_text.startswith("Peng"):
		return ("peng", None)
	if action_text.startswith("Gang") or action_text.startswith("BuGang"):
		return ("gang", None)
	if action_text.startswith("Hu"):
		return ("hu", None)
	if action_text.startswith("Pass"):
		return ("pass", None)
	if action_text.startswith("Abandon"):
		return ("abandon", None)
	return None


def calc_chaga_score(choice: Choice, row: dict[str, Any] | None) -> float | None:
	"""计算单步 CHAGA 度。
	- 对 candidates 的权重做 softmax
	- 再按首选候选缩放为 100 分
	- 返回玩家动作对应候选的分数（0~100）
	- 无 AI 数据时按 100 分计入，避免与一致率口径不一致
	"""
	if row is None:
		return 100.0
	extra = row.get("extra")
	if not isinstance(extra, dict):
		return 100.0
	candidates = extra.get("candidates")
	if not isinstance(candidates, list) or not candidates:
		return 100.0

	parsed: list[tuple[float, str, tuple[str, int | None]]] = []
	for item in candidates:
		if not isinstance(item, list) or len(item) < 2:
			continue
		weight_raw, action_raw = item[0], item[1]
		if not isinstance(weight_raw, (int, float)) or not isinstance(action_raw, str):
			continue
		normalized = normalize_ai_action(action_raw)
		if normalized is None:
			continue
		parsed.append((float(weight_raw), action_raw.strip(), normalized))

	if not parsed:
		return 100.0

	top_weight = parsed[0][0]
	best_match_weight: float | None = None

	for weight, _, (kind, value) in parsed:
		if choice.kind != kind:
			continue
		if choice.kind == "play" and choice.value != value:
			continue
		if best_match_weight is None or weight > best_match_weight:
			best_match_weight = weight

	if best_match_weight is None:
		return 0.0

	# softmax 后再按首选缩放，等价于 exp(w_match - w_top) * 100
	return math.exp(best_match_weight - top_weight) * 100.0


def has_related_ai_operation(row: dict[str, Any] | None) -> bool:
	if row is None:
		return False
	extra = row.get("extra")
	if not isinstance(extra, dict):
		return False
	candidates = extra.get("candidates")
	if not isinstance(candidates, list):
		return False

	for item in candidates:
		if not isinstance(item, list) or len(item) < 2 or not isinstance(item[1], str):
			continue
		action = item[1].strip()
		if (
			action.startswith("Play ")
			or action.startswith("Chi")
			or action.startswith("Peng")
			or action.startswith("Gang")
			or action.startswith("BuGang")
			or action.startswith("Hu")
		):
			return True
	return False


def build_response_map(response_rows: list[dict[str, Any]], round_index: int) -> dict[int, dict[str, Any]]:
	response_map: dict[int, dict[str, Any]] = {}
	for row in response_rows:
		if row.get("rr") != round_index:
			continue
		ri = row.get("ri")
		if isinstance(ri, int) and ri not in response_map:
			response_map[ri] = row
	return response_map


def choice_matches_ai(choice: Choice, row: dict[str, Any] | None) -> tuple[bool, str]:
	# 没有 AI 数据（row 不存在，或 candidates 为空/无效）：视为"无从比较"，不计为不匹配
	if row is None:
		return True, "AI 无对应数据"

	candidates = row.get("extra", {}).get("candidates") if isinstance(row.get("extra"), dict) else None
	if not isinstance(candidates, list) or not candidates:
		return True, "AI 没有候选动作"

	top_candidate = candidates[0]
	if not isinstance(top_candidate, list) or len(top_candidate) < 2 or not isinstance(top_candidate[1], str):
		return True, "AI 首选动作无效"

	normalized = normalize_ai_action(top_candidate[1])
	if normalized is None:
		return True, f"AI 首选动作无法识别: {top_candidate[1].strip()}"

	ai_kind, ai_value = normalized
	if choice.kind != ai_kind:
		return False, f"AI 首选为 {top_candidate[1].strip()}"

	if choice.kind == "play" and choice.value != ai_value:
		return False, f"AI 首选为 {top_candidate[1].strip()}"

	return True, f"AI 首选为 {top_candidate[1].strip()}"


def summarize(choice_results: list[dict[str, Any]], seat: int, round_index: int, offset: int, step_data: dict[str, Any]) -> dict[str, Any]:
	total = len(choice_results)
	matched = sum(1 for item in choice_results if item["matched"])
	ratio = matched / total if total else 0.0
	chaga_values = [float(item["chaga_score"]) for item in choice_results if item.get("chaga_score") is not None]
	chaga_count = len(chaga_values)
	chaga_sum = sum(chaga_values)
	chaga_avg = chaga_sum / chaga_count if chaga_count else 0.0
	player_name = None
	players = step_data.get("p")
	if isinstance(players, list) and 0 <= seat < len(players) and isinstance(players[seat], dict):
		player_name = players[seat].get("n")

	return {
		"seat": seat,
		"player_name": player_name,
		"round_index": round_index,
		"ri_offset": offset,
		"matched": matched,
		"total": total,
		"ratio": ratio,
		"chaga_sum": chaga_sum,
		"chaga_count": chaga_count,
		"chaga_avg": chaga_avg,
		"details": choice_results,
	}


def build_results(
	step_data: dict[str, Any],
	response_data: Any,
	seat_arg: str,
	round_index: int | None = None,
) -> dict[str, Any]:
	all_choices = extract_choices(step_data)
	response_rows = get_response_rows(response_data)

	if seat_arg == "auto":
		seat = 0
		best_score: tuple[int, int, int, int] | None = None
		for candidate_seat in range(4):
			seat_choices = [choice for choice in all_choices if choice.seat == candidate_seat]
			if not seat_choices:
				continue
			try:
				rr, offset = detect_round_and_offset(step_data, all_choices, response_rows, candidate_seat)
			except ValueError:
				continue
			rr_map = build_response_map(response_rows, rr)
			matched, hit, total = score_alignment(seat_choices, rr_map, offset)
			score = (matched, hit, total, -candidate_seat)
			if best_score is None or score > best_score:
				best_score = score
				seat = candidate_seat
		if best_score is None:
			raise ValueError("无法自动识别 seat，请用 --seat 手动指定")
	else:
		seat = int(seat_arg)
		if seat not in (0, 1, 2, 3):
			raise ValueError("seat 必须是 0 到 3，或使用 auto")

	if round_index is None:
		round_index, offset = detect_round_and_offset(step_data, all_choices, response_rows, seat)
	else:
		# round_index 已由调用方确定，直接用全局固定偏移，不再搜索
		# 与 TS 代码 getPlayerStep(): ri = tz.stp - 18 保持一致
		offset = FIXED_RI_OFFSET

	seat_choices = [choice for choice in all_choices if choice.seat == seat]
	response_map = build_response_map(response_rows, round_index)

	choice_results: list[dict[str, Any]] = []
	for choice in seat_choices:
		ri = choice.action_index + offset
		row = response_map.get(ri)
		matched, reason = choice_matches_ai(choice, row)
		chaga_score = calc_chaga_score(choice, row)
		ai_top = None
		if row and isinstance(row.get("extra"), dict):
			candidates = row["extra"].get("candidates")
			if isinstance(candidates, list) and candidates and isinstance(candidates[0], list) and len(candidates[0]) >= 2:
				ai_top = candidates[0][1]
		choice_results.append(
			{
				"ri": ri,
				"action_index": choice.action_index,
				"player_action": choice.label,
				"ai_top_action": ai_top,
				"matched": matched,
				"chaga_score": chaga_score,
				"reason": reason,
			}
		)

	return summarize(choice_results, seat, round_index, offset, step_data)


def analyze_session(session_id: str, output_dir: Path) -> dict[str, Any]:
	session_data = fetch_session_data(session_id)
	record_ids = extract_record_ids(session_data)
	session_players = session_data.get("players")
	session_player_names = [get_player_name(session_players, seat) or f"Seat {seat}" for seat in range(4)]

	output_dir.mkdir(parents=True, exist_ok=True)
	dump_json(output_dir / "session.json", session_data)

	ai_responses: dict[int, Any] = {}
	for seat in range(4):
		response_data = fetch_ai_response(session_id, seat)
		ai_responses[seat] = response_data
		dump_json(output_dir / f"seat{seat}.json", response_data)

	player_summaries: list[dict[str, Any]] = []
	player_summary_map: dict[str, dict[str, Any]] = {}
	if isinstance(session_players, list):
		for seat, player in enumerate(session_players):
			name = get_player_name(session_players, seat) or f"Seat {seat}"
			summary = {
				"seat": seat,
				"player_name": name,
				"matched": 0,
				"total": 0,
				"ratio": 0.0,
				"chaga_sum": 0.0,
				"chaga_count": 0,
				"chaga_avg": 0.0,
				"rounds": [],
			}
			player_summaries.append(summary)
			player_summary_map[name] = summary

	round_summaries: list[dict[str, Any]] = []
	for round_no, record_id in enumerate(record_ids, start=1):
		raw_record = fetch_record_raw(record_id)
		step_data = decode_record_script(raw_record)
		round_players = step_data.get("p")
		record_winner_seats = extract_record_winner_seats(step_data)
		ai_winner_seats = extract_ai_winner_seats(ai_responses, round_no - 1)

		dump_json(output_dir / f"{record_id}_raw.json", raw_record)
		dump_json(output_dir / f"{record_id}_step.json", step_data)

		# 在循环外预先计算 ai_seat → step_seat 映射（按玩家姓名匹配）
		# AI seat 0-3 是 session.players 的固定顺序，step seat 0-3 是本盘物理座位
		ai_to_round_seat: list[int | None] = []
		for ai_player_name in session_player_names:
			step_seat_for_ai = None
			if isinstance(round_players, list):
				for i, p in enumerate(round_players):
					if isinstance(p, dict) and p.get("n") == ai_player_name:
						step_seat_for_ai = i
						break
			ai_to_round_seat.append(step_seat_for_ai)

		round_matched = 0
		round_total = 0
		round_chaga_sum = 0.0
		round_chaga_count = 0
		seat_results: list[dict[str, Any]] = []

		for ai_seat in range(4):
			step_seat = ai_to_round_seat[ai_seat]
			if step_seat is None:
				continue
			# 用正确的 step_seat 查 step 动作，用 ai_seat 的 AI 数据比对
			seat_result = build_results(step_data, ai_responses[ai_seat], str(step_seat), round_no - 1)
			seat_result["seat"] = step_seat
			seat_result["ai_seat"] = ai_seat
			seat_result["player_name"] = get_player_name(round_players, step_seat) or seat_result.get("player_name")
			seat_result["player_id"] = get_player_id(round_players, step_seat)
			seat_result["record_id"] = record_id
			seat_result["round_no"] = round_no
			seat_result["expected_round_index"] = round_no - 1
			seat_result["round_index_matched"] = seat_result["round_index"] == round_no - 1

			player_name = seat_result["player_name"]
			player_summary = player_summary_map.get(player_name)
			if player_summary is None:
				player_summary = {
					"seat": len(player_summaries),
					"player_name": player_name,
					"matched": 0,
					"total": 0,
					"ratio": 0.0,
					"chaga_sum": 0.0,
					"chaga_count": 0,
					"chaga_avg": 0.0,
					"rounds": [],
				}
				player_summaries.append(player_summary)
				player_summary_map[player_name] = player_summary
			player_summary["matched"] += seat_result["matched"]
			player_summary["total"] += seat_result["total"]
			player_summary["chaga_sum"] += float(seat_result.get("chaga_sum", 0.0))
			player_summary["chaga_count"] += int(seat_result.get("chaga_count", 0))
			player_summary["rounds"].append(seat_result)

			round_matched += seat_result["matched"]
			round_total += seat_result["total"]
			round_chaga_sum += float(seat_result.get("chaga_sum", 0.0))
			round_chaga_count += int(seat_result.get("chaga_count", 0))
			seat_results.append(seat_result)

		round_summaries.append(
			{
				"round_no": round_no,
				"record_id": record_id,
				"record_winner_seats": record_winner_seats,
				"record_winner_names": format_seat_names(round_players, record_winner_seats),
				"ai_winner_seats": ai_winner_seats,
				"ai_winner_names": format_seat_names(round_players, ai_winner_seats),
				"ai_to_round_seat": ai_to_round_seat,
				"matched": round_matched,
				"total": round_total,
				"ratio": round_matched / round_total if round_total else 0.0,
				"chaga_sum": round_chaga_sum,
				"chaga_count": round_chaga_count,
				"chaga_avg": round_chaga_sum / round_chaga_count if round_chaga_count else 0.0,
				"seats": seat_results,
			}
		)

	for player_summary in player_summaries:
		total = player_summary["total"]
		player_summary["ratio"] = player_summary["matched"] / total if total else 0.0
		player_chaga_count = int(player_summary.get("chaga_count", 0))
		player_chaga_sum = float(player_summary.get("chaga_sum", 0.0))
		player_summary["chaga_avg"] = player_chaga_sum / player_chaga_count if player_chaga_count else 0.0

	overall_matched = sum(item["matched"] for item in player_summaries)
	overall_total = sum(item["total"] for item in player_summaries)
	overall_chaga_sum = sum(float(item.get("chaga_sum", 0.0)) for item in player_summaries)
	overall_chaga_count = sum(int(item.get("chaga_count", 0)) for item in player_summaries)

	result = {
		"session_id": session_id,
		"title": session_data.get("title"),
		"periods": session_data.get("periods"),
		"record_count": len(record_ids),
		"ai_seat_reference": session_player_names,
		"overall": {
			"matched": overall_matched,
			"total": overall_total,
			"ratio": overall_matched / overall_total if overall_total else 0.0,
			"chaga_sum": overall_chaga_sum,
			"chaga_count": overall_chaga_count,
			"chaga_avg": overall_chaga_sum / overall_chaga_count if overall_chaga_count else 0.0,
		},
		"players": player_summaries,
		"rounds": round_summaries,
	}
	result["seat_analysis"] = build_seat_analysis(round_summaries)
	dump_json(output_dir / "analysis.json", result)
	return result


def print_text_report(result: dict[str, Any]) -> None:
	player_name = result.get("player_name") or f"Seat {result['seat']}"
	matched = result["matched"]
	total = result["total"]
	ratio = result["ratio"] * 100 if total else 0.0

	print(f"玩家: {player_name} (seat={result['seat']})")
	print(f"小局 rr: {result['round_index']}")
	print(f"ri 偏移: {result['ri_offset']} (ri = action_index + offset)")
	print(f"一致率: {matched}/{total} = {ratio:.2f}%")
	print()
	print("明细:")
	for item in result["details"]:
		ai_raw = item["ai_top_action"]
		ai_top = humanize_action(ai_raw) if ai_raw else "<无>"
		mark = "✓" if item["matched"] else "✗"
		print(
			f"- ri={item['ri']:>3} | 选手={item['player_action']:<10} | AI={ai_top:<12} | {mark} | {item['reason']}"
		)


def print_round_actions(round_info: dict[str, Any]) -> None:
	"""按 action_index 顺序打印一盘内所有选择动作，有 AI 数据时标注推荐与一致情况。"""
	seats_data = round_info.get("seats", [])

	# AI 对齐摘要
	print("  AI对齐信息:")
	for seat_info in seats_data:
		seat = seat_info.get("seat", 0)
		name = seat_info.get("player_name") or f"Seat {seat}"
		rr = seat_info.get("round_index")
		offset = seat_info.get("ri_offset")
		matched = seat_info.get("matched", 0)
		total = seat_info.get("total", 0)
		rr_ok = seat_info.get("round_index_matched", True)
		rr_note = f" ⚠ 对齐到rr={rr}（非本盘）" if not rr_ok else ""
		print(f"    seat{seat} {name}: rr={rr} offset={offset}  {matched}/{total}{rr_note}")

	# 合并所有 seat 的 details，按 action_index 排序
	all_details: list[tuple[int, int, dict[str, Any]]] = []
	seat_name: dict[int, str] = {}
	for seat_info in seats_data:
		seat = seat_info.get("seat", 0)
		name = seat_info.get("player_name") or f"Seat {seat}"
		seat_name[seat] = name
		for item in seat_info.get("details", []):
			all_details.append((item["action_index"], seat, item))

	all_details.sort(key=lambda x: x[0])

	print(f"  动作序列（共 {len(all_details)} 个选择动作）:")
	for action_index, seat, item in all_details:
		name = seat_name.get(seat, f"Seat {seat}")
		player_action = item["player_action"]
		ai_raw = item.get("ai_top_action")
		ai_top = humanize_action(ai_raw) if ai_raw else None
		matched = item.get("matched", False)
		ri = item.get("ri")

		player_col = f"seat{seat}({name})"
		# 中文字符占2列，补偿宽度差
		cjk_extra = sum(1 for c in player_col if "\u4e00" <= c <= "\u9fff" or "\u3000" <= c <= "\u303f")
		pad_player = max(0, 20 - cjk_extra)
		cjk_extra_action = sum(1 for c in player_action if "\u4e00" <= c <= "\u9fff")
		pad_action = max(0, 10 - cjk_extra_action)
		reason = item.get("reason", "")
		if ai_top is not None:
			cjk_extra_ai = sum(1 for c in ai_top if "\u4e00" <= c <= "\u9fff")
			pad_ai = max(0, 10 - cjk_extra_ai)
			mark = "✓" if matched else "✗"
			extra_note = f"  ({reason})" if reason and not reason.startswith("AI 首选") else ""
			print(f"    [{action_index:>4}] {player_col:<{pad_player}} {player_action:<{pad_action}}  AI[ri={ri:>4}]: {ai_top:<{pad_ai}}  {mark}{extra_note}")
		elif not matched:
			# 即使无 ai_top，matched=False 时也要显示 ✗（让统计与显示一致）
			print(f"    [{action_index:>4}] {player_col:<{pad_player}} {player_action:<{pad_action}}  ✗  ({reason})")
		else:
			print(f"    [{action_index:>4}] {player_col:<{pad_player}} {player_action:<{pad_action}}  (无AI数据)")


def print_session_report(result: dict[str, Any], *, show_details: bool = False) -> None:
	title = result.get("title") or "<未命名牌局>"
	overall = result["overall"]
	overall_ratio = overall["ratio"] * 100 if overall["total"] else 0.0
	overall_chaga = float(overall.get("chaga_avg", 0.0))

	print(f"牌局: {title} ({result['session_id']})")
	print(f"盘数: {result['record_count']} / periods={result.get('periods')}")
	print(f"总体一致率: {overall['matched']}/{overall['total']} = {overall_ratio:.2f}%")
	print(f"总体CHAGA度: {overall_chaga:.2f}")
	ai_seat_reference = result.get("ai_seat_reference")
	if isinstance(ai_seat_reference, list) and ai_seat_reference:
		pairs = [f"ai{idx}={name}" for idx, name in enumerate(ai_seat_reference)]
		print(f"AI 座位基准: {' | '.join(pairs)}")
	print()
	print("玩家汇总:")
	for player in result["players"]:
		player_name = player.get("player_name") or f"Seat {player['seat']}"
		ratio = player["ratio"] * 100 if player["total"] else 0.0
		chaga_avg = float(player.get("chaga_avg", 0.0))
		print(f"- {player_name} (seat={player['seat']}): {player['matched']}/{player['total']} = {ratio:.2f}% | CHAGA度={chaga_avg:.2f}")

	print()
	print("逐盘汇总:")
	for round_info in result["rounds"]:
		round_ratio = round_info["ratio"] * 100 if round_info["total"] else 0.0
		round_chaga = float(round_info.get("chaga_avg", 0.0))
		record_winner = "、".join(round_info.get("record_winner_names") or []) or "无（流局/未检测到）"
		ai_winner = "、".join(round_info.get("ai_winner_names") or []) or "无（未检测到）"
		print(
			f"- 第 {round_info['round_no']:02d} 盘 | record={round_info['record_id']} | 总计 {round_info['matched']}/{round_info['total']} = {round_ratio:.2f}% | CHAGA度={round_chaga:.2f}"
		)
		print(f"  牌谱和牌: {record_winner}")
		print(f"  AI 和牌: {ai_winner}")
		ai_to_round_seat = round_info.get("ai_to_round_seat")
		if isinstance(ai_to_round_seat, list) and len(ai_to_round_seat) == 4:
			print(f"  AI seat->当盘 seat: {ai_to_round_seat}")
		for seat_info in round_info["seats"]:
			player_name = seat_info.get("player_name") or f"Seat {seat_info['seat']}"
			seat_ratio = seat_info["ratio"] * 100 if seat_info["total"] else 0.0
			seat_chaga = float(seat_info.get("chaga_avg", 0.0))
			align_note = ""
			if not seat_info.get("round_index_matched", True):
				align_note = f" | ⚠ AI rr={seat_info['round_index']}"
			print(
				f"  - {player_name} (seat={seat_info['seat']}): {seat_info['matched']}/{seat_info['total']} = {seat_ratio:.2f}% | CHAGA度={seat_chaga:.2f}{align_note}"
			)
		if show_details:
			print_round_actions(round_info)

	seat_analysis = result.get("seat_analysis")
	if isinstance(seat_analysis, dict):
		circle_starts = seat_analysis.get("circle_starts")
		within_circle_left_rotate = seat_analysis.get("within_circle_left_rotate")
		within_circle_violations = seat_analysis.get("within_circle_violations") or []
		inter_circle_standard_ok = seat_analysis.get("inter_circle_standard_ok")
		print()
		print("座位分析:")

		# 圈内检查
		if isinstance(within_circle_left_rotate, bool):
			state = "✓ 是" if within_circle_left_rotate else "✗ 否"
			print(f"- 圈内(每4盘内)按左移轮转: {state}")
			for v in within_circle_violations:
				print(f"  ⚠ {v}")

		# 圈间跳转检查（对比平台标准表）
		if isinstance(inter_circle_standard_ok, bool):
			state = "✓ 符合" if inter_circle_standard_ok else "✗ 存在偏差"
			print(f"- 圈间跳转对比平台标准: {state}")

		if isinstance(circle_starts, list) and circle_starts:
			print("- 每圈起始座位(第1/5/9/13盘):")
			for row in circle_starts:
				round_no = row.get("round_no")
				wind_order = row.get("wind_order") or []
				expected = row.get("expected_wind_order") or []
				standard_match = row.get("standard_match", True)
				mismatches = row.get("mismatches") or []
				if not isinstance(round_no, int):
					continue
				actual_str = "-".join(str(x) for x in wind_order)
				exp_str = "-".join(str(x) if x else "?" for x in expected)
				match_mark = "✓" if standard_match else "✗"
				print(f"  - 第 {round_no:02d} 盘: 实际={actual_str}  期望={exp_str}  {match_mark}")
				for mismatch in mismatches:
					print(f"    ⚠ {mismatch}")


def parse_args() -> argparse.Namespace:
	base_dir = Path(__file__).resolve().parent
	parser = argparse.ArgumentParser(description="比较选手动作与 CHAGA AI 首选动作的一致率")
	parser.add_argument("--session-id", help="整场牌局 session id；提供后自动抓取 4 个 seat 与全部小局")
	parser.add_argument("--step", type=Path, default=base_dir / "step.json", help="单小局 step.json 路径")
	parser.add_argument("--response", type=Path, default=base_dir / "response.json", help="AI response.json 路径")
	parser.add_argument("--seat", default="auto", help="玩家 seat，取值 0-3，默认 auto 自动推断")
	parser.add_argument("--output-dir", type=Path, help="抓取文件和分析结果输出目录，默认保存到 data/<session_id>")
	parser.add_argument("--details", action="store_true", help="session 模式下输出每一步动作明细")
	parser.add_argument("--json", action="store_true", help="以 JSON 输出结果")
	return parser.parse_args()


def main() -> None:
	args = parse_args()
	if args.session_id:
		base_dir = Path(__file__).resolve().parent
		output_dir = args.output_dir or (base_dir / "data" / args.session_id)
		result = analyze_session(args.session_id, output_dir)
		if args.json:
			print(json.dumps(result, ensure_ascii=False, indent=2))
		else:
			print_session_report(result, show_details=args.details)
		return

	step_data = load_json(args.step)
	response_data = load_json(args.response)
	result = build_results(step_data, response_data, args.seat)

	if args.json:
		print(json.dumps(result, ensure_ascii=False, indent=2))
	else:
		print_text_report(result)


if __name__ == "__main__":
	main()
