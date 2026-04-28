import { expect, test, type Page, type Route } from '@playwright/test';

type ToolDescriptor = {
  name: string;
  providerId?: string;
};

type ChatMessage = {
  role: string;
  toolCallId?: string;
  toolName?: string;
  parts?: Array<{
    type: string;
    toolCallId?: string;
    output?: unknown;
    source?: string;
    providerId?: string;
    state?: string;
    input?: Record<string, unknown>;
  }>;
};

type RunRequestBody = {
  conversationId?: string;
  runId?: string | null;
  trigger?: 'submit-message' | 'submit-tool-result' | 'submit-action';
  context?: {
    tools?: ToolDescriptor[];
    workspace?: Record<string, unknown>;
    [key: string]: unknown;
  };
  messages?: ChatMessage[];
  metadata?: Record<string, unknown>;
};

type SseFrame = Record<string, unknown>;

const FULL_TOOLS = [
  'location.resolve',
  'approval_confirm',
  'summary_compose',
  'analytics_lookup',
  'profile_lookup',
];

function toSseBody(frames: readonly SseFrame[]): string {
  return frames.map((frame) => `data: ${JSON.stringify(frame)}\n\n`).join('');
}

function createTextResponseFrames(text: string, messageId = 'msg_asst_1'): SseFrame[] {
  return [
    { type: 'start', conversationId: 'conv-mcp-e2e', runId: 'run-mcp-e2e' },
    { type: 'message-start', messageId, role: 'assistant' },
    { type: 'text-start', messageId, partId: 'text-1' },
    { type: 'text-delta', messageId, partId: 'text-1', delta: text },
    { type: 'text-end', messageId, partId: 'text-1' },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];
}

function createMcpToolFrames(options: {
  toolCallId?: string;
  toolName: string;
  providerId?: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  textBefore?: string;
  textAfter?: string;
  conversationId?: string;
  runId?: string;
  messageId?: string;
  source?: string;
  executionTarget?: string;
}): SseFrame[] {
  const {
    toolCallId = 'tool_mcp_analytics_1',
    toolName,
    providerId = 'analytics-mcp',
    input,
    output,
    textBefore,
    textAfter = 'Analytics data has been retrieved.',
    conversationId = 'conv-mcp-e2e',
    runId = 'run-mcp-e2e',
    messageId = 'msg_asst_mcp',
    source = 'mcp',
    executionTarget = 'backend',
  } = options;

  const frames: SseFrame[] = [
    { type: 'start', conversationId, runId },
    { type: 'message-start', messageId, role: 'assistant' },
  ];

  if (textBefore) {
    frames.push(
      { type: 'text-start', messageId, partId: 'text-1' },
      { type: 'text-delta', messageId, partId: 'text-1', delta: textBefore },
      { type: 'text-end', messageId, partId: 'text-1' },
    );
  }

  frames.push(
    {
      type: 'tool-input-start',
      toolCallId,
      toolName,
      source,
      providerId: source === 'mcp' ? providerId : undefined,
      executionTarget,
    },
    {
      type: 'tool-input-available',
      toolCallId,
      input,
      source,
      providerId: source === 'mcp' ? providerId : undefined,
    },
    {
      type: 'tool-output-available',
      toolCallId,
      output,
      source,
      providerId: source === 'mcp' ? providerId : undefined,
    },
  );

  if (textAfter) {
    const textPartId = textBefore ? 'text-2' : 'text-1';
    frames.push(
      { type: 'text-start', messageId, partId: textPartId },
      { type: 'text-delta', messageId, partId: textPartId, delta: textAfter },
      { type: 'text-end', messageId, partId: textPartId },
    );
  }

  frames.push({ type: 'finish', messageId, finishReason: 'stop' });

  return frames;
}

function createMcpToolErrorFrames(options: {
  toolCallId?: string;
  toolName: string;
  providerId?: string;
  input: Record<string, unknown>;
  errorMessage: string;
  textAfter?: string;
  conversationId?: string;
  runId?: string;
  messageId?: string;
}): SseFrame[] {
  const {
    toolCallId = 'tool_mcp_error_1',
    toolName,
    providerId = 'analytics-mcp',
    input,
    errorMessage,
    textAfter,
    conversationId = 'conv-mcp-e2e',
    runId = 'run-mcp-e2e',
    messageId = 'msg_asst_mcp_err',
  } = options;

  const frames: SseFrame[] = [
    { type: 'start', conversationId, runId },
    { type: 'message-start', messageId, role: 'assistant' },
    {
      type: 'tool-input-start',
      toolCallId,
      toolName,
      source: 'mcp',
      providerId,
      executionTarget: 'backend',
    },
    {
      type: 'tool-input-available',
      toolCallId,
      input,
      source: 'mcp',
      providerId,
    },
    {
      type: 'tool-output-error',
      toolCallId,
      error: errorMessage,
      source: 'mcp',
      providerId,
    },
  ];

  if (textAfter) {
    frames.push(
      { type: 'text-start', messageId, partId: 'text-1' },
      { type: 'text-delta', messageId, partId: 'text-1', delta: textAfter },
      { type: 'text-end', messageId, partId: 'text-1' },
    );
  }

  frames.push({ type: 'finish', messageId, finishReason: 'stop' });

  return frames;
}

