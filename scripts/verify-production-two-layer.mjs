import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['apps/portal-host', 'apps/mfe-cashflow'];
const forbidden = [
  /-poc\b/i,
  /single-spa/i,
  /systemjs/i,
  /importmap/i,
  /@fm\/base/i,
  /mfe-ratan-container/i,
  /ratan[_-]container/i,
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
  const dependencyNames = Object.keys(packageJson.dependencies ?? {});
  for (const dependency of dependencyNames) {
    if (forbidden.some((pattern) => pattern.test(dependency))) {
      throw new Error(`${root} has forbidden dependency ${dependency}`);
    }
  }

  const paths = (await filesBelow(root)).filter((path) =>
    /\.(?:ts|tsx|css|json)$/.test(path) && !/(?:dist|coverage|node_modules)\//.test(path),
  );
  for (const path of paths) {
    const source = await readFile(path, 'utf8');
    for (const pattern of forbidden) {
      if (pattern.test(source)) throw new Error(`${path} contains forbidden runtime reference ${pattern}`);
    }
  }

  const federation = await readFile(join(root, 'module-federation.config.ts'), 'utf8');
  const sharedBlock = federation.slice(federation.indexOf('shared:'));
  for (const forbiddenShare of ['@fm/ratan-design', '@mui/material', '@emotion/react', '@emotion/styled']) {
    if (sharedBlock.includes(forbiddenShare)) throw new Error(`${root} runtime-shares ${forbiddenShare}`);
  }
  if (!/react:\s*{[^}]*singleton:\s*true/s.test(sharedBlock)
    || !/['"]react-dom['"]:\s*{[^}]*singleton:\s*true/s.test(sharedBlock)) {
    throw new Error(`${root} must share React and ReactDOM as singletons`);
  }
}

const applicationCss = await readFile('apps/mfe-cashflow/src/styles.css', 'utf8');
if (/(^|[}\s,])(html|body|:root|\*)\s*[{,]/m.test(applicationCss)) {
  throw new Error('Cashflow application CSS owns a document-global selector');
}

console.log(JSON.stringify({
  verified: true,
  runtimeLayers: ['portal-host', 'federated-application'],
  singletonShares: ['react', 'react-dom'],
  productionPackages: ['@fm/platform-contracts', '@fm/platform-sdk', '@fm/ratan-design'],
}));
