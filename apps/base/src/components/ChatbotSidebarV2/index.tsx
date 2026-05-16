import React, { useMemo } from 'react';
import { ChatProtocolProvider, AssistantModal, type Toolkit } from 'chat-protocol-ui';
import { createToolkitBridge } from './lib/toolkitBridge';
import { createRuntimeToolkit, getProtocolToolDescriptors } from './toolkit/tools';
import { useFdc3ActionExecutor, useFdc3WorkflowExecutor } from './toolkit/use-fdc3-action-executor';
import { getHooksBase } from '../../hooks/HooksBase';
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

export const ChatbotSidebarV2: React.FC<ChatbotSidebarV2Props> = ({ toolRegistryConfig }) => {
  const fdc3Executor = useFdc3ActionExecutor();
  const workflowExecutor = useFdc3WorkflowExecutor();
  const toolkit = useMemo<Toolkit>(
    () =>
      createRuntimeToolkit({
        fdc3Executor,
        workflowExecutor,
      }),
    [fdc3Executor, workflowExecutor],
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