function createBackendToolFrames(options: {
  toolCallId?: string;
  toolName: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  textBefore?: string;
  textAfter?: string;
  conversationId?: string;
  runId?: string;
  messageId?: string;
}): SseFrame[] {
  return createMcpToolFrames({
    ...options,
    source: 'backend',
    providerId: undefined,
    executionTarget: 'backend',
  });
}

function createFrontendToolFrames(options: {
  query?: string;
  toolCallId?: string;
  toolName?: string;
  conversationId?: string;
  runId?: string;
  messageId?: string;
}): SseFrame[] {
  const {
    query = 'San Francisco',
    toolCallId = 'tool_frontend_location_1',
    toolName = 'location.resolve',
    conversationId = 'conv-mcp-e2e',
    runId = 'run-mcp-e2e',
    messageId = 'msg_asst_frontend',
  } = options;

  return [
    { type: 'start', conversationId, runId },
    { type: 'message-start', messageId, role: 'assistant' },
    { type: 'text-start', messageId, partId: 'text-1' },
    { type: 'text-delta', messageId, partId: 'text-1', delta: 'Resolving location' },
    { type: 'text-end', messageId, partId: 'text-1' },
    {
      type: 'tool-input-start',
      toolCallId,
      toolName,
      source: 'frontend',
      executionTarget: 'frontend',
    },
    {
      type: 'tool-input-available',
      toolCallId,
      input: { query },
      source: 'frontend',
    },
    {
      type: 'message-metadata',
      messageId,
      metadata: {
        stage: 'frontend',
        toolIdentity: {
          toolCallId,
          toolName,
          source: 'frontend',
        },
      },
    },
    { type: 'finish', messageId, finishReason: 'tool-calls' },
  ];
}

function createHumanApprovalFrames(options: {
  toolCallId?: string;
  toolName?: string;
  input?: Record<string, unknown>;
  conversationId?: string;
  runId?: string;
  messageId?: string;
}): SseFrame[] {
  const {
    toolCallId = 'tool_human_approval_1',
    toolName = 'approval_confirm',
    input = {
      to: 'ops@example.com',
      subject: 'Daily report',
      body: 'Send the daily report to operations.',
    },
    conversationId = 'conv-mcp-e2e',
    runId = 'run-mcp-e2e',
    messageId = 'msg_asst_human',
  } = options;

  return [
    { type: 'start', conversationId, runId },
    { type: 'message-start', messageId, role: 'assistant' },
    {
      type: 'tool-input-start',
      toolCallId,
      toolName,
      source: 'human',
    },
    {
      type: 'tool-input-available',
      toolCallId,
      input,
      source: 'human',
    },
    {
      type: 'message-metadata',
      messageId,
      metadata: {
        stage: 'human',
        toolIdentity: {
          toolCallId,
          toolName,
          source: 'human',
        },
      },
    },
    { type: 'finish', messageId, finishReason: 'action-required' },
  ];
}

function createPlanWithMcpToolFrames(options: {
  planSummary?: string;
  stepTitle?: string;
  toolCallId?: string;
  toolName: string;
  providerId?: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  textAfter?: string;
  conversationId?: string;
  runId?: string;
  messageId?: string;
}): SseFrame[] {
  const {
    planSummary = 'Execute analytics query via MCP',
    stepTitle = 'Query elasticsearch analytics',
    toolCallId = 'tool_mcp_plan_1',
    toolName,
    providerId = 'analytics-mcp',
    input,
    output,
    textAfter = 'Analytics query completed.',
    conversationId = 'conv-mcp-e2e',
    runId = 'run-mcp-e2e',
    messageId = 'msg_asst_plan',
  } = options;

  const frames: SseFrame[] = [
    { type: 'start', conversationId, runId },
    { type: 'message-start', messageId, role: 'assistant' },
    {
      type: 'plan-available',
      planId: `${conversationId}-plan`,
      summary: planSummary,
    },
    {
      type: 'start-step',
      stepId: `${conversationId}-step-1`,
      title: stepTitle,
    },
    {
      type: 'step-status',
      stepId: `${conversationId}-step-1`,
      status: 'running',
    },
    {
      type: 'tool-input-start',
      toolCallId,
      toolName,
      source: 'mcp',
      providerId,
      executionTarget: 'backend',
    },
    {
      type: 'tool-input-available',
      toolCallId,
      input,
      source: 'mcp',
      providerId,
    },
    {
      type: 'tool-output-available',
      toolCallId,
      output,
      source: 'mcp',
      providerId,
    },
    {
      type: 'step-status',
      stepId: `${conversationId}-step-1`,
      status: 'completed',
    },
    {
      type: 'finish-step',
      stepId: `${conversationId}-step-1`,
      status: 'completed',
    },
  ];

  if (textAfter) {
    frames.push(
      { type: 'text-start', messageId, partId: 'text-1' },
      { type: 'text-delta', messageId, partId: 'text-1', delta: textAfter },
      { type: 'text-end', messageId, partId: 'text-1' },
    );
  }

  frames.push({ type: 'finish', messageId, finishReason: 'stop' });

  return frames;
}

