# game

`game` 负责对局页统计，核心是把 session、record 和 CHAGA 数据整理成页面需要的指标。

## 代码分布

| 文件 | 作用 |
| --- | --- |
| `index.ts` | 对局页初始化入口 |
| `data-metrics.ts` | 整理整场对局数据并计算指标 |
| `step-data.ts` | 拉取并解压单局牌谱 |
| `chaga-data.ts` | 读取 CHAGA seat 评测结果 |
| `ui-render.ts` | 把统计结果渲染到页面 |
| `step-simulator.ts` | 补齐或模拟步进数据 |
| `types.ts` | 最终展示结果的类型定义 |

## 实现

`index.ts` 会先挂收藏入口和加载提示，然后并行触发回合概览和完整统计。完整统计由 `data-metrics.ts` 负责，渲染由 `ui-render.ts` 负责。

## 数据来源

| 来源 | 函数 | 用途 |
| --- | --- | --- |
| `/_qry/game/` | `fetchSessionData()` | 取整场 session 信息 |
| `/_qry/record/` | `fetchStepData()` | 取并解压单局 script |
| `tc-api.pesiu.org/review/` | `fetchAiResponse()` | 取 CHAGA seat 数据 |

页面出现“请等待牌局完成”时，一般是 `fetchSessionData()` 返回的 `isFinished` 为 `false`。判断逻辑在 `src/shared/session-data.ts`，依赖 `records.length`、`periods`、`finish_time` 等字段。

## 测试

- `tests/game/data-metrics.test.ts`
- `tests/game/chaga-score.test.ts`
- `tests/game/step-simulator.test.ts`
- `tests/game/ui-render.test.ts`
- `tests/game/win-info.test.ts`
- `tests/game/index.test.ts`
