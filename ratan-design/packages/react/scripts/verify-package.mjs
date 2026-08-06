import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
if (packageJson.license !== 'UNLICENSED') {
  throw new Error('Restricted Ratan releases must declare the UNLICENSED license.');
}
if (packageJson.publishConfig?.tag !== 'next') {
  throw new Error('Alpha Ratan releases must publish under the next tag.');
}
await access(path.join(packageRoot, 'LICENSE'));
const forbiddenDependencies = [
  '@emotion/react',
  '@emotion/styled',
  '@lit/react',
  '@mui/material',
  '@scdevkit/webkit',
  '@shoelace-style/shoelace',
  'antd',
  'lit',
];

if (!packageJson.sideEffects?.includes('**/*.css')) {
  throw new Error('Package metadata must preserve CSS side effects.');
}

for (const dependency of forbiddenDependencies) {
  if (packageJson.dependencies?.[dependency]) {
    throw new Error(`Forbidden production dependency: ${dependency}`);
  }
}

const repositoryRoot = path.resolve(packageRoot, '../../..');
const packageLock = JSON.parse(
  await readFile(path.join(repositoryRoot, 'package-lock.json'), 'utf8'),
);
const foundationPackage = JSON.parse(
  await readFile(path.join(packageRoot, '../foundation/package.json'), 'utf8'),
);
const dataGridPackage = JSON.parse(
  await readFile(path.join(packageRoot, '../data-grid/package.json'), 'utf8'),
);
const lockPackages = packageLock.packages ?? {};
const productionClosure = new Set();
const pendingDependencies = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(foundationPackage.dependencies ?? {}),
  ...Object.keys(dataGridPackage.dependencies ?? {}).filter(
    (dependency) => !dependency.startsWith('@fm/ratan-design-'),
  ),
];
while (pendingDependencies.length > 0) {
  const dependency = pendingDependencies.pop();
  if (!dependency || productionClosure.has(dependency)) continue;
  productionClosure.add(dependency);
  const suffix = `node_modules/${dependency}`;
  const candidates = Object.entries(lockPackages).filter(([key]) =>
    key.endsWith(suffix),
  );
  const lockEntry =
    candidates.find(([key]) => key === suffix)?.[1] ?? candidates[0]?.[1];
  for (const child of Object.keys(lockEntry?.dependencies ?? {})) {
    pendingDependencies.push(child);
  }
  for (const child of Object.keys(lockEntry?.optionalDependencies ?? {})) {
    pendingDependencies.push(child);
  }
}
for (const dependency of forbiddenDependencies) {
  if (productionClosure.has(dependency)) {
    throw new Error(`Forbidden transitive production dependency: ${dependency}`);
  }
}

const exportTargets = new Set();
for (const value of Object.values(packageJson.exports)) {
  if (typeof value === 'string') exportTargets.add(value);
  if (value && typeof value === 'object') {
    for (const target of Object.values(value)) exportTargets.add(target);
  }
}
for (const target of exportTargets) {
  await access(path.join(packageRoot, target));
}

const manifest = JSON.parse(
  await readFile(path.join(packageRoot, 'parity-manifest.json'), 'utf8'),
);
if (manifest.summary.unresolved !== 0) {
  throw new Error(`Parity manifest contains ${manifest.summary.unresolved} unresolved entries.`);
}

const buttonWrapper = await readFile(
  path.join(packageRoot, 'dist/button-with-style.js'),
  'utf8',
);
if (!buttonWrapper.includes("import './button.css'")) {
  throw new Error('Button subpath does not load its static CSS side effect.');
}

const dialogWrapper = await readFile(
  path.join(packageRoot, 'dist/dialog-with-style.js'),
  'utf8',
);
if (!dialogWrapper.includes("import './dialog.css'")) {
  throw new Error('Dialog subpath does not load its static CSS side effect.');
}

const dataGridWrapper = await readFile(
  path.join(packageRoot, 'dist/data-grid-with-style.js'),
  'utf8',
);
if (!dataGridWrapper.includes("import './data-grid.css'")) {
  throw new Error('DataGrid subpath does not load its static CSS side effect.');
}

const datePickerWrapper = await readFile(
  path.join(packageRoot, 'dist/date-picker-with-style.js'),
  'utf8',
);
if (!datePickerWrapper.includes("import './date-picker.css'")) {
  throw new Error('DatePicker subpath does not load its static CSS side effect.');
}

const rootWrapper = await readFile(
  path.join(packageRoot, 'dist/index-with-style.js'),
  'utf8',
);
if (!rootWrapper.includes("import './index.css'")) {
  throw new Error('Root entry point does not load its static CSS side effect.');
}

const tabsWrapper = await readFile(
  path.join(packageRoot, 'dist/tabs-with-style.js'),
  'utf8',
);
if (!tabsWrapper.includes("import './tabs.css'")) {
  throw new Error('Tabs subpath does not load its static CSS side effect.');
}

