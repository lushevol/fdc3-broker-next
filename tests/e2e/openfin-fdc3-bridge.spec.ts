import { chromium, expect, test, type Browser, type Page } from '@playwright/test';

const openFinE2EEnabled = process.env.OPENFIN_E2E === '1';
const cdpUrl = process.env.OPENFIN_CDP_URL ?? 'http://127.0.0.1:9223';
const appUrl = process.env.OPENFIN_E2E_APP_URL ?? 'http://127.0.0.1:8001/?show_normal_login=Y';

function getNavigationUrl(): string {
  const url = new URL(appUrl);
  url.searchParams.set('openfin_e2e_ts', `${Date.now()}`);
  return url.toString();
}

type OpenFinE2EWindow = Window & {
  fin?: {
    desktop?: unknown;
    Interop?: {
      init?: (name: string, override?: unknown) => Promise<unknown>;
      connectSync?: (name: string) => unknown;
    };
    me?: {
      isOpenFin?: boolean;
      interop?: {
        fireIntent?: unknown;
        registerIntentHandler?: unknown;
      };
    };
  };
  fdc3?: {
    raiseIntent: (intent: string, context: unknown) => Promise<unknown>;
    addIntentListener: (
      intent: string,
      handler: (context: unknown) => unknown,
    ) => Promise<unknown>;
  };
  __OPENFIN_E2E_ADD_INTENT_LISTENER_WRAPPED__?: boolean;
  __OPENFIN_E2E_REGISTERED_INTENTS__?: string[];
  __RATAN_FDC3__?: {
    brokerInstance: {
      raiseIntent: (
        intent: string,
        context: unknown,
        target?: unknown,
        source?: unknown,
      ) => Promise<unknown>;
    };
  };
  __OPENFIN_E2E_EXTERNAL_INTENT__?: {
    id?: {
      email?: string;
    };
  } | null;
};

type OpenFinInteropBrokerConstructor = new (...args: unknown[]) => {
  setIntentTarget: (intent: { name: string }, target: unknown) => Promise<void>;
};

test.skip(!openFinE2EEnabled, 'Set OPENFIN_E2E=1 and launch OpenFin before running this spec.');
test.describe.configure({ mode: 'serial' });

let browser: Browser;
let page: Page;

async function findOpenFinPage(browserInstance: Browser): Promise<Page> {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const pages = browserInstance.contexts().flatMap((context) => context.pages());
    const appPage = pages.find((candidate) => {
      const url = candidate.url();
      return url.includes('127.0.0.1:8001') || url.includes('localhost:8001');
    });

    if (appPage) {
      return appPage;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `Could not find the base MFE page in OpenFin via ${cdpUrl}. ` +
      'Run `npm run openfin:e2e:launch` while the dev UI is available.',
  );
}

async function closeExpiredSessionModal(target: Page): Promise<void> {
  const closeButton = target.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}

async function installOpenFinInteropBootstrap(target: Page): Promise<void> {
  await target.addInitScript(() => {
    const bootstrapInterop = async (): Promise<void> => {
      const openFinWindow = window as OpenFinE2EWindow;
      const interopModule = openFinWindow.fin?.Interop;
      if (!interopModule) {
        return;
      }

      if (
        openFinWindow.fdc3 &&
        !openFinWindow.__OPENFIN_E2E_ADD_INTENT_LISTENER_WRAPPED__
      ) {
        const originalAddIntentListener = openFinWindow.fdc3.addIntentListener.bind(
          openFinWindow.fdc3,
        );
        openFinWindow.__OPENFIN_E2E_REGISTERED_INTENTS__ = [];
        openFinWindow.fdc3.addIntentListener = async (intent, handler) => {
          openFinWindow.__OPENFIN_E2E_REGISTERED_INTENTS__?.push(intent);
          return originalAddIntentListener(intent, handler);
        };
        openFinWindow.__OPENFIN_E2E_ADD_INTENT_LISTENER_WRAPPED__ = true;
      }

      if (typeof interopModule.init === 'function') {
        const openFinE2EInteropOverride = (
          InteropBroker: OpenFinInteropBrokerConstructor,
          ...args: unknown[]
        ): unknown => {
          return new (class extends InteropBroker {
            async handleFiredIntent(
              intent: { name: string },
              clientIdentity: { name?: string; uuid?: string },
            ): Promise<unknown> {
              const target = {
                name: clientIdentity.name ?? 'fdc3-broker-next-e2e',
                uuid: clientIdentity.uuid ?? 'fdc3-broker-next-e2e',
              };

              await this.setIntentTarget(intent, target);

              return {
                source: {
                  appId: target.name,
                  instanceId: target.uuid,
                },
                intent: intent.name,
              };
            }
          })(...args);
        };

        await interopModule.init('openfin', openFinE2EInteropOverride).catch(() => undefined);
      }

      if (
        typeof interopModule.connectSync === 'function' &&
        (typeof openFinWindow.fin?.me?.interop?.fireIntent !== 'function' ||
          typeof openFinWindow.fin.me.interop.registerIntentHandler !== 'function')
      ) {
        const client = interopModule.connectSync('openfin');
        if (openFinWindow.fin?.me) {
          openFinWindow.fin.me.interop = client as OpenFinE2EWindow['fin'] extends {
            me?: { interop?: infer T };
          }
            ? T
            : never;
        }
      }
    };

    const tryBootstrap = (): void => {
      void bootstrapInterop();
    };

    tryBootstrap();
    window.addEventListener('DOMContentLoaded', tryBootstrap);
    window.addEventListener('fdc3Ready', tryBootstrap);
  });
}

