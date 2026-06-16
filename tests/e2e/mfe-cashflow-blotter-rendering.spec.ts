import { expect, test, type Page } from '@playwright/test';

test.use({ channel: 'chrome' });

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
  await page.waitForTimeout(3000);
}

test.describe('Cashflow Blotter Rendering', () => {
  test('cashflow blotter module loads via System.import with all dependencies', async ({ page }) => {
    await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const loadResult = await page.evaluate(async () => {
      try {
        const mod = await (window as any).System.import('@fm/ratan_cashflow_blotter');
        return {
          success: true,
          hasDefaultComponent: typeof mod.default === 'function',
          exportedNames: Object.keys(mod).filter(k => k !== 'default').join(', '),
          componentName: mod.default?.name || mod.default?.displayName || 'unknown',
        };
      } catch (err: any) {
        return { success: false, error: err.message, stack: err.stack?.substring(0, 500) };
      }
    });

    console.log('Load result:', JSON.stringify(loadResult, null, 2));

    expect(loadResult.success).toBe(true);
    expect(loadResult.hasDefaultComponent).toBe(true);
    expect(loadResult.exportedNames).toContain('DetailsBodyWithTheme');
    expect(loadResult.exportedNames).toContain('DetailsHeaderWithTheme');
    expect(loadResult.exportedNames).toContain('graphql');
    expect(loadResult.componentName).toBe('App');
  });

  test('cashflow blotter dependencies via @fm/ratan_container are accessible', async ({ page }) => {
    await page.goto('http://127.0.0.1:8001/?show_normal_login=Y');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that all modules the cashflow blotter depends on are accessible
    const depResult = await page.evaluate(async () => {
      const results: Record<string, any> = {};

      // Load @fm/ratan_container (shared utilities)
      try {
        const rc = await (window as any).System.import('@fm/ratan_container');
        results['@fm/ratan_container'] = { loaded: true };

        // Check key exports that cashflow_blotter uses
        const expectedExports = [
          'RatanutilsLogger',
          'RatanutilsInit',
          'RatanutilsAuthenticator',
          'RatanutilsComponentEnabling',
          'RatanutilsConversion',
          'RatanutilsHttpGraphql',
          'RatanutilsUtils',
          'RatanutilsFilteringData',
          'RatanutilsInfiniteScrollData',
          'RatanutilsEventBus',
          'Amounty',
          'RatancomponentsDataGrid',
          'RatancomponentsFilterSelector',
          'RatancomponentsLoading',
          'RatancomponentsDialog',
        ];

        results['@fm/ratan_container'].missing = expectedExports.filter(
          (name) => typeof rc[name] === 'undefined'
        );
        results['@fm/ratan_container'].available = expectedExports.filter(
          (name) => typeof rc[name] !== 'undefined'
        );
      } catch (err: any) {
        results['@fm/ratan_container'] = { loaded: false, error: err.message };
      }

      // Load @fm/base
      try {
        const base = await (window as any).System.import('@fm/base');
        results['@fm/base'] = {
          loaded: true,
          hasReactRouterDom: typeof base.ReactRouterDom !== 'undefined',
          hasProvider: typeof base.Provider !== 'undefined',
          hasSplash: typeof base.Splash !== 'undefined',
          hasDispatcher: typeof base.Dispatcher !== 'undefined',
          hasService: typeof base.Service !== 'undefined',
          hasCommonUtil: typeof base.CommonUtil !== 'undefined',
        };
      } catch (err: any) {
        results['@fm/base'] = { loaded: false, error: err.message };
      }

      return results;
    });

    console.log('Dependencies:', JSON.stringify(depResult, null, 2));

    // All dependencies should load
    expect(depResult['@fm/ratan_container']?.loaded).toBe(true);
    expect(depResult['@fm/base']?.loaded).toBe(true);
    expect(depResult['@fm/base']?.hasReactRouterDom).toBe(true);

    // Check missing exports from ratan_container
    const missing = depResult['@fm/ratan_container']?.missing || [];
    console.log('Missing exports from @fm/ratan_container:', missing);
    for (const m of missing) {
      console.log(`❌ Missing: ${m}`);
    }
    expect(missing.length).toBe(0);
  });

  test('logged-in app can load and render the cashflow blotter container', async ({ page }) => {
    await loginToWorkspace(page);

    // Collect errors
    const errors: any[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Try loading the cashflow blotter via the same pattern as CashFlowCN.tsx
    // (React.lazy(() => System.import("@fm/ratan_cashflow_blotter")))
    const renderTest = await page.evaluate(async () => {
      const errors: string[] = [];

      try {
        // Load the module
        const mod = await (window as any).System.import('@fm/ratan_cashflow_blotter');
        const App = mod.default;

        // Verify it's a valid React component
        if (typeof App !== 'function') {
          errors.push('default export is not a function/component');
        }

        return {
          success: errors.length === 0,
          componentType: typeof App,
          errors,
        };
      } catch (err: any) {
        return { success: false, errors: [err.message] };
      }
    });

    console.log('Render test:', JSON.stringify(renderTest, null, 2));
    expect(renderTest.success).toBe(true);
  });

  test('cashflow blotter routes exist in compiled bundle', async ({ page }) => {
    // Verify the routes are present in the compiled output
    const response = await page.request.get('http://localhost:8015/ratan_cashflow_blotter.js');
    const content = await response.text();
    expect(response.status()).toBe(200);

    // All expected routes from the Routing component
    const routesToCheck = [
      '/cashflow_cn/*',
      '/cashflow_blotter_cn/cashflow_cn/*',
      '/cashflow_open_search/*',
      '/cashflow_group_management/*',
      '/cashflow_cn_dashboard/*',
      '/cashflow_bic_netting_static_table/*',
      '/cashflow_utilization_static_table/*',
      '/cashflow_authorization_limits/*',
      '/cashflow_splitting_static/*',
    ];

    for (const route of routesToCheck) {
      const cleanRoute = route.replace('/*', '').replace('/', '');
      const hasRoute = content.includes(cleanRoute);
      console.log(`Route ${route}: ${hasRoute ? '✅' : '❌'}`);
      expect(hasRoute).toBe(true);
    }
  });
});
