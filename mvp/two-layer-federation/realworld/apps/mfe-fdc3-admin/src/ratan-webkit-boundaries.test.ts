import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');

it('uses only ratan-design-webkit for application UI components', () => {
  const source = fs.readFileSync(path.join(root, 'src/application.tsx'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  };

  expect(source).not.toContain("from '@fm/ratan-design'");
  expect(source).not.toContain("import '@fm/ratan-design/styles.css'");
  expect(source).toContain("from './webkit'");
  expect(manifest.dependencies).toHaveProperty('@fm/ratan-design-webkit');
  expect(manifest.dependencies).not.toHaveProperty('@fm/ratan-design');
});
