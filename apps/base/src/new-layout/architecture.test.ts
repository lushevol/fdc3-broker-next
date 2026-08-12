import fs from 'node:fs';
import path from 'node:path';

const SOURCE_ROOT = path.resolve(process.cwd(), 'src');
const NEW_LAYOUT_ROOT = path.join(SOURCE_ROOT, 'new-layout');
const PRODUCTION_FILE = /\.(?:css|ts|tsx)$/;
const TEST_FILE = /\.(?:test|spec)\.(?:ts|tsx)$/;

const walk = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(entryPath);
    return PRODUCTION_FILE.test(entry.name) && !TEST_FILE.test(entry.name) ? [entryPath] : [];
  });

const findProductionMatchesOutsideNewLayout = (pattern: RegExp): string[] =>
  walk(SOURCE_ROOT)
    .filter((filePath) => !filePath.startsWith(NEW_LAYOUT_ROOT))
    .filter((filePath) => pattern.test(fs.readFileSync(filePath, 'utf8')))
    .map((filePath) => path.relative(SOURCE_ROOT, filePath))
    .sort();

describe('new-layout module boundary', () => {
  it('keeps feature flag reads inside the new-layout gateway', () => {
    expect(findProductionMatchesOutsideNewLayout(/new-layout|useIsNewLayout/)).toEqual([]);
  });

  it('keeps SC Dev WebKit imports and opt-in selectors inside new-layout', () => {
    expect(
      findProductionMatchesOutsideNewLayout(/@scdevkit\/webkit|base-webkit-scope/),
    ).toEqual([]);
  });
});
