import type { AddressInfo } from 'node:net';
import { afterEach, describe, expect, it } from 'vitest';

import { createRoutedMockApiServer } from '../devops/mock-bff/minikube-route-adapter.mjs';

const servers: ReturnType<typeof createRoutedMockApiServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
});

describe('Minikube mock route adapter', () => {
  it('restores a validated original URI before existing mock handlers run', async () => {
    const server = createRoutedMockApiServer();
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = (server.address() as AddressInfo).port;

    const response = await fetch(`http://127.0.0.1:${port}/stripped-health`, {
      headers: { 'x-original-uri': '/healthz' },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: 'ok' });
  });

  it('rejects an unsafe original URI header', async () => {
    const server = createRoutedMockApiServer();
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = (server.address() as AddressInfo).port;

    const response = await fetch(`http://127.0.0.1:${port}/healthz`, {
      headers: { 'x-original-uri': 'https://untrusted.example/healthz' },
    });

    expect(response.status).toBe(400);
  });
});
