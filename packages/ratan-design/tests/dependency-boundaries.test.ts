import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';

const forbiddenDependency = /^(?:antd|@ant-design\/|ag-grid|@module-federation\/|single-spa|systemjs|@fm\/ratan-(?:sdk|ui))/;
const forbiddenImport = /from\s+['"](?:antd|@ant-design\/[^'"]+|ag-grid[^'"]*|@module-federation\/[^'"]+|single-spa|systemjs|@fm\/ratan-(?:sdk|ui)[^'"]*)['"]/g;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.tsx', '.js', '.jsx'].includes(extname(entry.name)) ? [path] : [];
  });
}

describe('production design dependency boundaries', () => {
  it('contains no forbidden runtime or domain dependencies', () => {
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.peerDependencies,
      ...packageJson.optionalDependencies,
    };
    expect(Object.keys(dependencies).filter((name) => forbiddenDependency.test(name))).toEqual([]);
  });

  it('contains no forbidden source imports', () => {
    const root = resolve(process.cwd(), 'src');
    const violations = sourceFiles(root).flatMap((path) => {
      const matches = [...readFileSync(path, 'utf8').matchAll(forbiddenImport)];
      return matches.map((match) => `${path.slice(root.length + 1)}: ${match[0]}`);
    });
    expect(violations).toEqual([]);
  });
});
