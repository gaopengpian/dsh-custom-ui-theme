// Client half of the Custom UI Theme bundle (v2.3).
// Region tree auto-bound to the real Harness DOM. Each row shows four
// hover-popover buttons: Pick / Background / Border / Text. Picking hides
// the panel; Esc, hint-bar click or the Theme button cancel a pick. The
// reset bar is sticky at the panel bottom. All rules are !important and
// the stylesheet is pinned last in <head>, overriding other theme plugins.

window.__ModuleLoader__.load({
  id: 'dsh-custom-ui-theme',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const STORAGE_KEY = 'local-dsh-custom-ui-theme/v2';
    const PANEL_CLS = 'dsh-cut-panel';
    const ATTR = 'data-dsh-ui-theme';

    const ZH = (navigator.language || '').toLowerCase().startsWith('zh');
    const STR = ZH
      ? {
          entry: '主题',
          title: '界面主题自定义',
          hint: '预设区域自动绑定界面元素；悬浮「选取/背景/边框/文本」按钮调出调节面板。样式带最高优先级，覆盖其他主题插件。',
          global: '全局（主题令牌与字体）',
          pick: '选取',
          bg: '背景',
          border: '边框',
          text: '文本',
          repick: '重新选取',
          auto: '恢复自动',
          clearSel: '清除选取',
          picking: '点击要样式的元素（Esc / 点此取消）',
          matched: (n) => '匹配 ' + n,
          unbound: '未匹配（可手动选取）',
          customNotBound: '自定义区域需先选取绑定',
          badSel: '选择器无效',
          addRegion: '新增自定义区域',
          removeNode: '删除此区域',
          resetAll: '全部重置',
          close: '关闭',
          fBorder: '边框色',
          fBorderW: '边框宽',
          fRadius: '圆角',
          fText: '文字色',
          fFamily: '字体',
          fSize: '字号 px',
          fWeight: '字重',
          follow: '默认',
          inherit: '默认',
          clear: '清除',
          autoRefresh: '修改后自动刷新页面',
          view: '查看',
          selectorTitle: 'CSS 选择器',
          effective: '实际生效',
          invalid: '选择器无效',
          matchedLabel: '匹配数',
          hoverPreview: '悬浮可高亮匹配的元素',
          apply: '应用',
          renameHint: '双击可重命名',
          tokensHint: '覆盖宿主主题令牌，影响所有引用该令牌的区域；适合整体换色。',
          textPrimary: '主要文本',
          textSecondary: '次要文本',
          textTertiary: '三级文本',
          link: '链接',
          brand: '品牌强调色',
          bgBase: '全局底色',
          bgLayer1: '一级面',
          bgLayer2: '二级面',
          bgOverlay: '弹层/菜单',
          groupText: '文本颜色',
          groupBg: '背景颜色',
          fonts: {
            default: '默认',
            system: '系统无衬线',
            serif: '衬线',
            mono: '等宽',
            kaiti: '楷体',
            yahei: '微软雅黑',
            songti: '宋体',
          },
          weights: { inherit: '默认', normal: '常规', medium: '中等', semibold: '半粗', bold: '加粗' },
        }
      : {
          entry: 'Theme',
          title: 'UI Theme Customizer',
          hint: 'Preset regions auto-bind to real elements; hover Pick / Background / Border / Text for controls. Highest priority: overrides other theme plugins.',
          global: 'Global (tokens & typography)',
          pick: 'Pick',
          bg: 'Bg',
          border: 'Border',
          text: 'Text',
          repick: 'Re-pick',
          auto: 'Back to auto',
          clearSel: 'Clear pick',
          picking: 'Click the element to style (Esc / click here to cancel)',
          matched: (n) => n + ' matched',
          unbound: 'No match (pick manually)',
          customNotBound: 'Custom region: pick to bind',
          badSel: 'Invalid selector',
          addRegion: 'Add custom region',
          removeNode: 'Remove region',
          resetAll: 'Reset all',
          close: 'Close',
          fBg: 'Background',
          fBorder: 'Border color',
          fBorderW: 'Width',
          fRadius: 'Radius',
          fText: 'Text color',
          fFamily: 'Font',
          fSize: 'Size px',
          fWeight: 'Weight',
          follow: 'Default',
          inherit: 'Default',
          clear: 'Clear',
          autoRefresh: 'Auto-refresh page after changes',
          view: 'View',
          selectorTitle: 'CSS selector',
          effective: 'Effective',
          invalid: 'Invalid selector',
          matchedLabel: 'Matches',
          hoverPreview: 'Hover to highlight matched elements',
          apply: 'Apply',
          renameHint: 'Double click to rename',
          tokensHint: 'Override host theme tokens; affects every area referencing them.',
          textPrimary: 'Primary text',
          textSecondary: 'Secondary text',
          textTertiary: 'Tertiary text',
          link: 'Link',
          brand: 'Brand accent',
          bgBase: 'Base background',
          bgLayer1: 'Layer 1',
          bgLayer2: 'Layer 2',
          bgOverlay: 'Overlay / menu',
          groupText: 'Text colors',
          groupBg: 'Backgrounds',
          fonts: {
            default: 'Default',
            system: 'System sans',
            serif: 'Serif',
            mono: 'Monospace',
            kaiti: 'KaiTi',
            yahei: 'Microsoft YaHei',
            songti: 'SimSun',
          },
          weights: { inherit: 'Default', normal: 'Normal', medium: 'Medium', semibold: 'Semibold', bold: 'Bold' },
        };

    // [id, parent, labelZh, labelEn]
    const PRESETS = [
      ['global', null, STR.global, STR.global],
      ['sidebar', null, '左侧边栏', 'Left sidebar'],
      ['sidebar.brandIcon', 'sidebar', '顶部品牌图标', 'Brand icon'],
      ['sidebar.brandText', 'sidebar', '顶部品牌名称', 'Brand wordmark'],
      ['sidebar.collapse', 'sidebar', '侧边栏收起按钮', 'Sidebar collapse button'],
      ['sidebar.newChat', 'sidebar', '新会话按钮', 'New chat button'],
      ['sidebar.globalPanel', 'sidebar', '全局面板', 'Global panel'],
      ['sidebar.panelIcon', 'sidebar.globalPanel', '面板入口图标', 'Panel entry icons'],
      ['sidebar.panelText', 'sidebar.globalPanel', '面板入口文本', 'Panel entry labels'],
      ['sidebar.workspace', 'sidebar', '工作区', 'Workspace area'],
      ['sidebar.workspaceHeader', 'sidebar.workspace', '工作区标题行', 'Workspace header'],
      ['sidebar.workspaceIcon', 'sidebar.workspace', '工作区图标', 'Workspace icon'],
      ['sidebar.workspaceText', 'sidebar.workspace', '工作区文本', 'Workspace text'],
      ['sidebar.workspaceTasks', 'sidebar.workspace', '工作区任务', 'Task/session list'],
      ['sidebar.taskIcon', 'sidebar.workspaceTasks', '任务行首图标', 'Task leading icon'],
      ['sidebar.taskText', 'sidebar.workspaceTasks', '任务文本', 'Task text'],
      ['sidebar.taskTime', 'sidebar.workspaceTasks', '任务时间', 'Task time'],
      ['sidebar.footer', 'sidebar', '侧边栏底部', 'Sidebar footer'],
      ['conversation', null, '对话区', 'Conversation'],
      ['conversation.header', 'conversation', '会话顶栏', 'Session header'],
      ['conversation.title', 'conversation.header', '会话标题', 'Session title'],
      ['conversation.tabs', 'conversation.header', '对话/轨迹标签', 'Chat/trace tabs'],
      ['conversation.userMsg', 'conversation', '用户消息', 'User message'],
      ['conversation.assistantMsg', 'conversation', '助手消息', 'Assistant message'],
      ['conversation.toolRow', 'conversation', '工具调用行', 'Tool call row'],
      ['conversation.codeBlock', 'conversation', '代码块', 'Code block'],
      ['composer', null, '输入框（卡片）', 'Composer card'],
      ['composer.input', 'composer', '输入区域', 'Input area'],
      ['composer.toolbar', 'composer', '工具栏', 'Toolbar'],
      ['composer.send', 'composer', '发送按钮', 'Send button'],
      ['composer.stats', 'composer', '状态胶囊', 'Stat pills'],
      ['rightPanel', null, '右侧面板', 'Right panel'],
      ['rightPanel.tabs', 'rightPanel', '面板标签栏', 'Panel tab strip'],
      ['rightPanel.body', 'rightPanel', '面板内容', 'Panel surface'],
      ['bottomBar', null, '底部面板', 'Bottom panel'],
      ['custom', null, '自定义', 'Custom'],
    ];

    // Container that owns every user-created region; regions are its children.
    const CUSTOM_ROOT = 'custom';
    // Prefix of user-created region ids. Kept explicit so old configs that stored
    // custom regions under other parents still load and get re-parented.
    const CUSTOM_PREFIX = 'custom:';

    // nodeId -> candidate selectors (first non-empty wins). Based on the real
    // Harness desktop DOM: data-slot holes, data-row-key prefixes,
    // data-chat-flow-kind, data-dockkit-*, stable aria attributes.
    const BINDINGS = {
      sidebar: ['div[data-dsh-glass-sidebar-root]', '[data-slot="sidebar"] > div'],
      'sidebar.brandIcon': ['[data-slot="sidebar.brand.mark"] svg', '[data-slot="sidebar"] [class*="logoRow"] svg'],
      'sidebar.brandText': ['[data-slot="sidebar.brand.name"] svg', '[data-slot="sidebar"] [class*="brandName"] svg'],
      'sidebar.collapse': ['[data-slot="sidebar"] [class*="logoRow"] button[class*="toggle"]', '[data-slot="sidebar"] button[aria-keyshortcuts="Control+B"]'],
      'sidebar.newChat': ['button[class*="newSession"]', '[data-slot="sidebar"] button[data-dsh-glass-surface]'],
      'sidebar.globalPanel': ['nav[aria-label="全局面板"]', 'nav[class*="panelList"]'],
      'sidebar.panelIcon': ['nav[class*="panel" i] button span[aria-hidden="true"] svg'],
      'sidebar.panelText': ['nav[class*="panel" i] button [class*="panelTitle"]'],
      'sidebar.workspace': ['[data-slot="sidebar.workspaces"] > div'],
      'sidebar.workspaceHeader': ['[data-slot="sidebar.workspaces"] [class*="sectionHeader"]'],
      'sidebar.workspaceIcon': ['div[data-row-key^="workspace:"] [class*="folder"] svg'],
      'sidebar.workspaceText': ['div[data-row-key^="workspace:"] [class*="projectText"]'],
      'sidebar.workspaceTasks': ['[data-slot="sidebar.workspaces"] div[role="tree"]'],
      'sidebar.taskIcon': ['div[data-row-key^="session:"] span[class*="slot"] svg', 'div[data-row-key^="session:"] [class*="rowActions"] svg'],
      'sidebar.taskText': ['div[data-row-key^="session:"] [class*="title"]'],
      'sidebar.taskTime': ['div[data-row-key^="session:"] [class*="time"]'],
      'sidebar.footer': ['[data-slot="sidebar"] [class*="footArea"]'],
      conversation: ['[data-slot="main.conversation"] > div'],
      'conversation.header': ['[data-slot="conversation.header"] header', 'header[data-window-drag]'],
      'conversation.title': ['[class*="crumbCurrent"]', '[data-slot="conversation.session.header"] [class*="crumbs"] span'],
      'conversation.tabs': ['[data-conversation-tabs]'],
      'conversation.userMsg': ['[data-chat-flow-kind="user"] [class*="bubble"]'],
      'conversation.assistantMsg': ['[data-chat-flow-kind="assistant-step"] > [data-slot] > div'],
      'conversation.toolRow': ['[data-chat-flow-kind="tool-call"] > [data-slot] > div'],
      'conversation.codeBlock': ['[data-conversation-content] pre', '[data-slot="main.conversation"] pre'],
      composer: ['[data-composer-card]'],
      'composer.input': ['[data-composer-input]'],
      'composer.toolbar': ['[data-composer-card] [class*="_row"]'],
      'composer.send': ['[data-composer-card] button[class*="_primary"]', 'button[aria-label="发送消息"]'],
      'composer.stats': ['[data-composer-stat]'],
      rightPanel: ['[data-slot="rightbar"] [data-sidebar-right-panel]', '[data-rightbar-col] [data-sidebar-right-panel]'],
      'rightPanel.tabs': ['[data-dockkit-strip]'],
      'rightPanel.body': ['[data-dockkit-surface]'],
      bottomBar: ['[data-dsh-bottom-panel]'],
    };

    const TOKEN_FIELDS = [
      ['textPrimary', '--dsw-alias-label-primary', STR.textPrimary],
      ['textSecondary', '--dsw-alias-label-secondary', STR.textSecondary],
      ['textTertiary', '--dsw-alias-label-tertiary', STR.textTertiary],
      ['link', '--dsw-alias-link', STR.link],
      ['brand', '--dsw-alias-brand-primary', STR.brand],
      ['bgBase', '--dsw-alias-bg-base', STR.bgBase],
      ['bgLayer1', '--dsw-alias-bg-layer-1', STR.bgLayer1],
      ['bgLayer2', '--dsw-alias-bg-layer-2', STR.bgLayer2],
      ['bgOverlay', '--dsw-alias-bg-overlay', STR.bgOverlay],
    ];

    const FONT_CHOICES = [
      ['default', null],
      ['system', 'system-ui, -apple-system, Segoe UI, sans-serif'],
      ['serif', 'Georgia, Times New Roman, serif'],
      ['mono', 'Consolas, Menlo, monospace'],
      ['kaiti', 'KaiTi, STKaiti, serif'],
      ['yahei', '"Microsoft YaHei", "PingFang SC", sans-serif'],
      ['songti', 'SimSun, Songti SC, serif'],
    ];

    const WEIGHT_CHOICES = [
      ['inherit', STR.weights.inherit],
      ['normal', STR.weights.normal],
      ['500', STR.weights.medium],
      ['600', STR.weights.semibold],
      ['bold', STR.weights.bold],
    ];

    const COLOR_RE = /^#([0-9a-f]{3,8})$/i;
    const esc = (s) => (window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/[^a-zA-Z0-9_-]/g, (c) => '\\' + c));

    function q(sel, root) {
      try {
        return Array.from((root || document).querySelectorAll(sel));
      } catch {
        return [];
      }
    }

    function loadState() {
      let raw = null;
      try {
        const t = localStorage.getItem(STORAGE_KEY);
        raw = t ? JSON.parse(t) : null;
      } catch {}
      const st = {
        tokens: (raw && raw.tokens) || {},
        font: (raw && raw.font) || {},
        nodes: (raw && raw.nodes) || {},
        seq: (raw && raw.seq) || 1,
        fabPos: raw && raw.fabPos && typeof raw.fabPos.x === 'number' && typeof raw.fabPos.y === 'number' ? raw.fabPos : null,
      };
      for (const [id, parent, labelZh, labelEn] of PRESETS) {
        if (!st.nodes[id]) st.nodes[id] = { parent, selector: '', style: {}, label: ZH ? labelZh : labelEn };
        else if (!st.nodes[id].label) st.nodes[id].label = ZH ? labelZh : labelEn;
      }
      // Split the old flat custom namespace into container + children, and make
      // sure every custom region sits directly under the container.
      for (const key of Object.keys(st.nodes)) {
        const n = st.nodes[key];
        if (key === 'custom') continue;
        if (key === 'custom.' || key.indexOf('custom.') === 0) {
          st.nodes['custom' + key.slice(6)] = { ...n, parent: CUSTOM_ROOT };
          delete st.nodes[key];
        } else if (key.indexOf(CUSTOM_PREFIX) === 0 && n.parent !== CUSTOM_ROOT) {
          st.nodes[key] = { ...n, parent: CUSTOM_ROOT };
        }
      }
      return st;
    }

    function buildSelector(el) {
      if (!el || el === document.body || el === document.documentElement) return 'body';
      const tryUnique = (sel) => {
        try {
          const n = document.querySelectorAll(sel);
          return n.length === 1 && n[0] === el;
        } catch {
          return false;
        }
      };
      if (el.id && tryUnique('#' + esc(el.id))) return '#' + esc(el.id);
      const tag = el.tagName.toLowerCase();
      const classes = Array.from(el.classList).filter((c) => /^[A-Za-z_][\w-]*$/.test(c));
      for (const combo of [classes.slice(0, 2), classes.slice(0, 1), classes]) {
        const sel = tag + combo.map((c) => '.' + esc(c)).join('');
        if (combo.length && tryUnique(sel)) return sel;
      }
      for (const attr of ['data-slot', 'data-testid', 'data-role', 'aria-label']) {
        const v = el.getAttribute && el.getAttribute(attr);
        if (v) {
          const sel = `${tag}[${attr}="${v.replace(/"/g, '\\"')}"]`;
          if (tryUnique(sel)) return sel;
        }
      }
      const segs = [];
      let cur = el;
      while (cur && cur.nodeType === 1 && cur !== document.documentElement) {
        const p = cur.parentElement;
        const idx = p ? Array.prototype.indexOf.call(p.children, cur) + 1 : 1;
        segs.unshift(cur.tagName.toLowerCase() + ':nth-child(' + idx + ')');
        cur = p;
      }
      const sel = 'body > ' + segs.join(' > ');
      return tryUnique(sel) ? sel : '';
    }

    // Outline layer shared by the element picker and match previews. Returns
    // {box, dispose}. Two z-indexes keep the hover rect above the match rects.
    function createHighlightLayer(kind) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483647';
      const mk = (css) => {
        const d = document.createElement('div');
        d.style.cssText = 'position:fixed;pointer-events:none;box-sizing:border-box;display:none;' + css;
        d.setAttribute('data-dsh-ui-theme-style', kind);
        document.documentElement.appendChild(d);
        return d;
      };
      document.documentElement.appendChild(wrap);
      return {
        box: mk('border:2px dashed #e05656;background:rgba(224,86,86,0.12);border-radius:2px;z-index:2147483647'),
        match: mk('border:1px solid #2aa1ff;background:rgba(42,161,255,0.16);border-radius:2px;z-index:2147483646'),
        dispose() {
          if (this.box.parentNode) this.box.remove();
          if (this.match.parentNode) this.match.remove();
          if (wrap.parentNode) wrap.remove();
        },
      };
    }

    function placeBox(box, r) {
      box.style.display = 'block';
      box.style.left = r.left + 'px';
      box.style.top = r.top + 'px';
      box.style.width = Math.max(1, r.width) + 'px';
      box.style.height = Math.max(1, r.height) + 'px';
    }

    // Element picker. Returns a cancel function.
    function pickElement(onDone) {
      const cursorStyle = document.createElement('style');
      cursorStyle.setAttribute('data-dsh-ui-theme-style', 'cursor');
      cursorStyle.textContent = 'html, body, * { cursor: crosshair !important }';
      document.head.appendChild(cursorStyle);
      const layer = createHighlightLayer('pick');
      const box = layer.box;
      const move = (e) => {
        const hovered = document.elementFromPoint(e.clientX, e.clientY);
        if (!hovered || hovered === box) {
          box.style.display = 'none';
          return;
        }
        placeBox(box, hovered.getBoundingClientRect());
      };
      let done = false;
      const cleanup = () => {
        if (done) return;
        done = true;
        if (cursorStyle.parentNode) cursorStyle.remove();
        document.removeEventListener('mousemove', move, true);
        document.removeEventListener('click', click, true);
        document.removeEventListener('keydown', key, true);
        layer.dispose();
      };
      const finish = (el) => {
        cleanup();
        if (onDone) onDone(el || null);
      };
      const click = (e) => {
        if (e.target && e.target.closest && e.target.closest('.' + PANEL_CLS)) {
          // a click on our own entry button also cancels
          finish(null);
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const el = document.elementFromPoint(e.clientX, e.clientY);
        finish(el);
      };
      const key = (e) => {
        if (e.key === 'Escape') finish(null);
      };
      document.addEventListener('mousemove', move, true);
      document.addEventListener('click', click, true);
      document.addEventListener('keydown', key, true);
      return cleanup;
    }

    // Hover preview: outlines every element of a selector. Returns a cancel fn.
    function highlightMatches(selector) {
      if (!selector) return () => {};
      const layer = createHighlightLayer('match');
      layer.box.remove();
      const draw = () => {
        const els = q(selector);
        if (!els.length) {
          layer.match.style.display = 'none';
          return;
        }
        // One fixed rect from the first element, sized to cover them all: a
        // single box reads more clearly than N overlapping ones.
        let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (!r.width && !r.height) continue;
          left = Math.min(left, r.left);
          top = Math.min(top, r.top);
          right = Math.max(right, r.right);
          bottom = Math.max(bottom, r.bottom);
        }
        if (!isFinite(left)) {
          layer.match.style.display = 'none';
          return;
        }
        placeBox(layer.match, { left, top, width: right - left, height: bottom - top });
      };
      draw();
      let timer = setInterval(draw, 400);
      window.addEventListener('resize', draw);
      return () => {
        clearInterval(timer);
        window.removeEventListener('resize', draw);
        layer.dispose();
      };
    }

    // CSS for an arbitrary user-owned selector, for the StyleRow preview.
    function selectorCss(selector, st) {
      if (!selector) return '';
      try {
        document.createDocumentFragment().querySelector(selector);
      } catch {
        return '';
      }
      return nodeRules(selector, st || {}).join('\n');
    }

    const isCustomId = (id) => id.indexOf(CUSTOM_PREFIX) === 0;

    // Next free custom index, derived from the ids actually stored (not from the
    // seq counter, which older configs may have left out of sync).
    function seqOf(nodes) {
      let max = 0;
      for (const id of Object.keys(nodes)) {
        if (!isCustomId(id)) continue;
        const n = parseInt(id.slice(CUSTOM_PREFIX.length), 10);
        if (n > max) max = n;
      }
      return max;
    }

    function resolveNodes(nodes) {
      const out = {};
      const ids = PRESETS.map(([id]) => id).concat(
        Object.keys(nodes).filter(isCustomId),
      );
      for (const id of ids) {
        const n = nodes[id];
        if (!n || id === 'global' || id === CUSTOM_ROOT) continue;
        if (n.selector) {
          try { out[id] = q(n.selector); } catch { out[id] = []; }
          continue;
        }
        const cands = BINDINGS[id];
        if (!cands) { out[id] = []; continue; }
        let els = [];
        for (const sel of cands) {
          els = q(sel);
          if (els.length) break;
        }
        out[id] = els.filter((el) => !el.closest('.' + PANEL_CLS) && !el.closest('[data-dsh-ui-theme-style]'));
      }
      return out;
    }

    function nodeRules(sel, st) {
      const rules = [];
      if (st.bg) rules.push(`${sel} { background-color: ${st.bg} !important }`);
      const bd = [];
      if (st.border) bd.push(`border-color: ${st.border} !important`);
      if (st.borderW) bd.push(`border-style: solid !important; border-width: ${Number(st.borderW)}px !important`);
      if (st.radius) bd.push(`border-radius: ${Number(st.radius)}px !important`);
      if (bd.length) rules.push(`${sel} { ${bd.join('; ')} }`);
      const td = [];
      if (st.text) td.push(`color: ${st.text} !important`);
      if (st.family) td.push(`font-family: ${st.family} !important`);
      if (st.size) td.push(`font-size: ${Number(st.size)}px !important`);
      if (st.weight && st.weight !== 'inherit') td.push(`font-weight: ${st.weight} !important`);
      if (td.length) {
        const excl = `:not(.${PANEL_CLS}):not(.${PANEL_CLS} *)`;
        rules.push(`${sel}${excl}, ${sel} *${excl} { ${td.join('; ')} }`);
      }
      return rules;
    }

    function buildCss(s) {
      const parts = [];
      const vars = [];
      for (const [key, token] of TOKEN_FIELDS) {
        const v = s.tokens[key];
        if (v && COLOR_RE.test(v)) vars.push(`${token}: ${v} !important`);
      }
      const g = [];
      if (s.font.family) g.push(`font-family: ${s.font.family} !important`);
      if (s.font.size) g.push(`font-size: ${Number(s.font.size)}px !important`);
      if (s.font.weight && s.font.weight !== 'inherit') g.push(`font-weight: ${s.font.weight} !important`);
      if (vars.length) parts.push(`:root { ${vars.join('; ')} }`);
      if (g.length) parts.push(`html { ${g.join('; ')} }`);

      const ids = PRESETS.map(([id]) => id).concat(
        Object.keys(s.nodes).filter(isCustomId),
      );
      for (const id of ids) {
        const n = s.nodes[id];
        if (!n || id === 'global' || id === CUSTOM_ROOT) continue;
        const st = n.style || {};
        if (!Object.keys(st).some((k) => st[k])) continue;
        parts.push(...nodeRules(`[${ATTR}="${id}"]`, st));
      }
      return parts.join('\n');
    }

    // ---- UI primitives ---------------------------------------------------
    const btnStyle = { fontSize: 11, lineHeight: '18px', padding: '0 8px', background: 'transparent', color: 'var(--dsw-alias-label-secondary, inherit)', border: '1px solid var(--dsw-alias-border-l1, #ccc)', borderRadius: 6, cursor: 'pointer', position: 'relative' };
    const miniBtnStyle = { fontSize: 12, lineHeight: '18px', padding: '1px 8px', background: 'transparent', color: 'var(--dsw-alias-label-secondary, inherit)', border: '1px solid var(--dsw-alias-border-l1, #ccc)', borderRadius: 6, cursor: 'pointer' };
    const inputStyle = { width: 90, fontSize: 12, padding: '2px 6px', background: 'var(--dsw-alias-bg-layer-1, #fff)', color: 'var(--dsw-alias-label-primary, inherit)', border: '1px solid var(--dsw-alias-border-l1, #ccc)', borderRadius: 6 };
    const labelStyle = { fontSize: 12, color: 'var(--dsw-alias-label-secondary, inherit)', flex: '0 0 auto' };

    function ColorField({ label, value, onChange }) {
      return h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' } },
        h('input', {
          type: 'color',
          value: value && COLOR_RE.test(value) ? value : '#808080',
          onChange: (e) => onChange(e.target.value),
          style: { width: 26, height: 22, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' },
        }),
        h('span', { style: { ...labelStyle, flex: 1 } }, label),
        value
          ? h('button', { style: { ...miniBtnStyle, padding: '0 5px' }, onClick: () => onChange(null), title: STR.clear }, '×')
          : null,
      );
    }

    function NumberField({ label, value, min, max, step, onChange }) {
      return h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' } },
        h('span', { style: { ...labelStyle, flex: 1 } }, label),
        h('input', {
          type: 'number', min, max, step,
          value: value || '',
          placeholder: STR.follow,
          onChange: (e) => onChange(e.target.value || null),
          style: { ...inputStyle, width: 70 },
        }),
      );
    }

    function FontSelect({ value, onChange }) {
      return h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' } },
        h('span', { style: { ...labelStyle, flex: 1 } }, STR.fFamily),
        h(
          'select',
          {
            value: (() => {
              const found = FONT_CHOICES.find(([, v]) => (v || null) === (value || null));
              return found ? found[0] : 'default';
            })(),
            onChange: (e) => {
              const key = e.target.value;
              onChange(key === 'default' ? null : FONT_CHOICES.find(([k]) => k === key)[1]);
            },
            style: { ...inputStyle, width: 120 },
          },
          ...FONT_CHOICES.map(([k]) => h('option', { key: k, value: k }, STR.fonts[k])),
        ),
      );
    }

    function WeightSelect({ value, onChange }) {
      return h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0' } },
        h('span', { style: { ...labelStyle, flex: 1 } }, STR.fWeight),
        h(
          'select',
          {
            value: value || 'inherit',
            onChange: (e) => {
              const v = e.target.value;
              onChange(v === 'inherit' ? null : v);
            },
            style: { ...inputStyle, width: 120 },
          },
          ...WEIGHT_CHOICES.map(([k, label]) => h('option', { key: k, value: k }, label)),
        ),
      );
    }

    function Popover({ rect, children }) {
      if (!rect) return null;
      const width = 260;
      const estH = 240;
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const below = rect.bottom + estH + 12 < window.innerHeight;
      const style = {
        position: 'fixed',
        left,
        width,
        zIndex: 2147483001,
        background: 'var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff))',
        color: 'var(--dsw-alias-label-primary, inherit)',
        border: '1px solid var(--dsw-alias-border-l2, #ccc)',
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
        padding: '8px 12px',
        boxSizing: 'border-box',
        maxHeight: '44vh',
        overflowY: 'auto',
      };
      if (below) style.top = rect.bottom + 6;
      else style.bottom = window.innerHeight - rect.top + 6;
      return h('div', { className: PANEL_CLS, style }, children);
    }

    function GroupDot({ on }) {
      return on ? h('span', { 'aria-hidden': true, style: { position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: '50%', background: 'var(--dsw-alias-brand-primary, #247bbf)' } }) : null;
    }

    // Hover popovers are positioned from the hovered button's rect; nothing in
    // this panel scrolls into view by itself, so no outside-click dismissal is
    // needed here. Also: labels must never open a popover of their own.
    function TrashIcon() {
      // Inline SVG trash glyph: no font dependency, sizes with the button.
      return h(
        'svg',
        { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false },
        h('path', { d: 'M4 7h16' }),
        h('path', { d: 'M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7' }),
        h('path', { d: 'M6.2 7l.9 12.2a1 1 0 0 0 1 .9h7.8a1 1 0 0 0 1-.9L17.8 7' }),
        h('path', { d: 'M10.4 11v5.4' }),
        h('path', { d: 'M13.6 11v5.4' }),
      );
    }

    function GlobalColorsPopover({ s, setToken, which }) {
      const fields = which === 'text' ? TOKEN_FIELDS.slice(0, 5) : TOKEN_FIELDS.slice(5);
      return h(
        'div',
        null,
        h('p', { style: { fontSize: 10, color: 'var(--dsw-alias-label-tertiary, #888)', margin: '0 0 6px' } }, STR.tokensHint),
        ...fields.map(([k, , label]) => h(ColorField, { key: k, label, value: s.tokens[k], onChange: (v) => setToken(k, v) })),
      );
    }

    // Inline rename box for a custom region. Enter / blur commits, Esc cancels.
    function RenameBox({ initial, onCommit, onCancel }) {
      const [v, setV] = React.useState(initial);
      const done = React.useRef(false);
      const commit = () => {
        if (done.current) return;
        done.current = true;
        onCommit(v.trim() || initial);
      };
      return h('input', {
        autoFocus: true,
        value: v,
        maxLength: 40,
        onChange: (e) => setV(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          e.stopPropagation();
          if (e.key === 'Enter') { e.preventDefault(); commit(); }
          if (e.key === 'Escape') {
            e.preventDefault();
            done.current = true;
            onCancel();
          }
        },
        style: { ...inputStyle, flex: '1 1 auto', fontSize: 12.5, padding: '1px 6px' },
      });
    }

    // Selector editor opened by the row's 查看 button: effective selector as
    // text, editable; an empty box means "back to the automatic binding".
    function StyleRow({ id, n, effective, onChange }) {
      const [v, setV] = React.useState(n.selector || '');
      const [err, setErr] = React.useState('');
      const [copied, setCopied] = React.useState(false);
      const valid = (sel) => {
        if (!sel) return true;
        try {
          document.createDocumentFragment().querySelector(sel);
          return true;
        } catch {
          return false;
        }
      };
      const commit = (next) => {
        const t = next.trim();
        if (!valid(t)) {
          setErr(STR.invalid);
          return false;
        }
        setErr('');
        onChange(t);
        return true;
      };
      const css = selectorCss(n.selector || effective, n.style);
      return h(
        React.Fragment,
        null,
        h('div', { style: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #888)', margin: '0 0 4px' } }, STR.selectorTitle),
        h('textarea', {
          value: v,
          spellCheck: false,
          autoFocus: true,
          rows: 3,
          placeholder: effective || '',
          onChange: (e) => setV(e.target.value),
          onBlur: () => commit(v),
          onKeyDown: (e) => {
            e.stopPropagation();
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              if (commit(v)) e.target.blur();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              setV(n.selector || '');
              setErr('');
              e.target.blur();
            }
          },
          style: {
            width: '100%', boxSizing: 'border-box', resize: 'vertical', fontSize: 11.5, lineHeight: '16px',
            fontFamily: 'Consolas, Menlo, monospace', padding: '5px 7px', borderRadius: 6,
            background: 'var(--dsw-alias-bg-layer-1, #fff)', color: 'var(--dsw-alias-label-primary, inherit)',
            border: '1px solid ' + (err ? 'var(--dsw-alias-state-error-primary, #c00)' : 'var(--dsw-alias-border-l1, #ccc)'),
          },
        }),
        err
          ? h('div', { style: { fontSize: 10.5, color: 'var(--dsw-alias-state-error-primary, #c00)', marginTop: 3 } }, err)
          : effective
            ? h('div', { style: { fontSize: 10, color: 'var(--dsw-alias-label-tertiary, #888)', marginTop: 3, wordBreak: 'break-all' } }, STR.effective + ': ' + effective)
            : null,
        css
          ? h('pre', { style: { fontSize: 10, lineHeight: '14px', margin: '6px 0 0', padding: '6px 7px', maxHeight: 96, overflow: 'auto', borderRadius: 6, background: 'var(--dsw-alias-bg-layer-2, rgba(127,127,127,0.12))', color: 'var(--dsw-alias-label-secondary, inherit)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }, css)
          : null,
        h(
          'div',
          { style: { display: 'flex', gap: 6, marginTop: 6, justifyContent: 'flex-end' } },
          h('button', { style: miniBtnStyle, onClick: () => { setCopied(true); try { navigator.clipboard.writeText(v); } catch {} setTimeout(() => setCopied(false), 1200); } }, copied ? '✓' : 'Copy'),
          h('button', { style: miniBtnStyle, onClick: () => commit(v) }, STR.apply),
        ),
      );
    }

    function ThemeEntry() {
      const [s, setS] = React.useState(loadState);
      const [open, setOpen] = React.useState(false);
      const [picking, setPicking] = React.useState(null);
      const [counts, setCounts] = React.useState({});
      const [pop, setPop] = React.useState(null); // {id, key, rect}
      const [hoveredRow, setHoveredRow] = React.useState(null); // row whose actions are hovered
      const sRef = React.useRef(s);
      sRef.current = s;
      const popTimer = React.useRef(null);
      const cancelPickRef = React.useRef(null);
      const lastRowRef = React.useRef(null);
      // The tree's scroll container. Only that box scrolls; the panel height is
      // fixed by its own layout and must never grow with new rows.
      const treeRef = React.useRef(null);

      React.useEffect(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
        } catch {}
      }, [s]);

      // tag + style loop
      React.useEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.setAttribute('data-dsh-ui-theme-style', '1');
        let raf = 0;
        const rescan = () => {
          const st = sRef.current;
          for (const el of q('[' + ATTR + ']')) el.removeAttribute(ATTR);
          const bound = resolveNodes(st.nodes);
          const next = {};
          for (const [id, els] of Object.entries(bound)) {
            for (const el of els) el.setAttribute(ATTR, id);
            if (els.length) next[id] = els.length;
          }
          styleEl.textContent = buildCss(st);
          setCounts((prev) => {
            const keys = Object.keys(next);
            const pkeys = Object.keys(prev);
            if (keys.length === pkeys.length && keys.every((k) => prev[k] === next[k])) return prev;
            return next;
          });
        };
        document.head.appendChild(styleEl);
        const keepLast = () => {
          if (styleEl.parentNode === document.head && document.head.lastElementChild !== styleEl) {
            document.head.appendChild(styleEl);
          }
        };
        rescan();
        keepLast();
        const mo = new MutationObserver(() => {
          keepLast();
          clearTimeout(raf);
          raf = setTimeout(rescan, 500);
        });
        mo.observe(document.body, {
          childList: true,
          subtree: true,
          // The plugin only adds/removes its own attribute and hover states never
          // change a data-* attribute, so watching attributes would just spin.
          attributes: false,
        });
        const ro = new MutationObserver(keepLast);
        ro.observe(document.head, { childList: true });
        return () => {
          clearTimeout(raf);
          mo.disconnect();
          ro.disconnect();
          if (styleEl.parentNode) styleEl.remove();
          for (const el of q('[' + ATTR + ']')) el.removeAttribute(ATTR);
        };
      }, []);

      const updateNode = React.useCallback((id, patch) => {
        setS((prev) => ({ ...prev, nodes: { ...prev.nodes, [id]: { ...prev.nodes[id], ...patch } } }));
      }, []);

      const setStyle = React.useCallback((id, key, value) => {
        setS((prev) => {
          const n = prev.nodes[id];
          const style = { ...n.style };
          if (value === null || value === '' || value === undefined) delete style[key];
          else style[key] = value;
          return { ...prev, nodes: { ...prev.nodes, [id]: { ...n, style } } };
        });
      }, []);

      const setToken = React.useCallback((key, value) => {
        setS((prev) => {
          const tokens = { ...prev.tokens };
          if (value) tokens[key] = value;
          else delete tokens[key];
          return { ...prev, tokens };
        });
      }, []);

      const setFont = React.useCallback((key, value) => {
        setS((prev) => {
          const font = { ...prev.font };
          if (value) font[key] = value;
          else delete font[key];
          return { ...prev, font };
        });
      }, []);

      // Draggable floating button. Position is stored as a fixed top-left point
      // (fabPos) and clamped to the viewport, so the button can never be dragged
      // off-screen by accident.
      const DRAG_THRESHOLD = 4;
      const FAB_MARGIN = 8;
      const [dragging, setDragging] = React.useState(false);
      const [fabWH, setFabWH] = React.useState({ w: 76, h: 30 });
      const dragRef = React.useRef(null);
      const moversRef = React.useRef(null);
      const suppressClickRef = React.useRef(false);

      const clampFab = (pos, size) => {
        const st = size || fabWH;
        const maxX = Math.max(FAB_MARGIN, window.innerWidth - st.w - FAB_MARGIN);
        const maxY = Math.max(FAB_MARGIN, window.innerHeight - st.h - FAB_MARGIN);
        return {
          x: Math.min(Math.max(FAB_MARGIN, Math.round(pos.x)), maxX),
          y: Math.min(Math.max(FAB_MARGIN, Math.round(pos.y)), maxY),
        };
      };

      // Keep window listeners reading the latest fabWH/clamp without re-binding.
      React.useEffect(() => {
        moversRef.current = { setS, clampFab };
      });

      React.useEffect(() => {
        const onResize = () => {
          const m = moversRef.current;
          setS((prev) => (prev.fabPos ? { ...prev, fabPos: m.clampFab(prev.fabPos) } : prev));
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, [setS]);

      // Pointer capture keeps move/up events coming to the button even after the
      // cursor leaves it; a capture-phase window listener is the safety net when
      // capture is lost (e.g. hover over an iframe) or another handler stops
      // propagation. Position updates are written to the DOM synchronously, so the
      // button can never fall behind the cursor and "escape" it.
      const moveFab = (clientX, clientY) => {
        const d = dragRef.current;
        if (!d) return;
        const dx = clientX - d.sx;
        const dy = clientY - d.sy;
        if (!d.moved && dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return;
        if (!d.moved) {
          d.moved = true;
          setDragging(true);
        }
        const next = clampFab({ x: d.ox + dx, y: d.oy + dy }, { w: d.w, h: d.h });
        // Move the DOM node immediately, before React's async commit, so the
        // button never lags behind the cursor.
        const el = d.el;
        if (el) {
          el.style.left = next.x + 'px';
          el.style.top = next.y + 'px';
          el.style.right = 'auto';
          el.style.bottom = 'auto';
        }
        setS((prev) => (prev.fabPos && prev.fabPos.x === next.x && prev.fabPos.y === next.y
          ? prev
          : { ...prev, fabPos: next }));
      };

      const onFabPointerMove = (e) => {
        if (!dragRef.current) return;
        if (e.buttons === 0) {
          onFabPointerUp();
          return;
        }
        moveFab(e.clientX, e.clientY);
      };

      const onFabPointerDown = (e) => {
        if (e.button !== 0 || picking) return;
        if (dragRef.current) return;
        suppressClickRef.current = false;
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        dragRef.current = {
          sx: e.clientX,
          sy: e.clientY,
          ox: r.left,
          oy: r.top,
          w: r.width,
          h: r.height,
          moved: false,
          pointerId: e.pointerId,
          el,
        };
        setFabWH({ w: r.width, h: r.height });
        try { el.setPointerCapture(e.pointerId); } catch {}
        window.addEventListener('pointermove', onFabPointerMove, true);
      };

      // Idempotent: safe to call from pointerup, pointercancel, lostpointercapture
      // and the trailing click, in any order.
      function onFabPointerUp() {
        const d = dragRef.current;
        if (!d) return;
        window.removeEventListener('pointermove', onFabPointerMove, true);
        try { d.el.releasePointerCapture(d.pointerId); } catch {}
        dragRef.current = null;
        if (d.moved) {
          setDragging(false);
          // Remember that this gesture was a drag so the click fired right after
          // pointerup does not toggle the panel; cleared on the next pointerdown.
          suppressClickRef.current = true;
        }
      }

      // While dragging, drop the focus from whatever was focused before so the
      // window-blur dismissal of popovers/menus does not fight the drag.
      React.useEffect(() => {
        if (dragging) {
          const el = document.activeElement;
          if (el && el.blur) {
            try { el.blur(); } catch {}
          }
        }
      }, [dragging]);

      const endPick = React.useCallback(() => {
        if (cancelPickRef.current) {
          cancelPickRef.current();
          cancelPickRef.current = null;
        }
        setPicking(null);
      }, []);

      const startPick = React.useCallback((id) => {
        if (picking === id) {
          endPick();
          return;
        }
        endPick();
        setPop(null);
        setPicking(id);
        cancelPickRef.current = pickElement((el) => {
          cancelPickRef.current = null;
          setPicking(null);
          if (!el) return;
          const sel = buildSelector(el);
          if (!sel) return;
          updateNode(id, { selector: sel });
        });
      }, [picking, endPick, updateNode]);

      const removeCustom = React.useCallback((id) => {
        setS((prev) => {
          const nodes = { ...prev.nodes };
          const drop = [id];
          const collect = (p) => {
            for (const k of Object.keys(nodes)) {
              if ((nodes[k].parent || null) === p) { drop.push(k); collect(k); }
            }
          };
          collect(id);
          for (const k of drop) delete nodes[k];
          return { ...prev, nodes };
        });
        setPop(null);
      }, []);

      const [renaming, setRenaming] = React.useState(null);

      const renameCustom = React.useCallback((id, label) => {
        setS((prev) => {
          const n = prev.nodes[id];
          if (!n || n.label === label) return prev;
          return { ...prev, nodes: { ...prev.nodes, [id]: { ...n, label } } };
        });
        setRenaming(null);
      }, []);

      // "+" in the 自定义 row. New ids are one past the highest existing custom
      // index, so duplicates are impossible even if an older saved config moved
      // the seq counter.
      const addCustom = React.useCallback(() => {
        const next = seqOf(sRef.current.nodes) + 1;
        const id = CUSTOM_PREFIX + next;
        setS((prev) => ({
          ...prev,
          seq: Math.max(prev.seq || 1, next),
          nodes: {
            ...prev.nodes,
            [id]: {
              parent: CUSTOM_ROOT,
              selector: '',
              style: {},
              custom: true,
              label: ZH ? '自定义区域 ' + next : 'Custom region ' + next,
            },
          },
        }));
        // After the row exists, reveal it inside the tree's own scroll box. The
        // panel keeps its size: only .tree scrolls, never the dialog.
        requestAnimationFrame(() => {
          const box = treeRef.current;
          const row = box && box.querySelector('[data-cut-row="' + id + '"]');
          if (!row) return;
          const top = row.offsetTop;
          const bottom = top + row.offsetHeight;
          if (bottom > box.scrollTop + box.clientHeight || top < box.scrollTop) {
            box.scrollTop = Math.max(0, bottom - box.clientHeight + 8);
          }
        });
      }, []);

      const resetAll = React.useCallback(() => {
        const nodes = {};
        for (const [id, parent, labelZh, labelEn] of PRESETS) {
          nodes[id] = { parent, selector: '', style: {}, label: ZH ? labelZh : labelEn };
        }
        setS({ tokens: {}, font: {}, nodes, seq: 1, fabPos: null });
        endPick();
      }, [endPick]);

      // hover-popover management
      const openPop = React.useCallback((id, key, e) => {
        clearTimeout(popTimer.current);
        const rect = e.currentTarget.getBoundingClientRect();
        lastRowRef.current = id;
        setPop({ id, key, rect });
      }, []);
      const scheduleClose = React.useCallback(() => {
        popTimer.current = setTimeout(() => setPop(null), 250);
      }, []);
      const keepOpen = React.useCallback(() => clearTimeout(popTimer.current), []);

      // Hovering a match count outlines the matched elements on the page.
      const [matchPreview, setMatchPreview] = React.useState('');
      React.useEffect(() => {
        if (!matchPreview) return undefined;
        return highlightMatches(matchPreview);
      }, [matchPreview]);

      const rowButton = (nodeId, key, label, hasValue) =>
        h(
          'button',
          {
            style: btnStyle,
            onMouseEnter: (e) => { if (!picking) openPop(nodeId, key, e); },
            onMouseLeave: scheduleClose,
          },
          label,
          hasValue ? h(GroupDot, { on: true }) : null,
        );

      // "查看": opens the selector editor in place of the hover popover.
      const viewButton = (nodeId) =>
        h(
          'button',
          {
            style: btnStyle,
            onClick: (e) => {
              e.stopPropagation();
              clearTimeout(popTimer.current);
              const rect = e.currentTarget.getBoundingClientRect();
              setPop({ id: nodeId, key: 'view', rect });
              setHoveredRow((cur) => (cur === nodeId ? cur : cur));
            },
          },
          STR.view,
        );

      // "Pick" button: no popover, direct click starts/cancels the picker.
      const pickButton = (nodeId, bound) =>
        h(
          'button',
          {
            style: {
              ...btnStyle,
              background: picking === nodeId ? 'var(--dsw-alias-interactive-bg-active, rgba(224,86,86,0.25))' : 'transparent',
              color: picking === nodeId ? 'var(--dsw-alias-state-error-primary, #e05656)' : 'var(--dsw-alias-label-secondary, inherit)',
            },
            onClick: (e) => {
              e.stopPropagation();
              clearTimeout(popTimer.current);
              setPop(null);
              startPick(nodeId);
            },
          },
          STR.pick,
          bound ? h(GroupDot, { on: true }) : null,
        );

      const renderRow = (id, n, depth) => {
        const st = n.style || {};
        const count = counts[id] || 0;
        const styled = Object.keys(st).some((k) => st[k]);
        const isGlobal = id === 'global';
        const isCustomRoot = id === CUSTOM_ROOT;
        const isCustom = isCustomId(id);
        return h(
          'div',
          {
            'data-cut-row': id,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 4px',
              paddingLeft: 4 + depth * 14,
              borderRadius: 6,
              background: 'transparent',
            },
          },
          styled
            ? h('span', { 'aria-hidden': true, style: { width: 7, height: 7, borderRadius: '50%', background: 'var(--dsw-alias-brand-primary, #247bbf)', flex: '0 0 auto' } })
            : h('span', { style: { width: 7, flex: '0 0 auto' } }),
          // Labels are display-only: hovering a name must not open anything.
          // Custom regions can be renamed with a double click.
          renaming === id && isCustom
            ? h(RenameBox, {
                initial: n.label || id,
                onCommit: (label) => renameCustom(id, label),
                onCancel: () => setRenaming(null),
              })
            : h('span', {
                title: isCustom ? STR.renameHint : undefined,
                onDoubleClick: isCustom ? () => setRenaming(id) : undefined,
                style: { fontSize: 12.5, color: 'var(--dsw-alias-label-primary, inherit)', flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
              }, n.label || id),
          !isGlobal && count
            ? h('span', {
                title: STR.hoverPreview,
                onMouseEnter: () => setMatchPreview(n.selector || (BINDINGS[id] && BINDINGS[id][0]) || ''),
                onMouseLeave: () => setMatchPreview(''),
                style: { fontSize: 10, color: 'var(--dsw-alias-state-success-primary, #2a2)', flex: '0 0 auto', cursor: 'help' },
              }, count)
            : null,
          h(
            'span',
            {
              style: { display: 'inline-flex', alignItems: 'center', gap: 4, flex: '0 0 auto' },
              onMouseEnter: () => setHoveredRow(id),
              onMouseLeave: () => setHoveredRow((cur) => (cur === id ? null : cur)),
            },
            isGlobal
              ? [
                  rowButton(id, 'textColor', STR.text, Object.keys(s.tokens).some((k) => ['textPrimary', 'textSecondary', 'textTertiary', 'link', 'brand'].includes(k))),
                  rowButton(id, 'bgColor', STR.bg, Object.keys(s.tokens).some((k) => ['bgBase', 'bgLayer1', 'bgLayer2', 'bgOverlay'].includes(k))),
                  rowButton(id, 'font', STR.fFamily, !!(s.font.family || s.font.size || s.font.weight)),
                ]
              : [
                  pickButton(id, !!n.selector),
                  rowButton(id, 'bg', STR.bg, !!st.bg),
                  rowButton(id, 'border', STR.border, !!(st.border || st.borderW || st.radius)),
                  rowButton(id, 'text', STR.text, !!(st.text || st.family || st.size || st.weight)),
                  viewButton(id),
                ],
            isCustomRoot
              ? h('button', {
                  style: { ...btnStyle, padding: '0 6px', fontSize: 13, lineHeight: '18px' },
                  title: STR.addRegion,
                  'aria-label': STR.addRegion,
                  onClick: (e) => { e.stopPropagation(); addCustom(); },
                }, '+')
              : null,
            // Row-level delete: icon only, right-most, hover-revealed.
            isCustom
              ? h('button', {
                  style: {
                    ...btnStyle, padding: '0 3px', lineHeight: '18px',
                    display: 'inline-flex', alignItems: 'center', color: 'var(--dsw-alias-state-error-primary, #c00)',
                    opacity: hoveredRow === id ? 1 : 0.45,
                  },
                  title: STR.removeNode,
                  'aria-label': STR.removeNode,
                  onClick: (e) => { e.stopPropagation(); removeCustom(id); },
                }, h(TrashIcon, null))
              : null,
          ),
        );
      };

      const Tree = ({ parent, depth }) => {
        const childrenIds = PRESETS.filter(([id, p]) => p === parent && s.nodes[id]).map(([id]) => id).concat(
          Object.keys(s.nodes)
            .filter((k) => isCustomId(k) && s.nodes[k] && (s.nodes[k].parent || CUSTOM_ROOT) === parent)
            .sort((a, b) => parseInt(a.slice(CUSTOM_PREFIX.length), 10) - parseInt(b.slice(CUSTOM_PREFIX.length), 10)),
        );
        return h(
          'div',
          null,
          ...childrenIds.map((id) =>
            h(
              React.Fragment,
              { key: id },
              renderRow(id, s.nodes[id], depth),
              Tree({ parent: id, depth: depth + 1 }),
            ),
          ),
        );
      };

      const renderPopContent = () => {
        if (!pop) return null;
        const id = pop.id;
        const n = s.nodes[id];
        if (!n) return null;
        if (id === 'global') {
          if (pop.key === 'textColor') return h(GlobalColorsPopover, { s, setToken, which: 'text' });
          if (pop.key === 'bgColor') return h(GlobalColorsPopover, { s, setToken, which: 'bg' });
          if (pop.key === 'font') {
            return h(
              'div',
              null,
              h(FontSelect, { value: s.font.family, onChange: (v) => setFont('family', v) }),
              h(NumberField, { label: STR.fSize, min: 10, max: 24, step: 0.5, value: s.font.size, onChange: (v) => setFont('size', v) }),
              h(WeightSelect, { value: s.font.weight, onChange: (v) => setFont('weight', v) }),
            );
          }
          return null;
        }
        const st = n.style || {};
        if (pop.key === 'view') {
          // Effective selector: the saved override, else what auto-binding resolves to.
          const cands = BINDINGS[id] || [];
          let autoSel = '';
          for (const sel of cands) {
            if (q(sel).length) { autoSel = sel; break; }
          }
          const effective = n.selector || autoSel;
          return h(StyleRow, {
            id,
            n,
            effective,
            onChange: (sel) => { updateNode(id, { selector: sel }); setPop(null); },
          });
        }
        if (pop.key === 'bg') {
          return h(ColorField, { label: STR.fBg, value: st.bg, onChange: (v) => setStyle(id, 'bg', v) });
        }
        if (pop.key === 'border') {
          return h(
            'div',
            null,
            h(ColorField, { label: STR.fBorder, value: st.border, onChange: (v) => setStyle(id, 'border', v) }),
            h(NumberField, { label: STR.fBorderW, min: 0, max: 12, step: 1, value: st.borderW, onChange: (v) => setStyle(id, 'borderW', v) }),
            h(NumberField, { label: STR.fRadius, min: 0, max: 32, step: 1, value: st.radius, onChange: (v) => setStyle(id, 'radius', v) }),
          );
        }
        if (pop.key === 'text') {
          return h(
            'div',
            null,
            h(ColorField, { label: STR.fText, value: st.text, onChange: (v) => setStyle(id, 'text', v) }),
            h(FontSelect, { value: st.family, onChange: (v) => setStyle(id, 'family', v) }),
            h(NumberField, { label: STR.fSize, min: 8, max: 32, step: 0.5, value: st.size, onChange: (v) => setStyle(id, 'size', v) }),
            h(WeightSelect, { value: st.weight, onChange: (v) => setStyle(id, 'weight', v) }),
          );
        }
        return null;
      };

      const fabPos = s.fabPos ? clampFab(s.fabPos) : null;

      // Anchor the panel above the button when the button sits in the lower part
      // of the screen, otherwise below it; always keep it inside the viewport.
      const panelPos = fabPos
        ? (() => {
            const PW = 560;
            const PH = Math.min(Math.round(window.innerHeight * 0.74), window.innerHeight - 2 * FAB_MARGIN);
            let left = fabPos.x + fabWH.w - PW;
            left = Math.min(Math.max(FAB_MARGIN, left), Math.max(FAB_MARGIN, window.innerWidth - PW - FAB_MARGIN));
            const spaceAbove = fabPos.y - FAB_MARGIN - 8;
            const spaceBelow = window.innerHeight - (fabPos.y + fabWH.h) - FAB_MARGIN - 8;
            if (spaceAbove >= PH || spaceAbove >= spaceBelow) {
              return { left, top: Math.max(FAB_MARGIN, fabPos.y - PH - 8), maxHeight: Math.max(160, spaceAbove) };
            }
            return {
              left,
              top: fabPos.y + fabWH.h + 8,
              maxHeight: Math.max(160, Math.min(PH, window.innerHeight - (fabPos.y + fabWH.h) - FAB_MARGIN - 8)),
            };
          })()
        : null;

      const entryBtn = h(
        'button',
        {
          type: 'button',
          className: PANEL_CLS,
          onPointerDown: onFabPointerDown,
          onPointerUp: onFabPointerUp,
          onPointerCancel: onFabPointerUp,
          onLostPointerCapture: onFabPointerUp,
          onDragStart: (e) => e.preventDefault(),
          onClick: (e) => {
            if (suppressClickRef.current) {
              suppressClickRef.current = false;
              e.preventDefault();
              return;
            }
            if (picking) { endPick(); return; }
            setOpen((o) => !o);
          },
          title: STR.title,
          'aria-pressed': open,
          style: {
            position: 'fixed',
            ...(fabPos
              ? { left: fabPos.x, top: fabPos.y }
              : { right: 16, bottom: 16 }),
            zIndex: 2147483000,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            lineHeight: '20px',
            padding: '4px 10px',
            borderRadius: 999,
            border: '1px solid var(--dsw-alias-border-l2, transparent)',
            background: open
              ? 'var(--dsw-alias-interactive-bg-active, var(--dsw-alias-bg-layer-2, #ddd))'
              : 'var(--dsw-alias-bg-layer-1, #fff)',
            color: 'var(--dsw-alias-label-primary, inherit)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none',
            transition: dragging ? 'none' : 'box-shadow 0.15s',
          },
        },
        h('span', { 'aria-hidden': true }, '◐'),
        STR.entry,
      );

      return h(
        React.Fragment,
        null,
        picking
          ? h(
              'div',
              {
                className: PANEL_CLS,
                role: 'status',
                onClick: () => endPick(),
                style: {
                  position: 'fixed', left: '50%', top: 12, transform: 'translateX(-50%)', zIndex: 2147483646,
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                  background: 'var(--dsw-alias-tooltip-bg, #222)', color: 'var(--dsw-alias-label-primary-inverted, #fff)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                },
              },
              STR.picking,
            )
          : null,
        picking ? null : entryBtn,
        open && !picking
          ? h(
              'div',
              {
                className: PANEL_CLS,
                role: 'dialog',
                'aria-label': STR.title,
                style: {
                  position: 'fixed',
                  ...(panelPos
                    ? { left: panelPos.left, top: panelPos.top, maxHeight: panelPos.maxHeight }
                    : { right: 16, bottom: 56, maxHeight: '74vh' }),
                  width: 560,
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 2147483000,
                  background: 'var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff))',
                  color: 'var(--dsw-alias-label-primary, inherit)',
                  border: '1px solid var(--dsw-alias-border-l2, #ccc)',
                  borderRadius: 12,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                  fontFamily: 'system-ui, sans-serif',
                  overflow: 'hidden',
                },
              },
              h(
                'div',
                { style: { padding: '12px 14px 8px' } },
                h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  h('strong', { style: { fontSize: 14 } }, STR.title),
                  h('button', { style: miniBtnStyle, onClick: () => setOpen(false), title: STR.close }, '×'),
                ),
                h('p', { style: { fontSize: 11, color: 'var(--dsw-alias-label-tertiary, #888)', margin: '4px 0 8px' } }, STR.hint),
              ),
              h(
                'div',
                { ref: treeRef, style: { flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '0 14px' } },
                Tree({ parent: null, depth: 0 }),
              ),
              // sticky footer: does not scroll with the tree
              h(
                'div',
                {
                  style: {
                    position: 'sticky',
                    bottom: 0,
                    flex: '0 0 auto',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 8,
                    padding: '10px 14px',
                    borderTop: '1px solid var(--dsw-alias-border-l1, #eee)',
                    background: 'var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1, #fff))',
                  },
                },
                h('button', { style: miniBtnStyle, onClick: () => setOpen(false) }, STR.close),
                h('button', { style: { ...miniBtnStyle, color: 'var(--dsw-alias-state-error-primary, #c00)' }, onClick: resetAll }, STR.resetAll),
              ),
            )
          : null,
        !picking && open && pop
          ? h(
              'div',
              { onMouseEnter: keepOpen, onMouseLeave: scheduleClose },
              h(Popover, { rect: pop.rect }, renderPopContent()),
            )
          : null,
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: 'local-custom-ui-theme', order: 9, label: STR.entry },
            ThemeEntry,
          ),
        );
      },
    };
  },
});
