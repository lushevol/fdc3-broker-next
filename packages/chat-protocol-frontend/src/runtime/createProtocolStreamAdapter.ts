import type {
  ChatActionPart,
  ChatAssistantPart,
  ChatStreamFrame,
  ChatToolInputAvailableFrame,
  ChatToolInputDeltaFrame,
  ChatToolInputStartFrame,
  ChatToolOutputAvailableFrame,
  ChatToolOutputErrorFrame,
  ChatToolCallPart,
} from '@fm/chat-protocol-contract';
import type {
  ChatModelAdapter,
  ChatModelRunOptions,
  ChatModelRunResult,
  MessageStatus,
  ThreadAssistantMessagePart,
  ThreadMessage,
} from '@assistant-ui/react';
import type { ReadonlyJSONObject } from 'assistant-stream/utils';

export type ProtocolAssistantContentPart = ChatAssistantPart;

export type ProtocolAssistantMessage = {
  id: string;
  role: 'assistant';
  createdAt: Date;
  content: readonly ProtocolAssistantContentPart[];
  status: MessageStatus;
  metadata: Record<string, unknown>;
};

export type ProtocolStreamAdapter = {
  getMessage(): ProtocolAssistantMessage;
  reset(message?: ProtocolAssistantMessage): void;
  applyFrame(frame: ChatStreamFrame): ProtocolAssistantMessage;
  applyFrames(frames: readonly ChatStreamFrame[]): ProtocolAssistantMessage;
  toThreadMessage(): ThreadMessage;
};

type ToolState = {
  toolName: string;
  executionTarget: 'backend' | 'frontend';
  inputText: string;
};

type StreamState = {
  toolStates: Map<string, ToolState>;
  textPartIndexes: Map<string, number>;
};

const TEXT_PART_INDEXES_KEY = '__protocolTextPartIndexes';

const DEFAULT_STATUS: MessageStatus = {
  type: 'running',
};

function createTextPart(_partId: string | undefined, text: string) {
  return { type: 'text', text } as const;
}

function createAssistantMessage(id = 'msg_asst_1'): ProtocolAssistantMessage {
  return {
    id,
    role: 'assistant',
    createdAt: new Date(),
    content: [],
    status: DEFAULT_STATUS,
    metadata: {},
  };
}

function readTextPartIndexes(metadata: Record<string, unknown>): Map<string, number> {
  const raw = metadata[TEXT_PART_INDEXES_KEY];
  if (!isObjectRecord(raw)) {
    return new Map<string, number>();
  }

  const entries = Object.entries(raw).filter(
    (entry): entry is [string, number] => typeof entry[1] === 'number',
  );

  return new Map<string, number>(entries);
}

function writeTextPartIndexes(
  metadata: Record<string, unknown>,
  textPartIndexes: Map<string, number>,
): Record<string, unknown> {
  return {
    ...metadata,
    [TEXT_PART_INDEXES_KEY]: Object.fromEntries(textPartIndexes.entries()),
  };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  if (!isObjectRecord(value)) {
    return { value };
  }

  return value;
}

function stringifyInput(input: unknown): string {
  try {
    return JSON.stringify(input);
  } catch {
    return '';
  }
}

function parseBufferedInput(buffer: string): Record<string, unknown> {
  if (!buffer) {
    return {};
  }

  try {
    const parsed = JSON.parse(buffer);
    return normalizeRecord(parsed);
  } catch {
    return { text: buffer };
  }
}

function findToolCallIndex(content: readonly ProtocolAssistantContentPart[], toolCallId: string): number {
  return content.findIndex(
    (part): part is ChatToolCallPart => part.type === 'tool-call' && part.toolCallId === toolCallId,
  );
}

function findLatestTextIndex(content: readonly ProtocolAssistantContentPart[]): number {
  for (let index = content.length - 1; index >= 0; index -= 1) {
    if (content[index]?.type === 'text') {
      return index;
    }
  }

  return -1;
}

