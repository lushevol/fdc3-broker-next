import { Button, Skeleton, Tooltip } from "antd";
import cn from "classnames";
import * as echarts from "echarts";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getPendingDistribution } from "src/api/statistics/Statistics";
import refreshIcon from "src/icon/refresh.svg";
import tooltipIcon from "src/icon/tooltip.svg";
import { ReactRouterDom } from "src/Root/import";
import type {
  StatisticsScope,
  TaskPendingNode,
  WorkflowPendingNode,
} from "src/types/statistics";

const { useNavigate } = ReactRouterDom;

const SLICE_COLORS = [
  "#1677ff", // blue
  "#52c41a", // green
  "#f0197d", // hot pink
  "#fa8c16", // orange
  "#722ed1", // purple
  "#13c2c2", // cyan
  "#a0d911", // lime
  "#fa541c", // orange-red
  "#7e3f8f", // dark purple
  "#3f51b5", // indigo
  "#880e4f", // maroon
  "#ff9800", // amber
];

interface PendingDistributionChartProps {
  startDate: string;
  endDate: string;
  scope: StatisticsScope;
  drillWorkflow: string | null;
  onDrillDown: (workflowName: string | null) => void;
  refreshKey?: number;
}

interface PieItem {
  name: string;
  value: number;
  taskKey?: string;
}

