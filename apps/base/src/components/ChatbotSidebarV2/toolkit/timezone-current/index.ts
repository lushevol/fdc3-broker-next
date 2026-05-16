import { z } from 'zod';
import type { ToolkitDefinition } from '../utils/param-info';
import { executeTimezoneCurrent } from './execute';
import { TimezoneCurrentTool } from './ui';

export const timezoneCurrentTool: ToolkitDefinition = {
  type: 'frontend',
  description: "Get the user's current timezone",
  parameters: z.object({}),
  execute: executeTimezoneCurrent,
  render: TimezoneCurrentTool,
};
