import { expect, test, type Page } from '@playwright/test';

async function closeExpiredSessionModal(page: Page): Promise<void> {
  const closeButton = page.getByRole('button', { name: 'Close' });
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
    return;
  }
  const extendButton = page.getByRole('button', { name: 'Extend' });
  if (await extendButton.isVisible().catch(() => false)) {
    await extendButton.click();
  }
}

async function loginToWorkspace(page: Page): Promise<void> {
  await page.goto('/?show_normal_login=Y');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto('/?show_normal_login=Y');
  await closeExpiredSessionModal(page);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await page.waitForTimeout(1000);
    await closeExpiredSessionModal(page);
    if (await page.getByRole('button', { name: 'Find tile' }).isVisible().catch(() => false)) {
      break;
    }
  }
  await expect(page.getByRole('button', { name: 'Find tile' })).toBeVisible();
}

async function openTileFromDrawer(page: Page, tileName: string): Promise<void> {
  const findTileButton = page.getByRole('button', { name: 'Find tile' });
  if (await findTileButton.isVisible().catch(() => false)) {
    await findTileButton.evaluate((element: HTMLButtonElement) => {
      element.click();
    });
  } else {
    await page.getByText('New Tile', { exact: true }).evaluate((element: HTMLElement) => {
      element.parentElement?.click();
    });
  }
  await expect(page.getByText('Tile Options')).toBeVisible();
  await page
    .locator('main')
    .filter({ hasText: tileName })
    .first()
    .evaluate((element: HTMLElement) => {
      element.click();
    });
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

test.describe('FDC3 workflow orchestrator', () => {
  test.setTimeout(120_000);

  test('streams three tile processors, presents results, and supports tab removal', async ({
    page,
  }) => {
    await loginToWorkspace(page);

    for (const tileName of [
      'Workflow · Trade Discovery',
      'Workflow · Market Pricing',
      'Workflow · Risk Assessment',
      'Workflow Orchestrator',
    ]) {
      await openTileFromDrawer(page, tileName);
    }

    await selectWorkspace(page, 'Workflow Orchestrator');
    const panel = activeWorkspacePanel(page);
    await expect(panel.getByRole('heading', { name: 'Workflow orchestrator' })).toBeVisible();
    await expect(panel.getByRole('button', { name: /Select Discover trade processor/ })).toContainText(
      'Pending',
    );

    await panel.getByRole('button', { name: 'Run workflow' }).click();
    await expect(page.locator('button[aria-label="Run workflow"]')).toBeDisabled();
    await expect(page.getByText('Workflow running')).toBeAttached();
    await expect(page.getByText('Workflow completed', { exact: true })).toBeAttached({
      timeout: 30_000,
    });

    await selectWorkspace(page, 'Workflow Orchestrator');
    await expect(panel.getByText('Workflow completed', { exact: true })).toBeVisible();
    await expect(panel.getByRole('button', { name: /Select Discover trade processor/ })).toContainText(
      'Completed',
    );
    await expect(panel.getByText('TR-ORCH-1042', { exact: true })).toBeVisible();
    await expect(panel.getByText('MODERATE', { exact: true })).toBeVisible();
    await expect(panel.getByText('$535,800', { exact: true })).toBeVisible();

    await panel.getByRole('button', { name: /Select Price trade processor/ }).click();
    await expect(panel.getByText(/"mid": 214\.32/)).toBeVisible();

    const riskTab = page.getByRole('tab', { name: 'Workflow · Risk Assessment', exact: true });
    await riskTab.getByRole('button', { name: 'delete' }).click();
    await expect(riskTab).not.toBeVisible();
  });
});
