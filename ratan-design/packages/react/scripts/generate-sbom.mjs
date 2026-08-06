import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(packageRoot, '../../..');
const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const foundationPackage = JSON.parse(
  await readFile(path.join(packageRoot, '../foundation/package.json'), 'utf8'),
);
const dataGridPackage = JSON.parse(
  await readFile(path.join(packageRoot, '../data-grid/package.json'), 'utf8'),
);
const packageLock = JSON.parse(
  await readFile(path.join(repositoryRoot, 'package-lock.json'), 'utf8'),
);
const lockPackages = packageLock.packages ?? {};
const components = [];
const seen = new Set();
const pending = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(foundationPackage.dependencies ?? {}),
  ...Object.keys(dataGridPackage.dependencies ?? {}).filter(
    (dependency) => !dependency.startsWith('@fm/ratan-design-'),
  ),
];

while (pending.length > 0) {
  const name = pending.pop();
  if (!name || seen.has(name)) continue;
  seen.add(name);
  const suffix = `node_modules/${name}`;
  const candidates = Object.entries(lockPackages).filter(([key]) => key.endsWith(suffix));
  const entry = candidates.find(([key]) => key === suffix)?.[1] ?? candidates[0]?.[1];
  if (!entry) throw new Error(`Missing lockfile entry for ${name}`);
  components.push({
    type: 'library',
    name,
    version: entry.version,
    purl: `pkg:npm/${encodeURIComponent(name)}@${entry.version}`,
  });
  pending.push(...Object.keys(entry.dependencies ?? {}));
  pending.push(...Object.keys(entry.optionalDependencies ?? {}));
}

components.sort((left, right) => left.name.localeCompare(right.name));
const sbom = {
  bomFormat: 'CycloneDX',
  specVersion: '1.5',
  serialNumber: `urn:uuid:00000000-0000-5000-8000-${Buffer.from(
    `${packageJson.name}@${packageJson.version}`,
  )
    .toString('hex')
    .slice(0, 12)
    .padEnd(12, '0')}`,
  version: 1,
  metadata: {
    component: {
      type: 'library',
      name: packageJson.name,
      version: packageJson.version,
      purl: `pkg:npm/${encodeURIComponent(packageJson.name)}@${packageJson.version}`,
    },
  },
  components,
};

await writeFile(path.join(packageRoot, 'sbom.cdx.json'), `${JSON.stringify(sbom, null, 2)}\n`);
process.stdout.write(`Generated CycloneDX SBOM with ${components.length} components.\n`);
