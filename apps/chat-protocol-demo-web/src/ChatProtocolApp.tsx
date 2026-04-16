'use client';

import { useMemo } from 'react';
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
} from '@assistant-ui/react';
import type {
  ChatAssistantMessage,
  ChatMessage,
  ChatRunRequest,
  ChatStreamFrame,
  ChatToolCallPart,
  ChatToolMessage,
} from '@fm/chat-protocol-contract';
import {
  createProtocolLocalRuntime,
  createProtocolStreamAdapter,
} from '@fm/chat-protocol-frontend';
import { AssistantModal } from '@/components/assistant-ui/assistant-modal';

const API_URL = import.meta.env.VITE_PROTOCOL_DEMO_API_URL ?? 'http://127.0.0.1:4111/api/chat/runs';

type WeatherCardData = {
  location: string;
  date: string;
  condition: string;
  summary: string;
  highC: number;
  lowC: number;
};

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

type ProtocolCompatibleThreadMessage = import('@assistant-ui/react').ThreadMessage | ToolThreadMessageLike;

function getTextParts(message: import('@assistant-ui/react').ThreadMessage): string[] {
  return message.content
    .filter(
      (part): part is Extract<import('@assistant-ui/react').ThreadMessage['content'][number], { type: 'text' }> =>
        part.type === 'text',
    )
    .map((part) => part.text);
}

function isToolThreadMessageLike(
  message: ProtocolCompatibleThreadMessage,
): message is ToolThreadMessageLike {
  return message.role === 'tool';
}

function getExecutionTarget(
  part: Extract<import('@assistant-ui/react').ThreadMessage['content'][number], { type: 'tool-call' }>,
): 'frontend' | 'backend' {
  const candidate = (part as { executionTarget?: unknown }).executionTarget;
  return candidate === 'frontend' ? 'frontend' : 'backend';
}

function getToolError(
  part: Extract<import('@assistant-ui/react').ThreadMessage['content'][number], { type: 'tool-call' }>,
): unknown {
  return (part as { error?: unknown }).error;
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

function toProtocolMessages(messages: readonly ProtocolCompatibleThreadMessage[]): ChatMessage[] {
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
          const error = toErrorMessage(getToolError(part));
          const output = toRecord(part.result);
          parts.push({
            type: 'tool-call',
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            executionTarget: getExecutionTarget(part),
            state:
              part.result !== undefined
                ? part.isError
                  ? 'output-error'
                  : 'output-available'
                : 'input-available',
            input: part.args,
            ...(output ? { output } : {}),
            ...(error !== undefined ? { error } : {}),
          });
          continue;
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
            import('@assistant-ui/react').ThreadMessage['content'][number],
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

function encodeLocationToolResult(part: ChatToolCallPart): ChatToolCallPart {
  const query = typeof part.input.query === 'string' ? part.input.query : 'San Francisco';
  const normalized = query.toLowerCase();

  if (normalized.includes('beijing')) {
    return {
      ...part,
      state: 'output-available',
      output: {
        name: 'Beijing, CN',
        latitude: 39.9042,
        longitude: 116.4074,
      },
    };
  }

  return {
    ...part,
    state: 'output-available',
    output: {
      name: 'San Francisco, CA',
      latitude: 37.7749,
      longitude: -122.4194,
    },
  };
}

function extractDataLines(event: string): string[] {
  return event
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) =>
      line.startsWith('data: ') ? line.slice('data: '.length) : line.slice('data:'.length),
    );
}

