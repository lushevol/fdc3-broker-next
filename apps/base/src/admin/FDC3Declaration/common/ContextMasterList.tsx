import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { FDC3ContextDefinition } from './interface';

interface ContextMasterListProps {
  contexts: FDC3ContextDefinition[];
  onCreate: (context: FDC3ContextDefinition) => Promise<void>;
  onUpdate?: (context: FDC3ContextDefinition) => Promise<void>;
  onDelete?: (context: FDC3ContextDefinition) => Promise<void>;
  isLoading: boolean;
  readOnly?: boolean;
}

const ContextMasterList: React.FC<ContextMasterListProps> = ({
  contexts,
  onCreate,
  onUpdate,
  onDelete,
  isLoading,
  readOnly,
}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  // Temporary state for the Type input
  const [tempType, setTempType] = React.useState('');
  const [currentContext, setCurrentContext] = React.useState<FDC3ContextDefinition>({
    schema: { type: '' as any },
    description: '',
  });

  const handleOpenCreate = () => {
    setIsEdit(false);
    setTempType('');
    setCurrentContext({ schema: {}, description: '' });
    setOpen(true);
  };

  const handleOpenEdit = (context: FDC3ContextDefinition) => {
    setIsEdit(true);
    setTempType(context.schema.type as string);
    setCurrentContext({ ...context });
    setOpen(true);
  };

  const handleOpenDelete = (context: FDC3ContextDefinition) => {
    setCurrentContext({ ...context });
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (tempType) {
      const contextToSave = {
        ...currentContext,
        schema: { ...currentContext.schema, type: tempType as any },
      };

      if (isEdit && onUpdate) {
        await onUpdate(contextToSave);
      } else {
        await onCreate(contextToSave);
      }
      setOpen(false);
      setTempType('');
      setCurrentContext({ schema: {}, description: '' });
    }
  };

  const handleConfirmDelete = async () => {
    if (onDelete && currentContext.schema?.type) {
      await onDelete(currentContext);
      setDeleteDialogOpen(false);
      setCurrentContext({ schema: {}, description: '' });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Context Type',
      width: 250,
      valueGetter: (params) => params.row.schema.type,
    },
    { field: 'description', headerName: 'Description', width: 400 },
    ...(readOnly
      ? []
      : [
          {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: any) => (
              <>
                <IconButton
                  onClick={() => handleOpenEdit(params.row as FDC3ContextDefinition)}
                  size="small"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenDelete(params.row as FDC3ContextDefinition)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]),
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
        <Typography variant="h6" color="primary">
          FDC3 Contexts Configuration
        </Typography>
        {!readOnly && (
          <Button variant="contained" onClick={handleOpenCreate} startIcon={<EditIcon />}>
            Create New Context
          </Button>
        )}
      </Box>
      <DataGrid
        rows={contexts.map((c) => ({ id: c.schema.type, ...c }))}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableRowSelectionOnClick
        sx={{ border: 'none', '& .MuiDataGrid-cell:hover': { color: 'primary.main' } }}
      />

      {/* Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'common.white' }}>
          {isEdit ? 'Edit Context Type' : 'Create New Context Type'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              autoFocus
              label="Context Type"
              fullWidth
              variant="outlined"
              value={tempType}
              onChange={(e) => setTempType(e.target.value)}
              helperText="Unique identifier for the context (e.g. fdc3.instrument)"
              disabled={isEdit}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={currentContext.description}
              onChange={(e) =>
                setCurrentContext({ ...currentContext, description: e.target.value })
              }
              placeholder="Describe this context type..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={!tempType}>
            {isEdit ? 'Update Changes' : 'Create Context'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the context{' '}
            <strong>{currentContext.schema?.type}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContextMasterList;
