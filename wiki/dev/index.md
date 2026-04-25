# 开发指南

## 常用命令

=== "脚本"

    ```bash
    npm ci
    npm test
    npm run build
    ```

=== "文档"

    ```bash
    python -m pip install -r requirements-docs.txt
    mkdocs serve
    mkdocs build --strict
    ```

## 新增 feature

新增页面功能时，通常会改这些位置：

```text
src/shared/route.ts
src/features/<name>/
src/app/route-runner.ts
tests/<name>/
wiki/modules/
```

## 构建和发布

构建入口在 `config/webpack.config.*.cjs`。CI 跑测试和构建，`deploy-preview.yaml` 发布预览脚本，`deploy-pages.yml` 发布 Wiki 和 `index.prod.user.js`。

## 测试

测试目录和源码目录基本对应。

| 源码 | 测试 |
| --- | --- |
| `src/features/favorites` | `tests/favorites` |
| `src/features/game` | `tests/game` |
| `src/features/record` | `tests/record` |
| `src/features/tech` | `tests/tech` |
| `src/shared` | `tests/shared` |
