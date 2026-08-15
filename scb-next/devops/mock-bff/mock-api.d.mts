import type { IncomingMessage, ServerResponse } from 'node:http';

export type MockApiMiddleware = (
  request: IncomingMessage,
  response: ServerResponse,
  next: () => void,
) => void | Promise<void>;

export function createMockApiMiddleware(): MockApiMiddleware;
