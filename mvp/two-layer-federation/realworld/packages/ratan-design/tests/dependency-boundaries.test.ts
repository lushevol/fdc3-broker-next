import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';

const forbiddenDependency =
  /^(?:@mui\/|@emotion\/|antd|@ant-design\/|ag-grid|@module-federation\/|single-spa|systemjs|@fm\/ratan-(?:sdk|ui)|formik|react-hook-form|final-form|react-final-form)/;
const forbiddenImport =
  /from\s+['"](?:@mui\/[^'"]+|@emotion\/[^'"]+|antd|@ant-design\/[^'"]+|ag-grid[^'"]*|@module-federation\/[^'"]+|single-spa|systemjs|@fm\/ratan-(?:sdk|ui)[^'"]*|formik|react-hook-form|final-form|react-final-form|(?:\.\.\/)+\.\.\/apps\/[^'"]*)['"]/g;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(extname(entry.name))
      ? [path]
      : [];
  });
}

describe('production design dependency boundaries', () => {
  it('contains no forbidden runtime or domain dependencies', () => {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.peerDependencies,
      ...packageJson.optionalDependencies,
    };
    expect(
      Object.keys(dependencies).filter((name) =>
        forbiddenDependency.test(name),
      ),
    ).toEqual([]);
  });

  it('contains no forbidden source imports', () => {
    const root = resolve(process.cwd(), 'src');
    const violations = sourceFiles(root).flatMap((path) => {
      const matches = [...readFileSync(path, 'utf8').matchAll(forbiddenImport)];
      return matches.map(
        (match) => `${path.slice(root.length + 1)}: ${match[0]}`,
      );
    });
    expect(violations).toEqual([]);
  });

  it('publishes only the documented root and stylesheet entry points', () => {
    expect(Object.keys(packageJson.exports)).toEqual(['.', './styles.css']);
    const publicIndex = readFileSync(
      resolve(process.cwd(), 'src/index.ts'),
      'utf8',
    );
    expect(publicIndex).not.toMatch(/from\s+['"]@mui\//);
    expect(publicIndex).not.toMatch(/from\s+['"]@emotion\//);
    expect(publicIndex).not.toMatch(/styled|ThemeProvider|Mui[A-Z]|Aria[A-Z]/);
  });

  it('does not expose raw styling slots through new interaction props', () => {
    const interactionFiles = [
      'NumberField.tsx',
      'Dialog.tsx',
      'ConfirmationDialog.tsx',
      'InlineAlert.tsx',
    ].map((name) =>
      readFileSync(resolve(process.cwd(), 'src/components', name), 'utf8'),
    );
    for (const source of interactionFiles) {
      const publicInterface =
        source.match(/export interface [\s\S]*?\n}/)?.[0] ?? '';
      expect(publicInterface).not.toMatch(/\b(?:sx|slots|slotProps)\??:/);
    }
  });
});
