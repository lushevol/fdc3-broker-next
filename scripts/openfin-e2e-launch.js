#!/usr/bin/env node
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const openfinDir = path.join(root, '.openfin');
const manifestPath = path.join(openfinDir, 'fdc3-broker-e2e-app.json');

const rvmPath =
  process.env.OPENFIN_RVM_PATH ||
  path.join(process.env.HOME || '', 'Applications/OpenFinRVM.app/Contents/MacOS/OpenFinRVM');
const appUrl = process.env.OPENFIN_E2E_APP_URL || 'http://127.0.0.1:8001/?show_normal_login=Y';
const port = Number(process.env.OPENFIN_E2E_MANIFEST_PORT || 9499);
const devtoolsPort = Number(process.env.OPENFIN_CDP_PORT || 9223);
const runtimeVersion = process.env.OPENFIN_RUNTIME_VERSION || 'stable';

fs.mkdirSync(openfinDir, { recursive: true });

const manifest = {
  devtools_port: devtoolsPort,
  runtime: {
    version: runtimeVersion,
    arguments: `--v=1 --remote-debugging-port=${devtoolsPort}`,
  },
  startup_app: {
    name: 'fdc3-broker-next-e2e',
    uuid: 'fdc3-broker-next-e2e',
    url: appUrl,
    autoShow: true,
    saveWindowState: false,
    fdc3Api: true,
    fdc3InteropApi: '2.0',
    defaultWidth: 1440,
    defaultHeight: 950,
  },
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

if (!fs.existsSync(rvmPath)) {
  console.error(`[OpenFin E2E] RVM not found: ${rvmPath}`);
  console.error('[OpenFin E2E] Set OPENFIN_RVM_PATH to your OpenFinRVM executable.');
  process.exit(1);
}

const server = http.createServer((request, response) => {
  if (request.url === '/fdc3-broker-e2e-app.json') {
    response.writeHead(200, {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    });
    response.end(JSON.stringify(manifest));
    return;
  }

  response.writeHead(404);
  response.end('not found');
});

server.listen(port, '127.0.0.1', () => {
  const manifestUrl = `http://127.0.0.1:${port}/fdc3-broker-e2e-app.json`;
  const child = spawn(rvmPath, [`--config=${manifestUrl}`], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  console.log(`[OpenFin E2E] Manifest: ${manifestPath}`);
  console.log(`[OpenFin E2E] Launching: ${rvmPath} --config=${manifestUrl}`);
  console.log(`[OpenFin E2E] CDP URL: http://127.0.0.1:${devtoolsPort}`);
  console.log('[OpenFin E2E] Keep this process running while the test starts.');
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
