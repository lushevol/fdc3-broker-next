import type { IHeaderParams } from "ag-grid-community";
import cn from "classnames";
import React, { useEffect, useState } from "react";

import EllipsisTooltip from "../EllipsisTooltip";

const TooltipHeader: React.FC<IHeaderParams> = ({
  displayName,
  column,
  enableSorting,
  progressSort,
}) => {
  const [sortState, setSortState] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    if (!column) return;
    const onSortChanged = () => setSortState(column.getSort() ?? null);
    column.addEventListener("sortChanged", onSortChanged);
    onSortChanged();
    return () => column.removeEventListener("sortChanged", onSortChanged);
  }, [column]);

  const handleClick = (e: React.MouseEvent) => {
    if (enableSorting) progressSort(e.shiftKey);
  };

  return (
    <div
      className={cn(
        "flex items-center w-full overflow-hidden",
        enableSorting && "cursor-pointer"
      )}
      role={enableSorting ? "button" : undefined}
      tabIndex={enableSorting ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={
        enableSorting
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") handleClick(e as never);
            }
          : undefined
      }
    >
      <EllipsisTooltip value={displayName} />
      {sortState === "asc" && (
        <span className="ag-icon ag-icon-asc ml-1 flex-shrink-0" />
      )}
      {sortState === "desc" && (
        <span className="ag-icon ag-icon-desc ml-1 flex-shrink-0" />
      )}
    </div>
  );
};

export default TooltipHeader;
