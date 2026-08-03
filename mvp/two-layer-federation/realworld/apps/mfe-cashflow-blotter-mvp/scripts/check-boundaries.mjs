import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourceRoot = join(root, 'src');
const distRoot = join(root, 'dist');

async function filesAt(path) {
  const details = await stat(path);
  if (details.isFile()) return [path];
  const entries = await readdir(path, { withFileTypes: true });
  return (
    await Promise.all(entries.map((entry) => filesAt(join(path, entry.name))))
  ).flat();
}

const sourceFiles = (await filesAt(sourceRoot)).filter((file) =>
  ['.ts', '.tsx', '.js', '.mjs'].includes(extname(file)),
);
const builtFiles = (await filesAt(distRoot)).filter((file) =>
  ['.js', '.json', '.html'].includes(extname(file)),
);

const violations = [];
const applicationRuntimePatterns = [
  ['Single-SPA', /\bsingle-spa\b/i],
  ['SystemJS application import', /\bSystem\s*\.\s*import\s*\(/],
  ['SystemJS global', /\bSystemJS\b/],
  ['import-map runtime', /\bimportmap\b|\bimport-map\b/i],
];
const builtLegacyPatterns = [
  ['legacy base shell', /@fm\/base\b/],
  ['legacy Ratan container', /@fm\/ratan_container\b/],
  ['legacy Cashflow runtime', /@fm\/ratan_cashflow(?:_blotter)?\b/],
  ['legacy Trades runtime', /@fm\/ratan_trades\b/],
  ['Single-SPA runtime', /\bsingle-spa\b/i],
];

for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  for (const [label, pattern] of applicationRuntimePatterns) {
    if (pattern.test(source)) {
      violations.push(`${relative(root, file)}: ${label}`);
    }
  }
}

for (const file of builtFiles) {
  const source = await readFile(file, 'utf8');
  for (const [label, pattern] of builtLegacyPatterns) {
    if (pattern.test(source)) {
      violations.push(`${relative(root, file)}: ${label}`);
    }
  }
}

const rsbuildConfig = await readFile(join(root, 'rsbuild.config.ts'), 'utf8');
for (const [legacyName, adapterPath] of [
  ['@fm/base', 'src/compat/base.tsx'],
  ['@fm/ratan_container', 'src/compat/ratan-container.ts'],
  ['stompjs', 'src/compat/stomp.ts'],
]) {
  const hasAlias =
    rsbuildConfig.includes(`'${legacyName}'`) ||
    rsbuildConfig.includes(`${legacyName}:`);
  if (!hasAlias || !rsbuildConfig.includes(adapterPath)) {
    violations.push(`rsbuild.config.ts: missing compile-time adapter for ${legacyName}`);
  }
}

if (violations.length > 0) {
  throw new Error(`Cashflow CN migration boundary violations:\n${violations.join('\n')}`);
}

console.info(
  `Cashflow CN boundary check passed (${sourceFiles.length} source files, ${builtFiles.length} built files).`,
);
console.info(
  'Note: Module Federation runtime may contain its own generic SystemJS loader; application source contains no System.import.',
);
