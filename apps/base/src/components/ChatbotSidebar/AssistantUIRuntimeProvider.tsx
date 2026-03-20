/**
 * Assistant-UI Runtime Provider
 *
 * This provider integrates assistant-ui's ThreadRuntime with our SSE backend.
 * It uses assistant-ui's ExternalStoreAdapter pattern to bridge our custom backend.
 */

import React, { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';
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
  bindAssistantUiSSEStream,
  createUserMessage,
  createInitialStreamingState,
  buildSSEUrl,
  handleSSEEvent,
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
export function convertToThreadMessage(msg: AssistantUIMessage): ThreadMessage {
  const createdAt = msg.createdAt ?? new Date();

  if (msg.role === 'user') {
    const textParts = msg.content
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text);

    return {
      id: msg.id,
      role: 'user' as const,
      content: [{ type: 'text' as const, text: textParts.join('') }],
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
    content: msg.content as unknown as ThreadAssistantMessage['content'],
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

export function AssistantUIRuntimeProvider({
  children,
  apiUrl,
}: AssistantUIRuntimeProviderProps): JSX.Element {
  const [messages, setMessages] = useState<AssistantUIMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamingStateRef = useRef<StreamingState>(createInitialStreamingState());
  const eventSourceRef = useRef<EventSource | null>(null);
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

      setConversationId(result.streamingState.conversationId);
    },
    [closeEventSource],
  );

  const streamMessage = useCallback(
    async (
      message: AppendMessage,
      options?: {
        appendUserMessage?: boolean;
      },
    ) => {
      if (!message.content || isLoading) return;

      const textContent = message.content
        .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
        .map((part) => part.text)
        .join('');

      if (!textContent.trim()) return;

      closeEventSource();
      setIsLoading(true);
      setError(null);

      if (options?.appendUserMessage !== false) {
        const userMessage = createUserMessage(textContent);
        setMessages([...messagesRef.current, userMessage]);
      }

      try {
        const url = buildSSEUrl(apiUrl, textContent, streamingStateRef.current.conversationId);
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        bindAssistantUiSSEStream(eventSource, {
          onEvent: (eventType, data) => {
            handleStreamMessage(eventType, data);

            if (eventType === 'done') {
              setIsLoading(false);
              closeEventSource();
            }
          },
          onConnectionError: () => {
            setError('Connection lost. Please try again.');
            setIsLoading(false);
            closeEventSource();
          },
        });
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

      await streamMessage({
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
    [streamMessage],
  );

  const clearConversation = useCallback(() => {
    closeEventSource();
    setMessages([]);
    setConversationId(null);
    setError(null);
    setIsLoading(false);
    streamingStateRef.current = createInitialStreamingState();
  }, [closeEventSource]);

  const retryLastMessage = useCallback(() => {
    // Find last user message - use messagesRef.current to avoid stale closure
    const lastUserMessageIndex = [...messagesRef.current]
      .reverse()
      .findIndex((m) => m.role === 'user');

    if (lastUserMessageIndex === -1) return;

    const actualIndex = messagesRef.current.length - 1 - lastUserMessageIndex;
    const lastUserMessage = messagesRef.current[actualIndex];

    // Remove messages after the last user message
    const trimmedMessages = messagesRef.current.slice(0, actualIndex + 1);
    closeEventSource();
    setMessages(trimmedMessages);
    setError(null);
    setIsLoading(false);

    // Reset streaming state
    streamingStateRef.current = {
      ...createInitialStreamingState(),
      conversationId: streamingStateRef.current.conversationId,
    };
    setConversationId(streamingStateRef.current.conversationId);

    // Retry the message - construct AppendMessage-compatible content
    const textContent = lastUserMessage.content
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((part) => part.text)
      .join('');

    void streamMessage(
      {
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
      },
      { appendUserMessage: false },
    );
  }, [closeEventSource, streamMessage]);

  // Create assistant-ui external store runtime
  const runtime = useExternalStoreRuntime({
    isRunning: isLoading,
    messages: messages.map(convertToThreadMessage),
    onNew: streamMessage,
    onEdit: streamMessage,
  });

  const contextValue: AssistantUIRuntimeContextValue = {
    conversationId,
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
