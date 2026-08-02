import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('keeps the host identity path free of legacy, credential, storage, and domain concerns', () => {
  const identitySource = ['identity.ts', 'App.tsx', 'bootstrap.tsx']
    .map((file) => readFileSync(resolve(process.cwd(), 'src', file), 'utf8'))
    .join('\n');
  const hostSource = readFileSync(resolve(process.cwd(), 'src/PortalHost.tsx'), 'utf8');
  const forbiddenEverywhere = [
    ['mfe-ratan', 'container'].join('-'),
    ['ratan', 'container'].join('_'),
    'getUser',
    'hasPermission',
    'SET_TOKEN',
    'Single-UI-Authorization',
    'accessToken',
    'refreshToken',
    'AuthorizationLimits',
    'authorization-limits',
    'profileLimitation',
  ];
  expect(forbiddenEverywhere.filter((reference) =>
    `${identitySource}\n${hostSource}`.includes(reference))).toEqual([]);
  expect(['localStorage', 'sessionStorage'].filter((reference) =>
    identitySource.includes(reference))).toEqual([]);
});

it('keeps Ratan as shared code rather than a Portal Host application dependency', () => {
  const registry = JSON.parse(
    readFileSync(resolve(process.cwd(), 'public/registry.json'), 'utf8'),
  ) as { applications: Array<{ id: string; manifestUrl: string }> };
  const cashflowPackage = JSON.parse(
    readFileSync(
      resolve(process.cwd(), '../mfe-cashflow-blotter-mvp/package.json'),
      'utf8',
    ),
  ) as { dependencies: Record<string, string> };
  const cashflowFederation = readFileSync(
    resolve(
      process.cwd(),
      '../mfe-cashflow-blotter-mvp/module-federation.config.ts',
    ),
    'utf8',
  );

  expect(
    registry.applications.filter(
      ({ id, manifestUrl }) =>
        /ratan.*(?:container|migration)/i.test(id) || /:9205\//.test(manifestUrl),
    ),
  ).toEqual([]);
  expect(cashflowPackage.dependencies).toMatchObject({
    '@fm/ratan-data-grid': expect.any(String),
    '@fm/ratan-design-webkit': expect.any(String),
  });
  expect(cashflowFederation).not.toMatch(/\bremotes\s*:/);
});
