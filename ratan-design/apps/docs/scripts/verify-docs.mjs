import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['button', 'text-input', 'dialog', 'date-picker', 'tabs', 'data-grid'];
const sections = ['## Purpose', '## Guidance', '## API', '## Tokens', '## WebKit mapping', '## Deviations'];
for (const page of pages) {
  const file = path.join(root, 'content/proof', `${page}.md`);
  const content = await readFile(file, 'utf8');
  for (const section of sections) {
    if (!content.includes(section)) throw new Error(`${page}.md is missing ${section}`);
  }
}
await access(path.join(root, 'src/examples/proof.tsx'));
process.stdout.write(`Verified ${pages.length} proof documentation pages and compiled examples.\n`);