function updateTextContent(
  content: readonly ProtocolAssistantContentPart[],
  textPartIndexes: Map<string, number>,
  partId: string | undefined,
  text: string,
  append: boolean,
): ProtocolAssistantContentPart[] {
  const storedIndex = partId ? textPartIndexes.get(partId) : undefined;
  const index =
    storedIndex !== undefined && content[storedIndex]?.type === 'text'
      ? storedIndex
      : partId
        ? -1
        : findLatestTextIndex(content);
  if (index === -1) {
    const nextContent = [...content, createTextPart(partId, text)];
    if (partId) {
      textPartIndexes.set(partId, nextContent.length - 1);
    }
    return nextContent;
  }

  const nextContent = [...content];
  const current = nextContent[index];
  if (current?.type !== 'text') {
    return [...content, createTextPart(partId, text)];
  }

  nextContent[index] = {
    ...current,
    text: append ? `${current.text}${text}` : text,
  };
  if (partId) {
    textPartIndexes.set(partId, index);
  }
  return nextContent;
}

function ensureToolCallPart(
  content: readonly ProtocolAssistantContentPart[],
  frame: ChatToolInputStartFrame | ChatToolInputDeltaFrame | ChatToolInputAvailableFrame | ChatToolOutputAvailableFrame | ChatToolOutputErrorFrame,
  toolState: ToolState,
): ProtocolAssistantContentPart[] {
  const index = findToolCallIndex(content, frame.toolCallId);
  const nextContent = [...content];
  const basePart: ChatToolCallPart = {
    type: 'tool-call',
    toolCallId: frame.toolCallId,
    toolName: toolState.toolName,
    executionTarget: toolState.executionTarget,
    state: 'input-streaming',
    input: {},
  };

  const currentPart = index === -1 ? basePart : (nextContent[index] as ChatToolCallPart);

  if (frame.type === 'tool-input-delta') {
    const nextToolPart: ChatToolCallPart = {
      ...currentPart,
      toolName: toolState.toolName,
      executionTarget: toolState.executionTarget,
      state: 'input-streaming',
      input: parseBufferedInput(toolState.inputText),
    };

    if (index === -1) {
      nextContent.push(nextToolPart);
    } else {
      nextContent[index] = nextToolPart;
    }

    return nextContent;
  }

  if (frame.type === 'tool-input-available') {
    const nextToolPart: ChatToolCallPart = {
      ...currentPart,
      toolName: toolState.toolName,
      executionTarget: toolState.executionTarget,
      state: 'input-available',
      input: normalizeRecord(frame.input),
    };

    if (index === -1) {
      nextContent.push(nextToolPart);
    } else {
      nextContent[index] = nextToolPart;
    }

    return nextContent;
  }

  if (frame.type === 'tool-output-available') {
    const nextToolPart: ChatToolCallPart = {
      ...currentPart,
      toolName: toolState.toolName,
      executionTarget: toolState.executionTarget,
      state: 'output-available',
      input: currentPart.input,
      output: normalizeRecord(frame.output),
    };

    if (index === -1) {
      nextContent.push(nextToolPart);
    } else {
      nextContent[index] = nextToolPart;
    }

    return nextContent;
  }

  const nextToolPart: ChatToolCallPart =
    frame.type === 'tool-output-error'
      ? {
          ...currentPart,
          toolName: toolState.toolName,
          executionTarget: toolState.executionTarget,
          state: 'output-error',
          input: currentPart.input,
          error: frame.error,
        }
      : {
          ...currentPart,
          toolName: toolState.toolName,
          executionTarget: toolState.executionTarget,
          state: 'input-streaming',
          input: currentPart.input,
        };

  if (index === -1) {
    nextContent.push(nextToolPart);
  } else {
    nextContent[index] = nextToolPart;
  }

  return nextContent;
}

