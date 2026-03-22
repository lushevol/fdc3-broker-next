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

    const middlewarePaths = registeredMiddlewares.map((middleware) => middleware.path).filter(Boolean);
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

    const middlewarePaths = registeredMiddlewares.map((middleware) => middleware.path).filter(Boolean);

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
      (
        req: { url?: string },
        res: unknown,
        next?: jest.Mock,
      ): unknown;
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
});
