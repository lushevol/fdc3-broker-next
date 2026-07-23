#!/usr/bin/env node
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, '.openfin', 'single-view-dev.json');
const manifestPort = 9500;
const rvmPath =
  process.env.OPENFIN_RVM_PATH ||
  path.join(process.env.HOME || '', 'Applications/OpenFinRVM.app/Contents/MacOS/OpenFinRVM');

const providerHtml = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>mfe-base Single View Platform</title></head>
  <body>
    <script>
      window.addEventListener('DOMContentLoaded', async () => {
        await fin.Platform.init();
      });
    </script>
  </body>
</html>`;

if (!fs.existsSync(manifestPath)) {
  throw new Error(`OpenFin manifest not found: ${manifestPath}`);
}

if (!fs.existsSync(rvmPath)) {
  throw new Error(
    `OpenFin RVM was not found at ${rvmPath}. Set OPENFIN_RVM_PATH to your OpenFinRVM executable.`,
  );
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', `http://127.0.0.1:${manifestPort}`);

  if (requestUrl.pathname === '/single-view-dev.json') {
    response.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    response.end(fs.readFileSync(manifestPath));
    return;
  }

  if (requestUrl.pathname === '/platform-provider.html') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    response.end(providerHtml);
    return;
  }

  response.writeHead(404);
  response.end('Not found');
});

server.listen(manifestPort, '127.0.0.1', () => {
  const manifestUrl = `http://127.0.0.1:${manifestPort}/single-view-dev.json`;
  const openfin = spawn(rvmPath, [`--config=${manifestUrl}`], {
    detached: true,
    stdio: 'ignore',
  });
  openfin.unref();

  console.log(`[OpenFin Single View] Manifest: ${manifestPath}`);
  console.log(`[OpenFin Single View] Launching: ${rvmPath} --config=${manifestUrl}`);
  console.log('[OpenFin Single View] Start the local UI first with: npm run dev:ui');
});

process.on('SIGINT', () => server.close(() => process.exit(0)));
