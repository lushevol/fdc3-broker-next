import type { ICellRendererParams } from "ag-grid-community";
import { Tooltip } from "antd";
import { useState } from "react";

import referredByHover from "../../../images/referredByHover.png";
import referredByIcon from "../../../images/referredByIcon.png";

const ReferredByCellRenderer: React.FC<ICellRendererParams> = (params) => {
  const [hover, setHover] = useState<boolean>(false);
  let style: React.CSSProperties = {
    height: 24,
    minHeight: 24,
    lineHeight: "24px",
    borderRadius: 12,
    padding: "0 12px",
    fontWeight: 400,
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
  };

  const hasValidData =
    params.data?.id !== undefined && params.data?.id !== null;
  const isReferred =
    params.data?.formNames !== undefined && params.data.formNames.length > 0;
  const tooltipTitle = isReferred ? (
    <div style={{ padding: 4, borderRadius: 4 }}>
      <div style={{ fontWeight: 500, fontSize: 14 }}>
        Used in The Below Forms
      </div>
      {params.data?.formNames?.map((name: string) => (
        <div
          key={name}
          style={{ padding: 8, fontWeight: 400 }}
          className="flex items-center"
        >
          <span
            style={{ marginRight: 8 }}
            className="flowzero-iconfont icon-form-designer"
          />
          {name}
        </div>
      ))}
    </div>
  ) : null;

  return isReferred ? (
    <Tooltip
      placement="right"
      title={tooltipTitle}
      classNames={{
        root: "dark:[&_.ant-tooltip-inner]:!bg-[#CCE3FA] dark:[&_.ant-tooltip-inner]:!text-[#0D0D0D] dark:[&_.ant-tooltip-arrow:before]:!bg-[#CCE3FA]",
      }}
    >
      <span
        style={{
          ...style,
          display: hasValidData ? "inline-flex" : "none",
        }}
        className="dark:bg-[#00172E] dark:text-[#368FEE] bg-[#CCE3FA] text-[#035CBB] img-container"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={{ marginRight: 4 }}>Referred by</span>
        <img
          src={hover ? referredByHover : referredByIcon}
          alt="Referred By"
          className="w-4 h-4"
        />
      </span>
    </Tooltip>
  ) : (
    <span
      style={{
        ...style,
        display: hasValidData ? "inline-flex" : "none",
      }}
      className="dark:bg-[#1A1A1A] dark:text-[#808080] bg-[#E5E5E5] text-[#808080]"
    >
      Not referred
    </span>
  );
};

export default ReferredByCellRenderer;
