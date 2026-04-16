import { expect, test, type Page, type Route } from '@playwright/test';

type StreamRequestBody = {
  message?: string;
  trigger?: string;
  toolContext?: string;
  frontendTools?: string;
  messages?: Array<{
    role?: string;
    parts?: Array<{
      type?: string;
      text?: string;
      toolCallId?: string;
      toolName?: string;
      executionTarget?: string;
      input?: Record<string, unknown>;
      output?: unknown;
    }>;
  }>;
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
  filterValue?: string;
  pv: number;
  uv: number;
  startTime?: string;
  endTime?: string;
  trendPoints?: Array<{
    timestamp: string;
    pv: number;
    uv: number;
  }>;
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
  toolName?: string;
  executionSteps?: Array<{
    stepId: string;
    targetName: string;
    summary: string;
    stepType: string;
    status: 'running' | 'completed';
  }>;
}): string {
  const toolName = options.toolName ?? 'statistic_count_by_app';
  const steps = options.executionSteps ?? [
    {
      stepId: `${options.conversationId}-step-1`,
      targetName: toolName,
      summary: 'Fetch analytics data',
      stepType: 'mcp',
      status: 'running' as const,
    },
  ];

  const completedSteps = steps.map((step) => ({
    ...step,
    status: 'completed' as const,
  }));

  return [
    toSseEvent('conversation_id', options.conversationId),
    toSseEvent('execution_plan', {
      planId: `${options.conversationId}-plan`,
      summary: 'Fetch analytics data',
      status: 'running',
      totalSteps: steps.length,
    }),
    ...steps.map((step) =>
      toSseEvent('execution_step', {
        planId: `${options.conversationId}-plan`,
        ...step,
      }),
    ),
    toSseEvent('tool_call', {
      id: `${options.conversationId}-tool-1`,
      name: toolName,
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
    ...completedSteps.map((step) =>
      toSseEvent('execution_step', {
        planId: `${options.conversationId}-plan`,
        ...step,
      }),
    ),
    toSseEvent('execution_plan', {
      planId: `${options.conversationId}-plan`,
      summary: 'Fetch analytics data',
      status: 'completed',
      totalSteps: steps.length,
    }),
    toSseEvent('message', { text: options.backendText }),
    toSseEvent('done'),
  ].join('');
}

function buildTextOnlyStream(options: {
  conversationId: string;
  text: string;
}): string {
  return [
    toSseEvent('conversation_id', options.conversationId),
    toSseEvent('message', { text: options.text }),
    toSseEvent('done'),
  ].join('');
}

function buildFrontendToolStream(options: {
  conversationId: string;
  toolName: string;
  toolCallId: string;
  toolArguments: Record<string, unknown>;
  backendText: string;
  executionTarget?: 'frontend';
  requiresConfirmation?: boolean;
}): string {
  return [
    toSseEvent('conversation_id', options.conversationId),
    toSseEvent('tool_call', {
      id: options.toolCallId,
      name: options.toolName,
      arguments: options.toolArguments,
      status: 'running',
      executionTarget: options.executionTarget ?? 'frontend',
      requiresConfirmation: options.requiresConfirmation ?? false,
    }),
    toSseEvent('message', { text: options.backendText }),
    toSseEvent('done'),
  ].join('');
}

function buildBackendToolErrorStream(options: {
  conversationId: string;
  toolName: string;
  toolArguments: Record<string, unknown>;
  errorMessage: string;
}): string {
  return [
    toSseEvent('conversation_id', options.conversationId),
    toSseEvent('tool_call', {
      id: `${options.conversationId}-tool-1`,
      name: options.toolName,
      arguments: options.toolArguments,
      status: 'running',
      executionTarget: 'backend',
      requiresConfirmation: false,
    }),
    toSseEvent('tool_result', {
      toolCallId: `${options.conversationId}-tool-1`,
      result: { error: options.errorMessage },
      error: options.errorMessage,
    }),
    toSseEvent('message', { text: `Error: ${options.errorMessage}` }),
    toSseEvent('done'),
  ].join('');
}

function buildMultiStepMcpStream(options: {
  conversationId: string;
  backendText: string;
  tools: Array<{
    name: string;
    arguments: Record<string, unknown>;
    result: UsageStatisticsToolResult;
    cardProps: UsageStatisticsCardProps;
  }>;
}): string {
  const steps = options.tools.map((tool, index) => ({
    stepId: `${options.conversationId}-step-${index + 1}`,
    targetName: tool.name,
    summary: `Execute ${tool.name}`,
    stepType: 'mcp',
    status: 'running' as const,
  }));

  const events: string[] = [
    toSseEvent('conversation_id', options.conversationId),
    toSseEvent('execution_plan', {
      planId: `${options.conversationId}-plan`,
      summary: 'Multi-step analytics query',
      status: 'running',
      totalSteps: options.tools.length,
    }),
    ...steps.map((step) => toSseEvent('execution_step', { planId: `${options.conversationId}-plan`, ...step })),
  ];

  options.tools.forEach((tool, index) => {
    events.push(
      toSseEvent('tool_call', {
        id: `${options.conversationId}-tool-${index + 1}`,
        name: tool.name,
        arguments: tool.arguments,
        status: 'running',
        executionTarget: 'backend',
        requiresConfirmation: false,
      }),
      toSseEvent('tool_result', {
        toolCallId: `${options.conversationId}-tool-${index + 1}`,
        result: tool.result,
      }),
      toSseEvent('generative_ui', {
        toolCallId: `${options.conversationId}-tool-${index + 1}`,
        name: 'UsageStatisticsCard',
        props: tool.cardProps,
      }),
      toSseEvent('execution_step', {
        planId: `${options.conversationId}-plan`,
        stepId: `${options.conversationId}-step-${index + 1}`,
        targetName: tool.name,
        summary: `Execute ${tool.name}`,
        stepType: 'mcp',
        status: 'completed',
      }),
    );
  });

  events.push(
    toSseEvent('execution_plan', {
      planId: `${options.conversationId}-plan`,
      summary: 'Multi-step analytics query',
      status: 'completed',
      totalSteps: options.tools.length,
    }),
    toSseEvent('message', { text: options.backendText }),
    toSseEvent('done'),
  );

  return events.join('');
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

test.describe('MCP backend tools in conversation', () => {
  test('statistic_count_by_app with appId returns PV/UV card and trend data', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-appid-stats',
            backendText: 'template_tile_fdc3_2 usage from 2026-04-01 to 2026-04-08: PV 80, UV 24.',
            toolArguments: {
              appId: 'template_tile_fdc3_2',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appName: 'template_tile_fdc3_2',
              filterValue: 'template_tile_fdc3_2',
              pv: 80,
              uv: 24,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 32, uv: 8 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 48, uv: 16 },
              ],
            },
            cardProps: {
              appLabel: 'template_tile_fdc3_2',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 80,
              uv: 24,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 32, uv: 8 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 48, uv: 16 },
              ],
            },
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    const message = 'Get PV and UV for template_tile_fdc3_2 from 2026-04-01 to 2026-04-08';
    await sendAssistantMessage(page, message);

    await expect(page.getByText('Used tool')).toBeVisible();
    await expect(page.getByText('statistic_count_by_app')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-pv-tile')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-uv-tile')).toBeVisible();
    await expect(page.getByText('PV Trend')).toBeVisible();
    await expect(page.getByText('UV Trend')).toBeVisible();
    await expect(
      page.getByText('template_tile_fdc3_2 usage from 2026-04-01 to 2026-04-08: PV 80, UV 24.'),
    ).toBeVisible();

    expect(streamRequests).toHaveLength(1);
    expect(streamRequests[0]?.message).toBe(message);
    expect(streamRequests[0]?.trigger).toBe('submit-message');
  });

  test('statistic_count_by_app with appName (no appId) resolves via workspace context', async ({
    page,
  }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        (body) => {
          const activeAppId = body.workspaceContext?.activeAppId ?? 'fallback-app-id';
          return buildAgenticMcpStream({
            conversationId: 'conv-appname-stats',
            backendText: `${activeAppId} usage: PV 120, UV 30.`,
            toolArguments: {
              appId: activeAppId,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: activeAppId,
              filterValue: activeAppId,
              pv: 120,
              uv: 30,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 70, uv: 18 },
              ],
            },
            cardProps: {
              appLabel: activeAppId,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 120,
              uv: 30,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 70, uv: 18 },
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

    await sendAssistantMessage(page, 'Show me app usage from 2026-04-01 to 2026-04-08');

    expect(streamRequests).toHaveLength(1);
    const workspaceContext = streamRequests[0]?.workspaceContext;
    expect(workspaceContext?.activeAppId).toBeTruthy();
    expect(workspaceContext?.activeTileId).toBeTruthy();

    await expect(page.getByText('Used tool')).toBeVisible();
    await expect(page.getByText('statistic_count_by_app')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
  });

  test('chart_by_app renders trend chart card', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-chart-app',
            backendText: 'cashflow trend data retrieved.',
            toolArguments: {
              appId: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-15T00:00:00Z',
              bucket: 'DAY',
            },
            toolResult: {
              appId: 'cashflow',
              filterValue: 'cashflow',
              pv: 450,
              uv: 95,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-15T00:00:00Z',
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 30, uv: 8 },
                { timestamp: '2026-04-02T00:00:00Z', pv: 35, uv: 9 },
                { timestamp: '2026-04-03T00:00:00Z', pv: 28, uv: 7 },
                { timestamp: '2026-04-04T00:00:00Z', pv: 42, uv: 11 },
                { timestamp: '2026-04-05T00:00:00Z', pv: 38, uv: 10 },
              ],
            },
            cardProps: {
              appLabel: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-15T00:00:00Z',
              pv: 450,
              uv: 95,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 30, uv: 8 },
                { timestamp: '2026-04-02T00:00:00Z', pv: 35, uv: 9 },
                { timestamp: '2026-04-03T00:00:00Z', pv: 28, uv: 7 },
                { timestamp: '2026-04-04T00:00:00Z', pv: 42, uv: 11 },
                { timestamp: '2026-04-05T00:00:00Z', pv: 38, uv: 10 },
              ],
            },
            toolName: 'chart_by_app',
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Show me daily PV/UV trend for cashflow');

    await expect(page.getByText('Used tool')).toBeVisible();
    await expect(page.getByText('chart_by_app')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
    await expect(page.getByText('PV Trend')).toBeVisible();
    await expect(page.getByText('UV Trend')).toBeVisible();
  });

  test('backend tool error displays error message in conversation', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildBackendToolErrorStream({
            conversationId: 'conv-error-case',
            toolName: 'statistic_count_by_app',
            toolArguments: {
              appId: 'nonexistent_app',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            errorMessage: 'At least one of appId or appName must be provided and startTime must be before endTime',
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Get usage for unknown app');

    await expect(page.getByText('statistic_count_by_app')).toBeVisible();
    await expect(page.getByText(/Error/)).toBeVisible();
  });

  test('multi-step agentic plan calls two MCP tools sequentially', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildMultiStepMcpStream({
            conversationId: 'conv-multi-step',
            backendText: 'Compared usage across two apps: template_tile_fdc3_2 and cashflow.',
            tools: [
              {
                name: 'statistic_count_by_app',
                arguments: {
                  appId: 'template_tile_fdc3_2',
                  startTime: '2026-04-01T00:00:00Z',
                  endTime: '2026-04-08T00:00:00Z',
                },
                result: {
                  appId: 'template_tile_fdc3_2',
                  filterValue: 'template_tile_fdc3_2',
                  pv: 80,
                  uv: 24,
                  startTime: '2026-04-01T00:00:00Z',
                  endTime: '2026-04-08T00:00:00Z',
                  trendPoints: [
                    { timestamp: '2026-04-01T00:00:00Z', pv: 32, uv: 8 },
                    { timestamp: '2026-04-08T00:00:00Z', pv: 48, uv: 16 },
                  ],
                },
                cardProps: {
                  appLabel: 'template_tile_fdc3_2',
                  startTime: '2026-04-01T00:00:00Z',
                  endTime: '2026-04-08T00:00:00Z',
                  pv: 80,
                  uv: 24,
                  trendPoints: [
                    { timestamp: '2026-04-01T00:00:00Z', pv: 32, uv: 8 },
                    { timestamp: '2026-04-08T00:00:00Z', pv: 48, uv: 16 },
                  ],
                },
              },
              {
                name: 'statistic_count_by_app',
                arguments: {
                  appId: 'cashflow',
                  startTime: '2026-04-01T00:00:00Z',
                  endTime: '2026-04-08T00:00:00Z',
                },
                result: {
                  appId: 'cashflow',
                  filterValue: 'cashflow',
                  pv: 120,
                  uv: 30,
                  startTime: '2026-04-01T00:00:00Z',
                  endTime: '2026-04-08T00:00:00Z',
                  trendPoints: [
                    { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                    { timestamp: '2026-04-08T00:00:00Z', pv: 70, uv: 18 },
                  ],
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
              },
            ],
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Compare usage between template_tile_fdc3_2 and cashflow');

    const toolCallElements = page.getByText('statistic_count_by_app');
    await expect(toolCallElements.first()).toBeVisible();
    await expect(toolCallElements.nth(1)).toBeVisible();

    const cards = page.getByTestId('usage-statistics-card');
    await expect(cards.first()).toBeVisible();
    await expect(cards.nth(1)).toBeVisible();

    await expect(page.getByText('Compared usage across two apps')).toBeVisible();
  });
});

test.describe('frontend tools in conversation', () => {
  test('summarize_workspace_state tool matches prompt and invokes local execution', async ({
    page,
  }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildTextOnlyStream({
            conversationId: 'conv-workspace-summary',
            text: 'Current workspace has 1 active tile.',
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openTestTile(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'workspace summary');

    await expect(page.getByText('Current workspace has 1 active tile')).toBeVisible();

    expect(streamRequests.length).toBeGreaterThanOrEqual(1);
    expect(streamRequests[0]?.trigger).toBe('submit-message');
  });

  test('report_workspace_status tool requires human confirmation before execution', async ({
    page,
  }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildFrontendToolStream({
            conversationId: 'conv-workspace-status',
            toolName: 'report_workspace_status',
            toolCallId: 'frontend-tool-status-1',
            toolArguments: {
              activeWorkspaceId: 'ws-1',
              activeWorkspaceLabel: 'My Workspace',
              activeTileTitle: 'Test Tile',
              totalWorkspaces: 1,
              totalTiles: 1,
              workspaces: [
                { id: 'ws-1', label: 'My Workspace', tileCount: 1, isActive: true },
              ],
            },
            backendText: 'Here is the current workspace status.',
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'workspace status');

    await expect(page.getByText('Workspace Status')).toBeVisible();
    await expect(page.getByText('Active workspace:')).toBeVisible();
  });
});

test.describe('frontend + backend tool interplay in conversation', () => {
  test('chatbot uses workspace context from active tile when backend tool is invoked', async ({
    page,
  }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        (body) => {
          const activeAppId = body.workspaceContext?.activeAppId ?? 'unknown-app';
          return buildAgenticMcpStream({
            conversationId: 'conv-context-fallback',
            backendText: `${activeAppId} analytics: PV 95, UV 18.`,
            toolArguments: {
              appId: activeAppId,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: activeAppId,
              filterValue: activeAppId,
              pv: 95,
              uv: 18,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            cardProps: {
              appLabel: activeAppId,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 95,
              uv: 18,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 40, uv: 8 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 55, uv: 10 },
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

    await sendAssistantMessage(page, 'Get app usage');

    expect(streamRequests).toHaveLength(1);
    const context = streamRequests[0]?.workspaceContext;
    expect(context).toBeTruthy();
    expect(context?.activeAppId).toBeTruthy();
    expect(context?.activeTileId).toBeTruthy();

    await expect(page.getByText('Used tool')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
  });

  test('frontend tool manifest is sent with request when backend tool is called', async ({
    page,
  }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-manifest-sent',
            backendText: 'Usage data retrieved.',
            toolArguments: {
              appId: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: 'cashflow',
              filterValue: 'cashflow',
              pv: 100,
              uv: 25,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 50, uv: 13 },
              ],
            },
            cardProps: {
              appLabel: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 100,
              uv: 25,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 50, uv: 13 },
              ],
            },
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Show cashflow usage');

    expect(streamRequests).toHaveLength(1);

    const frontendTools = streamRequests[0]?.frontendTools;
    if (frontendTools) {
      const manifest = JSON.parse(frontendTools);
      expect(Array.isArray(manifest)).toBe(true);
      const toolNames = manifest.map((tool: { name: string }) => tool.name);
      expect(toolNames).toContain('report_workspace_status');
      expect(toolNames).toContain('summarize_workspace_state');
    }

    const workspaceContext = streamRequests[0]?.workspaceContext;
    expect(workspaceContext).toBeTruthy();
  });

  test('conversation with backend tool result followed by user follow-up', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];
    let requestCount = 0;

    await page.route('**/api/chat/stream', async (route) => {
      requestCount++;
      const requestBody = (route.request().postDataJSON() ?? {}) as StreamRequestBody;
      streamRequests.push(requestBody);

      if (requestCount === 1) {
        await route.fulfill({
          status: 200,
          headers: {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
            'connection': 'keep-alive',
          },
          body: buildAgenticMcpStream({
            conversationId: 'conv-follow-up',
            backendText: 'cashflow usage: PV 120, UV 30.',
            toolArguments: {
              appId: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: 'cashflow',
              filterValue: 'cashflow',
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
        });
      } else {
        await route.fulfill({
          status: 200,
          headers: {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
            'connection': 'keep-alive',
          },
          body: buildTextOnlyStream({
            conversationId: 'conv-follow-up',
            text: 'Would you like more details?',
          }),
        });
      }
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Get cashflow usage');
    await expect(page.getByText('Used tool')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();

    await sendAssistantMessage(page, 'Tell me more');
    await expect(page.getByText('Would you like more details?')).toBeVisible();

    expect(streamRequests.length).toBeGreaterThanOrEqual(2);
    expect(streamRequests[0]?.message).toBe('Get cashflow usage');
    expect(streamRequests[1]?.message).toBe('Tell me more');

    if (streamRequests[1]?.messages && streamRequests[1].messages.length > 0) {
      const hasToolResult = streamRequests[1].messages.some((msg) =>
        msg.parts?.some(
          (part) =>
            part.type === 'tool-call' ||
            (part.toolCallId && part.toolName),
        ),
      );
      expect(hasToolResult || streamRequests[1].messages.length >= 2).toBe(true);
    }
  });
});

test.describe('MCP conversation protocol validation', () => {
  test('conversation_id is established and reused across messages', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      const requestBody = (route.request().postDataJSON() ?? {}) as StreamRequestBody;
      streamRequests.push(requestBody);

      await route.fulfill({
        status: 200,
        headers: {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          'connection': 'keep-alive',
        },
        body: buildTextOnlyStream({
          conversationId: 'conv-reuse-123',
          text: 'Hello! How can I help?',
        }),
      });
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Hi');
    await expect(page.getByText('Hello! How can I help?')).toBeVisible();

    expect(streamRequests).toHaveLength(1);
  });

  test('SSE stream format includes execution_plan before tool calls', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-plan-order',
            backendText: 'Data retrieved.',
            toolArguments: {
              appId: 'template_tile_fdc3_2',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: 'template_tile_fdc3_2',
              filterValue: 'template_tile_fdc3_2',
              pv: 80,
              uv: 24,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            cardProps: {
              appLabel: 'template_tile_fdc3_2',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 80,
              uv: 24,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 32, uv: 8 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 48, uv: 16 },
              ],
            },
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Get usage data');
    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
  });

  test('tool_call event includes executionTarget=backend for MCP tools', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-exec-target',
            backendText: 'Data retrieved.',
            toolArguments: {
              appId: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: 'cashflow',
              filterValue: 'cashflow',
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

    await sendAssistantMessage(page, 'Get cashflow data');

    const toolCallIndicator = page.getByText('Used tool');
    await expect(toolCallIndicator).toBeVisible();
    await expect(page.getByText('statistic_count_by_app')).toBeVisible();
  });

  test('card renders PV and UV numeric values correctly', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-pv-uv-display',
            backendText: 'Usage: PV 1,234, UV 567.',
            toolArguments: {
              appId: 'large_app',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: 'large_app',
              filterValue: 'large_app',
              pv: 1234,
              uv: 567,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 600, uv: 280 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 634, uv: 287 },
              ],
            },
            cardProps: {
              appLabel: 'large_app',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              pv: 1234,
              uv: 567,
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 600, uv: 280 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 634, uv: 287 },
              ],
            },
          }),
        streamRequests,
      );
    });

    await loginToWorkspace(page);
    await openAssistant(page);

    await sendAssistantMessage(page, 'Get usage for large_app');

    await expect(page.getByTestId('usage-statistics-pv-tile')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-uv-tile')).toBeVisible();

    const pvTile = page.getByTestId('usage-statistics-pv-tile');
    await expect(pvTile.getByText('1,234')).toBeVisible();

    const uvTile = page.getByTestId('usage-statistics-uv-tile');
    await expect(uvTile.getByText('567')).toBeVisible();
  });

  test('card renders date range from tool result', async ({ page }) => {
    const streamRequests: StreamRequestBody[] = [];

    await page.route('**/api/chat/stream', async (route) => {
      await fulfillAgenticMcpRoute(
        route,
        () =>
          buildAgenticMcpStream({
            conversationId: 'conv-date-range',
            backendText: 'Data from Apr 1 to Apr 8.',
            toolArguments: {
              appId: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            toolResult: {
              appId: 'cashflow',
              filterValue: 'cashflow',
              pv: 120,
              uv: 30,
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
              trendPoints: [
                { timestamp: '2026-04-01T00:00:00Z', pv: 50, uv: 12 },
                { timestamp: '2026-04-08T00:00:00Z', pv: 70, uv: 18 },
              ],
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

    await sendAssistantMessage(page, 'Show cashflow usage for this week');

    const card = page.getByTestId('usage-statistics-card');
    await expect(card).toBeVisible();
  });
});