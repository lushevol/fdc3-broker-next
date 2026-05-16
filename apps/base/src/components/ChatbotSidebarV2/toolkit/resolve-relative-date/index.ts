import { z } from 'zod';
import type { ToolkitDefinition } from '../utils/param-info';
import { executeResolveRelativeDate } from './execute';
import { ResolveRelativeDateTool } from './ui';

export const resolveRelativeDateTool: ToolkitDefinition = {
  type: 'backend',
  description: 'Resolve a relative date expression to an actual date',
  parameters: z.object({
    expression: z.string().describe('Relative date expression (e.g. "last monday", "tomorrow")'),
  }),
  execute: executeResolveRelativeDate,
  render: ResolveRelativeDateTool,
};
