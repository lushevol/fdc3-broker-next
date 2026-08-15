import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

import { createMockApiMiddleware } from './mock-api.mjs';

export function createMockApiServer() {
  const middleware = createMockApiMiddleware();
  const server = createServer((request, response) => {
    void middleware(request, response, () => {
      response.statusCode = 404;
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify({ error: 'Not found' }));
    }).catch((error) => {
      console.error(error);
      if (!response.headersSent) {
        response.statusCode = 500;
        response.setHeader('content-type', 'application/json');
      }
      response.end(JSON.stringify({ error: 'Mock request failed' }));
    });
  });

  server.on('upgrade', (request, socket) => {
    const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
    const isNotificationSocket =
      /^\/api\/ratan\/notification\/subscriptions\/\d+\/[^/]+\/websocket$/.test(pathname);
    const key = request.headers['sec-websocket-key'];
    if (!isNotificationSocket || typeof key !== 'string') {
      socket.destroy();
      return;
    }

    const accept = createHash('sha1')
      .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
      .digest('base64');
    socket.write(
      [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${accept}`,
        '',
        '',
      ].join('\r\n'),
    );

    const connectedFrame = 'CONNECTED\nversion:1.1\nheart-beat:0,0\n\n\u0000';
    writeWebSocketText(socket, 'o');
    const connectedTimer = setTimeout(() => {
      writeWebSocketText(socket, `a[${JSON.stringify(connectedFrame)}]`);
    }, 25);
    const heartbeatTimer = setInterval(() => writeWebSocketText(socket, 'h'), 20_000);
    const cleanup = () => {
      clearTimeout(connectedTimer);
      clearInterval(heartbeatTimer);
    };
    socket.on('data', (chunk) => {
      if ((chunk[0] & 0x0f) === 0x08) {
        socket.end(Buffer.from([0x88, 0x00]));
      }
    });
    socket.once('close', cleanup);
    socket.once('error', cleanup);
  });

  return server;
}

function writeWebSocketText(socket, text) {
  const payload = Buffer.from(text);
  let header;
  if (payload.length < 126) {
    header = Buffer.from([0x81, payload.length]);
  } else {
    header = Buffer.allocUnsafe(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(payload.length, 2);
  }
  socket.write(Buffer.concat([header, payload]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT ?? '8081', 10);
  const host = process.env.HOST ?? '0.0.0.0';
  createMockApiServer().listen(port, host, () => {
    console.log(`SCB Next mock BFF listening on ${host}:${port}`);
  });
}
