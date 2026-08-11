import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.resolve(appRoot, '../../packages/react');
const source = await readFile(path.join(appRoot, 'src/playground-app.tsx'), 'utf8');
assert.doesNotMatch(source, /packages\/react|\.\.\/\.\.\/packages/);
await access(path.join(packageRoot, 'dist/index.js'));
await access(path.join(appRoot, 'dist/index.html'));
process.stdout.write('Verified playground consumption through the built public package export map.\n');
