import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');

it('uses only ratan-design-webkit for application UI components', () => {
  const source = fs.readdirSync(path.join(root, 'src'))
    .filter((file) => !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')))
    .map((file) => fs.readFileSync(path.join(root, 'src', file), 'utf8'))
    .join('\n');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
    dependencies: Record<string, string>;
  };

  expect(source).not.toContain("from '@fm/ratan-design'");
  expect(source).not.toContain("import '@fm/ratan-design/styles.css'");
  expect(source).not.toContain("from '@mui/");
  expect(source).toContain("from '@fm/ratan-design-webkit/react'");
  expect(manifest.dependencies).toHaveProperty('@fm/ratan-design-webkit');
  expect(manifest.dependencies).not.toHaveProperty('@fm/ratan-design');
  expect(manifest.dependencies).not.toHaveProperty('@mui/material');
  expect(manifest.dependencies).not.toHaveProperty('@emotion/react');
  expect(manifest.dependencies).not.toHaveProperty('@emotion/styled');
});
