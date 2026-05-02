# 架构总览

主体逻辑分散在 `features/*`。

```text
src/index.ts
  -> bootstrap()
  -> installRouteWatcher(runOnRoute)
  -> runOnRoute()
  -> features/* init
```

## 路由分发

| 页面 | 判定函数 | 初始化入口 |
| --- | --- | --- |
| 收藏页 | `isFavoritesPage()` | `initFavoritesPageFeature()` |
| 对局页 | `isGamePage()` | `initGameFeature()` |
| 牌谱回放页 | `isRecordPage()` | `initRecordFeature()` |
| 技术页 | `isTechPage()` | `initTechFeature()` |
| 历史页 | `isHistoryPage()` | `initHistoryFeature()` |
| 用户对局页 | `isUserGamePage()` | `initUserGameFeature()` |

## 代码路径

```text
src/index.ts
  -> app/bootstrap.ts
  -> app/route-watcher.ts
  -> app/route-runner.ts
  -> shared/route.ts
  -> features/*
```

牌谱页 reviewer 面板相关代码主要在下面几处：

- `src/features/record/index.ts`
- `src/features/record/tz-interceptor.ts`
- `src/features/record/reviewer/init.ts`
- `tests/record/*`
