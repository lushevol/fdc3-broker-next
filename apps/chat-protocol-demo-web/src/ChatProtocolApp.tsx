'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  useAui,
  Tools,
} from '@assistant-ui/react';
import type {
  ChatAssistantMessage,
  ChatMessage,
  ChatRunRequest,
  ChatStreamFrame,
  ChatToolCallPart,
  ChatToolInputStartFrame,
  ChatToolMessage,
  ChatToolOutputAvailableFrame,
  ChatToolOutputErrorFrame,
} from '@fm/chat-protocol-contract';
import {
  createProtocolLocalRuntime,
  createProtocolStreamAdapter,
} from '@fm/chat-protocol-frontend';
import { AssistantModal } from '@/components/assistant-ui/assistant-modal';
import { ToolRegistryPanel, useToolInvocationTracker } from '@/ToolRegistryPanel';
import type { ToolInvocation } from '@/ToolRegistryPanel';
import { getToolkitForPreset, getToolDescriptors, type ToolPreset } from '@/toolkit';

const API_URL = import.meta.env.VITE_PROTOCOL_DEMO_API_URL ?? 'http://127.0.0.1:8080/api/chat/runs';

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
  onFrame?: (frame: ChatStreamFrame) => void,
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
      onFrame?.(frame);

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

    const resolvedTool = (() => {
      if (pendingFrontendTool.toolName === 'location.resolve') {
        const query = typeof pendingFrontendTool.input.query === 'string' ? pendingFrontendTool.input.query : 'San Francisco';
        const normalized = query.toLowerCase();
        if (normalized.includes('beijing')) {
          return {
            ...pendingFrontendTool,
            state: 'output-available' as const,
            output: { name: 'Beijing, CN', latitude: 39.9042, longitude: 116.4074 },
          };
        }
        return {
          ...pendingFrontendTool,
          state: 'output-available' as const,
          output: { name: 'San Francisco, CA', latitude: 37.7749, longitude: -122.4194 },
        };
      }
      return {
        ...pendingFrontendTool,
        state: 'output-available' as const,
        output: { result: `Simulated result from frontend tool: ${pendingFrontendTool.toolName}` },
      };
    })();

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

function createConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol-demo';
}

function ChatProtocolAppContent({ activeToolPreset, selectToolPreset }: { activeToolPreset: ToolPreset; selectToolPreset: (preset: ToolPreset) => void }) {
  const { invocations, trackInvocation, updateInvocation, resetInvocations } = useToolInvocationTracker();

  const onFrame = useCallback(
    (frame: ChatStreamFrame) => {
      if (frame.type === 'tool-input-start') {
        const f = frame as ChatToolInputStartFrame & { source?: string; providerId?: string };
        trackInvocation({
          toolCallId: f.toolCallId,
          toolName: f.toolName,
          source: (f.source as ToolInvocation['source']) ?? (f.executionTarget === 'frontend' ? 'frontend' : 'backend'),
          providerId: f.providerId,
          input: undefined,
          state: 'input-available',
        });
      } else if (frame.type === 'tool-input-available') {
        updateInvocation(frame.toolCallId, {
          input: frame.input,
          state: 'input-available',
        });
      } else if (frame.type === 'tool-output-available') {
        const f = frame as ChatToolOutputAvailableFrame & { source?: string; providerId?: string };
        updateInvocation(f.toolCallId, {
          output: f.output,
          state: 'output-available',
          source: (f.source as ToolInvocation['source']) ?? 'backend',
          providerId: f.providerId,
        });
      } else if (frame.type === 'tool-output-error') {
        const f = frame as ChatToolOutputErrorFrame & { source?: string; providerId?: string };
        updateInvocation(f.toolCallId, {
          error: f.error,
          state: 'output-error',
          source: (f.source as ToolInvocation['source']) ?? 'backend',
          providerId: f.providerId,
        });
      }
    },
    [trackInvocation, updateInvocation],
  );

  const toolkit = getToolkitForPreset(activeToolPreset);
  const currentTools = getToolDescriptors(activeToolPreset);

  const modelAdapter = useMemo(
    () =>
      createProtocolLocalRuntime({
        stream: (runOptions) => {
          const conversationId = createConversationId(runOptions.unstable_threadId);
          const messages = toProtocolMessages(runOptions.messages);

          const contextTools = currentTools.map((t) => ({
            name: t.name,
            source: t.source === 'frontend' ? 'frontend' as const : t.source === 'human' ? 'human' as const : 'backend' as const,
            description: t.description,
            parameters: { type: 'object', properties: {}, required: [] },
          }));

          const request: ChatRunRequest = {
            conversationId,
            trigger: 'submit-message',
            context: { tools: contextTools },
            messages,
            metadata: runOptions.runConfig.custom ?? {},
          };

          return autoResolveFrontendTools(request, onFrame);
        },
      }),
    [onFrame, currentTools],
  );

  const runtime = useLocalRuntime(modelAdapter);
  const aui = useAui({
    tools: Tools({ toolkit }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime} aui={aui}>
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
        <section className="flex min-w-0 flex-col items-center justify-start lg:items-start lg:justify-center" aria-hidden="true">
          <ToolRegistryPanel
            tools={currentTools}
            invocations={invocations}
            onResetInvocations={resetInvocations}
          />
        </section>
      </main>
      <AssistantModal />
    </AssistantRuntimeProvider>
  );
}

export function ChatProtocolApp() {
  const [activeToolPreset, setActiveToolPreset] = useState<ToolPreset>('minimal');
  const activeToolPresetRef = useRef<ToolPreset>('minimal');

  const handlePresetChange = useCallback((preset: ToolPreset) => {
    activeToolPresetRef.current = preset;
    setActiveToolPreset(preset);
  }, []);

  return (
    <ChatProtocolAppContent activeToolPreset={activeToolPreset} selectToolPreset={handlePresetChange} />
  );
}
