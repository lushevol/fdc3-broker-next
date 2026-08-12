import { GridOptions, GridReadyEvent } from "ag-grid-community";
import { message, Modal } from "antd";
import { DataGrid, DataGridClasses } from "Import/ratancomponents";
import { FC, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { BlotterDataType } from "src/Cashflow_Group_Management/Main/store/interface";
import {
  setBlotterGridEvent,
  triggerSearch,
  updateBlotterDatas,
} from "src/Cashflow_Group_Management/Main/store/slice";
import { manualResendRightMenu } from "src/Cashflow_Group_Management/Main/workflow/manualResend";
import { manualSTPRightMenu } from "src/Cashflow_Group_Management/Main/workflow/manualSTP";
import { onGridBodyScroll } from "src/Root/import/ratanutils";

import { defaultGridFieldsDef } from "./common/config";
import StyledRoot, { classes } from "./common/style";

const CashflowDataGrid: FC = () => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();
  const dispatch = useDispatch<any>();

  const gridOptions = useMemo<GridOptions<BlotterDataType>>(() => {
    return {
      rowSelection: {
        mode: "multiRow",
        selectAll: "filtered",
        enableClickSelection: true,
        copySelectedRows: false,
        checkboxes: true,
        isRowSelectable: (rowNode: any) => {
          if (!rowNode.data) {
            return false;
          }
          return true;
        },
      },
      suppressRowClickSelection: true,
      defaultColDef: {
        resizable: true,
        sortable: true,
        menuTabs: ["filterMenuTab"],
        filter: true,
        flex: 1,
        suppressHeaderContextMenu: true,
      },
      tooltipShowDelay: 0,
      getRowId: ({ data }) => data.Id,
      getContextMenuItems: (params) => {
        const option = { messageApi, modalApi };
        return [
          manualSTPRightMenu(params, option, (d) =>
            dispatch(updateBlotterDatas(d))
          ),
          manualResendRightMenu(params, option),
        ];
      },
      columnDefs: defaultGridFieldsDef,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    dispatch(setBlotterGridEvent(params));
    const gridAction = () => dispatch(triggerSearch("next"));
    onGridBodyScroll({ params, gridAction });
    setTimeout(() => {
      dispatch(triggerSearch("initial"));
    }, 0);
  }, []);

  return (
    <>
      <StyledRoot>
        <DataGrid
          className={[classes.root, DataGridClasses.mainBlotter].join(" ")}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </StyledRoot>
      {messageContextHolder}
      {modalContextHolder}
    </>
  );
};

export default CashflowDataGrid;
