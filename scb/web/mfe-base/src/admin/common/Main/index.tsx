import React, { ReactElement } from "react";
import Table from "../../../components/Table";
import ErrorBoundry from "../../../components/ErrorBoundry";
import { Button } from "ratan-design-origin/primitives";
import { FormProps } from "./common/interface";
import Dialog from "../../../components/Dialog";
import { DataGrid } from "ratan-design-origin/data-grid";
import Root, { classes, PREFIX } from "./common/style";

const Main: React.FC<FormProps> = (props: FormProps): ReactElement => {
  const {
    onCreateNew,
    titleCreateNew,
    openAudit,
    onCloseAudit,
    auditColumns,
    auditRows,
    disabledCreateNew,
    ...rest
  } = props;

  return (
    <ErrorBoundry>
      <Root className={classes.root} data-testid={`${PREFIX}`}>
        <Button
          variant="contained"
          style={{ width: "240px" }}
          onClick={onCreateNew}
          disabled={disabledCreateNew}
        >
          {titleCreateNew}
        </Button>
        <Table {...rest} />
        {!!openAudit && !!auditRows?.length && (
          <Dialog
            titleComponents="Audit"
            open={true}
            isDraggable
            isResizeble
            disablePortal={true}
            hideBackdrop={false}
            defaultWidth={1000}
            defaultHeight={600}
            dividers
            onClose={onCloseAudit}
          >
            <DataGrid
              className={classes.grid}
              rows={auditRows}
              columns={auditColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 20,
                  },
                },
              }}
              pageSizeOptions={[20, 50, 100]}
              disableRowSelectionOnClick
              density="compact"
              sx={{
                "& .MuiDataGrid-virtualScroller": {
                  width: "calc(100% - 0px)!important",
                },
              }}
            />
          </Dialog>
        )}
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(Main);
