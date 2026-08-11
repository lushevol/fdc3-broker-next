import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distributionRoot = path.join(packageRoot, 'dist');

await mkdir(path.join(distributionRoot, 'themes'), { recursive: true });
await mkdir(path.join(distributionRoot, 'modes'), { recursive: true });
await mkdir(path.join(distributionRoot, 'styles'), { recursive: true });
await mkdir(path.join(distributionRoot, 'components/button'), { recursive: true });
await mkdir(path.join(distributionRoot, 'components/data-grid'), { recursive: true });
await mkdir(path.join(distributionRoot, 'components/date-picker'), { recursive: true });
await mkdir(path.join(distributionRoot, 'components/dialog'), { recursive: true });
await mkdir(path.join(distributionRoot, 'components/tabs'), { recursive: true });
await mkdir(path.join(distributionRoot, 'components/text-input'), { recursive: true });

await copyFile(path.join(packageRoot, 'src/styles.css'), path.join(distributionRoot, 'styles.css'));
await copyFile(
  path.join(packageRoot, 'src/styles/frozen/ScLightMode.css'),
  path.join(distributionRoot, 'themes/light.css'),
);
await copyFile(
  path.join(packageRoot, 'src/styles/frozen/ScDarkMode.css'),
  path.join(distributionRoot, 'themes/dark.css'),
);
await copyFile(
  path.join(packageRoot, 'src/styles/frozen/ScCPBBTheme.css'),
  path.join(distributionRoot, 'themes/cpbb.css'),
);
await copyFile(
  path.join(packageRoot, 'src/styles/frozen/ScInterMode.css'),
  path.join(distributionRoot, 'modes/inter.css'),
);
await copyFile(
  path.join(packageRoot, 'src/styles/frozen/ScRobotoMonoMode.css'),
  path.join(distributionRoot, 'modes/roboto-mono.css'),
);
await copyFile(
  path.join(packageRoot, 'src/styles/frozen/ScDyslexicMode.css'),
  path.join(distributionRoot, 'modes/dyslexic.css'),
);
await cp(path.join(packageRoot, 'src/styles/frozen'), path.join(distributionRoot, 'styles/frozen'), {
  recursive: true,
});
await cp(path.join(packageRoot, 'src/styles/frozen'), path.join(distributionRoot, 'themes'), {
  recursive: true,
});
await cp(path.join(packageRoot, 'src/assets'), path.join(distributionRoot, 'assets'), {
  recursive: true,
});
await cp(
  path.join(packageRoot, 'src/assets'),
  path.join(distributionRoot, 'styles/assets'),
  { recursive: true },
);
await copyFile(
  path.join(packageRoot, 'src/components/button/button.css'),
  path.join(distributionRoot, 'components/button/button.css'),
);
await copyFile(
  path.join(packageRoot, 'src/components/button/button-states.css'),
  path.join(distributionRoot, 'components/button/button-states.css'),
);
await copyFile(
  path.join(packageRoot, 'src/components/data-grid/data-grid.css'),
  path.join(distributionRoot, 'components/data-grid/data-grid.css'),
);
await copyFile(
  path.join(packageRoot, 'src/components/dialog/dialog.css'),
  path.join(distributionRoot, 'components/dialog/dialog.css'),
);
await copyFile(
  path.join(packageRoot, 'src/components/date-picker/date-picker.css'),
  path.join(distributionRoot, 'components/date-picker/date-picker.css'),
);
await copyFile(
  path.join(packageRoot, 'src/components/tabs/tabs.css'),
  path.join(distributionRoot, 'components/tabs/tabs.css'),
);
await copyFile(
  path.join(packageRoot, 'src/components/text-input/text-input.css'),
  path.join(distributionRoot, 'components/text-input/text-input.css'),
);
await cp(path.join(packageRoot, 'src/icons/svg'), path.join(distributionRoot, 'icons'), {
  recursive: true,
});
await writeFile(
  path.join(distributionRoot, 'button-with-style.js'),
  "import './button.css';\nexport * from './button.js';\n",
);
await writeFile(
  path.join(distributionRoot, 'data-grid-with-style.js'),
  "import './data-grid.css';\nexport * from './data-grid.js';\n",
);
await writeFile(
  path.join(distributionRoot, 'dialog-with-style.js'),
  "import './dialog.css';\nexport * from './dialog.js';\n",
);
await writeFile(
  path.join(distributionRoot, 'date-picker-with-style.js'),
  "import './date-picker.css';\nexport * from './date-picker.js';\n",
);
await writeFile(
  path.join(distributionRoot, 'index-with-style.js'),
  "import './index.css';\nexport * from './index.js';\n",
);
await writeFile(
  path.join(distributionRoot, 'tabs-with-style.js'),
  "import './tabs.css';\nexport * from './tabs.js';\n",
);
await writeFile(
  path.join(distributionRoot, 'text-input-with-style.js'),
  "import './text-input.css';\nexport * from './text-input.js';\n",
);
