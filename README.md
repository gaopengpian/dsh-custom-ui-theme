# dsh-custom-ui-theme

界面主题自定义插件 —— 按界面区域逐项配置背景、边框、文本样式，覆盖 DeepSeek Harness Desktop 的几乎全部元素。

Customize the look of DeepSeek Harness Desktop region by region: background, border, and text styles (font family / size / weight) for the sidebar, brand, workspaces, session list, conversation, composer, panels and more — highest-priority styles that override other theme plugins.

## 功能 / Features

- **区域树自动绑定**：预设区域基于宿主真实 DOM（`data-slot`、`data-row-key`、`data-chat-flow-kind`、`data-dockkit-*` 等稳定属性）自动识别并持续重绑，无需手动操作。
- **每区域三项样式**：背景色 · 边框（色/宽度/圆角）· 文本（颜色/字体/字号/字重）。悬浮行内按钮弹出调节面板。
- **元素拾取器**：任意区域可点「选取」手动改绑界面上的任何元素；拾取期间插件界面自动隐藏，Esc 或再点一次取消。
- **优先级最高**：全部规则带 `!important` 且样式表钉在 `<head>` 末尾，压过其他主题插件。
- **全局令牌层**：可覆盖宿主 `--dsw-alias-*` 主题令牌（文本/背景/链接/品牌色）与全局字体设置，未设置项完全跟随宿主主题（含明暗切换）。

## 安装 / Install

```
dsh plugin --profile web add gaopengpian/dsh-custom-ui-theme
```

或在 dsh-market（插件市场）中搜索 **界面主题自定义** 一键安装。

安装后刷新页面，右下角出现「◐ 主题」悬浮按钮即入口。

## 使用 / Usage

1. 打开「◐ 主题」面板，展开区域树（如 左侧边栏 → 顶部品牌名称）；
2. 行名右侧有 选取 / 背景 / 边框 / 文本 四个按钮：「选取」点击即进入拾取模式；其余三个悬浮弹出对应调节面板；
3. 行名悬浮可查看自动绑定的选择器与匹配数，支持「恢复自动」「清除选取」；
4. 底部固定栏：「新增自定义区域」（挂在最近悬浮的行下，用选取绑定）·「全部重置」。

配置保存在浏览器 localStorage，刷新不丢；删除插件即完全还原宿主样式。

## 开发 / Development

```
git clone https://github.com/gaopengpian/dsh-custom-ui-theme
cd dsh-custom-ui-theme
dsh plugin --profile <your-profile> add <this-dir>   # 本地 link 安装
```

全部逻辑在 `client.js`（Harness Client 半侧，`window.__ModuleLoader__.load` 懒工厂；宿主只导出的空 `apply()` 在 `index.js`）。关键结构：`PRESETS` 区域树、`BINDINGS` 自动绑定表、`buildCss` 样式生成、`pickElement` 拾取器。

## License

MIT
