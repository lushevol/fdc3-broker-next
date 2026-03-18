/**
 * SSE to Assistant-UI Adapter
 *
 * Transforms custom SSE events from the chatbot-backend into assistant-ui message format.
 */

import type {
  AssistantUIMessage,
  ContentPart,
  GenerativeUIDirective,
  SSEEventType,
  StreamingState,
  ToolCall,
  ToolResult,
  ToolCallContentPart,
} from './types';

/**
 * Generate a unique ID for messages
 */
export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create initial streaming state
 */
export function createInitialStreamingState(): StreamingState {
  return {
    conversationId: null,
    assistantMessageId: null,
    accumulatedContent: '',
    pendingToolCalls: new Map(),
  };
}

/**
 * Create a user message in assistant-ui format
 */
export function createUserMessage(content: string): AssistantUIMessage {
  return {
    id: generateMessageId(),
    role: 'user',
    content: [{ type: 'text', text: content }],
    createdAt: new Date(),
  };
}

/**
 * Create an empty assistant message for streaming
 */
export function createAssistantMessage(id?: string): AssistantUIMessage {
  return {
    id: id || generateMessageId(),
    role: 'assistant',
    content: [],
    createdAt: new Date(),
  };
}

/**
 * Parse SSE event data
 */
export function parseSSEEvent(
  eventType: SSEEventType,
  data: string,
): { type: SSEEventType; payload: unknown } | null {
  try {
    // Some events like 'message', 'conversation_id', 'error', and 'done' are plain text
    if (
      eventType === 'message' ||
      eventType === 'conversation_id' ||
      eventType === 'error' ||
      eventType === 'done'
    ) {
      return { type: eventType, payload: data };
    }

    // Other events are JSON
    const payload = JSON.parse(data);
    return { type: eventType, payload };
  } catch (error) {
    console.error(`[SSE Adapter] Failed to parse ${eventType} event:`, error);
    return null;
  }
}

/**
 * Transform tool call event to content part
 */
export function transformToolCall(toolCall: ToolCall): ContentPart {
  return {
    type: 'tool-call',
    toolCallId: toolCall.id,
    toolName: toolCall.name,
    args: toolCall.arguments,
    argsText: JSON.stringify(toolCall.arguments),
    status: toolCall.status,
    requiresConfirmation: toolCall.requiresConfirmation,
  };
}

/**
 * Transform tool result event to content part
 */
export function transformToolResult(toolResult: ToolResult): ContentPart {
  return {
    type: 'tool-call',
    toolCallId: toolResult.toolCallId,
    toolName: '',
    args: {},
    argsText: '{}',
    result: toolResult.result,
    isError: !!toolResult.error,
    error: toolResult.error,
    status: toolResult.error ? 'failed' : 'completed',
  };
}

/**
 * Transform generative UI directive to content part
 */
export function transformGenerativeUI(directive: GenerativeUIDirective): ContentPart {
  return {
    type: 'data',
    name: 'generative-ui',
    data: {
      componentName: directive.name,
      props: directive.props,
    },
  };
}

/**
 * Update assistant message with new text content
 */
export function updateAssistantMessageContent(
  message: AssistantUIMessage,
  newText: string,
): AssistantUIMessage {
  const existingTextPart = message.content.find(
    (part): part is { type: 'text'; text: string } => part.type === 'text',
  );

  if (existingTextPart) {
    // Update existing text part
    return {
      ...message,
      content: message.content.map((part) =>
        part.type === 'text' ? { ...part, text: newText } : part,
      ),
    };
  }

  // Add new text part
  return {
    ...message,
    content: [...message.content, { type: 'text', text: newText }],
  };
}

/**
 * Add content part to assistant message
 */
export function addContentPartToAssistantMessage(
  message: AssistantUIMessage,
  part: ContentPart,
): AssistantUIMessage {
  if (part.type === 'tool-call' && ('result' in part || part.status === 'completed' || part.status === 'failed')) {
    const toolCallIndex = message.content.findIndex(
      (p): p is ToolCallContentPart =>
        p.type === 'tool-call' && p.toolCallId === part.toolCallId,
    );

    if (toolCallIndex !== -1) {
      const existingToolCall = message.content[toolCallIndex] as ToolCallContentPart;
      const newContent = [...message.content];
      newContent[toolCallIndex] = {
        ...existingToolCall,
        result: part.result,
        isError: part.isError,
        error: part.error,
        status: part.status,
      };
      return {
        ...message,
        content: newContent,
      };
    }
  }

  // For other parts, append to end
  return {
    ...message,
    content: [...message.content, part],
  };
}

