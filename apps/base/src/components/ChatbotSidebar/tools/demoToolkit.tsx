import { z } from 'zod';
import {
  createWorkspaceAnnouncementDecision,
  executeStatusCardTool,
  executeTimeTool,
} from './demoToolLogic';
import {
  DemoStatusCardToolUi,
  DemoTimeToolUi,
  DemoWorkspaceAnnouncementApprovalToolUi,
} from './demoToolUi';
import type { AssistantRegisteredToolkit } from './toolRouting';

type DemoToolkitFactory = () => AssistantRegisteredToolkit;

export const createDemoToolkit: DemoToolkitFactory = () => ({
  get_current_time: {
    type: 'frontend',
    description: 'Get the current browser-local time for the user.',
    parameters: z.object({
      locale: z.string().default('en-US'),
    }),
    execute: executeTimeTool,
    render: DemoTimeToolUi,
    matchPrompt: (input: string) =>
      input.toLowerCase().includes('time')
        ? {
            locale: 'en-US',
          }
        : null,
  },
  generate_status_card: {
    type: 'frontend',
    description: 'Generate a demo status card rendered inline in the assistant thread.',
    parameters: z.object({
      title: z.string(),
      tone: z.enum(['success', 'warning', 'info']).default('info'),
    }),
    execute: executeStatusCardTool,
    render: DemoStatusCardToolUi,
    matchPrompt: (input: string) => {
      const normalizedInput = input.toLowerCase();
      return normalizedInput.includes('status card') ||
        normalizedInput.includes('show status') ||
        normalizedInput.includes('health card')
        ? {
            title: 'Workspace',
            tone: 'success',
          }
        : null;
    },
  },
  send_workspace_announcement: {
    type: 'frontend',
    description: 'Prepare a workspace announcement and require human approval before sending it.',
    parameters: z.object({
      title: z.string(),
      audience: z.string(),
      summary: z.string(),
    }),
    humanInTheLoop: true,
    execute: async (args) => createWorkspaceAnnouncementDecision(args, true),
    render: DemoWorkspaceAnnouncementApprovalToolUi,
    matchPrompt: (input: string) => {
      const normalizedInput = input.toLowerCase();
      return normalizedInput.includes('workspace announcement') ||
        normalizedInput.includes('announce workspace') ||
        normalizedInput.includes('send workspace update')
        ? {
            title: 'Workspace Update Ready',
            audience: 'Operations Desk',
            summary: 'The active workspace was updated and is ready to be shared with the desk.',
          }
        : null;
    },
  },
});
