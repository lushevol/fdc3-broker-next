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
