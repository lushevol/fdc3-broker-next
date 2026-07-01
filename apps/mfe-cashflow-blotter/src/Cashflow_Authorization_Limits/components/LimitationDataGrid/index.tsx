import { AgGridReactProps } from "ag-grid-react";
import { message, Modal } from "antd";
import { FC, useMemo } from "react";
import {
  LimitationActionType,
  LimitationRecord,
} from "src/Cashflow_Authorization_Limits/Main/common/interface";
import { DataGrid, DataGridClasses } from "src/Root/import/ratancomponents";
import { formatePrice } from "src/Root/import/ratanutils";

import GridActions from "./GridActions";
import { useActionHandler } from "./hooks";
import { LimitationDataGridProps } from "./interface";
import StyledRoot, { classes } from "./style";

const LimitationDataGrid: FC<LimitationDataGridProps> = ({
  gridData,
  onOpenDetailsDialog,
  onDeleteLimitation,
  onApproveAddLimitation,
  onRejectAddLimitation,
  onApproveEditLimitation,
  onRejectEditLimitation,
  onApproveDeleteLimitation,
  onRejectDeleteLimitation,
}) => {
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { handleAction } = useActionHandler({
    onOpenDetailsDialog,
    onDeleteLimitation,
    onApproveAddLimitation,
    onRejectAddLimitation,
    onApproveEditLimitation,
    onRejectEditLimitation,
    onApproveDeleteLimitation,
    onRejectDeleteLimitation,
    modalApi,
    messageApi,
  });
  const gridColumnDefs: AgGridReactProps["columnDefs"] = [
    {
      headerName: "Profile",
      field: "profile",
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Currency",
      field: "currency",
      minWidth: 200,
      flex: 1,
    },
    {
      headerName: "Limitation",
      field: "limitation",
      minWidth: 200,
      flex: 1,
      valueFormatter: (params) => formatePrice(params.value),
    },
    {
      headerName: "Actions",
      width: 250,
      cellRenderer: (e) => <GridActions data={e.data} onClick={handleAction} />,
    },
  ];
  const gridOptions = useMemo<AgGridReactProps["gridOptions"]>(() => {
    return {
      suppressRowClickSelection: true,
      onRowDoubleClicked: (params: any) => {
        onOpenDetailsDialog(true, params.data, LimitationActionType.VIEW);
      },
      immutableData: true,
      defaultColDef: {
        resizable: true,
        sortable: true,
        autoHeight: true,
        cellStyle: {
          "white-space": "normal",
          "text-align": "left",
        },
      },
      suppressContextMenu: true,
      // defaultColDef: {
      //   resizable: true,
      //   sortable: true,
      //   menuTabs: ["filterMenuTab"],
      //   filter: true,
      // },
      tooltipShowDelay: 0,
      getRowNodeId: (data: LimitationRecord) =>
        `${data.profile}-${data.currency}-${data.updatedAt}`,
      pagination: true,
    };
  }, [onOpenDetailsDialog]);

  return (
    <StyledRoot>
      {modalContextHolder}
      {messageContextHolder}
      <DataGrid
        className={[classes.root, DataGridClasses.mainBlotter]}
        rowData={gridData}
        gridOptions={gridOptions}
        columnDefs={gridColumnDefs}
      />
    </StyledRoot>
  );
};

export default LimitationDataGrid;
