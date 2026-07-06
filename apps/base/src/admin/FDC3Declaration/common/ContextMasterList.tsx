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
import { getContextType } from './model';

interface ContextMasterListProps {
  contexts: FDC3ContextDefinition[];
  onCreate: (context: FDC3ContextDefinition) => Promise<void>;
  onUpdate?: (context: FDC3ContextDefinition) => Promise<void>;
  onDelete?: (context: FDC3ContextDefinition) => Promise<void>;
  isLoading: boolean;
  readOnly?: boolean;
  getReferences?: (contextType: string) => string[];
}

const ContextMasterList: React.FC<ContextMasterListProps> = ({
  contexts,
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
  // Temporary state for the Type input
  const [tempType, setTempType] = React.useState('');
  const [currentContext, setCurrentContext] = React.useState<FDC3ContextDefinition>({
    schema: { type: '' as any },
    description: '',
  });
  const [schemaJson, setSchemaJson] = React.useState('{}');
  const [samplesJson, setSamplesJson] = React.useState('[]');
  const [jsonError, setJsonError] = React.useState('');

  const buildDefaultSchema = (type: string) => ({
    type: 'object',
    properties: {
      type: {
        const: type,
      },
    },
    required: ['type'],
  });

  const handleOpenCreate = () => {
    setIsEdit(false);
    setTempType('');
    setCurrentContext({ schema: buildDefaultSchema('') as any, description: '', samples: [] });
    setSchemaJson(JSON.stringify(buildDefaultSchema(''), null, 2));
    setSamplesJson('[]');
    setJsonError('');
    setOpen(true);
  };

  const handleOpenEdit = (context: FDC3ContextDefinition) => {
    setIsEdit(true);
    setTempType(getContextType(context));
    setCurrentContext({ ...context });
    setSchemaJson(JSON.stringify(context.schema ?? buildDefaultSchema(getContextType(context)), null, 2));
    setSamplesJson(JSON.stringify(context.samples ?? (context as any).simples ?? [], null, 2));
    setJsonError('');
    setOpen(true);
  };

  const handleOpenDelete = (context: FDC3ContextDefinition) => {
    setCurrentContext({ ...context });
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (tempType) {
      let parsedSchema: unknown;
      let parsedSamples: unknown;

      try {
        parsedSchema = JSON.parse(schemaJson);
        parsedSamples = JSON.parse(samplesJson);
      } catch (error) {
        setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
        return;
      }

      if (!parsedSchema || typeof parsedSchema !== 'object' || Array.isArray(parsedSchema)) {
        setJsonError('Schema JSON must be an object');
        return;
      }

      if (!Array.isArray(parsedSamples)) {
        setJsonError('Sample JSON must be an array');
        return;
      }

      const contextToSave = {
        ...currentContext,
        schema: {
          ...(parsedSchema as object),
          properties: {
            ...((parsedSchema as any).properties ?? {}),
            type: {
              ...((parsedSchema as any).properties?.type ?? {}),
              const: tempType,
            },
          },
        } as any,
        samples: parsedSamples as any,
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
    if (onDelete && getContextType(currentContext)) {
      await onDelete(currentContext);
      setDeleteDialogOpen(false);
      setCurrentContext({ schema: {}, description: '' });
    }
  };

  const references = getReferences?.(getContextType(currentContext)) ?? [];

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: 'Context Type',
      width: 250,
      valueGetter: (params) => getContextType(params.row as FDC3ContextDefinition),
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
            <TextField
              label="Schema JSON"
              fullWidth
              multiline
              minRows={6}
              variant="outlined"
              value={schemaJson}
              onChange={(e) => setSchemaJson(e.target.value)}
              error={!!jsonError}
            />
            <TextField
              label="Sample JSON Array"
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              value={samplesJson}
              onChange={(e) => setSamplesJson(e.target.value)}
              error={!!jsonError}
              helperText={jsonError}
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
            <strong>{getContextType(currentContext)}</strong>? This action cannot be undone.
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

export default ContextMasterList;
