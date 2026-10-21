# dsh-custom-ui-theme

界面主题自定义插件 —— DeepSeek Harness Desktop「界面主题自定义」（包名 `dsh-custom-ui-theme`，GitHub：gaopengpian/dsh-custom-ui-theme）。

## 强制工作流（每次会话必须遵守）

1. 本目录是 git 仓库（`main` 分支）。**每次修改代码完毕后必须立即 `git add -A` 并 `git commit`**，不需要用户再提醒。commit message 用 conventional commits，正文说明本次改了什么、为什么。提交后 `git push` 到 origin（GitHub）。
2. 修改 `client.js` / `index.js` 等源码后，按插件开发流程生效：
   - 在 `package.json` 里递增 `version`；
   - `plugin_manager`：`remove_bundle` → `install_bundle`（target 传本目录绝对路径）；
   - 提醒用户刷新页面验证。
3. 语法检查：修改 `client.js` 后先 `node --check client.js` 再安装。
4. 不要提交 `node_modules/`（已在 .gitignore）。

## 源码要点

- `client.js`：全部逻辑在 Client 侧。区域树 = `PRESETS`，真实 DOM 自动绑定表 = `BINDINGS`，样式生成 = `buildCss`，拾取器 = `pickElement`。
- 样式全部 `!important` 且样式表钉在 `<head>` 末尾（优先级压过其他主题插件）——改动时保持这一性质。
- 配置持久化在浏览器 `localStorage`（键 `local-dsh-custom-ui-theme/v2`），不在本仓库内。
