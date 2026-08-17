import { fileURLToPath } from 'node:url';

import { createMockApiServer } from './server.mjs';

const ORIGINAL_URI_HEADER = 'x-original-uri';
const SAFE_ORIGINAL_URI = /^\/[^\r\n]*$/;

export function createRoutedMockApiServer() {
  const server = createMockApiServer();
  const requestHandler = server.listeners('request')[0];
  const upgradeHandler = server.listeners('upgrade')[0];

  server.removeAllListeners('request');
  server.on('request', (request, response) => {
    if (!restoreOriginalUri(request)) {
      response.statusCode = 400;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify({ error: 'Invalid original URI' }));
      return;
    }
    requestHandler(request, response);
  });

  server.removeAllListeners('upgrade');
  server.on('upgrade', (request, socket, head) => {
    if (!restoreOriginalUri(request)) {
      socket.destroy();
      return;
    }
    upgradeHandler(request, socket, head);
  });

  return server;
}

function restoreOriginalUri(request) {
  const originalUri = request.headers[ORIGINAL_URI_HEADER];
  if (originalUri === undefined) {
    return true;
  }
  if (typeof originalUri !== 'string' || !SAFE_ORIGINAL_URI.test(originalUri)) {
    return false;
  }
  request.url = originalUri;
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT ?? '8081', 10);
  const host = process.env.HOST ?? '0.0.0.0';
  createRoutedMockApiServer().listen(port, host, () => {
    console.log(`SCB Next routed mock BFF listening on ${host}:${port}`);
  });
}
