# 国内镜像部署

国内镜像站点部署在：

- `https://web.choimoe.com/tziakcha/`

## 结构

- 上游分支：`docs/dev-wiki`
- userscript 产物分支：`preview-dist`
- 服务器静态目录：`/var/www/web/tziakcha`
- 服务器仓库目录：`/var/www/web/tziakcha-mirror-repo`
- 服务器同步脚本：`/usr/local/bin/update-tziakcha-mirror.sh`

## nginx

`web.choimoe.com` 站点下新增了两个 location：

```nginx
location = /tziakcha {
    return 301 /tziakcha/;
}

location /tziakcha/ {
    alias /var/www/web/tziakcha/;
    index index.html;
    try_files $uri $uri/ /tziakcha/index.html;
}
```

## 构建方式

服务器直接拉取仓库并构建镜像版本，不依赖 GitHub Pages 成品同步。

镜像构建使用：

```bash
mkdocs build --strict -f mkdocs.web.yml
```

`mkdocs.web.yml` 将站点 base path 固定到 `/tziakcha/`。

## 手动更新

```bash
ssh root@8.146.201.177 '/usr/local/bin/update-tziakcha-mirror.sh'
```

## 定时更新

root crontab 中应保留一条同步任务，例如：

```cron
*/30 * * * * /usr/local/bin/update-tziakcha-mirror.sh >> /var/log/tziakcha-mirror.log 2>&1
```

## 排障

如果镜像站页面可打开但资源 404，优先检查：

1. `mkdocs.web.yml` 的 `site_url`
2. `nginx` 中 `/tziakcha/` 的 `alias`
3. `/var/www/web/tziakcha` 目录内容是否为最新构建结果

如果镜像站首页可打开但 userscript 链接异常，检查：

1. `preview-dist` 分支是否包含 `index.prod.user.js`
2. 同步脚本中的 `git show origin/preview-dist:index.prod.user.js`
