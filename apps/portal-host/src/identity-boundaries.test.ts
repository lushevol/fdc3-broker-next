import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('keeps the host identity path free of legacy, credential, storage, and domain concerns', () => {
  const source = ['identity.ts', 'App.tsx', 'PortalHost.tsx', 'bootstrap.tsx']
    .map((file) => readFileSync(resolve(process.cwd(), 'src', file), 'utf8'))
    .join('\n');
  const forbidden = [
    'mfe-ratan-container',
    'ratan_container',
    'getUser',
    'hasPermission',
    'SET_TOKEN',
    'localStorage',
    'sessionStorage',
    'Single-UI-Authorization',
    'accessToken',
    'refreshToken',
    'AuthorizationLimits',
    'authorization-limits',
    'profileLimitation',
  ];
  expect(forbidden.filter((reference) => source.includes(reference))).toEqual([]);
});
