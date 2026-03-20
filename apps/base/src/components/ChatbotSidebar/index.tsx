import React from 'react';
import { GenerativeUIProvider, defaultGenerativeComponents } from './common/GenerativeUI';
import { AssistantModal } from '../../next-packages/components/assistant-ui/assistant-modal';

export const ChatbotSidebar: React.FC = () => {
  return (
    <GenerativeUIProvider initialComponents={defaultGenerativeComponents}>
      <AssistantModal />
    </GenerativeUIProvider>
  );
};

export default ChatbotSidebar;
