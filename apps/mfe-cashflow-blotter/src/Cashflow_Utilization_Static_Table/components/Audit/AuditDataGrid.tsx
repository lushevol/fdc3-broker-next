import { DataGrid } from "Import/ratancomponents";
import { memo } from "react";

import Style, { classes } from "./common/AuditDataGridStyle";
import { auditDataGridColumnsDef } from "./config";
import { useAuditDataGrid } from "./useAuditDataGrid";

export const RulesAuditDataGrid = memo<{ id?: string }>(({ id }) => {
  const { gridOptions, rowData } = useAuditDataGrid(id);

  return (
    <Style data-testid="utilization-static-audit-datagrid">
      <DataGrid
        className={classes.gridRoot}
        columnDefs={auditDataGridColumnsDef}
        gridOptions={gridOptions}
        rowData={rowData}
      />
    </Style>
  );
});
