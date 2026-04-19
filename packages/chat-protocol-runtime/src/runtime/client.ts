import type {
  ChatAssistantMessage,
  ChatFinishReason,
  ChatMessage,
  ChatRunRequest,
  ChatStreamFrame,
  ChatToolCallPart,
  ChatToolDescriptor,
  ChatToolMessage,
} from '@fm/chat-protocol-contract';
import type { ThreadMessage } from '@assistant-ui/react';
import { createProtocolStreamAdapter } from './createProtocolStreamAdapter';
import type { ToolkitBridge } from './toolkitBridge';

type ToolResultContentPartLike = {
  type: 'tool-result';
  toolCallId: string;
  result?: unknown;
  output?: unknown;
};

type ToolThreadMessageLike = {
  id: string;
  role: 'tool';
  content: readonly ToolResultContentPartLike[];
  metadata: {
    custom: Record<string, unknown>;
  };
};

type ProtocolCompatibleThreadMessage = ThreadMessage | ToolThreadMessageLike;

export type BuildChatProtocolRequestOptions = {
  conversationId: string;
  messages: ChatMessage[];
  tools?: ChatToolDescriptor[];
  metadata?: ChatRunRequest['metadata'];
  runId?: string | null;
  trigger?: ChatRunRequest['trigger'];
  context?: ChatRunRequest['context'];
};

export type StreamProtocolRunOptions = {
  request: ChatRunRequest;
  url: string;
  fetch?: typeof globalThis.fetch;
  onFrame?: (frame: ChatStreamFrame) => void;

  /**
   * @deprecated Use toolkitBridge instead for unified tool execution.
   * This will be removed in v3.0.0.
   * @see packages/chat-protocol-runtime/README.md
   */
  resolveFrontendTool?: (
    toolCall: ChatToolCallPart,
    request: ChatRunRequest,
  ) => Promise<Record<string, unknown>> | Record<string, unknown>;

  /**
   * Toolkit bridge for unified frontend tool execution.
   * This allows the protocol to execute tools using the app's toolkit,
   * eliminating the need for a separate resolveFrontendTool callback.
   *
   * @example
   * ```typescript
   * const toolkitBridge = createToolkitBridge(toolkit);
   * yield* streamProtocolRun({ request, url, toolkitBridge });
   * ```
   */
  toolkitBridge?: ToolkitBridge;
};

export type BuildHumanToolResumeRequestOptions = {
  conversationId: string;
  messages: ChatMessage[];
  toolCallId: string;
  toolName: string;
  result: Record<string, unknown>;
  runId?: string | null;
  tools?: ChatToolDescriptor[];
  metadata?: ChatRunRequest['metadata'];
  context?: ChatRunRequest['context'];
};

function getTextParts(message: ThreadMessage): string[] {
  return message.content
    .filter(
      (part): part is Extract<ThreadMessage['content'][number], { type: 'text'; text: string }> =>
        part.type === 'text',
    )
    .map((part) => part.text);
}

function isToolThreadMessageLike(
  message: ProtocolCompatibleThreadMessage,
): message is ToolThreadMessageLike {
  return message.role === 'tool';
}

function getToolSource(
  part: Extract<ThreadMessage['content'][number], { type: 'tool-call' }>,
): ChatToolCallPart['source'] {
  const source = (part as { source?: unknown }).source;
  if (source === 'frontend' || source === 'backend' || source === 'human' || source === 'mcp') {
    return source;
  }

  const candidate = (part as { executionTarget?: unknown }).executionTarget;
  return candidate === 'frontend' ? 'frontend' : 'backend';
}

function toRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function toErrorMessage(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  return undefined;
}

function getToolResultOutput(part: ToolResultContentPartLike): Record<string, unknown> | undefined {
  return toRecord(part.output) ?? toRecord(part.result);
}

