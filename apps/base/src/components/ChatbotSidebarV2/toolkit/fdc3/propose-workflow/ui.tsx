import React from 'react';
import {
  asRecord,
  asString,
  type ToolRenderProps,
} from '../../compositor';
import { getFdc3ChatWorkflowDefinition } from '../shared/declarations';

export function Fdc3WorkflowApprovalTool({
  args,
  interrupt,
  resume,
  result,
}: ToolRenderProps & {
  interrupt?: { type: 'human'; payload: unknown };
  resume?: (payload: { confirmed: boolean }) => void;
}) {
  const approvalResult = asRecord(result);
  const confirmed = approvalResult?.confirmed;
  const input = asRecord(args.input) ?? {};
  const workflowId = asString(args.workflowId) ?? 'Unknown';
  const workflow = getFdc3ChatWorkflowDefinition(workflowId);

  if (typeof confirmed === 'boolean') {
    return (
      <div
        className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
          confirmed
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-rose-200 bg-rose-50 text-rose-900'
        }`}
      >
        <div className="font-medium">
          {confirmed ? 'FDC3 workflow approved' : 'FDC3 workflow cancelled'}
        </div>
        <div className="mt-1 text-xs opacity-80">
          {workflowId}
        </div>
      </div>
    );
  }

  if (interrupt) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
        <div className="text-sm font-semibold text-amber-900">Approve FDC3 workflow</div>
        <div className="mt-2 text-xs text-amber-900">
          <span className="font-semibold">Workflow:</span> {workflow?.title ?? workflowId}
        </div>
        {typeof args.originalRequest === 'string' ? (
          <div className="mt-1 text-xs text-amber-900">
            <span className="font-semibold">Request:</span> {args.originalRequest}
          </div>
        ) : null}
        <div className="mt-3 rounded-xl border border-amber-200 bg-white/70 p-3">
          {workflow?.steps.length ? (
            <>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-900">
                Planned Steps
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-slate-700">
                {workflow.steps.map((step) => (
                  <li key={step.id}>
                    <span className="font-medium">{step.id}</span> — {step.intent}
                  </li>
                ))}
              </ol>
            </>
          ) : null}
          <div className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-900">
            Workflow Input
          </div>
          <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-slate-700">
            {JSON.stringify(input, null, 2)}
          </pre>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => resume?.({ confirmed: true })}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => resume?.({ confirmed: false })}
            className="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm shadow-sm">
      <div className="font-medium text-amber-900">FDC3 workflow</div>
      <div className="mt-1 text-amber-800">
        {asString(args.workflowId) ?? 'Unknown workflow'}
      </div>
    </div>
  );
}