const PendingDistributionChart: React.FC<PendingDistributionChartProps> = ({
  startDate,
  endDate,
  scope,
  drillWorkflow,
  onDrillDown,
  refreshKey,
}) => {
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const [loading, setLoading] = useState(false);
  const [pieData, setPieData] = useState<PieItem[]>([]);
  const [total, setTotal] = useState(0);

  const resizeHandler = useCallback(() => {
    chartInstance.current?.resize();
  }, []);

  // Load data
  useEffect(() => {
    setLoading(true);
    getPendingDistribution({
      startDate,
      endDate,
      scope,
      workflowName: drillWorkflow ?? undefined,
    })
      .then((res: WorkflowPendingNode[]) => {
        if (drillWorkflow) {
          // Drill-down view: tasks within the selected workflow
          const workflow = res?.[0];
          const items: PieItem[] = (workflow?.tasks ?? [])
            .filter((t: TaskPendingNode) => (t.pendingCount ?? 0) > 0)
            .map((t: TaskPendingNode) => ({
              name: t.taskName ?? "",
              value: t.pendingCount ?? 0,
              taskKey: t.taskKey,
            }));
          setPieData(items);
          setTotal(workflow?.pendingCount ?? 0);
        } else {
          // Top-level view: all workflows
          const items: PieItem[] = (res ?? [])
            .filter((w: WorkflowPendingNode) => (w.pendingCount ?? 0) > 0)
            .map((w: WorkflowPendingNode) => ({
              name: w.workflowName ?? "",
              value: w.pendingCount ?? 0,
            }));
          setPieData(items);
          setTotal(items.reduce((sum, i) => sum + i.value, 0));
        }
      })
      .catch(() => {
        setPieData([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [startDate, endDate, scope, drillWorkflow, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Init / update chart
  useEffect(() => {
    const dom = chartRef.current;
    if (!dom) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(dom);
      window.addEventListener("resize", resizeHandler);
    }

    const option: echarts.EChartsCoreOption = {
      tooltip: { show: false },
      color: SLICE_COLORS,
      graphic: [
        {
          type: "group",
          left: "center",
          top: "middle",
          children: [
            {
              type: "text",
              style: {
                text: "Total",
                textAlign: "center",
                fill: "#999",
                fontSize: 11,
                fontWeight: "normal",
                x: 0,
                y: -14,
              },
            },
            {
              type: "text",
              style: {
                text: `${total}`,
                textAlign: "center",
                fill: "#1a1a1a",
                fontSize: 32,
                fontWeight: "bold",
                x: 0,
                y: 10,
              },
            },
          ],
        },
      ],
      series: [
        {
          type: "pie",
          radius: ["45%", "78%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          label: {
            show: pieData.length > 0,
            formatter: "{c}",
            fontSize: 11,
            fontWeight: "bold",
            color: "#fff",
            position: "inside",
            align: "center",
            verticalAlign: "middle",
          },
          labelLine: { show: false },
          data:
            pieData.length > 0
              ? pieData
              : [
                  {
                    value: 1,
                    name: "",
                    itemStyle: { color: "#f0f0f0" },
                    label: { show: false },
                    emphasis: { disabled: true },
                  },
                ],
          emphasis: {
            scale: false,
            disabled: true,
          },
        },
      ],
    };

    chartInstance.current.setOption(option, true);

    // Click handler
    chartInstance.current.off("click");
    chartInstance.current.on("click", (params: any) => {
      if (!params.data?.name) return;
      if (drillWorkflow) {
        // Drilled: click on a task step → navigate to task list
        const item = pieData.find((d) => d.name === params.data.name);
        if (item?.name) {
          navigate(
            `/flowzero/assign-to-me?workflowName=${encodeURIComponent(
              drillWorkflow
            )}&taskName=${encodeURIComponent(
              item?.name
            )}&taskKey=${encodeURIComponent(item?.taskKey ?? "")}`
          );
        }
      } else {
        // Top-level: drill into workflow
        onDrillDown(params.data.name);
      }
    });

    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
      window.removeEventListener("resize", resizeHandler);
    };
  }, [pieData, total, drillWorkflow, onDrillDown, navigate, resizeHandler]);

  const handleCenterClick = () => {
    if (drillWorkflow) {
      navigate(
        `/flowzero/assign-to-me?workflowName=${encodeURIComponent(
          drillWorkflow
        )}`
      );
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl",
        "bg-white dark:bg-[#1a1a1a] p-4 min-w-0",
        "max-h-full",
        "shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
      )}
    >
      {/* Header */}
      <div
        className="flex flex-col items-center text-center mb-3 mt-2"
        style={{ gap: 4 }}
      >
        {/* Title */}
        <p
          className="m-0 leading-snug text-[#262626] dark:text-gray-100"
          style={{
            width: 274,
            fontWeight: 500,
            fontSize: 18,
            lineHeight: "26px",
          }}
        >
          {drillWorkflow
            ? "In Progress Task distributed by Workflow Step"
            : "In Progress Request distributed by Workflow"}
        </p>
        {/* Subtitle row: text + icon centered; Reset button absolute right */}
        <div
          className="relative w-full flex items-center justify-center"
          style={{ gap: 10 }}
        >
          <Tooltip title={drillWorkflow ?? undefined} placement="bottom">
            <p
              // className="text-xs m-0 max-w-[170px] truncate"
              className={cn(
                "text-xs m-0 truncate",
                drillWorkflow ? "max-w-[150px]" : "max-w-[180px]"
              )}
              style={{ color: "#4D4D4D", lineHeight: "16px" }}
            >
              {drillWorkflow ? drillWorkflow : "Click a workflow to drill down"}
            </p>
          </Tooltip>
          <Tooltip
            title={
              drillWorkflow
                ? "The pie chart illustrates the distribution of in progress tasks across workflow steps for the selected workflow. Within Parallel or Inclusive Gateway scenarios, a request may generate multiple concurrent tasks, the aggregate task count may exceed the total request count."
                : "The pie chart illustrates the distribution of in progress requests across workflows."
            }
          >
            <img
              src={tooltipIcon}
              alt="info"
              className="w-3.5 h-3.5 cursor-default flex-shrink-0"
            />
          </Tooltip>
          {drillWorkflow && (
            <Button
              size="small"
              icon={
                <img src={refreshIcon} alt="reset" className="w-3.5 h-3.5" />
              }
              onClick={() => onDrillDown(null)}
              className="absolute right-0 flex items-center text-xs rounded-full border-[#d9d9d9]"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="-mx-4 border-t border-[#CCCCCC]"></div>

      {/* Chart + Legend */}
      {loading ? (
        <div className="mt-4 flex-1 flex items-center justify-center">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : (
        <div className="flex flex-col">
          {/* ECharts donut */}
          <div className="relative w-full" style={{ height: 288 }}>
            <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
            {/* Invisible overlay over center for click-to-navigate */}
            {drillWorkflow && (
              <div
                className="absolute cursor-pointer rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 90,
                  height: 90,
                }}
                onClick={handleCenterClick}
              />
            )}
          </div>

          {/* Custom legend — single column full width */}
          <div
            className={cn(
              "flex flex-col gap-y-2 mb-3",
              pieData.length > 4
                ? "max-h-[140px] overflow-y-auto"
                : "overflow-visible"
            )}
          >
            {pieData.map((item, idx) => {
              const color = SLICE_COLORS[idx % SLICE_COLORS.length];
              return (
                <div
                  key={item.name}
                  className="flex items-center gap-2 cursor-pointer bg-[#F5F5F7] dark:bg-[#1f1f1f] rounded-lg px-3 py-[3px] transition-colors hover:border-[#91caff] dark:hover:border-[#4096ff] w-full"
                  onClick={() => {
                    if (drillWorkflow) {
                      if (item.name) {
                        navigate(
                          `/flowzero/assign-to-me?workflowName=${encodeURIComponent(
                            drillWorkflow
                          )}&taskName=${encodeURIComponent(
                            item.name
                          )}&taskKey=${encodeURIComponent(item.taskKey ?? "")}`
                        );
                      }
                    } else {
                      onDrillDown(item.name);
                    }
                  }}
                >
                  <span
                    className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1 min-w-0">
                    {item.name}
                  </span>
                  <span
                    className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0 flex items-center justify-center min-w-[24px] px-1.5 h-6"
                    style={{ backgroundColor: "#E5E5E5", borderRadius: 28 }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
            {pieData.length === 0 && !loading && (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-2">
                No pending requests
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingDistributionChart;