async function* parseSseFrames(response: Response): AsyncGenerator<ChatStreamFrame, void> {
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

async function postRunRequest(request: ChatRunRequest): Promise<Response> {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}

async function* streamProtocolFrames(
  request: ChatRunRequest,
  adapter = createProtocolStreamAdapter(),
): AsyncGenerator<ChatStreamFrame, void> {
  let nextRequest: ChatRunRequest | null = request;
  let currentRunId = request.runId ?? null;

  while (nextRequest) {
    const response = await postRunRequest({
      ...nextRequest,
      ...(currentRunId ? { runId: currentRunId } : {}),
    });

    let finishReason: string | null = null;

    for await (const frame of parseSseFrames(response)) {
      adapter.applyFrame(frame);

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
    const pendingTool = [...assistantMessage.content]
      .reverse()
      .find(
        (part): part is ChatToolCallPart =>
          part.type === 'tool-call' &&
          part.executionTarget === 'frontend' &&
          part.state === 'input-available' &&
          !part.output,
      );

    if (!pendingTool) {
      break;
    }

    const resumedParts = assistantMessage.content.map((part) => {
      if (part.type === 'tool-call' && part.toolCallId === pendingTool.toolCallId) {
        return encodeLocationToolResult(part);
      }

      return part;
    });

    const resumedAssistantMessage: ChatAssistantMessage = {
      id: assistantMessage.id,
      role: 'assistant',
      parts: resumedParts,
      metadata: assistantMessage.metadata,
    };

    const resolvedTool = resumedParts.find(
      (part): part is ChatToolCallPart =>
        part.type === 'tool-call' && part.toolCallId === pendingTool.toolCallId,
    );

    if (resolvedTool?.output) {
      yield {
        type: 'tool-output-available',
        toolCallId: resolvedTool.toolCallId,
        output: resolvedTool.output,
      };
    }

    const resumedToolMessage: ChatToolMessage | null = resolvedTool?.output
      ? {
          id: `${resolvedTool.toolCallId}-tool-result`,
          role: 'tool',
          toolCallId: resolvedTool.toolCallId,
          toolName: resolvedTool.toolName,
          parts: [
            {
              type: 'tool-result',
              toolCallId: resolvedTool.toolCallId,
              output: resolvedTool.output,
            },
          ],
          metadata: {},
        }
      : null;

    nextRequest = {
      conversationId: request.conversationId,
      runId: currentRunId,
      trigger: 'submit-tool-result',
      messages: resumedToolMessage
        ? [...request.messages, resumedAssistantMessage, resumedToolMessage]
        : [...request.messages, resumedAssistantMessage],
      metadata: request.metadata,
    };
  }
}

function createConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol-demo';
}

export function ChatProtocolApp() {
  const modelAdapter = useMemo(
    () =>
      createProtocolLocalRuntime({
        stream: (runOptions) => {
          const conversationId = createConversationId(runOptions.unstable_threadId);
          const messages = toProtocolMessages(runOptions.messages);

          const request: ChatRunRequest = {
            conversationId,
            trigger: 'submit-message',
            messages,
            metadata: runOptions.runConfig.custom ?? {},
          };

          return streamProtocolFrames(request);
        },
      }),
    [],
  );
  const runtime = useLocalRuntime(modelAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <main className="grid min-h-screen grid-cols-1 items-center gap-8 px-5 py-10 md:px-8 lg:grid-cols-[minmax(320px,520px)_minmax(320px,1fr)] lg:px-16">
        <section className="min-w-0">
          <span className="inline-flex w-fit rounded-full bg-[rgba(120,164,203,0.16)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#37516a]">
            assistant-ui modal
          </span>
          <h1 className="my-4 text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.04em] text-[#132744]">
            Chat protocol demo
          </h1>
          <p className="mb-4 max-w-[36rem] text-[1.05rem] leading-[1.7] text-[#4c6680]">
            Floating button that opens an AI assistant chat box. This demo streams reasoning, plan
            steps, backend and frontend tools, and the final response through the chat protocol
            runtime.
          </p>
          <p className="mb-4 max-w-[36rem] text-[1.05rem] leading-[1.7] text-[#4c6680]">
            Configure <code>VITE_PROTOCOL_DEMO_API_URL</code> to point at the mock demo server or
            the real LangChain4j backend.
          </p>
          <p className="max-w-[36rem] text-[1.05rem] font-semibold leading-[1.7] text-[#173b60]">
            The assistant modal is available in the bottom right corner of the screen.
          </p>
        </section>
        <section className="flex min-w-0 items-center justify-center" aria-hidden="true">
          <div className="w-full max-w-[42rem] rounded-[2rem] border border-[rgba(16,32,51,0.08)] bg-[rgba(255,255,255,0.72)] p-6 shadow-[0_30px_80px_-50px_rgba(16,32,51,0.45)] backdrop-blur-[12px]">
            <div className="inline-flex items-center rounded-full bg-[rgba(220,233,246,0.75)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#345069]">
              Official modal pattern
            </div>
            <div className="mt-5 min-h-[18rem] rounded-[1.5rem] border border-[rgba(16,32,51,0.07)] bg-[linear-gradient(180deg,rgba(255,255,255,0.85)_0%,rgba(240,246,251,0.85)_100%)] p-6 text-[#486179]">
              <p className="mb-3">Open the floating assistant and ask:</p>
              <code className="inline-block rounded-[0.9rem] bg-[#edf4fa] px-3 py-2 text-[#173b60]">
                What is the weather in San Francisco yesterday?
              </code>
            </div>
          </div>
        </section>
      </main>
      <AssistantModal />
    </AssistantRuntimeProvider>
  );
}
