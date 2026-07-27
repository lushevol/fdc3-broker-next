import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const realworldRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(realworldRoot, '../../..');
const baseRoot = resolve(repositoryRoot, 'apps/base/src');
const ledgerPath = resolve(realworldRoot, 'docs/base-ui-coverage.json');

async function directoryNames(path) {
  return (await readdir(path, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

const ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));
if (ledger.schemaVersion !== 1 || !Array.isArray(ledger.entries)) {
  throw new Error('Base UI coverage ledger has an unsupported schema.');
}

const sources = ledger.entries.map((entry) => entry.source);
const duplicates = sources.filter(
  (source, index) => sources.indexOf(source) !== index,
);
if (duplicates.length > 0) {
  throw new Error(`Base UI coverage ledger has duplicates: ${duplicates.join(', ')}`);
}

const componentDirectories = (await directoryNames(resolve(baseRoot, 'components')))
  .filter((name) => name !== 'ChatbotSidebarV2')
  .map((name) => `components/${name}`);
const pageDirectories = (await directoryNames(resolve(baseRoot, 'pages')))
  .map((name) => `pages/${name}`);
const adminDirectories = (await directoryNames(resolve(baseRoot, 'admin')))
  .map((name) => `admin/${name}`);
const expected = [
  ...componentDirectories,
  ...pageDirectories,
  ...adminDirectories,
  'routing',
].sort();

const missing = expected.filter((source) => !sources.includes(source));
const unknown = sources.filter((source) => !expected.includes(source));
if (missing.length > 0 || unknown.length > 0) {
  throw new Error(
    JSON.stringify({ missing, unknown }, null, 2),
  );
}

const allowedOwners = new Set(['design', 'host', 'tile']);
const allowedStatuses = new Set(['planned', 'in-progress', 'complete']);
for (const entry of ledger.entries) {
  if (!allowedOwners.has(entry.owner)) {
    throw new Error(`${entry.source} has invalid owner ${entry.owner}`);
  }
  if (!Number.isInteger(entry.wave) || entry.wave < 1) {
    throw new Error(`${entry.source} has invalid wave ${entry.wave}`);
  }
  if (typeof entry.target !== 'string' || entry.target.length === 0) {
    throw new Error(`${entry.source} is missing a target`);
  }
  if (!allowedStatuses.has(entry.status)) {
    throw new Error(`${entry.source} has invalid status ${entry.status}`);
  }
}

const chatbotEntries = sources.filter((source) =>
  source.startsWith('components/ChatbotSidebarV2'),
);
if (chatbotEntries.length > 0) {
  throw new Error(`Excluded chatbot entries found: ${chatbotEntries.join(', ')}`);
}

console.log(JSON.stringify({
  verified: true,
  covered: expected.length,
  excluded: ['components/ChatbotSidebarV2/**'],
  complete: ledger.entries.filter((entry) => entry.status === 'complete').length,
}));
