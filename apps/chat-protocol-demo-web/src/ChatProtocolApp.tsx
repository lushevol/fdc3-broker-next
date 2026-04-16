'use client';

import { useMemo, useRef, useState } from 'react';
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
  ChatToolOutputAvailableFrame,
} from '@fm/chat-protocol-contract';
import {
  createProtocolLocalRuntime,
  createProtocolStreamAdapter,
} from '@fm/chat-protocol-frontend';
import { AssistantModal } from '@/components/assistant-ui/assistant-modal';

type PendingHumanTool = {
  toolCallId: string;
  toolName: string;
  source: ChatToolCallPart['source'];
  input: Record<string, unknown>;
  providerId?: string;
};

const API_URL = import.meta.env.VITE_PROTOCOL_DEMO_API_URL ?? 'http://127.0.0.1:8080/api/chat/runs';

type ToolPreset = 'minimal' | 'full';

const MINIMAL_TOOLS = [
  {
    name: 'location.resolve',
    source: 'frontend' as const,
    description: 'Resolve a location in the runtime',
    parameters: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
    },
  },
];

const FULL_TOOLS = [
  ...MINIMAL_TOOLS,
  {
    name: 'approval.confirm',
    source: 'human' as const,
    description: 'Confirm a user decision',
    parameters: {
      type: 'object',
      properties: { decision: { type: 'string' } },
      required: ['decision'],
    },
  },
  {
    name: 'summary.compose',
    source: 'backend' as const,
    description: 'Compose a final summary',
    parameters: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text'],
    },
  },
  {
    name: 'analytics.lookup',
    source: 'mcp' as const,
    providerId: 'analytics-mcp',
    description: 'Look up analytics',
    parameters: {
      type: 'object',
      properties: { appId: { type: 'string' } },
      required: ['appId'],
    },
  },
  {
    name: 'profile.lookup',
    source: 'mcp' as const,
    providerId: 'profile-mcp',
    description: 'Look up user profile context',
    parameters: {
      type: 'object',
      properties: { userId: { type: 'string' } },
      required: ['userId'],
    },
  },
];

function getToolsForPreset(preset: ToolPreset) {
  return preset === 'minimal' ? MINIMAL_TOOLS : FULL_TOOLS;
}

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

