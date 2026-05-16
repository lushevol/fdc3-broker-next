import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from 'chat-protocol-ui';
import { formatUsageTick, formatUsageDateLabel } from './ui-helpers';
import type { UsageStatisticsViewModel } from './normalize';

const usageTrendChartConfig = {
  uv: { label: 'UV', color: '#059669' },
} satisfies ChartConfig;

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

export function UsageStatisticsCard({ usage }: { usage: UsageStatisticsViewModel }) {
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
