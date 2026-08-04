import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const applicationRoots = [
  'mvp/two-layer-federation/realworld/apps/portal-host',
  'mvp/two-layer-federation/realworld/apps/mfe-cashflow',
  'mvp/two-layer-federation/realworld/apps/mfe-identity-profile',
  'mvp/two-layer-federation/realworld/apps/mfe-fdc3-admin',
  'mvp/two-layer-federation/realworld/apps/mfe-ratan-container-mvp',
  'mvp/two-layer-federation/realworld/apps/mfe-cashflow-blotter-mvp',
];
const packageRoots = [
  'mvp/two-layer-federation/realworld/packages/platform-contracts',
  'mvp/two-layer-federation/realworld/packages/platform-sdk',
  'mvp/two-layer-federation/realworld/packages/ratan-design',
  'mvp/two-layer-federation/realworld/packages/ratan-data-grid',
  'packages/sc-dev-web-rte',
  'packages/sc-dev-web',
];
const roots = [...applicationRoots, ...packageRoots];
const cashflowBlotterRoot =
  'mvp/two-layer-federation/realworld/apps/mfe-cashflow-blotter-mvp';
const compatibilityExceptions = new Map([
  [cashflowBlotterRoot, new Set(['antd'])],
]);
const forbidden = [
  /-poc\b/i,
  /single-spa/i,
  /systemjs/i,
  /importmap/i,
  /@fm\/base/i,
  /mfe-ratan-container/i,
  /ratan[_-]container/i,
  /\bantd\b/i,
  /src\/Root/i,
  /ag-grid-enterprise/i,
  /ratancomponents/i,
  /ratanutils/i,
  /two-layer-federation\/poc/i,
];

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  }));
  return nested.flat();
}

for (const root of roots) {
  const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  const dependencyNames = Object.keys({
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
    ...packageJson.devDependencies,
  });
  for (const dependency of dependencyNames) {
    const isCompatibilityException = compatibilityExceptions
      .get(root)
      ?.has(dependency);
    if (!isCompatibilityException && forbidden.some((pattern) => pattern.test(dependency))) {
      throw new Error(`${root} has forbidden dependency ${dependency}`);
    }
  }

  const paths = root === cashflowBlotterRoot
    ? []
    : (await filesBelow(join(root, 'src'))).filter((path) =>
      /\.(?:ts|tsx|css|json)$/.test(path),
    );
  for (const path of paths) {
    const source = await readFile(path, 'utf8');
    for (const pattern of forbidden) {
      if (pattern.test(source)) {
        throw new Error(`${path} contains forbidden runtime reference ${pattern}`);
      }
    }
  }
}

for (const root of applicationRoots) {
  const federation = await readFile(join(root, 'module-federation.config.ts'), 'utf8');
  const sharedBlock = federation.slice(federation.indexOf('shared:'));
  for (const forbiddenShare of ['@fm/ratan-design', '@fm/ratan-design-webkit', '@scdevkit/webkit', '@fm/ratan-data-grid', '@mui/material', '@emotion/react', '@emotion/styled', 'ag-grid-community', 'ag-grid-react']) {
    if (sharedBlock.includes(forbiddenShare)) throw new Error(`${root} runtime-shares ${forbiddenShare}`);
  }
  const hasSingletonReact = /react:\s*{[^}]*singleton:\s*true/s.test(sharedBlock)
    && /['"]react-dom['"]:\s*{[^}]*singleton:\s*true/s.test(sharedBlock);
  const ownsIsolatedReact = /shared:\s*{\s*}/s.test(sharedBlock);
  if (!hasSingletonReact && !ownsIsolatedReact) {
    throw new Error(`${root} must use singleton React or an isolated application root`);
  }
  if (ownsIsolatedReact && !root.endsWith('portal-host')) {
    const application = await readFile(join(root, 'src/application.tsx'), 'utf8');
    if (!/export function mount\b/.test(application)
      || !/export function unmount\b/.test(application)) {
      throw new Error(`${root} owns React but does not expose mount and unmount`);
    }
  }
}

for (const root of applicationRoots.filter((root) => !root.endsWith('portal-host'))) {
  const applicationCss = await readFile(join(root, 'src/styles.css'), 'utf8');
  if (/^\s*(?:html|body|:root|\*)(?:\s*,|\s*\{)/m.test(applicationCss)) {
    throw new Error(`${root} application CSS owns a document-global selector`);
  }
}

console.log(JSON.stringify({
  verified: true,
  runtimeLayers: ['portal-host', 'federated-application'],
  singletonShares: ['react', 'react-dom'],
  productionPackages: ['@fm/platform-contracts', '@fm/platform-sdk', '@fm/ratan-design', '@scdevkit/webkit', '@fm/ratan-data-grid'],
}));
