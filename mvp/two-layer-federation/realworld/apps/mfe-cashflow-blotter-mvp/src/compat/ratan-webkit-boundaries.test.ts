import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('uses the WebKit package boundary for the application shell', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/application.tsx'), 'utf8');

  expect(source).not.toContain("from '@fm/ratan-design'");
  expect(source).not.toContain("import '@fm/ratan-design/styles.css'");
  expect(source).toContain('@fm/ratan-design-webkit');
});
