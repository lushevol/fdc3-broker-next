import React from 'react';
import { asRecord, asString, type ToolRenderProps } from '../../compositor';

export function Fdc3WorkflowTranscriptTool({ result }: ToolRenderProps) {
  const transcript = asRecord(result);
  const completedSteps = Array.isArray(transcript?.completedSteps) ? transcript.completedSteps : [];
  const status = asString(transcript?.status) ?? 'running';

  return (
    <div data-testid="fdc3-workflow-transcript" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-950">FDC3 Workflow Result</div>
          <div className="mt-1 text-slate-600">
            {asString(transcript?.summary) ?? 'No workflow transcript was returned.'}
          </div>
        </div>
        <div className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-700">
          {status}
        </div>
      </div>
      {completedSteps.length ? (
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-slate-700">
          {completedSteps.map((step, index) => {
            const record = asRecord(step);
            return <li key={`${asString(record?.stepId) ?? 'step'}-${index}`}>{asString(record?.stepId) ?? 'Workflow step'}: {asString(record?.status) ?? 'completed'}</li>;
          })}
        </ol>
      ) : null}
    </div>
  );
}
