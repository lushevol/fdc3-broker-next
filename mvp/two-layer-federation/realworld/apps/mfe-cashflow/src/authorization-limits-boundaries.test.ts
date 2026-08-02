import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Authorization Limits policy and service boundaries', () => {
  it.each([
    'authorization-limits-policy.ts',
    'authorization-limits-service.ts',
    'authorization-limits-http-service.ts',
  ])(
    'keeps %s free of UI, transport, federation, and legacy globals',
    (file) => {
      const source = readFileSync(resolve(process.cwd(), 'src', file), 'utf8');
      const forbiddenReferences = [
        "from 'react",
        '@fm/ratan-design',
        '@fm/ratan-data-grid',
        '@mui/',
        ['an', 'td'].join(''),
        'axios',
        '@module-federation/',
        ['mfe-cashflow', 'blotter'].join('-'),
        ['src', 'Root'].join('/'),
        ['ratan', 'utils'].join(''),
        ['ratan', 'components'].join(''),
      ];
      expect(forbiddenReferences.filter((reference) => source.includes(reference))).toEqual([]);
      expect(source).not.toMatch(
        /\b(?:fetch|XMLHttpRequest|hasPermission|getUser|service\.(?:get|post|put|delete))\b/,
      );
    },
  );

  it('keeps create/edit composition on bounded production design APIs', () => {
    const source = [
      'AuthorizationLimits.tsx',
      'AuthorizationLimitEditor.tsx',
      'AuthorizationLimitTransitionDialog.tsx',
    ]
      .map((file) => readFileSync(resolve(process.cwd(), 'src', file), 'utf8'))
      .join('\n');
    const forbiddenReferences = [
      '@mui/',
      ['an', 'td'].join(''),
      ['src', 'Root'].join('/'),
      ['ratan', 'utils'].join(''),
      ['ratan', 'components'].join(''),
      'slotProps=',
      'sx=',
    ];
    expect(forbiddenReferences.filter((reference) => source.includes(reference))).toEqual([]);
    expect(source).not.toContain("from '@fm/ratan-design'");
    for (const component of [
      'ScDialog',
      'ScTextInput',
      'ScButton',
      'ScAlert',
    ]) {
      expect(source).toContain(component);
    }
  });

  it('keeps runtime composition application-owned and transport-neutral', () => {
    const runtime = readFileSync(resolve(process.cwd(), 'src/authorization-limits-runtime.ts'), 'utf8');
    const application = readFileSync(resolve(process.cwd(), 'src/application.tsx'), 'utf8');
    const forbiddenRuntimeReferences = [
      'fetch(',
      'XMLHttpRequest',
      'axios',
      'import.meta.env',
      'process.env',
      'localStorage',
      'authorization-limits-http-service',
      '@module-federation/',
    ];
    expect(forbiddenRuntimeReferences.filter((reference) => runtime.includes(reference))).toEqual([]);
    expect(application).not.toContain('authorization-limits-http-service');
    expect(application).toMatch(/export const Application = createCashflowApplication\(\);/);
  });

  it('keeps Authorization Limits domain types out of the host and platform packages', () => {
    const sources = [
      resolve(process.cwd(), '../portal-host/src'),
      resolve(process.cwd(), '../../packages/platform-contracts/src'),
      resolve(process.cwd(), '../../packages/platform-sdk/src'),
    ].flatMap((directory) => [
      resolve(directory, 'index.ts'),
      resolve(directory, 'PortalHost.tsx'),
    ]).filter((file) => {
      try { readFileSync(file); return true; } catch { return false; }
    }).map((file) => readFileSync(file, 'utf8')).join('\n');
    expect(sources).not.toMatch(/AuthorizationLimits|authorization-limits|profileLimitation/);
  });
});
