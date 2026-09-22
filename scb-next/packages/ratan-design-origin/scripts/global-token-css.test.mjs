import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import postcss from 'postcss';
import { createGlobalTokenStylesheet } from './global-token-css.mjs';
import { validateCustomPropertyGraph } from './token-css.mjs';

test('exposes default and explicit appearances without altering scoped styles or conditions', () => {
  const scoped = postcss.parse(`
    .ratan-design-root[data-generation="webkit"] { --base: blue; }
    .ratan-design-root[data-generation="webkit"][data-mode="light"] { --surface: white; }
    @media (max-width: 680px) {
      @supports (display: grid) {
        .ratan-design-root[data-generation="webkit"][data-mode="dark"] { --surface: black; }
      }
    }
    .ratan-design-root[data-generation="legacy"] { --base: green; }
    .ratan-design-root[data-generation="legacy"][data-mode="light"] { --surface: ivory; }
    .ratan-design-root[data-generation="legacy"][data-mode="dark"] { --surface: navy; }
    @font-face { font-family: Example; src: url("./fonts/example.woff2"); }
  `);
  const original = scoped.toString();
  const global = createGlobalTokenStylesheet(scoped);
  const selectors = [];
  global.walkRules((rule) => selectors.push(rule.selector));

  assert.deepEqual(selectors, [
    ':root:where(:not([data-generation="legacy"]))',
    ':root:where(:not([data-generation="legacy"]):not([data-mode="dark"]))',
    ':root:where(:not([data-generation="legacy"])[data-mode="dark"])',
    ':root:where([data-generation="legacy"])',
    ':root:where([data-generation="legacy"]:not([data-mode="dark"]))',
    ':root:where([data-generation="legacy"][data-mode="dark"])',
  ]);
  assert.equal(scoped.toString(), original);
  const media = global.nodes.find((node) => node.name === 'media');
  assert.equal(media.params, '(max-width: 680px)');
  assert.equal(media.first.name, 'supports');
  assert.equal(media.first.params, '(display: grid)');
  assert.equal(media.first.first.first.value, 'black');
  assert.equal(global.last.toString(), scoped.last.toString());
});

test('ships a global CSS export with complete token chains for every appearance', async () => {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(manifest.exports['./tokens.css'], './dist/tokens.css');
  assert.ok(manifest.sideEffects.includes('**/*.css'));
  const scoped = postcss.parse(
    await readFile(new URL('../assets/styles.css', import.meta.url), 'utf8'),
  );
  const global = postcss.parse(
    await readFile(new URL('../assets/tokens.css', import.meta.url), 'utf8'),
  );
  const theme = JSON.parse(
    await readFile(new URL('../src/tokens/webkit-theme.json', import.meta.url), 'utf8'),
  );
  const semanticRoots = [...JSON.stringify(theme.references).matchAll(/"(--sc-[\w-]+)"/g)].map(
    (match) => match[1],
  );

  // The committed artifact must contain exactly the same values, ordering and conditions.
  assert.equal(global.toString(), createGlobalTokenStylesheet(scoped).toString());
  global.walkRules((rule) => {
    assert.ok(rule.selector.startsWith(':root'));
    rule.walkDecls((declaration) => assert.ok(declaration.prop.startsWith('--')));
  });
  global.walkAtRules('import', () => assert.fail('Tokens must be self-contained'));

  for (const generation of ['webkit', 'legacy']) {
    for (const mode of ['light', 'dark']) {
      const base =
        generation === 'webkit' ? ':not([data-generation="legacy"])' : '[data-generation="legacy"]';
      const selectors = [
        `:root:where(${base})`,
        `:root:where(${base}${mode === 'light' ? ':not([data-mode="dark"])' : '[data-mode="dark"]'})`,
      ];
      const roots = new Set();
      global.walkRules((rule) => {
        if (selectors.includes(rule.selector))
          rule.walkDecls((declaration) => roots.add(declaration.prop));
      });
      assert.ok(roots.size > 100, `${generation}/${mode} must expose its tokens`);
      // WebKit contains unrelated canonical references outside its public contract.
      const publicRoots = [...roots].filter((name) => !name.startsWith('--sc-'));
      if (generation === 'webkit') publicRoots.push(...semanticRoots);
      assert.deepEqual(validateCustomPropertyGraph(global, publicRoots, selectors), {
        missing: [],
        cycles: [],
      });
    }
  }
});
