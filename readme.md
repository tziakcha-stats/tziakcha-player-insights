<p align="center">
<img width="128px" src="docs/img/icon.png" align="center" alt="Logo" />
<h2 align="center">雀渣用户高级分析工具</h2>
<p align="center"><a href="https://github.com/tziakcha-stats/tziakcha-player-insights"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=github&logoColor=white"></a><a href="https://greasyfork.org/zh-CN/scripts/569766"><img src="https://img.shields.io/badge/Greasy%20Fork-560977-grey.svg?colorA=900000&style=for-the-bsadge"></a> </p>
<p align="center"><a href="https://github.com/tziakcha-stats/tziakcha-player-insights"><img src="https://img.shields.io/github/license/tziakcha-stats/tziakcha-player-insights?style=for-the-badge"> <img src="https://img.shields.io/github/stars/tziakcha-stats/tziakcha-player-insights?style=for-the-badge"></a> <a href="https://choimoe.github.io/chaga-reviewer-script/"><img src="https://img.shields.io/github/actions/workflow/status/tziakcha-stats/tziakcha-player-insights/deploy-pages.yml?label=deploy%20pages&style=for-the-badge"></a></p>
</p>

适用于雀渣平台的用户数据分析工具，显示用户各种详细信息，添加一些便捷功能，在牌谱回放时实时显示 CHAGA 推荐的候选打法和权重评分。

这里特别鸣谢 CHAGA 提供的看谱 API，主要代码来自 [tziakcha/reviewer-homepage](https://github.com/tziakcha/reviewer-homepage)，本项目只是写了一点简陋的显示和简单的优化，放到了油猴脚本。

![demo](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/chaga_view.jpg)

## 安装

脚本支持 PC(Windows、Mac、Linux)，在 Android 上的 Edge 浏览器也能够安装，其他浏览器支持情况有待补充。

需要先安装用户脚本管理器（[Tampermonkey](https://www.tampermonkey.net/) 或 Violentmonkey）。你可以在浏览器插件商店下载：

<a href="https://microsoftedge.microsoft.com/addons/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/iikmkjmpaadaobahmlepeloendndfphd?hl=zh-CN"><img src="https://img.shields.io/badge/Microsoft-Edge%20扩展-007EC6?style=for-the-badge&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI4MTA5MDY3MTMwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyNTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjxwYXRoIGQ9Ik0wIDBoNDg2LjU5MnY0ODYuNTkySDB6IiBmaWxsPSIjRjI1MDIyIiBwLWlkPSI0MjUxIj48L3BhdGg+PHBhdGggZD0iTTUzNy40MDggMEgxMDI0djQ4Ni41OTJINTM3LjQwOHoiIGZpbGw9IiM3RkJBMDAiIHAtaWQ9IjQyNTIiPjwvcGF0aD48cGF0aCBkPSJNMCA1MzcuNDA4aDQ4Ni41OTJWMTAyNEgweiIgZmlsbD0iIzAwQTRFRiIgcC1pZD0iNDI1MyI+PC9wYXRoPjxwYXRoIGQ9Ik01MzcuNDA4IDUzNy40MDhIMTAyNFYxMDI0SDUzNy40MDh6IiBmaWxsPSIjRkZCOTAwIiBwLWlkPSI0MjU0Ij48L3BhdGg+PC9zdmc+"></a>

<a href="https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN&pli=1"><img src="https://img.shields.io/badge/Chrome-Chrome%20扩展-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white"></a>

请注意：脚本需要开启[插件界面](edge://extensions/) / 设置界面的 **开发人员模式**，然后在 **插件的设置** 中打开 **站点访问权限和相关使用权限**，否则会无法读取界面信息导致失效！

![dev mode](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/devmode.png)



---

接着访问 <a href="https://greasyfork.org/zh-CN/scripts/569766"><img src="https://img.shields.io/badge/Greasy%20Fork-569766-grey.svg?colorA=900000&style=for-the-badge"></a> 安装脚本（或直接从本仓库下载/复制 <a href="https://tziakcha-stats.github.io/tziakcha-player-insights/index.prod.user.js"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=github&logoColor=white"></a>）。脚本会在雀渣页面（`https://tziakcha.net/*`）自动启用。

## 功能

|用户风格|一键家访|本地收藏|
|:--:|:--:|:--:|
|![style](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/tech.png)|![homepage](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/homepage.png)|![favorites](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/favorites.png)|

新增的本地收藏功能支持在牌谱与小局页面直接收藏内容，在收藏夹中管理标签、备注，并执行导入导出。

脚本在牌谱回放页面的控制面板右侧提供以下功能：

**高亮首选牌**：用红框标记 CHAGA 推荐的最优打牌选择。

**显示权重条**：在手牌上方显示柱状图，通过 Softmax 归一化后的概率分布直观展示各候选牌的权重。

**候选打法列表**：按权重降序显示所有候选操作及其评分。

**加载状态指示**：实时显示当前步数和四个座位的数据加载状态（`✓` 已加载，`·` 加载中，`✗` 加载失败）。

![controller](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/ctrl.jpg)

## 实现

脚本通过拦截雀渣平台的 `TZ` 构造函数获取游戏实例，同步当前回放步数。分析数据从 CHAGA API（`https://tc-api.pesiu.org/review/`）异步获取，包含每个回合每个座位的候选打法和权重。对于缺失的中间步数，脚本会自动填充最近的有效数据以保持连续性。
