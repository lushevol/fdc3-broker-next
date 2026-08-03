import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('package boundaries', () => {
  it('uses community peers and no legacy/runtime/design coupling', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.peerDependencies).toMatchObject({ 'ag-grid-community': expect.any(String), 'ag-grid-react': expect.any(String), react: expect.any(String) });
    expect({ ...pkg.dependencies, ...pkg.peerDependencies, ...pkg.devDependencies }).not.toHaveProperty('ag-grid-enterprise');
    const source = `${readFileSync('src/index.tsx', 'utf8')}\n${readFileSync('src/styles.css', 'utf8')}`;
    expect(source).not.toMatch(/antd|single-spa|systemjs|module-federation|ratan[_-]container|@fm\/ratan-design|src\/Root/i);
    expect(source).not.toMatch(/export\s+.*(?:GridApi|GridOptions|AgGridReact)/);
    expect(source).not.toMatch(/ModuleRegistry|ClientSideRowModelModule/);
  });

  it('keeps theme selectors scoped and covers both densities', () => {
    const css = readFileSync('src/styles.css', 'utf8');
    expect(css).not.toMatch(/(^|[}\s,])(html|body|:root|\*)\s*[{,]/m);
    expect(css).toContain('[data-ratan-density="compact"] .ratan-data-grid');
    expect(css).toContain('[data-ratan-density="comfortable"] .ratan-data-grid');
  });
});
