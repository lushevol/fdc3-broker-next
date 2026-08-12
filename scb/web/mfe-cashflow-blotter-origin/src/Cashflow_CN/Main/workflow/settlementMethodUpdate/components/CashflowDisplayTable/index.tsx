import { GridOptions, GridReadyEvent } from "ag-grid-community";
import cn from "classnames";
import { DataGrid, DataGridClasses } from "Import/ratancomponents";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { CashflowDisplay } from "../../type";
import {
  ActionReasonCell,
  ActionResultCell,
  renderOriginalSettlementMethod,
  renderPaymentAmount,
  renderTargetSettlementMethod,
} from "../../utils/utils";
import StyledRoot, { classes } from "./style";

const getColumnDefs = (isEligibleTable: boolean): GridOptions["columnDefs"] => [
  { headerName: "Cashflow Id", field: "cashflowId", flex: 1, minWidth: 120 },
  {
    headerName: "Trade Id",
    field: "tradeId",
    sort: "asc",
    flex: 1,
    minWidth: 100,
  },
  {
    headerName: "Original Settlement Method",
    field: "settlementMethod",
    width: 180,
    cellRenderer: (params: any) => renderOriginalSettlementMethod(params.value),
  },
  {
    headerName: "Target Settlement Method",
    field: "settlementMethod",
    width: 170,
    cellRenderer: (params: any) => renderTargetSettlementMethod(params.value),
  },
  {
    headerName: "Amount",
    field: "paymentAmount",
    cellRenderer: (params: any) => renderPaymentAmount(params.value),
  },
  { headerName: "Cashflow Status", field: "cashflowStatus" },
  { headerName: "Booking Entity", field: "entityCode", minWidth: 100 },
  { headerName: "Counterparty", field: "counterpartyCode", minWidth: 80 },
  { headerName: "Currency", field: "currency" },
  { headerName: "P/R", field: "payRec" },
  { headerName: "Value Date", field: "valueDate" },
  ...(isEligibleTable
    ? [
        {
          headerName: "Result",
          field: "actionResult",
          cellRenderer: (params: any) =>
            ActionResultCell(params.value, params.data),
        },
      ]
    : [
        {
          headerName: "Reason",
          field: "insufficientReason",
          cellRenderer: (params: any) =>
            ActionReasonCell(params.value, params.data),
        },
      ]),
];

interface CashflowDisplayTableProps {
  data: CashflowDisplay[];
  isEligibleTable?: boolean;
  isLoading: boolean;
}

const CashflowDisplayTable: React.FC<CashflowDisplayTableProps> = React.memo(
  ({ data, isEligibleTable, isLoading }) => {
    const updateClass = cn(classes.updateDataGrid, DataGridClasses.mainBlotter);
    const isLoadingRef = useRef(isLoading);
    isLoadingRef.current = isLoading;

    const gridApiRef = useRef<GridReadyEvent["api"] | null>(null);

    const columnDefs = useMemo(
      () => getColumnDefs(!!isEligibleTable),
      [isEligibleTable]
    );
    const gridOptions = useMemo<GridOptions>(
      () => ({
        defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
        },
        tooltipShowDelay: 0,
        domLayout: "autoHeight",
        pagination: true,
        paginationPageSize: 10,
        paginationPageSizeSelector: [10, 20, 50, 100],
        getRowId: (params) => params.data.cashflowId + "",
        getContextMenuItems: () => [],
      }),
      []
    );

    const onGridReady = useCallback((event: GridReadyEvent) => {
      gridApiRef.current = event.api;
      event.api.setGridOption("loading", isLoadingRef.current);
    }, []);

    useEffect(() => {
      gridApiRef.current?.setGridOption("loading", isLoading);
    }, [isLoading]);

    return (
      <StyledRoot data-testid="cashflow-table">
        <DataGrid
          className={updateClass}
          rowData={data}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </StyledRoot>
    );
  }
);

export default CashflowDisplayTable;
