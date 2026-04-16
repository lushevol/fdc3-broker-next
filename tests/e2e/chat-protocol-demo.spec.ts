import { expect, test, type Page, type Route } from '@playwright/test';

type ToolDescriptor = {
  name: string;
  providerId?: string;
};

type RunRequestBody = {
  trigger?: 'submit-message' | 'submit-tool-result' | 'submit-action';
  context?: {
    tools?: ToolDescriptor[];
  };
  messages?: Array<{
    role: string;
    toolCallId?: string;
    toolName?: string;
    parts?: Array<{
      type: string;
      toolCallId?: string;
      output?: unknown;
    }>;
  }>;
};

type SseFrame = Record<string, unknown>;

const MINIMAL_TOOL_NAMES = ['location.resolve'];
const FULL_TOOL_NAMES = [
  'location.resolve',
  'approval.confirm',
  'summary.compose',
  'analytics.lookup',
  'profile.lookup',
];

function toSseBody(frames: readonly SseFrame[]): string {
  return frames.map((frame) => `data: ${JSON.stringify(frame)}\n\n`).join('');
}

function createTextResponseFrames(text: string, messageId = 'msg_asst_demo'): SseFrame[] {
  return [
    { type: 'start', conversationId: 'conv-chat-protocol-demo', runId: 'run-demo' },
    { type: 'message-start', messageId, role: 'assistant' },
    { type: 'text-start', messageId, partId: 'text-1' },
    { type: 'text-delta', messageId, partId: 'text-1', delta: text },
    { type: 'text-end', messageId, partId: 'text-1' },
    { type: 'finish', messageId, finishReason: 'stop' },
  ];
}

function createFrontendToolFrames(query: string, messageId = 'msg_asst_tool'): SseFrame[] {
  return [
    { type: 'start', conversationId: 'conv-chat-protocol-demo', runId: 'run-demo' },
    { type: 'message-start', messageId, role: 'assistant' },
    { type: 'text-start', messageId, partId: 'text-1' },
    { type: 'text-delta', messageId, partId: 'text-1', delta: 'Resolving location' },
    { type: 'text-end', messageId, partId: 'text-1' },
    {
      type: 'tool-input-start',
      toolCallId: 'tool_frontend_1',
      toolName: 'location.resolve',
      executionTarget: 'frontend',
    },
    {
      type: 'tool-input-available',
      toolCallId: 'tool_frontend_1',
      input: { query },
    },
    {
      type: 'message-metadata',
      messageId,
      metadata: {
        stage: 'frontend',
        toolIdentity: {
          toolCallId: 'tool_frontend_1',
          toolName: 'location.resolve',
          source: 'frontend',
        },
      },
    },
    { type: 'finish', messageId, finishReason: 'tool-calls' },
  ];
}

function createToolActionRequiredFrames(messageId = 'msg_asst_human'): SseFrame[] {
  return [
    { type: 'start', conversationId: 'conv-chat-protocol-demo', runId: 'run-demo' },
    { type: 'message-start', messageId, role: 'assistant' },
    {
      type: 'tool-input-start',
      toolCallId: 'tool_human_1',
      toolName: 'approval.confirm',
    },
    {
      type: 'tool-input-available',
      toolCallId: 'tool_human_1',
      input: { decision: 'approve' },
    },
    {
      type: 'message-metadata',
      messageId,
      metadata: {
        stage: 'human',
        toolIdentity: {
          toolCallId: 'tool_human_1',
          toolName: 'approval.confirm',
          source: 'human',
        },
      },
    },
    { type: 'finish', messageId, finishReason: 'action-required' },
  ];
}

async function fulfillRun(route: Route, frames: readonly SseFrame[]) {
  await route.fulfill({
    status: 200,
    contentType: 'text/event-stream',
    body: toSseBody(frames),
  });
}

async function openAssistant(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Assistant' }).click();
}

async function sendMessage(page: Page, text: string) {
  await page.getByLabel('Message input').fill(text);
  await page.getByRole('button', { name: 'Send message' }).click();
}

test('chat protocol demo changes visible tools between runs', async ({ page }) => {
  const requests: RunRequestBody[] = [];

  await page.route('**/api/chat/runs', async (route) => {
    requests.push(route.request().postDataJSON() as RunRequestBody);
    await fulfillRun(route, createTextResponseFrames('ok'));
  });

  await openAssistant(page);
  await page.getByRole('button', { name: 'Use minimal tools' }).click();
  await sendMessage(page, 'run the tool demo');

  await page.getByRole('button', { name: 'Use full tools' }).click();
  await sendMessage(page, 'run the tool demo again');

  await expect.poll(() => requests.length).toBe(2);
  expect(requests[0].context?.tools?.map((tool) => tool.name)).toEqual(MINIMAL_TOOL_NAMES);
  expect(requests[1].context?.tools?.map((tool) => tool.name)).toEqual(FULL_TOOL_NAMES);
  expect(
    requests[1].context?.tools
      ?.filter((tool) => tool.name.endsWith('.lookup'))
      .map((tool) => ({ name: tool.name, providerId: tool.providerId })),
  ).toEqual([
    { name: 'analytics.lookup', providerId: 'analytics-mcp' },
    { name: 'profile.lookup', providerId: 'profile-mcp' },
  ]);
});

test('chat protocol demo preserves tool inventory on frontend follow-up runs', async ({ page }) => {
  const requests: RunRequestBody[] = [];
  let runCount = 0;

  await page.route('**/api/chat/runs', async (route) => {
    requests.push(route.request().postDataJSON() as RunRequestBody);
    runCount += 1;

    if (runCount === 1) {
      await fulfillRun(route, createFrontendToolFrames('Beijing'));
      return;
    }

    await fulfillRun(route, createToolActionRequiredFrames());
  });

  await openAssistant(page);
  await page.getByRole('button', { name: 'Use full tools' }).click();
  await sendMessage(page, 'run the tool demo');

  await expect.poll(() => requests.length).toBe(2);
  expect(requests[0].trigger).toBe('submit-message');
  expect(requests[1].trigger).toBe('submit-tool-result');
  expect(requests[1].context?.tools?.map((tool) => tool.name)).toEqual(FULL_TOOL_NAMES);
  expect(requests[1].messages?.some((message) => message.role === 'tool')).toBe(true);
  expect(requests[1].messages?.find((message) => message.role === 'tool')).toEqual(
    expect.objectContaining({
      toolCallId: 'tool_frontend_1',
      toolName: 'location.resolve',
      parts: [
        expect.objectContaining({
          type: 'tool-result',
          toolCallId: 'tool_frontend_1',
          output: expect.objectContaining({
            name: 'Beijing, CN',
          }),
        }),
      ],
    }),
  );
});

test('chat protocol demo renders frontend tool output before the final assistant reply', async ({
  page,
}) => {
  let runCount = 0;

  await page.route('**/api/chat/runs', async (route) => {
    runCount += 1;

    if (runCount === 1) {
      await fulfillRun(route, createFrontendToolFrames('Beijing'));
      return;
    }

    await fulfillRun(route, createTextResponseFrames('Summary ready', 'msg_asst_final'));
  });

  await openAssistant(page);
  await sendMessage(page, 'weather in Beijing');

  await expect(page.getByText('Summary ready')).toBeVisible();

  const toolTrigger = page.getByText('Used tool: location.resolve');
  await toolTrigger.click();

  await expect(page.getByText('Beijing, CN')).toBeVisible();
  await expect(page.getByText('39.9042')).toBeVisible();
  await expect(page.getByText('116.4074')).toBeVisible();
});
