'use client';

import { useCallback, useMemo, useState } from 'react';
import { createToolkitBridge } from '@/lib/toolkitBridge';
import type {
  ChatStreamFrame,
  ChatToolCallPart,
  ChatToolInputStartFrame,
  ChatToolOutputAvailableFrame,
  ChatToolOutputErrorFrame,
} from 'chat-protocol-contract';
import { AssistantModal, ChatProtocolProvider } from 'chat-protocol-ui';
import { ToolRegistryPanel, useToolInvocationTracker } from '@/components/ToolRegistryPanel';
import type { ToolInvocation } from '@/components/ToolRegistryPanel';
import {
  getProtocolToolDescriptors,
  getToolkitForPreset,
  getToolDescriptors,
  type ToolPreset,
} from '@/components/toolkit/tools';

const API_URL = import.meta.env.RSBOARD_PROTOCOL_DEMO_API_URL ?? 'http://127.0.0.1:8080/api/chat/runs';
const E2E_BACKEND_URL =
  import.meta.env.RSBOARD_CHATBOT_E2E_BACKEND_URL ?? 'http://127.0.0.1:18080';

type ResolveFrontendTool = (
  toolCall: ChatToolCallPart,
) => Promise<Record<string, unknown>> | Record<string, unknown>;

type BatchStatus = {
  status: string;
  answers: Record<string, string>;
};

function createConversationId(threadId?: string): string {
  return threadId ? `conv-${threadId}` : 'conv-chat-protocol-demo';
}

