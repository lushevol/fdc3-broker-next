import { memo } from "react";
import { DataGrid } from "src/Root/import/ratancomponents";

import { dataGridColumnsDef } from "./config";
import StyleRoot from "./style";
import { useDataGrid } from "./useDataGrid";

const UtilizationStaticDataGrid = memo(() => {
  const {
    ModalContextHolder,
    ruleClass,
    gridOptions,
    onGridReady,
    isLoading,
    rowData,
  } = useDataGrid();
  return (
    <StyleRoot>
      <DataGrid
        className={ruleClass}
        rowData={rowData}
        loading={isLoading}
        columnDefs={dataGridColumnsDef}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
        rootSx={{ height: "80vh" }}
        autoSizeDisabled
        data-testid="rules-datagrid"
      />
      {ModalContextHolder}
    </StyleRoot>
  );
});

UtilizationStaticDataGrid.displayName = "UtilizationStaticDataGrid";

export default UtilizationStaticDataGrid;
