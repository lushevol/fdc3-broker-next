/**
 * Assistant-UI Runtime Provider
 *
 * This provider integrates assistant-ui's ThreadRuntime with our SSE backend.
 * It uses assistant-ui's ExternalStoreAdapter pattern to bridge our custom backend.
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
  type ThreadMessage,
  type AppendMessage,
  type ThreadAssistantMessage,
  type ThreadUserMessage,
} from '@assistant-ui/react';
import {
  createUserMessage,
  createInitialStreamingState,
  buildSSEUrl,
  handleSSEEvent,
  generateMessageId,
} from './adapters/sseToAssistantUi';
import type { AssistantUIMessage, StreamingState } from './adapters/types';

interface AssistantUIRuntimeContextValue {
  /** Current conversation ID */
  conversationId: string | null;
  /** Current thread messages in assistant-ui-compatible internal format */
  messages: AssistantUIMessage[];
  /** Whether a message is currently streaming */
  isLoading: boolean;
  /** Current error state */
  error: string | null;
  /** Send a plain-text user message through the assistant-ui runtime bridge */
  sendMessage: (content: string) => Promise<void>;
  /** Clear the current conversation */
  clearConversation: () => void;
  /** Retry the last failed message */
  retryLastMessage: () => void;
}

const AssistantUIRuntimeContext = createContext<AssistantUIRuntimeContextValue | null>(null);

export function useAssistantUIRuntime(options?: {
  optional?: false | undefined;
}): AssistantUIRuntimeContextValue;
export function useAssistantUIRuntime(options?: {
  optional?: boolean | undefined;
}): AssistantUIRuntimeContextValue | null;
export function useAssistantUIRuntime(options?: {
  optional?: boolean | undefined;
}): AssistantUIRuntimeContextValue | null {
  const context = useContext(AssistantUIRuntimeContext);
  if (!context && !options?.optional) {
    throw new Error('useAssistantUIRuntime must be used within AssistantUIRuntimeProvider');
  }
  return context;
}

interface AssistantUIRuntimeProviderProps {
  children: ReactNode;
  apiUrl: string;
}

/**
 * Convert assistant-ui message format to our internal format
 */
function convertToThreadMessage(msg: AssistantUIMessage): ThreadMessage {
  // Extract text content
  const textParts = msg.content
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text);

  const textContent = textParts.join('');
  const createdAt = msg.createdAt ?? new Date();

  if (msg.role === 'user') {
    return {
      id: msg.id,
      role: 'user' as const,
      content: [{ type: 'text' as const, text: textContent }],
      createdAt,
      attachments: [],
      metadata: {
        custom: {},
      },
    } satisfies ThreadUserMessage;
  }

  const assistantMessage = {
    id: msg.id,
    role: 'assistant' as const,
    content: [{ type: 'text' as const, text: textContent }],
    createdAt,
    status: { type: 'complete', reason: 'stop' as const },
    metadata: {
      unstable_state: undefined as unknown,
      unstable_annotations: [],
      unstable_data: [],
      steps: [],
      custom: {},
    } as ThreadAssistantMessage['metadata'],
  } satisfies ThreadAssistantMessage;

  return assistantMessage as ThreadMessage;
}

/**
 * Convert our internal message to assistant-ui message
 */
function convertFromThreadMessage(msg: ThreadMessage): AssistantUIMessage {
  const textContent = msg.content
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');

  return {
    id: msg.id,
    role: msg.role,
    content: textContent ? [{ type: 'text', text: textContent }] : [],
    createdAt: msg.createdAt,
  };
}

