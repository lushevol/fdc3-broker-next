import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import postcss from 'postcss';
import { appendScopedTokenRules, validateCustomPropertyGraph } from './token-css.mjs';

function leafStrings(value) {
  if (typeof value === 'string') return [value];
  return Object.values(value).flatMap(leafStrings);
}

const normalizeCssValue = (value) => value.replace(/\s+/g, ' ').trim().toLowerCase();

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

test('keeps the versioned theme source aligned with generated CSS', async () => {
  const aliasNames = [
    'color.ts',
    'color.light.ts',
    'color.dark.ts',
    'color.legacy.ts',
    'color.light.legacy.ts',
    'color.dark.legacy.ts',
  ];
  const [
    stylesheet,
    themeSourceText,
    generatedTheme,
    provenanceText,
    ...aliasSources
  ] = await Promise.all([
    readFile(new URL('../assets/styles.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/tokens/webkit-theme.json', import.meta.url), 'utf8'),
    readFile(new URL('../src/tokens/webkit-theme.generated.ts', import.meta.url), 'utf8'),
    readFile(new URL('../assets/webkit-sources.json', import.meta.url), 'utf8'),
    ...aliasNames.map((name) =>
      readFile(new URL(`../src/tokens/${name}`, import.meta.url), 'utf8'),
    ),
  ]);
  const themeSource = JSON.parse(themeSourceText);
  const provenance = JSON.parse(provenanceText);
  assert.equal(themeSource.webkitVersion, provenance.version);
  assert.equal(
    generatedTheme,
    `/* Generated from webkit-theme.json; do not edit. */\n` +
      `export const webkitReferences = ${JSON.stringify(themeSource.references, null, 2)} as const;\n\n` +
      `export const webkitMuiTheme = ${JSON.stringify(themeSource.mui, null, 2)} as const;\n`,
  );
  const aliasByName = new Map(aliasNames.map((name, index) => [name, aliasSources[index]]));
  const webkitRoots = new Set(leafStrings(themeSource.references));
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
  const definitions = new Map();
  css.walkDecls((declaration) => {
    if (!declaration.prop.startsWith('--')) return;
    const values = definitions.get(declaration.prop) ?? [];
    values.push(declaration.value);
    definitions.set(declaration.prop, values);
  });

  for (const scope of themeSource.scopedDefaults) {
    assert.ok(scope.reason);
    for (const [property, value] of Object.entries(scope.declarations)) {
      let generated = false;
      css.walkRules(scope.selector, (rule) => {
        generated ||= rule.nodes.some(
          (node) => node.type === 'decl' && node.prop === property && node.value === value,
        );
      });
      assert.equal(generated, true, `${scope.selector} must generate ${property}`);
    }
  }

  const rawMappings = [
    themeSource.mui.typography.fontFamily,
    ...Object.values(themeSource.mui.palette).flatMap((palette) => Object.values(palette)),
  ];
  for (const mapping of rawMappings)
    assert.ok(
      definitions
        .get(mapping.variable)
        ?.some((value) => normalizeCssValue(value) === normalizeCssValue(mapping.value)),
      `${mapping.variable} must equal ${mapping.value}`,
    );
  assert.ok(themeSource.mui.typography.fontSize.reason);
  assert.ok(themeSource.mui.shape.borderRadius.reason);

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
