# 运行时上下文

运行时状态主要来自页面上下文、浏览器能力和少量模块级缓存。

## SessionData

入口：`src/shared/session-data.ts`

```json
{
  "players": [
    { "name": "Alice", "id": "uid-1" },
    { "name": "Bob", "id": "uid-2" }
  ],
  "records": [
    { "id": "record-1" },
    { "id": "record-2" }
  ],
  "isFinished": true
}
```

`game` 模块用它判断牌局是否结束、有哪些 record，以及玩家名和 seat 的关系。

## RouteState

入口：`src/app/route-runner.ts`

```ts
type RouteState = {
  lastHref: string;
};
```

用于避免同一个 URL 重复初始化。

## 其他上下文

| 上下文 | 文件 | 作用 |
| --- | --- | --- |
| `w` | `src/shared/env.ts` | 统一访问 `window` |
| `localStorage` | `src/shared/storage.ts` | 收藏功能持久化 |
| `unsafeWindow` | `src/features/record/index.ts` | 进入页面上下文 |
| `history` hook | `src/app/route-watcher.ts` | 监听 SPA 路由变化 |

## 测试

- `tests/shared/session-data.test.ts`：session 数据解析
- `tests/record/tz-interceptor.test.ts`：牌谱页运行时对象接入
