import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, EmptyState, ErrorFallback, LoadingOverlay, SearchInput, Spinner } from '../src';
import { Box, Paper, Stack, Typography } from '../src/primitives';
import { ContentPaste } from '../src/icons';

const meta = {
  title: 'Feedback/State scenarios',
  component: EmptyState,
  tags: ['autodocs'],
  args: { title: 'No items yet', description: 'Create an item to get started.' },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    action: { control: false },
    illustration: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reusable empty, error and loading surfaces. These examples keep filtering, retries and progress in host state; presentation components do not fetch data, catch errors or navigate.',
      },
    },
  },
  render: (args) => (
    <Box sx={{ p: 3 }}>
      <EmptyState {...args} />
    </Box>
  ),
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const TitleOnly: Story = { args: { title: 'Nothing to display', description: null } };
export const Illustrated: Story = {
  args: {
    title: 'Your collection is empty',
    description: 'Items you add will appear here.',
    illustration: <ContentPaste sx={{ fontSize: '3rem', color: 'text.secondary', mb: 2 }} />,
    wrapperProps: { sx: { display: 'flex', justifyContent: 'center', py: 4 } },
    contentProps: { sx: { textAlign: 'center', maxWidth: '100%' } },
  },
};
export const LongContent: Story = {
  args: {
    title: 'No results match all of the selected criteria',
    description:
      'Try removing one or more filters, shortening your search, or selecting a wider period. Your current settings remain available so you can adjust them without starting over.',
    contentProps: { sx: { maxWidth: '40rem' } },
  },
};

function FilterResultsExample() {
  const [query, setQuery] = React.useState('No match');
  const items = ['Daily summary', 'Saved search', 'Monthly overview'].filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <SearchInput
        label="Find an item"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        handleClear={() => setQuery('')}
      />
      {items.length ? (
        <Stack spacing={1}>
          {items.map((item) => (
            <Paper variant="outlined" key={item} sx={{ p: 2 }}>
              {item}
            </Paper>
          ))}
        </Stack>
      ) : (
        <EmptyState
          title="No matching items"
          description={`No results for “${query}”.`}
          action={
            <Button variant="outlined" onClick={() => setQuery('')}>
              Clear filters
            </Button>
          }
        />
      )}
      <Typography role="status">{items.length} results</Typography>
    </Stack>
  );
}
export const EmptySearchRecovery: Story = { render: () => <FilterResultsExample /> };

function RetryExample() {
  const [state, setState] = React.useState<'error' | 'loading' | 'ready'>('error');
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      {state === 'error' ? (
        <ErrorFallback
          title="This section could not load"
          description="Your changes are still available. Retry to reload this section."
          action={
            <Button variant="outlined" onClick={() => setState('loading')}>
              Retry
            </Button>
          }
        />
      ) : state === 'loading' ? (
        <Stack spacing={2}>
          <Typography role="status">Retrying this section…</Typography>
          <Button variant="contained" onClick={() => setState('ready')}>
            Complete retry
          </Button>
          <Button variant="outlined" onClick={() => setState('error')}>
            Simulate retry failure
          </Button>
        </Stack>
      ) : (
        <>
          <Typography role="status">Section loaded successfully</Typography>
          <Button variant="outlined" onClick={() => setState('error')}>
            Reset error scenario
          </Button>
        </>
      )}
    </Stack>
  );
}
export const ErrorRetryRecovery: Story = { render: () => <RetryExample /> };
export const ErrorWithoutAction: Story = {
  render: () => (
    <ErrorFallback title="Preview unavailable" description="This format cannot be previewed." />
  ),
};

function OverlayExample() {
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Start loading section
      </Button>
      <Box
        sx={{ position: 'relative', minHeight: 280, border: 1, borderColor: 'divider', p: 2 }}
        aria-busy={open}
      >
        <Typography gutterBottom>Only this section is covered.</Typography>
        <Button variant="contained" disabled={open} onClick={() => setCount((value) => value + 1)}>
          Underlying action
        </Button>
        <LoadingOverlay
          open={open}
          backdropProps={{
            sx: {
              position: 'absolute',
              color: 'text.primary',
              bgcolor: 'background.paper',
              zIndex: 1,
            },
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Spinner aria-hidden="true" size={32} />
            <Typography>Preparing the section…</Typography>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Finish loading
            </Button>
          </Stack>
        </LoadingOverlay>
      </Box>
      <Typography role="status">Underlying action count: {count}</Typography>
      <Typography variant="body2">
        Closing the overlay releases pointer input immediately. The host disables the underlying
        action while busy.
      </Typography>
    </Stack>
  );
}
export const ScopedLoadingAndRelease: Story = { render: () => <OverlayExample /> };
