import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  ToggleButtonGroup,
  Typography,
} from '../src/primitives';
import { ToggleButton } from '../src';
import { Add, Close, LockOutlined, PersonOutlined } from '../src/icons';

const meta = {
  title: 'Foundation/Form primitives',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Unmodified MUI primitives for composed forms. Prefer the core Input/Select/Button when package-specific label or appearance behavior is required.',
      },
    },
  },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextFieldPlayground: Story = {
  args: {
    label: 'Field label',
    helperText: 'Supporting information',
    variant: 'outlined',
    size: 'small',
    disabled: false,
    required: false,
    error: false,
    fullWidth: false,
    multiline: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['outlined', 'filled', 'standard'] },
    size: { control: 'select', options: ['small', 'medium'] },
  },
};

export const TextFieldVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The raw MUI filled error example uses a darker error label on light backgrounds and a lighter error label on dark backgrounds through InputLabelProps. Its filled surface needs more contrast than the unfilled variants. This is explicit host composition; package theme defaults are unchanged.',
      },
    },
  },
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      {(['outlined', 'filled', 'standard'] as const).map((variant) => (
        <Stack key={variant} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField variant={variant} label={`${variant} default`} defaultValue="Editable value" />
          <TextField
            variant={variant}
            label={`${variant} required`}
            required
            helperText="Required field"
          />
          <TextField
            variant={variant}
            label={`${variant} error`}
            error
            defaultValue="Invalid"
            helperText="Enter a valid value"
            InputLabelProps={
              variant === 'filled'
                ? {
                    sx: (theme) => ({
                      '&.Mui-error': {
                        color:
                          theme.palette.error[theme.palette.mode === 'dark' ? 'light' : 'dark'],
                      },
                    }),
                  }
                : undefined
            }
          />
          <TextField
            variant={variant}
            label={`${variant} disabled`}
            disabled
            defaultValue="Disabled"
          />
        </Stack>
      ))}
      <TextField
        label="Read-only"
        defaultValue="Available for selection"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Notes"
        multiline
        minRows={3}
        maxRows={6}
        helperText="Grows from three to six rows"
      />
    </Stack>
  ),
};

export const AdornmentsAndOutlinedInput: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3, maxWidth: 500 }}>
      <TextField
        label="Username"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlined />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Password"
        type="password"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlined />
            </InputAdornment>
          ),
        }}
      />
      <FormControl variant="outlined">
        <InputLabel htmlFor="primitive-amount">Amount</InputLabel>
        <OutlinedInput
          id="primitive-amount"
          label="Amount"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          endAdornment={<InputAdornment position="end">USD</InputAdornment>}
          inputProps={{ inputMode: 'decimal' }}
        />
      </FormControl>
      <TextField
        label="Length"
        type="number"
        InputProps={{ endAdornment: <InputAdornment position="end">cm</InputAdornment> }}
      />
    </Stack>
  ),
};

