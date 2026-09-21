import assert from 'node:assert/strict';
import test from 'node:test';

import {
  OPTIONAL_PEERS,
  REQUIRED_PEERS,
  verifyHostDependencies,
} from './verify-dependency-isolation.mjs';

const designManifest = {
  peerDependencies: {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    '@mui/material': '^5.18.0',
    '@mui/icons-material': '^5.18.0',
    '@emotion/react': '^11.14.0',
    '@emotion/styled': '^11.14.1',
    '@mui/x-date-pickers': '~6.20.2',
    '@mui/x-date-pickers-pro': '~6.20.2',
    '@mui/x-data-grid': '~6.20.4',
    '@mui/base': '5.0.0-beta.70',
    dayjs: '^1.11.21',
  },
  peerDependenciesMeta: Object.fromEntries(
    [
      '@mui/x-date-pickers',
      '@mui/x-date-pickers-pro',
      '@mui/x-data-grid',
      '@mui/base',
      'dayjs',
    ].map((packageName) => [packageName, { optional: true }]),
  ),
};

const coreVersions = {
  react: '18.3.1',
  'react-dom': '18.3.1',
  '@mui/material': '5.18.0',
  '@mui/icons-material': '5.18.0',
  '@emotion/react': '11.14.0',
  '@emotion/styled': '11.14.1',
};

function createHostFixture(overrides = {}) {
  const dependencies = Object.fromEntries(
    Object.entries(coreVersions).map(([packageName, version]) => [packageName, `^${version}`]),
  );
  const resolutions = Object.fromEntries(
    Object.entries(coreVersions).map(([packageName, version]) => [
      packageName,
      {
        version,
        hostPath: `/host/node_modules/${packageName}`,
        packagePath: `/host/node_modules/${packageName}`,
      },
    ]),
  );

  return {
    name: 'Fixture host',
    dependencies,
    resolutions,
    ...overrides,
  };
}

test('exports the complete required and optional peer sets', () => {
  assert.deepEqual(REQUIRED_PEERS, [
    'react',
    'react-dom',
    '@mui/material',
    '@mui/icons-material',
    '@emotion/react',
    '@emotion/styled',
  ]);
  assert.deepEqual(OPTIONAL_PEERS, [
    '@mui/x-date-pickers',
    '@mui/x-date-pickers-pro',
    '@mui/x-data-grid',
    '@mui/base',
    'dayjs',
  ]);
});

test('accepts supported core peers when host and package imports share instances', () => {
  const result = verifyHostDependencies(createHostFixture(), designManifest);

  assert.deepEqual(result.failures, []);
  assert.equal(result.checked.required, REQUIRED_PEERS.length);
  assert.equal(result.checked.optional, 0);
});

test('rejects a core version below the supported peer range', () => {
  const fixture = createHostFixture();
  fixture.dependencies['@mui/material'] = '^5.10.13';
  fixture.resolutions['@mui/material'].version = '5.17.9';

  const result = verifyHostDependencies(fixture, designManifest);

  assert(
    result.failures.some(
      (failure) =>
        failure.includes('@mui/material@5.17.9') && failure.includes('ratan-design-origin ^5.18.0'),
    ),
  );
});

test('rejects a missing required production dependency', () => {
  const fixture = createHostFixture();
  delete fixture.dependencies.react;
  delete fixture.resolutions.react;

  const result = verifyHostDependencies(fixture, designManifest);

  assert(result.failures.includes('Fixture host must declare required dependency react'));
});

test('rejects split host and package resolution for a core peer', () => {
  const fixture = createHostFixture();
  fixture.resolutions.react.packagePath = '/design/node_modules/react';

  const result = verifyHostDependencies(fixture, designManifest);

  assert(
    result.failures.some((failure) =>
      failure.includes('Fixture host resolves react to duplicate instances'),
    ),
  );
});

test('allows optional integrations to be absent even when incidentally resolvable', () => {
  const fixture = createHostFixture({
    incidentalOptionalPackages: OPTIONAL_PEERS,
  });

  const result = verifyHostDependencies(fixture, designManifest);

  assert.deepEqual(result.failures, []);
  assert.equal(result.checked.optional, 0);
});

test('validates a declared optional integration against the package peer range', () => {
  const fixture = createHostFixture();
  fixture.dependencies['@mui/x-data-grid'] = '^6.19.0';
  fixture.resolutions['@mui/x-data-grid'] = {
    version: '6.19.0',
    hostPath: '/host/node_modules/@mui/x-data-grid',
    packagePath: '/host/node_modules/@mui/x-data-grid',
  };

  const result = verifyHostDependencies(fixture, designManifest);

  assert(
    result.failures.some(
      (failure) =>
        failure.includes('@mui/x-data-grid@6.19.0') &&
        failure.includes('ratan-design-origin ~6.20.4'),
    ),
  );
});

test('preserves exact prerelease peer contracts', () => {
  const fixture = createHostFixture();
  fixture.dependencies['@mui/base'] = '5.0.0-dev.20240529-082515-213b5e33ab';
  fixture.resolutions['@mui/base'] = {
    version: '5.0.0-dev.20240529-082515-213b5e33ab',
    hostPath: '/host/node_modules/@mui/base',
    packagePath: '/host/node_modules/@mui/base',
  };

  const result = verifyHostDependencies(fixture, designManifest);

  assert(
    result.failures.some((failure) =>
      failure.includes('does not satisfy ratan-design-origin 5.0.0-beta.70'),
    ),
  );
});

test("rejects an installed version outside the host's declared range", () => {
  const fixture = createHostFixture();
  fixture.dependencies.react = '~18.2.0';

  const result = verifyHostDependencies(fixture, designManifest);

  assert(
    result.failures.some(
      (failure) => failure.includes('react@18.3.1') && failure.includes('host declaration ~18.2.0'),
    ),
  );
});
