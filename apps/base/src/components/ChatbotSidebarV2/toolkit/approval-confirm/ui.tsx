import React from 'react';
import { asRecord, LoadingToolCard, type ToolRenderProps } from '../compositor/ui-helpers';

export function ApprovalConfirmTool({
  args,
  interrupt,
  resume,
  result,
}: ToolRenderProps & {
  interrupt?: { type: 'human'; payload: unknown };
  resume?: (payload: { confirmed: boolean }) => void;
}) {
  const toolArgs = args as { to?: string; subject?: string; body?: string } | undefined;
  const record = asRecord(result);
  const confirmed = record?.confirmed === true;

  if (record) {
    return (
      <div
        className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
          confirmed
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-rose-200 bg-rose-50 text-rose-900'
        }`}
      >
        <span className="font-medium">{confirmed ? 'Email Sent' : 'Cancelled'}</span>
        {confirmed && toolArgs?.to && <span> to {toolArgs.to}</span>}
      </div>
    );
  }

  if (interrupt) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
        <div className="text-sm font-semibold text-amber-900">Confirm Email</div>
        <div className="mt-2 text-sm text-amber-800">
          <p>To: {toolArgs?.to ?? ''}</p>
          <p>Subject: {toolArgs?.subject ?? ''}</p>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => resume?.({ confirmed: true })}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
          >
            Send
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
    <LoadingToolCard
      toolName="approval_confirm"
      message={`Preparing email to ${toolArgs?.to ?? '...'}...`}
    />
  );
}
