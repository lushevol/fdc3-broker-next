import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const copies = [{
  from: path.resolve(
    dirname,
    '../node_modules/@scdevkit/docviewer/dist/pdf.worker.min.js'
  ),
  to: 'dist/storybook/node_modules/@scdevkit/docviewer/dist/pdf.worker.min.js'
}, {
  from: path.resolve(
    dirname,
    '../node_modules/@scdevkit/webkit-ext/dist/styles/ScLightModeExt.css'
  ),
  to: 'dist/storybook/node_modules/@scdevkit/webkit-ext/dist/styles/ScLightModeExt.css'
}, {
  from: path.resolve(
    dirname,
    '../node_modules/@scdevkit/webkit-ext/dist/styles/ScDarkModeExt.css'
  ),
  to: 'dist/storybook/node_modules/@scdevkit/webkit-ext/dist/styles/ScDarkModeExt.css'
}, {
  from: path.resolve(
    dirname,
    '../node_modules/driver.js/dist/driver.css'
  ),
  to: 'dist/storybook/node_modules/driver.js/dist/driver.css'
}, {
  from: path.resolve(
    dirname,
    '../scripts/postinstall-keycloak-patch.js'
  ),
  to: 'dist/scripts/postinstall-keycloak-patch.js'
}];

try {
  copies.forEach(({ from, to }) => {
    fs.cpSync(from, to, {
      recursive: true,
    });
  });
} catch (error) {
  console.log(error.message);
}
