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

function normalizeToolCallStatus(status: unknown): ToolCall['status'] {
  const normalizedStatus = typeof status === 'string' ? status.trim().toLowerCase() : 'running';

  switch (normalizedStatus) {
    case 'pending':
    case 'running':
    case 'completed':
    case 'failed':
      return normalizedStatus;
    default:
      return 'running';
  }
}

function normalizeToolExecutionTarget(target: unknown): ToolCall['executionTarget'] {
  if (typeof target !== 'string') {
    return undefined;
  }

  const normalizedTarget = target.trim().toLowerCase();
  if (normalizedTarget === 'frontend' || normalizedTarget === 'backend') {
    return normalizedTarget;
  }

  return undefined;
}

function normalizeToolCallPayload(payload: unknown): ToolCall | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || typeof candidate.name !== 'string') {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    arguments:
      typeof candidate.arguments === 'object' &&
      candidate.arguments !== null &&
      !Array.isArray(candidate.arguments)
        ? (candidate.arguments as Record<string, unknown>)
        : {},
    status: normalizeToolCallStatus(candidate.status),
    executionTarget: normalizeToolExecutionTarget(candidate.executionTarget),
    requiresConfirmation:
      typeof candidate.requiresConfirmation === 'boolean'
        ? candidate.requiresConfirmation
        : undefined,
  };
}

interface AssistantUiSSEHandlers {
  onEvent: (eventType: SSEEventType, data: string) => void;
  onConnectionError: () => void;
}

type AssistantUiEventSourceLike = {
  addEventListener: (type: string, listener: (event: Event) => void) => void;
  onerror: ((event: Event) => void) | null;
};

const ASSISTANT_UI_SSE_EVENT_TYPES: readonly SSEEventType[] = [
  'conversation_id',
  'message',
  'tool_call',
  'tool_result',
  'generative_ui',
  'error',
  'done',
];

export function bindAssistantUiSSEStream(
  eventSource: AssistantUiEventSourceLike,
  handlers: AssistantUiSSEHandlers,
): void {
  ASSISTANT_UI_SSE_EVENT_TYPES.forEach((eventType) => {
    eventSource.addEventListener(eventType, (event) => {
      if (eventType === 'error' && event instanceof MessageEvent) {
        handlers.onEvent('error', event.data);
        return;
      }

      if (eventType === 'error') {
        handlers.onConnectionError();
        return;
      }

      const data = eventType === 'done' ? '' : event instanceof MessageEvent ? event.data : '';
      handlers.onEvent(eventType, data);
    });
  });

  eventSource.onerror = () => {
    handlers.onConnectionError();
  };
}

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
    // Some events like 'conversation_id', 'error', and 'done' are plain text
    if (eventType === 'conversation_id' || eventType === 'error' || eventType === 'done') {
      return { type: eventType, payload: data };
    }

    if (eventType === 'message') {
      if (data.startsWith('{')) {
        const payload = JSON.parse(data);
        if (
          typeof payload === 'object' &&
          payload !== null &&
          'text' in payload &&
          typeof (payload as { text: unknown }).text === 'string'
        ) {
          return { type: eventType, payload: (payload as { text: string }).text };
        }
      }

      return { type: eventType, payload: data };
    }

    // Other events are JSON
    const payload = JSON.parse(data);

    if (eventType === 'tool_call') {
      const normalizedToolCall = normalizeToolCallPayload(payload);
      return normalizedToolCall ? { type: eventType, payload: normalizedToolCall } : null;
    }

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
    executionTarget: toolCall.executionTarget,
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

function toToolProgressStub(toolName: string): ContentPart {
  const humanizedToolName = toolName.replace(/_/g, ' ');
  return {
    type: 'text',
    text: `Checking with ${humanizedToolName}...`,
  };
}

function mergeToolLinkedGenerativeUI(
  message: AssistantUIMessage,
  directive: GenerativeUIDirective,
): AssistantUIMessage {
  if (!directive.toolCallId) {
    return addContentPartToAssistantMessage(message, transformGenerativeUI(directive));
  }

  const toolCallIndex = message.content.findIndex(
    (part): part is ToolCallContentPart =>
      part.type === 'tool-call' && part.toolCallId === directive.toolCallId,
  );

  if (toolCallIndex === -1) {
    return addContentPartToAssistantMessage(message, transformGenerativeUI(directive));
  }

  const toolCallPart = message.content[toolCallIndex] as ToolCallContentPart;
  const existingResult =
    typeof toolCallPart.result === 'object' &&
    toolCallPart.result !== null &&
    !Array.isArray(toolCallPart.result)
      ? (toolCallPart.result as Record<string, unknown>)
      : {};

  const updatedToolCall: ToolCallContentPart = {
    ...toolCallPart,
    result: {
      ...existingResult,
      __assistantUiGenerativeUi: {
        componentName: directive.name,
        props: directive.props,
      },
    },
  };

  const nextContent = [...message.content];
  nextContent[toolCallIndex] = updatedToolCall;

  return {
    ...message,
    content: nextContent,
  };
}