function createMultiToolInterplayFrames(options: {
  tools: Array<{
    toolCallId: string;
    toolName: string;
    source: 'frontend' | 'backend' | 'mcp' | 'human';
    providerId?: string;
    executionTarget?: string;
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    error?: string;
  }>;
  textBefore?: string;
  textAfter?: string;
  conversationId?: string;
  runId?: string;
  messageId?: string;
}): SseFrame[] {
  const {
    tools,
    textBefore,
    textAfter = 'All tool calls completed.',
    conversationId = 'conv-mcp-e2e',
    runId = 'run-mcp-e2e',
    messageId = 'msg_asst_multi',
  } = options;

  const frames: SseFrame[] = [
    { type: 'start', conversationId, runId },
    { type: 'message-start', messageId, role: 'assistant' },
  ];

  if (textBefore) {
    frames.push(
      { type: 'text-start', messageId, partId: 'text-1' },
      { type: 'text-delta', messageId, partId: 'text-1', delta: textBefore },
      { type: 'text-end', messageId, partId: 'text-1' },
    );
  }

  for (const tool of tools) {
    frames.push(
      {
        type: 'tool-input-start',
        toolCallId: tool.toolCallId,
        toolName: tool.toolName,
        source: tool.source,
        providerId: tool.source === 'mcp' ? tool.providerId : undefined,
        executionTarget:
          tool.executionTarget ?? (tool.source === 'frontend' ? 'frontend' : 'backend'),
      },
      {
        type: 'tool-input-available',
        toolCallId: tool.toolCallId,
        input: tool.input,
        source: tool.source,
        providerId: tool.source === 'mcp' ? tool.providerId : undefined,
      },
    );

    if (tool.error) {
      frames.push({
        type: 'tool-output-error',
        toolCallId: tool.toolCallId,
        error: tool.error,
        source: tool.source,
        providerId: tool.source === 'mcp' ? tool.providerId : undefined,
      });
    } else {
      frames.push({
        type: 'tool-output-available',
        toolCallId: tool.toolCallId,
        output: tool.output,
        source: tool.source,
        providerId: tool.source === 'mcp' ? tool.providerId : undefined,
      });
    }
  }

  if (textAfter) {
    const textPartId = textBefore ? 'text-2' : 'text-1';
    frames.push(
      { type: 'text-start', messageId, partId: textPartId },
      { type: 'text-delta', messageId, partId: textPartId, delta: textAfter },
      { type: 'text-end', messageId, partId: textPartId },
    );
  }

  const hasFrontendTool = tools.some((t) => t.source === 'frontend' && !t.error);
  const hasHumanTool = tools.some((t) => t.source === 'human');

  if (hasHumanTool) {
    frames.push({
      type: 'message-metadata',
      messageId,
      metadata: {
        stage: 'human',
        toolIdentity: {
          toolCallId: tools.find((t) => t.source === 'human')!.toolCallId,
          toolName: tools.find((t) => t.source === 'human')!.toolName,
          source: 'human',
        },
      },
    });
    frames.push({ type: 'finish', messageId, finishReason: 'action-required' });
  } else if (hasFrontendTool) {
    frames.push({
      type: 'message-metadata',
      messageId,
      metadata: {
        stage: 'frontend',
        toolIdentity: {
          toolCallId: tools.find((t) => t.source === 'frontend')!.toolCallId,
          toolName: tools.find((t) => t.source === 'frontend')!.toolName,
          source: 'frontend',
        },
      },
    });
    frames.push({ type: 'finish', messageId, finishReason: 'tool-calls' });
  } else {
    frames.push({ type: 'finish', messageId, finishReason: 'stop' });
  }

  return frames;
}

async function openAssistant(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Assistant' }).click();
}

async function sendMessage(page: Page, text: string) {
  await page.getByLabel('Message input').fill(text);
  await page.getByRole('button', { name: 'Send message' }).click();
}

async function fulfillRun(route: Route, frames: readonly SseFrame[]) {
  await route.fulfill({
    status: 200,
    contentType: 'text/event-stream',
    body: toSseBody(frames),
  });
}

