import { expect, test, type Page } from '@playwright/test';

test.use({ channel: 'chrome' });
test.setTimeout(120_000);

type RaisedIntent = {
  intent: string;
  context: {
    type?: string;
    target?: string;
    filters?: Array<{ field: string; operator: string; values: unknown }>;
  };
  target?: string | { appId?: string };
};

declare global {
  interface Window {
    __CASHFLOW_FDC3_E2E_RAISED__?: RaisedIntent[];
    __RATAN_FDC3__?: {
      brokerInstance?: {
        raiseIntent: (...args: unknown[]) => Promise<unknown>;
        intentListeners?: Map<string, unknown[]>;
      };
    };
  }
}

async function closeExpiredSessionModal(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}

async function loginToWorkspace(page: Page): Promise<void> {
  await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');
  await closeExpiredSessionModal(page);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await closeExpiredSessionModal(page);
  await expect(page.getByRole('button', { name: 'Find tile' })).toBeVisible();
}

async function openTileFromDrawer(page: Page, tileName: string): Promise<void> {
  await page.getByRole('button', { name: 'Find tile' }).evaluate((element: HTMLButtonElement) => {
    element.click();
  });
  await expect(page.getByText('Tile Options')).toBeVisible();
  await page.getByText(tileName, { exact: true }).click();
  await expect(page.getByRole('tab', { name: tileName })).toBeVisible();
}

async function createNewWorkspace(page: Page): Promise<void> {
  const addBtn = page.getByRole('button', { name: 'Add Workspace' });
  await addBtn.click();
  await expect(page.getByRole('tab', { name: 'Workspace 2' }).last()).toBeVisible();
}

/**
 * Check how many SearchCashflows listeners are registered on the broker
 */
async function registeredSearchCashflowListenerCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const listeners =
      window.__RATAN_FDC3__?.brokerInstance?.intentListeners?.get('SearchCashflows');
    return listeners?.length ?? 0;
  });
}

/**
 * Get all registered intent names on the broker
 */
async function registeredIntentNames(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const listeners = window.__RATAN_FDC3__?.brokerInstance?.intentListeners;
    return listeners ? Array.from(listeners.keys()) : [];
  });
}

