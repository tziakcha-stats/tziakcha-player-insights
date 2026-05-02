import requests
import os
import json
from typing import List, Dict, Any

selected: List[Dict[str, Any]] = json.load(open('session.json', 'r', encoding='utf-8'))

HEADERS = {
    "accept": "*/*",
    "content-type": "text/plain;charset=UTF-8"
}

GAME_URL_TEMPLATE = "https://tziakcha.net/_qry/game/?id={game_id}"

grouped_sessions: List[Dict[str, Any]] = []
record_parent_map: Dict[str, Dict[str, Any]] = {}

for item in selected:
    session_id = item.get('id')
    title = item.get('title')
    try:
        response = requests.post(GAME_URL_TEMPLATE.format(game_id=session_id), headers=HEADERS, data='')
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Failed to fetch session {session_id}: {e}")
        continue

    records: List[str] = []
    if isinstance(data, dict) and 'records' in data and isinstance(data['records'], list):
        for idx, record in enumerate(data['records']):
            # 每个 record 预期包含键 'i'
            rec_id = record.get('i') if isinstance(record, dict) else None
            if not rec_id:
                continue
            records.append(rec_id)
            record_parent_map[rec_id] = {
                "session_id": session_id,
                "title": title,
                "order_in_session": idx + 1  # 1-based index
            }

    grouped_sessions.append({
        "session_id": session_id,
        "title": title,
        "records": records
    })

# 写入新的分组结构文件 all_record.json （替换旧的扁平列表）
with open('all_record.json', 'w', encoding='utf-8') as f:
    json.dump(grouped_sessions, f, ensure_ascii=False, indent=2)

# 额外写入 record -> parent session 映射，方便后续统计或关联
with open('record_parent_map.json', 'w', encoding='utf-8') as f:
    json.dump(record_parent_map, f, ensure_ascii=False, indent=2)

print(f"Written grouped sessions to all_record.json (sessions={len(grouped_sessions)})")
print(f"Written record parent map to record_parent_map.json (records={len(record_parent_map)})")