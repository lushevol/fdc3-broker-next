describe('root-config rsbuild integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      port: '8001',
      mode: 'development',
      orgName: 'fm',
      devtool: 'false',
      isLocal: 'true',
      publicUrl: '',
      importmap: '',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses backend auth when the switch is enabled', async () => {
    process.env.useBackendAuth = 'true';

    const { rootConfigDevSetup, rootConfigProxy } = await import('./rsbuild.config');

    const registeredMiddlewares: Array<{ path?: string }> = [];

    rootConfigDevSetup(
      {
        unshift: (...handlers) => {
          registeredMiddlewares.unshift(...handlers);
        },
        push: (...handlers) => {
          registeredMiddlewares.push(...handlers);
        },
      },
      {} as never,
    );

    const middlewarePaths = registeredMiddlewares
      .map((middleware) => middleware.path)
      .filter(Boolean);
    const proxyContexts = rootConfigProxy.map((entry) => entry.context).flat();

    expect(middlewarePaths).not.toEqual(expect.arrayContaining(['/api/auth/v2/sso/login']));
    expect(proxyContexts).toEqual(expect.arrayContaining(['/api/auth/', '/api/analytics/']));
  });

  it('keeps auth mocks available when the switch is disabled', async () => {
    process.env.useBackendAuth = 'false';

    const { rootConfigDevSetup } = await import('./rsbuild.config');

    const registeredMiddlewares: Array<{ path?: string }> = [];

    rootConfigDevSetup(
      {
        unshift: (...handlers) => {
          registeredMiddlewares.unshift(...handlers);
        },
        push: (...handlers) => {
          registeredMiddlewares.push(...handlers);
        },
      },
      {} as never,
    );

    const middlewarePaths = registeredMiddlewares
      .map((middleware) => middleware.path)
      .filter(Boolean);

    expect(middlewarePaths).toEqual(
      expect.arrayContaining([
        '/api/auth/v2/sso/login',
        '/api/auth/v2/sso/validate',
        '/api/auth/v2/sso/extend',
        '/api/auth/v2/sso/refreshtoken',
        '/api/auth/v2/sso/relogin',
      ]),
    );
  });

  it('does not hijack unrelated routes with mock middleware', async () => {
    process.env.useBackendAuth = 'false';

    const { rootConfigDevSetup } = await import('./rsbuild.config');

    const registeredMiddlewares: Array<{
      path?: string;
      (req: { url?: string }, res: unknown, next?: jest.Mock): unknown;
    }> = [];

    rootConfigDevSetup(
      {
        unshift: (...handlers) => {
          registeredMiddlewares.unshift(...handlers);
        },
        push: (...handlers) => {
          registeredMiddlewares.push(...handlers);
        },
      },
      {} as never,
    );

    const loginMiddleware = registeredMiddlewares.find(
      (middleware) => middleware.path === '/api/auth/v2/sso/login',
    );

    expect(loginMiddleware).toBeDefined();

    const next = jest.fn();

    loginMiddleware?.({ url: '/' }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('registers captured app api mocks in the root-config dev server', async () => {
    process.env.useBackendAuth = 'false';

    const { rootConfigDevSetup } = await import('./rsbuild.config');

    const registeredMiddlewares: Array<{ path?: string }> = [];

    rootConfigDevSetup(
      {
        unshift: (...handlers) => {
          registeredMiddlewares.unshift(...handlers);
        },
        push: (...handlers) => {
          registeredMiddlewares.push(...handlers);
        },
      },
      {} as never,
    );

    const middlewarePaths = registeredMiddlewares
      .map((middleware) => middleware.path)
      .filter(Boolean);

    expect(middlewarePaths).toEqual(expect.arrayContaining(['__capturedApiMocks']));
  });

  it('lets Flowzero workflow service routes reach the live service proxy', async () => {
    process.env.useBackendAuth = 'false';

    const { rootConfigDevSetup } = await import('./rsbuild.config');

    const registeredMiddlewares: Array<{
      path?: string;
      (
        req: { method?: string; url?: string },
        res: { setHeader: jest.Mock; end: jest.Mock },
        next: jest.Mock,
      ): Promise<void> | void;
    }> = [];

    rootConfigDevSetup(
      {
        unshift: (...handlers) => {
          registeredMiddlewares.unshift(...handlers);
        },
        push: (...handlers) => {
          registeredMiddlewares.push(...handlers);
        },
      },
      {} as never,
    );

    const capturedMiddleware = registeredMiddlewares.find(
      (middleware) => middleware.path === '__capturedApiMocks',
    );
    const res = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };
    const next = jest.fn();

    await capturedMiddleware?.(
      { method: 'GET', url: '/api/flowzero/v1/workflow/page?page=0&size=10' },
      res,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.end).not.toHaveBeenCalled();
  });

  it('registers a silent analytics print endpoint for UI-only dev', async () => {
    process.env.useBackendAuth = 'false';

    const { rootConfigDevSetup } = await import('./rsbuild.config');

    const registeredMiddlewares: Array<{ path?: string }> = [];

    rootConfigDevSetup(
      {
        unshift: (...handlers) => {
          registeredMiddlewares.unshift(...handlers);
        },
        push: (...handlers) => {
          registeredMiddlewares.push(...handlers);
        },
      },
      {} as never,
    );

    const middlewarePaths = registeredMiddlewares
      .map((middleware) => middleware.path)
      .filter(Boolean);

    expect(middlewarePaths).toEqual(
      expect.arrayContaining(['/api/analytics/v1/fmo/print', '/v1/fmo/print']),
    );
  });
});

