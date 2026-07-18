import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Authorization Limits policy and service boundaries', () => {
  it.each(['authorization-limits-policy.ts', 'authorization-limits-service.ts'])(
    'keeps %s free of UI, transport, federation, and legacy globals',
    (file) => {
      const source = readFileSync(resolve(process.cwd(), 'src', file), 'utf8');
      expect(source).not.toMatch(
        /from\s+['"](?:react|@fm\/ratan-design|@fm\/ratan-data-grid|@mui\/|antd|axios|@module-federation\/|\.\/\.\.\/mfe-cashflow-blotter|src\/Root\/)/,
      );
      expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest|hasPermission|getUser|service\.(?:get|post|put|delete))\b/);
    },
  );
});
