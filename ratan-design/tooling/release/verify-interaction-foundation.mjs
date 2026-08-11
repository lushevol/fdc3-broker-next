import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ratanRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const exceptionRoot = path.join(ratanRoot, 'packages/foundation/exceptions');
const exceptionManifest = JSON.parse(
  await readFile(path.join(exceptionRoot, 'interaction-exceptions.json'), 'utf8'),
);

assert.equal(exceptionManifest.schemaVersion, 1);
assert.ok(Array.isArray(exceptionManifest.exceptions));
const approvedFiles = new Set();
for (const exception of exceptionManifest.exceptions) {
  for (const field of ['id', 'file', 'capability', 'rationale', 'approvedBy', 'adr']) {
    assert.equal(typeof exception[field], 'string', `Exception ${exception.id} requires ${field}`);
    assert.ok(exception[field].trim(), `Exception ${exception.id} has empty ${field}`);
  }
  assert.ok(exception.tests?.length > 0, `Exception ${exception.id} requires tests`);
  await readFile(path.join(ratanRoot, exception.adr));
  for (const test of exception.tests) await readFile(path.join(ratanRoot, test));
  approvedFiles.add(exception.file);
}

async function listSourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (
      entry.isDirectory() &&
      !['.tsbuild', 'coverage', 'dist', 'node_modules', 'test', 'tests'].includes(
        entry.name,
      )
    ) {
      files.push(...(await listSourceFiles(absolutePath)));
    }
    if (entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name)) files.push(absolutePath);
  }
  return files;
}

const violations = [];
for (const file of await listSourceFiles(path.join(ratanRoot, 'packages'))) {
  const relativePath = path.relative(ratanRoot, file).split(path.sep).join('/');
  const source = await readFile(file, 'utf8');
  const isFoundationAdapter = relativePath === 'packages/foundation/src/index.ts';
  if (
    !isFoundationAdapter &&
    /from\s+["'](?:react-aria(?:-components)?|@react-aria\/[^"']+)["']/.test(source)
  ) {
    violations.push(`${relativePath}: imports React Aria outside the foundation adapter`);
  }
  if (approvedFiles.has(relativePath)) continue;
  const manualPatterns = [
    [/(?:onKeyDown|onKeyUp)\s*=/, 'keyboard-navigation'],
    [/(?:onPointerDown|onPointerUp|onMouseDown|onMouseUp)\s*=/, 'press'],
    [/addEventListener\(\s*["'](?:key|pointer|mouse)/, 'global-interaction-listener'],
    [/removeEventListener\(\s*["'](?:key|pointer|mouse)/, 'global-interaction-listener'],
    [/from\s+["'](?:focus-trap|focus-trap-react)["']/, 'focus'],
  ];
  for (const [pattern, capability] of manualPatterns) {
    if (pattern.test(source)) {
      violations.push(
        `${relativePath}: hand-written ${capability} behavior requires an approved exception`,
      );
    }
  }
}

assert.deepEqual(violations, [], violations.join('\n'));
process.stdout.write(
  `Verified React Aria interaction boundaries with ${exceptionManifest.exceptions.length} approved exceptions.\n`,
);
