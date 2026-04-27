'use client';

import { useState, useCallback } from 'react';

type ToolDescriptor = {
  name: string;
  source: 'frontend' | 'backend' | 'human' | 'mcp';
  providerId?: string;
  description: string;
  parameters: Record<string, { type: string; description?: string; required: boolean }>;
};

type ToolInvocation = {
  toolCallId: string;
  toolName: string;
  source: string;
  providerId?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  state:
    | 'input-available'
    | 'awaiting-execution'
    | 'awaiting-human'
    | 'output-available'
    | 'output-error';
  timestamp: number;
};

const SOURCE_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  frontend: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  backend: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
  },
  human: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700',
  },
  mcp: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-800',
    badge: 'bg-violet-100 text-violet-700',
  },
};

const STATE_ICONS: Record<string, string> = {
  'input-available': '⏳',
  'awaiting-execution': '🔄',
  'awaiting-human': '🤚',
  'output-available': '✅',
  'output-error': '❌',
};

function ParamList({
  parameters,
}: {
  parameters: Record<string, { type: string; description?: string; required: boolean }>;
}) {
  const entries = Object.entries(parameters);
  if (entries.length === 0) return null;

  return (
    <div className="mt-1.5 space-y-0.5">
      {entries.map(([key, val]) => (
        <div key={key} className="flex items-start gap-1 text-[0.7rem] leading-tight">
          <code className="font-mono text-[#475569]">{key}</code>
          <span className="text-[#94a3b8]">{val.type}</span>
          {val.required && <span className="text-[#e11d48] text-[0.6rem] leading-none">*</span>}
          {val.description && <span className="text-[#64748b]">({val.description})</span>}
        </div>
      ))}
    </div>
  );
}

