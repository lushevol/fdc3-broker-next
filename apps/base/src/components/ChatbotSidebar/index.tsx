import React, { useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Slide,
  Fab,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as SmartToyIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  Thread,
  Composer,
  useThreadRuntime,
  useThread,
} from '@assistant-ui/react';
import { useChatbotController } from './common/useController';
import { ChatbotSidebarProps } from './common/interface';
import { sidebarStyles } from './common/style';

// Inner component that uses assistant-ui hooks
const ChatContent: React.FC<{
  onNewChat: () => void;
}> = ({ onNewChat }) => {
  const theme = useTheme();
  const thread = useThread();
  const runtime = useThreadRuntime();

  const handleSendMessage = useCallback((content: string) => {
    if (content.trim()) {
      // For assistant-ui, we use the runtime to append a message
      runtime.append({
        role: 'user',
        content: [{ type: 'text', text: content.trim() }],
      });
    }
  }, [runtime]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Message Thread */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {thread.messages.length === 0 ? (
          <Box className={sidebarStyles.emptyState(theme)}>
            <SmartToyIcon className={sidebarStyles.emptyIcon(theme)} />
            <Typography variant="h6" gutterBottom>
              AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ask me anything! I can help with tasks, answer questions, and execute tools.
            </Typography>
          </Box>
        ) : (
          <Thread />
        )}
      </Box>

      {/* Composer / Input */}
      <Box className={sidebarStyles.inputArea(theme)}>
        <Composer>
          <Composer.Input
            placeholder="Type a message..."
            className={sidebarStyles.textField(theme)}
          />
          <Composer.Send>
            <IconButton
              color="primary"
              className={sidebarStyles.sendButton(theme)}
            >
              <SendIcon />
            </IconButton>
          </Composer.Send>
        </Composer>
      </Box>
    </Box>
  );
};

// Main ChatbotSidebar component
export const ChatbotSidebar: React.FC<ChatbotSidebarProps> = ({
  isOpen: externalIsOpen,
  onToggle,
  apiUrl,
  position = 'right',
  width = 400,
}) => {
  const theme = useTheme();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const controller = useChatbotController({ apiUrl });

  // Create assistant-ui runtime
  const runtime = useLocalRuntime({
    // Adapter for connecting to backend
    async onNew(message) {
      const userMessage = message.content
        .filter(part => part.type === 'text')
        .map(part => (part as { type: 'text'; text: string }).text)
        .join('\n');

      if (userMessage.trim()) {
        await controller.sendMessage(userMessage);
      }

      // Return the assistant response
      const lastMessage = controller.messages[controller.messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        return {
          content: [{ type: 'text' as const, text: lastMessage.content }],
        };
      }

      return { content: [{ type: 'text' as const, text: '' }] };
    },
  });

  const handleToggle = useCallback(() => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  }, [onToggle]);

  const handleNewChat = useCallback(() => {
    controller.clearConversation();
    // Reset the runtime thread
    runtime.resetThread();
  }, [controller, runtime]);

  const handleRetry = useCallback(() => {
    controller.retryLastMessage();
  }, [controller]);

  return (
    <>
      {/* Toggle Button */}
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
      <Slide direction={position === 'right' ? 'left' : 'right'} in={isOpen} mountOnEnter unmountOnExit>
        <Box className={sidebarStyles.container(theme, isOpen, width, position)}>
          {/* Header */}
          <Box className={sidebarStyles.header(theme)}>
            <Box className={sidebarStyles.title(theme)}>
              <SmartToyIcon />
              <Typography variant="h6">AI Assistant</Typography>
            </Box>
            <Box className={sidebarStyles.headerActions}>
              <IconButton
                size="small"
                onClick={handleNewChat}
                title="New conversation"
              >
                <AddIcon />
              </IconButton>
              {controller.error && (
                <IconButton
                  size="small"
                  onClick={handleRetry}
                  title="Retry"
                >
                  <RefreshIcon />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={handleToggle}
                title="Close"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Error Message */}
          {controller.error && (
            <Box className={sidebarStyles.errorMessage(theme)}>
              <ErrorIcon fontSize="small" />
              <Typography variant="body2">{controller.error}</Typography>
            </Box>
          )}

          {/* Chat Content with assistant-ui runtime */}
          <AssistantRuntimeProvider runtime={runtime}>
            <ChatContent onNewChat={handleNewChat} />
          </AssistantRuntimeProvider>

          {/* Loading Indicator */}
          {controller.isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </Slide>
    </>
  );
};

export default ChatbotSidebar;