/**
 * Update assistant message with new text content
 */
export function updateAssistantMessageContent(
  message: AssistantUIMessage,
  newText: string,
): AssistantUIMessage {
  const lastPart = message.content.at(-1);

  if (lastPart?.type === 'text') {
    // Only extend the trailing text segment so tool/data parts remain interleaved
    return {
      ...message,
      content: [...message.content.slice(0, -1), { ...lastPart, text: newText }],
    };
  }

  // Start a new text segment after the latest structured part
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
  if (
    part.type === 'tool-call' &&
    ('result' in part || part.status === 'completed' || part.status === 'failed')
  ) {
    const toolCallIndex = message.content.findIndex(
      (p): p is ToolCallContentPart => p.type === 'tool-call' && p.toolCallId === part.toolCallId,
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
  toolContext?: string,
  frontendTools?: string,
): string {
  void message;
  void conversationId;
  void toolContext;
  void frontendTools;
  return `${baseUrl}/stream`;
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

      const updatedMessages = [...messages];

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

      // Find or create assistant message
      let assistantMessageIndex = messages.findIndex(
        (m) => m.id === streamingState.assistantMessageId,
      );

      const updatedMessages = [...messages];

      if (assistantMessageIndex === -1) {
        // Create new assistant message
        const newAssistantMessage = createAssistantMessage();
        streamingState.assistantMessageId = newAssistantMessage.id;
        assistantMessageIndex = updatedMessages.length;
        updatedMessages.push(newAssistantMessage);
      }

      const assistantMessage = updatedMessages[assistantMessageIndex];
      const needsLeadingToolStub = assistantMessage.content.length === 0;
      const messageWithLeadingStub = needsLeadingToolStub
        ? addContentPartToAssistantMessage(assistantMessage, toToolProgressStub(toolCall.name))
        : assistantMessage;

      updatedMessages[assistantMessageIndex] = addContentPartToAssistantMessage(
        messageWithLeadingStub,
        toolCallPart,
      );

      return {
        messages: updatedMessages,
        streamingState: {
          ...streamingState,
          accumulatedContent: '',
        },
      };
    }

    case 'tool_result': {
      const toolResult = event.payload as ToolResult;
      const toolResultPart = transformToolResult(toolResult);

      // Remove from pending
      streamingState.pendingToolCalls.delete(toolResult.toolCallId);

      // Find or create assistant message
      let assistantMessageIndex = messages.findIndex(
        (m) => m.id === streamingState.assistantMessageId,
      );

      const updatedMessages = [...messages];

      if (assistantMessageIndex === -1) {
        // Create new assistant message
        const newAssistantMessage = createAssistantMessage();
        streamingState.assistantMessageId = newAssistantMessage.id;
        assistantMessageIndex = updatedMessages.length;
        updatedMessages.push(newAssistantMessage);
      }

      updatedMessages[assistantMessageIndex] = addContentPartToAssistantMessage(
        updatedMessages[assistantMessageIndex],
        toolResultPart,
      );

      return {
        messages: updatedMessages,
        streamingState: {
          ...streamingState,
          accumulatedContent: '',
        },
      };
    }

    case 'generative_ui': {
      const directive = event.payload as GenerativeUIDirective;

      // Find or create assistant message
      let assistantMessageIndex = messages.findIndex(
        (m) => m.id === streamingState.assistantMessageId,
      );

      const updatedMessages = [...messages];

      if (assistantMessageIndex === -1) {
        // Create new assistant message
        const newAssistantMessage = createAssistantMessage();
        streamingState.assistantMessageId = newAssistantMessage.id;
        assistantMessageIndex = updatedMessages.length;
        updatedMessages.push(newAssistantMessage);
      }

      updatedMessages[assistantMessageIndex] = mergeToolLinkedGenerativeUI(
        updatedMessages[assistantMessageIndex],
        directive,
      );

      return {
        messages: updatedMessages,
        streamingState: {
          ...streamingState,
          accumulatedContent: '',
        },
      };
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
