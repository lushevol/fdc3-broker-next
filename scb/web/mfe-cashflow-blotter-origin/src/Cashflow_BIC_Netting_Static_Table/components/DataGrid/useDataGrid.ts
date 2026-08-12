import {
  GridOptions,
  GridReadyEvent,
  IServerSideGetRowsParams,
  PaginationChangedEvent,
} from "ag-grid-community";
import { Modal } from "antd";
import cn from "classnames";
import { useCallback, useEffect, useMemo } from "react";
import { useMutationActionApi } from "src/Cashflow_BIC_Netting_Static_Table/hooks/useActionApi";
import { useLazyQueryBicNettingRuleListQuery } from "src/Cashflow_BIC_Netting_Static_Table/services/api";
import {
  BicNettingRuleRow,
  RuleMutationResponse,
} from "src/Cashflow_BIC_Netting_Static_Table/services/api.type";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_BIC_Netting_Static_Table/store";
import { setAggridEvent } from "src/Cashflow_BIC_Netting_Static_Table/store/aggrid.slice";
import { openEditDialog } from "src/Cashflow_BIC_Netting_Static_Table/store/detail.slice";
import {
  setPageNo,
  setPageSize,
} from "src/Cashflow_BIC_Netting_Static_Table/store/pagination.slice";
import { DataGridClasses } from "src/Root/import/ratancomponents";

import { ActionType } from "../../state/types";
import { actionRightMenu } from "../Actions";
import { classes } from "./style";

export const useDataGrid = () => {
  const dispatch = useAppDispatch();
  const [modal, ModalCOntextHolder] = Modal.useModal();
  const { aggridEvent } = useAppSelector((state) => state.aggrid);
  const { searchQuery } = useAppSelector((state) => state.search);
  const pagination = useAppSelector((state) => state.pagination);
  const [queryRuleList] = useLazyQueryBicNettingRuleListQuery();
  const { mutation } = useMutationActionApi();
  const ruleClass = cn(classes.rulesDataGrid, DataGridClasses.mainBlotter);

  const handleRightMenuAction = useCallback(
    async (action: ActionType, rows: BicNettingRuleRow[]) => {
      if (action === ActionType.Update) {
        dispatch(openEditDialog(rows[0]));
      } else {
        const resp = await Promise.allSettled(
          rows.map((row) => mutation(action, row))
        );
        return resp
          .filter((r) => r.status === "fulfilled")
          .map(
            (r) => (r as PromiseFulfilledResult<RuleMutationResponse>).value
          );
      }
    },
    []
  );

  const gridOptions = useMemo<GridOptions<BicNettingRuleRow>>(
    () => ({
      rowSelection: "multiple",
      suppressRowClickSelection: true,
      getRowId: ({ data }) => data.id + "",
      defaultColDef: {
        resizable: true,
        sortable: true,
        autoHeight: true,
        menuTabs: ["filterMenuTab"],
        cellStyle: {
          "white-space": "normal",
          "text-align": "left",
          /**
           * Below css style cause the height bug
           */
          // "word-wrap": "break-word",
        },
        filter: true,
        suppressHeaderContextMenu: true,
        suppressMovableColumns: true,
      },
      onRowDoubleClicked(e) {
        const { data } = e;
        dispatch(openEditDialog(data!));
      },
      getContextMenuItems: (params) => {
        return [...actionRightMenu(params, handleRightMenuAction, modal)];
      },
      loadingOverlayComponentParams: {
        loading: true,
        size: 100,
        text: "loading...",
      },
      useValueFormatterForExport: true,
      paginationPageSizeSelector: false,
    }),
    [modal]
  );

  const onPaginationChange = useCallback(
    (e: PaginationChangedEvent) => {
      const pageSize = e.api.paginationGetPageSize();
      dispatch(setPageSize(pageSize));
      const pageNo = e.api.paginationGetCurrentPage();
      dispatch(setPageNo(pageNo));
    },
    [dispatch]
  );

  const onGridReady = useCallback((e: GridReadyEvent) => {
    dispatch(setAggridEvent(e));
  }, []);

  const serverSideDatasource = useMemo<
    GridOptions["serverSideDatasource"]
  >(() => {
    return {
      getRows(params: IServerSideGetRowsParams) {
        const { api, success, fail, context } = params;
        const page = api.paginationGetCurrentPage();
        const size = api.paginationGetPageSize();
        queryRuleList({ ...context, page, size })
          .then(({ data }) => {
            success({
              rowData: data?.results ?? [],
              rowCount: data?.totalHits ?? 0,
            });
            api.autoSizeAllColumns();
          })
          .catch(() => fail());
      },
    };
  }, []);

  useEffect(() => {
    aggridEvent?.api.setGridOption("context", searchQuery);
    aggridEvent?.api.refreshServerSide();
  }, [searchQuery]);

  return {
    ModalCOntextHolder,
    queryRuleList,
    searchQuery,
    serverSideDatasource,
    pagination,
    ruleClass,
    handleRightMenuAction,
    onPaginationChange,
    onGridReady,
    gridOptions,
  };
};
