const {
  author,
  dependencies,
  repository,
  version,
  description,
} = require("../package.json");

module.exports = {
  name: {
    $: "tziakcha-player-insights",
    cn: "雀渣用户高级分析工具",
    en: "Tziakcha Player Insights",
  },
  icon: "https://cdn.jsdelivr.net/gh/Choimoe/chaga-reviewer-script/doc/img/icon.png",
  namespace: "https://greasyfork.org/users/1543716",
  version: version,
  author: author,
  source: repository.url,
  license: 'MIT',
  description: description,
  "description:en": description,
  match: [
    "*://tziakcha.net/*",
    "*://tziakcha.net/record/*",
    "*://tziakcha.net/user/tech/*",
    "*://tziakcha.net/history/*",
    "*://tc-api.pesiu.org/review/*"
  ],
  require: [
    // `https://cdn.jsdelivr.net/npm/jquery@${dependencies.jquery}/dist/jquery.min.js`,
  ],
  grant: ["GM.xmlHttpRequest", "unsafeWindow"],
  connect: ["httpbin.org"],
  "run-at": "document-start",
};
