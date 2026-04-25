# record

`record` 负责牌谱回放页增强。实现重点在于接入页面原本的 `TZ` 运行时对象，再初始化 reviewer 面板。

## 代码分布

| 文件 | 作用 |
| --- | --- |
| `index.ts` | 牌谱页入口 |
| `tz-interceptor.ts` | 拦截 TZ 构造函数并拿到实例 |
| `guards.ts` | JSON 解析保护 |
| `reviewer/init.ts` | 组织 reviewer 初始化 |
| `reviewer/render.ts` | 渲染评测面板 |
| `reviewer/state.ts` | reviewer 运行时状态 |

## 实现

入口顺序是：装 JSON parse guard，拦截 `TZ`，延迟初始化 reviewer，并挂收藏入口。`tz-interceptor.ts` 处理 `defineProperty` hook、fallback patch 和强制补建实例这几种路径。

reviewer 面板没有出现时，通常先检查 `unsafeWindow` 是否可用，再看 `TZ` 是否被成功 wrap，最后看 `setReviewError()` 写入的错误信息。相关逻辑分别在 `index.ts`、`tz-interceptor.ts` 和 `reviewer/state.ts`。

## 测试

- `tests/record/tz-interceptor.test.ts`
- `tests/record/reviewer-render.test.ts`
