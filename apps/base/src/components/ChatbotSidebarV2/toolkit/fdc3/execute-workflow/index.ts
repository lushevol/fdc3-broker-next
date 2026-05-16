import { z } from 'zod';
import type { ToolkitDefinition } from '../../utils/param-info';
import type { Fdc3WorkflowExecutor } from '../shared/workflow-executor';
import { Fdc3WorkflowTranscriptTool } from './ui';

export function createExecuteFdc3WorkflowTool(
  workflowExecutor: Fdc3WorkflowExecutor,
): ToolkitDefinition {
  return {
    type: 'frontend',
    description:
      'Execute an approved declared FDC3 workflow capability through the platform broker and return the workflow transcript.',
    parameters: z.object({
      workflowId: z
        .string()
        .describe('Declared FDC3 workflow id from propose_fdc3_workflow.'),
      input: z
        .record(z.string(), z.unknown())
        .optional()
        .describe('Workflow input values only.'),
    }),
    execute: async (input) => {
      const record = input as Record<string, unknown>;
      return workflowExecutor.execute({
        workflowId: String(record.workflowId),
        input:
          record.input &&
          typeof record.input === 'object' &&
          !Array.isArray(record.input)
            ? (record.input as Record<string, unknown>)
            : {},
      });
    },
    render: Fdc3WorkflowTranscriptTool,
  };
}
