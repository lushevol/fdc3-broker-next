import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(appRoot, '../../..');
const manifest = JSON.parse(
  await readFile(path.join(appRoot, 'docs/ORIGIN_COPY_MANIFEST.json'), 'utf8'),
);
const originalRoot = path.join(repoRoot, manifest.sourcePath);
const sha256 = (content) => createHash('sha256').update(content).digest('hex');
const failures = [];

for (const [relativePath, expectedHash] of Object.entries(manifest.files)) {
  try {
    const actualHash = sha256(await readFile(path.join(originalRoot, relativePath)));
    if (actualHash !== expectedHash) failures.push(`Original changed: ${relativePath}`);
  } catch {
    failures.push(`Original missing: ${relativePath}`);
  }
}

for (const relativePath of manifest.protectedWorkflowFiles) {
  try {
    let copiedContent = await readFile(path.join(appRoot, relativePath));
    const importRewrites = manifest.protectedWorkflowPresentationRewrites[relativePath];
    if (importRewrites) {
      let copiedText = copiedContent.toString('utf8');
      for (const { from, to } of importRewrites) copiedText = copiedText.split(to).join(from);
      copiedContent = Buffer.from(copiedText, 'utf8');
    }
    const copiedHash = sha256(copiedContent);
    if (copiedHash !== manifest.files[relativePath]) failures.push(`Workflow changed: ${relativePath}`);
  } catch {
    failures.push(`Workflow missing: ${relativePath}`);
  }
}

const rootSource = await readFile(path.join(appRoot, 'src/root.tsx'), 'utf8');
const namespacePattern = /export\s+\*\s+as\s+(\w+)\s+from\s+["']([^"']+)["']/g;
const namespaces = Object.fromEntries(
  [...rootSource.matchAll(namespacePattern)].map((match) => [match[1], match[2]]),
);
for (const [name, source] of Object.entries(manifest.rootNamespaces)) {
  if (namespaces[name] !== source) failures.push(`Root namespace changed: ${name}`);
}
for (const name of manifest.rootLifecycleExports) {
  const declaration = new RegExp(`export\\s+(?:const|function)\\s+${name}\\b`);
  const destructuredDeclaration = new RegExp(`export\\s+const\\s+\\{[^}]*\\b${name}\\b[^}]*\\}`);
  if (!declaration.test(rootSource) && !destructuredDeclaration.test(rootSource)) {
    failures.push(`Root lifecycle missing: ${name}`);
  }
}

const ignoredDirectories = new Set([
  'node_modules', 'dist', 'dist-development', 'dist-host', 'dist-host-production', 'coverage', '.git', '.cache', 'test-results', 'playwright-report',
]);
const ignoredFiles = new Set(['.DS_Store', 'docs/ORIGIN_COPY_DIFF.json']);
async function collectFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (ignoredFiles.has(relativePath) || ignoredDirectories.has(entry.name) || entry.isSymbolicLink()) {
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...await collectFiles(path.join(directory, entry.name), relativePath));
    } else if (entry.isFile()) {
      files.push(relativePath);
    }
  }
  return files.sort();
}

const copiedPaths = await collectFiles(appRoot);
const copiedSet = new Set(copiedPaths);
const modified = [];
const added = [];
let unchanged = 0;
for (const relativePath of copiedPaths) {
  const expectedHash = manifest.files[relativePath];
  if (!expectedHash) added.push(relativePath);
  else if (sha256(await readFile(path.join(appRoot, relativePath))) === expectedHash) unchanged++;
  else modified.push(relativePath);
}
const missing = Object.keys(manifest.files).filter((relativePath) => !copiedSet.has(relativePath));
if (missing.length) failures.push(...missing.map((relativePath) => `Copied source missing: ${relativePath}`));
const report = {
  sourceCommit: manifest.sourceCommit,
  sourcePath: manifest.sourcePath,
  copyPath: manifest.copyPath,
  sourceFilesVerified: Object.keys(manifest.files).length,
  originalSourceUnchanged: !failures.some((failure) => failure.startsWith('Original')),
  originalRootNamespacesPreserved: !failures.some((failure) => failure.startsWith('Root')),
  copiedWorkflowFilesVerified: manifest.protectedWorkflowFiles.length,
  copiedWorkflowBodiesUnchanged: !failures.some((failure) => failure.startsWith('Workflow')),
  permittedWorkflowPresentationRewrites: manifest.protectedWorkflowPresentationRewrites,
  copiedFiles: copiedPaths.length,
  unchanged,
  modified,
  added,
  missing,
};
if (process.argv.includes('--write-report')) {
  await writeFile(path.join(appRoot, 'docs/ORIGIN_COPY_DIFF.json'), `${JSON.stringify(report, null, 2)}\n`);
}
console.log(`Original: ${report.sourceFilesVerified} files verified at ${manifest.sourceCommit.slice(0, 8)}.`);
console.log(`Copy: ${unchanged} unchanged, ${modified.length} adapted, ${added.length} added, ${missing.length} missing.`);
console.log(`Root: ${Object.keys(manifest.rootNamespaces).length} original namespaces and ${manifest.rootLifecycleExports.length} lifecycle exports verified.`);
console.log(`Workflow: ${manifest.protectedWorkflowFiles.length} protected original implementations verified.`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
