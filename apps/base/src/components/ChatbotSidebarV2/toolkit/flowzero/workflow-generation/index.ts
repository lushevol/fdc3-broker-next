import React from 'react';
import { z } from 'zod';
import type { ToolRenderProps } from '../../compositor';
import type { ToolkitDefinition } from '../../utils/param-info';
import { FlowzeroWorkflowGenerationTool } from './ui';

export type FlowzeroWorkflowOpenHandler = (route: string) => void | Promise<void>;

export function createFlowzeroWorkflowGenerationTool(
  openFlowzeroWorkflow?: FlowzeroWorkflowOpenHandler,
): ToolkitDefinition {
  return {
    type: 'backend',
    source: 'mcp',
    providerId: 'flowzero-mcp',
    description: 'Create a Flowzero workflow draft through the Flowzero MCP service',
    parameters: z.object({
      prompt: z.string().describe('Natural-language workflow requirements'),
      workflowName: z.string().optional().describe('Optional workflow name'),
      steps: z.array(z.string()).optional().describe('Optional ordered workflow steps'),
      requestedBy: z.string().optional().describe('Optional requesting user id'),
    }),
    render: (props: ToolRenderProps) =>
      React.createElement(FlowzeroWorkflowGenerationTool, {
        ...props,
        openFlowzeroWorkflow,
      }),
  };
}
