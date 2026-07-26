import { z } from 'zod';
import type { ToolkitDefinition } from '../../utils/param-info';
import { getFdc3WorkflowCatalogDescription } from '../shared/declarations';
import { Fdc3WorkflowApprovalTool } from './ui';

export const proposeFdc3WorkflowTool: ToolkitDefinition = {
  type: 'human',
  description: `Turn a user's workflow goal into the ordered steps of one matching declared FDC3 workflow, then ask for explicit approval before any intent executes. The model must select a workflowId from this catalog, provide only that workflow's input fields, and never invent workflow ids, intents, steps, or bindings. The UI renders the selected workflow's declared steps as the execution plan. ${getFdc3WorkflowCatalogDescription()}`,
  parameters: z.object({
    workflowId: z.string().describe('Declared FDC3 workflow id from the workflow catalog.'),
    input: z
      .record(z.string(), z.unknown())
      .optional()
      .describe('Workflow input values only. Do not include steps.'),
    originalRequest: z
      .string()
      .optional()
      .describe('Original user request for approval display.'),
  }),
  render: Fdc3WorkflowApprovalTool,
};
