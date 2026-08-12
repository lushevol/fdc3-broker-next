import React, { ReactElement, Suspense } from "react";
import { Splash } from "../../Root/import";
import { DataGridProps } from "./interface";
import { classes } from "./style";
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

export { classes };
export default DataGrid;
