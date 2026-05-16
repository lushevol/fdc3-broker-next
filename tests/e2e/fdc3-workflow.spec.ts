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
  await expect(page.getByRole('button', { name: 'Find tile' })).toBeVisible();
}

async function openTileFromDrawer(page: Page, tileName: string): Promise<void> {
  const findTileButton = page.getByRole('button', { name: 'Find tile' });
  await findTileButton.evaluate((element: HTMLButtonElement) => {
    element.click();
  });
  await expect(page.getByText('Tile Options')).toBeVisible();
  await page.getByText(tileName, { exact: true }).click();
  await expect(page.getByRole('tab', { name: tileName })).toBeVisible();
}

async function selectWorkspace(page: Page, workspaceName: string): Promise<void> {
  const tab = page.getByRole('tab', { name: workspaceName });
  await tab.evaluate((element: HTMLElement) => {
    element.click();
  });
  await expect(tab).toHaveAttribute('aria-selected', 'true');
}

function activeWorkspacePanel(page: Page) {
  return page.locator('[role="tabpanel"]:not([hidden])');
}

test.describe('FDC3 workflow engine', () => {
  test('launcher raises a declared workflow and passes blotter output into ViewChart', async ({
    page,
  }) => {
    await loginToWorkspace(page);
    await openTileFromDrawer(page, 'FDC3 Workflow Launcher');

    await page.getByRole('button', { name: 'Run Workflow' }).click();

    await expect(page.getByRole('tab', { name: 'FDC3 Tile 2' })).toBeVisible();
    await selectWorkspace(page, 'FDC3 Tile 2');
    await expect(page.getByTestId('fdc3-view-chart-received').first()).toContainText('AAPL');

    await expect(page.getByRole('tab', { name: 'Trade Blotter' })).toBeVisible();
    await selectWorkspace(page, 'Trade Blotter');
    await expect(
      activeWorkspacePanel(page).getByText('12 trades found. Returning top 10 rows.'),
    ).toBeVisible();
    await expect(activeWorkspacePanel(page).getByText('TR-001')).toBeVisible();
    await expect(activeWorkspacePanel(page).getByText('AAPL')).toBeVisible();

    await selectWorkspace(page, 'FDC3 Workflow Launcher');
    await expect(page.getByTestId('fdc3-workflow-launcher-status')).toHaveText(
      'Workflow completed',
    );
    await expect(page.getByTestId('fdc3-workflow-launcher-result')).toContainText(
      'view-chart',
    );
  });
});
