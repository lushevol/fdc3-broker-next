/**
 * Themed Assistant-UI Thread Components
 *
 * These components wrap assistant-ui primitives with Material-UI theming.
 */

import React from 'react';
import { Box, useTheme, Typography, Paper, Avatar } from '@mui/material';
import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
} from '@assistant-ui/react';
import { SmartToy as SmartToyIcon, Person as PersonIcon } from '@mui/icons-material';
import { sidebarStyles } from '../common/style';

/**
 * User message component
 */
const UserMessage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '80%',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: 2,
        }}
      >
        <MessagePrimitive.Content />
      </Paper>
      <Avatar sx={{ ml: 1, bgcolor: theme.palette.primary.dark }}>
        <PersonIcon />
      </Avatar>
    </Box>
  );
};

/**
 * Assistant message component
 */
const AssistantMessage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 2,
      }}
    >
      <Avatar sx={{ mr: 1, bgcolor: theme.palette.secondary.main }}>
        <SmartToyIcon />
      </Avatar>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '80%',
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        <MessagePrimitive.Content />
      </Paper>
    </Box>
  );
};

/**
 * Themed Thread component
 */
export const ThemedThread: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <ThreadPrimitive.Root>
        <ThreadPrimitive.Viewport>
          <ThreadPrimitive.Empty>
            <Box className={sidebarStyles.emptyState(theme)}>
              <SmartToyIcon className={sidebarStyles.emptyIcon(theme)} />
              <Typography variant="h6" gutterBottom>
                AI Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask me anything! I can help with tasks, answer questions, and execute tools.
              </Typography>
            </Box>
          </ThreadPrimitive.Empty>
          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              AssistantMessage,
            }}
          />
        </ThreadPrimitive.Viewport>
      </ThreadPrimitive.Root>
    </Box>
  );
};

/**
 * Themed Composer component
 */
export const ThemedComposer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <ComposerPrimitive.Root>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <ComposerPrimitive.Input
              placeholder="Type a message..."
            />
          </Box>
          <ComposerPrimitive.Send />
        </Box>
      </ComposerPrimitive.Root>
    </Box>
  );
};

export default ThemedThread;
