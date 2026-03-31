import { useMemo } from 'react';
import { useFDC3WorkspaceHelper } from '../../fdc3/useFDC3WorkspaceHelper';
import { useRegisterAssistantTools } from './AssistantUIRuntimeProvider';
import { createBrowserFdc3IntentToolkit } from './tools/fdc3IntentTool';

export function Fdc3IntentToolRegistration(): null {
  const { workspaceOpenTile } = useFDC3WorkspaceHelper();

  const toolkit = useMemo(
    () =>
      createBrowserFdc3IntentToolkit(async ({ tile }) => {
        const openStatus = await workspaceOpenTile({
          tile,
        });

        return {
          ...openStatus,
          workspaceId: openStatus.workspaceId ?? '',
        };
      }),
    [workspaceOpenTile],
  );

  useRegisterAssistantTools(toolkit);

  return null;
}

export default Fdc3IntentToolRegistration;
