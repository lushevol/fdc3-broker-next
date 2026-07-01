import { GridOptions, GridReadyEvent } from "ag-grid-community";
import { Modal } from "antd";
import cn from "classnames";
import { useCallback, useMemo } from "react";
import { DataGridClasses } from "src/Root/import/ratancomponents";

import { useMutationActionApi } from "../../hooks/useActionApi";
import {
  RuleMutationResponse,
  UtilizationRuleRow,
} from "../../services/api.type";
import { ActionType } from "../../state/types";
import { useAppDispatch, useAppSelector } from "../../store";
import { setAggridEvent } from "../../store/aggrid.slice";
import { openEditDialog } from "../../store/detail.slice";
import { goToNextPage } from "../../store/pagination.slice";
import { actionRightMenu } from "../Actions";
import { classes } from "./style";
import { useDataSource } from "./useDataSource";

export const useDataGrid = () => {
  const dispatch = useAppDispatch();
  const [modal, ModalContextHolder] = Modal.useModal();
  const { searchQuery } = useAppSelector((state) => state.search);
  const pagination = useAppSelector((state) => state.pagination);
  const { mutation } = useMutationActionApi();
  const ruleClass = cn(classes.rulesDataGrid, DataGridClasses.mainBlotter);
  const { isLoading, rowData, totalHits } = useDataSource();

  const handleRightMenuAction = useCallback(
    async (action: ActionType, rows: UtilizationRuleRow[]) => {
      if (action === ActionType.Update) {
        dispatch(openEditDialog(rows[0]));
      } else {
        const resp = await Promise.allSettled(
          rows.map((row) => mutation(action, row))
        );
        return resp
          .filter(
            (r): r is PromiseFulfilledResult<RuleMutationResponse> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value);
      }
    },
    []
  );

  const gridOptions = useMemo<GridOptions<UtilizationRuleRow>>(
    () => ({
      rowSelection: {
        mode: "multiRow",
        headerCheckbox: true,
        checkboxes: true,
        enableClickSelection: false,
      },
      getRowId: ({ data }) => data.id + "",
      defaultColDef: {
        resizable: true,
        sortable: true,
        autoHeight: true,
        menuTabs: ["filterMenuTab"],
        cellStyle: {
          "white-space": "normal",
          "text-align": "left",
          "word-wrap": "break-word",
        },
        filter: true,
        suppressHeaderContextMenu: true,
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

  return {
    ModalContextHolder,
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
