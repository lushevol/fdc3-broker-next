import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ProxyOptions, RequestHandler, SetupMiddlewaresFn } from '@rsbuild/core';

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
  };
  description?: string;
};

type Fdc3Declaration = JsonRecord & {
  appId?: string;
};

type Fdc3Store = {
  intents: Fdc3Intent[];
  contexts: Fdc3Context[];
  declarations: Fdc3Declaration[];
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockLoginResp = require('./login-resp.mock.json') as JsonRecord;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { generateJWT } = require('./scripts/jwt') as {
  generateJWT: (payload: JsonRecord) => string;
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

function loadCategoryResponse(): unknown {
  const categoryPath = require.resolve('./category.mock.json');
  delete require.cache[categoryPath];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('./category.mock.json');
}

function createFdc3Store(): Fdc3Store {
  return {
    intents: [
      { name: 'ViewInstrument', description: 'View instrument details' },
      { name: 'ViewContact', description: 'View contact details' },
    ],
    contexts: [
      { schema: { type: 'fdc3.instrument' }, description: 'Financial Instrument' },
      { schema: { type: 'fdc3.contact' }, description: 'Contact Info' },
    ],
    declarations: loadInitialDeclarations(),
  };
}

export const rootConfigProxy: ProxyOptions[] = [
  {
    context: ['/api/chat'],
    target: 'http://localhost:8080',
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
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/data', (_req, res) => {
      sendJson(res, fdc3Store.intents);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/create', async (req, res) => {
      const body = await parseJsonBody(req);
      const name = typeof body.name === 'string' ? body.name : '';

      if (name) {
        const existing = fdc3Store.intents.find((intent) => intent.name === name);
        if (!existing) {
          fdc3Store.intents.push({
            name,
            description: typeof body.description === 'string' ? body.description : '',
          });
        }
      }

      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/update', async (req, res) => {
      const body = await parseJsonBody(req);
      const name = typeof body.name === 'string' ? body.name : '';
      const intentIndex = fdc3Store.intents.findIndex((intent) => intent.name === name);

      if (intentIndex !== -1) {
        fdc3Store.intents[intentIndex] = {
          ...fdc3Store.intents[intentIndex],
          name,
          description:
            typeof body.description === 'string'
              ? body.description
              : fdc3Store.intents[intentIndex].description,
        };
      }

      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/intent/delete', async (req, res) => {
      const body = await parseJsonBody(req);
      const name = typeof body.name === 'string' ? body.name : '';
      fdc3Store.intents = fdc3Store.intents.filter((intent) => intent.name !== name);
      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/data', (_req, res) => {
      sendJson(res, fdc3Store.contexts);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/create', async (req, res) => {
      const body = await parseJsonBody(req);
      const schema = body.schema as Fdc3Context['schema'] | undefined;
      const schemaType = typeof schema?.type === 'string' ? schema.type : '';

      if (schemaType) {
        const existing = fdc3Store.contexts.find((context) => context.schema?.type === schemaType);
        if (!existing) {
          fdc3Store.contexts.push(body as unknown as Fdc3Context);
        }
      }

      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/update', async (req, res) => {
      const body = await parseJsonBody(req);
      const schema = body.schema as Fdc3Context['schema'] | undefined;
      const schemaType = typeof schema?.type === 'string' ? schema.type : '';
      const contextIndex = fdc3Store.contexts.findIndex(
        (context) => context.schema?.type === schemaType,
      );

      if (contextIndex !== -1) {
        fdc3Store.contexts[contextIndex] = {
          ...fdc3Store.contexts[contextIndex],
          ...(body as unknown as Fdc3Context),
        };
      }

      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/context/delete', async (req, res) => {
      const body = await parseJsonBody(req);
      const schema = body.schema as Fdc3Context['schema'] | undefined;
      const schemaType = typeof schema?.type === 'string' ? schema.type : '';
      fdc3Store.contexts = fdc3Store.contexts.filter(
        (context) => context.schema?.type !== schemaType,
      );
      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/data', (_req, res) => {
      sendJson(res, fdc3Store.declarations);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/create', async (req, res) => {
      const body = await parseJsonBody(req);
      const newItem: Fdc3Declaration = {
        ...body,
        appId:
          typeof body.appId === 'string' && body.appId
            ? body.appId
            : `app-${Date.now()}`,
      };

      fdc3Store.declarations.unshift(newItem);
      sendJson(res, newItem);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/update', async (req, res) => {
      const body = await parseJsonBody(req);
      const appId = typeof body.appId === 'string' ? body.appId : '';
      const declarationIndex = fdc3Store.declarations.findIndex(
        (declaration) => declaration.appId === appId,
      );

      if (declarationIndex !== -1) {
        fdc3Store.declarations[declarationIndex] = {
          ...fdc3Store.declarations[declarationIndex],
          ...body,
        };
      }

      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/fdc3/delete', async (req, res) => {
      const body = await parseJsonBody(req);
      const appId = typeof body.appId === 'string' ? body.appId : '';
      fdc3Store.declarations = fdc3Store.declarations.filter(
        (declaration) => declaration.appId !== appId,
      );
      sendJson(res, body);
    }),
    createMiddleware('/api/auth/v1/fmo/admin/category/data', (_req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(loadCategoryResponse()));
    }),
  );
};
