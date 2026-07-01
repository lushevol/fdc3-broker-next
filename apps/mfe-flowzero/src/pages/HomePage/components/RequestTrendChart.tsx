import { Skeleton, Tooltip } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import * as echarts from "echarts";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getRequestTrend } from "src/api/statistics/Statistics";
import tooltipIcon from "src/icon/tooltip.svg";
import type {
  RequestTrendVo,
  StatisticsInterval,
  StatisticsScope,
} from "src/types/statistics";

import GranularityToggle from "./GranularityToggle";

interface RequestTrendChartProps {
  startDate: string;
  endDate: string;
  scope: StatisticsScope;
  interval: StatisticsInterval;
  onIntervalChange: (v: StatisticsInterval) => void;
  workflowName: string | null;
  refreshKey?: number;
}

// Maps API series name (lower) → display label & color
const SERIES_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: "In Progress", color: "#0473EA" },
  closed: { label: "Complete", color: "#52AB69" },
};

const DEFAULT_COLOR = "#F5A623";

const RequestTrendChart: React.FC<RequestTrendChartProps> = ({
  startDate,
  endDate,
  scope,
  interval,
  onIntervalChange,
  workflowName,
  refreshKey,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<RequestTrendVo>({});

  const resizeHandler = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  useEffect(() => {
    setLoading(true);
    getRequestTrend({
      startDate,
      endDate,
      scope,
      interval,
      workflowName: workflowName ?? undefined,
    })
      .then((res) => setTrendData(res ?? {}))
      .catch(() => setTrendData({}))
      .finally(() => setLoading(false));
  }, [startDate, endDate, scope, interval, workflowName, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const dom = chartRef.current;
    if (!dom) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(dom);
      window.addEventListener("resize", resizeHandler);
    }

    const labels = trendData.labels ?? [];
    const series = trendData.series ?? [];

    const hasOnePoint = labels.length <= 1;

    const mappedSeries = series.map(({ name, values = [] }) => {
      const key = name?.toLowerCase() ?? "";
      const cfg = SERIES_CONFIG[key];
      const color = cfg?.color ?? DEFAULT_COLOR;
      const displayName = cfg?.label ?? name ?? key;
      return {
        name: displayName,
        type: "line",
        data: labels.map((l, i) => [l, values[i] ?? 0]),
        smooth: true,
        showSymbol: hasOnePoint,
        symbolSize: hasOnePoint ? 8 : 4,
        itemStyle: { color },
        lineStyle: { color, width: 2 },
      };
    });

    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: "axis",
        formatter: (params: any[]) => {
          if (!params?.length) return "";
          const label = dayjs(params[0].axisValue).format("DD MMM YYYY");
          const lines = params
            .map(
              (p) =>
                `<div style="display:flex;align-items:center;gap:6px;">${p.marker}<span>${p.seriesName}</span><b>${p.value[1]}</b></div>`
            )
            .join("");
          return `<div>${label}</div>${lines}`;
        },
      },
      legend: { show: false },
      grid: {
        top: 36,
        bottom: 20,
        left: 5,
        right: 20,
        containLabel: true,
      },
      xAxis: {
        type: "time",
        axisLine: { lineStyle: { color: "#d9d9d9" } },
        axisLabel: { fontSize: 11, color: "#888", margin: 20 },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        axisLabel: { fontSize: 11, color: "#888" },
        splitLine: { lineStyle: { color: "#e8e8e8", type: "dashed" } },
      },
      series: mappedSeries,
    };

    chartInstance.current.setOption(option, true);

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        chartInstance.current?.resize();
      });
    });
    ro.observe(dom);

    return () => {
      ro.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
      window.removeEventListener("resize", resizeHandler);
    };
  }, [trendData, resizeHandler]);

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl",
        "bg-white dark:bg-[#1a1a1a] p-4",
        "shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
      )}
    >
      {/* Header row */}
      <div className="mb-1 mx-[10px] pb-[8px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 10 }}>
            <p
              className="m-0 leading-snug text-[#262626] dark:text-gray-100"
              style={{ fontWeight: 500, fontSize: 18, lineHeight: "26px" }}
            >
              {workflowName ? "Task Trend" : "Request Trend"}
            </p>
            <Tooltip
              title={
                workflowName
                  ? "The line chart illustrates the over-time trend of tasks by status, tracking in progress and complete volumes across the selected period for the selected workflow."
                  : "The line chart illustrates the over-time trend of requests by status, tracking in progress and complete volumes across the selected period."
              }
            >
              <img
                src={tooltipIcon}
                alt="info"
                className="w-3.5 h-3.5 cursor-default"
              />
            </Tooltip>
          </div>
          <GranularityToggle value={interval} onChange={onIntervalChange} />
        </div>
        {workflowName && (
          <p className="text-xs text-gray-400 dark:text-gray-500 m-0 mt-0.5">
            {workflowName}
          </p>
        )}
        <div className="flex items-center gap-4 mt-1">
          {Object.values(SERIES_CONFIG).map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="-mx-4 border-t border-[#CCCCCC]"></div>

      {loading ? (
        <Skeleton
          active
          paragraph={{ rows: 5 }}
          title={false}
          className="mt-3"
        />
      ) : (
        <div
          ref={chartRef}
          className="flex-1 w-full min-w-0"
          style={{ minHeight: 0 }}
        />
      )}
    </div>
  );
};

export default RequestTrendChart;
