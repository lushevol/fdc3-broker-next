import { GridOptions, GridReadyEvent } from "ag-grid-community";
import { message, Modal } from "antd";
import cn from "classnames";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMutationActionApi } from "src/Cashflow_Splitting_Static/hooks/useActionApi";
import { useLazyQueryStaticRuleListQuery } from "src/Cashflow_Splitting_Static/services/api";
import {
  RuleMutationResponse,
  StaticRuleRow,
} from "src/Cashflow_Splitting_Static/services/api.type";
import {
  useAppDispatch,
  useAppSelector,
} from "src/Cashflow_Splitting_Static/store";
import { setAggridEvent } from "src/Cashflow_Splitting_Static/store/aggrid.slice";
import { openEditDialog } from "src/Cashflow_Splitting_Static/store/detail.slice";
import { goToNextPage } from "src/Cashflow_Splitting_Static/store/pagination.slice";
import { DataGridClasses } from "src/Root/import/ratancomponents";

import { ActionType } from "../../state/types";
import { flashUpdatedCashflows } from "../../utils/index";
import { actionRightMenu } from "../Actions";
import { classes } from "./style";
import { useDataSource } from "./useDataSource";

export const generateMessage = (
  results: PromiseSettledResult<RuleMutationResponse>[],
  action: ActionType
) => {
  if (results.length === 1) {
    const r = results[0];
    if (r.status === "fulfilled" && r.value?.status === 200) {
      message.success(r.value?.errorMessage);
    } else if (r.status === "fulfilled") {
      message.error(r.value?.errorMessage);
    } else {
      message.error(`${action} Failed`);
    }
  } else {
    const successCount = results.filter(
      (r) => r.status === "fulfilled" && r.value?.status === 200
    ).length;
    const failCount = results.length - successCount;

    let msg = "";
    if (successCount === results.length && results.length > 0) {
      msg = `${successCount} Rules ${action} Success!`;
      message.success(msg);
    } else if (successCount > 0 && failCount > 0) {
      msg = `${successCount} Rules ${action} Success, ${failCount} Rules ${action} Failed`;
      message.error(msg);
    } else if (failCount === results.length && results.length > 0) {
      msg = `${failCount} Rules ${action} Failed`;
      message.error(msg);
    }
  }
};

export const useDataGrid = () => {
  const dispatch = useAppDispatch();
  const [modal, ModalContextHolder] = Modal.useModal();
  const { aggridEvent } = useAppSelector((state) => state.aggrid);
  const { searchQuery } = useAppSelector((state) => state.search);
  const pagination = useAppSelector((state) => state.pagination);
  const [queryRuleList] = useLazyQueryStaticRuleListQuery();
  const { mutation } = useMutationActionApi();
  const ruleClass = cn(classes.rulesDataGrid, DataGridClasses.mainBlotter);
  const { isLoading, rowData, totalHits } = useDataSource();
  const prevRowDataRef = useRef<StaticRuleRow[] | null>(null);

  const handleRightMenuAction = useCallback(
    async (action: ActionType, rows: StaticRuleRow[]) => {
      if (action === ActionType.Update) {
        dispatch(openEditDialog(rows[0]));
      } else {
        const resp = await Promise.allSettled(
          rows.map((row) => mutation(action, row))
        );
        generateMessage(resp, action);
        return resp
          .filter((r) => r.status === "fulfilled" && r.value?.status === 200)
          .map(
            (r) => (r as PromiseFulfilledResult<RuleMutationResponse>).value
          );
      }
    },
    []
  );

  const gridOptions = useMemo<GridOptions<StaticRuleRow>>(
    () => ({
      rowSelection: {
        mode: "multiRow",
        headerCheckbox: true,
        checkboxes: true,
        enableClickSelection: false,
      },
      suppressRowClickSelection: true,
      getRowId: ({ data }) => data.id + "",
      immutableData: true,
      defaultColDef: {
        resizable: true,
        sortable: true,
        autoHeight: true,
        menuTabs: ["filterMenuTab"],
        cellStyle: {
          "white-space": "normal",
          "text-align": "left",
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
      onBodyScrollEnd(event) {
        const { api } = event;
        if (api.getLastDisplayedRowIndex() + 1 === api.getDisplayedRowCount()) {
          dispatch(goToNextPage());
        }
      },
    }),
    [modal]
  );

  const onGridReady = useCallback((e: GridReadyEvent) => {
    dispatch(setAggridEvent(e));
  }, []);

  useEffect(() => {
    if (aggridEvent && rowData) {
      aggridEvent.api?.setGridOption("rowData", rowData);

      if (prevRowDataRef.current) {
        const updatedRows = rowData.filter((row) => {
          const prevRow = prevRowDataRef.current!.find((r) => r.id === row.id);
          return prevRow && JSON.stringify(prevRow) !== JSON.stringify(row);
        });
        const originRows = updatedRows.map(
          (row) => prevRowDataRef.current!.find((r) => r.id === row.id)!
        );
        if (updatedRows.length > 0) {
          flashUpdatedCashflows(aggridEvent.api, updatedRows, originRows, 2000);
        }
      }
      prevRowDataRef.current = rowData;
    }
  }, [rowData, aggridEvent]);

  return {
    ModalContextHolder,
    queryRuleList,
    searchQuery,
    pagination,
    ruleClass,
    handleRightMenuAction,
    onGridReady,
    gridOptions,
    isLoading,
    rowData,
    totalHits,
  };
};
