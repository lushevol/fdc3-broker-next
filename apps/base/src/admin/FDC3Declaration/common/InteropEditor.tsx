import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { classes } from './style';
import type { FDC3Interop, FDC3IntentDefinition, FDC3ContextDefinition } from './interface';

interface InteropEditorProps {
  value: FDC3Interop;
  onChange: (value: FDC3Interop) => void;
  intents: FDC3IntentDefinition[];
  contexts: FDC3ContextDefinition[];
  readOnly?: boolean;
}

const InteropEditor: React.FC<InteropEditorProps> = ({
  value,
  onChange,
  intents,
  contexts,
  readOnly,
}) => {
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonString, setJsonString] = useState('');

  // Sync internal JSON string when value changes externally (and not in JSON mode to avoid cursor jumps) or mode switch
  useEffect(() => {
    if (jsonMode) {
      setJsonString(JSON.stringify(value, null, 2));
    }
  }, [jsonMode, value]);

  const handleJsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = event.target.value;
    setJsonString(newVal);
    try {
      const parsed = JSON.parse(newVal);
      onChange(parsed);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const getListensForEntries = (
    record: FDC3Interop['intents']['listensFor'] | undefined,
  ): Array<{ name: string; contexts: string[] }> => {
    if (Array.isArray(record)) {
      return record.map((item: any) => ({
        name: item.intent || item,
        contexts: item.contexts || [],
      }));
    }
    // Fallback if it matches legacy Record or empty
    return Object.entries((record || {}) as Record<string, any>).map(([name, data]) => ({
      name,
      contexts: data?.contexts || [],
    }));
  };

  const getRaisesEntries = (
    record: FDC3Interop['intents']['raises'] | undefined,
  ): Array<{ name: string; contexts: string[] }> => {
    // Raises is an array of objects
    if (Array.isArray(record)) {
      return record.map((item: any) => ({
        name: item.intent || item, // Handle object or string shorthand
        contexts: item.contexts || [],
      }));
    }
    // Fallback if it matches legacy Record or empty
    return [];
  };

  const handleContextChange = (
    type: 'listensFor' | 'raises',
    intentName: string,
    newContexts: string[],
  ) => {
    const newVal = { ...value, intents: { ...value.intents } };

    if (type === 'listensFor') {
      const listensFor = Array.isArray(newVal.intents.listensFor)
        ? [...newVal.intents.listensFor]
        : [];
      const index = listensFor.findIndex((r: any) => r.intent === intentName);
      if (index !== -1) {
        listensFor[index] = { ...listensFor[index], contexts: newContexts };
      } else {
        listensFor.push({ intent: intentName, contexts: newContexts } as any);
      }
      newVal.intents.listensFor = listensFor as any;
    } else {
      // raises
      const raises = Array.isArray(newVal.intents.raises) ? [...newVal.intents.raises] : [];
      const index = raises.findIndex((r) => r.intent === intentName);
      if (index !== -1) {
        raises[index] = { ...raises[index], contexts: newContexts };
      } else {
        // Fallback, practically shouldn't happen if UI is consistent
        raises.push({ intent: intentName, contexts: newContexts } as any);
      }
      newVal.intents.raises = raises as any;
    }
    onChange(newVal);
  };

  const handleDeleteIntent = (type: 'listensFor' | 'raises', intentName: string) => {
    const newVal = { ...value, intents: { ...value.intents } };

    if (type === 'listensFor') {
      const listensFor = Array.isArray(newVal.intents.listensFor)
        ? [...newVal.intents.listensFor]
        : [];
      newVal.intents.listensFor = listensFor.filter((r: any) => r.intent !== intentName) as any;
    } else {
      const raises = Array.isArray(newVal.intents.raises) ? [...newVal.intents.raises] : [];
      newVal.intents.raises = raises.filter((r: any) => r.intent !== intentName) as any;
    }
    onChange(newVal);
  };

  const addNewIntent = (type: 'listensFor' | 'raises', intentName: string) => {
    if (!intentName) return;
    const newVal = { ...value, intents: { ...value.intents } };

    if (type === 'listensFor') {
      const listensFor = Array.isArray(newVal.intents.listensFor)
        ? [...newVal.intents.listensFor]
        : [];
      if (!listensFor.find((r: any) => r.intent === intentName)) {
        listensFor.push({ intent: intentName, contexts: [] } as any);
        newVal.intents.listensFor = listensFor as any;
        onChange(newVal);
      }
    } else {
      const raises = Array.isArray(newVal.intents.raises) ? [...newVal.intents.raises] : [];
      if (!raises.find((r: any) => r.intent === intentName)) {
        raises.push({ intent: intentName, contexts: [] } as any);
        newVal.intents.raises = raises as any;
        onChange(newVal);
      }
    }
  };

  const [newListenIntent, setNewListenIntent] = useState<string | null>(null);
  const [newRaiseIntent, setNewRaiseIntent] = useState<string | null>(null);

  return (
    <Box className={classes.editorContainer}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">FDC3 Interop Configuration</Typography>
        <FormControlLabel
          control={<Switch checked={jsonMode} onChange={(e) => setJsonMode(e.target.checked)} />}
          label="JSON Mode"
        />
      </Box>

      {jsonMode ? (
        <TextField
          fullWidth
          multiline
          rows={10}
          value={jsonString}
          onChange={handleJsonChange}
          error={!!jsonError}
          helperText={jsonError}
          className={classes.jsonEditor}
          disabled={readOnly}
        />
      ) : (
        <Grid container spacing={3}>
          {/* Listens For Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom className={classes.section}>
              Listens For
            </Typography>
            <Box mb={2} display="flex" gap={1}>
              {!readOnly && (
                <>
                  <Autocomplete
                    options={intents.map((i) => i.name)}
                    value={newListenIntent}
                    onChange={(_, val) => setNewListenIntent(val)}
                    renderInput={(params) => (
                      <TextField {...params} size="small" label="Select Intent to Add" />
                    )}
                    sx={{ width: 300 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      if (newListenIntent) {
                        addNewIntent('listensFor', newListenIntent);
                        setNewListenIntent(null);
                      }
                    }}
                    disabled={!newListenIntent}
                  >
                    Add
                  </Button>
                </>
              )}
            </Box>
            <Stack spacing={2}>
              {getListensForEntries(value?.intents?.listensFor).map(
                ({ name, contexts: currentContexts }) => (
                  <Box
                    key={name}
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    p={1}
                    bgcolor="action.hover"
                    borderRadius={1}
                  >
                    <Chip
                      label={name}
                      color="primary"
                      sx={{ minWidth: 150, justifyContent: 'space-between' }}
                      onDelete={
                        !readOnly ? () => handleDeleteIntent('listensFor', name) : undefined
                      }
                    />
                    <Autocomplete
                      multiple
                      freeSolo
                      options={contexts.map((c) => c.schema.type as string)}
                      value={currentContexts}
                      onChange={(_, val) => handleContextChange('listensFor', name, val)}
                      renderTags={(val, getTagProps) =>
                        val.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            size="small"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" placeholder="" hiddenLabel />
                      )}
                      sx={{ flexGrow: 1 }}
                      disabled={readOnly}
                      readOnly={readOnly}
                    />
                  </Box>
                ),
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Raises Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom className={classes.section}>
              Raises
            </Typography>
            <Box mb={2} display="flex" gap={1}>
              {!readOnly && (
                <>
                  <Autocomplete
                    options={intents.map((i) => i.name)}
                    value={newRaiseIntent}
                    onChange={(_, val) => setNewRaiseIntent(val)}
                    renderInput={(params) => (
                      <TextField {...params} size="small" label="Select Intent to Add" />
                    )}
                    sx={{ width: 300 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      if (newRaiseIntent) {
                        addNewIntent('raises', newRaiseIntent);
                        setNewRaiseIntent(null);
                      }
                    }}
                    disabled={!newRaiseIntent}
                  >
                    Add
                  </Button>
                </>
              )}
            </Box>
            <Stack spacing={2}>
              {getRaisesEntries(value?.intents?.raises).map(
                ({ name, contexts: currentContexts }) => (
                  <Box
                    key={name}
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    p={1}
                    bgcolor="action.hover"
                    borderRadius={1}
                  >
                    <Chip
                      label={name}
                      color="secondary"
                      sx={{ minWidth: 150, justifyContent: 'space-between' }}
                      onDelete={!readOnly ? () => handleDeleteIntent('raises', name) : undefined}
                    />
                    <Autocomplete
                      multiple
                      freeSolo
                      options={contexts.map((c) => c.schema.type as string)}
                      value={currentContexts}
                      onChange={(_, val) => handleContextChange('raises', name, val)}
                      renderTags={(val, getTagProps) =>
                        val.map((option, index) => (
                          <Chip
                            variant="outlined"
                            label={option}
                            size="small"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          placeholder="Contexts"
                          hiddenLabel
                        />
                      )}
                      sx={{ flexGrow: 1 }}
                      disabled={readOnly}
                      readOnly={readOnly}
                    />
                  </Box>
                ),
              )}
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default InteropEditor;
