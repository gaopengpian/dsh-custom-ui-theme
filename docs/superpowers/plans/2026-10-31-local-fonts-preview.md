# 本机字体列表与实时预览实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在全局和区域字体控件中列出授权可用的本机字体，并提供悬浮临时预览、点击应用。

**Architecture:** 在现有 `client.js` 字体控件中以明确按钮触发 `queryLocalFonts()`，在运行时按字体 family 去重并排序；用自定义列表呈现字体项。预览通过短暂注入的样式作用于全局或区域选择器，清理时不触碰持久配置；点击后才调用现有 `onChange`。API 不可用或失败时回退现有预设。

**Tech Stack:** JavaScript、React、Chromium Local Font Access API、CSS。

**Spec:** `docs/superpowers/specs/2026-10-31-local-fonts-preview-design.md`

## Global Constraints

- 不增加依赖；字体清单只保存在当前组件运行时，不写入 `localStorage`。
- 只有用户显式点击加载操作时调用 `queryLocalFonts()`。
- 悬浮预览不可修改 `s` 或触发 `onChange`；离开、关闭和卸载时移除临时样式。
- 保持插件样式 `!important` 与样式表置于 `<head>` 末尾的既有行为。
- `client.js` 修改后先运行 `node --check client.js`。
- 将 `package.json` 版本从 `2.7.4` 递增到 `2.7.5`，然后按 `plugin_manager` 的 `remove_bundle` → `install_bundle` 顺序重装本仓库绝对路径。

## Review Focus

- API 不存在或拒绝授权：保留并显示现有预设，控件仍可用。
- API 请求重复返回同一 family：列表中每个 family 只显示一次且排序稳定。
- 字体 family 含引号、反斜杠等 CSS 特殊字符：设置后 CSS 仍合法，不可注入额外声明。
- 区域当前没有匹配元素或绑定变化：预览不抛错，关闭后不遗留样式。
- 列表在悬浮期间关闭或组件卸载：预览立即清理，持久设置不被预览覆盖。

---

### Task 1: 扩展字体选择器并加入实时预览

**Files:**
- Modify: `client.js` (`FontSelect`、字体弹层调用方及其预览清理逻辑)
- Modify: `package.json`（版本号）

**Interfaces:**
- Consumes: 现有 `FontSelect({ value, onChange })`、全局字体 `s.font.family`、区域字体 `n.style.family`、`resolveNodes()`、`ATTR`、`PANEL_CLS`。
- Produces: 同一字体选择器在全局和区域场景下使用相同的受控选择接口；字体 family 以安全 CSS 值传给既有 `onChange`，默认项传 `null`。

- [ ] **Step 1: 实现本机字体读取和回退状态**

在用户点击加载按钮的事件处理器中检测并调用 `window.queryLocalFonts()`。将返回的字体记录按 `family` 去重并排序；成功、空结果、API 不支持和异常/拒绝分别显示可理解的状态，失败时列出原有 `FONT_CHOICES`。

- [ ] **Step 2: 用自定义可悬浮列表替换原生字体 `<select>`**

字体项显示 family 名称并以该字体渲染自身样例。悬停调用预览逻辑，点击才调用 `onChange`；保留默认选项以及原有预设的可选性。预览 family 使用 CSS 字符串转义后再写入样式。

- [ ] **Step 3: 实现全局/区域范围的临时预览与清理**

全局选择器预览宿主页面字体，区域选择器预览对应 `data-dsh-ui-theme` 节点及其内容，并排除插件面板。移出字体项、关闭选择器和组件卸载时清除预览样式；不得改变已保存字体。

- [ ] **Step 4: 递增插件版本并做静态检查**

将 `package.json` 版本改为 `2.7.5`。运行 `node --check client.js`，预期退出码为 0；检查 diff，确认只有字体选择实现和版本号改动。

- [ ] **Step 5: 安装插件并完成运行验收**

通过 `plugin_manager` 依次执行 `remove_bundle`、`install_bundle`，安装目标为本仓库绝对路径。刷新页面后检查：授权成功显示本机字体、重复 family 只出现一次；全局及区域悬浮分别预览且移开/关闭后恢复；点击后字体保持；拒绝授权或 API 不可用时回退预设；无匹配区域及特殊字符 family 不导致异常或残留样式。

- [ ] **Step 6: 提交并推送实现变更**

检查 `git diff` 和 `git status`，按 Conventional Commits 提交本次 `client.js` 与 `package.json` 变更，然后推送 `origin`。页面刷新验证尚需用户完成时，明确提醒用户。
