import { GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DataGrid, DataGridClasses } from "src/Root/import/ratancomponents";

import { componentCashflowNetPreviewGrid } from "../../Main/config/fieldsConfig";
import { updateNetCashflowDataGridDefs } from "../../Main/store/actions/workflowAction";
import { NetPreviewComponentProps } from "./common/interface";
import RootStyle, { classes } from "./common/NetPreviewComponentStyle";

// for create ag-grid align cross the DataGrid Comp
const useAlignGridForTwo = () => {
  const preGrid = useRef<AgGridReact>(null);
  const pairGird = useRef<AgGridReact>(null);

  const [preGridAlignGrids, setPreGridAlignGrids] = useState<
    AgGridReact[] | undefined
  >(undefined);
  const [pairGridAlignGrids, setPairGridAlignGrids] = useState<
    AgGridReact[] | undefined
  >(undefined);

  const bindPairToPre = () => {
    if (pairGird.current) {
      setPreGridAlignGrids([pairGird.current]);
    } else {
      setPreGridAlignGrids([]);
    }
  };

  const bindPreToPair = () => {
    if (preGrid.current) {
      setPairGridAlignGrids([preGrid.current]);
    } else {
      setPairGridAlignGrids([]);
    }
  };

  return {
    preGrid,
    preGridAlignGrids,
    pairGird,
    pairGridAlignGrids,
    bindPairToPre,
    bindPreToPair,
  };
};

const NetPreviewComponent: FC<NetPreviewComponentProps> = ({
  previewMetrix,
  proceedPreviewing,
  nettingResult,
  netType,
}) => {
  const dispatch = useDispatch();
  const [sourceGrid, setSourceGrid] = useState<GridReadyEvent>();
  const [previewGrid, setPreviewGrid] = useState<GridReadyEvent>();
  const {
    preGrid,
    preGridAlignGrids,
    pairGird,
    pairGridAlignGrids,
    bindPairToPre,
    bindPreToPair,
  } = useAlignGridForTwo();
  const gridOptions = useMemo(() => {
    return {
      rowSelection: "multiple",
      defaultColDef: {
        sortable: true,
        autoHeight: true,
        cellStyle: {
          textAlign: "left",
          whiteSpace: "normal",
          wordWrap: "break-word",
        },
      },
      suppressContextMenu: false,
    };
  }, []);

  // bind and prepare ag-grid api for update data
  const onSourceDataGridReady = useCallback((params: GridReadyEvent) => {
    bindPreToPair();
    setSourceGrid(params);
    dispatch(updateNetCashflowDataGridDefs({ sourceGridReadyEvent: params }));
  }, []);

  const onPreviewDataGridReady = useCallback((params: GridReadyEvent) => {
    bindPairToPre();
    setPreviewGrid(params);
    dispatch(updateNetCashflowDataGridDefs({ previewGridReadyEvent: params }));
  }, []);

  const originalCashflowList = useMemo(() => {
    return previewMetrix.reduce<CNCashflow[]>((res, cur) => {
      return [...res, ...(cur.originalCashflowList || [])];
    }, []);
  }, [previewMetrix]);

  const previewCashflowList = useMemo(() => {
    return previewMetrix.reduce<CNCashflow[]>((res, cur) => {
      return [...res, ...(cur.previewCashflowList || [])];
    }, []);
  }, [previewMetrix]);

  useEffect(() => {
    const { valid, failed, netting, single } = nettingResult;
    if (valid.length || failed.length) {
      const nettingResultIds = netting.map((i) => i.Cashflow?.Cashflow_Id);
      const failedResultIds = failed.map((i) => i.Cashflow?.Cashflow_Id);
      const singleResultIds = single.map((i) => i.Cashflow?.Cashflow_Id);
      const resultSource = originalCashflowList.map((i) => {
        const index = nettingResultIds.indexOf(i.Cashflow?.Cashflow_Id);
        if (index > -1) {
          nettingResultIds.splice(index, 1);
          const item = netting.find(
            (c) => c.Cashflow?.Cashflow_Id === i.Cashflow?.Cashflow_Id
          );
          return { ...item, Result: "success", Type: "netting" };
        }
        const index2 = singleResultIds.indexOf(i.Cashflow?.Cashflow_Id);
        if (index2 > -1) {
          return { ...single.at(index2), Result: "success", Type: "single" };
        }
        const index3 = failedResultIds.indexOf(i.Cashflow?.Cashflow_Id);
        if (index3 > -1) {
          return { ...failed.at(index3), Result: "error" };
        }
        return i;
      });
      sourceGrid?.api.setGridOption("rowData", resultSource);
      sourceGrid?.api.setColumnVisible("Type", true);

      const nettingResultPreview = previewCashflowList.map((item) => {
        const updatedNettingRes = netting.find(
          (i) => i.Cashflow?.Cashflow_Id === item.Cashflow?.Cashflow_Id
        );
        return updatedNettingRes ?? item;
      });
      previewGrid?.api.setGridOption("rowData", [
        ...nettingResultPreview.map((i) => ({ ...i, Type: "netting" })),
        ...single.map((i) => ({ ...i, Type: "single" })),
      ]);
    }
  }, [
    nettingResult,
    sourceGrid,
    previewGrid,
    originalCashflowList,
    previewCashflowList,
  ]);

  return (
    <RootStyle className={classes.root}>
      <div className={classes.block}>
        <div className={classes.subtitle}>
          Netting Resultant Cashflow (Preview)
        </div>
        <DataGrid
          className={[
            DataGridClasses.commonGrid,
            classes.datagrid,
            DataGridClasses.baseGrid,
          ].join(" ")}
          columnDefs={componentCashflowNetPreviewGrid(netType)}
          gridOptions={gridOptions}
          rowData={previewCashflowList}
          autoSizeDisabled={true}
          agGridRef={pairGird}
          alignedGrids={pairGridAlignGrids}
          onGridReady={onPreviewDataGridReady}
        />
      </div>
      <div className={classes.block}>
        <div className={classes.subtitle}>Netting Component Cashflows</div>
        <DataGrid
          className={[
            DataGridClasses.commonGrid,
            classes.datagrid,
            DataGridClasses.baseGrid,
            "hori-scorll-none",
          ].join(" ")}
          columnDefs={componentCashflowNetPreviewGrid(netType)}
          gridOptions={gridOptions}
          rowData={originalCashflowList}
          autoSizeDisabled={true}
          agGridRef={preGrid}
          alignedGrids={preGridAlignGrids}
          onGridReady={onSourceDataGridReady}
        />
      </div>
    </RootStyle>
  );
};

export default NetPreviewComponent;