function updateMessageStatus(
  current: MessageStatus,
  frame: ChatStreamFrame,
): MessageStatus {
  if (frame.type === 'finish') {
    if (frame.finishReason === 'tool-calls') {
      return { type: 'requires-action', reason: 'tool-calls' };
    }

    if (frame.finishReason === 'action-required') {
      return { type: 'requires-action', reason: 'interrupt' };
    }

    if (frame.finishReason === 'stop') {
      return { type: 'complete', reason: 'stop' };
    }

    return {
      type: 'incomplete',
      reason: 'error',
    };
  }

  if (
    frame.type === 'tool-input-start' ||
    frame.type === 'tool-input-delta' ||
    frame.type === 'tool-input-available'
  ) {
    return { type: 'requires-action', reason: 'tool-calls' };
  }

  if (frame.type === 'action-required') {
    return { type: 'requires-action', reason: 'interrupt' };
  }

  if (frame.type === 'tool-output-error' || frame.type === 'error') {
    return {
      type: 'incomplete',
      reason: 'error',
      error: frame.type === 'error' ? frame.message : frame.error,
    };
  }

  return current;
}

function upsertStepPart(
  content: readonly ProtocolAssistantContentPart[],
  stepId: string,
  status: 'running' | 'completed' | 'failed',
  title?: string,
  detail?: string,
): ProtocolAssistantContentPart[] {
  const nextContent = [...content];
  const index = nextContent.findIndex(
    (part) =>
      (part.type === 'step-start' || part.type === 'step') &&
      part.stepId === stepId,
  );
  const existingPart = index !== -1 ? nextContent[index] : null;
  const existingTitle =
    existingPart && (existingPart.type === 'step-start' || existingPart.type === 'step')
      ? existingPart.title
      : undefined;

  const nextPart = {
    type: 'step',
    stepId,
    title: title ?? existingTitle ?? stepId,
    status,
    ...(detail ? { detail } : {}),
  } as const;

  if (index === -1) {
    nextContent.push(nextPart);
  } else {
    nextContent[index] = nextPart;
  }

  return nextContent;
}

function convertToThreadAssistantPart(part: ProtocolAssistantContentPart): ThreadAssistantMessagePart {
  switch (part.type) {
    case 'text':
      return { type: 'text', text: part.text };
    case 'reasoning-summary':
      return { type: 'reasoning', text: part.text };
    case 'plan':
      return {
        type: 'data',
        name: 'plan',
        data: { planId: part.planId, summary: part.summary },
      };
    case 'step-start':
      return {
        type: 'data',
        name: 'step-start',
        data: { stepId: part.stepId, title: part.title },
      };
    case 'step':
      return {
        type: 'data',
        name: 'step',
        data: {
          stepId: part.stepId,
          title: part.title,
          status: part.status,
          detail: part.detail,
        },
      };
    case 'tool-call':
      return {
        type: 'tool-call',
        toolCallId: part.toolCallId,
        toolName: part.toolName,
        args: part.input as ReadonlyJSONObject,
        argsText: stringifyInput(part.input),
        result: part.output,
        isError: part.state === 'output-error',
        ...(part.error ? { artifact: { error: part.error } } : {}),
      };
    case 'tool-result':
      return {
        type: 'data',
        name: 'tool-result',
        data: { toolCallId: part.toolCallId, output: part.output, error: part.error },
      };
    case 'card':
      return {
        type: 'data',
        name: part.cardType,
        data: part.props,
      };
    case 'action':
      return {
        type: 'data',
        name: 'action',
        data: {
          actionId: part.actionId,
          actionType: part.actionType,
          status: part.status,
          title: part.title,
          description: part.description,
          toolCallId: part.toolCallId,
          options: part.options,
        },
      };
    case 'error':
      return {
        type: 'data',
        name: 'error',
        data: {
          message: part.message,
          code: part.code,
        },
      };
    default: {
      return {
        type: 'data',
        name: 'unknown',
        data: part as Record<string, unknown>,
      };
    }
  }
}

function toThreadMessage(message: ProtocolAssistantMessage): ThreadMessage {
  return {
    id: message.id,
    role: 'assistant',
    createdAt: message.createdAt,
    status: message.status,
    metadata: {
      custom: message.metadata,
      unstable_state: null,
      unstable_annotations: [],
      unstable_data: [],
      steps: [],
    },
    content: message.content.map(convertToThreadAssistantPart),
  };
}

