import { CalendarOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import cn from "classnames";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { ContainerProvider } from "src/Root/import";
import { StatisticsInterval, StatisticsScope } from "src/types/statistics";
import { getUser } from "src/util/authenticator";

dayjs.extend(utc);

import PendingDistributionChart from "./components/PendingDistributionChart";
import RequestCountCard from "./components/RequestCountCard";
import RequestTrendChart from "./components/RequestTrendChart";
import heroBannerLeft from "./images/left-head.png";
import heroBannerLeftM from "./images/left-head-m.png";
import heroBannerLeftS from "./images/left-head-s.png";
import heroBannerRight from "./images/right-head.png";
import heroBannerRightM from "./images/right-head-m.png";
import heroBannerRightS from "./images/right-head-s.png";

const { RangePicker } = DatePicker;

const DATE_FORMAT = "DD MMM";

const getGreeting = () => {
  const hour = dayjs().hour();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const HomePage: React.FC = () => {
  const { name } = getUser();
  const [ContainerStore] = ContainerProvider.useContext();
  const isUTC = ContainerStore.timeType?.toUpperCase() === "UTC";
  const now = () => (isUTC ? dayjs.utc() : dayjs());
  const [scope, setScope] = useState<StatisticsScope>(StatisticsScope.ALL);
  const [startDate, setStartDate] = useState<Dayjs>(() =>
    now().subtract(29, "day")
  );
  const [endDate, setEndDate] = useState<Dayjs>(() => now());

  useEffect(() => {
    setStartDate(now().subtract(29, "day"));
    setEndDate(now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUTC]);
  const [interval, setInterval] = useState<StatisticsInterval>("Day");
  const [drillWorkflow, setDrillWorkflow] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const startStr = startDate.format("YYYY-MM-DD");
  const endStr = endDate.format("YYYY-MM-DD");

  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      {/* Top bar: sticky, greeting (left) + toggle + date picker (right) */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between pl-4 pr-[30px] bg-white dark:bg-[#1a1a1a]"
        style={{ height: 56, minHeight: 56, borderBottom: "1px solid #f0f0f0" }}
      >
        {/* Left: greeting */}
        <span className="text-sm font-normal text-[#262626] dark:text-gray-200">
          {getGreeting()}, {name} !
        </span>

        {/* Right: toggle + date picker */}
        <div className="flex items-center gap-2">
          {/* Pill toggle */}
          <div
            className="flex items-center rounded-full bg-white dark:bg-[#1f1f1f] p-[4px]"
            style={{ border: "1px solid #CCCCCC" }}
          >
            <button
              onClick={() => {
                setScope(StatisticsScope.ALL);
                setDrillWorkflow(null);
              }}
              className={cn(
                "px-3 rounded-full text-sm font-medium border-none cursor-pointer transition-colors",
                "dark:text-gray-100",
                scope === StatisticsScope.ALL
                  ? "bg-[#E5F1FC] text-[#0250A3]"
                  : "bg-white text-[#00172E] hover:bg-transparent hover:text-[#0367D2]"
              )}
              style={{ height: 24, lineHeight: "19px" }}
            >
              All request
            </button>
            <button
              onClick={() => {
                setScope(StatisticsScope.INITIATOR);
                setDrillWorkflow(null);
              }}
              className={cn(
                "px-3 rounded-full text-sm font-medium border-none cursor-pointer transition-colors",
                "dark:text-gray-100",
                scope === StatisticsScope.INITIATOR
                  ? "bg-[#E5F1FC] text-[#0250A3]"
                  : "bg-white text-[#00172E] hover:bg-transparent hover:text-[#0367D2]"
              )}
              style={{ height: 24, lineHeight: "19px" }}
            >
              My request
            </button>
          </div>

          {/* Date range picker */}
          <RangePicker
            value={[startDate, endDate]}
            format={DATE_FORMAT}
            allowClear={false}
            suffixIcon={null}
            prefix={
              <CalendarOutlined style={{ color: "#00172E", fontWeight: 500 }} />
            }
            disabledDate={(d) => d.isAfter(dayjs())}
            onChange={(dates) => {
              if (dates?.[0]) setStartDate(dates[0]);
              if (dates?.[1]) setEndDate(dates[1]);
            }}
            separator="—"
            style={{
              width: 170,
              height: 32,
              backgroundColor: "#FFFFFF",
              borderColor: "#CCCCCC",
              borderRadius: 32,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "22px",
              color: "#00172E",
            }}
          />
        </div>
      </div>

      {/* Hero Banner */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{ height: 200, background: "#020B43" }}
      >
        {/* Left illustration — responsive by breakpoint */}
        <picture className="absolute left-0 top-0 pointer-events-none select-none">
          <source media="(max-width: 1180px)" srcSet={heroBannerLeftS} />
          <source media="(max-width: 1279px)" srcSet={heroBannerLeftM} />
          <img
            src={heroBannerLeft}
            alt=""
            className="pointer-events-none select-none"
            style={{ height: 200 }}
          />
        </picture>
        {/* Right illustration — responsive by breakpoint */}
        <picture className="absolute right-0 top-0 pointer-events-none select-none">
          <source media="(max-width: 1180px)" srcSet={heroBannerRightS} />
          <source media="(max-width: 1279px)" srcSet={heroBannerRightM} />
          <img
            src={heroBannerRight}
            alt=""
            className="pointer-events-none select-none"
            style={{ height: 200 }}
          />
        </picture>
        {/* Centred text — independent of image widths */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
          <h2 className="text-white text-3xl font-bold m-0 mb-2 leading-tight">
            Flowzero
          </h2>
          <p className="text-white/80 text-sm max-w-[420px] leading-relaxed m-0">
            Monitor your request volumes, track ongoing operational steps, and
            analyze historical throughput performance metrics across the system
          </p>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "grid gap-x-4 gap-y-3 px-[30px] pt-[24px] pb-[40px]",
          "grid-cols-[1fr_288px] grid-rows-[215px_563px]",
          "lg-xl:grid-cols-[1fr_297px] lg-xl:grid-rows-[215px_339px]",
          "[@media(min-width:1280px)]:grid-cols-[1fr_355px]"
        )}
      >
        {/* RequestCountCard: <lg → span 2 cols row1; >=lg → left col row1 */}
        <div
          className={cn(
            "col-span-2 row-start-1 h-[215px]",
            "lg-xl:col-span-1 lg-xl:col-start-1"
          )}
        >
          <RequestCountCard
            startDate={startStr}
            endDate={endStr}
            scope={scope}
            refreshKey={refreshKey}
            onRefresh={handleRefresh}
          />
        </div>

        {/* RequestTrendChart: always col1 row2 */}
        <div
          className={cn(
            "col-start-1 row-start-2 h-[563px] min-w-0 overflow-hidden",
            "lg-xl:h-[339px]",
            "xl:h-[339px]"
          )}
        >
          <RequestTrendChart
            startDate={startStr}
            endDate={endStr}
            scope={scope}
            interval={interval}
            onIntervalChange={setInterval}
            workflowName={drillWorkflow}
            refreshKey={refreshKey}
          />
        </div>

        {/* PendingDistributionChart: <lg → row2 col2; >=lg → row1-2 col2 */}
        <div
          className={cn(
            "col-start-2 row-start-2 min-h-0 overflow-hidden items-start",
            "lg-xl:row-start-1 lg-xl:row-span-2"
          )}
        >
          <PendingDistributionChart
            startDate={startStr}
            endDate={endStr}
            scope={scope}
            drillWorkflow={drillWorkflow}
            onDrillDown={setDrillWorkflow}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
