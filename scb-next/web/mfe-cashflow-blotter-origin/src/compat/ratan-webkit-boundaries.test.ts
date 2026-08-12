import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('does not depend on the retired local WebKit package', () => {
  const source = [
    'vite.config.ts',
    'src/root.tsx',
    'src/compat/ratan-container.ts',
  ].map((file) => readFileSync(resolve(process.cwd(), file), 'utf8')).join('\n');

  expect(source).not.toContain('@fm/ratan-design-webkit');
});
