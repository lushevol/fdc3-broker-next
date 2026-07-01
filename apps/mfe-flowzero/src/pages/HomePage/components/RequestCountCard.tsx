import { Skeleton } from "antd";
import cn from "classnames";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useCallback, useEffect, useState } from "react";
import { getRequestCount } from "src/api/statistics/Statistics";
import refreshIcon from "src/icon/refresh.svg";
import { ContainerProvider } from "src/Root/import";
import type { RequestCountVo, StatisticsScope } from "src/types/statistics";

dayjs.extend(utc);

interface RequestCountCardProps {
  startDate: string;
  endDate: string;
  scope: StatisticsScope;
  refreshKey?: number;
  onRefresh?: () => void;
}

const getOrdinal = (n: number): string => {
  const v = n % 100;
  const suffix =
    v >= 11 && v <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
};

const formatUpdatedTime = (d: dayjs.Dayjs, isUTC: boolean): string => {
  const t = isUTC ? d.utc() : d.local();
  const zone = isUTC ? "UTC" : "Local";
  return `Updated on ${getOrdinal(t.date())} ${t.format(
    "MMM YYYY"
  )} at ${t.format("HH:mm:ss")} ${zone}`;
};

interface KpiItemProps {
  label: string;
  description: string;
  value: number | undefined;
  loading: boolean;
}

const KpiItem: React.FC<KpiItemProps> = ({
  label,
  description,
  value,
  loading,
}) => (
  <div className="flex-1 min-w-0 flex items-center gap-3 pl-5 h-[90px] overflow-hidden">
    <div
      className="shrink-0 flex flex-col overflow-hidden"
      style={{ width: 4, height: 90, borderRadius: 32 }}
    >
      <div style={{ flex: 1, background: "#0473EA" }} />
      <div style={{ flex: 1, background: "#38D200" }} />
    </div>

    {/* Number + label */}
    <div className="flex items-center gap-4 min-w-0">
      {loading ? (
        <div
          style={{
            width: 56,
            height: 64,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Skeleton active paragraph={false} title={{ width: 48 }} />
        </div>
      ) : (
        <span
          className="font-bold text-[#0D0D0D] dark:text-gray-100 shrink-0"
          style={{ fontSize: 48, lineHeight: "64px" }}
        >
          {value ?? 0}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#262626] dark:text-gray-200 m-0 leading-[22px]">
          {label}
        </p>
        <p className="text-xs text-[#4D4D4D] dark:text-gray-400 m-0 leading-[16px] line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const RequestCountCard: React.FC<RequestCountCardProps> = ({
  startDate,
  endDate,
  scope,
  refreshKey,
  onRefresh,
}) => {
  const [ContainerStore] = ContainerProvider.useContext();
  const isUTC = ContainerStore.timeType?.toUpperCase() === "UTC";
  const [data, setData] = useState<RequestCountVo>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<dayjs.Dayjs | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    getRequestCount({ startDate, endDate, scope })
      .then((res) => {
        setData(res ?? {});
        setLastUpdated(dayjs.utc());
      })
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, [startDate, endDate, scope]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="bg-white dark:bg-[#1a1a1a] flex flex-col h-full"
      style={{ borderRadius: 6, paddingTop: 24, paddingBottom: 24, gap: 8 }}
    >
      {/* Header */}
      <div className="px-6">
        <p
          className="m-0 font-medium text-[#262626] dark:text-gray-100"
          style={{ fontSize: 18, lineHeight: "26px" }}
        >
          Request Overview
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[#4D4D4D] dark:text-gray-400"
            style={{ fontSize: 12, lineHeight: "16px" }}
          >
            {lastUpdated ? formatUpdatedTime(lastUpdated, isUTC) : "\u00a0"}
          </span>
          <button
            onClick={() => {
              onRefresh ? onRefresh() : fetchData();
            }}
            disabled={loading}
            className="flex items-center justify-center border-none bg-transparent cursor-pointer p-0 text-[#0473EA] hover:opacity-70 disabled:opacity-40"
          >
            <img
              src={refreshIcon}
              alt="refresh"
              className={cn("w-3.5 h-3.5", loading && "animate-spin")}
            />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="shrink-0" style={{ height: 1, background: "#CCCCCC" }} />

      {/* KPI row */}
      <div
        className="flex items-center"
        style={{ paddingTop: 16, paddingRight: 24 }}
      >
        <KpiItem
          label="Total Request"
          description="Centralized view of all requests"
          value={data.total}
          loading={loading}
        />
        <KpiItem
          label="In Progress Request"
          description="Active requests awaiting completion"
          value={data.open}
          loading={loading}
        />
        <KpiItem
          label="Complete Request"
          description="Finalized requests"
          value={data.closed}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default RequestCountCard;
