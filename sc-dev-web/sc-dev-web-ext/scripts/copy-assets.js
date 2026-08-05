import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'src', 'assets');
const targetDir = path.join(process.cwd(), 'dist', 'src', 'assets');

if (!fs.existsSync(sourceDir)) {
  console.warn(`[copy-assets] Source directory not found: ${sourceDir}`);
  process.exit(0);
}

fs.mkdirSync(path.dirname(targetDir), { recursive: true });
fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

console.log(`[copy-assets] Copied assets to ${targetDir}`);