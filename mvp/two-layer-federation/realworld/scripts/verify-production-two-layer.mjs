import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const applicationRoots = [
  'mvp/two-layer-federation/realworld/apps/portal-host',
  'mvp/two-layer-federation/realworld/apps/mfe-cashflow',
];
const packageRoots = [
  'mvp/two-layer-federation/realworld/packages/platform-contracts',
  'mvp/two-layer-federation/realworld/packages/platform-sdk',
  'mvp/two-layer-federation/realworld/packages/ratan-design',
  'mvp/two-layer-federation/realworld/packages/ratan-data-grid',
];
const roots = [...applicationRoots, ...packageRoots];
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
    if (forbidden.some((pattern) => pattern.test(dependency))) {
      throw new Error(`${root} has forbidden dependency ${dependency}`);
    }
  }

  const paths = (await filesBelow(join(root, 'src'))).filter((path) =>
    /\.(?:ts|tsx|css|json)$/.test(path),
  );
  for (const path of paths) {
    const source = await readFile(path, 'utf8');
    for (const pattern of forbidden) {
      if (pattern.test(source)) throw new Error(`${path} contains forbidden runtime reference ${pattern}`);
    }
  }
}

for (const root of applicationRoots) {
  const federation = await readFile(join(root, 'module-federation.config.ts'), 'utf8');
  const sharedBlock = federation.slice(federation.indexOf('shared:'));
  for (const forbiddenShare of ['@fm/ratan-design', '@fm/ratan-data-grid', '@mui/material', '@emotion/react', '@emotion/styled', 'ag-grid-community', 'ag-grid-react']) {
    if (sharedBlock.includes(forbiddenShare)) throw new Error(`${root} runtime-shares ${forbiddenShare}`);
  }
  if (!/react:\s*{[^}]*singleton:\s*true/s.test(sharedBlock)
    || !/['"]react-dom['"]:\s*{[^}]*singleton:\s*true/s.test(sharedBlock)) {
    throw new Error(`${root} must share React and ReactDOM as singletons`);
  }
}

const applicationCss = await readFile(
  'mvp/two-layer-federation/realworld/apps/mfe-cashflow/src/styles.css',
  'utf8',
);
if (/(^|[}\s,])(html|body|:root|\*)\s*[{,]/m.test(applicationCss)) {
  throw new Error('Cashflow application CSS owns a document-global selector');
}

console.log(JSON.stringify({
  verified: true,
  runtimeLayers: ['portal-host', 'federated-application'],
  singletonShares: ['react', 'react-dom'],
  productionPackages: ['@fm/platform-contracts', '@fm/platform-sdk', '@fm/ratan-design', '@fm/ratan-data-grid'],
}));
