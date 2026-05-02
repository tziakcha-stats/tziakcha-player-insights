# 项目协作约束

## 语言与输出

- 与用户的对话输出默认使用中文。
- 面向项目的文档默认使用中文，包括 `README`、`docs/`、设计文档、计划文档。
- 代码注释默认使用英文。

## Git 提交

- Git commit message 默认使用中文。
- 默认采用 Conventional Commits 风格。
- 提交信息尽量贴近目标仓库已有提交历史与措辞风格。
- 默认采用 `type: 中文描述` 的格式，例如：`feat: 添加牌局概览面板`、`test: 补充指标计算测试`。
- 提交前先查看最近几条 commit，措辞、粒度和前缀尽量与仓库历史保持一致。

## 默认工作流

- 只要任务涉及功能设计、行为修改、写代码或改代码，默认优先按以下流程执行，除非用户在当前对话中明确要求跳过或调整。
- 先使用 `brainstorming` 与用户讨论实现方式、边界条件和细节，先完成设计确认，再进入实现。
- 设计确认后，优先创建隔离分支和独立工作区再开始实现。
- 如果 `using-git-worktrees` skill 可用，优先使用该 skill。
- 如果对应 skill 不可用，则直接使用原生 `git worktree` 创建隔离工作区，不要因为缺少 skill 而跳过隔离工作区步骤。
- 然后使用 `writing-plans` 编写具体执行计划。
- 最后使用 `test-driven-development` 按 TDD 流程逐步实现。

## Worktree 协作

- 默认不要直接在主工作区上开展持续性的实现任务，优先新建 branch/worktree。
- branch 名称应简洁且能表达任务目的，例如：`feat/session-summary`、`fix/review-timeout`、`test/metrics-ci`。
- worktree 路径应明确区分用途，避免多个任务共用同一目录。
- 多 agent 并行协作时，每个 agent 应独占一个 branch/worktree，避免在同一工作区交叉修改。
- 非必要不要在不同 agent 之间共享未提交改动；需要协作时，优先通过 commit 进行同步。
- 完成后再根据需要整理 commit、合并分支，避免把试验性改动长期堆在主工作区。

## 优先级

- 当前对话里的用户明确要求高于本文件。
- 更具体的子目录级 `AGENTS.md` 可以在其作用域内补充更细规则，但不应违背用户明确要求。
