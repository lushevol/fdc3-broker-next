import type { Toolkit } from 'chat-protocol-ui';
import type { ChatToolDescriptor } from 'chat-protocol-contract';
import type { ToolkitDefinition } from './utils/param-info';
import { extractParamInfo, resolveToolSource } from './utils/param-info';
import { profileLookupTool } from './profile-lookup';
import { timezoneCurrentTool } from './timezone-current';
import { approvalConfirmTool } from './approval-confirm';
import {
  visitedUserCountByApplicationTool,
  visitedUserHourlyByApplicationTool,
} from './analytics';
import { resolveRelativeDateTool } from './resolve-relative-date';
import { highestOperationUsersTool } from './user-ranking';
import { mostUsedFunctionsTool } from './function-ranking';
import { proposeFdc3ActionTool } from './fdc3/propose-action';
import { createExecuteFdc3ActionTool } from './fdc3/execute-action';
import { proposeFdc3WorkflowTool } from './fdc3/propose-workflow';
import { createExecuteFdc3WorkflowTool } from './fdc3/execute-workflow';
import type { Fdc3ActionExecutor } from './fdc3/shared/action-executor';
import type { Fdc3WorkflowExecutor } from './fdc3/shared/workflow-executor';

export type RuntimeToolkitDeps = {
  fdc3Executor?: Fdc3ActionExecutor;
  workflowExecutor?: Fdc3WorkflowExecutor;
};

function createBaseToolkit(): Record<string, ToolkitDefinition> {
  return {
    profile_lookup: profileLookupTool,
    timezone_current: timezoneCurrentTool,
    approval_confirm: approvalConfirmTool,
    visited_user_count_by_application: visitedUserCountByApplicationTool,
    visited_user_hourly_by_application: visitedUserHourlyByApplicationTool,
    resolve_relative_date: resolveRelativeDateTool,
    highest_operation_users_by_application: highestOperationUsersTool,
    most_used_functions_by_application: mostUsedFunctionsTool,
    propose_fdc3_action: proposeFdc3ActionTool,
    propose_fdc3_workflow: proposeFdc3WorkflowTool,
  };
}

export function createRuntimeToolkit({
  fdc3Executor,
  workflowExecutor,
}: RuntimeToolkitDeps = {}): Toolkit {
  const toolkit = createBaseToolkit();

  const runtimeToolkit: Record<string, ToolkitDefinition> = {
    ...toolkit,
  };

  const executableToolkit: Record<string, ToolkitDefinition> = {
    ...runtimeToolkit,
  };

  if (fdc3Executor) {
    executableToolkit.execute_fdc3_action = createExecuteFdc3ActionTool(fdc3Executor);
  }

  if (workflowExecutor) {
    executableToolkit.execute_fdc3_workflow =
      createExecuteFdc3WorkflowTool(workflowExecutor);
  }

  return executableToolkit as unknown as Toolkit;
}

export const runtimeToolkit: Toolkit = createRuntimeToolkit();

export function getProtocolToolDescriptors(
  toolkit: Toolkit = runtimeToolkit,
): ChatToolDescriptor[] {
  return Object.entries(toolkit).map(([name, definition]) => {
    const def = definition as ToolkitDefinition;
    return {
      name,
      source: resolveToolSource(def),
      providerId: def.providerId,
      description: definition.description ?? '',
      parameters: extractParamInfo(definition.parameters),
    };
  });
}
