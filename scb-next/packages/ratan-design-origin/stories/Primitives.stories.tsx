import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box, Grid, InputAdornment, Tab, Tabs, TextField, Typography } from '../src/primitives';
import { LockOutlined, PersonOutlined } from '../src/icons';

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
