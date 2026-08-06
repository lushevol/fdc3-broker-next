import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(absolutePath)));
    if (entry.isFile()) files.push(absolutePath);
  }
  return files.sort();
}

const files = [
  ...(await listFiles(path.join(packageRoot, 'dist'))),
  ...[
    'LICENSE',
    'README.md',
    'deviation-manifest.json',
    'migration-map.json',
    'package.json',
    'parity-manifest.json',
    'sbom.cdx.json',
    'tokens.json',
  ].map((file) => path.join(packageRoot, file)),
];
const integrity = {};
for (const file of files) {
  const relativePath = path.relative(packageRoot, file).split(path.sep).join('/');
  integrity[relativePath] = createHash('sha256').update(await readFile(file)).digest('hex');
}
await writeFile(
  path.join(packageRoot, 'package-integrity.json'),
  `${JSON.stringify({ algorithm: 'sha256', files: integrity }, null, 2)}\n`,
);
process.stdout.write(`Generated integrity metadata for ${files.length} package files.\n`);
