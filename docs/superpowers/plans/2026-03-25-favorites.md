# Favorites Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local favorites system with a top-level `收藏` tab, per-page favorite entry points for `game` and `record`, tag-based filtering, and JSON import/export.

**Architecture:** Add a dedicated favorites domain with a storage-backed repository, route/hash detection, and page-specific metadata extractors. Reuse the existing route-driven feature bootstrap model so `game`, `record`, and the new favorites page each remain focused, while shared tag/filter/import logic lives in small favorites modules.

**Tech Stack:** TypeScript, Vitest, DOM-based userscript rendering, `localStorage`

---

## File Structure

- Create: `src/features/favorites/types.ts`
- Create: `src/features/favorites/storage.ts`
- Create: `src/features/favorites/filter.ts`
- Create: `src/features/favorites/route.ts`
- Create: `src/features/favorites/nav.ts`
- Create: `src/features/favorites/game-entry.ts`
- Create: `src/features/favorites/record-entry.ts`
- Create: `src/features/favorites/page.ts`
- Create: `src/features/favorites/page.less`
- Create: `tests/favorites/storage.test.ts`
- Create: `tests/favorites/filter.test.ts`
- Create: `tests/favorites/nav.test.ts`
- Create: `tests/favorites/game-entry.test.ts`
- Create: `tests/favorites/record-entry.test.ts`
- Create: `tests/favorites/page.test.ts`
- Modify: `src/shared/route.ts`
- Modify: `src/app/route-runner.ts`
- Modify: `src/features/game/index.ts`
- Modify: `src/features/record/index.ts`
- Modify: `src/style/main.less`

### Task 1: Favorites Storage And Filtering

**Files:**
- Create: `src/features/favorites/types.ts`
- Create: `src/features/favorites/storage.ts`
- Create: `src/features/favorites/filter.ts`
- Test: `tests/favorites/storage.test.ts`
- Test: `tests/favorites/filter.test.ts`

- [ ] **Step 1: Write the failing storage tests**

Cover:
- empty document defaults
- `ui.activeTab` default and persistence
- add `game` favorite
- update tags with normalization
- tag limits
- delete favorite
- import merge by `type + id`
- invalid import entries counted without mutating existing data
- JSON parse failure leaves existing data unchanged
- version migration from older document shapes
- disabled storage fallback

- [ ] **Step 2: Run storage tests to verify they fail**

Run: `npm test -- tests/favorites/storage.test.ts`
Expected: FAIL because favorites storage module does not exist yet

- [ ] **Step 3: Write the minimal storage implementation**

Implement:
- versioned favorites document
- migration to version 1 document shape
- tag normalization
- CRUD helpers
- `ui.activeTab` read/write helpers
- import/export helpers
- storage availability guard

- [ ] **Step 4: Run storage tests to verify they pass**

Run: `npm test -- tests/favorites/storage.test.ts`
Expected: PASS

- [ ] **Step 5: Write the failing filter tests**

Cover:
- active tab filtering
- all-selected-tag matching
- case-insensitive substring search over title, summary, tags
- empty search behavior

- [ ] **Step 6: Run filter tests to verify they fail**

Run: `npm test -- tests/favorites/filter.test.ts`
Expected: FAIL because filter module does not exist yet

- [ ] **Step 7: Write the minimal filter implementation**

Implement pure helpers for:
- collecting visible items by tab
- deriving tag list for current tab
- applying tag and search filters

- [ ] **Step 8: Run filter tests to verify they pass**

Run: `npm test -- tests/favorites/filter.test.ts`
Expected: PASS

### Task 2: Favorites Route And Navigation

**Files:**
- Create: `src/features/favorites/route.ts`
- Create: `src/features/favorites/nav.ts`
- Test: `tests/favorites/nav.test.ts`
- Modify: `src/shared/route.ts`
- Modify: `src/app/route-runner.ts`

- [ ] **Step 1: Write the failing navigation tests**

Cover:
- detects `#reviewer-favorites`
- injects a single `收藏` nav item
- keeps injection idempotent across repeated route runs

- [ ] **Step 2: Run navigation tests to verify they fail**

Run: `npm test -- tests/favorites/nav.test.ts`
Expected: FAIL because route and nav helpers are missing

- [ ] **Step 3: Write the minimal route and nav implementation**

Implement:
- hash route detection
- top-nav injection with stable element id
- `runOnRoute` branch for favorites page

