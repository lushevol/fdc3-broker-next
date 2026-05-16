import { z } from 'zod';
import type { ToolkitDefinition } from '../utils/param-info';
import { executeProfileLookup } from './execute';
import { ProfileLookupTool } from './ui';

export const profileLookupTool: ToolkitDefinition = {
  type: 'frontend',
  disabled: true,
  description: 'Lookup user profile information',
  parameters: z.object({
    userId: z.string().describe('The ID of the user to look up'),
  }),
  execute: executeProfileLookup,
  render: ProfileLookupTool,
};
