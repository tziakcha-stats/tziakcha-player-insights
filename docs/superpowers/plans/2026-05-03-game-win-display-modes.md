# Game Win Display Modes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/game` 牌谱页为和牌信息新增三态显示模式，默认显示“番种备注”，并支持切换到“和牌详细”或“原始样式”。

**Architecture:** 继续复用现有 `RoundOutcome` 数据，不改动 `CHAGA` 和一致率逻辑。把和牌 UI 增强抽象成统一的模式渲染入口，集中负责模式切换控件、备注列、下拉详情与浮层的增删及清理，再由 `initGameFeature` 在数据准备完成后驱动渲染。

**Tech Stack:** TypeScript, Vitest, JSDOM, userscript DOM rendering

---

### Task 1: 为三态模式与备注规则补充失败测试

**Files:**
- Modify: `tests/game/ui-render.test.ts`
- Modify: `src/features/game/ui-render.ts`
- Test: `tests/game/ui-render.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
it("defaults to remark mode and renders a single remark column", () => {});
it("switches between remark/detail/original modes and cleans up DOM", () => {});
it("renders 荒庄 for rounds without winners", () => {});
it("shows only the max-fan remark and truncates long content", () => {});
it("opens one floating detail popover and closes it manually", async () => {});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/game/ui-render.test.ts`
Expected: FAIL because new mode controller APIs and remark UI do not exist yet.

- [ ] **Step 3: Write minimal implementation hooks**

```ts
export function installRoundWinDisplayModes(rounds: RoundOutcome[]): void {}
```

- [ ] **Step 4: Run test to verify the failure moved forward**

Run: `npx vitest run tests/game/ui-render.test.ts`
Expected: FAIL on missing behavior assertions rather than missing symbol errors.

- [ ] **Step 5: Commit**

```bash
git add tests/game/ui-render.test.ts src/features/game/ui-render.ts
git commit -m "test: 补充牌谱和牌显示模式测试"
```

### Task 2: 实现模式状态、切换控件和 DOM 清理

**Files:**
- Modify: `src/features/game/ui-render.ts`
- Modify: `src/features/game/index.ts`
- Test: `tests/game/ui-render.test.ts`

- [ ] **Step 1: Write the next failing test**

```ts
it("persists the selected mode and restores it on rerender", () => {});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/game/ui-render.test.ts`
Expected: FAIL because mode persistence and rerender behavior do not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
type RoundWinDisplayMode = "remark" | "detail" | "original";

function readRoundWinDisplayMode(): RoundWinDisplayMode {}
function writeRoundWinDisplayMode(mode: RoundWinDisplayMode): void {}
function clearRoundWinEnhancements(): void {}
function renderRoundWinModeSwitcher(...): void {}
export function installRoundWinDisplayModes(rounds: RoundOutcome[]): void {}
```

- [ ] **Step 4: Wire the game entrypoint**

```ts
installRoundWinDisplayModes(rounds);
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/game/ui-render.test.ts`
Expected: PASS for mode switching and persistence tests.

- [ ] **Step 6: Commit**

```bash
git add src/features/game/index.ts src/features/game/ui-render.ts tests/game/ui-render.test.ts
git commit -m "feat: 添加牌谱和牌显示模式切换"
```

### Task 3: 实现番种备注列与浮层详情

**Files:**
- Modify: `src/features/game/ui-render.ts`
- Test: `tests/game/ui-render.test.ts`

- [ ] **Step 1: Write the next failing tests**

```ts
it("shows the highest-count fan name as the remark", () => {});
it("uses the first fan item when max count ties", () => {});
it("does not open a popover for 荒庄", () => {});
it("auto closes the popover after five seconds", async () => {});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/game/ui-render.test.ts`
Expected: FAIL because remark selection and popover lifecycle are incomplete.

- [ ] **Step 3: Write minimal implementation**

```ts
function buildRoundRemark(round: RoundOutcome): string {}
function createRemarkCell(round: RoundOutcome): HTMLTableCellElement {}
function openRoundRemarkPopover(...): void {}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/game/ui-render.test.ts`
Expected: PASS for remark and popover tests.

- [ ] **Step 5: Commit**

```bash
git add src/features/game/ui-render.ts tests/game/ui-render.test.ts
git commit -m "feat: 添加牌谱番种备注与浮层详情"
```

### Task 4: 回归验证与完整测试

**Files:**
- Modify: `src/features/game/ui-render.ts`
- Modify: `tests/game/ui-render.test.ts`

- [ ] **Step 1: Run targeted UI tests**

Run: `npx vitest run tests/game/ui-render.test.ts`
Expected: PASS

- [ ] **Step 2: Run related game tests**

Run: `npx vitest run tests/game/index.test.ts tests/game/win-info.test.ts tests/game/data-metrics.test.ts`
Expected: PASS

- [ ] **Step 3: Run full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 4: Make only minimal follow-up fixes if a regression appears**

```ts
// Adjust selectors or cleanup logic only if tests expose a regression.
```

- [ ] **Step 5: Commit**

```bash
git add src/features/game/ui-render.ts src/features/game/index.ts tests/game/ui-render.test.ts
git commit -m "test: 验证牌谱和牌显示模式回归"
```
