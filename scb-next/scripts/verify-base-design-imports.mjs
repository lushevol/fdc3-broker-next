import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import ts from 'typescript';

const base = new URL('../web/mfe-base-origin/', import.meta.url).pathname;
const design = new URL('../packages/ratan-design-origin/src/', import.meta.url).pathname;
const failures = [];

function* files(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(filename);
    else yield filename;
  }
}

function inspect(filename, source, forbidden, allowThemeAugmentation = false) {
  const parsed = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true,
    /\.tsx$|\.jsx$/.test(filename) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(node) {
    if (allowThemeAugmentation && ts.isModuleDeclaration(node)
      && ts.isStringLiteral(node.name) && node.name.text === '@mui/material/styles') return;
    if (ts.isStringLiteral(node) && forbidden(node.text)) {
      const { line } = parsed.getLineAndCharacterOfPosition(node.getStart(parsed));
      failures.push(`${filename}:${line + 1}: ${node.text}`);
    }
    ts.forEachChild(node, visit);
  }
  visit(parsed);
}

for (const directory of ['src', 'stories', '.storybook']) {
  for (const filename of files(join(base, directory))) {
    const extension = extname(filename);
    if (extension === '.mdx') {
      const source = readFileSync(filename, 'utf8');
      if (source.includes('@mui/')) failures.push(`${filename}: direct MUI example import`);
    } else if (['.ts', '.tsx', '.js', '.jsx'].includes(extension)) {
      inspect(filename, readFileSync(filename, 'utf8'), value => value.startsWith('@mui/'),
        filename === join(base, 'src/@types/index.d.ts'));
    }
  }
}

for (const filename of files(design)) {
  if (!['.ts', '.tsx', '.js', '.jsx'].includes(extname(filename))) continue;
  inspect(filename, readFileSync(filename, 'utf8'), value =>
    value.startsWith('@fm/') || value.startsWith('scb-next/web/') || value.startsWith('@/'));
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Base UI imports resolve through Ratan Design; package source has no application imports.');
}
