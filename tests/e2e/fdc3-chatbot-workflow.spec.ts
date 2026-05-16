import { expect, test, type Page, type Route } from '@playwright/test';

test.use({ channel: 'chrome' });

type ChatMessage = {
  role?: string;
  toolCallId?: string;
  toolName?: string;
  parts?: Array<{
    type?: string;
    toolCallId?: string;
    toolName?: string;
    input?: Record<string, unknown>;
    output?: unknown;
  }>;
};

type RunRequestBody = {
  trigger?: string;
  context?: {
    tools?: Array<{ name: string; source?: string }>;
    workspace?: Record<string, unknown>;
  };
  messages?: ChatMessage[];
};

type SseFrame = Record<string, unknown>;

function toSseBody(frames: readonly SseFrame[]): string {
  return frames.map((frame) => `data: ${JSON.stringify(frame)}\n\n`).join('');
}

async function fulfillRun(route: Route, frames: readonly SseFrame[]): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'text/event-stream',
    body: toSseBody(frames),
  });
}

function workflowApprovalFrames(): SseFrame[] {
  return [
    { type: 'start', conversationId: 'conv-fdc3-workflow', runId: 'run-approval' },
    { type: 'message-start', messageId: 'msg-approval', role: 'assistant' },
    {
      type: 'tool-input-start',
      toolCallId: 'tool-approve-workflow',
      toolName: 'propose_fdc3_workflow',
      source: 'human',
    },
    {
      type: 'tool-input-available',
      toolCallId: 'tool-approve-workflow',
      input: {
        workflowId: 'trade.pendingValidation.openChart',
        input: {
          status: 'PENDING_VALIDATION',
          originalRequest: 'Open a chart for the first pending validation trade',
        },
        originalRequest: 'Open a chart for the first pending validation trade',
      },
      source: 'human',
    },
    {
      type: 'message-metadata',
      messageId: 'msg-approval',
      metadata: {
        toolIdentity: {
          toolCallId: 'tool-approve-workflow',
          toolName: 'propose_fdc3_workflow',
          source: 'human',
        },
      },
    },
    { type: 'finish', messageId: 'msg-approval', finishReason: 'action-required' },
  ];
}

function workflowExecutionFrames(): SseFrame[] {
  return [
    { type: 'start', conversationId: 'conv-fdc3-workflow', runId: 'run-execute' },
    { type: 'message-start', messageId: 'msg-execute', role: 'assistant' },
    {
      type: 'tool-input-start',
      toolCallId: 'tool-execute-workflow',
      toolName: 'execute_fdc3_workflow',
      source: 'frontend',
      executionTarget: 'frontend',
    },
    {
      type: 'tool-input-available',
      toolCallId: 'tool-execute-workflow',
      input: {
        workflowId: 'trade.pendingValidation.openChart',
        input: {
          status: 'PENDING_VALIDATION',
          originalRequest: 'Open a chart for the first pending validation trade',
        },
      },
      source: 'frontend',
    },
    {
      type: 'message-metadata',
      messageId: 'msg-execute',
      metadata: {
        toolIdentity: {
          toolCallId: 'tool-execute-workflow',
          toolName: 'execute_fdc3_workflow',
          source: 'frontend',
        },
      },
    },
    { type: 'finish', messageId: 'msg-execute', finishReason: 'tool-calls' },
  ];
}

function finalAnswerFrames(): SseFrame[] {
  return [
    { type: 'start', conversationId: 'conv-fdc3-workflow', runId: 'run-final' },
    { type: 'message-start', messageId: 'msg-final', role: 'assistant' },
    { type: 'text-start', messageId: 'msg-final', partId: 'text-final' },
    {
      type: 'text-delta',
      messageId: 'msg-final',
      partId: 'text-final',
      delta: 'Workflow completed. I opened the chart for AAPL from the first pending validation trade.',
    },
    { type: 'text-end', messageId: 'msg-final', partId: 'text-final' },
    { type: 'finish', messageId: 'msg-final', finishReason: 'stop' },
  ];
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
  await expect(page.getByLabel('Message input')).toBeVisible();
}

async function sendAssistantMessage(page: Page, message: string): Promise<void> {
  await page.getByLabel('Message input').fill(message);
  await page.getByRole('button', { name: 'Send message' }).click();
}

test.describe('chatbot FDC3 workflow integration', () => {
  test('chatbot proposes an FDC3 workflow, receives approval, and operates target apps', async ({
    page,
  }) => {
    const requests: RunRequestBody[] = [];
    let runCount = 0;

    await page.route('**/api/chat/runs', async (route) => {
      runCount += 1;
      requests.push(route.request().postDataJSON() as RunRequestBody);

      if (runCount === 1) {
        await fulfillRun(route, workflowApprovalFrames());
        return;
      }

      if (runCount === 2) {
        await fulfillRun(route, workflowExecutionFrames());
        return;
      }

      await fulfillRun(route, finalAnswerFrames());
    });

    await loginToWorkspace(page);
    await openAssistant(page);
    await sendAssistantMessage(page, 'Open a chart for the first pending validation trade');

    await expect(page.getByText('Approve FDC3 workflow')).toBeVisible();
    await expect(page.getByText('trade.pendingValidation.openChart')).toBeVisible();
    await expect(page.getByText('PENDING_VALIDATION')).toBeVisible();

    const initialToolNames = requests[0]?.context?.tools?.map((tool) => tool.name) ?? [];
    expect(initialToolNames).toEqual(
      expect.arrayContaining(['propose_fdc3_workflow', 'execute_fdc3_workflow']),
    );

    await page.getByRole('button', { name: 'Approve' }).click();

    await expect(page.getByRole('tab', { name: 'Trade Blotter' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'FDC3 Tile 2' })).toBeVisible();
    await expect(page.getByTestId('fdc3-view-chart-received').first()).toContainText('AAPL');
    await expect(page.getByText('Workflow completed. I opened the chart for AAPL')).toBeVisible();
    await expect(page.getByText('FDC3 Workflow Result')).toBeVisible();
    await expect(page.getByText('Completed 2 of 2 workflow steps.')).toBeVisible();

    await expect.poll(() => requests.length).toBeGreaterThanOrEqual(3);
    expect(requests[1]?.trigger).toBe('submit-tool-result');
    expect(requests[2]?.trigger).toBe('submit-tool-result');

    const approvalToolMessage = requests[1]?.messages?.find(
      (message) => message.role === 'tool' && message.toolName === 'propose_fdc3_workflow',
    );
    const executionToolMessage = requests[2]?.messages?.find(
      (message) => message.role === 'tool' && message.toolName === 'execute_fdc3_workflow',
    );

    expect(approvalToolMessage).toBeDefined();
    expect(executionToolMessage).toBeDefined();
    expect(JSON.stringify(executionToolMessage)).toContain('"ticker":"AAPL"');
  });
});
