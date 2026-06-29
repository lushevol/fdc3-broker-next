import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  asRecord,
  asString,
  LoadingToolCard,
  type ToolRenderProps,
} from '../../compositor';

type FlowzeroWorkflowGenerationToolProps = ToolRenderProps & {
  openFlowzeroWorkflow?: (route: string) => void | Promise<void>;
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
}

export function FlowzeroWorkflowGenerationTool({
  args,
  result,
  openFlowzeroWorkflow,
}: FlowzeroWorkflowGenerationToolProps) {
  if (result === undefined) {
    return (
      <LoadingToolCard
        toolName="generate_flowzero_workflow"
        message={`Creating ${String(args.workflowName ?? 'a Flowzero workflow')}...`}
      />
    );
  }

  const record = asRecord(result);
  if (!record) {
    return (
      <LoadingToolCard
        toolName="generate_flowzero_workflow"
        message="Flowzero workflow result is not available yet."
      />
    );
  }

  const workflowName =
    asString(record.workflowName) ?? asString(args.workflowName) ?? 'Generated workflow';
  const status = asString(record.status) ?? 'DRAFT';
  const summary = asString(record.summary) ?? 'Workflow draft created.';
  const steps = asStringArray(record.steps);
  const open = asRecord(record.open);
  const openLabel = asString(open?.label) ?? 'Open in Flowzero';
  const openRoute = asString(open?.route);

  const handleOpen = () => {
    if (openRoute) {
      void openFlowzeroWorkflow?.(openRoute);
    }
  };

  return (
    <div
      data-testid="flowzero-workflow-card"
      className="rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-950">
            {workflowName}
          </div>
          <div className="mt-1 text-slate-600">{summary}</div>
        </div>
        <div className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
          {status}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-slate-500">
          {steps.length > 0 ? `${steps.length} steps` : 'Workflow draft'}
        </div>
        {openRoute ? (
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {openLabel}
            <ArrowUpRight aria-hidden="true" size={14} strokeWidth={2.2} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
