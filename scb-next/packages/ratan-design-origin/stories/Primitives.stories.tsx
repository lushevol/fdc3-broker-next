import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AppBar, Box, Card, CardContent, Grid, IconButton, InputAdornment, Switch, Tab, Tabs, TextField, Toolbar, Tooltip, Typography } from '../src/primitives';
import { Add, LockOutlined, PersonOutlined } from '../src/icons';
import { DataGrid } from '../src/data-grid';

function PrimitiveComposition() {
  const [tab, setTab] = React.useState(0);
  return (
    <Box sx={{ maxWidth: 680, p: 3 }}>
      <Typography variant="h5" gutterBottom>Account details</Typography>
      <Tabs value={tab} onChange={(_event, next: number) => setTab(next)} aria-label="Account sections">
        <Tab label="Details" />
        <Tab label="Security" />
      </Tabs>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Username" variant="outlined" InputProps={{
            startAdornment: <InputAdornment position="start"><PersonOutlined /></InputAdornment>,
          }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Password" type="password" variant="outlined" InputProps={{
            startAdornment: <InputAdornment position="start"><LockOutlined /></InputAdornment>,
          }} />
        </Grid>
      </Grid>
    </Box>
  );
}

const meta = { title: 'Foundation/Primitives', component: PrimitiveComposition } satisfies Meta<typeof PrimitiveComposition>;
export default meta;
export const FieldsAndTabs: StoryObj<typeof meta> = {};

export function ShellSurfaces() {
  const [enabled, setEnabled] = React.useState(true);
  return (
    <Box sx={{ width: 640, maxWidth: '100%' }}>
      <AppBar position="static"><Toolbar>
        <Typography variant="h6" sx={{ flex: 1 }}>Workspace</Typography>
        <Tooltip title="Add workspace"><IconButton color="inherit" aria-label="Add workspace"><Add /></IconButton></Tooltip>
      </Toolbar></AppBar>
      <Card sx={{ m: 2 }}><CardContent>
        <Typography variant="subtitle1">Display settings</Typography>
        <Switch checked={enabled} onChange={(_event, checked) => setEnabled(checked)} inputProps={{ 'aria-label': 'Enable display' }} />
        <Alert severity={enabled ? 'success' : 'info'}>{enabled ? 'Enabled' : 'Disabled'}</Alert>
      </CardContent></Card>
    </Box>
  );
}

export function GridSurface() {
  return (
    <Box sx={{ width: 640, maxWidth: '100%', height: 280 }}>
      <DataGrid rows={[{ id: 1, name: 'First row' }, { id: 2, name: 'Second row' }]}
        columns={[{ field: 'id', headerName: 'ID', width: 100 }, { field: 'name', headerName: 'Name', flex: 1 }]} />
    </Box>
  );
}
