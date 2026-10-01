import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const parse = (text) =>
  ts.createSourceFile('catalog.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const isVisualName = (name) => /^[A-Z]/.test(name) && !/^[A-Z_]+$/.test(name);

export function getVisualExports(text) {
  const names = [];
  for (const statement of parse(text).statements) {
    if (
      ts.isExportDeclaration(statement) &&
      !statement.isTypeOnly &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      names.push(
        ...statement.exportClause.elements
          .filter((item) => !item.isTypeOnly)
          .map((item) => item.name.text),
      );
    } else if (
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (ts.isVariableStatement(statement)) {
        names.push(
          ...statement.declarationList.declarations
            .filter((item) => ts.isIdentifier(item.name))
            .map((item) => item.name.text),
        );
      } else if (ts.isFunctionDeclaration(statement) && statement.name)
        names.push(statement.name.text);
    }
  }
  return names.filter(isVisualName);
}

export function getStoryImports(text) {
  const source = parse(text);
  const references = new Set();
  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isTypeNode(node)) return;
    if (ts.isIdentifier(node)) references.add(node.text);
    ts.forEachChild(node, visit);
  }
  visit(source);
  return source.statements.filter(ts.isImportDeclaration).flatMap((statement) => {
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly || !clause.namedBindings) return [];
    const bindings = clause.namedBindings;
    const names = ts.isNamespaceImport(bindings)
      ? references.has(bindings.name.text)
        ? ['*']
        : []
      : bindings.elements
          .filter((item) => !item.isTypeOnly && references.has(item.name.text))
          .map((item) => item.propertyName?.text ?? item.name.text);
    return [{ entry: statement.moduleSpecifier.text, names }];
  });
}

export function findMissingCoverage(expected, used) {
  return used.has('*') ? [] : expected.filter((name) => !used.has(name));
}

function verifyCatalog() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const index = JSON.parse(readFileSync(join(root, 'storybook-static/index.json'), 'utf8'));
  const entries = Object.values(index.entries).filter((entry) => entry.type === 'story');
  assert.ok(entries.length > 0, 'Build Storybook before checking coverage');
  const sources = new Map();
  for (const file of readdirSync(join(root, 'stories')).filter((name) =>
    name.endsWith('.stories.tsx'),
  )) {
    const path = join(root, 'stories', file);
    const matching = entries.filter((entry) => entry.importPath.endsWith(`/stories/${file}`));
    assert.ok(matching.length, `${file} has no built stories`);
    sources.set(file, getStoryImports(readFileSync(path, 'utf8')));
  }
  const report = {};
  for (const entry of [
    'index',
    'primitives',
    'icons',
    'data-grid',
    'dates',
    'date-range',
    'compatibility',
    'base-compat',
    'theme/index',
  ]) {
    const path = ['ts', 'tsx']
      .map((extension) => join(root, 'src', `${entry}.${extension}`))
      .find(existsSync);
    const expected = getVisualExports(readFileSync(path, 'utf8'));
    const used = new Set();
    for (const imports of sources.values()) {
      for (const imported of imports) {
        const normalized =
          imported.entry.replace(/^\.\.\/src\/?/, '').replace(/\.(js|tsx?)$/, '') || 'index';
        if (normalized === entry || (entry === 'theme/index' && normalized === 'theme'))
          imported.names.forEach((name) => used.add(name));
      }
    }
    const missing = findMissingCoverage(expected, used);
    assert.deepEqual(missing, [], `${entry}: public visual exports missing from story examples`);
    report[entry] = expected;
  }
  console.log(
    JSON.stringify(
      { storyFiles: sources.size, stories: entries.length, components: report },
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  verifyCatalog();