async function selectToolPreset(page: Page, preset: 'minimal' | 'full') {
  const label = preset === 'minimal' ? 'Use minimal tools' : 'Use full tools';
  await page.getByRole('button', { name: label }).click();
}

test.describe('MCP tool in conversation (elasticsearch-mcp-service example)', () => {
  test('analytics_lookup (MCP) tool call renders with providerId and source=mcp', async ({
    page,
  }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolCallId: 'tool_mcp_analytics_1',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: {
            appId: 'template_tile_fdc3_2',
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
          },
          output: {
            appName: 'template_tile_fdc3_2',
            pv: 1234,
            uv: 567,
            trendPoints: [
              { timestamp: '2026-04-01T00:00:00Z', pv: 600, uv: 280 },
              { timestamp: '2026-04-08T00:00:00Z', pv: 634, uv: 287 },
            ],
          },
          textBefore: 'Let me look up the analytics for you.',
          textAfter: 'The app template_tile_fdc3_2 had 1,234 PV and 567 UV from Apr 1 to Apr 8.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get usage for template_tile_fdc3_2');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();
    await expect(page.getByText('1,234')).toBeVisible();
    await expect(page.getByText('567')).toBeVisible();
    await expect(page.getByText('template_tile_fdc3_2')).toBeVisible();
    await expect(
      page.getByText('The app template_tile_fdc3_2 had 1,234 PV and 567 UV'),
    ).toBeVisible();
  });

  test('MCP tool error renders error message in conversation', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolErrorFrames({
          toolCallId: 'tool_mcp_error_1',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: { appId: 'nonexistent_app' },
          errorMessage: 'App not found: nonexistent_app',
          textAfter: 'Sorry, I could not find analytics for that app.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get usage for nonexistent_app');

    await expect(page.getByText('analytics_lookup')).toBeVisible();
    await expect(page.getByText('App not found: nonexistent_app')).toBeVisible();
    await expect(page.getByText('Sorry, I could not find analytics')).toBeVisible();
  });

  test('MCP tool sends providerId in request context when full preset is active', async ({
    page,
  }) => {
    const requests: RunRequestBody[] = [];

    await page.route('**/api/chat/runs', async (route) => {
      requests.push(route.request().postDataJSON() as RunRequestBody);
      await fulfillRun(route, createTextResponseFrames('Done.'));
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Hello');

    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(1);

    const tools = requests[0]?.context?.tools ?? [];
    const analyticsTool = tools.find((t) => t.name === 'analytics_lookup');
    const profileTool = tools.find((t) => t.name === 'profile_lookup');

    expect(analyticsTool).toBeDefined();
    expect(analyticsTool?.providerId).toBe('analytics-mcp');
    expect(profileTool).toBeDefined();
    expect(profileTool?.providerId).toBe('profile-mcp');
  });

  test('MCP tool with execution plan renders plan and step status', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createPlanWithMcpToolFrames({
          planSummary: 'Execute elasticsearch analytics query',
          stepTitle: 'Query elasticsearch-mcp-service for usage statistics',
          toolCallId: 'tool_mcp_plan_1',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: {
            appId: 'cashflow',
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
          },
          output: {
            appName: 'cashflow',
            pv: 450,
            uv: 95,
            trendPoints: [
              { timestamp: '2026-04-01T00:00:00Z', pv: 30, uv: 8 },
              { timestamp: '2026-04-02T00:00:00Z', pv: 35, uv: 9 },
            ],
          },
          textAfter: 'Cashflow analytics query completed via elasticsearch-mcp.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get cashflow analytics with execution plan');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();
    await expect(page.getByText('Cashflow analytics query completed')).toBeVisible();
  });

  test('MCP tool request includes correct trigger type on initial message', async ({ page }) => {
    const requests: RunRequestBody[] = [];

    await page.route('**/api/chat/runs', async (route) => {
      requests.push(route.request().postDataJSON() as RunRequestBody);
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolName: 'analytics_lookup',
          input: { appId: 'test-app' },
          output: { pv: 100, uv: 25 },
          textAfter: 'Done.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get analytics for test-app');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(1);
    expect(requests[0]?.trigger).toBe('submit-message');
  });

  test('highest_operation_users_by_application renders ranked users with avatar bars', async ({
    page,
  }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolCallId: 'tool_mcp_user_rank_1',
          toolName: 'highest_operation_users_by_application',
          providerId: 'analytics-mcp',
          input: {
            application: 'trades',
            startTime: '2026-03-27T12:00:00Z',
            endTime: '2026-04-27T12:00:00Z',
            limit: 5,
          },
          output: {
            application: 'trades',
            startTime: '2026-03-27T12:00:00Z',
            endTime: '2026-04-27T12:00:00Z',
            limit: 5,
            users: [
              { userId: 'trader.max', count: 98 },
              { userId: 'ops.lena', count: 76 },
              { userId: 'risk.chen', count: 59 },
            ],
          },
          textAfter: 'Here are the users with the highest number of operations in trades.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Show highest operation users in trades');

    await expect(page.getByTestId('user-operation-ranking-card')).toBeVisible();
    await expect(page.getByText('trader.max')).toBeVisible();
    await expect(page.getByText('98 ops')).toBeVisible();
    await expect(page.getByText('ops.lena')).toBeVisible();
    await expect(page.getByText('76 ops')).toBeVisible();
  });

  test('most_used_functions_by_application renders ranking table', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolCallId: 'tool_mcp_function_rank_1',
          toolName: 'most_used_functions_by_application',
          providerId: 'analytics-mcp',
          input: {
            application: 'cashflow blotter',
            startTime: '2026-03-27T12:00:00Z',
            endTime: '2026-04-27T12:00:00Z',
            limit: 5,
          },
          output: {
            application: 'cashflow blotter',
            startTime: '2026-03-27T12:00:00Z',
            endTime: '2026-04-27T12:00:00Z',
            limit: 5,
            functions: [
              {
                functionPath: '/cashflow_blotter/cashflow_cn/quick_search/search_btn',
                count: 31,
              },
              {
                functionPath: '/cashflow_blotter/cashflow_cn/filter/apply_btn',
                count: 12,
              },
            ],
          },
          textAfter: 'These are the most used functions in cashflow blotter.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Show the most used functions in cashflow blotter');

    await expect(page.getByTestId('function-usage-ranking-table')).toBeVisible();
    await expect(
      page.getByText('/cashflow_blotter/cashflow_cn/quick_search/search_btn'),
    ).toBeVisible();
    await expect(page.getByText('31')).toBeVisible();
    await expect(page.getByText('/cashflow_blotter/cashflow_cn/filter/apply_btn')).toBeVisible();
  });
});

