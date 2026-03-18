import React, { useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slide,
  Fab,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  SmartToy as SmartToyIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { ChatbotSidebarProps } from './common/interface';
import { sidebarStyles } from './common/style';
import { GenerativeUIProvider, defaultGenerativeComponents } from './common/GenerativeUI';
import { useOptionalChatbot } from './common/ChatbotProvider';
import { AssistantUIRuntimeProvider, useAssistantUIRuntime } from './AssistantUIRuntimeProvider';
import { ThemedThread, ThemedComposer } from './components/ThemedThread';

// Inner component that uses assistant-ui runtime context
const ChatbotContent: React.FC<{
  onToggle: () => void;
}> = ({ onToggle }) => {
  const theme = useTheme();
  const { isLoading, error, clearConversation, retryLastMessage } = useAssistantUIRuntime();

  const handleNewChat = useCallback(() => {
    clearConversation();
  }, [clearConversation]);

  const handleRetry = useCallback(() => {
    retryLastMessage();
  }, [retryLastMessage]);

  return (
    <>
      {/* Header */}
      <Box className={sidebarStyles.header(theme)}>
        <Box className={sidebarStyles.title(theme)}>
          <SmartToyIcon />
          <Typography variant="h6">AI Assistant</Typography>
        </Box>
        <Box className={sidebarStyles.headerActions}>
          <IconButton size="small" onClick={handleNewChat} title="New conversation">
            <AddIcon />
          </IconButton>
          {error && (
            <IconButton size="small" onClick={handleRetry} title="Retry">
              <RefreshIcon />
            </IconButton>
          )}
          <IconButton size="small" onClick={onToggle} title="Close">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Error Message */}
      {error && (
        <Box className={sidebarStyles.errorMessage(theme)}>
          <ErrorIcon fontSize="small" />
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Thread Messages */}
      <ThemedThread />

      {/* Composer Input */}
      <ThemedComposer />
    </>
  );
};

// Main ChatbotSidebar component
export const ChatbotSidebar: React.FC<ChatbotSidebarProps> = ({
  isOpen: externalIsOpen,
  onToggle: externalOnToggle,
  apiUrl = '/api/chat',
  position = 'right',
  width = 400,
}) => {
  const theme = useTheme();
  const chatbotContext = useOptionalChatbot();
  const existingRuntime = useAssistantUIRuntime({ optional: true });
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen =
    externalIsOpen !== undefined
      ? externalIsOpen
      : chatbotContext?.isOpen !== undefined
        ? chatbotContext.isOpen
        : internalIsOpen;

  const handleToggle = useCallback(() => {
    if (externalOnToggle) {
      externalOnToggle();
    } else if (chatbotContext) {
      chatbotContext.toggleSidebar();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  }, [externalOnToggle, chatbotContext]);

  return (
    <GenerativeUIProvider initialComponents={defaultGenerativeComponents}>
      <>
        {/* Toggle Button (Floating Action Button) */}
        {!isOpen && (
          <Fab
            color="primary"
            className={sidebarStyles.toggleButton(theme, position)}
            onClick={handleToggle}
            aria-label="Open chatbot"
          >
            <SmartToyIcon />
          </Fab>
        )}

        {/* Sidebar */}
        <Slide
          direction={position === 'right' ? 'left' : 'right'}
          in={isOpen}
          mountOnEnter
          unmountOnExit
        >
          <Box className={sidebarStyles.container(theme, isOpen, width, position)}>
            {existingRuntime ? (
              <ChatbotContent onToggle={handleToggle} />
            ) : (
              <AssistantUIRuntimeProvider apiUrl={apiUrl}>
                <ChatbotContent onToggle={handleToggle} />
              </AssistantUIRuntimeProvider>
            )}
          </Box>
        </Slide>
      </>
    </GenerativeUIProvider>
  );
};

export default ChatbotSidebar;