describe('captured app api mock matching', () => {
  it('matches GET requests by pathname and required query values', async () => {
    const { findCapturedApiFixture } = await import('./captured-api-mocks');

    const match = findCapturedApiFixture(
      [
        {
          name: 'flowzero workflow page',
          request: {
            method: 'GET',
            pathname: '/api/flowzero/v1/workflow/page',
            query: { page: '0', size: '10' },
          },
          response: { status: 200, body: { data: [] } },
        },
      ],
      'GET',
      '/api/flowzero/v1/workflow/page?page=0&size=10',
      '',
    );

    expect(match?.name).toBe('flowzero workflow page');
  });

  it('matches POST requests by configured body markers', async () => {
    const { findCapturedApiFixture } = await import('./captured-api-mocks');

    const match = findCapturedApiFixture(
      [
        {
          name: 'cashflow grid rows',
          request: {
            method: 'POST',
            pathname: '/api/ratan/stmcn/v1/cashflows',
            bodyIncludes: ['RatanUltraQuery', 'BCS_Trade_Id'],
          },
          response: { status: 200, body: { data: { cashflowUltraQuery: { totalResult: 20 } } } },
        },
      ],
      'POST',
      '/api/ratan/stmcn/v1/cashflows',
      {
        query:
          'query SettlementCashflowDataUltraQuery($payload: RatanUltraQuery!) { BCS_Trade_Id }',
      },
    );

    expect(match?.name).toBe('cashflow grid rows');
  });

  it('prefers the most specific fixture when request markers overlap', async () => {
    const { findCapturedApiFixture } = await import('./captured-api-mocks');

    const match = findCapturedApiFixture(
      [
        {
          name: 'cashflow preset count',
          request: {
            method: 'POST',
            pathname: '/api/ratan/stmcn/v1/cashflows',
            bodyIncludes: ['Pending Operator', '2026-06-29'],
          },
          response: { status: 200, body: { data: { cashflowUltraQuery: { totalResult: 1 } } } },
        },
        {
          name: 'cashflow grid rows',
          request: {
            method: 'POST',
            pathname: '/api/ratan/stmcn/v1/cashflows',
            bodyIncludes: ['Pending Operator', '2026-06-29', 'RatanUltraQuery', 'BCS_Trade_Id'],
          },
          response: { status: 200, body: { data: { cashflowUltraQuery: { totalResult: 20 } } } },
        },
      ],
      'POST',
      '/api/ratan/stmcn/v1/cashflows',
      {
        query:
          'query SettlementCashflowDataUltraQuery($payload: RatanUltraQuery!) { BCS_Trade_Id }',
        variables: {
          filters: ['Pending Operator', '2026-06-29'],
        },
      },
    );

    expect(match?.name).toBe('cashflow grid rows');
  });

  it('does not match when required query or body markers are absent', async () => {
    const { findCapturedApiFixture } = await import('./captured-api-mocks');

    const match = findCapturedApiFixture(
      [
        {
          name: 'client data inbox',
          request: {
            method: 'GET',
            pathname: '/api/flowzero/v1/tasks/inbox',
            query: { workflowName: 'Client Data Review Workflow' },
          },
          response: { status: 200, body: { data: [] } },
        },
      ],
      'GET',
      '/api/flowzero/v1/tasks/inbox?page=0&size=10&workflowName=Holiday+Update+Workflow',
      '',
    );

    expect(match).toBeUndefined();
  });

  it('passes unrelated POST requests to later middleware without sending a response', async () => {
    const { Readable } = await import('node:stream');
    const { createCapturedApiMockMiddleware } = await import('./captured-api-mocks');
    const middleware = createCapturedApiMockMiddleware([
      {
        name: 'cashflow grid rows',
        request: {
          method: 'POST',
          pathname: '/api/ratan/stmcn/v1/cashflows',
          bodyIncludes: ['RatanUltraQuery'],
        },
        response: { status: 200, body: { ok: true } },
      },
    ]);
    const req = new Readable({ read: () => undefined }) as Readable & {
      method?: string;
      url?: string;
    };
    const res = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };
    const next = jest.fn();

    req.method = 'POST';
    req.url = '/api/auth/v1/fmo/admin/fdc3/create';

    await middleware(req as never, res as never, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.end).not.toHaveBeenCalled();
  });
});