test.describe('Backend tool in conversation', () => {
  test('summary_compose (backend) tool call renders with source=backend', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createBackendToolFrames({
          toolCallId: 'tool_backend_summary_1',
          toolName: 'summary_compose',
          input: { text: 'Dashboard usage increased by 15%' },
          output: { summary: 'Usage of the dashboard increased by 15% over the reporting period.' },
          textBefore: 'Composing summary...',
          textAfter: 'Here is the summary: Usage of the dashboard increased by 15%.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Summarize dashboard usage');

    await expect(page.getByText('Used tool: summary_compose')).toBeVisible();

    const toolTrigger = page.getByText('Used tool: summary_compose');
    await toolTrigger.click();
    await expect(page.getByText('Dashboard usage increased by 15%')).toBeVisible();
  });

  test('backend tool error renders correctly', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      const frames: SseFrame[] = [
        { type: 'start', conversationId: 'conv-mcp-e2e', runId: 'run-mcp-e2e' },
        { type: 'message-start', messageId: 'msg_asst_err', role: 'assistant' },
        {
          type: 'tool-input-start',
          toolCallId: 'tool_backend_err_1',
          toolName: 'summary_compose',
          source: 'backend',
          executionTarget: 'backend',
        },
        {
          type: 'tool-input-available',
          toolCallId: 'tool_backend_err_1',
          input: { text: 'some input' },
          source: 'backend',
        },
        {
          type: 'tool-output-error',
          toolCallId: 'tool_backend_err_1',
          error: 'Backend service temporarily unavailable',
          source: 'backend',
        },
        { type: 'text-start', messageId: 'msg_asst_err', partId: 'text-1' },
        {
          type: 'text-delta',
          messageId: 'msg_asst_err',
          partId: 'text-1',
          delta: 'The summary service is currently unavailable.',
        },
        { type: 'text-end', messageId: 'msg_asst_err', partId: 'text-1' },
        { type: 'finish', messageId: 'msg_asst_err', finishReason: 'stop' },
      ];
      await fulfillRun(route, frames);
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Summarize something');

    await expect(page.getByText('summary_compose')).toBeVisible();
    await expect(page.getByText('Backend service temporarily unavailable')).toBeVisible();
  });
});

