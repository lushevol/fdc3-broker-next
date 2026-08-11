import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

it('uses the origin WebKit public boundary for every host UI import', () => {
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
  const integration = readFileSync(resolve(process.cwd(), 'src', 'webkit.ts'), 'utf8');

  expect(source).not.toContain("from '@fm/ratan-design'");
  expect(source).not.toContain("import '@fm/ratan-design/styles.css'");
  expect(source).toContain("from './webkit'");
  expect(integration).toContain("from '@scdevkit/webkit/react'");
  expect(integration).not.toContain('@fm/ratan-design-webkit');
});

it('registers origin WebKit elements idempotently across federated bundles', () => {
  const elementsDirectory = resolve(process.cwd(), '../../../../../sc-dev-web/sc-dev-web/elements');
  const registrationSources = readdirSync(elementsDirectory)
    .filter((file) => file.endsWith('.ts') && file !== 'define-element.ts')
    .map((file) => readFileSync(resolve(elementsDirectory, file), 'utf8'))
    .filter((source) => source.includes('customElements.define'));

  expect(registrationSources).toEqual([]);

  const componentsDirectory = resolve(elementsDirectory, '../src/components');
  const decoratorSources = readdirSync(componentsDirectory, { recursive: true })
    .filter((file) => String(file).endsWith('.ts'))
    .map((file) => readFileSync(resolve(componentsDirectory, String(file)), 'utf8'))
    .filter((source) =>
      /import[^;]*customElement[^;]*from ['"]lit\/decorators\.js['"]/.test(source),
    );

  expect(decoratorSources).toEqual([]);
});
