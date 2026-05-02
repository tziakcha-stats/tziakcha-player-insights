# 收藏数据

收藏功能的数据定义在 `src/features/favorites/types.ts`，读写在 `src/features/favorites/storage.ts`。

```json
{
  "version": 1,
  "updatedAt": "2026-04-25T10:10:10.000Z",
  "ui": {
    "activeTab": "game"
  },
  "games": [
    {
      "id": "12345",
      "type": "game",
      "sourceUrl": "https://tziakcha.net/game?id=12345",
      "title": "半庄 A",
      "summary": "有一巡立直判断可以回看",
      "tags": ["立直", "攻守"],
      "createdAt": "2026-04-25T10:10:10.000Z",
      "updatedAt": "2026-04-25T10:10:10.000Z"
    }
  ],
  "records": []
}
```

## 结构

| 字段 | 说明 |
| --- | --- |
| `ui.activeTab` | 收藏页默认 tab |
| `games` / `records` | 两类收藏列表 |
| `summary` | 备注 |
| `tags` | 写入前会去重、排序、裁剪 |
| `updatedAt` | 导入合并和列表更新时使用 |

## 实现

保存入口来自 `game-entry.ts` 和 `record-entry.ts`。页面侧保存的是 `FavoriteDraft`，写入存储后补上时间戳，形成 `FavoriteItem`。导入逻辑先清洗结构，再与本地数据合并。

```text
entry -> save(draft) -> upsertItem() -> localStorage
```

## 测试

- `tests/favorites/storage.test.ts`：读写、导入、合并、异常输入
- `tests/favorites/filter.test.ts`：筛选和标签列表
- `tests/favorites/page.test.ts`：收藏页交互