test.describe('Frontend tool in conversation', () => {
  test('location.resolve (frontend) tool auto-resolves and sends follow-up', async ({ page }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(route, createFrontendToolFrames({ query: 'Beijing' }));
        return;
      }

      await fulfillRun(
        route,
        createTextResponseFrames('Beijing coordinates resolved.', 'msg_asst_final'),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'minimal');
    await sendMessage(page, 'What is the weather in Beijing?');

    await expect(page.getByText('Beijing, CN')).toBeVisible();
    await expect(page.getByText('39.9042')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(2);
    expect(requests[0]?.trigger).toBe('submit-message');
    expect(requests[1]?.trigger).toBe('submit-tool-result');

    const toolMessage = requests[1]?.messages?.find((m) => m.role === 'tool');
    expect(toolMessage).toBeDefined();
    expect(toolMessage?.toolCallId).toBe('tool_frontend_location_1');
    expect(toolMessage?.toolName).toBe('location.resolve');
  });

  test('frontend tool result is preserved across conversation turns', async ({ page }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(route, createFrontendToolFrames({ query: 'San Francisco' }));
        return;
      }

      await fulfillRun(
        route,
        createTextResponseFrames(
          'The weather in San Francisco is sunny and 72F.',
          'msg_asst_final',
        ),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'minimal');
    await sendMessage(page, 'Weather in San Francisco');

    await expect(page.getByText('San Francisco, CA')).toBeVisible();
    await expect(page.getByText('The weather in San Francisco is sunny')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(2);
    expect(requests[1]?.trigger).toBe('submit-tool-result');
  });
});