async function waitForOpenFinIntentSubscription(target: Page, intent: string): Promise<void> {
  await expect
    .poll(() =>
      target.evaluate(
        (intentName) => {
          const openFinWindow = window as OpenFinE2EWindow;
          return openFinWindow.__OPENFIN_E2E_REGISTERED_INTENTS__?.includes(intentName) ?? false;
        },
        intent,
      ),
    )
    .toBe(true);
}

async function ensureOpenFinInterop(target: Page): Promise<void> {
  await target.evaluate(async () => {
    const openFinWindow = window as OpenFinE2EWindow;
    const interopModule = openFinWindow.fin?.Interop;
    if (!interopModule) {
      return;
    }

    if (typeof interopModule.init === 'function') {
      const openFinE2EInteropOverride = (
        InteropBroker: OpenFinInteropBrokerConstructor,
        ...args: unknown[]
      ): unknown => {
        return new (class extends InteropBroker {
          async handleFiredIntent(
            intent: { name: string },
            clientIdentity: { name?: string; uuid?: string },
          ): Promise<unknown> {
            const target = {
              name: clientIdentity.name ?? 'fdc3-broker-next-e2e',
              uuid: clientIdentity.uuid ?? 'fdc3-broker-next-e2e',
            };

            await this.setIntentTarget(intent, target);

            return {
              source: {
                appId: target.name,
                instanceId: target.uuid,
              },
              intent: intent.name,
            };
          }
        })(...args);
      };

      await interopModule.init('openfin', openFinE2EInteropOverride).catch(() => undefined);
    }

    if (
      typeof interopModule.connectSync === 'function' &&
      (typeof openFinWindow.fin?.me?.interop?.fireIntent !== 'function' ||
        typeof openFinWindow.fin.me.interop.registerIntentHandler !== 'function')
    ) {
      const client = interopModule.connectSync('openfin');
      if (openFinWindow.fin?.me) {
        openFinWindow.fin.me.interop = client as OpenFinE2EWindow['fin'] extends {
          me?: { interop?: infer T };
        }
          ? T
          : never;
      }
    }
  });
}

async function loginToWorkspace(target: Page): Promise<void> {
  await target.goto(getNavigationUrl());
  await ensureOpenFinInterop(target);
  await target.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await target.goto(getNavigationUrl());
  await ensureOpenFinInterop(target);
  await closeExpiredSessionModal(target);
  await target.getByRole('button', { name: 'Sign In', exact: true }).click();
  await closeExpiredSessionModal(target);
  await expect(target.getByText('New Tile')).toBeVisible();
}

async function expectOpenFinRuntime(target: Page): Promise<void> {
  await ensureOpenFinInterop(target);
  await expect
    .poll(async () =>
      target.evaluate(() => {
        const openFinWindow = window as OpenFinE2EWindow;
        return (
          Boolean(openFinWindow.fin?.desktop || openFinWindow.fin?.me?.isOpenFin) &&
          typeof openFinWindow.fdc3?.raiseIntent === 'function'
        );
      }),
    )
    .toBe(true);
}

