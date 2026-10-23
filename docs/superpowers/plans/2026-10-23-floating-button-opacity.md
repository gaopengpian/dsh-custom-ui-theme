# 悬浮主题按钮透明度实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 悬浮主题按钮未悬停时为 50% 透明，鼠标悬停时完全不透明。

**Architecture:** 在现有 `entryBtn` React 组件中记录悬停状态，并将状态映射到行内 `opacity`；保持点击、拖拽和定位逻辑不变。更新插件版本后按本地插件开发流程重装。

**Tech Stack:** JavaScript、React、插件管理器。

**Spec:** `docs/superpowers/specs/2026-10-23-floating-button-opacity-design.md`

## Global Constraints

- 仅改悬浮入口按钮的透明度行为。
- `client.js` 修改后先运行 `node --check client.js`。
- 递增 `package.json` 版本，再执行 `plugin_manager` 的 `remove_bundle` → `install_bundle`；安装目标为本仓库绝对路径。
- 验证后按仓库约定提交并推送；提醒用户刷新页面验证。

## Review Focus

- 指针移入/移出时分别达到 `opacity: 1` / `opacity: 0.5`；由同一按钮悬停状态控制。
- 拖动、点击打开/关闭面板行为不被新悬停处理器拦截。

---

### Task 1: 更新悬浮入口透明度

**Files:**
- Modify: `client.js` 中 `entryBtn` 声明与悬停状态
- Modify: `package.json` 版本号

**Interfaces:**
- Consumes: 现有 `entryBtn`、`dragging` 和 `open` 状态。
- Produces: 悬停时完全不透明、未悬停时半透明的入口按钮。

- [ ] 在按钮组件中添加悬停状态，并挂接鼠标进入/离开处理器。
- [ ] 将该状态映射为 `opacity: 1` 或 `opacity: 0.5`，保留其他按钮事件与样式。
- [ ] 将 `package.json` 版本从 `2.7.2` 递增到 `2.7.3`。
- [ ] 运行 `node --check client.js`，预期退出码为 0。
- [ ] 通过 `plugin_manager` 依次移除并安装 bundle；安装路径使用本仓库绝对路径。检查工具返回成功。
- [ ] 检查 diff，提交并推送；告知用户刷新页面验证悬停和移出效果。
