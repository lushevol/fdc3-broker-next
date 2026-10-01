import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  Input,
  ResetButton,
  SearchButton,
  SearchCondition,
  SearchConditionContainer,
  SearchGrid,
  SearchInput,
  Select,
  type SearchConditionProps,
} from '../src';
import { Box, MenuItem, Stack, Typography } from '../src/primitives';

const initialCriteria = [
  { id: 'status', label: 'Status', value: 'Active' },
  { id: 'category', label: 'Category', value: 'Documents' },
  { id: 'owner', label: 'Owner', value: 'Current user' },
  { id: 'scope', label: 'Scope', value: 'All shared collections' },
  { id: 'created', label: 'Created', value: 'Past thirty days' },
  { id: 'updated', label: 'Updated', value: 'Past seven days' },
  { id: 'format', label: 'Format', value: 'Plain text and structured records' },
  {
    id: 'title',
    label: 'Title',
    value: 'A longer descriptive title to exercise wrapping in a narrow search region',
  },
];

function DismissibleConditionDemo(props: SearchConditionProps) {
  const [generation, setGeneration] = React.useState(0);
  const [closed, setClosed] = React.useState(false);
  return (
    <Stack spacing={2}>
      <SearchCondition
        key={generation}
        {...props}
        closeText={`Remove ${props.label} criterion`}
        onClose={(event) => {
          props.onClose?.(event);
          setClosed(true);
        }}
      />
      <Button
        disabled={!closed}
        onClick={() => {
          setGeneration((current) => current + 1);
          setClosed(false);
        }}
      >
        Restore criterion
      </Button>
      <Typography role="status">
        Criterion: {closed ? 'removed' : 'visible'}; restored: {generation}
      </Typography>
    </Stack>
  );
}

const meta = {
  title: 'Patterns/Search',
  component: SearchCondition,
  subcomponents: { SearchGrid, SearchConditionContainer, SearchInput, SearchButton, ResetButton },
  tags: ['autodocs'],
  args: {
    label: 'Status',
    value: 'Active',
    severity: 'info',
    variant: 'standard',
    onClose: () => undefined,
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    severity: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
    variant: { control: 'inline-radio', options: ['standard', 'outlined', 'filled'] },
    onClose: { action: 'criterion removed' },
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 3, maxWidth: '64rem' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Generic search compositions: host-owned field/criteria values and submit/reset policy, package-owned presentation and collapse state. SearchCondition dismisses itself and then notifies onClose; remount it to restore the same criterion. Collapsed off-screen rows remain mounted but become inert and hidden from assistive technology.',
      },
    },
  },
} satisfies Meta<typeof SearchCondition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CriterionPlayground: Story = {
  render: ({ ref: _ref, ...args }) => <DismissibleConditionDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Status criterion' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Criterion: removed');
    await userEvent.click(canvas.getByRole('button', { name: 'Restore criterion' }));
    await expect(canvas.getByRole('button', { name: 'Remove Status criterion' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('restored: 1');
  },
};

function ConditionVariantsDemo() {
  const [generation, setGeneration] = React.useState(0);
  const [removed, setRemoved] = React.useState<string[]>([]);
  return (
    <Stack spacing={2}>
      {(['standard', 'outlined', 'filled'] as const).map((variant) => (
        <Stack key={variant} spacing={1}>
          <Typography variant="h6" component="h2">
            {variant}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(['info', 'success', 'warning', 'error'] as const).map((severity) => (
              <SearchCondition
                key={`${generation}-${severity}`}
                label={severity}
                value="Selected"
                variant={variant}
                severity={severity}
                closeText={`Remove ${variant} ${severity}`}
                onClose={() => setRemoved((current) => [...current, `${variant}/${severity}`])}
              />
            ))}
          </Box>
        </Stack>
      ))}
      <SearchCondition
        key={`long-${generation}`}
        label="Description"
        value="A multi-word criterion can wrap naturally when the available region is narrow."
        closeText="Remove description criterion"
        onClose={() => setRemoved((current) => [...current, 'description'])}
        sx={{ maxWidth: '100%' }}
      />
      <Button
        onClick={() => {
          setGeneration((current) => current + 1);
          setRemoved([]);
        }}
      >
        Restore all criteria
      </Button>
      <Typography role="status" sx={{ overflowWrap: 'anywhere' }}>
        Removed: {removed.join(', ') || 'none'}
      </Typography>
    </Stack>
  );
}

export const CriterionVariantsAndLongContent: Story = {
  render: () => <ConditionVariantsDemo />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'SearchCondition retains the Alert API, including severity/variant, while applying its own compact criteria styling and suppressing the severity icon. Every close action has a distinct accessible name.',
      },
    },
  },
};

function CriteriaCollection({
  narrow = false,
  empty = false,
}: {
  narrow?: boolean;
  empty?: boolean;
}) {
  const [criteria, setCriteria] = React.useState(empty ? [] : initialCriteria);
  const [generation, setGeneration] = React.useState(0);
  const [lastEvent, setLastEvent] = React.useState('No criteria removed');
  return (
    <Stack spacing={2} sx={{ width: '100%', maxWidth: narrow ? '24rem' : undefined }}>
      <Typography variant="body2">
        Expand the region to reach additional criteria. Tab skips clipped rows; collapse retains
        child state. Remove criteria and restore the collection to compare wrapping.
      </Typography>
      <SearchConditionContainer
        aria-label="Applied search criteria"
        sx={{ flexWrap: 'wrap', minWidth: 0 }}
      >
        {criteria.map((criterion) => (
          <SearchCondition
            key={`${generation}-${criterion.id}`}
            label={criterion.label}
            value={criterion.value}
            closeText={`Remove ${criterion.label} criterion`}
            sx={{ maxWidth: '100%' }}
            onClose={(event) => {
              setCriteria((current) => current.filter((item) => item.id !== criterion.id));
              setLastEvent(`Removed ${criterion.label} (${event.type})`);
            }}
          />
        ))}
      </SearchConditionContainer>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <ResetButton
          onClick={() => {
            setCriteria(initialCriteria);
            setGeneration((current) => current + 1);
            setLastEvent('Restored all criteria');
          }}
        >
          Restore criteria
        </ResetButton>
        <Button
          disabled={criteria.length === 0}
          onClick={() => {
            setCriteria([]);
            setLastEvent('Cleared all criteria');
          }}
        >
          Clear criteria
        </Button>
      </Box>
      <Typography role="status">
        {criteria.length} criteria. {lastEvent}
      </Typography>
    </Stack>
  );
}

