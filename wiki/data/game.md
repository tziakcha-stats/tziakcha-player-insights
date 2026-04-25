# 牌局分析数据

对局页的数据分成三层：CHAGA 原始响应、牌谱步进数据、页面展示用的统计结果。

## CHAGA 响应

入口：`src/shared/chaga-review.ts`

```ts
type ChagaCandidate = [number, string];

interface ChagaReviewResponseItem {
  rr: number;
  ri: number;
  extra?: {
    candidates?: ChagaCandidate[];
  };
}
```

项目里统一使用下面这个结果：

```ts
type ChagaReviewFetchResult = {
  rows: ChagaReviewResponseItem[];
  errorMessage?: string;
};
```

## 步进数据

入口：`src/features/game/step-data.ts`

```ts
type StepData = {
  p?: StepPlayer[];
  a?: Array<[number, number]>;
  b?: number;
  y?: Array<{
    f?: number;
    t?: Record<string, number>;
  }>;
};
```

数据来自 `/_qry/record/`，返回里的 `script` 会先解压，再解析成 JSON。

## 统计结果

入口：`src/features/game/types.ts`

```json
{
  "players": [
    {
      "playerName": "Alice",
      "matched": 12,
      "total": 18,
      "ratio": 0.6667,
      "chagaAvg": 78.3,
      "winRounds": []
    }
  ],
  "rounds": [],
  "overall": {
    "matched": 48,
    "total": 72,
    "ratio": 0.6667,
    "chagaAvg": 74.8
  }
}
```

`data-metrics.ts` 负责计算，`ui-render.ts` 直接消费。

## 测试

- `tests/game/data-metrics.test.ts`：统计结果计算
- `tests/game/chaga-score.test.ts`：评分相关逻辑
- `tests/game/step-simulator.test.ts`：步进补全
