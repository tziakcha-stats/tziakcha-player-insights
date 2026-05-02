# old.js 拆分迁移计划（覆盖版）

## 1. 目标与原则

- 目标：将 `src/old.js` 拆分为可维护的 TypeScript 模块化工程结构。
- 原则：
  - **行为等价优先**：先保证线上行为与旧脚本一致，再做优化。
  - **按页面分层**：`record` / `tech` / `history` 能力隔离。
  - **最小侵入迁移**：先平移代码，再渐进重构命名与内部实现。
  - **可验证交付**：每一步有明确输出和检查点。

---

## 2. old.js 功能边界盘点（基线）

### 2.1 全局启动与基础能力

- URL 归一化与调试参数处理：`bootstrapReviewerDebugQuery`
- Cookie 日志：`logCurrentCookie`
- Debug 开关与全局暴露：`__reviewerDebug`
- 路由判定：
  - `isRecordPage`
  - `isTechPage`
  - `isHistoryPage`
  - `isUserGamePage`

### 2.2 兼容与 Hook 能力

- `record` 页 JSON 兼容守卫：`installRecordJsonParseGuard`
- TZ 捕获链路：
  - `wrapTZ`
  - `installDefinePropertyHook`
  - `interceptTZ`
  - 强制补建 TZ 实例逻辑

### 2.3 业务功能

- `record` 页：
  - Reviewer UI 注入
  - 候选动作展示（`show_cands`）
  - 首选牌高亮
  - 权重条可视化
  - 用户信息隐藏
  - 评测数据加载与补空（`loadReviewData` / `fillEmptyValues`）
- `tech` 页：
  - Zumgze 分析卡片
  - 双参考（CHAGA 均 / 渣均）切换
  - CHAGA 度 + 置信区间计算
- `history` / `user/game` 页：
  - 家访按钮注入
  - 用户名匹配与链接化
  - 列表刷新自动重渲染

### 2.4 生命周期与路由监听

- `runOnRoute` 路由分发
- `installRouteWatcher` 对 `history.pushState/replaceState` 与事件监听

---

## 3. 目标目录结构（标准化）

```text
src/
  index.ts                        # 统一入口
  app/
    bootstrap.ts                  # 启动编排（初始化顺序）
    route-runner.ts               # runOnRoute 等路由分发
    route-watcher.ts              # popstate/hashchange/pushState hook
  shared/
    constants.ts                  # 常量（DEBUG_STORAGE_KEY 等）
    env.ts                        # window/unsafeWindow 获取
    logger.ts                     # debugLog / info / warn 统一
    dom.ts                        # DOM 查询与重试工具
    url.ts                        # URL 参数归一化
    storage.ts                    # localStorage 读写兜底
    types/
      global.d.ts                 # Window 扩展声明
      reviewer.ts                 # Review/Fan/Route 类型
  features/
    debug/
      debug-state.ts              # __reviewerDebug 与状态管理
    record/
      index.ts                    # record 页面初始化
      guards.ts                   # JSON.parse guard
      tz-interceptor.ts           # TZ Hook 与补建
      reviewer-state.ts           # __reviews 等状态
      reviewer-ui.ts              # createUI / UI事件挂载
      reviewer-render.ts          # show_cands / 高亮 / 权重条
      reviewer-data.ts            # loadReviewData / fillEmptyValues
      reviewer-utils.ts           # parseRound / act2str / bz2tc 等
    tech/
      index.ts                    # tech 页面初始化
      zumgze.ts                   # 计算与渲染
      refs.ts                     # FAN_ITEMS / REF_MAPS
    history/
      index.ts                    # history / user-game 初始化
      visit-linker.ts             # 家访能力
```

---

## 4. 迁移步骤（逐步覆盖）

### 步骤 1：搭建骨架与类型（不迁业务）

**产出**

- 新目录与空模块。
- `shared/types/global.d.ts` 与 `shared/types/reviewer.ts`。
- `src/index.ts` 改为调用 `app/bootstrap.ts`。

**验收**

- `npm run build` 可通过（无业务行为要求）。

### 步骤 2：迁移共享基础能力

**迁移内容**

- URL 归一化、debug 状态、日志、环境对象、存储工具。

**验收**

- 控制台可看到启动日志。
- `window.__reviewerDebug` 可用。

### 步骤 3：迁移路由与生命周期

**迁移内容**

- `runOnRoute`、`installRouteWatcher`。
- 路由状态去重逻辑（`started*Href`）。

**验收**

- SPA 路由切换时，页面分支可重复进入但不重复初始化。

### 步骤 4：迁移 record（第一优先）

**迁移内容**

- JSON parse guard、TZ 拦截、UI、渲染、数据加载、补建 TZ。

**验收**

- 在 `record` 页能看到 reviewer 面板。
- 步进时候选动作同步更新。
- “高亮首选牌 / 显示权重条 / 隐藏用户信息”生效。

### 步骤 5：迁移 tech

**迁移内容**

- zumgze 计算与渲染、参考切换、CHAGA度与置信区间。

**验收**

- `tech` 页显示分析卡片，切换按钮可切换参考数据。

### 步骤 6：迁移 history + user/game

**迁移内容**

- 家访按钮、姓名匹配、链接化、MutationObserver 自动增强。

**验收**

- 两个页面都可启用/取消家访，刷新后持续生效。

### 步骤 7：清理 old.js 并收口入口

**迁移内容**

- `src/index.ts` 仅保留启动。
- 旧逻辑全部由模块入口驱动。

**验收**

- 功能无回退；`old.js` 不再作为运行依赖。

### 步骤 8：回归与文档

**迁移内容**

- 页面回归清单。
- README 增加模块结构与开发说明。

**验收**

- 构建通过 + 手工回归通过。

---

## 5. 功能覆盖映射（防漏项）

| old.js 能力 | 新模块建议 |
|---|---|
| debug 参数解析、localStorage 同步 | `shared/url.ts` + `features/debug/debug-state.ts` |
| route 判断 + runOnRoute | `app/route-runner.ts` |
| history hook/pushState hook | `app/route-watcher.ts` |
| JSON.parse guard | `features/record/guards.ts` |
| TZ hook + force create | `features/record/tz-interceptor.ts` |
| reviewer UI 构建 | `features/record/reviewer-ui.ts` |
| 候选动作展示 | `features/record/reviewer-render.ts` |
| 评测数据加载/补空 | `features/record/reviewer-data.ts` |
| zumgze 渲染和统计 | `features/tech/zumgze.ts` |
| 家访匹配 + 链接增强 | `features/history/visit-linker.ts` |

---

## 6. 风险与应对

- `unsafeWindow` 可用性差异：
  - 应对：`shared/env.ts` 提供统一 fallback，并在 `record` 提示错误。
- 第三方页面 DOM 异步渲染：
  - 应对：统一 `waitForElement`/重试工具，避免散落 `setTimeout`。
- Hook 兼容风险（`Object.defineProperty` / `Reflect.defineProperty`）：
  - 应对：保留旧逻辑顺序与兜底路径，先不改变策略。

---

## 7. 执行建议

- 每完成一个步骤即本地构建一次：`npm run build`。
- 每迁完一个页面模块就进行页面级手工回归，避免最后集中排错。
- 迁移期间保留 `old.js` 只做对照，不再新增逻辑。