/**
 * Build SSE stream URL with query parameters
 */
export function buildSSEUrl(
  baseUrl: string,
  message: string,
  conversationId?: string | null,
): string {
  const streamUrl = `${baseUrl}/stream`;
  const params = new URLSearchParams({ message: message.trim() });

  if (conversationId) {
    params.set('conversationId', conversationId);
  }

  return `${streamUrl}?${params.toString()}`;
}

/**
 * Handle SSE event and update messages array
 * Returns updated messages array and streaming state
 */
export function handleSSEEvent(
  messages: AssistantUIMessage[],
  streamingState: StreamingState,
  eventType: SSEEventType,
  data: string,
): {
  messages: AssistantUIMessage[];
  streamingState: StreamingState;
  error?: string;
} {
  const event = parseSSEEvent(eventType, data);

  if (!event) {
    return { messages, streamingState };
  }

  switch (event.type) {
    case 'conversation_id': {
      return {
        messages,
        streamingState: {
          ...streamingState,
          conversationId: event.payload as string,
        },
      };
    }

    case 'message': {
      const textChunk = event.payload as string;
      const newAccumulatedContent = streamingState.accumulatedContent + textChunk;

      // Find or create assistant message
      let assistantMessageIndex = messages.findIndex(
        (m) => m.id === streamingState.assistantMessageId,
      );

      let updatedMessages = [...messages];

      if (assistantMessageIndex === -1) {
        // Create new assistant message
        const newAssistantMessage = createAssistantMessage();
        streamingState.assistantMessageId = newAssistantMessage.id;
        assistantMessageIndex = updatedMessages.length;
        updatedMessages.push(newAssistantMessage);
      }

      // Update message content
      updatedMessages[assistantMessageIndex] = updateAssistantMessageContent(
        updatedMessages[assistantMessageIndex],
        newAccumulatedContent,
      );

      return {
        messages: updatedMessages,
        streamingState: {
          ...streamingState,
          accumulatedContent: newAccumulatedContent,
        },
      };
    }

    case 'tool_call': {
      const toolCall = event.payload as ToolCall;
      const toolCallPart = transformToolCall(toolCall) as ToolCallContentPart;

      // Track pending tool call
      streamingState.pendingToolCalls.set(toolCall.id, toolCallPart);

      // Find assistant message and add tool call
      const assistantMessageIndex = messages.findIndex(
        (m) => m.id === streamingState.assistantMessageId,
      );

      if (assistantMessageIndex === -1) {
        return { messages, streamingState };
      }

      const updatedMessages = [...messages];
      updatedMessages[assistantMessageIndex] = addContentPartToAssistantMessage(
        updatedMessages[assistantMessageIndex],
        toolCallPart,
      );

      return { messages: updatedMessages, streamingState };
    }

    case 'tool_result': {
      const toolResult = event.payload as ToolResult;
      const toolResultPart = transformToolResult(toolResult);

      // Remove from pending
      streamingState.pendingToolCalls.delete(toolResult.toolCallId);

      // Find assistant message and add tool result
      const assistantMessageIndex = messages.findIndex(
        (m) => m.id === streamingState.assistantMessageId,
      );

      if (assistantMessageIndex === -1) {
        return { messages, streamingState };
      }

      const updatedMessages = [...messages];
      updatedMessages[assistantMessageIndex] = addContentPartToAssistantMessage(
        updatedMessages[assistantMessageIndex],
        toolResultPart,
      );

      return { messages: updatedMessages, streamingState };
    }

    case 'generative_ui': {
      const directive = event.payload as GenerativeUIDirective;
      const uiPart = transformGenerativeUI(directive);

      // Find assistant message and add generative UI
      const assistantMessageIndex = messages.findIndex(
        (m) => m.id === streamingState.assistantMessageId,
      );

      if (assistantMessageIndex === -1) {
        return { messages, streamingState };
      }

      const updatedMessages = [...messages];
      updatedMessages[assistantMessageIndex] = addContentPartToAssistantMessage(
        updatedMessages[assistantMessageIndex],
        uiPart,
      );

      return { messages: updatedMessages, streamingState };
    }

    case 'error': {
      return {
        messages,
        streamingState,
        error: event.payload as string,
      };
    }

    case 'done': {
      // Reset streaming state for next message
      return {
        messages,
        streamingState: {
          ...streamingState,
          assistantMessageId: null,
          accumulatedContent: '',
          pendingToolCalls: new Map(),
        },
      };
    }

    default:
      return { messages, streamingState };
  }
}
