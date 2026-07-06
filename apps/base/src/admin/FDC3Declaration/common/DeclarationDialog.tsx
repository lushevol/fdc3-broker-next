import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InteropEditor from './InteropEditor';
import type { FDC3DeclarationData, FDC3IntentDefinition, FDC3ContextDefinition } from './interface';
import { normalizeInterop } from './model';

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
  onDelete?: (data: FDC3DeclarationData) => Promise<void>;
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
  onDelete,
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isInteropValid, setIsInteropValid] = useState(true);
  const [formData, setFormData] = useState<any>({
    appId: '',
    interop: { intents: { listensFor: [], raises: [] } },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        const nextData = JSON.parse(JSON.stringify(initialData));
        setFormData({ ...nextData, interop: normalizeInterop(nextData.interop) });
      } else {
        setFormData({
          appId: '',
          interop: { intents: { listensFor: [], raises: [] } },
        });
      }
      setIsInteropValid(true);
    }
  }, [open, initialData]);

  const getBlankDeclaration = () => ({
    appId: '',
    interop: { intents: { listensFor: [], raises: [] } },
  });

  const getInitialFormData = () => {
    if (!initialData) return getBlankDeclaration();

    const nextData = JSON.parse(JSON.stringify(initialData));
    return { ...nextData, interop: normalizeInterop(nextData.interop) };
  };

  const handleReset = () => {
    setFormData(getInitialFormData());
    setIsInteropValid(true);
  };

  const handleSave = async () => {
    if (!formData.appId || !isInteropValid) return;
    await onSave(formData);
    onClose();
  };

  const tileOptions = tiles.map((tile) => ({
    label: [tile.title, tile.tileId ?? tile.appId ?? tile.tile ?? tile.id]
      .filter(Boolean)
      .join(' - '),
    value: tile.tileId ?? tile.appId ?? tile.tile ?? String(tile.id ?? ''),
  }));
  const selectedTileOption =
    tileOptions.find((option) => option.value === formData.appId) ??
    (formData.appId ? { label: formData.appId, value: formData.appId } : null);
  const normalizedInterop = normalizeInterop(formData.interop);
  const listensForCount = normalizedInterop.intents.listensFor.length;
  const raisesCount = normalizedInterop.intents.raises.length;
  const contextCount = new Set([
    ...normalizedInterop.intents.listensFor.flatMap((entry) => entry.contexts),
    ...normalizedInterop.intents.raises.flatMap((entry) => entry.contexts),
  ]).size;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: fullScreen ? '100%' : 'min(820px, calc(100vh - 48px))',
          maxHeight: fullScreen ? '100%' : 'calc(100vh - 48px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: fullScreen ? 0 : 1,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            FDC3 declaration
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {isEdit ? formData.appId || 'Edit declaration' : 'Create declaration'}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => setFullScreen(!fullScreen)} size="small" sx={{ mr: 1 }}>
            {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose} size="small" color="error">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{ p: 0, flex: 1, minHeight: 0, overflow: 'hidden', bgcolor: 'background.paper' }}
      >
        <Box
          sx={{
            height: '100%',
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
          }}
        >
          <Stack
            spacing={2.5}
            sx={{
              p: 3,
              minHeight: 0,
              overflow: 'auto',
              bgcolor: 'background.default',
              borderRight: { xs: 0, md: 1 },
              borderBottom: { xs: 1, md: 0 },
              borderColor: 'divider',
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Application
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose the tile that owns this declaration.
              </Typography>
            </Box>
            <Autocomplete
              options={tileOptions}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              value={selectedTileOption}
              onChange={(_, newValue) =>
                setFormData({
                  ...formData,
                  appId: newValue?.value ?? '',
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="App ID"
                  variant="outlined"
                  size="small"
                  placeholder="Select tile"
                  required
                />
              )}
              disabled={isEdit}
              fullWidth
            />
            <Divider />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Capabilities
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                <Chip
                  label={`${listensForCount} listens`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`${raisesCount} raises`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
                <Chip label={`${contextCount} contexts`} size="small" variant="outlined" />
              </Stack>
            </Box>
            <Divider />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Save status
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={
                    !formData.appId
                      ? 'Select an app'
                      : isInteropValid
                        ? 'Ready to save'
                        : 'Fix interop JSON'
                  }
                  color={formData.appId && isInteropValid ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </Box>
          </Stack>

          <Box
            sx={{
              p: 3,
              minHeight: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 2, flexShrink: 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Interop capabilities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage the intents this app listens for, the intents it raises, and the contexts
                connected to each.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
              <InteropEditor
                value={formData.interop}
                onChange={(val) => setFormData({ ...formData, interop: val })}
                intents={intents}
                contexts={contexts}
                readOnly={readOnly}
                onValidityChange={setIsInteropValid}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          flexShrink: 0,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
          {isEdit && onDelete && !readOnly && (
            <Button onClick={() => onDelete(formData)} color="error" variant="outlined">
              Delete
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={handleReset} color="inherit" disabled={readOnly}>
            Reset
          </Button>
          {!readOnly && (
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!formData.appId || !isInteropValid}
              sx={{ px: 4 }}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DeclarationDialog;