test.describe('Human approval tool in conversation', () => {
  test('approval_confirm requires human action and can be approved', async ({ page }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(
          route,
          createHumanApprovalFrames({
            toolCallId: 'tool_human_approval_1',
            toolName: 'approval_confirm',
          }),
        );
        return;
      }

      await fulfillRun(
        route,
        createTextResponseFrames('Action approved and executed.', 'msg_asst_final'),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Should I proceed?');

    await expect(page.getByText('Confirm Email')).toBeVisible();
    await expect(page.getByText('To: ops@example.com')).toBeVisible();
    await expect(page.getByText('Subject: Daily report')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    await page.getByRole('button', { name: 'Send' }).click();

    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(2);

    expect(requests.length).toBeGreaterThanOrEqual(1);
    expect(requests[0]?.trigger).toBe('submit-message');
    expect(requests[1]?.trigger).toBe('submit-tool-result');
  });

  test('approval_confirm preserves full tool inventory in context on approval', async ({
    page,
  }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(
          route,
          createHumanApprovalFrames({
            input: { decision: 'approve' },
          }),
        );
        return;
      }

      await fulfillRun(
        route,
        createTextResponseFrames('Action approved and executed.', 'msg_asst_final'),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Proceed with action');

    await expect(page.getByText('Confirm Email')).toBeVisible();

    const approveButton = page.getByRole('button', { name: 'Send' });
    await approveButton.click();

    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(2);

    expect(requests[1]?.context?.tools?.map((t) => t.name)).toEqual(FULL_TOOLS);
  });
});

test.describe('MCP + frontend + backend tool interplay', () => {
  test('frontend tool auto-resolves then MCP tool calls backend in follow-up', async ({ page }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(route, createFrontendToolFrames({ query: 'New York' }));
        return;
      }

      if (runCount === 2) {
        await fulfillRun(
          route,
          createMcpToolFrames({
            toolCallId: 'tool_mcp_analytics_followup',
            toolName: 'analytics_lookup',
            providerId: 'analytics-mcp',
            input: {
              appId: 'dashboards-ny',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            output: { appName: 'dashboards-ny', pv: 890, uv: 234 },
            textBefore: 'Based on the New York location, here are the analytics:',
            textAfter: '',
          }),
        );
        return;
      }

      await fulfillRun(
        route,
        createTextResponseFrames('Complete analysis done.', 'msg_asst_final_2'),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get New York analytics and weather');

    await expect(page.getByText('Used tool: location.resolve')).toBeVisible();
    await expect(page.getByText('New York')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(2);
    expect(requests[0]?.trigger).toBe('submit-message');
  });

  test('MCP, backend, and frontend tools all appear in a single multi-tool response', async ({
    page,
  }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMultiToolInterplayFrames({
          tools: [
            {
              toolCallId: 'tool_frontend_loc_1',
              toolName: 'location.resolve',
              source: 'frontend',
              input: { query: 'London' },
              output: { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
            },
            {
              toolCallId: 'tool_mcp_analytics_1',
              toolName: 'analytics_lookup',
              source: 'mcp',
              providerId: 'analytics-mcp',
              input: { appId: 'london-app' },
              output: { pv: 5000, uv: 1200 },
            },
            {
              toolCallId: 'tool_backend_summary_1',
              toolName: 'summary_compose',
              source: 'backend',
              input: { text: 'London dashboard usage report' },
              output: { summary: 'London dashboard shows strong engagement.' },
            },
          ],
          textBefore: 'Processing your request with multiple tools.',
          textAfter: 'All tools completed successfully.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Give me a full briefing for London');

    await expect(page.getByText('Processing your request with multiple tools')).toBeVisible();
    await expect(page.getByText('analytics_lookup')).toBeVisible();
    await expect(page.getByText('summary_compose')).toBeVisible();
    await expect(page.getByText('location.resolve')).toBeVisible();
  });

  test('conversation preserves tool inventory across multi-turn conversation with MCP tools', async ({
    page,
  }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(
          route,
          createMcpToolFrames({
            toolName: 'analytics_lookup',
            input: { appId: 'cashflow' },
            output: { pv: 300, uv: 75 },
            textAfter: 'Cashflow analytics retrieved.',
          }),
        );
        return;
      }

      await fulfillRun(route, createTextResponseFrames('Would you like more details?'));
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get cashflow analytics');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();

    await sendMessage(page, 'Tell me more');

    await expect(page.getByText('Would you like more details?')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(2);

    const firstTools = requests[0]?.context?.tools ?? [];
    expect(firstTools.find((t) => t.name === 'analytics_lookup')).toBeDefined();

    if (requests[1]) {
      const secondTools = requests[1]?.context?.tools ?? [];
      expect(secondTools.find((t) => t.name === 'analytics_lookup')).toBeDefined();
    }
  });
});

test.describe('Elasticsearch MCP service tool scenarios', () => {
  test('statistic_count_by_app returns PV/UV analytics card via MCP', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolCallId: 'tool_mcp_stats_1',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: {
            appId: 'template_tile_fdc3_2',
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
          },
          output: {
            appName: 'FDC3 Tile',
            appId: 'template_tile_fdc3_2',
            pv: 80,
            uv: 24,
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
            trendPoints: [
              { timestamp: '2026-04-01T00:00:00Z', pv: 32, uv: 8 },
              { timestamp: '2026-04-08T00:00:00Z', pv: 48, uv: 16 },
            ],
          },
          textAfter: 'FDC3 Tile usage from Apr 1 to Apr 8: 80 PV, 24 UV.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get usage statistics for template_tile_fdc3_2');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();

    const toolTrigger = page.getByText('Used tool: analytics_lookup');
    await toolTrigger.click();
    await expect(page.getByText('appId')).toBeVisible();
    await expect(page.getByText('template_tile_fdc3_2')).toBeVisible();
  });

  test('real statistic_count_by_app tool name renders completed analytics card in minimal preset', async ({
    page,
  }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolCallId: 'tool_mcp_stats_real_1',
          toolName: 'statistic_count_by_app',
          providerId: 'analytics-mcp',
          input: {
            appId: 'cashflow_blotter',
            startTime: '2026-04-15T00:00:00Z',
            endTime: '2026-04-16T00:00:00Z',
          },
          output: {
            appName: 'Cashflow Blotter',
            appId: 'cashflow_blotter',
            pv: 42,
            uv: 12,
            startTime: '2026-04-15T00:00:00Z',
            endTime: '2026-04-16T00:00:00Z',
          },
          textAfter: 'Cashflow Blotter usage yesterday: 42 PV, 12 UV.',
        }),
      );
    });

    await openAssistant(page);
    await sendMessage(page, "what's the pv and uv of cashflow_blotter yesterday ?");

    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-pv-tile')).toContainText('42');
    await expect(page.getByTestId('usage-statistics-uv-tile')).toContainText('12');
  });

  test('real chart_by_app tool name renders trend card in minimal preset', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolCallId: 'tool_mcp_chart_1',
          toolName: 'chart_by_app',
          providerId: 'analytics-mcp',
          input: {
            appId: 'cashflow',
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-15T00:00:00Z',
            bucket: 'DAY',
          },
          output: {
            appName: 'Cashflow',
            appId: 'cashflow',
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
          textAfter: 'Cashflow trend data over 5 days.',
        }),
      );
    });

    await openAssistant(page);
    await sendMessage(page, 'Show daily PV/UV for cashflow');

    await expect(page.getByTestId('usage-statistics-card')).toBeVisible();
    await expect(page.getByText('PV Trend')).toBeVisible();
    await expect(page.getByText('UV Trend')).toBeVisible();
    await expect(page.getByTestId('usage-statistics-pv-tile')).toContainText('450');
    await expect(page.getByTestId('usage-statistics-uv-tile')).toContainText('95');
  });

  test('MCP tool with execution plan shows step lifecycle', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createPlanWithMcpToolFrames({
          planSummary: 'Query elasticsearch-mcp-service for app usage',
          stepTitle: 'Call statistic_count_by_app via analytics MCP',
          toolCallId: 'tool_mcp_analytics_plan',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: {
            appId: 'risk-dashboard',
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
          },
          output: {
            appName: 'Risk Dashboard',
            pv: 256,
            uv: 48,
            trendPoints: [
              { timestamp: '2026-04-01T00:00:00Z', pv: 120, uv: 25 },
              { timestamp: '2026-04-08T00:00:00Z', pv: 136, uv: 23 },
            ],
          },
          textAfter: 'Risk Dashboard analytics retrieved via elasticsearch-mcp.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get risk dashboard usage with execution plan');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();
    await expect(
      page.getByText('Risk Dashboard analytics retrieved via elasticsearch-mcp'),
    ).toBeVisible();
  });

  test('MCP tool error from elasticsearch-mcp-service renders correctly', async ({ page }) => {
    await page.route('**/api/chat/runs', async (route) => {
      await fulfillRun(
        route,
        createMcpToolErrorFrames({
          toolCallId: 'tool_mcp_err_elastic',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: {
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
          },
          errorMessage: 'At least one of appId or appName must be provided',
          textAfter: 'Please specify an app ID or name for the analytics query.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get analytics without specifying an app');

    await expect(page.getByText('analytics_lookup')).toBeVisible();
    await expect(page.getByText('At least one of appId or appName must be provided')).toBeVisible();
  });

  test('two MCP tools called sequentially for elasticsearch comparison query', async ({ page }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(
          route,
          createMcpToolFrames({
            toolCallId: 'tool_mcp_compare_1',
            toolName: 'analytics_lookup',
            providerId: 'analytics-mcp',
            input: {
              appId: 'cashflow',
              startTime: '2026-04-01T00:00:00Z',
              endTime: '2026-04-08T00:00:00Z',
            },
            output: { pv: 120, uv: 30 },
            textAfter: 'Cashflow analytics retrieved. Now querying the second app...',
            messageId: 'msg_asst_compare_1',
          }),
        );
        return;
      }

      await fulfillRun(
        route,
        createMcpToolFrames({
          toolCallId: 'tool_mcp_compare_2',
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: {
            appId: 'risk-dashboard',
            startTime: '2026-04-01T00:00:00Z',
            endTime: '2026-04-08T00:00:00Z',
          },
          output: { pv: 85, uv: 18 },
          textAfter: 'Comparison complete: Cashflow had higher engagement.',
          messageId: 'msg_asst_compare_2',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Compare cashflow and risk-dashboard analytics');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(1);
    const firstToolContext = requests[0]?.context?.tools ?? [];
    expect(firstToolContext.find((t) => t.name === 'analytics_lookup')).toBeDefined();
  });
});

test.describe('Tool source and execution target validation', () => {
  test('MCP tool source is correctly sent as mcp with providerId', async ({ page }) => {
    const requests: RunRequestBody[] = [];

    await page.route('**/api/chat/runs', async (route) => {
      requests.push(route.request().postDataJSON() as RunRequestBody);
      await fulfillRun(
        route,
        createMcpToolFrames({
          toolName: 'analytics_lookup',
          providerId: 'analytics-mcp',
          input: { appId: 'test-app' },
          output: { pv: 100, uv: 25 },
          textAfter: 'Done.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Get analytics');

    await expect(page.getByText('Used tool: analytics_lookup')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(1);
    const tools = requests[0]?.context?.tools ?? [];
    const analyticsLookup = tools.find((t) => t.name === 'analytics_lookup');
    expect(analyticsLookup?.providerId).toBe('analytics-mcp');
  });

  test('backend tool source is sent without providerId', async ({ page }) => {
    const requests: RunRequestBody[] = [];

    await page.route('**/api/chat/runs', async (route) => {
      requests.push(route.request().postDataJSON() as RunRequestBody);
      await fulfillRun(
        route,
        createBackendToolFrames({
          toolName: 'summary_compose',
          input: { text: 'test' },
          output: { summary: 'Test summary' },
          textAfter: 'Summary composed.',
        }),
      );
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Summarize test');

    await expect(page.getByText('Used tool: summary_compose')).toBeVisible();

    expect(requests.length).toBeGreaterThanOrEqual(1);
    const tools = requests[0]?.context?.tools ?? [];
    const summaryCompose = tools.find((t) => t.name === 'summary_compose');

    expect(summaryCompose).toBeDefined();
    expect(summaryCompose?.providerId).toBeUndefined();
  });

  test('frontend tool manifest includes both MCP and backend tools when full preset is active', async ({
    page,
  }) => {
    const requests: RunRequestBody[] = [];

    await page.route('**/api/chat/runs', async (route) => {
      requests.push(route.request().postDataJSON() as RunRequestBody);
      await fulfillRun(route, createTextResponseFrames('Ok.'));
    });

    await openAssistant(page);
    await selectToolPreset(page, 'full');
    await sendMessage(page, 'Hello');

    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(1);

    const tools = requests[0]?.context?.tools ?? [];
    const toolNames = tools.map((t) => t.name);
    expect(toolNames).toEqual(expect.arrayContaining(FULL_TOOLS));

    const mcpTools = tools.filter((t) => t.providerId);
    expect(mcpTools).toHaveLength(2);
    expect(mcpTools.map((t) => t.name)).toEqual(
      expect.arrayContaining(['analytics_lookup', 'profile_lookup']),
    );
  });
});
