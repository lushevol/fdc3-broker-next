import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const realworldRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(realworldRoot, '../../..');
const temporaryRoot = mkdtempSync(join(tmpdir(), 'fm-production-foundation-'));

function run(command, args, cwd = repositoryRoot) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
    env: { ...process.env, npm_config_cache: '/tmp/npm-cache' },
  });
  if (result.status !== 0) {
    throw new Error([`Command failed: ${command} ${args.join(' ')}`, result.stdout, result.stderr].join('\n'));
  }
  return result.stdout.trim();
}

function linkRootDependency(name) {
  const source = resolve(repositoryRoot, 'node_modules', name);
  const target = resolve(temporaryRoot, 'node_modules', name);
  mkdirSync(dirname(target), { recursive: true });
  if (!existsSync(target)) symlinkSync(source, target, 'junction');
}

try {
  writeFileSync(join(temporaryRoot, 'package.json'), JSON.stringify({
    name: 'production-foundation-consumer',
    private: true,
    type: 'module',
  }, null, 2));

  const packages = ['platform-contracts', 'platform-sdk', 'ratan-design', 'ratan-data-grid'];
  const tarballs = packages.map((packageName) => {
    const output = run('npm', [
      'pack',
      resolve(realworldRoot, 'packages', packageName),
      '--json',
      '--pack-destination',
      temporaryRoot,
    ]);
    const [{ filename }] = JSON.parse(output);
    return resolve(temporaryRoot, filename);
  });

  run('npm', ['install', '--ignore-scripts', '--no-package-lock', '--legacy-peer-deps', tarballs[0]], temporaryRoot);
  run('npm', ['install', '--ignore-scripts', '--no-package-lock', '--legacy-peer-deps', tarballs[1], tarballs[2], tarballs[3]], temporaryRoot);

  for (const dependency of [
    'react',
    'react-dom',
    'zod',
    '@emotion/react',
    '@emotion/styled',
    '@mui/material',
    'ag-grid-community',
    'ag-grid-react',
    '@types/react',
    '@types/react-dom',
  ]) linkRootDependency(dependency);

  writeFileSync(join(temporaryRoot, 'consumer.mjs'), `
import { APPEARANCE_CONTRACT_VERSION, appearanceSnapshotSchema } from '@fm/platform-contracts';
import { createAppearanceController } from '@fm/platform-sdk';
import {
  Button, ConfirmationDialog, Dialog, DesignSystemProvider, InlineAlert, NumberField,
  StatusBadge, TextField, semanticTokens,
} from '@fm/ratan-design';
import { RatanDataGrid, createColumnDefinitions } from '@fm/ratan-data-grid';
import { existsSync } from 'node:fs';

const appearance = Object.freeze({
  scheme: 'dark', preference: 'dark', density: 'compact', locale: 'en-SG', direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
});
appearanceSnapshotSchema.parse(appearance);
if (createAppearanceController(appearance).capability.getSnapshot().scheme !== 'dark') throw new Error('SDK export failed');
if (!Button || !TextField || !NumberField || !StatusBadge || !Dialog || !ConfirmationDialog || !InlineAlert || !DesignSystemProvider || !semanticTokens.color.dark) throw new Error('Design export failed');
if (!RatanDataGrid || createColumnDefinitions([{ key: 'id', header: 'ID' }]).length !== 1) throw new Error('Grid export failed');
const cssPath = import.meta.resolve('@fm/ratan-design/styles.css');
if (!existsSync(new URL(cssPath))) throw new Error('Stylesheet export failed');
const gridCssPath = import.meta.resolve('@fm/ratan-data-grid/styles.css');
if (!existsSync(new URL(gridCssPath))) throw new Error('Grid stylesheet export failed');
let blocked = false;
try { await import('@fm/ratan-design/src/provider'); } catch (error) { blocked = error?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED'; }
if (!blocked) throw new Error('Internal subpath was not blocked');
blocked = false;
try { await import('@fm/ratan-data-grid/src/index'); } catch (error) { blocked = error?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED'; }
if (!blocked) throw new Error('Grid internal subpath was not blocked');
`);

  writeFileSync(join(temporaryRoot, 'fixture.tsx'), `
import type { AppearanceSnapshot, PlatformCapabilities } from '@fm/platform-contracts';
import { createAppearanceController, createPlatformClient } from '@fm/platform-sdk';
import {
  Button, ConfirmationDialog, Dialog, DesignSystemProvider, InlineAlert, NumberField,
  StatusBadge, TextField,
} from '@fm/ratan-design';
import { RatanDataGrid, type RatanDataGridColumn } from '@fm/ratan-data-grid';

declare const appearance: AppearanceSnapshot;
declare const capabilities: PlatformCapabilities;
const controller = createAppearanceController(appearance);
createPlatformClient(capabilities).getAppearance();
type Row = { id: string; amount: number };
const rows: Row[] = [{ id: 'one', amount: 1 }];
const columns: RatanDataGridColumn<Row>[] = [{ key: 'id', header: 'ID' }];
export const Fixture = () => (
  <DesignSystemProvider appearance={controller.capability.getSnapshot()}>
    <TextField id="filter" label="Filter" value="" onChange={() => undefined} />
    <NumberField id="limit" label="Limit" value={1} min={0} onChange={() => undefined} />
    <StatusBadge status="ready">Ready</StatusBadge>
    <InlineAlert tone="info" message="Local feedback" />
    <Button>Submit</Button>
    <Dialog open={false} title="Editor" onClose={() => undefined}>Content</Dialog>
    <ConfirmationDialog
      open={false}
      title="Confirm"
      message="Proceed?"
      confirmLabel="Proceed"
      onConfirm={() => undefined}
      onCancel={() => undefined}
    />
    <RatanDataGrid ariaLabel="Rows" rows={rows} columns={columns} getRowId={(row) => row.id} />
    {/* @ts-expect-error raw styling is intentionally not public */}
    <NumberField id="styled-limit" label="Styled" value={1} onChange={() => undefined} sx={{ color: 'red' }} />
    {/* @ts-expect-error raw MUI slots are intentionally not public */}
    <Dialog open={false} title="Slotted" onClose={() => undefined} slotProps={{}}>Content</Dialog>
  </DesignSystemProvider>
);
`);
  writeFileSync(join(temporaryRoot, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'bundler',
      jsx: 'react-jsx',
      strict: true,
      noEmit: true,
      skipLibCheck: true,
    },
    include: ['fixture.tsx'],
  }, null, 2));

  run(process.execPath, ['consumer.mjs'], temporaryRoot);
  run(resolve(repositoryRoot, 'node_modules/.bin/tsc'), ['-p', 'tsconfig.json'], temporaryRoot);

  const packageEvidence = tarballs.map((tarball) => ({
    file: tarball.split('/').at(-1),
    bytes: readFileSync(tarball).byteLength,
  }));
  process.stdout.write(`${JSON.stringify({ verified: true, packages: packageEvidence })}\n`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
