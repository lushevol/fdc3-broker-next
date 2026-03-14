import React, { useState, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slide,
  Fab,
  CircularProgress,
  TextField,
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
import { useChatbotController } from './common/useController';
import { ChatbotSidebarProps } from './common/interface';
import { sidebarStyles } from './common/style';

// Simple chat content component that doesn't use the problematic hooks
const SimpleChatContent: React.FC<{
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string; id: string }>;
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}> = ({ messages, isLoading, onSendMessage }) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');

  const handleSend = useCallback(() => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, isLoading, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Message Thread */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.length === 0 ? (
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
          <Box className={sidebarStyles.messageList}>
            {messages
              .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
              .map((msg) => (
                <Box
                  key={msg.id}
                  className={sidebarStyles.message(theme, msg.role as 'user' | 'assistant')}
                >
                  <Typography variant="body1">{msg.content}</Typography>
                </Box>
              ))}
            {isLoading && (
              <Box className={sidebarStyles.typingIndicator(theme)}>
                <Box className={sidebarStyles.typingDot(theme)} />
                <Box className={sidebarStyles.typingDot(theme)} />
                <Box className={sidebarStyles.typingDot(theme)} />
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Box className={sidebarStyles.inputArea(theme)}>
        <Box className={sidebarStyles.inputContainer(theme)}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className={sidebarStyles.textField(theme)}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className={sidebarStyles.sendButton(theme)}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
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

  const handleToggle = useCallback(() => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  }, [onToggle]);

  const handleNewChat = useCallback(() => {
    controller.clearConversation();
  }, [controller]);

  const handleRetry = useCallback(() => {
    controller.retryLastMessage();
  }, [controller]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      await controller.sendMessage(content);
    },
    [controller],
  );

  return (
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
              {controller.error && (
                <IconButton size="small" onClick={handleRetry} title="Retry">
                  <RefreshIcon />
                </IconButton>
              )}
              <IconButton size="small" onClick={handleToggle} title="Close">
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

          {/* Chat Content */}
          <SimpleChatContent
            messages={controller.messages}
            isLoading={controller.isLoading}
            onSendMessage={handleSendMessage}
          />
        </Box>
      </Slide>
    </>
  );
};

export default ChatbotSidebar;
