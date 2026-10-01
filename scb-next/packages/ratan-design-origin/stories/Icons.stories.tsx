import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '../src/primitives';
import {
  Add,
  Adjust,
  ArrowForwardIos,
  CallMade,
  CheckCircleOutlined,
  Close,
  ContentPaste,
  Dangerous,
  Delete,
  Edit,
  ExpandMore,
  History,
  KeyboardArrowDown,
  LightMode,
  LockOutlined,
  PersonOutlined,
  PublishedWithChanges,
  RadioButtonUnchecked,
  RateReview,
  Refresh,
  Unpublished,
} from '../src/icons';

const icons = {
  Add,
  Adjust,
  ArrowForwardIos,
  CallMade,
  CheckCircleOutlined,
  Close,
  ContentPaste,
  Dangerous,
  Delete,
  Edit,
  ExpandMore,
  History,
  KeyboardArrowDown,
  LightMode,
  LockOutlined,
  PersonOutlined,
  PublishedWithChanges,
  RadioButtonUnchecked,
  RateReview,
  Refresh,
  Unpublished,
};
function IconGallery({
  fontSize = 'medium',
  color = 'inherit',
}: {
  fontSize?: React.ComponentProps<typeof Add>['fontSize'];
  color?: React.ComponentProps<typeof Add>['color'];
}) {
  const [query, setQuery] = React.useState('');
  const entries = Object.entries(icons).filter(([name]) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <TextField
        label="Find an icon"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        helperText={`${entries.length} of 21 curated icons`}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 2,
        }}
      >
        {entries.map(([name, Icon]) => (
          <Paper
            key={name}
            variant="outlined"
            sx={{ p: 2, textAlign: 'center', overflowWrap: 'anywhere' }}
          >
            <Icon fontSize={fontSize} color={color} />
            <Typography variant="caption" component="div">
              {name}
            </Typography>
          </Paper>
        ))}
      </Box>
      {entries.length === 0 && <Typography role="status">No matching icons.</Typography>}
    </Stack>
  );
}
const meta = {
  title: 'Foundation/Icons',
  component: IconGallery,
  tags: ['autodocs'],
  args: { fontSize: 'medium', color: 'inherit' },
  argTypes: {
    fontSize: { control: 'select', options: ['small', 'medium', 'large', 'inherit'] },
    color: {
      control: 'select',
      options: [
        'inherit',
        'primary',
        'secondary',
        'action',
        'disabled',
        'error',
        'info',
        'success',
        'warning',
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'All 21 public glyphs from the curated icons entry. Icons are decorative beside visible labels; icon-only buttons need aria-label and standalone informative icons need titleAccess.',
      },
    },
  },
} satisfies Meta<typeof IconGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Gallery: Story = {};
export const SizesAndColors: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        {(['small', 'medium', 'large'] as const).map((fontSize) => (
          <Stack key={fontSize} alignItems="center">
            <Add fontSize={fontSize} />
            <Typography variant="caption">{fontSize}</Typography>
          </Stack>
        ))}
        <Add sx={{ fontSize: 48 }} titleAccess="Custom 48 pixel icon" />
      </Stack>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={3}>
        {(['primary', 'secondary', 'error', 'info', 'success', 'warning', 'disabled'] as const).map(
          (color) => (
            <Stack key={color} alignItems="center">
              <CheckCircleOutlined color={color} />
              <Typography variant="caption">{color}</Typography>
            </Stack>
          ),
        )}
      </Stack>
    </Stack>
  ),
};
function AccessibleActionsDemo() {
  const [action, setAction] = React.useState('No action yet');
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
        <Button startIcon={<Add />} variant="contained" onClick={() => setAction('Added')}>
          Add item
        </Button>
        <Button endIcon={<CallMade />} onClick={() => setAction('Opened')}>
          Open details
        </Button>
        <Tooltip title="Refresh items">
          <IconButton aria-label="Refresh items" onClick={() => setAction('Refreshed')}>
            <Refresh />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete item">
          <IconButton aria-label="Delete item" color="error" onClick={() => setAction('Deleted')}>
            <Delete />
          </IconButton>
        </Tooltip>
        <CheckCircleOutlined titleAccess="Validation complete" color="success" />
      </Stack>
      <Typography role="status">{action}</Typography>
    </Stack>
  );
}
export const AccessibleActions: Story = { render: () => <AccessibleActionsDemo /> };
