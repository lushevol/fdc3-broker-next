import React from 'react';
import {
  asRecord,
  asString,
  LoadingToolCard,
  type ToolRenderProps,
} from '../compositor/ui-helpers';

export function ResolveRelativeDateTool({ args, result }: ToolRenderProps) {
  const record = asRecord(result);
  if (!record) {
    return (
      <LoadingToolCard
        toolName="resolve_relative_date"
        message={`Resolving "${String(args.expression ?? '')}"...`}
      />
    );
  }

  const resolvedDate = asString(record.resolvedDate);
  const readable = asString(record.readable) ?? asString(record.dayOfWeek);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm shadow-sm">
      <div className="font-medium text-amber-900">Date resolved</div>
      <div className="mt-1 text-amber-800">
        {resolvedDate ?? 'Unknown date'}
        {readable ? ` (${readable})` : ''}
      </div>
    </div>
  );
}
