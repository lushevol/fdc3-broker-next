import { z } from 'zod';
import type { ToolkitDefinition } from '../../utils/param-info';
import type { Fdc3ActionExecutor } from '../shared/action-executor';
import { Fdc3ExecutionResultTool } from './ui';

export function createExecuteFdc3ActionTool(
  fdc3Executor: Fdc3ActionExecutor,
): ToolkitDefinition {
  return {
    type: 'frontend',
    description:
      'After approval, raise the selected declaration-backed FDC3 intent through the platform broker and return the handler result to the chat.',
    parameters: z.object({
      actionId: z
        .string()
        .describe(
          'Use one of the declared FDC3 action ids from the action catalog in propose_fdc3_action.',
        ),
    }),
    execute: async (input) =>
      fdc3Executor.execute(input as { actionId: string }, { continuationPayload: true }),
    render: Fdc3ExecutionResultTool,
  };
}