export function toProtocolMessages(
  messages: readonly ProtocolCompatibleThreadMessage[],
): ChatMessage[] {
  const protocolMessages: ChatMessage[] = [];

  for (const message of messages) {
    if (message.role === 'user' || message.role === 'system') {
      const parts = getTextParts(message).map((text) => ({
        type: 'text' as const,
        text,
      }));

      if (parts.length === 0) {
        continue;
      }

      protocolMessages.push({
        id: message.id,
        role: message.role,
        parts,
        metadata: message.metadata.custom,
      });
      continue;
    }

    if (message.role === 'assistant') {
      const parts: ChatAssistantMessage['parts'] = [];

      for (const part of message.content) {
        if (part.type === 'text') {
          parts.push({
            type: 'text',
            text: part.text,
          });
          continue;
        }

        if (part.type === 'tool-call') {
          const error = toErrorMessage((part as { error?: unknown }).error);
          const output = toRecord((part as { result?: unknown }).result);
          parts.push({
            type: 'tool-call',
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            source: getToolSource(part),
            state:
              (part as { result?: unknown }).result !== undefined
                ? (part as { isError?: boolean }).isError
                  ? 'output-error'
                  : 'output-available'
                : 'input-available',
            input: part.args as Record<string, unknown>,
            ...(output ? { output } : {}),
            ...(error !== undefined ? { error } : {}),
          });
        }
      }

      if (parts.length === 0) {
        continue;
      }

      protocolMessages.push({
        id: message.id,
        role: 'assistant',
        parts,
        metadata: message.metadata.custom,
      });
      continue;
    }

    if (isToolThreadMessageLike(message)) {
      const toolResultPart = message.content.find(
        (part): part is ToolResultContentPartLike => part.type === 'tool-result',
      );

      if (!toolResultPart) {
        continue;
      }

      const matchingAssistantTool = [...messages]
        .reverse()
        .filter((candidate) => candidate.role === 'assistant')
        .flatMap((candidate) => candidate.content)
        .find(
          (
            candidate,
          ): candidate is Extract<
            ThreadMessage['content'][number],
            { type: 'tool-call'; toolCallId: string; toolName: string }
          > => candidate.type === 'tool-call' && candidate.toolCallId === toolResultPart.toolCallId,
        );

      const toolMessage: ChatToolMessage = {
        id: message.id,
        role: 'tool',
        toolCallId: toolResultPart.toolCallId,
        toolName: matchingAssistantTool?.toolName ?? 'unknown',
        parts: [
          {
            type: 'tool-result',
            toolCallId: toolResultPart.toolCallId,
            output: getToolResultOutput(toolResultPart) ?? {},
          },
        ],
        metadata: message.metadata.custom,
      };

      protocolMessages.push(toolMessage);
    }
  }

  return protocolMessages;
}

function extractDataLines(event: string): string[] {
  return event
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) =>
      line.startsWith('data: ') ? line.slice('data: '.length) : line.slice('data:'.length),
    );
}

export async function* parseSseFrames(response: Response): AsyncGenerator<ChatStreamFrame, void> {
  if (!response.ok || !response.body) {
    throw new Error(`Chat protocol request failed with status ${response.status}`);
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const dataLines = extractDataLines(event);

      if (dataLines.length === 0) {
        continue;
      }

      yield JSON.parse(dataLines.join('\n')) as ChatStreamFrame;
    }
  }

  const finalEvents = buffer.split('\n\n').filter(Boolean);
  for (const event of finalEvents) {
    const dataLines = extractDataLines(event);

    if (dataLines.length === 0) {
      continue;
    }

    yield JSON.parse(dataLines.join('\n')) as ChatStreamFrame;
  }
}

export function buildChatProtocolRequest({
  conversationId,
  messages,
  tools,
  metadata,
  runId,
  trigger = 'submit-message',
  context,
}: BuildChatProtocolRequestOptions): ChatRunRequest {
  return {
    conversationId,
    ...(runId !== undefined ? { runId } : {}),
    trigger,
    ...(tools || context ? { context: { ...context, ...(tools ? { tools } : {}) } } : {}),
    messages,
    ...(metadata ? { metadata } : {}),
  };
}

function findPendingToolBySource(
  parts: readonly ChatAssistantMessage['parts'][number][],
  source: ChatToolCallPart['source'],
): ChatToolCallPart | undefined {
  return [...parts]
    .reverse()
    .find(
      (part): part is ChatToolCallPart =>
        part.type === 'tool-call' &&
        part.source === source &&
        (part.state === 'input-available' || part.state === 'awaiting-human') &&
        !part.output,
    );
}

function createToolResultMessage(toolCall: ChatToolCallPart): ChatToolMessage {
  return {
    id: `${toolCall.toolCallId}-tool-result`,
    role: 'tool',
    toolCallId: toolCall.toolCallId,
    toolName: toolCall.toolName,
    parts: [
      {
        type: 'tool-result',
        toolCallId: toolCall.toolCallId,
        output: toolCall.output ?? {},
      },
    ],
    metadata: {},
  };
}

function createToolResultMessageFromResult(options: {
  toolCallId: string;
  toolName: string;
  result: Record<string, unknown>;
}): ChatToolMessage {
  return {
    id: `${options.toolCallId}-tool-result`,
    role: 'tool',
    toolCallId: options.toolCallId,
    toolName: options.toolName,
    parts: [
      {
        type: 'tool-result',
        toolCallId: options.toolCallId,
        output: options.result,
      },
    ],
    metadata: {},
  };
}

