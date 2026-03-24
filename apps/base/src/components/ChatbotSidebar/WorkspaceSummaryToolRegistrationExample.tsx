import { useMemo } from 'react';
import { useRegisterAssistantTools } from './AssistantUIRuntimeProvider';
import { createWorkspaceSummaryToolkit } from './tools/workspaceSummaryTool';

interface WorkspaceSummaryToolRegistrationExampleProps {
  workspaceLabel: string;
  tileCount: number;
}

export function WorkspaceSummaryToolRegistrationExample({
  workspaceLabel,
  tileCount,
}: WorkspaceSummaryToolRegistrationExampleProps): null {
  const toolkit = useMemo(
    () =>
      createWorkspaceSummaryToolkit({
        workspaceLabel,
        tileCount,
      }),
    [tileCount, workspaceLabel],
  );

  useRegisterAssistantTools(toolkit);

  return null;
}

export default WorkspaceSummaryToolRegistrationExample;
