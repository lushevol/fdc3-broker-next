import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatState, ToolCall, ToolResult } from './interface';

interface UseChatbotControllerProps {
  apiUrl?: string;
  conversationId?: string;
}

interface UseChatbotControllerReturn extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
  retryLastMessage: () => Promise<void>;
  setConversationId: (id: string | null) => void;
}

const DEFAULT_API_URL = '/api/chat';

export function useChatbotController(
  props?: UseChatbotControllerProps,
): UseChatbotControllerReturn {
  const { apiUrl = DEFAULT_API_URL, conversationId: initialConversationId } = props || {};

  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    conversationId: initialConversationId || null,
    isOpen: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        // Create assistant message placeholder
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          toolCalls: [],
          toolResults: [],
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));

        // Use SSE for streaming
        const streamUrl = `${apiUrl}/stream`;
        const params = new URLSearchParams({
          message: content.trim(),
        });
        if (state.conversationId) {
          params.set('conversationId', state.conversationId);
        }

        const eventSource = new EventSource(`${streamUrl}?${params.toString()}`);
        eventSourceRef.current = eventSource;

        let accumulatedContent = '';

        // Handle conversation_id event
        eventSource.addEventListener('conversation_id', (event) => {
          const conversationId = event.data;
          setState((prev) => ({ ...prev, conversationId }));
        });

        // Handle message events (streaming tokens)
        eventSource.addEventListener('message', (event) => {
          accumulatedContent += event.data || '';
          setState((prev) => ({
            ...prev,
            messages: prev.messages.map((msg) =>
              msg.id === assistantMessage.id ? { ...msg, content: accumulatedContent } : msg,
            ),
          }));
        });

        // Handle tool_call events
        eventSource.addEventListener('tool_call', (event) => {
          try {
            const toolCall = JSON.parse(event.data) as ToolCall;
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, toolCalls: [...(msg.toolCalls || []), toolCall] }
                  : msg,
              ),
            }));
          } catch (e) {
            console.error('Failed to parse tool_call event:', e);
          }
        });

        // Handle tool_result events
        eventSource.addEventListener('tool_result', (event) => {
          try {
            const toolResult = JSON.parse(event.data) as ToolResult;
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, toolResults: [...(msg.toolResults || []), toolResult] }
                  : msg,
              ),
            }));
          } catch (e) {
            console.error('Failed to parse tool_result event:', e);
          }
        });

        // Handle error events
        eventSource.addEventListener('error', (event) => {
          if (event instanceof MessageEvent) {
            setState((prev) => ({
              ...prev,
              error: event.data || 'An error occurred',
              isLoading: false,
            }));
          }
          eventSource.close();
        });

        // Handle done event
        eventSource.addEventListener('done', () => {
          eventSource.close();
          setState((prev) => ({ ...prev, isLoading: false }));
        });

        // Handle connection errors
        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          eventSource.close();
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Connection lost. Please try again.',
          }));
        };
      } catch (error) {
        console.error('Failed to send message:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to send message',
        }));
      }
    },
    [apiUrl, state.conversationId, state.isLoading],
  );

  const clearConversation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      error: null,
      conversationId: null,
    }));
  }, []);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...state.messages].reverse().find((msg) => msg.role === 'user');

    if (lastUserMessage) {
      // Remove failed messages after the last user message
      setState((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, prev.messages.indexOf(lastUserMessage) + 1),
        error: null,
      }));

      await sendMessage(lastUserMessage.content);
    }
  }, [state.messages, sendMessage]);

  const setConversationId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, conversationId: id }));
  }, []);

  return {
    ...state,
    sendMessage,
    clearConversation,
    retryLastMessage,
    setConversationId,
  };
}

export default useChatbotController;
