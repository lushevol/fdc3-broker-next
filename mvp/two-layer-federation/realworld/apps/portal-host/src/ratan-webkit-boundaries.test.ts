import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('uses the Ratan WebKit public boundary for every host UI import', () => {
  const sourceFiles = [
    'App.tsx',
    'ApplicationBoundary.tsx',
    'LoginScreen.tsx',
    'PortalHost.tsx',
    'RemoteApplication.tsx',
    'bootstrap.tsx',
  ];
  const source = sourceFiles
    .map((file) => readFileSync(resolve(process.cwd(), 'src', file), 'utf8'))
    .join('\n');

  expect(source).not.toContain("from '@fm/ratan-design'");
  expect(source).not.toContain("import '@fm/ratan-design/styles.css'");
  expect(source).toContain('@fm/ratan-design-webkit');
});
