import React from 'react';
import { asRecord, asString, LoadingToolCard, type ToolRenderProps } from '../compositor/ui-helpers';

export function TimezoneCurrentTool({ result }: ToolRenderProps) {
  const record = asRecord(result);

  if (!record) {
    return <LoadingToolCard toolName="timezone_current" message="Getting current timezone..." />;
  }

  const timezone = asString(record.timezone) ?? asString(record.tz) ?? 'Unknown';
  const offset = asString(record.offset) ?? asString(record.gmtOffset);
  const abbr = asString(record.abbr) ?? asString(record.timezoneAbbr);

  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm shadow-sm">
      <div className="font-semibold text-violet-900">Current Timezone</div>
      <div className="mt-2 text-violet-800">
        <div>
          <span className="font-medium">Timezone:</span> {timezone}
        </div>
        {offset && (
          <div className="mt-1">
            <span className="font-medium">Offset:</span> {offset}
          </div>
        )}
        {abbr && (
          <div className="mt-1">
            <span className="font-medium">Abbreviation:</span> {abbr}
          </div>
        )}
      </div>
    </div>
  );
}
