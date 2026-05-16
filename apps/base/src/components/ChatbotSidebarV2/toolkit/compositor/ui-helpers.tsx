import React from 'react';

export type ToolRenderProps = {
  args: Record<string, unknown>;
  result?: unknown;
};

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

export function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

export function formatUsageDateLabel(value?: string): string {
  if (!value) {
    return 'Unknown';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatUsageTick(value: string, bucket?: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  if (bucket === 'HOUR') {
    return parsed.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
  }

  return formatUsageDateLabel(value);
}

export function formatWindowLabel(startTime?: string, endTime?: string): string {
  return `${formatUsageDateLabel(startTime)} - ${formatUsageDateLabel(endTime)}`;
}

export function initialsForUser(userId: string): string {
  const segments = userId.split(/[._-]/).filter(Boolean);
  if (segments.length >= 2) {
    return `${segments[0][0]}${segments[1][0]}`.toUpperCase();
  }
  return userId.slice(0, 2).toUpperCase();
}

export function summarizeTrend(
  values: Array<{ timestamp: string; uv: number }>,
): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return values.reduce((sum, point) => sum + point.uv, 0);
}

export function loadingToolCard({
  toolName,
  message,
}: {
  toolName: string;
  message: string;
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
      <div className="font-medium text-slate-900">{toolName}</div>
      <div className="mt-1">{message}</div>
    </div>
  );
}

export function LoadingToolCard({
  toolName,
  message,
}: {
  toolName: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
      <div className="font-medium text-slate-900">{toolName}</div>
      <div className="mt-1">{message}</div>
    </div>
  );
}

export function JsonToolCard({
  toolName,
  title,
  result,
  emptyMessage,
}: {
  toolName: string;
  title: string;
  result: unknown;
  emptyMessage: string;
}) {
  if (result === undefined) {
    return <LoadingToolCard toolName={toolName} message={`${title} is running...`} />;
  }

  const resultRecord = asRecord(result);
  const isEmptyObject = resultRecord && Object.keys(resultRecord).length === 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
      <div className="font-medium text-slate-900">{title}</div>
      <div className="mt-2 text-slate-600">
        {isEmptyObject ? (
          emptyMessage
        ) : (
          <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(result, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}
