# 其余模块

## app

`app` 负责启动、监听路由变化和按页面分发 feature。代码在 `bootstrap.ts`、`route-watcher.ts`、`route-runner.ts`。测试主要落在各个 feature 的入口行为上。

## tech

`tech` 对用户技术页做增强，入口在 `src/features/tech/index.ts`。当前包含 `analysis` 和 `zumgze` 两块。测试在 `tests/tech/analysis-ui.test.ts` 和 `tests/tech/compare-calc.test.ts`。

## shared

`shared` 提供页面判定、CHAGA 请求、session 数据读取、浏览器存储和日志等公共能力。测试集中在 `tests/shared/session-data.test.ts`，其余能力由各 feature 的测试间接覆盖。
