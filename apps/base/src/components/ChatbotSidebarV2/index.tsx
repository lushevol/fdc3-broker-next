import React, { useMemo } from 'react';
import { ChatProtocolProvider, AssistantModal, type Toolkit } from 'chat-protocol-ui';
import { createToolkitBridge } from './lib/toolkitBridge';
import { runtimeToolkit, getProtocolToolDescriptors } from './toolkit/tools';
import 'chat-protocol-ui/styles.css';

const API_URL = process.env.CHAT_API_URL || 'http://127.0.0.1:8080/api/chat/runs';

export const ChatbotSidebarV2: React.FC = () => {
  const toolkit = useMemo<Toolkit>(() => runtimeToolkit, []);
  const toolkitBridge = useMemo(() => createToolkitBridge(toolkit), [toolkit]);
  const tools = useMemo(() => getProtocolToolDescriptors(), []);

  return (
    <ChatProtocolProvider
      apiUrl={API_URL}
      toolkit={toolkit}
      tools={tools}
      toolkitBridge={toolkitBridge}
    >
      <AssistantModal />
    </ChatProtocolProvider>
  );
};

export default ChatbotSidebarV2;
