import { memo } from "react";
import { DataGrid, DataGridClasses } from "src/Root/import/ratancomponents";

import { dataGridColumnsDef } from "./config";
import StyleRoot from "./style";
import { useDataGrid } from "./useDataGrid";

const AutoSplitStaticDataGrid = memo(() => {
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
        className={[ruleClass, DataGridClasses.mainBlotter]}
        rowData={rowData}
        loading={isLoading}
        columnDefs={dataGridColumnsDef}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
        autoSizeDisabled
        data-testid="rules-datagrid"
      />
      {ModalContextHolder}
    </StyleRoot>
  );
});

AutoSplitStaticDataGrid.displayName = "AutoSplitStaticDataGrid";

export default AutoSplitStaticDataGrid;
