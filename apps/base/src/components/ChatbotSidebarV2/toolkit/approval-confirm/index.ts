import { z } from 'zod';
import type { ToolkitDefinition } from '../utils/param-info';
import { executeApprovalConfirm } from './execute';
import { ApprovalConfirmTool } from './ui';

export const approvalConfirmTool: ToolkitDefinition = {
  type: 'human',
  description: 'Send an email with confirmation',
  parameters: z.object({
    to: z.string().describe('Recipient email address'),
    subject: z.string().describe('Email subject'),
    body: z.string().describe('Email body content'),
  }),
  render: ApprovalConfirmTool,
  execute: executeApprovalConfirm,
};
