import {
  FilterChangedEvent,
  GridOptions,
  SelectionChangedEvent,
} from "ag-grid-community";
import { message, Modal } from "antd";
import { DataGrid, DataGridClasses } from "Import/ratancomponents";
import {
  conversionColDef,
  getBusinessFieldsFromCache,
  sortBusinessFields,
} from "Import/ratanutils";
import { FC, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgGridFilterContext } from "src/Cashflow_CN/Main/App";
import type { RootState } from "src/Cashflow_CN/Main/store/interface";
import { FailedWrap } from "src/Cashflow_CN/Main/workflow/failed/FailedWrap";
import { ManualSettleWrap } from "src/Cashflow_CN/Main/workflow/manualSettle";
import { useE2Elatency } from "src/Root/analysis";
import {
  DETAILS_RENDERING_LATENCY,
  USELESS_INIT_POINT,
} from "src/Root/analysis/const";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";

import {
  cashflowCustomFields,
  customizeCashflowFields,
} from "../../Main/config/fieldsConfig";
import { EarlyMaterializationWrap } from "../../Main/workflow/earlyMaterialization/EarlyMaterializationWrap";
import { HoldWrap } from "../../Main/workflow/hold";
import { NetComponent } from "../../Main/workflow/netCashflow/netComponent";
import { UnNetComponent } from "../../Main/workflow/netCashflow/unNetComponent";
import { SettlementMethodUpdateComponentDialog } from "../../Main/workflow/settlementMethodUpdate/components/SettlementMethodUpdateComponentDialog";
import { SplitLookUpSSIComp } from "../../Main/workflow/splitting/LookUpSSI/index";
import { SplittingWrap } from "../../Main/workflow/splitting/SplittingCashflowComponent";
import { SwiftSuppressWrap } from "../../Main/workflow/swiftSuppress/SwiftSuppress";
import { CashflowDetailsWrap } from "../../Main/workflow/viewCashflowDetails/CashflowDetailsWrap";
import { openCashflowDetailDialog } from "../../Main/workflow/viewCashflowDetails/viewCashflowDetailsRightMenu";
import { ViewTradeDetailsWrap } from "../../Main/workflow/viewTradeDetails/ViewTradeDetailsWrap";
import { dataGridSelectionChangedHandler } from "../AutoLoadButton/utils";
import { BulkDialog } from "../BulkFixExceptions/components/BulkDialog";
import RightClickMenuBuilder from "./common/RightClickMenuBuilder";
import StyledRoot, { classes } from "./common/style";
import { useGridReadyEvent } from "./hooks/useGridReadyEvent";
import { useGridScroll } from "./hooks/useGridScroll";

const workspace = "cashflowCN";

const CashflowDataGrid: FC = () => {
  const [cashflowDataGridFields, setCashflowDataGridFields] = useState<any>();
  const { setAggridTags } = useContext(AgGridFilterContext);

  const dispatch = useDispatch<any>();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { onGridReady } = useGridReadyEvent();
  useGridScroll();
  const cashflowListQueryPageSize = useSelector(
    (state: RootState) => state.cashflowListQueryPageSize
  );
  const { initTrackingPoints, addTrackingPoint } = useE2Elatency(
    DETAILS_RENDERING_LATENCY
  );

  const gridOptions = useMemo<GridOptions<CNCashflow>>(() => {
    return {
      rowSelection: "multiple",
      suppressRowClickSelection: true,
      // enableCellChangeFlash: true,
      // cellFadeDelay: 20000,
      onRowDoubleClicked: (params) => {
        if (params.data) {
          const opt = {
            dispatch,
            modalApi,
            messageApi,
          };
          openCashflowDetailDialog(params.data, "1", opt);
          initTrackingPoints();
          addTrackingPoint(USELESS_INIT_POINT);
        }
      },
      immutableData: true,
      defaultColDef: {
        resizable: true,
        sortable: true,
        menuTabs: ["filterMenuTab"],
        filter: true,
        suppressHeaderContextMenu: true,
      },
      tooltipShowDelay: 0,
      getRowId: ({ data }) => data.Cashflow?.Cashflow_Id + "",
      getContextMenuItems: (params) => {
        const options = {
          dispatch,
          modalApi,
          messageApi,
        };

        const menuBuilder = new RightClickMenuBuilder(params, options);
        return menuBuilder
          .addBulkRightMenu()
          .addNetCashflowRightMenu()
          .addUnNetCashflowRightMenu()
          .addHoldRightMenu()
          .addEarlyMaterializationRightMenu()
          .addAdhocCommentRightMenu()
          .addFailedRightMenu()
          .addManualSettleRightMenu()
          .addSwiftSuppressRightMenu()
          .addSplittingCashflowRightMenu()
          .addSettlementMethodUpdateRightMenu()
          .addViewTradeDetailsRightMenu()
          .addViewCashflowDetailsRightMenu()
          .addViewSwiftMessage()
          .toResult();
      },
      onFilterChanged(event: FilterChangedEvent) {
        const filterModel = event.api.getFilterModel();
        const colIds = Object.keys(filterModel);

        const tags = colIds.map((colId: string) => {
          return {
            colId,
            headerName: event.api.getColumn(colId)?.getColDef().headerName,
          };
        });
        setAggridTags((preAggridTags) => {
          // if create new filter, deselect all.
          if (tags.length >= preAggridTags.length) {
            event.api.deselectAll();
          }
          return tags;
        });
      },
      onSelectionChanged(event: SelectionChangedEvent) {
        dataGridSelectionChangedHandler(
          event,
          dispatch,
          modalApi,
          cashflowListQueryPageSize
        );
      },
    };
  }, [cashflowListQueryPageSize]);

  useEffect(() => {
    getBusinessFieldsFromCache(workspace, cashflowCustomFields).then(
      (res: any) => {
        const { cashflowFields } = res;
        const newArr = sortBusinessFields(cashflowFields);
        const cashflowDataGridFields = conversionColDef(newArr, workspace, [
          "FMO_Comments",
        ]);
        const columnsDefs = [
          ...cashflowDataGridFields,
          ...customizeCashflowFields,
        ];
        columnsDefs.forEach((i) => {
          i.headerCheckboxSelectionFilteredOnly = true;
        });
        setCashflowDataGridFields(columnsDefs);
      }
    );
  }, []);

  return (
    <>
      {cashflowDataGridFields && (
        <StyledRoot>
          <DataGrid
            className={[classes.root, DataGridClasses.mainBlotter].join(" ")}
            gridOptions={gridOptions}
            columnDefs={cashflowDataGridFields}
            onGridReady={onGridReady}
            autoSizeDisabled
          />
        </StyledRoot>
      )}
      {modalContextHolder}
      {messageContextHolder}
      <NetComponent />
      <UnNetComponent />
      <CashflowDetailsWrap />
      <ViewTradeDetailsWrap />
      <HoldWrap />
      <EarlyMaterializationWrap />
      <FailedWrap />
      <SwiftSuppressWrap />
      <ManualSettleWrap />
      <BulkDialog />
      {featureScopedEnabled("Manual_Splitting") && (
        <>
          <SplittingWrap />
          <SplitLookUpSSIComp />
        </>
      )}
      <SettlementMethodUpdateComponentDialog />
    </>
  );
};

export default CashflowDataGrid;
