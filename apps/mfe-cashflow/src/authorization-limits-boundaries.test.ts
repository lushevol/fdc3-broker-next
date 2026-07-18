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
    for (const component of [
      'Dialog',
      'ConfirmationDialog',
      'TextField',
      'NumberField',
      'Button',
      'InlineAlert',
    ]) {
      expect(source).toContain(component);
    }
  });
});
