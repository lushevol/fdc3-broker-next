import { z } from 'zod';
import type { ToolkitDefinition } from '../../utils/param-info';
import { getFdc3ChatActionDefinitions } from '../shared/declarations';
import { Fdc3ApprovalTool } from './ui';

export const proposeFdc3ActionTool: ToolkitDefinition = {
  type: 'human',
  description: `Ask the user to approve a declaration-backed FDC3 action before it is raised through the broker. ${getFdc3ActionCatalogDescription()}`,
  parameters: z.object({
    actionId: z
      .string()
      .describe(
        'Use one of the declared FDC3 action ids from the action catalog in this tool description.',
      ),
    question: z
      .string()
      .describe('Optional original user request, only for showing in the approval card.'),
  }),
  render: Fdc3ApprovalTool,
};

function getFdc3ActionCatalogDescription(): string {
  const actions = getFdc3ChatActionDefinitions();
  if (actions.length === 0) {
    return 'No declaration-backed FDC3 chatbot actions are currently available.';
  }

  return actions
    .map((action) => `${action.id}: ${action.approvalBody}`)
    .join(' ');
}
