import { GridReadyEvent } from "ag-grid-community";
import { MessageInstance } from "antd/es/message/interface";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/Cashflow_CN/Main/store/interface";
import { DataGrid, DataGridClasses } from "src/Root/import/ratancomponents";

import {
  splittingCashflowPreviewGrid,
  splittingCashflowSourceGrid,
} from "../../../config/fieldsConfig";
import { useQuerySplitting } from "../common/SplitCashflowDialogUtils";
import RootStyle, { classes } from "./SplittingPreviewComponentStyle";

interface SplittingPreviewComponentProps {
  messageApi: MessageInstance;
}

export const SplittingPreviewComponent: FC<SplittingPreviewComponentProps> = ({
  messageApi,
}) => {
  const [sourceGrid, setSourceGrid] = useState<GridReadyEvent>();
  const [targetGrid, setTargetGrid] = useState<GridReadyEvent>();
  const { sourceCashflow, splitAction, targetCashflows } = useSelector(
    (state: RootState) => state.splittingWorkflow
  );
  const { querySplittingParallel } = useQuerySplitting({ messageApi });

  const gridOptions = useMemo(() => {
    return {
      defaultColDef: {
        sortable: true,
        autoHeight: true,
        cellStyle: {
          textAlign: "left",
          whiteSpace: "normal",
        },
      },
      suppressContextMenu: true,
    };
  }, []);

  const onSourceDataGridReady = useCallback((params: GridReadyEvent) => {
    setSourceGrid(params);
  }, []);

  const onTargetDataGridReady = useCallback((params: GridReadyEvent) => {
    setTargetGrid(params);
  }, []);

  useEffect(() => {
    // Once targetRowData change, need to update the target grid
    if (targetCashflows && targetGrid) {
      targetGrid?.api.setGridOption("rowData", targetCashflows);
    }
    if (sourceGrid && targetGrid && !targetCashflows) {
      sourceCashflow &&
        querySplittingParallel(
          sourceGrid.api,
          targetGrid?.api,
          sourceCashflow,
          splitAction
        );
    }
  }, [sourceGrid, targetGrid, targetCashflows]);

  return (
    <RootStyle className={classes.root}>
      <div className={classes.block}>
        <div className={classes.subtitle}>Parent Cashflow</div>
        <DataGrid
          className={[
            DataGridClasses.commonGrid,
            classes.datagrid,
            DataGridClasses.baseGrid,
          ].join(" ")}
          columnDefs={splittingCashflowSourceGrid}
          gridOptions={gridOptions}
          autoSizeDisabled={true}
          onGridReady={onSourceDataGridReady}
        />
      </div>
      <div className={classes.block}>
        <div
          className={classes.subtitle}
          style={{ display: "flex", alignItems: "center" }}
        >
          Child Cashflows (Preview)
          <div
            style={{
              marginLeft: 5,
              backgroundColor: "var(--theme-status-color-orange)",
              borderRadius: 4,
              padding: "2px 6px",
              fontSize: 12,
              fontStyle: "italic",
            }}
          >
            {`Split: ${targetCashflows?.length ?? 0}`}
          </div>
        </div>
        <DataGrid
          className={[
            DataGridClasses.commonGrid,
            classes.datagrid,
            DataGridClasses.baseGrid,
            "hori-scorll-none",
          ].join(" ")}
          columnDefs={splittingCashflowPreviewGrid(splitAction)}
          gridOptions={gridOptions}
          autoSizeDisabled={true}
          onGridReady={onTargetDataGridReady}
        />
      </div>
    </RootStyle>
  );
};
