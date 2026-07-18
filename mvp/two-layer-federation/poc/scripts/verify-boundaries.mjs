import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const roots = [
  'mvp/two-layer-federation/poc/apps/portal-host-poc',
  'mvp/two-layer-federation/poc/apps/mfe-cashflow-poc',
  'mvp/two-layer-federation/poc/packages/platform-contracts-poc',
  'mvp/two-layer-federation/poc/packages/platform-sdk-poc',
  'mvp/two-layer-federation/poc/packages/ratan-sdk-poc',
  'mvp/two-layer-federation/poc/packages/ratan-design-poc',
  'mvp/two-layer-federation/poc/packages/ratan-ui-poc',
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
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  if (!manifest.name.endsWith('-poc')) {
    throw new Error(`${root} must retain a -poc package identity`);
  }
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.peerDependencies,
  };
  for (const dependency of Object.keys(dependencies)) {
    if (dependency.startsWith('@fm/') && !dependency.endsWith('-poc')) {
      throw new Error(`${root} depends on non-POC FM package ${dependency}`);
    }
  }
  const paths = (await filesBelow(root)).filter((path) =>
    /\.(?:ts|tsx|css|json)$/.test(path) && !/(?:dist|coverage|node_modules|\.turbo)\//.test(path),
  );
  for (const path of paths) {
    const source = await readFile(path, 'utf8');
    if (/mvp\/two-layer-federation\/realworld|\.\.\/\.\.\/realworld/.test(source)) {
      throw new Error(`${path} crosses into the realworld track`);
    }
  }
}

console.log(JSON.stringify({
  verified: true,
  track: 'poc',
  workspaces: roots.length,
  packageIdentity: '*-poc',
}));
