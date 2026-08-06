import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  BASELINE_COMMIT,
  BASELINE_PACKAGE_VERSION,
  buildBaseline,
  buildGeneratedTextArtifacts,
} from '../scripts/generate-baseline.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(currentDirectory, '../../../..');
const packageRoot = path.join(repositoryRoot, 'ratan-design/packages/react');

test('captures the frozen WebKit catalogue without unresolved classifications', async () => {
  const baseline = await buildBaseline({ repositoryRoot });

  assert.equal(baseline.baseline.repositoryCommit, BASELINE_COMMIT);
  assert.equal(baseline.baseline.packageVersion, BASELINE_PACKAGE_VERSION);
  assert.deepEqual(baseline.precedence, [
    'observed-runtime',
    'tests-and-source',
    'application-usage',
    'storybook',
    'documentation',
  ]);
  assert.equal(baseline.components.length, 136);
  assert.equal(baseline.summary.unresolved, 0);
  assert.deepEqual(
    baseline.components
      .filter((component) => component.classification === 'excluded')
      .map((component) => component.legacy.tag)
      .sort(),
    [
      'sc-dashboard-viewer',
      'sc-document-image-viewer',
      'sc-rich-text-editor',
      'sc-tour',
    ],
  );

  const button = baseline.components.find(
    (component) => component.legacy.tag === 'sc-button',
  );
  assert.ok(button);
  assert.equal(button.react.component, 'Button');
  assert.equal(button.react.subpath, './button');
  assert.equal(
    button.react.props.find((property) => property.legacyProperty === 'type')
      ?.reactProp,
    'variant',
  );
  assert.deepEqual(button.contract.variants, [
    'primary',
    'secondary',
    'text',
    'link',
  ]);
  assert.deepEqual(button.contract.tones, [
    'default',
    'error',
    'alert',
    'success',
  ]);
  assert.deepEqual(button.contract.sizes, ['xxs', 'xs', 'sm', 'md', 'lg']);

  const card = baseline.components.find(
    (component) => component.legacy.tag === 'sc-card',
  );
  assert.ok(card);
  assert.ok(
    card.contract.properties.some((property) => property.legacyProperty === 'title'),
  );
  assert.ok(
    card.contract.properties.every(
      (property) => !['titleSlot', 'renderTagsGroup'].includes(property.legacyProperty),
    ),
  );

  const textInput = baseline.components.find(
    (component) => component.legacy.tag === 'sc-text-input',
  );
  assert.ok(textInput);
  assert.deepEqual(
    textInput.contract.events.map((event) => event.legacyEvent),
    [
      'sc-blur',
      'sc-bubble-input',
      'sc-clear',
      'sc-focus',
      'sc-input',
      'sc-locale-status',
      'sc-mouseleave',
      'sc-mouseover',
    ],
  );
  assert.deepEqual(
    textInput.contract.slots.map((slot) => slot.legacySlot),
    [
      'default',
      'error',
      'error-icon',
      'form-control',
      'help',
      'label',
      'label-hint',
      'label-tooltip',
      'prefix',
      'success',
      'suffix',
    ],
  );
  assert.deepEqual(textInput.contract.methods, []);
  assert.deepEqual(
    textInput.react.callbacks.map((event) => event.reactCallback),
    [
      'onBlur',
      'onBubbleInput',
      'onClear',
      'onFocus',
      'onValueChange',
      'onLocaleStatus',
      'onMouseLeave',
      'onMouseOver',
    ],
  );
  assert.equal(
    textInput.react.composition.find((slot) => slot.legacySlot === 'default')
      ?.reactComposition,
    'children',
  );
  assert.equal(
    textInput.react.composition.find((slot) => slot.legacySlot === 'error-icon')
      ?.reactComposition,
    'errorIcon',
  );
  assert.equal(
    textInput.react.composition.find((slot) => slot.legacySlot === 'error')
      ?.reactComposition,
    'errorContent',
  );
  assert.equal(
    textInput.react.composition.find((slot) => slot.legacySlot === 'success')
      ?.reactComposition,
    'successContent',
  );
});

