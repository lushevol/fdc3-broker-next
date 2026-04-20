import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'src', 'styles.css');
const dest = resolve(root, 'dist', 'styles.css');

const css = readFileSync(src, 'utf8');

const result = await postcss([tailwindcss()]).process(css, { from: src, to: dest });

mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, result.css, 'utf8');

if (result.map) {
  writeFileSync(dest + '.map', result.map.toString(), 'utf8');
}
