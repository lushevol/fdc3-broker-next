import { z } from 'zod';
import type { ToolkitDefinition } from '../utils/param-info';
import { executeUserRanking } from './execute';
import { HighestOperationUsersTool } from './ui';

export const highestOperationUsersTool: ToolkitDefinition = {
  type: 'backend',
  source: 'mcp',
  providerId: 'analytics-mcp',
  description: 'Get the users with the highest operation counts by application',
  parameters: z.object({
    application: z.string().describe('Application name'),
    startTime: z.string().optional().describe('Start time for the query range'),
    endTime: z.string().optional().describe('End time for the query range'),
    limit: z.number().optional().describe('Maximum number of users to return'),
  }),
  execute: executeUserRanking,
  render: HighestOperationUsersTool,
};
