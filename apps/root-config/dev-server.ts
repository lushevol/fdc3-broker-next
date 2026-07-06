import type { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import type { ProxyOptions, RequestHandler, SetupMiddlewaresFn } from '@rsbuild/core';

import { createCapturedApiMockMiddleware, type CapturedApiFixture } from './captured-api-mocks';

type JsonRecord = Record<string, unknown>;

type MockMiddleware = RequestHandler & {
  path?: string;
};

type Fdc3Intent = {
  name: string;
  description: string;
};

type Fdc3Context = {
  schema?: {
    type?: string;
    properties?: {
      type?: {
        const?: string;
      };
    };
  };
  description?: string;
  samples?: unknown[];
  simples?: unknown[];
};

type Fdc3Declaration = JsonRecord & {
  appId?: string;
};

type Fdc3Store = {
  intents: Fdc3Intent[];
  contexts: Fdc3Context[];
  declarations: Fdc3Declaration[];
};

export type Fdc3StorePaths = {
  declarations: string;
  intents: string;
  contexts: string;
};

export type Fdc3StoreApi = Fdc3Store & {
  createDeclaration: (body: JsonRecord) => Fdc3Declaration;
  updateDeclaration: (body: JsonRecord) => Fdc3Declaration;
  deleteDeclaration: (body: JsonRecord) => Fdc3Declaration;
  createIntent: (body: JsonRecord) => Fdc3Intent;
  updateIntent: (body: JsonRecord) => Fdc3Intent;
  deleteIntent: (body: JsonRecord) => Fdc3Intent;
  createContext: (body: JsonRecord) => Fdc3Context;
  updateContext: (body: JsonRecord) => Fdc3Context;
  deleteContext: (body: JsonRecord) => Fdc3Context;
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockLoginResp = require('./login-resp.mock.json') as JsonRecord;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { generateJWT } = require('./scripts/jwt') as {
  generateJWT: (payload: JsonRecord) => string;
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const capturedApiMocks = require('./mock/captured-api-fixtures.mock.json') as {
  fixtures?: CapturedApiFixture[];
};

function createMiddleware(path: string, handler: RequestHandler): MockMiddleware {
  const middleware = ((req, res, next) => {
    const requestUrl = req.url ?? '';
    const pathname = requestUrl.split('?')[0];

    if (pathname !== path) {
      if (typeof next === 'function') {
        next();
      }
      return;
    }

    return handler(req, res, next);
  }) as MockMiddleware;
  middleware.path = path;
  return middleware;
}

function parseJsonBody(req: IncomingMessage): Promise<JsonRecord> {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (chunk: Buffer | string) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(body ? (JSON.parse(body) as JsonRecord) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res: ServerResponse, data: unknown): void {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ code: 200, message: 'success', data }));
}

function sendNoContent(res: ServerResponse): void {
  res.statusCode = 204;
  res.end();
}

function createAuthToken(): string {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 12 * 60 * 60;

  return generateJWT({
    sub: '1481696',
    iat: issuedAt,
    auth_time: issuedAt,
    exp: expiresAt,
    max_age: expiresAt,
    oud: mockLoginResp.oud,
  });
}

function sendAuthResponse(
  res: ServerResponse,
  token: string,
  options: {
    responseBody?: JsonRecord;
    extraHeaders?: Record<string, string>;
  } = {},
): void {
  const { responseBody = mockLoginResp, extraHeaders = {} } = options;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('single-ui-authorization', `Bearer ${token}`);
  res.setHeader('single-ui-refresh', `Bearer ${token}`);

  Object.entries(extraHeaders).forEach(([headerName, headerValue]) => {
    res.setHeader(headerName, headerValue);
  });

  res.end(JSON.stringify(responseBody));
}

function loadInitialDeclarations(): Fdc3Declaration[] {
  try {
    const declarationPath = require.resolve('./fdc3-declaration.mock.json');
    delete require.cache[declarationPath];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const initialData = require('./fdc3-declaration.mock.json') as { data?: Fdc3Declaration[] };
    return initialData.data ?? [];
  } catch {
    return [];
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath: string, value: unknown): void {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function getFdc3ContextType(context: Fdc3Context): string {
  return context.schema?.properties?.type?.const ?? context.schema?.type ?? '';
}

export function createFileBackedFdc3Store(paths: Fdc3StorePaths): Fdc3StoreApi {
  const api: Fdc3StoreApi = {
    declarations: readJsonFile<Fdc3Declaration[]>(paths.declarations, []),
    intents: readJsonFile<Fdc3Intent[]>(paths.intents, []),
    contexts: readJsonFile<Fdc3Context[]>(paths.contexts, []),
    createDeclaration(body) {
      const item: Fdc3Declaration = {
        ...body,
        appId: typeof body.appId === 'string' && body.appId ? body.appId : `app-${Date.now()}`,
      };
      api.declarations = [
        item,
        ...api.declarations.filter((declaration) => declaration.appId !== item.appId),
      ];
      writeJsonFile(paths.declarations, api.declarations);
      return item;
    },
    updateDeclaration(body) {
      const appId = typeof body.appId === 'string' ? body.appId : '';
      const item: Fdc3Declaration = { ...body, appId };
      api.declarations = api.declarations.map((declaration) =>
        declaration.appId === appId ? { ...declaration, ...item } : declaration,
      );
      writeJsonFile(paths.declarations, api.declarations);
      return item;
    },
    deleteDeclaration(body) {
      const appId = typeof body.appId === 'string' ? body.appId : '';
      const item: Fdc3Declaration = { ...body, appId };
      api.declarations = api.declarations.filter((declaration) => declaration.appId !== appId);
      writeJsonFile(paths.declarations, api.declarations);
      return item;
    },
    createIntent(body) {
      const item: Fdc3Intent = {
        name: typeof body.name === 'string' ? body.name : '',
        description: typeof body.description === 'string' ? body.description : '',
      };

      if (item.name && !api.intents.some((intent) => intent.name === item.name)) {
        api.intents = [...api.intents, item];
        writeJsonFile(paths.intents, api.intents);
      }

      return item;
    },
    updateIntent(body) {
      const item: Fdc3Intent = {
        name: typeof body.name === 'string' ? body.name : '',
        description: typeof body.description === 'string' ? body.description : '',
      };
      api.intents = api.intents.map((intent) => (intent.name === item.name ? item : intent));
      writeJsonFile(paths.intents, api.intents);
      return item;
    },
    deleteIntent(body) {
      const item: Fdc3Intent = {
        name: typeof body.name === 'string' ? body.name : '',
        description: typeof body.description === 'string' ? body.description : '',
      };
      api.intents = api.intents.filter((intent) => intent.name !== item.name);
      writeJsonFile(paths.intents, api.intents);
      return item;
    },
    createContext(body) {
      const item = body as Fdc3Context;
      const contextType = getFdc3ContextType(item);

      if (contextType && !api.contexts.some((context) => getFdc3ContextType(context) === contextType)) {
        api.contexts = [...api.contexts, item];
        writeJsonFile(paths.contexts, api.contexts);
      }

      return item;
    },
    updateContext(body) {
      const item = body as Fdc3Context;
      const contextType = getFdc3ContextType(item);
      api.contexts = api.contexts.map((context) =>
        getFdc3ContextType(context) === contextType ? item : context,
      );
      writeJsonFile(paths.contexts, api.contexts);
      return item;
    },
    deleteContext(body) {
      const item = body as Fdc3Context;
      const contextType = getFdc3ContextType(item);
      api.contexts = api.contexts.filter(
        (context) => getFdc3ContextType(context) !== contextType,
      );
      writeJsonFile(paths.contexts, api.contexts);
      return item;
    },
  };

  return api;
}

function loadCategoryResponse(): unknown {
  const categoryPath = require.resolve('./category.mock.json');
  delete require.cache[categoryPath];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('./category.mock.json');
}

function isFlowzeroWorkflowServiceFixture(fixture: CapturedApiFixture): boolean {
  return (
    [
      '/api/flowzero/v1/workflow/page',
      '/api/flowzero/v1/workflow/create',
      '/api/flowzero/v1/workflow/check-name',
    ].includes(fixture.request.pathname) ||
    fixture.request.pathname.startsWith('/api/flowzero/v1/workflow/detail/')
  );
}

function createFdc3Store(): Fdc3StoreApi {
  return createFileBackedFdc3Store({
    declarations: path.resolve(__dirname, '../base/src/fdc3/declarations/fdc3-definitions.json'),
    intents: path.resolve(__dirname, '../base/src/fdc3/declarations/intents.json'),
    contexts: path.resolve(__dirname, '../base/src/fdc3/declarations/contexts.json'),
  });
}

export const rootConfigProxy: ProxyOptions[] = [
  {
    context: ['/api/chat'],
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
  },
  {
    context: ['/api/flowzero/v1'],
    target: 'http://127.0.0.1:8092',
    secure: false,
    changeOrigin: true,
  },
  {
    context: ['/api/bff/'],
    pathRewrite: { '^/api/bff': '' },
    target: 'http://localhost:8088',
    secure: false,
    changeOrigin: true,
  },
  {
    context: ['/api/log/'],
    pathRewrite: { '^/api/log': '' },
    target: 'http://localhost:8088',
    secure: false,
    changeOrigin: true,
    ws: true,
  },
  {
    context: ['/api/auth/'],
    pathRewrite: { '^/api/auth': '' },
    target: 'http://localhost:8088',
    secure: false,
    changeOrigin: true,
  },
  {
    context: ['/api/analytics/'],
    pathRewrite: { '^/api/analytics': '' },
    target: 'http://localhost:8088',
    secure: false,
    changeOrigin: true,
  },
  {
    context: ['/api/sse/'],
    pathRewrite: { '^/api/sse': '' },
    target: 'http://localhost:8088',
    secure: false,
    changeOrigin: true,
  },
];

export const rootConfigDevSetup: SetupMiddlewaresFn = (middlewares) => {
  const useBackendAuth = process.env.useBackendAuth?.toLowerCase() === 'true';
  const token = createAuthToken();
  const fdc3Store = createFdc3Store();
  const capturedApiFixtures = (capturedApiMocks.fixtures ?? []).filter(
    (fixture) => !isFlowzeroWorkflowServiceFixture(fixture),
  );

  if (!useBackendAuth) {
    middlewares.unshift(
      createMiddleware('/api/auth/v2/sso/login', (_req, res) => {
        sendAuthResponse(res, token);
      }),
      createMiddleware('/api/auth/v2/sso/validate', (_req, res) => {
        sendAuthResponse(res, token);
      }),
      createMiddleware('/api/auth/v2/sso/extend', (_req, res) => {
        sendAuthResponse(res, token);
      }),
      createMiddleware('/api/auth/v2/sso/refreshtoken', (_req, res) => {
        sendAuthResponse(res, token, { responseBody: { result: true } });
      }),
      createMiddleware('/api/auth/v2/sso/relogin', (_req, res) => {
        sendAuthResponse(res, token);
      }),
    );
  }

  middlewares.unshift(
    createCapturedApiMockMiddleware(capturedApiFixtures),
    createMiddleware('/api/analytics/v1/fmo/print', (_req, res) => {
      sendNoContent(res);
    }),
    createMiddleware('/v1/fmo/print', (_req, res) => {
      sendNoContent(res);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/data', (_req, res) => {
      sendJson(res, fdc3Store.intents);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/create', async (req, res) => {
      sendJson(res, fdc3Store.createIntent(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/update', async (req, res) => {
      sendJson(res, fdc3Store.updateIntent(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/delete', async (req, res) => {
      sendJson(res, fdc3Store.deleteIntent(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/data', (_req, res) => {
      sendJson(res, fdc3Store.contexts);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/create', async (req, res) => {
      sendJson(res, fdc3Store.createContext(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/update', async (req, res) => {
      sendJson(res, fdc3Store.updateContext(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/delete', async (req, res) => {
      sendJson(res, fdc3Store.deleteContext(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/data', (_req, res) => {
      sendJson(res, fdc3Store.declarations);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/create', async (req, res) => {
      sendJson(res, fdc3Store.createDeclaration(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/update', async (req, res) => {
      sendJson(res, fdc3Store.updateDeclaration(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/delete', async (req, res) => {
      sendJson(res, fdc3Store.deleteDeclaration(await parseJsonBody(req)));
    }),
    createMiddleware('/api/auth/v1/fmo/admin/category/data', (_req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(loadCategoryResponse()));
    }),
  );
};