function createStreamState(message?: ProtocolAssistantMessage): StreamState {
  const toolStates = new Map<string, ToolState>();

  if (message) {
    for (const part of message.content) {
      if (part.type === 'tool-call') {
        toolStates.set(part.toolCallId, {
          toolName: part.toolName,
          executionTarget: part.executionTarget,
          inputText: stringifyInput(part.input),
        });
      }
    }
  }

  return {
    toolStates,
    textPartIndexes: message ? readTextPartIndexes(message.metadata) : new Map<string, number>(),
  };
}

function applyFrame(
  message: ProtocolAssistantMessage,
  frame: ChatStreamFrame,
  state: StreamState,
): ProtocolAssistantMessage {
  let nextContent: ProtocolAssistantContentPart[] = [...message.content];
  const nextStatus = updateMessageStatus(message.status, frame);

  switch (frame.type) {
    case 'reasoning-summary': {
      nextContent = [...nextContent, { type: 'reasoning-summary', text: frame.text }];
      break;
    }
    case 'plan-available': {
      nextContent = [
        ...nextContent,
        {
          type: 'plan',
          planId: frame.planId,
          summary: frame.summary,
        },
      ];
      break;
    }
    case 'start-step': {
      nextContent = [
        ...nextContent,
        {
          type: 'step-start',
          stepId: frame.stepId,
          title: frame.title,
        },
      ];
      break;
    }
    case 'step-status': {
      nextContent = upsertStepPart(
        nextContent,
        frame.stepId,
        frame.status === 'pending' ? 'running' : frame.status,
        undefined,
        frame.detail,
      );
      break;
    }
    case 'finish-step': {
      nextContent = upsertStepPart(
        nextContent,
        frame.stepId,
        frame.status ?? 'completed',
      );
      break;
    }
    case 'text-start': {
      nextContent = updateTextContent(nextContent, state.textPartIndexes, frame.partId, '', false);
      break;
    }
    case 'text-delta': {
      nextContent = updateTextContent(nextContent, state.textPartIndexes, frame.partId, frame.delta, true);
      break;
    }
    case 'text-end':
      break;
    case 'tool-input-start': {
      state.toolStates.set(frame.toolCallId, {
        toolName: frame.toolName,
        executionTarget: frame.executionTarget ?? 'backend',
        inputText: '',
      });
      nextContent = ensureToolCallPart(
        nextContent,
        frame,
        state.toolStates.get(frame.toolCallId)!,
      );
      break;
    }
    case 'tool-input-delta': {
      const current = state.toolStates.get(frame.toolCallId) ?? {
        toolName: '',
        executionTarget: 'backend' as const,
        inputText: '',
      };
      const updated = {
        ...current,
        inputText: `${current.inputText}${frame.delta}`,
      };
      state.toolStates.set(frame.toolCallId, updated);
      nextContent = ensureToolCallPart(nextContent, frame, updated);
      break;
    }
    case 'tool-input-available': {
      const current = state.toolStates.get(frame.toolCallId) ?? {
        toolName: '',
        executionTarget: 'backend' as const,
        inputText: '',
      };
      const updated = current;
      state.toolStates.set(frame.toolCallId, updated);
      nextContent = ensureToolCallPart(nextContent, frame, updated);
      break;
    }
    case 'tool-output-available': {
      const current = state.toolStates.get(frame.toolCallId) ?? {
        toolName: '',
        executionTarget: 'backend' as const,
        inputText: '',
      };
      nextContent = ensureToolCallPart(nextContent, frame, current);
      break;
    }
    case 'tool-output-error': {
      const current = state.toolStates.get(frame.toolCallId) ?? {
        toolName: '',
        executionTarget: 'backend' as const,
        inputText: '',
      };
      nextContent = ensureToolCallPart(nextContent, frame, current);
      break;
    }
    case 'action-required': {
      nextContent = [
        ...nextContent,
        {
          type: 'action',
          actionId: frame.actionId,
          actionType: frame.actionType,
          status: 'pending',
          title: frame.title,
          description: frame.description,
          options: frame.options,
          toolCallId: undefined,
        },
      ];
      break;
    }
    case 'action-resolved': {
      const actionIndex = nextContent.findIndex(
        (part): part is ChatActionPart => part.type === 'action' && part.actionId === frame.actionId,
      );
      if (actionIndex !== -1) {
        const currentAction = nextContent[actionIndex] as ChatActionPart;
        nextContent[actionIndex] = {
          ...currentAction,
          status: frame.status,
        };
      }
      break;
    }
    case 'ui-part-available': {
      nextContent = [
        ...nextContent,
        {
          type: 'card',
          cardType: frame.cardType,
          props: frame.props,
        },
      ];
      break;
    }
    case 'finish':
      break;
    case 'error': {
      nextContent = [
        ...nextContent,
        {
          type: 'error',
          message: frame.message,
          code: frame.code,
        },
      ];
      break;
    }
    default:
      break;
  }

  return {
    ...message,
    content: nextContent,
    status: nextStatus,
    metadata: writeTextPartIndexes(message.metadata, state.textPartIndexes),
  };
}

