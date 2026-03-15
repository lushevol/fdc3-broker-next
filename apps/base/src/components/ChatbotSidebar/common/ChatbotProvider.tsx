import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatbotContextValue, ChatState, ToolDefinition } from './interface';

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

interface ChatbotProviderProps {
  children: React.ReactNode;
  apiUrl?: string;
  initialOpen?: boolean;
}

const DEFAULT_API_URL = '/api/chat';

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({
  children,
  apiUrl = DEFAULT_API_URL,
  initialOpen = false,
}) => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    conversationId: null,
    isOpen: initialOpen,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const toolRegistryRef = useRef<Map<string, ToolDefinition>>(new Map());

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

  // Register a tool
  const registerTool = useCallback((tool: ToolDefinition) => {
    toolRegistryRef.current.set(tool.name, tool);
  }, []);

  // Unregister a tool
  const unregisterTool = useCallback((name: string) => {
    toolRegistryRef.current.delete(name);
  }, []);

  // Execute a tool
  const executeTool = useCallback(
    async (name: string, args: Record<string, unknown>): Promise<unknown> => {
      const tool = toolRegistryRef.current.get(name);
      if (!tool) {
        throw new Error(`Tool "${name}" not found`);
      }
      return tool.execute(args);
    },
    [],
  );

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

        // Store conversation in session storage
        const conversationKey = `chatbot-conversation-${state.conversationId || 'default'}`;
        const currentMessages = [...state.messages, userMessage, assistantMessage];
        sessionStorage.setItem(conversationKey, JSON.stringify(currentMessages));

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
            const toolCall = JSON.parse(event.data);
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
            const result = JSON.parse(event.data);
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, toolResults: [...(msg.toolResults || []), result] }
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
        eventSource.onerror = () => {
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
    [apiUrl, state.conversationId, state.isLoading, state.messages],
  );

  const clearConversation = useCallback(() => {
    // Clear session storage
    if (state.conversationId) {
      sessionStorage.removeItem(`chatbot-conversation-${state.conversationId}`);
    }
    setState((prev) => ({
      ...prev,
      messages: [],
      error: null,
      conversationId: null,
    }));
  }, [state.conversationId]);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...state.messages].reverse().find((msg) => msg.role === 'user');

    if (lastUserMessage) {
      // Remove failed messages after the last user message
      const userMessageIndex = state.messages.findIndex((m) => m.id === lastUserMessage.id);
      setState((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, userMessageIndex + 1),
        error: null,
      }));

      await sendMessage(lastUserMessage.content);
    }
  }, [state.messages, sendMessage]);

  const value: ChatbotContextValue = {
    ...state,
    sendMessage,
    clearConversation,
    toggleSidebar,
    retryLastMessage,
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
};

export const useChatbot = (): ChatbotContextValue => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

// Hook for accessing tool registry (internal use)
export const useToolRegistry = () => {
  const toolRegistry = useRef<Map<string, ToolDefinition>>(new Map());

  const registerTool = useCallback((tool: ToolDefinition) => {
    toolRegistry.current.set(tool.name, tool);
  }, []);

  const unregisterTool = useCallback((name: string) => {
    toolRegistry.current.delete(name);
  }, []);

  const getTool = useCallback((name: string) => {
    return toolRegistry.current.get(name);
  }, []);

  const executeTool = useCallback(async (name: string, args: Record<string, unknown>) => {
    const tool = toolRegistry.current.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" not found`);
    }
    return tool.execute(args);
  }, []);

  return {
    registerTool,
    unregisterTool,
    getTool,
    executeTool,
  };
};

export default ChatbotProvider;
