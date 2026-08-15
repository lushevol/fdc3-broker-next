import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

import { createMockApiMiddleware } from '../../../devops/mock-bff/mock-api.mjs';

type Next = () => void;

export type DevMockApiMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next: Next,
) => void | Promise<void>;

export function createDevMockApiMiddleware(): DevMockApiMiddleware {
  return createMockApiMiddleware();
}

export function devMockApiPlugin(): Plugin {
  return {
    name: 'scb-next-development-mock-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(createDevMockApiMiddleware());
    },
  };
}
