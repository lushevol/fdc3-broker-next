import { expect, test, type Page } from '@playwright/test';

test.use({ channel: 'chrome' });

type FlowzeroUseCase = {
  name: string;
  message: string;
  workflowName: string;
  summary: string;
  nodeLabels: string[];
  warnings: string[];
};

const useCases: FlowzeroUseCase[] = [
  {
    name: 'expense approval',
    message:
      'Generate a Flowzero workflow named Expense Approval: start, request review, manager approval, finance approval, end',
    workflowName: 'Expense Approval',
    summary: 'Start -> Request Review -> Manager Approval -> Finance Approval -> End',
    nodeLabels: ['Start', 'Request Review', 'Manager Approval', 'Finance Approval', 'End'],
    warnings: [],
  },
  {
    name: 'vendor onboarding',
    message:
      'Generate a Flowzero workflow named Vendor Onboarding: start, collect vendor documents, risk review, legal approval, end',
    workflowName: 'Vendor Onboarding',
    summary: 'Start -> Collect Vendor Documents -> Risk Review -> Legal Approval -> End',
    nodeLabels: ['Start', 'Collect Vendor Documents', 'Risk Review', 'Legal Approval', 'End'],
    warnings: [],
  },
  {
    name: 'access request',
    message:
      'Generate a Flowzero workflow named Access Request: start, line manager approval, system owner approval, provision access, end',
    workflowName: 'Access Request',
    summary: 'Start -> Line Manager Approval -> System Owner Approval -> Provision Access -> End',
    nodeLabels: [
      'Start',
      'Line Manager Approval',
      'System Owner Approval',
      'Provision Access',
      'End',
    ],
    warnings: [],
  },
  {
    name: 'policy exception',
    message:
      'Generate a Flowzero workflow named Policy Exception: start, submit exception, compliance review, risk signoff, end',
    workflowName: 'Policy Exception',
    summary: 'Start -> Submit Exception -> Compliance Review -> Risk Signoff -> End',
    nodeLabels: ['Start', 'Submit Exception', 'Compliance Review', 'Risk Signoff', 'End'],
    warnings: [],
  },
  {
    name: 'ambiguous approval',
    message: 'Generate a Flowzero approval workflow',
    workflowName: 'Generated FlowZero Workflow',
    summary: 'Start -> Generate a Flowzero Approval Workflow -> End',
    nodeLabels: ['Start', 'Generate a Flowzero Approval Workflow', 'End'],
    warnings: [
      'Prompt had limited structure, so FlowZero generated a minimal start-task-end workflow.',
    ],
  },
];

async function closeExpiredSessionModal(page: Page, timeout = 500): Promise<void> {
  const extendButton = page.getByRole('button', { name: 'Extend' });
  if (
    await extendButton
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false)
  ) {
    await extendButton.click();
    return;
  }

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
  await closeExpiredSessionModal(page, 5_000);
  await expect(page.getByText('Find tile')).toBeVisible();
}

async function openAssistant(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Open Assistant' }).click();
  await expect(page.getByLabel('Message input')).toBeVisible();
}

async function sendAssistantMessage(page: Page, message: string): Promise<void> {
  await page.getByLabel('Message input').fill(message);
  await page.getByRole('button', { name: 'Send message' }).click();
}

async function assertGeneratedWorkflow(page: Page, useCase: FlowzeroUseCase): Promise<void> {
  const toolTrigger = page.getByRole('button', {
    name: 'Used tool: generate_flowzero_workflow',
  });
  await expect(toolTrigger).toBeVisible({
    timeout: 30_000,
  });
  await toolTrigger.click();

  const toolResult = page.locator('.aui-tool-fallback-result-content').last();
  await expect(toolResult).toContainText('"workflowId": "flowzero-wf-');
  await expect(toolResult).toContainText(useCase.workflowName);
  await expect(toolResult).toContainText(useCase.summary);
  await expect(toolResult).toContainText('bpmn:process');

  for (const label of useCase.nodeLabels) {
    await expect(toolResult).toContainText(label);
  }
  for (const warning of useCase.warnings) {
    await expect(toolResult).toContainText(warning);
  }

  await expect(
    page.getByText(`Created Flowzero workflow ${useCase.workflowName}`).last(),
  ).toBeVisible();
}

test.describe('Flowzero chatbot workflow generation', () => {
  for (const useCase of useCases) {
    test(`creates service-backed workflow draft for ${useCase.name}`, async ({ page }) => {
      await loginToWorkspace(page);
      await openAssistant(page);
      await sendAssistantMessage(page, useCase.message);
      await assertGeneratedWorkflow(page, useCase);
    });
  }
});
