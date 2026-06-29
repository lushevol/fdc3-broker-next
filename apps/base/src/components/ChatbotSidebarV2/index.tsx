import React, { useCallback, useMemo } from 'react';
import { ChatProtocolProvider, AssistantModal, type Toolkit } from 'chat-protocol-ui';
import { createToolkitBridge } from './toolkit/bridge';
import { createRuntimeToolkit, getProtocolToolDescriptors } from './toolkit';
import { useFdc3ActionExecutor, useFdc3WorkflowExecutor } from './toolkit/fdc3/shared/hooks';
import { getHooksBase } from '../../hooks/HooksBase';
import { useFDC3WorkspaceHelper } from '../../hooks/fdc3/useFDC3WorkspaceHelper';
import 'chat-protocol-ui/styles.css';

const API_URL = process.env.CHAT_API_URL || 'http://127.0.0.1:8080/api/chat/runs';

type ChatbotWorkspaceSnapshot = {
  activeWorkspaceId?: string | null;
  activeWorkspaceLabel?: string | null;
  activeTileTitle?: string | null;
  activeTileId?: string | null;
  activeAppId?: string | null;
  totalWorkspaces?: number;
  totalTiles?: number;
  workspaces?: Array<Record<string, unknown>>;
};

function optionalString(value: string | null | undefined): string | undefined {
  return value ?? undefined;
}

type ToolRegistryConfig = {
  getWorkspaceSnapshot?: () => ChatbotWorkspaceSnapshot;
};

type ChatbotSidebarV2Props = {
  toolRegistryConfig?: ToolRegistryConfig;
};

function dispatchFlowzeroNavigate(route: string) {
  window.dispatchEvent(new CustomEvent('flowzero:navigate', { detail: { route } }));
}

export const ChatbotSidebarV2: React.FC<ChatbotSidebarV2Props> = ({ toolRegistryConfig }) => {
  const fdc3Executor = useFdc3ActionExecutor();
  const workflowExecutor = useFdc3WorkflowExecutor();
  const { workspaceOpenTile } = useFDC3WorkspaceHelper();
  const openFlowzeroWorkflow = useCallback(
    async (route: string) => {
      await workspaceOpenTile({
        container: 'mfe-flowzero',
        module: 'flowzero',
        tile: 'workflow-management',
      });

      dispatchFlowzeroNavigate(route);
      window.setTimeout(() => dispatchFlowzeroNavigate(route), 300);
      window.setTimeout(() => dispatchFlowzeroNavigate(route), 1000);
    },
    [workspaceOpenTile],
  );
  const toolkit = useMemo<Toolkit>(
    () =>
      createRuntimeToolkit({
        fdc3Executor,
        workflowExecutor,
        openFlowzeroWorkflow,
      }),
    [fdc3Executor, workflowExecutor, openFlowzeroWorkflow],
  );
  const toolkitBridge = useMemo(() => createToolkitBridge(toolkit), [toolkit]);
  const tools = useMemo(() => getProtocolToolDescriptors(toolkit), [toolkit]);
  const context = useMemo(() => {
    const workspaceSnapshot = toolRegistryConfig?.getWorkspaceSnapshot?.();

    if (!workspaceSnapshot) {
      return undefined;
    }

    return {
      workspace: {
        ...workspaceSnapshot,
        activeWorkspaceId: optionalString(workspaceSnapshot.activeWorkspaceId),
        activeWorkspaceLabel: optionalString(workspaceSnapshot.activeWorkspaceLabel),
        activeTileTitle: optionalString(workspaceSnapshot.activeTileTitle),
        activeTileId: optionalString(workspaceSnapshot.activeTileId),
        activeAppId: optionalString(workspaceSnapshot.activeAppId),
      },
    };
  }, [toolRegistryConfig]);

  const currentUserId = useMemo(() => {
    const store = getHooksBase().store;
    return store?.user?.userId || store?.user?.sub;
  }, []);

  return (
    <ChatProtocolProvider
      apiUrl={API_URL}
      toolkit={toolkit}
      tools={tools}
      context={context}
      toolkitBridge={toolkitBridge}
      userId={currentUserId}
    >
      <AssistantModal />
    </ChatProtocolProvider>
  );
};

export default ChatbotSidebarV2;
