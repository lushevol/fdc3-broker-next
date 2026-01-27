import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import React, { type ReactElement } from 'react';
import Dialog from '../../../components/Dialog';
import ErrorBoundry from '../../../components/ErrorBoundry';
import Table from '../../../components/Table';
import type { FormProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

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
          style={{ width: '240px' }}
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
                '& .MuiDataGrid-virtualScroller': {
                  width: 'calc(100% - 0px)!important',
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
