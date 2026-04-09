import { expect, test, type Page, type Route } from '@playwright/test';

type StreamRequestBody = {
  message?: string;
  workspaceContext?: {
    activeWorkspaceId?: string | null;
    activeWorkspaceLabel?: string | null;
    activeTileTitle?: string | null;
    activeTileId?: string | null;
    activeAppId?: string | null;
    totalWorkspaces?: number;
    totalTiles?: number;
  } | null;
};

type UsageStatisticsToolResult = {
  appName?: string;
  appId?: string;
  pv: number;
  uv: number;
};

type UsageStatisticsCardProps = {
  appLabel: string;
  startTime: string;
  endTime: string;
  pv: number;
  uv: number;
  trendPoints: Array<{
    timestamp: string;
    pv: number;
    uv: number;
  }>;
};

function toSseEvent(event: string, data?: unknown): string {
  if (event === 'done') {
    return 'event: done\n\n';
  }

  const serialized = typeof data === 'string' ? data : JSON.stringify(data ?? {});

  return `event: ${event}\ndata: ${serialized}\n\n`;
}

function buildAgenticMcpStream(options: {
  conversationId: string;
  backendText: string;
  toolArguments: Record<string, unknown>;
  toolResult: UsageStatisticsToolResult;
  cardProps: UsageStatisticsCardProps;
}): string {
  return [
    toSseEvent('conversation_id', options.conversationId),
    toSseEvent('execution_plan', {
      planId: `${options.conversationId}-plan`,
      summary: 'Fetch PV and UV usage statistics',
      status: 'running',
      totalSteps: 1,
    }),
    toSseEvent('execution_step', {
      planId: `${options.conversationId}-plan`,
      stepId: `${options.conversationId}-step-1`,
      targetName: 'statistic_count_by_app',
      summary: 'Fetch PV and UV usage statistics',
      stepType: 'mcp',
      status: 'running',
    }),
    toSseEvent('tool_call', {
      id: `${options.conversationId}-tool-1`,
      name: 'statistic_count_by_app',
      arguments: options.toolArguments,
      status: 'running',
      executionTarget: 'backend',
      requiresConfirmation: false,
    }),
    toSseEvent('tool_result', {
      toolCallId: `${options.conversationId}-tool-1`,
      result: options.toolResult,
    }),
    toSseEvent('generative_ui', {
      toolCallId: `${options.conversationId}-tool-1`,
      name: 'UsageStatisticsCard',
      props: options.cardProps,
    }),
    toSseEvent('execution_step', {
      planId: `${options.conversationId}-plan`,
      stepId: `${options.conversationId}-step-1`,
      targetName: 'statistic_count_by_app',
      summary: 'Fetch PV and UV usage statistics',
      stepType: 'mcp',
      status: 'completed',
    }),
    toSseEvent('execution_plan', {
      planId: `${options.conversationId}-plan`,
      summary: 'Fetch PV and UV usage statistics',
      status: 'completed',
      totalSteps: 1,
    }),
    toSseEvent('message', { text: options.backendText }),
    toSseEvent('done'),
  ].join('');
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

async function openAssistant(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Open Assistant' }).click();
  await expect(page.getByText('Hello there!')).toBeVisible();
  await expect(page.getByText('How can I help you today?')).toBeVisible();
}

async function sendAssistantMessage(page: Page, message: string): Promise<void> {
  await page.getByLabel('Message input').fill(message);
  await page.getByRole('button', { name: 'Send message' }).click();
}

async function openTestTile(page: Page): Promise<void> {
  const findTileButton = page.getByRole('button', { name: 'Find tile' });
  await findTileButton.evaluate((element: HTMLButtonElement) => {
    element.click();
  });
  await expect(page.getByText('Tile Options')).toBeVisible();
  await page.getByText('Test Tile', { exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Test Tile' })).toBeVisible();
}

async function fulfillAgenticMcpRoute(
  route: Route,
  responseFactory: (body: StreamRequestBody) => string,
  requestBodies: StreamRequestBody[],
): Promise<void> {
  const requestBody = (route.request().postDataJSON() ?? {}) as StreamRequestBody;
  requestBodies.push(requestBody);

  await route.fulfill({
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    },
    body: responseFactory(requestBody),
  });
}

test.describe('chatbot agentic MCP flow', () => {
  test('renders the explicit app agentic flow with backend-authored text and chart card', async ({
    page,
  }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-explicit-app',
            backendText: 'cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.',
            toolArguments: {
              appName: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appName: 'cashflow',
              pv: 120,
              uv: 30,
            },
            cardProps: {
              appLabel: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 120,
              uv: 30,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 70, uv: 18 },
              ],
            },
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    const message = 'Get app usage count for cashflow from 2026-04-01 to 2026-04-08';
    await sendAssistantMessage(page, message);

    await expect(page.getByText('Used tool')).toBeVisible();
    await expect(page.getByText('statistic_count_by_app')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-pv-tile')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-uv-tile')).toBeVisible();
    await expect(page.getByText('PV Trend')).toBeVisible();
    await expect(page.getByText('UV Trend')).toBeVisible();
    await expect(
      page.getByText('cashflow usage from 2026-04-01 to 2026-04-08: PV 120, UV 30.'),
    ).toBeVisible();

    expect(streamRequests).toHaveLength(1);
    expect(streamRequests[0]?.message).toBe(message);
  });

  test('uses workspace active app context when the app is omitted', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        (body) => {
          const activeAppId = body.workspaceContext?.activeAppId ?? 'missing-app-id';
          return buildAgenticMcpStream({
            conversationId: 'conv-workspace-fallback',
            backendText: `${activeAppId} usage from 2026-04-01 to 2026-04-08: PV 80, UV 24.`,
            toolArguments: {
              appId: activeAppId,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: activeAppId,
              pv: 80,
              uv: 24,
            },
            cardProps: {
              appLabel: activeAppId,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 80,
              uv: 24,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 32, uv: 8 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 48, uv: 16 },
              ],
            },
          });
        },
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openTestTile(page);
    await openAssistant(page);

    const message = 'Get app usage count from 2026-04-01 to 2026-04-08';
    await sendAssistantMessage(page, message);

    expect(streamRequests).toHaveLength(1);
    const workspaceContext = streamRequests[0]?.workspaceContext;
    expect(workspaceContext?.activeAppId).toBeTruthy();
    expect(workspaceContext?.activeTileId).toBeTruthy();

    const expectedAppId = workspaceContext?.activeAppId as string;
    await expect(page.getByText('Used tool')).toBeVisible();
    await expect(page.getByText('statistic_count_by_app')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-pv-tile')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-uv-tile')).toBeVisible();
    await expect(page.getByText('PV Trend')).toBeVisible();
    await expect(page.getByText('UV Trend')).toBeVisible();
    await expect(
      page.getByText(`${expectedAppId} usage from 2026-04-01 to 2026-04-08: PV 80, UV 24.`),
    ).toBeVisible();
  });
});