export const ExpandCollapseAndDismissCriteria: Story = {
  render: () => <CriteriaCollection />,
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Expand search criteria' }));
    await expect(canvas.getByRole('button', { name: 'Collapse search criteria' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Owner criterion' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('7 criteria. Removed Owner');
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse search criteria' }));
    await expect(canvas.getByRole('button', { name: 'Expand search criteria' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

export const NarrowCriteriaRegion: Story = {
  render: () => <CriteriaCollection narrow />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A constrained region exercises wrapped long values, clipped row semantics, and keyboard focus as criteria are removed. The viewport toolbar can make this narrower still.',
      },
    },
  },
};

export const EmptyCriteriaRegion: Story = {
  render: () => <CriteriaCollection empty />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The empty container retains its expand/collapse affordance. A host can instead choose not to render it when there are no criteria. Restore criteria demonstrates dynamic child insertion.',
      },
    },
  },
};

function ResponsiveSearchForm() {
  const [query, setQuery] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [criteria, setCriteria] = React.useState<{ id: string; label: string; value: string }[]>(
    [],
  );
  const [revision, setRevision] = React.useState(0);
  const [result, setResult] = React.useState('Search has not been applied');
  const reset = () => {
    setQuery('');
    setOwner('');
    setCategory('all');
    setCriteria([]);
    setResult('Search reset');
  };
  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={(event) => {
        event.preventDefault();
        const next = [
          ...(query ? [{ id: 'query', label: 'Query', value: query }] : []),
          ...(owner ? [{ id: 'owner', label: 'Owner', value: owner }] : []),
          ...(category !== 'all' ? [{ id: 'category', label: 'Category', value: category }] : []),
        ];
        setCriteria(next);
        setRevision((value) => value + 1);
        setResult(`Applied ${next.length} criteria`);
      }}
      onReset={reset}
    >
      <Typography variant="h6" component="h2">
        Search collection
      </Typography>
      <SearchGrid container spacing={2}>
        <SearchGrid item xs={12} md={6}>
          <SearchInput
            label="Query"
            variant="outlined"
            labelPosition="left"
            fullWidth
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            handleClear={() => setQuery('')}
            clearButtonLabel="Clear collection query"
          />
        </SearchGrid>
        <SearchGrid item xs={12} md={6}>
          <Input
            label="Owner"
            variant="outlined"
            labelPosition="left"
            fullWidth
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
          />
        </SearchGrid>
        <SearchGrid item xs={12} md={6}>
          <Select
            label="Category"
            variant="outlined"
            labelPosition="left"
            value={category}
            onChange={(event) => setCategory(String(event.target.value))}
          >
            <MenuItem value="all">All categories</MenuItem>
            <MenuItem value="Documents">Documents</MenuItem>
            <MenuItem value="Images">Images</MenuItem>
          </Select>
        </SearchGrid>
        <SearchGrid item xs={12} md={6}>
          <Input
            label="Scope"
            variant="outlined"
            labelPosition="left"
            fullWidth
            value="Shared collection"
            slotProps={{ input: { readOnly: true } }}
          />
        </SearchGrid>
      </SearchGrid>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <SearchButton type="submit">Apply search</SearchButton>
        <ResetButton type="reset">Reset search</ResetButton>
      </Box>
      {criteria.length > 0 && (
        <SearchConditionContainer aria-label="Current query criteria" sx={{ flexWrap: 'wrap' }}>
          {criteria.map((criterion) => (
            <SearchCondition
              key={`${revision}-${criterion.id}`}
              {...criterion}
              closeText={`Remove ${criterion.label} filter`}
              onClose={() => {
                setCriteria((current) => current.filter((item) => item.id !== criterion.id));
                setResult(`Removed ${criterion.label} filter`);
              }}
            />
          ))}
        </SearchConditionContainer>
      )}
      <Typography role="status">{result}</Typography>
      <Typography variant="body2">
        Fields are a draft until Apply search is submitted. Removing an applied chip updates the
        example result set without rewriting the draft. The host decides whether a real query should
        run automatically.
      </Typography>
    </Stack>
  );
}

export const ResponsiveSearchGridApplyAndReset: Story = {
  render: () => <ResponsiveSearchForm />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'SearchGrid accepts MUI Grid layout props. This example stacks at narrow widths and uses two columns at medium widths. SearchInput, Input, Select, SearchButton, ResetButton and the criteria collection share controlled local state; Enter submits the form.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Query'), 'Guide');
    await userEvent.type(canvas.getByLabelText('Owner'), 'Alex');
    await userEvent.click(canvas.getByRole('button', { name: 'Apply search' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Applied 2 criteria');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset search' }));
    await expect(canvas.getByLabelText('Query')).toHaveValue('');
    await expect(canvas.getByLabelText('Owner')).toHaveValue('');
    await expect(canvas.getByRole('status')).toHaveTextContent('Search reset');
  },
};
