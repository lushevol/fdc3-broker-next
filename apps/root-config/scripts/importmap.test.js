const fs = require('fs');
const path = require('path');

const readImportMap = (fileName) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public', fileName), 'utf8'));

describe('MFE import maps', () => {
  const localImportMap = readImportMap('importmaplocal.json');
  const prodImportMap = readImportMap('importmap.json');

  it('routes ratan container, cashflow blotter, and flowzero to their local dev bundles', () => {
    expect(localImportMap.imports['@fm/ratan_container']).toBe(
      '//localhost:8009/ratan_container.js',
    );
    expect(localImportMap.imports['@fm/ratan_cashflow_blotter']).toBe(
      '//localhost:8015/ratan_cashflow_blotter.js',
    );
    expect(localImportMap.imports['@fm/flowzero']).toBe('//localhost:8016/flowzero.js');
  });

  it('routes ratan container, cashflow blotter, and flowzero to their production bundles', () => {
    expect(prodImportMap.imports['@fm/ratan_container']).toBe(
      '/ratan_container/ratan_container.js',
    );
    expect(prodImportMap.imports['@fm/ratan_cashflow_blotter']).toBe(
      '/ratan_cashflow_blotter/ratan_cashflow_blotter.js',
    );
    expect(prodImportMap.imports['@fm/flowzero']).toBe('/flowzero/flowzero.js');
  });
});
