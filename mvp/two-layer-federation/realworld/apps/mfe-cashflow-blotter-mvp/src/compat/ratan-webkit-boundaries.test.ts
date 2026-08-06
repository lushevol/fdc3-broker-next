import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('does not depend on the retired local WebKit package', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/application.tsx'), 'utf8');

  expect(source).toContain("from '@fm/ratan-design-legacy'");
  expect(source).toContain("import '@fm/ratan-design-legacy/styles.css'");
  expect(source).not.toContain('@fm/ratan-design-webkit');
});
