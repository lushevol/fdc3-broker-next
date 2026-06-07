import { DataGrid } from "Import/ratancomponents";
import { memo } from "react";

import Style, { classes } from "./common/AuditDataGridStyle";
import { auditDataGridColumnsDef } from "./config";
import { useAuditDataGrid } from "./useAuditDataGrid";

export const RulesAuditDataGrid = memo<{ id?: string }>(({ id }) => {
  const {
    gridOptions,
    serverSideDatasource,
    auditTablePagination,
    onPaginationChange,
  } = useAuditDataGrid(id);

  return (
    <Style data-testid="bic-netting-static-audit-datagrid">
      <DataGrid
        className={classes.gridRoot}
        columnDefs={auditDataGridColumnsDef}
        gridOptions={gridOptions}
        rowModelType="serverSide"
        serverSideDatasource={serverSideDatasource}
        pagination
        paginationPageSize={auditTablePagination.size}
        cacheBlockSize={auditTablePagination.size}
        onPaginationChanged={onPaginationChange}
      />
    </Style>
  );
});
