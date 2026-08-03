//
// This script bakes and copies themes, then generates a corresponding stylesheet in src/themes
//
import fs from 'fs';
import { mkdirSync } from 'fs';
import { globbySync } from 'globby';
import path from 'path';

const outDir = "dist";
const files = globbySync('./src/styles/**/**/[!_]*.(css|js)');
const themesDir = path.join(outDir, 'styles');

mkdirSync(themesDir, { recursive: true });

// Loop through each theme file, copying the .css or .js and generating a .ts version for some files
files.forEach(async file => {
  let source = fs.readFileSync(file, 'utf8');

  if (path.extname(file) === '.css') {
    const cssFile = path.join(themesDir, path.basename(file));
    fs.writeFileSync(cssFile, source, 'utf8');
  } else if (path.extname(file) === '.js') {
    const jsFile = path.join(themesDir, path.basename(file));
    fs.writeFileSync(jsFile, source, 'utf8');
  }
});