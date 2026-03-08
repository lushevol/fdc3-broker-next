import React from 'react';
import { useTheme, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  PlayArrow as PlayIcon,
  Schedule as PendingIcon,
  Refresh as RetryIcon,
} from '@mui/icons-material';
import { ToolCall, ToolResult } from './interface';
import { sidebarStyles } from './style';

interface ToolExecutionCardProps {
  toolCall: ToolCall;
  result?: ToolResult;
  onRetry?: () => void;
}

export const ToolExecutionCard: React.FC<ToolExecutionCardProps> = ({
  toolCall,
  result,
  onRetry,
}) => {
  const theme = useTheme();

  const getStatusIcon = () => {
    switch (toolCall.status) {
      case 'pending':
        return <PendingIcon fontSize="small" />;
      case 'running':
        return <CircularProgress size={16} />;
      case 'completed':
        return <CheckIcon fontSize="small" color="success" />;
      case 'failed':
        return <ErrorIcon fontSize="small" color="error" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (toolCall.status) {
      case 'pending':
        return 'Waiting...';
      case 'running':
        return 'Executing...';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Box className={sidebarStyles.toolCard(theme)}>
      <Box className={sidebarStyles.toolHeader(theme)}>
        {getStatusIcon()}
        <Typography variant="body2" fontWeight={500}>
          {toolCall.name}
        </Typography>
      </Box>

      <Box className={sidebarStyles.toolStatus(theme, toolCall.status)}>
        {getStatusText()}
      </Box>

      {/* Show arguments if meaningful */}
      {Object.keys(toolCall.arguments).length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Arguments:
          </Typography>
          <Box
            component="pre"
            sx={{
              fontSize: '0.75rem',
              p: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 100,
            }}
          >
            {JSON.stringify(toolCall.arguments, null, 2)}
          </Box>
        </Box>
      )}

      {/* Show result if available */}
      {result && toolCall.status === 'completed' && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Result:
          </Typography>
          <Box
            component="pre"
            sx={{
              fontSize: '0.75rem',
              p: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 150,
            }}
          >
            {typeof result.result === 'string'
              ? result.result
              : JSON.stringify(result.result, null, 2)}
          </Box>
        </Box>
      )}

      {/* Show error if failed */}
      {result?.error && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="error">
            Error: {result.error}
          </Typography>
          {onRetry && (
            <IconButton size="small" onClick={onRetry} title="Retry">
              <RetryIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

// Component to render multiple tool calls
interface ToolExecutionListProps {
  toolCalls: ToolCall[];
  toolResults?: ToolResult[];
  onRetry?: (toolCallId: string) => void;
}

export const ToolExecutionList: React.FC<ToolExecutionListProps> = ({
  toolCalls,
  toolResults = [],
  onRetry,
}) => {
  return (
    <Box>
      {toolCalls.map(toolCall => (
        <ToolExecutionCard
          key={toolCall.id}
          toolCall={toolCall}
          result={toolResults.find(r => r.toolCallId === toolCall.id)}
          onRetry={onRetry ? () => onRetry(toolCall.id) : undefined}
        />
      ))}
    </Box>
  );
};

export default ToolExecutionCard;