function InvocationItem({ invocation }: { invocation: ToolInvocation }) {
  const colors = SOURCE_COLORS[invocation.source] ?? SOURCE_COLORS.backend;

  return (
    <div
      className={`rounded-md border ${colors.border} ${colors.bg} px-2.5 py-1.5 text-[0.7rem]`}
      data-testid={`tool-invocation-${invocation.toolCallId}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`font-medium ${colors.text}`}>
          {STATE_ICONS[invocation.state] ?? '•'} {invocation.toolName}
        </span>
        <span className="text-[#94a3b8] tabular-nums">
          {new Date(invocation.timestamp).toLocaleTimeString()}
        </span>
      </div>
      {invocation.providerId && (
        <div className="mt-0.5 text-[0.65rem] text-[#64748b]">
          provider: <code className="font-mono">{invocation.providerId}</code>
        </div>
      )}
      {invocation.input && Object.keys(invocation.input).length > 0 && (
        <details className="mt-0.5">
          <summary className="cursor-pointer text-[0.65rem] text-[#64748b] hover:text-[#334155]">
            Input
          </summary>
          <pre className="mt-0.5 overflow-x-auto whitespace-pre-wrap break-all text-[0.6rem] text-[#475569]">
            {JSON.stringify(invocation.input, null, 1)}
          </pre>
        </details>
      )}
      {invocation.error && (
        <div className="mt-0.5 text-[0.65rem] text-[#dc2626]">Error: {invocation.error}</div>
      )}
    </div>
  );
}

export function ToolRegistryPanel({
  tools,
  invocations,
  onResetInvocations,
}: {
  tools: ToolDescriptor[];
  invocations: ToolInvocation[];
  onResetInvocations: () => void;
}) {
  const matchCounts = invocations.reduce<Record<string, number>>((acc, inv) => {
    acc[inv.toolName] = (acc[inv.toolName] ?? 0) + 1;
    return acc;
  }, {});

  const latestStateByTool = invocations.reduce<Record<string, ToolInvocation>>((acc, inv) => {
    acc[inv.toolName] = inv;
    return acc;
  }, {});

  const totalInvocations = invocations.length;

  return (
    <div
      className="tool-registry-panel rounded-xl border border-[rgba(16,32,51,0.08)] bg-[rgba(255,255,255,0.85)] shadow-[0_8px_30px_-12px_rgba(16,32,51,0.25)]"
      data-testid="tool-registry-panel"
    >
      <div className="flex items-center justify-between border-b border-[rgba(16,32,51,0.08)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#132744]">Tool Registry</h3>
          <span className="inline-flex items-center rounded-full bg-[rgba(120,164,203,0.2)] px-2 py-0.5 text-[0.65rem] font-medium text-[#37516a]">
            {tools.length} tools
          </span>
          {totalInvocations > 0 && (
            <span className="inline-flex items-center rounded-full bg-[rgba(99,179,237,0.2)] px-2 py-0.5 text-[0.65rem] font-medium text-[#2563eb]">
              {totalInvocations} {totalInvocations === 1 ? 'call' : 'calls'}
            </span>
          )}
        </div>
        {totalInvocations > 0 && (
          <button
            type="button"
            onClick={onResetInvocations}
            className="rounded-md px-2 py-1 text-[0.7rem] text-[#64748b] transition-colors hover:bg-[rgba(16,32,51,0.06)] hover:text-[#334155]"
          >
            Clear
          </button>
        )}
      </div>

      <div className="max-h-[26rem] overflow-y-auto p-3">
        <div className="space-y-2.5">
          {tools.map((tool) => {
            const colors = SOURCE_COLORS[tool.source] ?? SOURCE_COLORS.backend;
            const matchCount = matchCounts[tool.name] ?? 0;
            const lastInvocation = latestStateByTool[tool.name];

            return (
              <div
                key={tool.name}
                className={`rounded-lg border ${colors.border} ${colors.bg} p-2.5 transition-all`}
                data-testid={`tool-card-${tool.name.replace(/\./g, '-')}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <code className="truncate font-mono text-[0.8rem] font-semibold text-[#132744]">
                        {tool.name}
                      </code>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${colors.badge}`}
                      >
                        {tool.source}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[0.75rem] text-[#4c6680]">{tool.description}</p>
                    {tool.providerId ? (
                      <p className="mt-0.5 text-[0.65rem] text-[#7c3aed]">
                        provider: <code className="font-mono">{tool.providerId}</code>
                      </p>
                    ) : null}
                    <ParamList parameters={tool.parameters} />
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <div
                      className={`inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full text-sm font-bold tabular-nums ${
                        matchCount > 0
                          ? 'bg-[#132744] text-white shadow-sm'
                          : 'bg-[rgba(16,32,51,0.06)] text-[#94a3b8]'
                      }`}
                      data-testid={`tool-count-${tool.name.replace(/\./g, '-')}`}
                    >
                      {matchCount}
                    </div>
                    <span className="text-[0.6rem] text-[#94a3b8]">
                      {matchCount === 0 ? 'unused' : matchCount === 1 ? 'call' : 'calls'}
                    </span>
                  </div>
                </div>

                {lastInvocation && (
                  <div className="mt-2 border-t border-[rgba(16,32,51,0.06)] pt-1.5">
                    <div className="flex items-center gap-1 text-[0.65rem] text-[#64748b]">
                      <span>Last:</span>
                      <span className={`font-medium ${colors.text}`}>
                        {STATE_ICONS[lastInvocation.state]} {lastInvocation.state}
                      </span>
                      {lastInvocation.providerId && (
                        <span className="text-[#94a3b8]">via {lastInvocation.providerId}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {invocations.length > 0 && (
          <div className="mt-4 border-t border-[rgba(16,32,51,0.08)] pt-3">
            <h4 className="mb-2 text-[0.75rem] font-semibold text-[#132744]">Invocation History</h4>
            <div className="space-y-1.5">
              {invocations.map((inv) => (
                <InvocationItem key={inv.toolCallId} invocation={inv} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function useToolInvocationTracker() {
  const [invocations, setInvocations] = useState<ToolInvocation[]>([]);

  const trackInvocation = useCallback((invocation: Omit<ToolInvocation, 'timestamp'>) => {
    setInvocations((prev) => [...prev, { ...invocation, timestamp: Date.now() }]);
  }, []);

  const updateInvocation = useCallback((toolCallId: string, updates: Partial<ToolInvocation>) => {
    setInvocations((prev) =>
      prev.map((inv) => (inv.toolCallId === toolCallId ? { ...inv, ...updates } : inv)),
    );
  }, []);

  const resetInvocations = useCallback(() => {
    setInvocations([]);
  }, []);

  return { invocations, trackInvocation, updateInvocation, resetInvocations };
}

export type { ToolDescriptor, ToolInvocation };
