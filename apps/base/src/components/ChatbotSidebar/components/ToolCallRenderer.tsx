/**
 * Tool Call Renderer
 *
 * Renders tool calls and results using Material-UI styling
 */

import React from 'react';
import { Box, Paper, Typography, CircularProgress, useTheme } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Build as BuildIcon,
} from '@mui/icons-material';

interface ToolCallRendererProps {
  toolCallId?: string;
  toolName?: string;
  args?: Record<string, unknown>;
  requiresConfirmation?: boolean;
  result?: unknown;
  isError?: boolean;
  error?: string;
}

export const ToolCallRenderer: React.FC<ToolCallRendererProps> = ({
  toolCallId,
  toolName,
  args,
  requiresConfirmation,
  result,
  isError,
  error,
}) => {
  const theme = useTheme();

  // Determine status
  const hasResult = result !== undefined || isError !== undefined;
  const status = isError
    ? 'failed'
    : hasResult
      ? 'completed'
      : requiresConfirmation
        ? 'pending'
        : 'running';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: theme.palette.grey[50],
        border: `1px solid ${theme.palette.divider}`,
        mt: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: hasResult ? 1 : 0 }}>
        <BuildIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ flex: 1 }}>
          {toolName || 'Tool Call'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.75rem',
            color:
              status === 'completed'
                ? theme.palette.success.main
                : status === 'failed'
                  ? theme.palette.error.main
                  : theme.palette.warning.main,
          }}
        >
          {status === 'running' && <CircularProgress size={12} />}
          {status === 'completed' && <CheckCircleIcon fontSize="small" />}
          {status === 'failed' && <ErrorIcon fontSize="small" />}
          <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
            {status}
          </Typography>
        </Box>
      </Box>

      {/* Tool Arguments */}
      {args && Object.keys(args).length > 0 && status === 'running' && (
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 1,
            backgroundColor: theme.palette.grey[100],
            borderRadius: 1,
            fontSize: '0.75rem',
            overflow: 'auto',
            maxHeight: 100,
          }}
        >
          {JSON.stringify(args, null, 2)}
        </Box>
      )}

      {status === 'pending' && (
        <Typography variant="caption" color="text.secondary">
          Waiting for confirmation before executing this tool.
        </Typography>
      )}

      {/* Tool Result */}
      {hasResult && (
        <Box
          sx={{
            mt: 1,
            p: 1,
            backgroundColor: isError ? theme.palette.error.light : theme.palette.grey[100],
            borderRadius: 1,
            fontSize: '0.75rem',
          }}
        >
          {isError ? (
            <Typography variant="caption" color="error">
              {error || 'An error occurred'}
            </Typography>
          ) : (
            <Box component="pre" sx={{ margin: 0, overflow: 'auto', maxHeight: 150 }}>
              {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ToolCallRenderer;