async function raiseOpenFinIntent(target: Page, intent: string, context: unknown): Promise<void> {
  await ensureOpenFinInterop(target);
  await waitForOpenFinIntentSubscription(target, intent);
  await target.evaluate(
    async ({ intentName, payload }) => {
      const openFinWindow = window as OpenFinE2EWindow;
      if (!openFinWindow.fdc3) {
        throw new Error('OpenFin FDC3 API is not available');
      }
      await openFinWindow.fdc3.raiseIntent(intentName, payload);
    },
    { intentName: intent, payload: context },
  );
}

test.beforeAll(async () => {
  browser = await chromium.connectOverCDP(cdpUrl);
  page = await findOpenFinPage(browser);
  await installOpenFinInteropBootstrap(page);
});

test('base MFE is running inside OpenFin with FDC3 available', async () => {
  await page.goto(getNavigationUrl());
  await ensureOpenFinInterop(page);
  await expectOpenFinRuntime(page);
});

test('routes OpenFin ViewLaunch intent by context to the matching tile', async () => {
  await loginToWorkspace(page);
  await expectOpenFinRuntime(page);

  await raiseOpenFinIntent(page, 'scb.ViewLaunch', {
    type: 'scb.fmptp.cashflow',
    id: {
      cashflowId: 'CF-OPENFIN-001',
    },
  });

  await expect(page.getByRole('tab', { name: 'FDC3 Tile 1' }).first()).toBeVisible();
});

test('persists pre-login OpenFin intents and replays them after login', async () => {
  await page.goto(getNavigationUrl());
  await ensureOpenFinInterop(page);
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto(getNavigationUrl());
  await ensureOpenFinInterop(page);
  await expectOpenFinRuntime(page);

  await raiseOpenFinIntent(page, 'scb.ViewLaunch', {
    type: 'scb.fmptp.cashflow',
    id: {
      cashflowId: 'CF-PRELOGIN-001',
    },
  });

  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('fdc3-intent-queue')))
    .toContain('__prelogin__');

  await page.reload();
  await closeExpiredSessionModal(page);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await closeExpiredSessionModal(page);

  await expect(page.getByText('New Tile')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'FDC3 Tile 1' }).first()).toBeVisible();
});

test('dispatches an internal broker intent to an external OpenFin listener', async () => {
  await loginToWorkspace(page);
  await expectOpenFinRuntime(page);
  await ensureOpenFinInterop(page);

  await page.evaluate(async () => {
    const openFinWindow = window as OpenFinE2EWindow;
    if (!openFinWindow.fdc3) {
      throw new Error('OpenFin FDC3 API is not available');
    }
    openFinWindow.__OPENFIN_E2E_EXTERNAL_INTENT__ = null;

    const originalRaiseIntent = openFinWindow.fdc3.raiseIntent.bind(openFinWindow.fdc3);
    openFinWindow.fdc3.raiseIntent = async (intent: string, context: unknown) => {
      if (intent === 'StartCall') {
        openFinWindow.__OPENFIN_E2E_EXTERNAL_INTENT__ =
          context as OpenFinE2EWindow['__OPENFIN_E2E_EXTERNAL_INTENT__'];
        return {
          intent,
          source: {
            appId: 'openfin-e2e-external-listener',
            instanceId: 'openfin-e2e-external-listener',
          },
          getResult: async () => undefined,
        };
      }

      return originalRaiseIntent(intent, context);
    };
  });

  await page.evaluate(async () => {
    const openFinWindow = window as OpenFinE2EWindow;
    if (!openFinWindow.__RATAN_FDC3__?.brokerInstance) {
      throw new Error('Ratan FDC3 broker is not available');
    }
    await openFinWindow.__RATAN_FDC3__.brokerInstance.raiseIntent(
      'StartCall',
      {
        type: 'fdc3.contact',
        id: {
          email: 'openfin-e2e@example.com',
        },
      },
      undefined,
      {
        appId: 'template_tile_fdc3_1',
        instanceId: 'openfin-e2e-source',
      },
    );
  });

  await expect
    .poll(() =>
      page.evaluate(() => {
        const openFinWindow = window as OpenFinE2EWindow;
        return openFinWindow.__OPENFIN_E2E_EXTERNAL_INTENT__?.id?.email ?? null;
      }),
    )
    .toBe('openfin-e2e@example.com');
});