const textInputWrapper = await readFile(
  path.join(packageRoot, 'dist/text-input-with-style.js'),
  'utf8',
);
if (!textInputWrapper.includes("import './text-input.css'")) {
  throw new Error('TextInput subpath does not load its static CSS side effect.');
}

const rootBundle = await readFile(path.join(packageRoot, 'dist/index.js'), 'utf8');
if (/data-grid|@tanstack/.test(rootBundle)) {
  throw new Error('Root entry point contains DataGrid implementation code.');
}
const buttonBundle = await readFile(path.join(packageRoot, 'dist/button.js'), 'utf8');
if (/text-input|data-grid|@tanstack/.test(buttonBundle)) {
  throw new Error('Button subpath contains unrelated component code.');
}
const dialogBundle = await readFile(path.join(packageRoot, 'dist/dialog.js'), 'utf8');
if (/text-input|data-grid|@tanstack/.test(dialogBundle)) {
  throw new Error('Dialog subpath contains unrelated component code.');
}
const datePickerBundle = await readFile(
  path.join(packageRoot, 'dist/date-picker.js'),
  'utf8',
);
if (/text-input|data-grid|@tanstack/.test(datePickerBundle)) {
  throw new Error('DatePicker subpath contains unrelated component code.');
}
const textInputBundle = await readFile(
  path.join(packageRoot, 'dist/text-input.js'),
  'utf8',
);
if (/data-grid|@tanstack/.test(textInputBundle)) {
  throw new Error('TextInput subpath contains unrelated DataGrid code.');
}
const tabsBundle = await readFile(path.join(packageRoot, 'dist/tabs.js'), 'utf8');
if (/date-picker|data-grid|@tanstack/.test(tabsBundle)) {
  throw new Error('Tabs subpath contains unrelated component code.');
}

async function verifyCssImports(cssFile) {
  const css = await readFile(cssFile, 'utf8');
  for (const match of css.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)) {
    if (/^https?:/.test(match[1])) {
      throw new Error(`External runtime CSS import: ${match[1]}`);
    }
    if (match[1].startsWith('data:')) continue;
    await access(path.resolve(path.dirname(cssFile), match[1]));
  }
}

async function listRuntimeFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listRuntimeFiles(absolutePath)));
    if (entry.isFile() && /(?:\.css|\.js|\.d\.ts)$/.test(entry.name)) files.push(absolutePath);
  }
  return files;
}

await verifyCssImports(path.join(packageRoot, 'dist/styles.css'));
await verifyCssImports(path.join(packageRoot, 'dist/themes/light.css'));
await verifyCssImports(path.join(packageRoot, 'dist/themes/dark.css'));
await verifyCssImports(path.join(packageRoot, 'dist/themes/cpbb.css'));

for (const runtimeFile of await listRuntimeFiles(path.join(packageRoot, 'dist'))) {
  const content = await readFile(runtimeFile, 'utf8');
  if (content.includes('@fm/ratan-design-')) {
    throw new Error(
      `Unresolved private workspace reference in ${path.relative(packageRoot, runtimeFile)}`,
    );
  }
  const externalCssAsset =
    runtimeFile.endsWith('.css') && /(?:@import\s+|url\()\s*["']?https?:\/\//.test(content);
  const externalJavaScriptAsset =
    runtimeFile.endsWith('.js') &&
    /(?:import\s*\(|fetch\s*\(|new\s+URL\s*\()["']https?:\/\//.test(content);
  if (externalCssAsset || externalJavaScriptAsset) {
    throw new Error(`External runtime URL in ${path.relative(packageRoot, runtimeFile)}`);
  }
  for (const dependency of forbiddenDependencies) {
    const escapedDependency = dependency.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const importPattern = new RegExp(
      `(?:from\\s*|import\\s*\\(|require\\s*\\()["']${escapedDependency}(?:/|["'])`,
    );
    if (runtimeFile.endsWith('.js') && importPattern.test(content)) {
      throw new Error(
        `Forbidden dependency marker ${dependency} in ${path.relative(packageRoot, runtimeFile)}`,
      );
    }
  }
}

const sbom = JSON.parse(await readFile(path.join(packageRoot, 'sbom.cdx.json'), 'utf8'));
if (
  sbom.bomFormat !== 'CycloneDX' ||
  sbom.metadata?.component?.name !== packageJson.name ||
  sbom.metadata?.component?.version !== packageJson.version
) {
  throw new Error('SBOM metadata does not match the package release.');
}
const integrity = JSON.parse(
  await readFile(path.join(packageRoot, 'package-integrity.json'), 'utf8'),
);
if (integrity.algorithm !== 'sha256') {
  throw new Error('Package integrity metadata must use SHA-256.');
}
for (const [relativePath, expectedHash] of Object.entries(integrity.files ?? {})) {
  const actualHash = createHash('sha256')
    .update(await readFile(path.join(packageRoot, relativePath)))
    .digest('hex');
  if (actualHash !== expectedHash) {
    throw new Error(`Package integrity mismatch: ${relativePath}`);
  }
}

process.stdout.write('Verified Ratan package boundaries and static assets.\n');
