import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import postcss from 'postcss';
import { appendScopedTokenRules, validateCustomPropertyGraph } from './token-css.mjs';

test('retains media and supports ancestry around scoped token declarations', () => {
  const source = postcss.parse(`
    :root { --sc-base: base; color: red; }
    @media screen and (max-width: 680px) {
      :root, :host { --sc-compact: compact; }
      @supports (display: grid) {
        :host { --sc-grid: grid; }
      }
    }
    .unrelated { --sc-leak: no; }
  `);
  const output = postcss.root();

  appendScopedTokenRules(source, output, 'Fixture.css');

  const directRules = output.nodes.filter((node) => node.type === 'rule');
  assert.equal(directRules.length, 1);
  assert.equal(directRules[0].nodes.length, 1);
  assert.equal(directRules[0].nodes[0].prop, '--sc-base');

  const mediaRules = output.nodes.filter((node) => node.type === 'atrule' && node.name === 'media');
  assert.equal(mediaRules.length, 2);
  assert.ok(mediaRules.every((rule) => rule.params === 'screen and (max-width: 680px)'));

  const compact = mediaRules[0].nodes[0];
  assert.equal(compact.selector, '.ratan-design-root[data-generation="webkit"]');
  assert.equal(compact.nodes[0].prop, '--sc-compact');

  const supports = mediaRules[1].nodes[0];
  assert.equal(supports.type, 'atrule');
  assert.equal(supports.name, 'supports');
  assert.equal(supports.params, '(display: grid)');
  assert.equal(supports.nodes[0].nodes[0].prop, '--sc-grid');
  assert.equal(output.toString().includes('--sc-leak'), false);
});

test('reports missing definitions and cycles in public token chains', () => {
  const source = postcss.parse(`
    :root {
      --public-missing: var(--missing);
      --cycle-a: var(--cycle-b);
      --cycle-b: var(--cycle-a);
    }
  `);

  const result = validateCustomPropertyGraph(source, ['--public-missing', '--cycle-a']);

  assert.deepEqual(result.missing, ['--missing']);
  assert.deepEqual(result.cycles, ['--cycle-a -> --cycle-b -> --cycle-a']);
});

test('resolves exported tokens and aliases in every generation and mode', async () => {
  const aliasNames = [
    'color.ts',
    'color.light.ts',
    'color.dark.ts',
    'color.legacy.ts',
    'color.light.legacy.ts',
    'color.dark.legacy.ts',
  ];
  const [stylesheet, webkitTokens, ...aliasSources] = await Promise.all([
    readFile(new URL('../assets/styles.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/tokens/webkit.ts', import.meta.url), 'utf8'),
    ...aliasNames.map((name) =>
      readFile(new URL(`../src/tokens/${name}`, import.meta.url), 'utf8'),
    ),
  ]);
  const aliasByName = new Map(aliasNames.map((name, index) => [name, aliasSources[index]]));
  const webkitRoots = new Set(
    [...webkitTokens.matchAll(/token\("(--[\w-]+)"\)/g)].map((match) => match[1]),
  );
  const variants = [
    { generation: 'webkit', mode: 'light', aliases: ['color.ts', 'color.light.ts'] },
    { generation: 'webkit', mode: 'dark', aliases: ['color.ts', 'color.dark.ts'] },
    {
      generation: 'legacy',
      mode: 'light',
      aliases: ['color.legacy.ts', 'color.light.legacy.ts'],
    },
    {
      generation: 'legacy',
      mode: 'dark',
      aliases: ['color.legacy.ts', 'color.dark.legacy.ts'],
    },
  ];
  const css = postcss.parse(stylesheet);

  for (const { generation, mode, aliases } of variants) {
    const roots = new Set(generation === 'webkit' ? webkitRoots : []);
    for (const name of aliases)
      for (const match of aliasByName.get(name).matchAll(/^\s*(--[\w-]+):/gm)) roots.add(match[1]);

    const base = `.ratan-design-root[data-generation="${generation}"]`;
    assert.deepEqual(
      validateCustomPropertyGraph(css, roots, [base, `${base}[data-mode="${mode}"]`]),
      {
        missing: [],
        cycles: [],
      },
    );
  }
});
