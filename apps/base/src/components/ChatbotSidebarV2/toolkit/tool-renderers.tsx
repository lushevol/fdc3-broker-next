import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from 'chat-protocol-ui';

type ToolRenderProps = {
  args: Record<string, unknown>;
  result?: unknown;
};

type UsageTrendPoint = {
  timestamp: string;
  uv: number;
};

type UsageStatisticsViewModel = {
  appLabel: string;
  startTime?: string;
  endTime?: string;
  uv?: number;
  trendPoints: UsageTrendPoint[];
  bucket?: string;
  supportsTrend: boolean;
};

const usageTrendChartConfig = {
  uv: { label: 'UV', color: '#059669' },
} satisfies ChartConfig;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }

  return value as Record<string, unknown>;
}

function asNumber(value: unknown): number | undefined {
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

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function formatUsageDateLabel(value?: string): string {
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

function formatUsageTick(value: string, bucket?: string): string {
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

function summarizeTrend(values: UsageTrendPoint[]): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return values.reduce((sum, point) => sum + point.uv, 0);
}

function normalizeTrendPoints(resultRecord: Record<string, unknown>): UsageTrendPoint[] {
  const trendPoints = Array.isArray(resultRecord.trendPoints) ? resultRecord.trendPoints : [];
  if (trendPoints.length > 0) {
    return trendPoints
      .map((point) => asRecord(point))
      .filter((point): point is Record<string, unknown> => Boolean(point))
      .map((point) => ({
        timestamp: asString(point.timestamp) ?? '',
        uv: asNumber(point.uv) ?? 0,
      }))
      .filter((point) => point.timestamp);
  }

  const points = Array.isArray(resultRecord.points) ? resultRecord.points : [];
  return points
    .map((point) => asRecord(point))
    .filter((point): point is Record<string, unknown> => Boolean(point))
    .map((point) => ({
      timestamp:
        asString(point.timestamp) ??
        asString(point.startTime) ??
        asString(point.bucketStartTime) ??
        '',
      uv: asNumber(point.uv) ?? 0,
    }))
    .filter((point) => point.timestamp)
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}

function normalizeUsageStatistics(
  args: Record<string, unknown>,
  result: unknown,
): UsageStatisticsViewModel | undefined {
  const resultRecord = asRecord(result);
  if (!resultRecord) {
    return undefined;
  }

  const bucket =
    asString(resultRecord.bucket) ??
    asString(args.bucket) ??
    (normalizeTrendPoints(resultRecord).length > 1 ? 'HOUR' : undefined);
  const trendPoints = normalizeTrendPoints(resultRecord);
  const supportsTrend =
    Array.isArray(resultRecord.trendPoints) || Array.isArray(resultRecord.points);

  const uv = asNumber(resultRecord.uv) ?? summarizeTrend(trendPoints);
  const appLabel =
    asString(resultRecord.application) ?? asString(args.application) ?? 'Unknown application';

  return {
    appLabel,
    startTime: asString(resultRecord.startTime) ?? asString(args.startTime),
    endTime: asString(resultRecord.endTime) ?? asString(args.endTime),
    uv,
    trendPoints,
    bucket,
    supportsTrend,
  };
}

function LoadingToolCard({ toolName, message }: { toolName: string; message: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
      <div className="font-medium text-slate-900">{toolName}</div>
      <div className="mt-1">{message}</div>
    </div>
  );
}

function JsonToolCard({
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

export function SummaryComposeTool({ result }: ToolRenderProps) {
  if (result === undefined) {
    return <LoadingToolCard toolName="summary_compose" message="Composing summary..." />;
  }

  const record = asRecord(result);
  const summary =
    typeof result === 'string' ? result : (asString(record?.summary) ?? asString(record?.text));

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm shadow-sm">
      <div className="font-medium text-sky-900">Summary</div>
      <div className="mt-1 text-sky-800">{summary ?? 'No summary returned.'}</div>
    </div>
  );
}

export function ProfileLookupTool({ args, result }: ToolRenderProps) {
  return (
    <JsonToolCard
      toolName="profile_lookup"
      title={`Profile: ${String(args.userId ?? 'unknown')}`}
      result={result}
      emptyMessage="No profile details were returned."
    />
  );
}

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

function UsageStatisticsCard({ usage }: { usage: UsageStatisticsViewModel }) {
  const chartData = usage.trendPoints.map((point) => ({
    tick: formatUsageTick(point.timestamp, usage.bucket),
    uv: point.uv,
  }));

  return (
    <div
      data-testid="usage-statistics-card"
      className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_20px_48px_-32px_rgba(15,23,42,0.28)]"
    >
      <div className="text-base font-semibold tracking-[-0.02em] text-slate-900">
        {usage.appLabel}
      </div>
      <div className="mt-1 text-sm text-slate-500">
        {formatUsageDateLabel(usage.startTime)} - {formatUsageDateLabel(usage.endTime)}
      </div>

      <div className="mt-4">
        <div
          data-testid="usage-statistics-uv-tile"
          className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_24px_-24px_rgba(15,23,42,0.28)]"
        >
          <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Visited Users</div>
          <div className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            {(usage.uv ?? 0).toLocaleString()}
          </div>
        </div>
      </div>

      {usage.supportsTrend ? (
        chartData.length > 0 ? (
          <div className="mt-4 grid gap-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <UsageTrendChart
              label="Hourly UV Trend"
              data={chartData}
              dataKey="uv"
              stroke="var(--color-uv)"
            />
          </div>
        ) : (
          <div className="mt-4 rounded-[22px] border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            No trend points were returned for this query.
          </div>
        )
      ) : null}
    </div>
  );
}

function UsageTrendChart({
  label,
  data,
  dataKey,
  stroke,
}: {
  label: string;
  data: Array<{ tick: string; uv: number }>;
  dataKey: 'uv';
  stroke: string;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <ChartContainer className="h-40 w-full" config={usageTrendChartConfig}>
        <LineChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="tick" tickLine={false} minTickGap={20} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line dataKey={dataKey} dot={false} stroke={stroke} strokeWidth={2.5} type="monotone" />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export function AnalyticsTool({ args, result }: ToolRenderProps) {
  if (result === undefined) {
    return (
      <LoadingToolCard
        toolName="analytics"
        message={`Looking up analytics for ${String(args.application ?? 'the selected application')}...`}
      />
    );
  }

  const usage = normalizeUsageStatistics(args, result);
  if (!usage) {
    return (
      <JsonToolCard
        toolName="analytics"
        title={`Analytics: ${String(args.application ?? 'unknown')}`}
        result={result}
        emptyMessage="No analytics data was returned."
      />
    );
  }

  return <UsageStatisticsCard usage={usage} />;
}

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
