import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const vid = '\0highlightjs-line-numbers.js';
/**
 * @type {import('rollup').Plugin}
 */
const plugin = {
  name: 'sheet',
  resolveId(source) {
    if (source === 'highlightjs-line-numbers.js') {
      return vid;
    }
    return null;
  },
  load(id) {
    if (id === vid) {
      const pkgRoot = dirname(require.resolve('highlightjs-line-numbers.js/package.json'));
      const code = readFileSync(join(pkgRoot, 'dist/highlightjs-line-numbers.min.js'), 'utf-8');
      return `export default function () {
        ${code}
      }`;
    }
  },
};
export default function sheet() {
  return plugin;
}
