import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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
          boxShadow: fullScreen ? 'none' : '0 24px 80px rgba(15, 23, 42, 0.26)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#f8fafc',
          borderBottom: 1,
          borderColor: 'divider',
          px: 3,
          py: 2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            FDC3 declaration editor
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
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

      <DialogContent sx={{ p: 0, flex: 1, minHeight: 0, overflow: 'hidden', bgcolor: '#ffffff' }}>
        <Box
          sx={{
            height: '100%',
            minHeight: 0,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '340px minmax(0, 1fr)' },
          }}
        >
          <Stack
            spacing={2.5}
            sx={{
              p: 3,
              minHeight: 0,
              overflow: 'auto',
              bgcolor: '#f8fafc',
              borderRight: { xs: 0, md: 1 },
              borderBottom: { xs: 1, md: 0 },
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Application
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Choose the tile that owns this declaration.
              </Typography>
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
            </Box>

            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Capabilities
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
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

            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: formData.appId && isInteropValid ? 'success.light' : 'warning.light',
                borderRadius: 1,
                bgcolor: formData.appId && isInteropValid ? '#f0fdf4' : '#fffbeb',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircleOutlineIcon
                  color={formData.appId && isInteropValid ? 'success' : 'warning'}
                  fontSize="small"
                />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Save status
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {!formData.appId
                  ? 'Select an app before saving this declaration.'
                  : isInteropValid
                    ? 'The declaration is valid and ready to save.'
                    : 'Fix the interop JSON before saving.'}
              </Typography>
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