- [ ] **Step 4: Run navigation tests to verify they pass**

Run: `npm test -- tests/favorites/nav.test.ts`
Expected: PASS

### Task 3: Game Favorite Entry

**Files:**
- Create: `src/features/favorites/game-entry.ts`
- Test: `tests/favorites/game-entry.test.ts`
- Modify: `src/features/game/index.ts`

- [ ] **Step 1: Write the failing game entry tests**

Cover:
- parses `game` id from URL
- inserts favorite button once
- skips rendering when a stable `game` id cannot be parsed
- shows disabled state when storage unavailable
- saves normalized tags and toggles to `已收藏`

- [ ] **Step 2: Run game entry tests to verify they fail**

Run: `npm test -- tests/favorites/game-entry.test.ts`
Expected: FAIL because game favorite entry module does not exist yet

- [ ] **Step 3: Write the minimal game entry implementation**

Implement:
- page metadata extraction from URL and DOM
- small tag editor UI
- repository integration
- idempotent insertion in the existing game page

- [ ] **Step 4: Run game entry tests to verify they pass**

Run: `npm test -- tests/favorites/game-entry.test.ts`
Expected: PASS

### Task 4: Record Favorite Entry

**Files:**
- Create: `src/features/favorites/record-entry.ts`
- Test: `tests/favorites/record-entry.test.ts`
- Modify: `src/features/record/index.ts`

- [ ] **Step 1: Write the failing record entry tests**

Cover:
- parses `record` id from URL
- inserts favorite control into reviewer area once
- skips rendering when a stable `record` id cannot be parsed
- handles delayed reviewer container availability
- saves tags and reflects favorite state

- [ ] **Step 2: Run record entry tests to verify they fail**

Run: `npm test -- tests/favorites/record-entry.test.ts`
Expected: FAIL because record favorite entry module does not exist yet

- [ ] **Step 3: Write the minimal record entry implementation**

Implement:
- page metadata extraction
- retry-based mounting into review controls
- same tag editor and repository workflow as `game`

- [ ] **Step 4: Run record entry tests to verify they pass**

Run: `npm test -- tests/favorites/record-entry.test.ts`
Expected: PASS

### Task 5: Favorites Page UI, Import, And Export

**Files:**
- Create: `src/features/favorites/page.ts`
- Create: `src/features/favorites/page.less`
- Test: `tests/favorites/page.test.ts`
- Modify: `src/style/main.less`
- Modify: `src/app/route-runner.ts`

- [ ] **Step 1: Write the failing favorites page tests**

Cover:
- renders favorites page on hash route
- switches between `对局收藏` and `小局收藏`
- persists last active sub-tab through `ui.activeTab`
- filters by selected tags and search input
- exports JSON
- imports JSON and reports merged result
- shows invalid import counts and keeps prior data on parse failure
- shows unavailable state when storage is disabled

- [ ] **Step 2: Run page tests to verify they fail**

Run: `npm test -- tests/favorites/page.test.ts`
Expected: FAIL because favorites page module does not exist yet

- [ ] **Step 3: Write the minimal favorites page implementation**

Implement:
- page root rendering
- toolbar, sub-tabs, tag chips, list items, empty states
- import file picker and export blob download
- integration with repository and filter helpers

- [ ] **Step 4: Run page tests to verify they pass**

Run: `npm test -- tests/favorites/page.test.ts`
Expected: PASS

### Task 6: Full Verification

**Files:**
- Test: `tests/favorites/storage.test.ts`
- Test: `tests/favorites/filter.test.ts`
- Test: `tests/favorites/nav.test.ts`
- Test: `tests/favorites/game-entry.test.ts`
- Test: `tests/favorites/record-entry.test.ts`
- Test: `tests/favorites/page.test.ts`
- Test: `tests/game/index.test.ts`
- Test: `tests/record/reviewer-render.test.ts`

- [ ] **Step 1: Run focused favorites and touched regression tests**

Run: `npm test -- tests/favorites/storage.test.ts tests/favorites/filter.test.ts tests/favorites/nav.test.ts tests/favorites/game-entry.test.ts tests/favorites/record-entry.test.ts tests/favorites/page.test.ts tests/game/index.test.ts tests/record/reviewer-render.test.ts`
Expected: PASS

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Review changed files for accidental scope creep**

Run: `git diff --stat`
Expected: Only favorites feature, route wiring, and related tests/styles changed
