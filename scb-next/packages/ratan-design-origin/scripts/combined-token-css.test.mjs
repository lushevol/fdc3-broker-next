import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import test from 'node:test';
import postcss from 'postcss';
import { createCombinedTokenStylesheet } from './combined-token-css.mjs';

test('shares declarations and fonts while preserving scoped and global conditional rules', () => {
  const source = postcss.parse(`
    .ratan-design-root[data-generation="webkit"] { --base: blue; }
    @media (max-width: 680px) { @supports (display: grid) {
      .ratan-design-root[data-generation="webkit"][data-mode="dark"] { --surface: black; }
    } }
    @font-face { font-family: Example; src: url("./fonts/example.woff2"); }
  `);
  const original = source.toString();
  const combined = createCombinedTokenStylesheet(source);
  assert.equal(source.toString(), original);
  assert.deepEqual(combined.first.selectors, [
    '.ratan-design-root[data-generation="webkit"]',
    ':root:where(:not([data-generation="legacy"]))',
  ]);
  const media = combined.nodes.find((node) => node.name === 'media');
  assert.equal(media.params, '(max-width: 680px)');
  assert.equal(media.first.params, '(display: grid)');
  assert.equal(media.first.first.first.value, 'black');
  assert.equal(combined.last.toString(), source.last.toString());
  let declarations = 0;
  combined.walkDecls('--surface', () => declarations++);
  assert.equal(declarations, 1);
});

test('ships a deterministic self-contained combined export smaller than both old entries', async () => {
  const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
  const [scoped, global, combined, manifestText] = await Promise.all([
    read('../assets/styles.css'), read('../assets/tokens.css'),
    read('../assets/styles-and-tokens.css'), read('../package.json'),
  ]);
  assert.equal(JSON.parse(manifestText).exports['./styles-and-tokens.css'], './dist/styles-and-tokens.css');
  assert.equal(combined, createCombinedTokenStylesheet(postcss.parse(scoped)).toString());
  const css = postcss.parse(combined);
  css.walkAtRules('import', () => assert.fail('Combined CSS must be self-contained'));
  const fonts = [];
  css.walkAtRules('font-face', (face) => fonts.push(face.toString()));
  const originalFonts = [];
  postcss.parse(scoped).walkAtRules('font-face', (face) => originalFonts.push(face.toString()));
  assert.deepEqual(fonts, originalFonts);
  assert.equal(new Set(fonts).size, fonts.length);
  assert.ok(Buffer.byteLength(combined) < (Buffer.byteLength(scoped) + Buffer.byteLength(global)) * 0.6);
  assert.ok(gzipSync(combined).length < (gzipSync(scoped).length + gzipSync(global).length) * 0.6);
});