function ReviewRegressionPanel() {
  const [batchA, setBatchA] = useState<BatchStatus | null>(null);
  const [batchB, setBatchB] = useState<BatchStatus | null>(null);
  const [slowBatch, setSlowBatch] = useState<BatchStatus | null>(null);
  const [routingBatchIds] = useState(() => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return {
      a: `chrome-batch-a-${suffix}`,
      b: `chrome-batch-b-${suffix}`,
    };
  });
  const [slowBatchId] = useState(
    () => `chrome-slow-answer-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  const createBatch = useCallback(async (batchId: string) => {
    const response = await fetch(`${E2E_BACKEND_URL}/api/chat/e2e/question-batches/${batchId}`, {
      method: 'POST',
    });
    if (!response.ok && response.status !== 409) {
      throw new Error(`Failed to create ${batchId}: ${response.status}`);
    }
  }, []);

  const readBatch = useCallback(async (batchId: string): Promise<BatchStatus> => {
    const response = await fetch(`${E2E_BACKEND_URL}/api/chat/e2e/question-batches/${batchId}`);
    if (!response.ok) {
      throw new Error(`Failed to read ${batchId}: ${response.status}`);
    }
    return response.json() as Promise<BatchStatus>;
  }, []);

  const submitAnswer = useCallback(async (batchId: string, answers: Record<string, string>) => {
    const response = await fetch(`${E2E_BACKEND_URL}/api/chat/question/answer`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ batchId, answers }),
    });
    if (!response.ok) {
      throw new Error(`Failed to answer ${batchId}: ${response.status}`);
    }
  }, []);

  const submitPathAnswer = useCallback(async (batchId: string, answers: Record<string, string>) => {
    const response = await fetch(`${E2E_BACKEND_URL}/api/chat/question/${batchId}/answer`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) {
      throw new Error(`Failed to answer ${batchId}: ${response.status}`);
    }
  }, []);

  const refreshRoutingBatches = useCallback(async () => {
    const [nextA, nextB] = await Promise.all([
      readBatch(routingBatchIds.a),
      readBatch(routingBatchIds.b),
    ]);
    setBatchA(nextA);
    setBatchB(nextB);
  }, [readBatch, routingBatchIds]);

  const startRoutingBatches = useCallback(async () => {
    await Promise.all([createBatch(routingBatchIds.a), createBatch(routingBatchIds.b)]);
    await refreshRoutingBatches();
  }, [createBatch, refreshRoutingBatches, routingBatchIds]);

  const answerBatchB = useCallback(async () => {
    await submitAnswer(routingBatchIds.b, { choice: 'second' });
    await refreshRoutingBatches();
  }, [refreshRoutingBatches, routingBatchIds, submitAnswer]);

  const startSlowBatch = useCallback(async () => {
    await createBatch(slowBatchId);
    setSlowBatch(await readBatch(slowBatchId));
  }, [createBatch, readBatch, slowBatchId]);

  const answerSlowBatch = useCallback(async () => {
    await submitPathAnswer(slowBatchId, { choice: 'after-timeout-window' });
    setSlowBatch(await readBatch(slowBatchId));
  }, [readBatch, slowBatchId, submitPathAnswer]);

  return (
    <section
      aria-label="Chatbot review regression panel"
      className="rounded-md border bg-white p-4 text-sm shadow-sm"
    >
      <h1 className="text-base font-semibold">Chatbot Review Regression</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={startRoutingBatches}
          className="rounded-md border px-3 py-1.5"
        >
          Start Question Batches
        </button>
        <button type="button" onClick={answerBatchB} className="rounded-md border px-3 py-1.5">
          Answer Batch B
        </button>
      </div>
      <dl className="mt-3 grid gap-2">
        <div>
          <dt className="font-medium">Batch A</dt>
          <dd data-testid="batch-a-status">
            {batchA ? `${batchA.status} ${batchA.answers.choice ?? ''}`.trim() : 'not started'}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Batch B</dt>
          <dd data-testid="batch-b-status">
            {batchB ? `${batchB.status} ${batchB.answers.choice ?? ''}`.trim() : 'not started'}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={startSlowBatch} className="rounded-md border px-3 py-1.5">
          Start Slow Question
        </button>
        <button type="button" onClick={answerSlowBatch} className="rounded-md border px-3 py-1.5">
          Answer Slow Question
        </button>
      </div>
      <dl className="mt-3">
        <div>
          <dt className="font-medium">Slow Batch</dt>
          <dd data-testid="slow-batch-status">
            {slowBatch
              ? `${slowBatch.status} ${slowBatch.answers.choice ?? ''}`.trim()
              : 'not started'}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function ChatProtocolAppContent({
  activeToolPreset,
  selectToolPreset,
}: {
  activeToolPreset: ToolPreset;
  selectToolPreset: (preset: ToolPreset) => void;
}) {
  const { invocations, trackInvocation, updateInvocation, resetInvocations } =
    useToolInvocationTracker();

  // Create toolkit bridge for unified tool execution
  const toolkit = getToolkitForPreset(activeToolPreset);
  const toolkitBridge = useMemo(() => createToolkitBridge(toolkit), [toolkit]);

  const onFrame = useCallback(
    (frame: ChatStreamFrame) => {
      if (frame.type === 'tool-input-start') {
        const toolFrame = frame as ChatToolInputStartFrame & {
          source?: string;
          providerId?: string;
        };
        trackInvocation({
          toolCallId: toolFrame.toolCallId,
          toolName: toolFrame.toolName,
          source:
            (toolFrame.source as ToolInvocation['source']) ??
            (toolFrame.executionTarget === 'frontend' ? 'frontend' : 'backend'),
          providerId: toolFrame.providerId,
          input: undefined,
          state: 'input-available',
        });
        return;
      }

      if (frame.type === 'tool-input-available') {
        updateInvocation(frame.toolCallId, {
          input: frame.input,
          state: 'input-available',
        });
        return;
      }

      if (frame.type === 'tool-output-available') {
        const toolFrame = frame as ChatToolOutputAvailableFrame & {
          source?: string;
          providerId?: string;
        };
        updateInvocation(toolFrame.toolCallId, {
          output: toolFrame.output,
          state: 'output-available',
          source: (toolFrame.source as ToolInvocation['source']) ?? 'backend',
          providerId: toolFrame.providerId,
        });
        return;
      }

      if (frame.type === 'tool-output-error') {
        const toolFrame = frame as ChatToolOutputErrorFrame & {
          source?: string;
          providerId?: string;
        };
        updateInvocation(toolFrame.toolCallId, {
          error: toolFrame.error,
          state: 'output-error',
          source: (toolFrame.source as ToolInvocation['source']) ?? 'backend',
          providerId: toolFrame.providerId,
        });
      }
    },
    [trackInvocation, updateInvocation],
  );

  const currentTools = getToolDescriptors(activeToolPreset);
  const protocolTools = getProtocolToolDescriptors(activeToolPreset);

  return (
    <ChatProtocolProvider
      apiUrl={API_URL}
      toolkit={toolkit}
      tools={protocolTools}
      onFrame={onFrame}
      toolkitBridge={toolkitBridge}
      createConversationId={createConversationId}
    >
      <main className="flex min-h-screen flex-col gap-8 p-5 md:p-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => selectToolPreset('minimal')}
            aria-label="Use minimal tools"
            aria-pressed={activeToolPreset === 'minimal'}
            className="rounded-md border px-3 py-1.5 text-sm transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
          >
            minimal
          </button>
          <button
            type="button"
            onClick={() => selectToolPreset('full')}
            aria-label="Use full tools"
            aria-pressed={activeToolPreset === 'full'}
            className="rounded-md border px-3 py-1.5 text-sm transition-colors aria-pressed:border-[#173b60] aria-pressed:bg-[#173b60] aria-pressed:text-white"
          >
            full
          </button>
        </div>
        <ToolRegistryPanel
          tools={currentTools}
          invocations={invocations}
          onResetInvocations={resetInvocations}
        />
        {new URLSearchParams(window.location.search).get('reviewRegression') === '1' && (
          <ReviewRegressionPanel />
        )}
      </main>
      <AssistantModal />
    </ChatProtocolProvider>
  );
}

export function App() {
  const [activeToolPreset, setActiveToolPreset] = useState<ToolPreset>('full');

  return (
    <ChatProtocolAppContent
      activeToolPreset={activeToolPreset}
      selectToolPreset={setActiveToolPreset}
    />
  );
}