test('captures every public source export and classifies supporting exports', async () => {
  const baseline = await buildBaseline({ repositoryRoot });

  assert.equal(baseline.exports.length, 105);
  assert.equal(
    baseline.exports.filter((entry) => entry.classification === 'unresolved').length,
    0,
  );
  assert.equal(
    baseline.exports.find((entry) => entry.name === 'ScDashboardViewer')
      ?.classification,
    'excluded',
  );
  assert.equal(
    baseline.exports.find((entry) => entry.name === 'FormInputBase')
      ?.classification,
    'supporting-only',
  );
});

test('captures exact style, font, icon, and token inventories', async () => {
  const baseline = await buildBaseline({ repositoryRoot });

  assert.equal(baseline.assets.styles.length, 12);
  assert.equal(baseline.assets.fonts.length, 48);
  assert.equal(baseline.assets.icons.length, 207);
  assert.ok(baseline.assets.styles.every((asset) => asset.sha256.length === 64));
  assert.ok(baseline.assets.fonts.every((asset) => asset.sha256.length === 64));
  assert.ok(baseline.assets.icons.every((asset) => asset.sha256.length === 64));
  assert.ok(baseline.tokens.length > 2_000);
  assert.ok(baseline.tokens.every((token) => token.name.startsWith('--sc-')));
  assert.ok(baseline.tokens.some((token) => token.name === '--sc-font-family'));
  assert.ok(
    baseline.tokens.some(
      (token) => token.name === '--sc-button-primary-background-color',
    ),
  );
});

test('writes deterministic checked-in artifacts and frozen assets', async () => {
  const expectedArtifacts = buildGeneratedTextArtifacts(
    await buildBaseline({ repositoryRoot }),
  );

  const firstManifest = await readFile(
    path.join(packageRoot, 'parity-manifest.json'),
    'utf8',
  );
  const fixtureMatrixPath = path.join(
    repositoryRoot,
    'ratan-design/apps/parity-lab/fixtures/fixture-matrix.json',
  );
  const firstFixtureMatrix = await readFile(fixtureMatrixPath, 'utf8');

  assert.equal(
    await readFile(path.join(packageRoot, 'parity-manifest.json'), 'utf8'),
    expectedArtifacts.get('ratan-design/packages/react/parity-manifest.json'),
  );
  assert.equal(
    await readFile(path.join(packageRoot, 'tokens.json'), 'utf8'),
    expectedArtifacts.get('ratan-design/packages/react/tokens.json'),
  );
  assert.equal(
    await readFile(path.join(packageRoot, 'deviation-manifest.json'), 'utf8'),
    expectedArtifacts.get('ratan-design/packages/react/deviation-manifest.json'),
  );
  assert.equal(
    await readFile(fixtureMatrixPath, 'utf8'),
    expectedArtifacts.get('ratan-design/apps/parity-lab/fixtures/fixture-matrix.json'),
  );

  const parsed = JSON.parse(firstManifest);
  assert.equal(parsed.summary.unresolved, 0);
  const fixtureMatrix = JSON.parse(firstFixtureMatrix);
  assert.equal(fixtureMatrix.fixtures.length, parsed.components.length);
  assert.ok(
    fixtureMatrix.fixtures.every(
      (fixture) =>
        fixture.states.includes('default') &&
        fixture.runtimeFixture.startsWith('runtime/') &&
        fixture.reactFixture.startsWith('react/'),
    ),
  );
  assert.equal(
    await readFile(
      path.join(packageRoot, 'src/styles/frozen/ScLightMode.css'),
      'utf8',
    ),
    await readFile(
      path.join(
        repositoryRoot,
        'sc-dev-web/sc-dev-web/public/styles/ScLightMode.css',
      ),
      'utf8',
    ),
  );
});
