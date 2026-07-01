import { DataGrid, DataGridClasses } from "Import/ratancomponents";
import { memo } from "react";

import { auditDataGridColumnsDef } from "./config";
import StyleRoot from "./style";
import { useAuditDataGrid } from "./useAuditDataGrid";

export const SplitAuditDataGrid = memo<{ id?: string }>(({ id }) => {
  const {
    ruleClass,
    gridOptions,
    serverSideDatasource,
    auditTablePagination,
    onPaginationChange,
    paginationPageSizeSelector,
  } = useAuditDataGrid(id);

  return (
    <StyleRoot>
      <DataGrid
        className={[ruleClass, DataGridClasses.mainBlotter]}
        columnDefs={auditDataGridColumnsDef}
        gridOptions={gridOptions}
        rowModelType="serverSide"
        serverSideDatasource={serverSideDatasource}
        pagination
        paginationPageSize={auditTablePagination.size}
        paginationPageSizeSelector={paginationPageSizeSelector}
        onPaginationChanged={onPaginationChange}
      />
    </StyleRoot>
  );
});
