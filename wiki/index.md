# 雀渣用户高级分析工具

适用于雀渣平台的用户数据分析工具，显示用户各种详细信息，添加一些便捷功能，在牌谱回放时实时显示 CHAGA 推荐的候选打法和权重评分。

这里特别鸣谢 CHAGA 提供的看谱 API，主要代码来自 [tziakcha/reviewer-homepage](https://github.com/tziakcha/reviewer-homepage)，本项目只是写了一点简陋的显示和简单的优化，放到了油猴脚本。

## 功能

<div class="grid cards" markdown>

-   :material-arrow-left-right:{ .lg .middle } __对比玩家数据__

    ---

    查看用户和用户之间各项数据的对比

    ![comp](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/comp.png)

-   :material-calculator:{ .lg .middle } __CHAGA复盘分析__

    ---

    使用 CHAGA 的看谱 API，在牌谱回放页显示 CHAGA 推荐的候选打法和权重评分

    ![reviewer](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/reviewer.png)

-   :material-home:{ .lg .middle } __一键家访__

    ---

    能够在牌谱界面直达对方主页，查询对方信息 (需要开启雀渣会员 :material-star:)

    ![homepage](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/homepage.png)

-   :material-content-save:{ .lg .middle } __本地收藏__

    ---

    可以牌谱和小局页面直接保存内容，在收藏页管理标签、备注，并执行导入导出

    ![favorites](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/favorites.png)

</div>

## 安装

脚本支持 PC(Windows、Mac、Linux)，在 Android 上的 Edge 浏览器也能够安装，其他浏览器支持情况有待补充。

需要先安装用户脚本管理器（[Tampermonkey](https://www.tampermonkey.net/) 或 Violentmonkey）。

浏览器商店入口：

<div class="grid cards" markdown>

-   :material-microsoft-edge:{ .lg .middle } Edge 浏览器

    ---

    下载：<a href="https://microsoftedge.microsoft.com/addons/detail/%E7%AF%A1%E6%94%B9%E7%8C%B4/iikmkjmpaadaobahmlepeloendndfphd?hl=zh-CN"><img src="https://img.shields.io/badge/Microsoft-Edge%20扩展-007EC6?style=for-the-badge&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzI4MTA5MDY3MTMwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyNTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjxwYXRoIGQ9Ik0wIDBoNDg2LjU5MnY0ODYuNTkySDB6IiBmaWxsPSIjRjI1MDIyIiBwLWlkPSI0MjUxIj48L3BhdGg+PHBhdGggZD0iTTUzNy40MDggMEgxMDI0djQ4Ni41OTJINTM3LjQwOHoiIGZpbGw9IiM3RkJBMDAiIHAtaWQ9IjQyNTIiPjwvcGF0aD48cGF0aCBkPSJNMCA1MzcuNDA4aDQ4Ni41OTJWMTAyNEgweiIgZmlsbD0iIzAwQTRFRiIgcC1pZD0iNDI1MyI+PC9wYXRoPjxwYXRoIGQ9Ik01MzcuNDA4IDUzNy40MDhIMTAyNFYxMDI0SDUzNy40MDh6IiBmaWxsPSIjRkZCOTAwIiBwLWlkPSI0MjU0Ij48L3BhdGg+PC9zdmc+"></a>

-   :material-google-chrome:{ .lg .middle } Chrome 浏览器

    ---

    下载：<a href="https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN&pli=1"><img src="https://img.shields.io/badge/Chrome-Chrome%20扩展-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white"></a>

</div>


请注意：脚本需要开启插件界面 / 设置界面的 **开发人员模式**，然后在 **插件的设置** 中打开 **站点访问权限和相关使用权限**，否则会无法读取界面信息导致失效。

![dev mode](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/devmode.png)

![dev mode](https://cdn.jsdelivr.net/gh/tziakcha-stats/tziakcha-player-insights/docs/img/userdev.png)

接着访问 <a href="https://greasyfork.org/zh-CN/scripts/569766"><img src="https://img.shields.io/badge/Greasy%20Fork-569766-grey.svg?colorA=900000&style=for-the-badge"></a> 安装脚本（或直接从本仓库下载/复制 <a href="https://tziakcha-stats.github.io/tziakcha-player-insights/index.prod.user.js"><img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=github&logoColor=white"></a>）。脚本会在雀渣页面（`https://tziakcha.net/*`）自动启用。
