import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const sourceRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const appearanceEntries = [
  'pages/Home/index.tsx',
  'pages/Login/index.tsx',
  'theme/index.tsx',
  'components/AppBar/index.tsx',
  'components/Avatar/index.tsx',
  'components/Drawer/index.tsx',
  'components/Empty/index.tsx',
  'components/Profile/index.tsx',
  'components/NewTile/index.tsx',
  'components/Switch/index.tsx',
  'components/SwitchTime/index.tsx',
  'components/TabItem/index.tsx',
];

function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? sources(path)
      : /\.(tsx?|css)$/.test(path) && !/\.(test|spec|stories)\./.test(path)
        ? [path]
        : [];
  });
}

describe('new-styles implementation boundary', () => {
  it.each(appearanceEntries)('%s only delegates its public appearance contract', (path) => {
    const source = ts.createSourceFile(
      path,
      readFileSync(join(sourceRoot, path), 'utf8'),
      ts.ScriptTarget.Latest,
      true,
    );
    expect(
      source.statements.every(
        (statement) =>
          ts.isExportDeclaration(statement) &&
          statement.moduleSpecifier?.getText(source).includes('new-styles/'),
      ),
    ).toBe(true);
  });

  it('keeps runtime appearance selection inside new-styles', () => {
    const violations: string[] = [];
    for (const path of sources(sourceRoot).filter(
      (path) => !relative(sourceRoot, path).startsWith('new-styles/'),
    )) {
      if (path.endsWith('.css')) continue;
      const source = ts.createSourceFile(
        path,
        readFileSync(path, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
      );
      const visit = (node: ts.Node) => {
        if (
          (ts.isPropertyAccessExpression(node) && node.name.text === 'newStyles') ||
          (ts.isStringLiteral(node) && ['new-styles', 'login-theme'].includes(node.text))
        )
          violations.push(relative(sourceRoot, path));
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    expect([...new Set(violations)]).toEqual([]);
  });

  it('uses supported ratan-design-origin APIs for UI dependencies', () => {
    const violations: string[] = [];
    for (const path of sources(join(sourceRoot, 'new-styles'))) {
      const text = readFileSync(path, 'utf8');
      if (/from\s+['"](?:@mui\/|@emotion\/|@scdevkit\/)|@import\s+['"]@scdevkit\//.test(text))
        violations.push(relative(sourceRoot, path));
    }
    expect(violations).toEqual([]);
  });
});
