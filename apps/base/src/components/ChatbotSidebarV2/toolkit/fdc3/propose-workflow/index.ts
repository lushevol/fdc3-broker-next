import { z } from 'zod';
import type { ToolkitDefinition } from '../../utils/param-info';
import { getFdc3WorkflowCatalogDescription } from '../shared/declarations';
import { Fdc3WorkflowApprovalTool } from './ui';

export const proposeFdc3WorkflowTool: ToolkitDefinition = {
  type: 'human',
  description: `Ask the user to approve a declared FDC3 workflow capability. The model must select a workflowId from this catalog and provide only input fields, never workflow steps. ${getFdc3WorkflowCatalogDescription()}`,
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
