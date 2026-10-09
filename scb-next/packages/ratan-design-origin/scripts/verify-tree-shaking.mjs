import assert from 'node:assert/strict';
import { realpathSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const consumerRoot = resolve(process.argv[2] ?? join(packageRoot, '../..'));
const packageDist = realpathSync(join(consumerRoot, 'node_modules/ratan-design-origin/dist'));
const { build } = await import(
  pathToFileURL(join(consumerRoot, 'node_modules/vite/dist/node/index.js'))
);
const externalPeers = /^(?:react(?:-dom)?(?:\/|$)|@mui\/|@emotion\/|dayjs(?:\/|$))/;
const webkitDependencies = ['tokens/webkit.js', 'tokens/webkit-theme.generated.js'];
const dateDependencies = ['date-style.js', 'picker-slot-props.js', 'sx.js'];
const componentCases = [
  ['button', 'Button', ['Button.js']],
  ['loading-button', 'LoadingButton', ['LoadingButton.js', 'Button.js', 'loading-button-props.js']],
  ['input', 'Input', ['Input.js', 'input-style.js']],
  ['select', 'Select', ['Select.js', 'input-style.js']],
  ['search-input', 'SearchInput', ['SearchInput.js', 'Input.js', 'input-style.js', 'sx.js']],
  ['search-button', 'SearchButton', ['SearchButton.js', 'action-style.js', 'loading-button-props.js']],
  ['reset-button', 'ResetButton', ['ResetButton.js', 'action-style.js']],
  ['search-grid', 'SearchGrid', ['SearchGrid.js']],
  ['search-condition', 'SearchCondition', ['SearchCondition.js', ...webkitDependencies]],
  [
    'search-condition-container',
    'SearchConditionContainer',
    ['SearchConditionContainer.js', ...webkitDependencies],
  ],
  ['toggle-button', 'ToggleButton', ['ToggleButton.js', 'action-style.js']],
  ['label', 'Label', ['Label.js', 'LabelMenuItem.js']],
  ['label-menu-item', 'LabelMenuItem', ['LabelMenuItem.js']],
  ['loader', 'Loader', ['Loader.js', 'loader-style.js', ...webkitDependencies, 'tokens/legacy.js']],
  [
    'page-loader',
    'PageLoader',
    ['PageLoader.js', 'Loader.js', 'loader-style.js', ...webkitDependencies, 'tokens/legacy.js'],
  ],
  ['snackbar', 'Snackbar', ['Snackbar.js', ...webkitDependencies, 'tokens/legacy.js']],
  ['dialog', 'Dialog', ['Dialog.js', 'overlay-context.js']],
  ['empty-state', 'EmptyState', ['EmptyState.js']],
  ['error-fallback', 'ErrorFallback', ['ErrorFallback.js']],
  ['loading-overlay', 'LoadingOverlay', ['LoadingOverlay.js']],
  ['spinner', 'Spinner', ['Spinner.js']],
  [
    'builder-button',
    'BuilderButton',
    ['BuilderButton.js', 'builder-context.js', ...webkitDependencies],
  ],
  ['builder-tabs', 'BuilderTabs', ['BuilderTabs.js']],
  ['builder-tab', 'BuilderTab', ['BuilderTab.js', 'builder-context.js']],
  ['builder-tab-panel', 'BuilderTabPanel', ['BuilderTabPanel.js', 'builder-context.js']],
  ['date-picker', 'DatePicker', ['DatePicker.js', ...dateDependencies]],
  ['date-time-picker', 'DateTimePicker', ['DateTimePicker.js', ...dateDependencies]],
  ['time-picker', 'TimePicker', ['TimePicker.js', ...dateDependencies]],
  ['appearance', 'resolveRatanAppearance', ['appearance.js']],
  [
    'provider',
    'RatanDesignProvider',
    [
      'Provider.js',
      'overlay-context.js',
      'appearance.js',
      'theme.js',
      'theme/light.js',
      'theme/dark.js',
      'theme/options.js',
      'tokens/legacy.js',
      'tokens/compact.js',
      'tokens/webkit-theme.generated.js',
    ],
  ],
];

function packageModule(id) {
  if (id.includes('\0')) return undefined;
  const path = relative(packageDist, id).replaceAll('\\', '/');
  return path.startsWith('../') || path.startsWith('/') ? undefined : path;
}

const fixture = await mkdtemp(join(consumerRoot, '.tree-shaking-'));
try {
  async function compile(name, source) {
    const entry = join(fixture, `${name}.${name === 'type-only' ? 'ts' : 'js'}`);
    await writeFile(entry, source);
    const loaded = new Set();
    const result = await build({
      root: consumerRoot,
      configFile: false,
      logLevel: 'silent',
      plugins: [
        {
          name: 'record-package-module-graph',
          generateBundle() {
            for (const id of this.getModuleIds()) {
              const module = packageModule(id);
              if (module) loaded.add(module);
            }
          },
        },
      ],
      build: {
        write: false,
        lib: { entry, formats: ['es'] },
        rolldownOptions: { external: externalPeers },
      },
    });
    const output = (Array.isArray(result) ? result : [result]).flatMap((bundle) => bundle.output);
    const chunks = output.filter((item) => item.type === 'chunk');
    const rendered = new Set(
      chunks.flatMap((chunk) =>
        Object.entries(chunk.modules)
          .filter(([, module]) => (module.renderedLength ?? 0) > 0)
          .map(([id]) => packageModule(id))
          .filter(Boolean),
      ),
    );
    assert(
      !output.some((item) => item.type === 'asset'),
      `${name} loaded implicit CSS or font assets`,
    );
    return {
      loaded: [...loaded].sort(),
      rendered: [...rendered].sort(),
      code: chunks.map((item) => item.code).join('\n'),
    };
  }

  const absent = await compile('no-package', 'export const answer = 42;');
  assert.deepEqual(absent.loaded, [], 'No-import consumer loaded the package');
  const unused = await compile(
    'unused-button',
    "import { Button } from 'ratan-design-origin'; export const answer = 42;",
  );
  assert.deepEqual(unused.rendered, [], 'Unused package import retained runtime code');
  const typeOnly = await compile(
    'type-only',
    "import type { ButtonProps } from 'ratan-design-origin/button'; export const value: Pick<ButtonProps, 'disabled'> = { disabled: true };",
  );
  assert.deepEqual(typeOnly.loaded, [], 'Type-only import loaded runtime package code');

  for (const [subpath, symbol, dependencies] of componentCases) {
    const result = await compile(
      subpath,
      `export { ${symbol} } from 'ratan-design-origin/${subpath}';`,
    );
    assert.deepEqual(
      result.loaded,
      [...dependencies].sort(),
      `${subpath} loaded unrelated package modules`,
    );
    assert(result.code.includes(symbol), `${subpath} lost its requested export`);
    assert(
      result.rendered.every((module) => dependencies.includes(module)),
      `${subpath} retained unrelated code`,
    );
    console.log(
      `${subpath}: ${result.loaded.length} required package modules; no unrelated modules`,
    );
  }

  const builderHelper = await compile(
    'builder-helper',
    "export { builderTabProps } from 'ratan-design-origin/builder-tab';",
  );
  assert.deepEqual(
    builderHelper.loaded,
    ['BuilderTab.js', 'builder-context.js'],
    'Builder helper loaded unrelated package modules',
  );
  assert.deepEqual(
    builderHelper.rendered,
    ['builder-context.js'],
    'Builder helper retained the unused tab component',
  );

  const barrel = await compile('root-button', "export { Button } from 'ratan-design-origin';");
  assert.deepEqual(
    barrel.rendered,
    ['Button.js'],
    'Root Button import retained unrelated package code',
  );
  assert(
    Buffer.byteLength(barrel.code) <= 2_048,
    'Root Button exceeds the existing package-code budget',
  );
  const cssEntry = join(fixture, 'explicit-css.ts');
  await writeFile(cssEntry, "import 'ratan-design-origin/styles.css';");
  const cssBuild = await build({
    root: consumerRoot,
    configFile: false,
    logLevel: 'silent',
    build: { write: false, assetsInlineLimit: 0, rolldownOptions: { input: cssEntry } },
  });
  const cssAssets = (Array.isArray(cssBuild) ? cssBuild : [cssBuild])
    .flatMap((bundle) => bundle.output)
    .filter((item) => item.type === 'asset');
  assert(
    cssAssets.some((asset) => asset.fileName.endsWith('.css')),
    'Explicit CSS was tree-shaken away',
  );
  assert.equal(cssAssets.filter((asset) => asset.fileName.endsWith('.woff2')).length, 13);
  console.log('No-import, unused-import, type-only and root Button tree shaking verified.');
} finally {
  await rm(fixture, { recursive: true, force: true });
}
