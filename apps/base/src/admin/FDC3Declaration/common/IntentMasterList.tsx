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
import type { FDC3IntentDefinition } from './interface';

interface IntentMasterListProps {
  intents: FDC3IntentDefinition[];
  onCreate: (intent: FDC3IntentDefinition) => Promise<void>;
  onUpdate?: (intent: FDC3IntentDefinition) => Promise<void>;
  onDelete?: (intent: FDC3IntentDefinition) => Promise<void>;
  isLoading: boolean;
  readOnly?: boolean;
  getReferences?: (intentName: string) => string[];
}

const IntentMasterList: React.FC<IntentMasterListProps> = ({
  intents,
  onCreate,
  onUpdate,
  onDelete,
  isLoading,
  readOnly,
  getReferences,
}) => {
  const [open, setOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [currentIntent, setCurrentIntent] = React.useState<FDC3IntentDefinition>({
    name: '',
    description: '',
  });

  const handleOpenCreate = () => {
    setIsEdit(false);
    setCurrentIntent({ name: '', description: '' });
    setOpen(true);
  };

  const handleOpenEdit = (intent: FDC3IntentDefinition) => {
    setIsEdit(true);
    setCurrentIntent({ ...intent });
    setOpen(true);
  };

  const handleOpenDelete = (intent: FDC3IntentDefinition) => {
    setCurrentIntent({ ...intent });
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (currentIntent.name) {
      if (isEdit && onUpdate) {
        await onUpdate(currentIntent);
      } else {
        await onCreate(currentIntent);
      }
      setOpen(false);
      setCurrentIntent({ name: '', description: '' });
    }
  };

  const handleConfirmDelete = async () => {
    if (onDelete && currentIntent.name) {
      await onDelete(currentIntent);
      setDeleteDialogOpen(false);
      setCurrentIntent({ name: '', description: '' });
    }
  };

  const references = getReferences?.(currentIntent.name) ?? [];

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Intent Name', width: 250 },
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
                  onClick={() => handleOpenEdit(params.row as FDC3IntentDefinition)}
                  size="small"
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenDelete(params.row as FDC3IntentDefinition)}
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
    <Box
      sx={{
        height: '100%',
        minHeight: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" color="primary">
          FDC3 Intents Configuration
        </Typography>
        {!readOnly && (
          <Button variant="contained" onClick={handleOpenCreate} startIcon={<EditIcon />}>
            Create New Intent
          </Button>
        )}
      </Box>
      <DataGrid
        rows={intents.map((i) => ({ id: i.name, ...i }))} // Use name as ID
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          flex: 1,
          height: '100%',
          minHeight: 0,
          '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
        }}
      />

      {/* Access / Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'common.white' }}>
          {isEdit ? 'Edit Intent' : 'Create New Intent'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              autoFocus
              label="Intent Name"
              fullWidth
              variant="outlined"
              value={currentIntent.name}
              onChange={(e) => setCurrentIntent({ ...currentIntent, name: e.target.value })}
              helperText="Unique identifier for the intent (e.g. ViewInstrument)"
              disabled={isEdit}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={currentIntent.description}
              onChange={(e) => setCurrentIntent({ ...currentIntent, description: e.target.value })}
              placeholder="Describe what this intent does..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={!currentIntent.name}>
            {isEdit ? 'Update Changes' : 'Create Intent'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete the intent{' '}
            <strong>{currentIntent.name}</strong>? This action cannot be undone and may affect
            applications using this intent.
          </DialogContentText>
          {references.length > 0 && (
            <DialogContentText color="warning.main" sx={{ mt: 2 }}>
              Used by: {references.join(', ')}
            </DialogContentText>
          )}
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

export default IntentMasterList;
