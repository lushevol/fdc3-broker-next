import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BuilderButton,
  BuilderTab,
  BuilderTabs,
  BuilderTabPanel,
  builderTabProps,
  Button,
  EmptyState,
  Input,
  SearchInput,
  type BuilderButtonProps,
} from '../src';
import { Box, Stack, Switch, Typography } from '../src/primitives';

const COLUMNS = [
  'Reference',
  'Description',
  'Amount',
  'Currency',
  'Status',
  'Created by',
  'Updated at',
];

function BuilderExample(args: BuilderButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [tab, setTab] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState(COLUMNS.slice(0, 4));
  const [applied, setApplied] = React.useState(COLUMNS.slice(0, 4));
  const [event, setEvent] = React.useState('No action yet');
  const visible = COLUMNS.filter((column) => column.toLowerCase().includes(query.toLowerCase()));
  const filter = args.label === 'Filters';
  const close = (reason: string) => {
    setAnchorEl(null);
    setEvent(reason);
  };
  return (
    <Box sx={{ p: 3 }}>
      <BuilderButton
        {...args}
        anchorEl={anchorEl}
        onClick={(click) => {
          setAnchorEl(click.currentTarget);
          setSelected(applied);
        }}
        onClose={(_event, reason) => close(reason)}
      >
        <BuilderTabs
          value={tab}
          onChange={(_event, next: number) => setTab(next)}
          aria-label={`${args.label} options`}
        >
          <BuilderTab label={filter ? 'Criteria' : 'Columns'} {...builderTabProps(0)} />
          <BuilderTab label={filter ? 'Saved filters' : 'Order'} {...builderTabProps(1)} />
        </BuilderTabs>
        <BuilderTabPanel value={tab} index={0}>
          <SearchInput
            variant="outlined"
            fullWidth
            label={filter ? 'Find a criterion' : 'Find a column'}
            value={query}
            onChange={(change) => setQuery(change.target.value)}
            handleClear={() => setQuery('')}
          />
          {visible.length ? (
            visible.map((column) => (
              <Box
                key={column}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Typography>{column}</Typography>
                <Switch
                  inputProps={{ 'aria-label': `${filter ? 'Filter by' : 'Show'} ${column}` }}
                  checked={selected.includes(column)}
                  onChange={(_event, checked) =>
                    setSelected((current) =>
                      checked ? [...current, column] : current.filter((item) => item !== column),
                    )
                  }
                />
              </Box>
            ))
          ) : (
            <EmptyState
              title="No matching options"
              description="Try a different search."
              action={<Button onClick={() => setQuery('')}>Clear option search</Button>}
            />
          )}
        </BuilderTabPanel>
        <BuilderTabPanel value={tab} index={1}>
          <Input
            variant="outlined"
            fullWidth
            label={filter ? 'Filter name' : 'Order note'}
            defaultValue="Retained draft"
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Edit this field, switch tabs, then return. The inactive panel remains mounted and
            retains its draft.
          </Typography>
        </BuilderTabPanel>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              setSelected(COLUMNS.slice(0, 4));
              setQuery('');
              setEvent('reset draft');
            }}
          >
            Reset
          </Button>
          <Button variant="outlined" color="inherit" onClick={() => close('cancel')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setApplied(selected);
              close('apply');
            }}
          >
            Apply
          </Button>
        </Stack>
      </BuilderButton>
      <Typography role="status" sx={{ mt: 2 }}>
        Last action: {event}. Applied: {applied.join(', ') || 'None'}.
      </Typography>
    </Box>
  );
}

const meta = {
  title: 'Search/Builder scenarios',
  component: BuilderButton,
  tags: ['autodocs'],
  args: {
    label: 'Table',
    anchorEl: null,
    size: 'medium',
    popOverWidth: 'min(24rem, calc(100vw - 32px))',
    popOverHeight: 'min(35rem, calc(100vh - 120px))',
  },
  argTypes: {
    label: { control: 'radio', options: ['Table', 'Filters'] },
    size: { control: 'radio', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    anchorEl: { control: false },
    children: { control: false },
    popOverWidth: { control: 'text' },
    popOverHeight: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Controlled builders combine package tabs/panels, retained draft inputs, searchable options and host-owned Apply/Cancel behavior. Use arrow keys between tabs; Escape/backdrop closes and returns focus to the trigger. Draft selection is committed only by Apply.',
      },
    },
  },
  render: (args) => <BuilderExample {...args} />,
} satisfies Meta<typeof BuilderButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Table: Story = {};
export const Filters: Story = { args: { label: 'Filters' } };
export const Compact: Story = {
  args: {
    size: 'small',
    popOverWidth: 'min(20rem, calc(100vw - 32px))',
    popOverHeight: 'min(25rem, calc(100vh - 120px))',
  },
};
export const Large: Story = { args: { size: 'large' } };
export const Disabled: Story = { args: { disabled: true } };
export const IndependentInstances: Story = {
  render: (args) => (
    <>
      <BuilderExample {...args} label="Table" />
      <BuilderExample {...args} label="Filters" />
    </>
  ),
};

function StandaloneTabsExample() {
  const [value, setValue] = React.useState(0);
  const instanceId = React.useId();
  return (
    <Box sx={{ p: 3 }}>
      <BuilderTabs
        value={value}
        onChange={(_event, next: number) => setValue(next)}
        aria-label="Standalone builder tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {['Visible', 'Retained', 'Unavailable'].map((label, index) => (
          <BuilderTab
            key={label}
            label={label}
            disabled={index === 2}
            id={`${instanceId}-tab-${index}`}
            aria-controls={`${instanceId}-panel-${index}`}
          />
        ))}
      </BuilderTabs>
      {[0, 1, 2].map((index) => (
        <BuilderTabPanel
          key={index}
          index={index}
          value={value}
          id={`${instanceId}-panel-${index}`}
          aria-labelledby={`${instanceId}-tab-${index}`}
        >
          <Box sx={{ py: 2 }}>
            <Input
              variant="outlined"
              label={`Panel ${index + 1} draft`}
              defaultValue={`Draft ${index + 1}`}
              fullWidth
            />
          </Box>
        </BuilderTabPanel>
      ))}
    </Box>
  );
}
export const StandaloneTabs: Story = {
  render: () => <StandaloneTabsExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Tabs and panels can be composed without a popover. Explicit instance-scoped IDs retain relationships; disabled tabs are skipped by keyboard navigation.',
      },
    },
  },
};
