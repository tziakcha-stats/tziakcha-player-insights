# favorites

`favorites` 包含收藏入口、收藏页、筛选、导入导出和本地存储。

## 代码分布

| 文件 | 作用 |
| --- | --- |
| `page.ts` | 收藏页 UI 主入口 |
| `storage.ts` | `localStorage` 文档读写和导入合并 |
| `filter.ts` | 标签、搜索、tab 过滤 |
| `game-entry.ts` | 对局页收藏入口 |
| `record-entry.ts` | 小局页收藏入口 |
| `nav.ts` | 导航栏入口 |
| `types.ts` | 收藏相关类型 |

## 实现

对局页和牌谱页各有一个收藏入口，都会写入同一份本地文档。收藏页读取这份文档，再做 tab、标签和关键词过滤。

```text
entry -> save -> localStorage
page -> read -> filter -> render
```

导入后的标签顺序由 `storage.ts` 中的 `normalizeTags()` 决定。写入前会执行去重、排序和长度裁剪。

## 测试

- `tests/favorites/storage.test.ts`
- `tests/favorites/filter.test.ts`
- `tests/favorites/page.test.ts`
- `tests/favorites/game-entry.test.ts`
- `tests/favorites/record-entry.test.ts`
