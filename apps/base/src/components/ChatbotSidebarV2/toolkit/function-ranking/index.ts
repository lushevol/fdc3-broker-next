import { z } from 'zod';
import type { ToolkitDefinition } from '../utils/param-info';
import { executeFunctionRanking } from './execute';
import { FunctionUsageRankingTool } from './ui';

export const mostUsedFunctionsTool: ToolkitDefinition = {
  type: 'backend',
  source: 'mcp',
  providerId: 'analytics-mcp',
  description: 'Get the most used functions by application',
  parameters: z.object({
    application: z.string().describe('Application name'),
    startTime: z.string().optional().describe('Start time for the query range'),
    endTime: z.string().optional().describe('End time for the query range'),
    limit: z.number().optional().describe('Maximum number of functions to return'),
  }),
  execute: executeFunctionRanking,
  render: FunctionUsageRankingTool,
};
