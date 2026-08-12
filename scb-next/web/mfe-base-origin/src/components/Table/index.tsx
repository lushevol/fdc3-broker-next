import React, { ReactElement } from "react";
import Root, { classes, PREFIX } from "./common/style";
import { TableProps } from "./common/interface";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ErrorBoundry from "../ErrorBoundry";
import TableDetail from "../TableDetail";
import LoadingButton from "../LoadingButton";
import ModalAction from "./ModalAction";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const Table: React.FC<TableProps> = (props: TableProps): ReactElement => {
  const {
    rows,
    columns,
    openDetail,
    record,
    onChange,
    onVerify,
    onUpdate,
    onDeactivate,
    onSave,
    onReset,
    onClose,
    resetId,
    isLoading,
    columnVisibilityModel = {},
  } = props;

  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`}>
        <DataGrid
          className={classes.grid}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
            columns: { columnVisibilityModel },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          density="compact"
          sx={{
            "& .MuiDataGrid-virtualScroller": {
              width: "calc(100% - 0px)!important",
            },
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
        />
        {!!openDetail && record && (
          <TableDetail
            title={`${record.mode} ID: ${record.id}`}
            resetId={resetId}
            record={record}
            columns={columns}
            onChange={onChange}
            isResizeble
            isDraggable
            isLoading={isLoading}
            defaultWidth={1000}
            defaultHeight={600}
            actionComponents={
              <>
                <ModalAction
                  isLoading={isLoading}
                  record={record}
                  onSave={onSave}
                  onUpdate={onUpdate}
                  onVerify={onVerify}
                  onDeactivate={onDeactivate}
                />
                <LoadingButton
                  onClick={onReset}
                  color="inherit"
                  loading={isLoading}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  onClick={onClose}
                  loading={isLoading}
                  color="error"
                >
                  Close
                </LoadingButton>
              </>
            }
          />
        )}
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(Table);