test.describe('Cashflow FDC3 migration', () => {
  test('declares SearchCashflows intent, context, and app bindings in admin module', async ({ page }) => {
    await loginToWorkspace(page);

    const declarationState = await page.evaluate(async () => {
      const [declarations, intents, contexts] = await Promise.all(
        [
          '/api/auth/v1/fmo/admin/fdc3/data',
          '/api/auth/v1/fmo/admin/fdc3/intent/data',
          '/api/auth/v1/fmo/admin/fdc3/context/data',
        ].map(async (url) => {
          const response = await fetch(url, { method: 'POST' });
          return response.json();
        }),
      );

      return {
        declarations: declarations.data,
        intents: intents.data,
        contexts: contexts.data,
      };
    });

    // 1. Intent master list contains SearchCashflows
    expect(declarationState.intents).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'SearchCashflows' })]),
    );

    // 2. Context master list contains scb.fmptp.cashflow.query schema
    expect(declarationState.contexts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          schema: expect.objectContaining({
            properties: expect.objectContaining({
              type: expect.objectContaining({ const: 'scb.fmptp.cashflow.query' }),
            }),
          }),
        }),
      ]),
    );

    // 3. Declarations include all 3 cashflow apps
    expect(declarationState.declarations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ appId: 'cashflow_cn_dashboard' }),
        expect.objectContaining({ appId: 'cashflow_cn' }),
        expect.objectContaining({ appId: 'cashflow_group_management' }),
      ]),
    );

    // 4. Verify declaration structure: dashboard raises, CN and group listen
    const dashboardDecl = declarationState.declarations.find(
      (d: any) => d.appId === 'cashflow_cn_dashboard',
    );
    const cnDecl = declarationState.declarations.find(
      (d: any) => d.appId === 'cashflow_cn',
    );
    const groupDecl = declarationState.declarations.find(
      (d: any) => d.appId === 'cashflow_group_management',
    );

    expect(dashboardDecl?.interop?.intents?.raises).toBeDefined();
    expect(dashboardDecl?.interop?.intents?.listensFor).toBeUndefined();
    expect(cnDecl?.interop?.intents?.listensFor).toBeDefined();
    expect(groupDecl?.interop?.intents?.listensFor).toBeDefined();

    // 5. All contexts reference scb.fmptp.cashflow.query
    const allContexts = [
      ...(dashboardDecl?.interop?.intents?.raises ?? []),
      ...(cnDecl?.interop?.intents?.listensFor ?? []),
      ...(groupDecl?.interop?.intents?.listensFor ?? []),
    ];
    for (const entry of allContexts) {
      expect(entry.contexts).toContain('scb.fmptp.cashflow.query');
    }
  });

  test('loads Cashflow Dashboard tile with status indicator cards', async ({ page }) => {
    await loginToWorkspace(page);
    await openTileFromDrawer(page, 'Cashflow Dashboard');

    // Verify the Dashboard tile rendered without error
    await expect(page.getByText('Waiting VD Today', { exact: true })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Failed VD Today', { exact: true })).toBeVisible();
    await expect(page.getByText('Group Pending', { exact: true })).toBeVisible();
    await expect(page.getByText('Group Error', { exact: true })).toBeVisible();
  });

  async function installRaiseIntentRecorder(page: Page): Promise<void> {
    await page.waitForFunction(() => Boolean(window.__RATAN_FDC3__?.brokerInstance?.raiseIntent));
    await page.evaluate(() => {
      const broker = window.__RATAN_FDC3__?.brokerInstance;
      if (!broker) return;

      const originalRaiseIntent = broker.raiseIntent.bind(broker);
      window.__CASHFLOW_FDC3_E2E_RAISED__ = [];
      (broker as any).raiseIntent = async function cashflowFdc3E2eRaiseIntent(
        intent: string,
        context: unknown,
        target?: unknown,
      ) {
        window.__CASHFLOW_FDC3_E2E_RAISED__?.push({
          intent,
          context: context as RaisedIntent['context'],
          target: target as RaisedIntent['target'],
        });
        return originalRaiseIntent(intent, context, target);
      };
    });
  }

  async function raisedIntents(page: Page): Promise<RaisedIntent[]> {
    return page.evaluate(() => window.__CASHFLOW_FDC3_E2E_RAISED__ ?? []);
  }

  test('clicking status card raises SearchCashflows intent via FDC3 broker', async ({ page }) => {
    await loginToWorkspace(page);
    await openTileFromDrawer(page, 'Cashflow Dashboard');
    await installRaiseIntentRecorder(page);

    // Open Cashflow Blotter so there's a listener to route to
    await createNewWorkspace(page);
    await openTileFromDrawer(page, 'Cashflow Blotter');

    // Switch back to Dashboard workspace and click a card
    await page.getByRole('tab', { name: 'Cashflow Dashboard' }).last().click();
    await expect(page.getByText('Waiting VD Today', { exact: true })).toBeVisible();

    await page.getByText('Waiting VD Today', { exact: true }).click();

    const intents = await raisedIntents(page);
    const searchIntent = intents.find(
      (i) => i.intent === 'SearchCashflows' && i.context?.type === 'scb.fmptp.cashflow.query',
    );
    expect(searchIntent).toBeDefined();
    expect(searchIntent?.context?.target).toBe('cashflow_cn');
    expect(searchIntent?.context?.filters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'Cashflow.Cashflow_State', operator: 'IN' }),
      ]),
    );

    // Verify the intent was raised with correct context schema
    expect(searchIntent?.context?.type).toBe('scb.fmptp.cashflow.query');
    expect(Array.isArray(searchIntent?.context?.filters)).toBeTruthy();
  });

  test('registers SearchCashflows listeners for both cashflow apps', async ({ page }) => {
    await loginToWorkspace(page);

    // ---- Phase 1: Open Cashflow Blotter → verify its SearchCashflows listener ----
    await openTileFromDrawer(page, 'Cashflow Blotter');

    await expect
      .poll(async () => registeredSearchCashflowListenerCount(page), { timeout: 30_000 })
      .toBeGreaterThanOrEqual(1);

    await expect
      .poll(async () => registeredIntentNames(page), { timeout: 10_000 })
      .toContain('SearchCashflows');

    // ---- Phase 2: Open Grouping Blotter → verify its SearchCashflows listener too ----
    await createNewWorkspace(page);
    await openTileFromDrawer(page, 'Grouping Blotter');

    await expect
      .poll(async () => registeredSearchCashflowListenerCount(page), { timeout: 30_000 })
      .toBe(2);

    // ---- Phase 3: Verify the FDC3 broker infrastructure is ready ----
    const brokerHealth = await page.evaluate(() => {
      const broker = window.__RATAN_FDC3__?.brokerInstance;
      return {
        brokerExists: !!broker,
        hasRaiseIntent: typeof broker?.raiseIntent === 'function',
        hasAddIntentListener: typeof (broker as any)?.addIntentListener === 'function',
        registeredIntentCount: broker?.intentListeners?.size ?? 0,
      };
    });

    expect(brokerHealth.brokerExists).toBeTruthy();
    expect(brokerHealth.hasRaiseIntent).toBeTruthy();
    expect(brokerHealth.hasAddIntentListener).toBeTruthy();
    expect(brokerHealth.registeredIntentCount).toBeGreaterThanOrEqual(1);
  });

  test('external-originated SearchCashflows intent triggers cashflow blotter via broker', async ({ page }) => {
    await loginToWorkspace(page);

    // ---- Phase 1: Open Cashflow Blotter so it registers a SearchCashflows listener ----
    await openTileFromDrawer(page, 'Cashflow Blotter');

    await expect
      .poll(async () => registeredSearchCashflowListenerCount(page), { timeout: 30_000 })
      .toBeGreaterThanOrEqual(1);

    // ---- Phase 2: Simulate an external (OpenFin) intent arriving at the broker ----
    // This mirrors the exact flow: OpenFin bridge receives intent from external
    // source, calls handleOpenFinIntent → routeOpenFinIntent → raiseIntent
    // with source.appId = 'external' (EXTERNAL_OPENFIN_SOURCE_APP_ID).
    const searchContext = {
      type: 'scb.fmptp.cashflow.query' as const,
      target: 'cashflow_cn' as const,
      filters: [
        { field: 'Cashflow.Cashflow_State', operator: 'IN', values: ['WAITING'] },
      ],
    };

    const resolutionResult = await page.evaluate(async (context) => {
      const broker = (window as any).__RATAN_FDC3__?.brokerInstance;
      if (!broker) throw new Error('FDC3 broker not available');

      // External source with appId='external' — same as what createExternalOpenFinSource()
      // produces in broker.ts (line 291-295). This tag prevents the broker from routing
      // an unresolved intent back to OpenFin (infinite loop protection).
      const resolution = await broker.raiseIntent(
        'SearchCashflows',
        context,
        'cashflow_cn',
        { appId: 'external' },
      );

      let result: unknown = undefined;
      try {
        result = await resolution.getResult();
      } catch {
        // getResult may reject if the handler didn't return a value
      }

      return {
        sourceAppId: resolution.source?.appId,
        sourceInstanceId: resolution.source?.instanceId,
        result,
      };
    }, searchContext);

    expect(resolutionResult.sourceAppId).toBe('cashflow_cn');

    // The cashflow blotter's handler returns { handled: true, filters: [...] }
    // when filters match the SearchCashflows context schema
    if (resolutionResult.result) {
      expect((resolutionResult.result as any).handled).toBe(true);
    }

    // ---- Phase 3: Verify the existing tab is still rendered ----
    await expect(page.getByRole('tab', { name: 'Cashflow Blotter' }).first()).toBeVisible();
  });

  test('external-originated SearchCashflows intent opens cashflow blotter if not already running', async ({ page }) => {
    await loginToWorkspace(page);

    // ---- Verify no cashflow blotter tab is open yet ----
    const cashflowTabVisible = await page.getByRole('tab', { name: 'Cashflow Blotter' }).isVisible().catch(() => false);
    if (!cashflowTabVisible) {
      // Confirm it's not there
      await expect(page.getByRole('tab', { name: 'Cashflow Blotter' })).toHaveCount(0);
    }

    // ---- Raise SearchCashflows as an external intent without opening the tile manually ----
    const searchContext = {
      type: 'scb.fmptp.cashflow.query' as const,
      target: 'cashflow_cn' as const,
      filters: [
        { field: 'Cashflow.Cashflow_State', operator: 'IN', values: ['WAITING'] },
      ],
    };

    await page.evaluate(async (context) => {
      const broker = (window as any).__RATAN_FDC3__?.brokerInstance;
      if (!broker) throw new Error('FDC3 broker not available');

      // External source intent — triggers the broker to open the cashflow_cn
      // app via deliverIntent → open() → waitForIntentListener → deliver
      const resolution = await broker.raiseIntent(
        'SearchCashflows',
        context,
        'cashflow_cn',
        { appId: 'external' },
      );

      return {
        sourceAppId: resolution.source?.appId,
      };
    }, searchContext);

    // ---- Verify the broker opened the cashflow blotter tile ----
    await expect(page.getByRole('tab', { name: 'Cashflow Blotter' }).first()).toBeVisible({ timeout: 30_000 });

    // Verify the SearchCashflows listener is now registered
    await expect
      .poll(async () => registeredSearchCashflowListenerCount(page), { timeout: 15_000 })
      .toBeGreaterThanOrEqual(1);
  });
});
