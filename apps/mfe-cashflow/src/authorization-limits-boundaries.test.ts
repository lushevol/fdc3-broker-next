import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Authorization Limits policy and service boundaries', () => {
  it.each(['authorization-limits-policy.ts', 'authorization-limits-service.ts'])(
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
});
