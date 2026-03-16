export const FAN_NAMES: readonly string[] = [
  "无",
  "大四喜",
  "大三元",
  "绿一色",
  "九莲宝灯",
  "四杠",
  "连七对",
  "十三幺",
  "清幺九",
  "小四喜",
  "小三元",
  "字一色",
  "四暗刻",
  "一色双龙会",
  "一色四同顺",
  "一色四节高",
  "一色四步高",
  "一色四连环",
  "三杠",
  "混幺九",
  "七对",
  "七星不靠",
  "全双刻",
  "清一色",
  "一色三同顺",
  "一色三节高",
  "全大",
  "全中",
  "全小",
  "清龙",
  "三色双龙会",
  "一色三步高",
  "一色三连环",
  "全带五",
  "三同刻",
  "三暗刻",
  "全不靠",
  "组合龙",
  "大于五",
  "小于五",
  "三风刻",
  "花龙",
  "推不倒",
  "三色三同顺",
  "三色三节高",
  "无番和",
  "妙手回春",
  "海底捞月",
  "杠上开花",
  "抢杠和",
  "碰碰和",
  "混一色",
  "三色三步高",
  "五门齐",
  "全求人",
  "双暗杠",
  "双箭刻",
  "全带幺",
  "不求人",
  "双明杠",
  "和绝张",
  "箭刻",
  "圈风刻",
  "门风刻",
  "门前清",
  "平和",
  "四归一",
  "双同刻",
  "双暗刻",
  "暗杠",
  "断幺",
  "一般高",
  "喜相逢",
  "连六",
  "老少副",
  "幺九刻",
  "明杠",
  "缺一门",
  "无字",
  "独听・边张",
  "独听・嵌张",
  "独听・单钓",
  "自摸",
  "花牌",
  "明暗杠",
  "※ 天和",
  "※ 地和",
  "※ 人和Ⅰ",
  "※ 人和Ⅱ",
];

export type WinFanItem = {
  fanIndex: number;
  fanName: string;
  count: number;
  unitFan: number;
  totalFan: number;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function parseWinFanItems(rawT: unknown): WinFanItem[] {
  if (!rawT || typeof rawT !== "object") {
    return [];
  }

  return Object.entries(rawT as Record<string, unknown>)
    .map(([fanIndexRaw, encodedRaw]) => {
      const fanIndex = toNumber(fanIndexRaw);
      const encoded = toNumber(encodedRaw);
      if (fanIndex === null || encoded === null) {
        return null;
      }

      const fanIndexInt = Math.floor(fanIndex);
      const encodedInt = Math.floor(encoded);
      const unitFan = encodedInt & 0xff;
      const count = (encodedInt >> 8) + 1;
      const fanName = FAN_NAMES[fanIndexInt] || `番种${fanIndexInt}`;

      return {
        fanIndex: fanIndexInt,
        fanName,
        count,
        unitFan,
        totalFan: unitFan * count,
      };
    })
    .filter((item): item is WinFanItem => Boolean(item))
    .sort((left, right) => left.fanIndex - right.fanIndex);
}
