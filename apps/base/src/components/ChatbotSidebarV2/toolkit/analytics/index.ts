import { z } from 'zod';
import type { ToolkitDefinition } from '../utils/param-info';
import { executeAnalytics } from './execute';
import { AnalyticsTool } from './ui';

export const visitedUserCountByApplicationTool: ToolkitDefinition = {
  type: 'backend',
  description: 'Get visited user count by application',
  parameters: z.object({
    application: z.string().describe('Application name'),
    startTime: z.string().optional().describe('Start time for the query range'),
    endTime: z.string().optional().describe('End time for the query range'),
  }),
  execute: executeAnalytics,
  render: AnalyticsTool,
};

export const visitedUserHourlyByApplicationTool: ToolkitDefinition = {
  type: 'backend',
  description: 'Get hourly visited user count by application',
  parameters: z.object({
    application: z.string().describe('Application name'),
    startTime: z.string().optional().describe('Start time for the query range'),
    endTime: z.string().optional().describe('End time for the query range'),
  }),
  execute: executeAnalytics,
  render: AnalyticsTool,
};
