//
// This script bakes and copies themes, then generates a corresponding stylesheet in src/themes
//
import fs from 'fs';
import { mkdirSync } from 'fs';
import { globbySync } from 'globby';
import path from 'path';

const outDir = "dist";
const outPublicDir = "public";
const srcDir = "src";
const files = globbySync('./src/styles/**/**/[!_]*.(css|js)');
const tsFiles = ['ScStyleguide.css'];
const filesToEmbed = globbySync('./src/**/**/_*.(css|js)');
const themesDir = path.join(outDir, 'styles');
const themesPublicDir = path.join(outPublicDir, 'styles');
const srcThemesDir = path.join(srcDir, 'styles');
const embeds = {};

mkdirSync(themesDir, { recursive: true });

mkdirSync(themesPublicDir, { recursive: true });

// Gather an object containing the source of all files named "_filename.css/js" so we can embed them later
filesToEmbed.forEach(file => {
  embeds[path.basename(file)] = fs.readFileSync(file, 'utf8');
});

// Loop through each theme file, copying the .css or .js and generating a .ts version for some files
files.forEach(async file => {
  let source = fs.readFileSync(file, 'utf8');
  // If the source has "/* _filename.css/js */" in it, replace it with the embedded styles
  Object.keys(embeds).forEach(key => {
    source = source.replace(`/* ${key} */`, embeds[key]);
  });

  if (path.extname(file) === '.css') {
    let ts = `import { css } from 'lit';\n\nexport default css\`\n${source}\n\`;
  `;

    const cssFile = path.join(themesDir, path.basename(file));
    fs.writeFileSync(cssFile, source, 'utf8');

    const cssFileForPublic = path.join(themesPublicDir, path.basename(file));
    fs.writeFileSync(cssFileForPublic, source, 'utf8');

    if (tsFiles.includes(path.basename(file))) {
      const tsFile = path.join(srcThemesDir, path.basename(file).replace('.css', '.ts'));
      fs.writeFileSync(tsFile, ts, 'utf8');
    }
  } else if (path.extname(file) === '.js') {
    const jsFile = path.join(themesDir, path.basename(file));
    fs.writeFileSync(jsFile, source, 'utf8');
  }
});