export function applyFrameSequenceToMessage(
  frames: readonly ChatStreamFrame[],
  initialMessage?: ProtocolAssistantMessage,
): ProtocolAssistantMessage {
  let message = initialMessage ?? createAssistantMessage();
  const state = createStreamState(message);

  for (const frame of frames) {
    message = applyFrame(message, frame, state);
  }

  return message;
}

export function createProtocolStreamAdapter(
  initialMessage?: ProtocolAssistantMessage,
): ProtocolStreamAdapter {
  let message = initialMessage ?? createAssistantMessage();
  let state = createStreamState(message);

  return {
    getMessage: () => message,
    reset(nextMessage) {
      message = nextMessage ?? createAssistantMessage();
      state = createStreamState(message);
    },
    applyFrame(frame) {
      message = applyFrame(message, frame, state);
      return message;
    },
    applyFrames(frames) {
      for (const frame of frames) {
        message = applyFrame(message, frame, state);
      }
      return message;
    },
    toThreadMessage() {
      return toThreadMessage(message);
    },
  };
}

export type ProtocolLocalRuntimeOptions = {
  stream: (
    options: ChatModelRunOptions,
  ) => Promise<AsyncIterable<ChatStreamFrame> | Iterable<ChatStreamFrame>> | AsyncIterable<ChatStreamFrame> | Iterable<ChatStreamFrame>;
  initialMessageId?: string;
};

function toRunResult(message: ProtocolAssistantMessage): ChatModelRunResult {
  return {
    content: message.content.map(convertToThreadAssistantPart),
    status: message.status,
    metadata: {
      custom: message.metadata,
      unstable_annotations: [],
      unstable_data: [],
      unstable_state: null,
      steps: [],
    },
  };
}

export function createProtocolStreamRuntime(
  initialMessage?: ProtocolAssistantMessage,
): ProtocolStreamAdapter {
  return createProtocolStreamAdapter(initialMessage);
}

export function createProtocolStreamResult(
  frames: readonly ChatStreamFrame[],
  initialMessage?: ProtocolAssistantMessage,
): ChatModelRunResult {
  return toRunResult(applyFrameSequenceToMessage(frames, initialMessage));
}

export function createProtocolLocalRuntime(
  options: ProtocolLocalRuntimeOptions,
): ChatModelAdapter {
  return {
    async *run(runOptions) {
      const stream = await options.stream(runOptions);
      const adapter = createProtocolStreamAdapter(
        createAssistantMessage(
          runOptions.unstable_assistantMessageId ?? options.initialMessageId,
        ),
      );

      for await (const frame of stream) {
        adapter.applyFrame(frame);
        yield toRunResult(adapter.getMessage());
      }
    },
  };
}
