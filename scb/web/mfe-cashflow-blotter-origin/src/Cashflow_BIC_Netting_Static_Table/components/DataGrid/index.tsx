import { memo } from "react";
import { DataGrid } from "src/Root/import/ratancomponents";

import { dataGridColumnsDef } from "./config";
import StyleRoot from "./style";
import { useDataGrid } from "./useDataGrid";

const BicNettingStaticDataGrid = memo(() => {
  const {
    ModalCOntextHolder,
    serverSideDatasource,
    searchQuery,
    ruleClass,
    gridOptions,
    onGridReady,
    pagination,
    onPaginationChange,
  } = useDataGrid();
  return (
    <StyleRoot>
      <DataGrid
        className={ruleClass}
        columnDefs={dataGridColumnsDef}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
        rowModelType="serverSide"
        serverSideDatasource={serverSideDatasource}
        context={searchQuery}
        pagination
        paginationPageSize={pagination.size}
        onPaginationChanged={onPaginationChange}
        cacheBlockSize={pagination.size}
        rootSx={{ height: "80vh" }}
        autoSizeDisabled
        data-testid="rules-datagrid"
      />
      {ModalCOntextHolder}
    </StyleRoot>
  );
});

BicNettingStaticDataGrid.displayName = "BicNettingStaticDataGrid";

export default BicNettingStaticDataGrid;
