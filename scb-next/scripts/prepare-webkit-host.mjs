import { spawn } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, stat, symlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const packages = ['sc-dev-web-rte', 'sc-dev-web'];
const required = {
  'sc-dev-web-rte': ['src/index.js'],
  'sc-dev-web': [
    'styles/ScDarkMode.css',
    'styles/ScLightMode.css',
    'styles/ScStyleguide.css',
    'styles/ScGDSStyleGuide.css',
    'elements/sc-button.js',
    'elements/sc-button.d.ts',
    'elements/sc-icon-card.js',
    'elements/sc-icon-card.d.ts',
    'assets/fonts/SCProsperSans-Regular.woff2',
    'assets/fonts/SCProsperSans-Medium.woff2',
    'assets/fonts/SCProsperSans-Bold.woff2',
  ],
};

function verifyDependencies(root) {
  for (const name of packages) {
    const require = createRequire(join(root, 'sc-dev-web', name, 'package.json'));
    for (const dependency of ['typescript', 'globby', 'lit', '@shoelace-style/shoelace/dist/components/button/button.component.js']) {
      try {
        require.resolve(dependency);
      } catch {
        throw new Error(
          `Missing ${dependency} for ${name}. From the repository root run: npm ci --workspace @scdevkit/webkit --workspace @scdevkit/webkit-rte --ignore-scripts`,
        );
      }
    }
  }
}

function run(command, args, { cwd }) {
  return new Promise((resolveCommand, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.once('error', reject);
    child.once('close', (code, signal) => {
      if (code === 0) resolveCommand();
      else reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });
}

export async function prepareWebkitHost({
  repositoryRoot: root = repositoryRoot,
  run: execute = run,
  verifyDependencies: verify = verifyDependencies,
  log = console.log,
} = {}) {
  await verify(root);
  const temporary = await mkdtemp(join(tmpdir(), 'canonical-webkit-host-'));
  try {
    await symlink(join(root, 'node_modules'), join(temporary, 'node_modules'), 'dir');
    for (const name of packages) {
      const source = join(root, 'sc-dev-web', name);
      const destination = join(temporary, 'sc-dev-web', name);
      await cp(source, destination, {
        recursive: true,
        filter: (path) => !['node_modules', 'dist', 'storybook-static', '.git'].includes(basename(path)) && !path.endsWith('.tsbuildinfo'),
      });
      await symlink(join(source, 'node_modules'), join(destination, 'node_modules'), 'dir');
    }
    for (const name of packages) {
      log(`[webkit-host] Building canonical ${name} in a temporary source copy`);
      await execute('npm', ['run', 'build:mvp'], { cwd: join(temporary, 'sc-dev-web', name) });
    }
    // Canonical copy-fonts uses public/fonts, but the committed assets are here.
    const webkit = join(temporary, 'sc-dev-web/sc-dev-web');
    await mkdir(join(webkit, 'dist/assets'), { recursive: true });
    await cp(join(webkit, 'public/assets/fonts'), join(webkit, 'dist/assets/fonts'), { recursive: true });
    for (const name of packages) {
      for (const file of required[name]) {
        const path = join(temporary, 'sc-dev-web', name, 'dist', file);
        if (!(await stat(path)).isFile() || (await readFile(path)).length === 0) {
          throw new Error(`Missing canonical WebKit output: ${name}/${file}`);
        }
      }
    }
    for (const name of packages) {
      await cp(join(temporary, 'sc-dev-web', name, 'dist'), join(root, 'sc-dev-web', name, 'dist'), { recursive: true });
    }
    log('[webkit-host] Canonical CSS, custom elements, declarations and fonts are ready');
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) {
  try {
    await prepareWebkitHost();
  } catch (error) {
    console.error(`[webkit-host] ${error.message}`);
    process.exitCode = 1;
  }
}
