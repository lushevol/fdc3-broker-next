import React, { ReactElement, Suspense } from "react";

import { Splash } from "../../Root/import";
export {
  applyClientFilter,
  applyClientSort,
  applyLocalFilter,
  createBaseGridOptions,
  formatTimeVal,
} from "./agGridOptions";
import { coverStyle, createAgGridStyles } from "./agGridStyles";
import { DataGridProps } from "./interface";
import { StatusBadge, type StatusBadgeConfig } from "./StatusBadge";
import { classes } from "./style";
import TooltipHeader from "./TooltipHeader";
const DataGridLazy = React.lazy(() => import("./DataGrid"));
const License = React.lazy(() => import("./License"));

export const DataGrid: React.FC<DataGridProps> = (
  props: DataGridProps
): ReactElement => {
  return (
    <Suspense fallback={<Splash />}>
      <License />
      <DataGridLazy {...props} />
    </Suspense>
  );
};

export {
  classes,
  coverStyle,
  createAgGridStyles,
  StatusBadge,
  StatusBadgeConfig,
  TooltipHeader,
};
export default DataGrid;
