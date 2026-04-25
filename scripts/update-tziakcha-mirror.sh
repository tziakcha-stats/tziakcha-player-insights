#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/tziakcha-stats/tziakcha-player-insights.git"
DOCS_BRANCH="docs/dev-wiki"
ASSET_BRANCH="preview-dist"
REPO_DIR="/var/www/web/tziakcha-mirror-repo"
TARGET_DIR="/var/www/web/tziakcha"
MIRROR_USERSCRIPT_URL="https://web.choimoe.com/tziakcha/index.prod.user.js"
PIP_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"

if [ ! -d "$REPO_DIR/.git" ]; then
  git clone "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"
rm -f mkdocs.web.yml
git remote set-url origin "$REPO_URL"
git fetch origin "+refs/heads/$DOCS_BRANCH:refs/remotes/origin/$DOCS_BRANCH" "+refs/heads/$ASSET_BRANCH:refs/remotes/origin/$ASSET_BRANCH"
git checkout -B "$DOCS_BRANCH" "refs/remotes/origin/$DOCS_BRANCH"
git reset --hard "refs/remotes/origin/$DOCS_BRANCH"
git clean -fdx -e .venv/

if [ ! -x .venv/bin/python ] || [ ! -x .venv/bin/pip ]; then
  rm -rf .venv
  python3 -m venv .venv
fi

./.venv/bin/python -m ensurepip --upgrade
./.venv/bin/python -m pip install --upgrade pip
./.venv/bin/pip install -i "$PIP_INDEX_URL" -r wiki/requirements.txt
cat > mkdocs.web.yml <<'CFG'
INHERIT: mkdocs.yml

site_url: https://web.choimoe.com/tziakcha/
CFG
./.venv/bin/mkdocs build --strict -f mkdocs.web.yml

git show "origin/$ASSET_BRANCH:index.prod.user.js" > site/index.prod.user.js
mkdir -p site/preview
cp site/index.prod.user.js site/preview/index.prod.user.js

find site -type f \( -name '*.html' -o -name '*.xml' -o -name '*.json' \) -print0 | while IFS= read -r -d '' file; do
  sed -i \
    -e "s#https://tziakcha-stats.github.io/tziakcha-player-insights/index.prod.user.js#${MIRROR_USERSCRIPT_URL}#g" \
    "$file"
done

mkdir -p "$TARGET_DIR"
rsync -a --delete site/ "$TARGET_DIR"/

echo "Mirror updated at $(date '+%F %T')"