export function AssistantUIRuntimeProvider({
  children,
  apiUrl,
}: AssistantUIRuntimeProviderProps): JSX.Element {
  const [messages, setMessages] = useState<AssistantUIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamingStateRef = useRef<StreamingState>(createInitialStreamingState());
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Use a ref to track latest messages to avoid stale closure issues
  const messagesRef = useRef<AssistantUIMessage[]>([]);

  // Keep messagesRef in sync with messages state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const handleStreamMessage = useCallback(
    (eventType: string, data: string) => {
      // Use messagesRef.current to avoid stale closure issues
      const result = handleSSEEvent(
        messagesRef.current,
        streamingStateRef.current,
        eventType as Parameters<typeof handleSSEEvent>[2],
        data,
      );

      setMessages(result.messages);
      streamingStateRef.current = result.streamingState;

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        closeEventSource();
      }

      // Update conversation ID if received
      if (result.streamingState.conversationId) {
        streamingStateRef.current.conversationId = result.streamingState.conversationId;
      }
    },
    [closeEventSource],
  );

  const sendRuntimeMessage = useCallback(
    async (message: AppendMessage) => {
      if (!message.content || isLoading) return;

      // Extract text content from the message
      const textContent = message.content
        .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
        .map((part) => part.text)
        .join('');

      if (!textContent.trim()) return;

      setIsLoading(true);
      setError(null);

      // Add user message - use messagesRef.current to avoid stale closure
      const userMessage = createUserMessage(textContent);
      const newMessages = [...messagesRef.current, userMessage];
      setMessages(newMessages);

      try {
        // Build SSE URL
        const url = buildSSEUrl(
          apiUrl,
          textContent,
          streamingStateRef.current.conversationId,
        );

        // Create new EventSource
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        // Set up event handlers
        eventSource.addEventListener('conversation_id', (event) => {
          handleStreamMessage('conversation_id', event.data);
        });

        eventSource.addEventListener('message', (event) => {
          handleStreamMessage('message', event.data);
        });

        eventSource.addEventListener('tool_call', (event) => {
          handleStreamMessage('tool_call', event.data);
        });

        eventSource.addEventListener('tool_result', (event) => {
          handleStreamMessage('tool_result', event.data);
        });

        eventSource.addEventListener('generative_ui', (event) => {
          handleStreamMessage('generative_ui', event.data);
        });

        eventSource.addEventListener('error', (event) => {
          if (event instanceof MessageEvent) {
            handleStreamMessage('error', event.data);
          } else {
            // Connection error
            setError('Connection lost. Please try again.');
            setIsLoading(false);
            closeEventSource();
          }
        });

        eventSource.addEventListener('done', () => {
          handleStreamMessage('done', '');
          setIsLoading(false);
          closeEventSource();
        });

        eventSource.onerror = () => {
          setError('Connection lost. Please try again.');
          setIsLoading(false);
          closeEventSource();
        };
      } catch (err) {
        console.error('[AssistantUIRuntime] Failed to send message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
        setIsLoading(false);
      }
    },
    [apiUrl, isLoading, handleStreamMessage, closeEventSource],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text) return;

      await sendRuntimeMessage({
        role: 'user',
        content: [{ type: 'text' as const, text }],
        parentId: null,
        sourceId: null,
        runConfig: undefined,
        attachments: [],
        createdAt: new Date(),
        metadata: {
          custom: {},
        },
      });
    },
    [sendRuntimeMessage],
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    streamingStateRef.current = createInitialStreamingState();
    closeEventSource();
  }, [closeEventSource]);

  const retryLastMessage = useCallback(() => {
    // Find last user message - use messagesRef.current to avoid stale closure
    const lastUserMessageIndex = [...messagesRef.current].reverse().findIndex((m) => m.role === 'user');

    if (lastUserMessageIndex === -1) return;

    const actualIndex = messagesRef.current.length - 1 - lastUserMessageIndex;
    const lastUserMessage = messagesRef.current[actualIndex];

    // Remove messages after the last user message
    const trimmedMessages = messagesRef.current.slice(0, actualIndex + 1);
    setMessages(trimmedMessages);
    setError(null);

    // Reset streaming state
    streamingStateRef.current = {
      ...createInitialStreamingState(),
      conversationId: streamingStateRef.current.conversationId,
    };

    // Retry the message - construct AppendMessage-compatible content
    const textContent = lastUserMessage.content
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('');

    void sendRuntimeMessage({
      role: 'user',
      content: [{ type: 'text' as const, text: textContent }],
      parentId: null,
      sourceId: lastUserMessage.id,
      runConfig: undefined,
      attachments: [],
      createdAt: lastUserMessage.createdAt ?? new Date(),
      metadata: {
        custom: {},
      },
    });
  }, [sendRuntimeMessage]);

  // Create assistant-ui external store runtime
  const runtime = useExternalStoreRuntime({
    isRunning: isLoading,
    messages: messages.map(convertToThreadMessage),
    onNew: sendRuntimeMessage,
    onEdit: sendRuntimeMessage,
  });

  const contextValue: AssistantUIRuntimeContextValue = {
    conversationId: streamingStateRef.current.conversationId,
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    retryLastMessage,
  };

  return (
    <AssistantUIRuntimeContext.Provider value={contextValue}>
      <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>
    </AssistantUIRuntimeContext.Provider>
  );
}

export default AssistantUIRuntimeProvider;
