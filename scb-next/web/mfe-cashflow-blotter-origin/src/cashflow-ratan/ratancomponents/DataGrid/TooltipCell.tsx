import React, { FC } from "react";
import { Tooltip } from "antd";

interface TooltipCellProps {
  valueFormatted: any;
  value: any;
}

export const TooltipCell: FC<TooltipCellProps> = ({
  valueFormatted,
  value,
}: any) => {
  return valueFormatted ? (
    <Tooltip title={value}>{valueFormatted}</Tooltip>
  ) : (
    <>{value}</>
  );
};

export const TooltipCellOver: FC<TooltipCellProps> = ({ value }: any) => {
  return (
    <Tooltip title={value}>
      <div className="tooltip-cell-over">{value}</div>
    </Tooltip>
  );
};
