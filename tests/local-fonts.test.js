import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const clientPath = resolve(root, 'client.js');
const clientSource = readFileSync(clientPath, 'utf8').replace(/\r\n/g, '\n');
const returnMarker = "    return {\n      inject: ['slots'],";

function loadFontHelpers(React = { createElement() {} }) {
  const instrumented = clientSource.replace(
    returnMarker,
    `    globalThis.__fontHelpersForTest = { normalizeLocalFonts, cssFontFamily, readLocalFonts, fontPreviewCss, FontSelect };\n${returnMarker}`,
  );
  assert.notEqual(instrumented, clientSource, 'test injection point should exist');

  let module;
  const context = {
    window: { __ModuleLoader__: { load(value) { module = value; } } },
    navigator: { language: 'en' },
  };
  vm.runInNewContext(instrumented, context, { filename: clientPath });
  module.factory((name) => {
    assert.equal(name, 'react');
    return React;
  });
  return { ...context.__fontHelpersForTest, testWindow: context.window };
}

function createReactHarness() {
  const hooks = [];
  let cursor = 0;
  let effects = [];
  const React = {
    createElement(type, props, ...children) {
      return { type, props: props || {}, children: children.flat(Infinity) };
    },
    useState(initial) {
      const slot = cursor++;
      if (!(slot in hooks)) hooks[slot] = initial;
      return [hooks[slot], (next) => { hooks[slot] = typeof next === 'function' ? next(hooks[slot]) : next; }];
    },
    useRef(initial) {
      const slot = cursor++;
      if (!(slot in hooks)) hooks[slot] = { current: initial };
      return hooks[slot];
    },
    useEffect(effect, deps) {
      const slot = cursor++;
      if (!(slot in hooks)) {
        hooks[slot] = { deps, cleanup: null };
        effects.push(() => { hooks[slot].cleanup = effect(); });
      }
    },
  };
  return {
    React,
    render(component, props) {
      cursor = 0;
      effects = [];
      const tree = component(props);
      for (const run of effects) run();
      return tree;
    },
    unmount() {
      for (const hook of hooks) if (hook && hook.cleanup) hook.cleanup();
    },
  };
}

function findNode(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null;
  if (Array.isArray(tree)) {
    for (const child of tree) {
      const found = findNode(child, predicate);
      if (found) return found;
    }
    return null;
  }
  if (predicate(tree)) return tree;
  return findNode(tree.children, predicate);
}

function nodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  return node && node.children ? node.children.map(nodeText).join('') : '';
}

test('normalizeLocalFonts returns unique non-empty families in sorted order', () => {
  const { normalizeLocalFonts } = loadFontHelpers();
  const families = normalizeLocalFonts([
    { family: 'Noto Sans' },
    { family: 'Arial' },
    { family: 'Noto Sans' },
    { family: '' },
    { family: 7 },
    null,
  ]);

  assert.deepEqual(Array.from(families), ['Arial', 'Noto Sans']);
});

test('cssFontFamily keeps quotes, backslashes, and line breaks inside one CSS string', () => {
  const { cssFontFamily } = loadFontHelpers();

  assert.equal(cssFontFamily('A"; color:red;/*'), '"A\\22 ; color:red;/*"');
  assert.equal(cssFontFamily('A\\B\nC'), '"A\\5c B\\a C"');
});

test('fontPreviewCss scopes global and region rules and clears empty previews', () => {
  const { fontPreviewCss } = loadFontHelpers();

  assert.equal(fontPreviewCss(null), '');
  assert.equal(fontPreviewCss({ scope: 'global', family: '"Arial"' }), 'html { font-family: "Arial" !important }');
  assert.equal(
    fontPreviewCss({ scope: 'region', id: 'sidebar', family: '"Arial"' }),
    '[data-dsh-ui-theme="sidebar"]:not(.dsh-cut-panel):not(.dsh-cut-panel *), [data-dsh-ui-theme="sidebar"] *:not(.dsh-cut-panel):not(.dsh-cut-panel *) { font-family: "Arial" !important }',
  );
});

test('readLocalFonts reads lazily and returns normalized families', async () => {
  const { readLocalFonts } = loadFontHelpers();
  let calls = 0;
  const result = await readLocalFonts(async () => {
    calls += 1;
    return [{ family: 'Noto Sans' }, { family: 'Arial' }, { family: 'Arial' }];
  });

  assert.equal(calls, 1);
  assert.equal(result.status, 'loaded');
  assert.deepEqual(Array.from(result.families), ['Arial', 'Noto Sans']);
});

test('readLocalFonts reports unavailable, empty, and denied API states', async () => {
  const { readLocalFonts } = loadFontHelpers();
  const unavailable = await readLocalFonts(null);
  const empty = await readLocalFonts(async () => []);
  const denied = await readLocalFonts(async () => { throw new Error('permission denied'); });

  assert.equal(unavailable.status, 'unsupported');
  assert.equal(empty.status, 'empty');
  assert.equal(denied.status, 'error');
  assert.deepEqual(Array.from(denied.families), []);
});

test('FontSelect loads only on request, previews on hover, and applies only on click', async () => {
  const harness = createReactHarness();
  const { FontSelect, testWindow } = loadFontHelpers(harness.React);
  const family = 'A"; color:red;/*';
  let apiCalls = 0;
  testWindow.queryLocalFonts = async () => {
    apiCalls += 1;
    return [{ family }];
  };
  const previews = [];
  const applied = [];
  let cleared = 0;
  const props = {
    value: null,
    onChange: (value) => applied.push(value),
    onPreview: (value) => previews.push(value),
    onPreviewEnd: () => { cleared += 1; },
  };

  let tree = harness.render(FontSelect, props);
  assert.equal(apiCalls, 0);
  const toggle = findNode(tree, (node) => node.type === 'button' && node.props['aria-haspopup'] === 'listbox');
  toggle.props.onClick();
  tree = harness.render(FontSelect, props);
  assert.equal(apiCalls, 0);

  const load = findNode(tree, (node) => node.type === 'button' && node.props['aria-label'] === 'Load local fonts');
  await load.props.onClick();
  tree = harness.render(FontSelect, props);
  const option = findNode(tree, (node) => node.props.role === 'option' && nodeText(node) === family);
  option.props.onMouseEnter();
  assert.deepEqual(previews, ['"A\\22 ; color:red;/*"']);
  assert.deepEqual(applied, []);
  option.props.onClick();
  assert.deepEqual(applied, ['"A\\22 ; color:red;/*"']);
  assert.ok(cleared > 0);
  harness.unmount();
});

test('FontSelect keeps preset options when local font access is unavailable', async () => {
  const harness = createReactHarness();
  const { FontSelect, testWindow } = loadFontHelpers(harness.React);
  const props = { value: null, onChange() {}, onPreview() {}, onPreviewEnd() {} };
  let tree = harness.render(FontSelect, props);
  findNode(tree, (node) => node.type === 'button' && node.props['aria-haspopup'] === 'listbox').props.onClick();
  tree = harness.render(FontSelect, props);
  const load = findNode(tree, (node) => node.type === 'button' && node.props['aria-label'] === 'Load local fonts');
  await load.props.onClick();
  tree = harness.render(FontSelect, props);

  assert.ok(findNode(tree, (node) => node.props.role === 'option' && nodeText(node) === 'Default'));
  assert.equal(nodeText(findNode(tree, (node) => node.props.role === 'status')), 'Local font access is unavailable');
  harness.unmount();
});
