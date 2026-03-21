describe('root-config local integration', () => {
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

    const { default: createConfig } = await import('./webpack.config');
    const config = createConfig({}, {});
    const setupMiddlewares = config.devServer.setupMiddlewares;

    const middlewares = setupMiddlewares([], {
      app: {},
    });

    const middlewarePaths = middlewares.map((middleware) => middleware.path).filter(Boolean);
    const proxyContexts = config.devServer.proxy.flatMap((entry) => entry.context);

    expect(middlewarePaths).not.toEqual(expect.arrayContaining(['/api/auth/v2/sso/login']));
    expect(proxyContexts).toEqual(expect.arrayContaining(['/api/auth/', '/api/analytics/']));
  });

  it('keeps webpack auth mocks available when the switch is disabled', async () => {
    process.env.useBackendAuth = 'false';

    const { default: createConfig } = await import('./webpack.config');
    const config = createConfig({}, {});
    const setupMiddlewares = config.devServer.setupMiddlewares;

    const middlewares = setupMiddlewares([], {
      app: {},
    });

    const middlewarePaths = middlewares.map((middleware) => middleware.path).filter(Boolean);

    expect(middlewarePaths).toEqual(expect.arrayContaining([
      '/api/auth/v2/sso/login',
      '/api/auth/v2/sso/validate',
      '/api/auth/v2/sso/extend',
      '/api/auth/v2/sso/refreshtoken',
      '/api/auth/v2/sso/relogin',
    ]));
  });
});