function hasToolResultMessage(messages: readonly ChatMessage[], toolCallId: string): boolean {
  return messages.some(
    (message): message is ChatToolMessage =>
      message.role === 'tool' && message.toolCallId === toolCallId,
  );
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const entries = Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`);
    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function getFrontendToolExecutionKey(toolCall: ChatToolCallPart): string {
  return `${toolCall.toolName}:${stableSerialize(toolCall.input)}`;
}

export function buildHumanToolResumeRequest({
  conversationId,
  messages,
  toolCallId,
  toolName,
  result,
  runId,
  tools,
  metadata,
  context,
}: BuildHumanToolResumeRequestOptions): ChatRunRequest {
  return {
    conversationId,
    ...(runId !== undefined ? { runId } : {}),
    trigger: 'submit-tool-result',
    ...(tools || context ? { context: { ...context, ...(tools ? { tools } : {}) } } : {}),
    messages: [
      ...messages,
      createToolResultMessageFromResult({
        toolCallId,
        toolName,
        result,
      }),
    ],
    ...(metadata ? { metadata } : {}),
  };
}

async function postRunRequest(
  request: ChatRunRequest,
  url: string,
  fetchFn: typeof globalThis.fetch,
): Promise<Response> {
  return fetchFn(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

export async function* streamProtocolRun({
  request,
  url,
  fetch = globalThis.fetch,
  onFrame,
  resolveFrontendTool,
  toolkitBridge,
}: StreamProtocolRunOptions): AsyncGenerator<ChatStreamFrame, void> {
  if (!fetch) {
    throw new Error('Fetch implementation is required for streamProtocolRun');
  }

  // Deprecation warning for resolveFrontendTool
  if (resolveFrontendTool && !toolkitBridge) {
    console.warn(
      '[@fm/chat-protocol-runtime] Deprecation Warning: ' +
        'resolveFrontendTool is deprecated and will be removed in v3.0.0. ' +
        'Use toolkitBridge for unified tool execution. ' +
        'See migration guide in chat-protocol-runtime/README.md',
    );
  }

  let nextRequest: ChatRunRequest | null = request;
  let currentRunId = request.runId ?? null;
  const executedFrontendTools = new Set<string>();

  while (nextRequest) {
    const response = await postRunRequest(
      {
        ...nextRequest,
        ...(currentRunId ? { runId: currentRunId } : {}),
      },
      url,
      fetch,
    );

    let finishReason: ChatFinishReason | null = null;
    const adapter = createProtocolStreamAdapter();

    for await (const frame of parseSseFrames(response)) {
      adapter.applyFrame(frame);
      onFrame?.(frame);

      if (frame.type === 'start' && frame.runId) {
        currentRunId = frame.runId;
      }

      if (frame.type === 'finish') {
        finishReason = frame.finishReason;
      }

      yield frame;
    }

    if (finishReason !== 'tool-calls') {
      break;
    }

    const assistantMessage = adapter.getMessage();
    const pendingFrontendTool = findPendingToolBySource(assistantMessage.content, 'frontend');

    if (!pendingFrontendTool) {
      break;
    }

    let output: Record<string, unknown>;

    const toolExecutionKey = getFrontendToolExecutionKey(pendingFrontendTool);
    const alreadyResolvedInHistory =
      hasToolResultMessage(nextRequest.messages, pendingFrontendTool.toolCallId) ||
      executedFrontendTools.has(toolExecutionKey);

    if (alreadyResolvedInHistory) {
      yield {
        type: 'tool-output-error',
        toolCallId: pendingFrontendTool.toolCallId,
        error:
          `Frontend tool "${pendingFrontendTool.toolName}" was already resolved earlier in this run. ` +
          'Refusing to execute it again.',
        source: 'frontend',
      } as ChatStreamFrame;
      break;
    }

    // NEW: Prefer toolkitBridge over resolveFrontendTool
    if (toolkitBridge) {
      try {
        output = await toolkitBridge.executeTool(
          pendingFrontendTool.toolName,
          pendingFrontendTool.input,
        );
      } catch (error) {
        // Yield error frame and break
        yield {
          type: 'tool-output-error',
          toolCallId: pendingFrontendTool.toolCallId,
          error: error instanceof Error ? error.message : String(error),
          source: 'frontend',
        } as ChatStreamFrame;
        break;
      }
    }
    // DEPRECATED: Fallback to resolveFrontendTool
    else if (resolveFrontendTool) {
      output = await resolveFrontendTool(pendingFrontendTool, nextRequest);
    } else {
      // Neither mechanism available - error
      throw new Error(
        'Frontend tool detected but no execution mechanism available. ' +
          'Provide either toolkitBridge (recommended) or resolveFrontendTool (deprecated).',
      );
    }

    executedFrontendTools.add(toolExecutionKey);

    const resolvedTool: ChatToolCallPart = {
      ...pendingFrontendTool,
      state: 'output-available',
      output,
    };

    const resumedAssistantMessage: ChatAssistantMessage = {
      id: assistantMessage.id,
      role: 'assistant',
      parts: assistantMessage.content.map((part) => {
        if (part.type === 'tool-call' && part.toolCallId === resolvedTool.toolCallId) {
          return resolvedTool;
        }
        return part;
      }),
      metadata: assistantMessage.metadata,
    };

    yield {
      type: 'tool-output-available',
      toolCallId: resolvedTool.toolCallId,
      output,
      source: 'frontend',
    } as ChatStreamFrame;

    // Apply the frame to adapter so message is updated with output (prevents re-execution)
    adapter.applyFrame({
      type: 'tool-output-available',
      toolCallId: resolvedTool.toolCallId,
      output,
      source: 'frontend',
    });

    nextRequest = {
      conversationId: request.conversationId,
      runId: currentRunId,
      trigger: 'submit-tool-result',
      context: request.context,
      messages: [
        ...nextRequest.messages,
        resumedAssistantMessage,
        createToolResultMessage(resolvedTool),
      ],
      metadata: request.metadata,
    };
  }
}