function SelectionDemo() {
  const [single, setSingle] = React.useState('');
  const [multiple, setMultiple] = React.useState<string[]>(['Email']);
  return (
    <Stack spacing={3} sx={{ p: 3, maxWidth: 500 }}>
      <FormControl fullWidth>
        <InputLabel id="primitive-select-label">Delivery</InputLabel>
        <Select
          labelId="primitive-select-label"
          id="primitive-select"
          label="Delivery"
          value={single}
          onChange={(event) => setSingle(event.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Email">Email</MenuItem>
          <MenuItem value="Download">Download</MenuItem>
          <MenuItem disabled value="Print">
            Print (unavailable)
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="primitive-multiple-label">Channels</InputLabel>
        <Select
          multiple
          labelId="primitive-multiple-label"
          id="primitive-multiple"
          label="Channels"
          value={multiple}
          onChange={(event) =>
            setMultiple(
              typeof event.target.value === 'string'
                ? event.target.value.split(',')
                : event.target.value,
            )
          }
        >
          {['Email', 'Download', 'Notification'].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl disabled>
        <InputLabel id="primitive-disabled-label">Disabled selection</InputLabel>
        <Select labelId="primitive-disabled-label" label="Disabled selection" value="Email">
          <MenuItem value="Email">Email</MenuItem>
        </Select>
      </FormControl>
      <Typography role="status">
        Delivery: {single || 'none'}; channels: {multiple.join(', ') || 'none'}
      </Typography>
    </Stack>
  );
}
export const SelectCombinations: Story = { render: () => <SelectionDemo /> };

const cities = [
  { label: 'London', region: 'Europe' },
  { label: 'Paris', region: 'Europe' },
  { label: 'Singapore', region: 'Asia' },
  { label: 'Tokyo', region: 'Asia' },
];
export const AutocompleteCombinations: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3, maxWidth: 500 }}>
      <Autocomplete
        options={cities}
        renderInput={(params) => <TextField {...params} label="Single option" />}
      />
      <Autocomplete
        multiple
        options={cities}
        defaultValue={[cities[0]]}
        renderInput={(params) => <TextField {...params} label="Multiple options" />}
      />
      <Autocomplete
        freeSolo
        options={cities.map((city) => city.label)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Create or select an option"
            helperText="Type a custom value and press Enter"
          />
        )}
      />
      <Autocomplete
        options={[...cities].sort((a, b) => a.region.localeCompare(b.region))}
        groupBy={(option) => option.region}
        getOptionDisabled={(option) => option.label === 'Paris'}
        renderInput={(params) => <TextField {...params} label="Grouped with disabled option" />}
      />
      <Autocomplete
        options={[]}
        loading
        loadingText="Loading available choices…"
        renderInput={(params) => <TextField {...params} label="Loading options" />}
      />
      <Autocomplete
        options={[]}
        noOptionsText="No matching choices"
        renderInput={(params) => <TextField {...params} label="Empty options" />}
      />
      <Autocomplete
        options={cities}
        defaultValue={cities[2]}
        readOnly
        renderInput={(params) => <TextField {...params} label="Read-only choice" />}
      />
      <Autocomplete
        options={cities}
        defaultValue={cities[3]}
        disabled
        renderInput={(params) => <TextField {...params} label="Disabled choice" />}
      />
    </Stack>
  ),
};

function SwitchesAndGroupsDemo() {
  const [enabled, setEnabled] = React.useState(true);
  const [alignment, setAlignment] = React.useState('left');
  const [formats, setFormats] = React.useState<string[]>(['bold']);
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Notifications</FormLabel>
        <Stack direction="row" alignItems="center">
          <Switch
            id="primitive-enabled"
            checked={enabled}
            onChange={(_event, checked) => setEnabled(checked)}
          />
          <label htmlFor="primitive-enabled">{enabled ? 'Enabled' : 'Disabled'}</label>
        </Stack>
      </FormControl>
      <Stack direction="row">
        <Switch size="small" defaultChecked inputProps={{ 'aria-label': 'Small switch' }} />
        <Switch
          color="secondary"
          defaultChecked
          inputProps={{ 'aria-label': 'Secondary switch' }}
        />
        <Switch disabled checked inputProps={{ 'aria-label': 'Disabled on switch' }} />
        <Switch disabled inputProps={{ 'aria-label': 'Disabled off switch' }} />
      </Stack>
      <ToggleButtonGroup
        exclusive
        value={alignment}
        onChange={(_event, value: string | null) => {
          if (value) setAlignment(value);
        }}
        aria-label="Alignment"
      >
        {['left', 'center', 'right'].map((value) => (
          <ToggleButton key={value} value={value}>
            {value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={formats}
        onChange={(_event, value: string[]) => setFormats(value)}
        aria-label="Text formatting"
      >
        <ToggleButton value="bold">Bold</ToggleButton>
        <ToggleButton value="italic">Italic</ToggleButton>
        <ToggleButton value="underline" disabled>
          Underline
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography role="status">
        Alignment: {alignment}; formatting: {formats.join(', ') || 'plain'}
      </Typography>
    </Stack>
  );
}
export const SwitchAndToggleGroups: Story = { render: () => <SwitchesAndGroupsDemo /> };

export const PrimitiveActions: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      {(['contained', 'outlined', 'text'] as const).map((variant) => (
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2} key={variant}>
          {(['small', 'medium', 'large'] as const).map((size) => (
            <Button key={size} variant={variant} size={size}>
              {variant} {size}
            </Button>
          ))}
          <Button variant={variant} disabled>
            Disabled
          </Button>
        </Stack>
      ))}
      <Stack direction="row" spacing={2}>
        <Button startIcon={<Add />} variant="contained">
          Add item
        </Button>
        <Button endIcon={<Close />} color="error">
          Close item
        </Button>
        <IconButton aria-label="Add an item" color="primary">
          <Add />
        </IconButton>
        <IconButton aria-label="Unavailable close" disabled>
          <Close />
        </IconButton>
      </Stack>
      <Box sx={{ maxWidth: 400 }}>
        <Button fullWidth variant="outlined">
          Full width action
        </Button>
      </Box>
    </Stack>
  ),
};