function getToolSource(
  part: Extract<import('@assistant-ui/react').ThreadMessage['content'][number], { type: 'tool-call' }>,
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

function encodeLocationToolResult(part: ChatToolCallPart): ChatToolCallPart & { output: Record<string, unknown> } {
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

function resolveFrontendTool(
  part: ChatToolCallPart,
): ChatToolCallPart & { output: Record<string, unknown> } {
  if (part.toolName === 'location.resolve') {
    return encodeLocationToolResult(part);
  }

  return {
    ...part,
    state: 'output-available',
    output: { result: `Simulated result from frontend tool: ${part.toolName}` },
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

async function* autoResolveFrontendTools(
  request: ChatRunRequest,
): AsyncGenerator<ChatStreamFrame, void> {
  let nextRequest: ChatRunRequest | null = request;
  let currentRunId = request.runId ?? null;

  while (nextRequest) {
    const response = await postRunRequest({
      ...nextRequest,
      ...(currentRunId ? { runId: currentRunId } : {}),
    });

    let finishReason: string | null = null;
    const adapter = createProtocolStreamAdapter();

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

    if (finishReason === 'action-required') {
      break;
    }

    if (finishReason !== 'tool-calls') {
      break;
    }

    const assistantMessage = adapter.getMessage();
    const pendingFrontendTool = findPendingToolBySource(assistantMessage.content, 'frontend');

    if (!pendingFrontendTool) {
      break;
    }

    const resolvedTool = resolveFrontendTool(pendingFrontendTool);

    const resumedParts = assistantMessage.content.map((part) => {
      if (part.type === 'tool-call' && part.toolCallId === resolvedTool.toolCallId) {
        return resolvedTool;
      }

      return part;
    });

    const resumedAssistantMessage: ChatAssistantMessage = {
      id: assistantMessage.id,
      role: 'assistant',
      parts: resumedParts,
      metadata: assistantMessage.metadata,
    };

    yield {
      type: 'tool-output-available',
      toolCallId: resolvedTool.toolCallId,
      output: resolvedTool.output,
      source: 'frontend',
    } as ChatToolOutputAvailableFrame;

    const resumedToolMessage: ChatToolMessage = {
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
    };

    nextRequest = {
      conversationId: request.conversationId,
      runId: currentRunId,
      trigger: 'submit-tool-result',
      context: request.context,
      messages: [...request.messages, resumedAssistantMessage, resumedToolMessage],
      metadata: request.metadata,
    };
  }
}

function HumanToolApprovalCard({
  tool,
  onApprove,
  onReject,
}: {
  tool: PendingHumanTool;
  onApprove: (decision: Record<string, unknown>) => void;
  onReject: () => void;
}) {
  return (
    <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <svg
          className="h-5 w-5 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="text-sm font-semibold text-amber-800">
          Human Approval Required
        </span>
      </div>
      <div className="mb-3 text-sm text-amber-900">
        <p>
          Tool: <strong>{tool.toolName}</strong>
        </p>
        <p className="mt-1 text-xs text-amber-700">
          {Object.keys(tool.input).length > 0
            ? `Input: ${JSON.stringify(tool.input)}`
            : 'No input parameters'}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            onApprove({
              decision: 'approved',
              confirmed: true,
              ...tool.input,
            })
          }
          className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={onReject}
          className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function createConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol-demo';
}

export function ChatProtocolApp() {
  const [activeToolPreset, setActiveToolPreset] = useState<ToolPreset>('minimal');
  const activeToolPresetRef = useRef<ToolPreset>('minimal');

  function selectToolPreset(nextPreset: ToolPreset) {
    activeToolPresetRef.current = nextPreset;
    setActiveToolPreset(nextPreset);
  }

  const modelAdapter = useMemo(
    () =>
      createProtocolLocalRuntime({
        stream: (runOptions) => {
          const conversationId = createConversationId(runOptions.unstable_threadId);
          const messages = toProtocolMessages(runOptions.messages);
          const tools = getToolsForPreset(activeToolPresetRef.current);

          const request: ChatRunRequest = {
            conversationId,
            trigger: 'submit-message',
            context: {
              tools,
            },
            messages,
            metadata: runOptions.runConfig.custom ?? {},
          };

          return autoResolveFrontendTools(request);
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
            runtime. Human-in-the-loop (HITL) approval tools pause for user confirmation before
            continuing.
          </p>
          <p className="mb-4 max-w-[36rem] text-[1.05rem] leading-[1.7] text-[#4c6680]">
            Configure <code>VITE_PROTOCOL_DEMO_API_URL</code> to point at the mock demo server or
            the real LangChain4j backend.
          </p>
          <div className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-[1.25rem] border border-[rgba(16,32,51,0.1)] bg-[rgba(255,255,255,0.7)] p-2 text-sm text-[#173b60] shadow-[0_10px_30px_-24px_rgba(16,32,51,0.35)]">
            <span className="px-2 font-semibold uppercase tracking-[0.08em] text-[#4c6680]">
              Active preset
            </span>
            <button
              type="button"
              onClick={() => selectToolPreset('minimal')}
              aria-pressed={activeToolPreset === 'minimal'}
              className="rounded-full border px-3 py-1.5 transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
            >
              Use minimal tools
            </button>
            <button
              type="button"
              onClick={() => selectToolPreset('full')}
              aria-pressed={activeToolPreset === 'full'}
              className="rounded-full border px-3 py-1.5 transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
            >
              Use full tools
            </button>
          </div>
          <div className="mb-4 max-w-[36rem] space-y-2">
            <h2 className="text-[1.05rem] font-semibold text-[#173b60]">Demo Test Cases</h2>
            <ul className="list-inside list-disc space-y-1 text-[0.95rem] text-[#4c6680]">
              <li>
                <strong>TC1 Frontend delegation:</strong> Ask &ldquo;What is the weather in San
                Francisco?&rdquo; with minimal preset — validates{' '}
                <code>location.resolve</code> &rarr; <code>get_weather</code> chain.
              </li>
              <li>
                <strong>TC2 Backend multi-tool:</strong> Ask &ldquo;What is the weather and current
                time?&rdquo; with full preset — validates <code>get_weather</code> +{' '}
                <code>get_current_time</code> backend tools.
              </li>
              <li>
                <strong>TC3 HITL approval:</strong> Ask &ldquo;Should I proceed with this
                action?&rdquo; with full preset — validates{' '}
                <code>approval.confirm</code> human tool pause/resume.
              </li>
              <li>
                <strong>TC4 Dynamic preset:</strong> Send a message with minimal preset, switch to
                full preset, send another message — validates tool set change without restart.
              </li>
              <li>
                <strong>TC5 Mixed sources:</strong> Ask &ldquo;Give me a full briefing with weather,
                approval, and analytics&rdquo; with full preset — validates all four source types in
                one run.
              </li>
            </ul>
          </div>
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
