import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import InteropEditor from './InteropEditor';
import { FDC3IntentDefinition, FDC3ContextDefinition } from './interface';

interface DeclarationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
  tiles: any[]; // List of available tiles
  intents: FDC3IntentDefinition[];
  contexts: FDC3ContextDefinition[];
  isEdit?: boolean;
  readOnly?: boolean;
}

const DeclarationDialog: React.FC<DeclarationDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  tiles,
  intents,
  contexts,

  isEdit,
  readOnly,
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState<any>({
    appId: '',
    interop: { intents: { listensFor: {}, raises: {} } },
  });

  // Reset form when opening
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData)));
      } else {
        setFormData({
          appId: '',
          interop: { intents: { listensFor: {}, raises: {} } },
        });
      }
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!formData.appId) return;
    await onSave(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '600px',
          bgcolor: 'background.paper',
          backgroundImage: 'none', // Remove default gradient if any
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {isEdit ? `Edit ID: ${formData.appId}` : 'Create New Declaration'}
        </Typography>
        <Box>
          <IconButton onClick={() => setFullScreen(!fullScreen)} size="small" sx={{ mr: 1 }}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose} size="small" color="error">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2, fontWeight: 500 }}>
            App ID:
          </Typography>
          <Autocomplete
            options={tiles.map((t) => t.tileId)}
            value={formData.appId}
            onChange={(_, newValue) => setFormData({ ...formData, appId: newValue })}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" placeholder="Select Tile ID" />
            )}
            disabled={isEdit} // App ID usually cannot change on edit
            sx={{ width: 300 }}
          />
        </Box>

        <Box
          sx={{
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.default',
          }}
        >
          <InteropEditor
            value={formData.interop}
            onChange={(val) => setFormData({ ...formData, interop: val })}
            intents={intents}
            contexts={contexts}
            readOnly={readOnly}
          />
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.default' }}
      >
        <Button onClick={onClose} color="inherit" sx={{ mr: 'auto', color: 'error.main' }}>
          Close
        </Button>
        <Button
          onClick={() =>
            setFormData(
              initialData || { appId: '', interop: { intents: { listensFor: {}, raises: {} } } },
            )
          }
          color="inherit"
          disabled={readOnly}
        >
          Reset
        </Button>
        {!readOnly && (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.appId}
            sx={{ px: 4 }}
          >
            {isEdit ? 'Update' : 'Create'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeclarationDialog;
