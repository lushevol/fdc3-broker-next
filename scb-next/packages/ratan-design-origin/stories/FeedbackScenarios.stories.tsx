import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Loader, PageLoader, Snackbar, Spinner, type SnackbarProps } from '../src';
import { Box, Stack, Typography } from '../src/primitives';

function NotificationExample(args: SnackbarProps) {
  const [open, setOpen] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState('No notification event');
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
          setLastEvent('opened');
        }}
      >
        Show notification
      </Button>
      <Typography role="status">Last event: {lastEvent}</Typography>
      <Snackbar
        {...args}
        open={open}
        onClose={(_event, reason) => {
          setLastEvent(reason ?? 'close button');
          if (reason !== 'clickaway') setOpen(false);
        }}
        action={
          args.action ? (
            <Button
              color="inherit"
              onClick={() => {
                setOpen(false);
                setLastEvent('undo');
              }}
            >
              Undo
            </Button>
          ) : undefined
        }
      />
    </Stack>
  );
}

const meta = {
  title: 'Feedback/Notification and progress scenarios',
  component: Snackbar,
  tags: ['autodocs'],
  args: {
    open: false,
    severity: 'success',
    variant: 'standard',
    message: 'Changes saved.',
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
  },
  argTypes: {
    open: { control: false },
    severity: { control: 'select', options: ['success', 'info', 'warning', 'error'] },
    variant: { control: 'select', options: ['standard', 'outlined', 'filled'] },
    message: { control: 'text' },
    autoHideDuration: { control: 'number' },
    action: { control: false },
    anchorOrigin: { control: 'object' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Notifications start closed to keep Docs examples independent. Controls combine severity, variant, content, duration and placement. Close callbacks are visible below the trigger; clickaway is recorded but does not dismiss.',
      },
    },
  },
  render: (args) => <NotificationExample {...args} />,
} satisfies Meta<typeof Snackbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const ErrorWithUndo: Story = {
  args: {
    severity: 'error',
    variant: 'filled',
    message: 'The last change could not be applied.',
    action: true,
  },
};
export const WarningOutlined: Story = {
  args: { severity: 'warning', variant: 'outlined', message: 'Some entries need your attention.' },
};
export const InformationTopRight: Story = {
  args: {
    severity: 'info',
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    message: 'New information is available.',
  },
};
export const AutoDismiss: Story = {
  args: { autoHideDuration: 4000 },
  parameters: {
    docs: {
      description: {
        story:
          'Dismisses after four seconds. Hover or focus pauses the timer; the callback reports timeout.',
      },
    },
  },
};
export const LongMessage: Story = {
  args: {
    severity: 'warning',
    variant: 'outlined',
    message: 'Some entries need review before continuing. '.repeat(12),
    alertsx: { maxWidth: '100%' },
  },
};
export const RichContent: Story = {
  args: {
    severity: 'info',
    message: (
      <span>
        <strong>Update complete.</strong> Three entries were refreshed. The{' '}
        <code>&lt;strong&gt;</code> string is displayed as text.
      </span>
    ),
  },
};
export const PlainTextIsNotHtml: Story = {
  args: { message: '<strong>Literal text stays literal.</strong>' },
};

function NotificationMatrixExample() {
  const [selection, setSelection] = React.useState<Pick<
    SnackbarProps,
    'severity' | 'variant'
  > | null>(null);
  const [result, setResult] = React.useState('Choose a severity and variant');
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      {(['success', 'info', 'warning', 'error'] as const).map((severity) => (
        <Box key={severity}>
          <Typography component="h2" variant="subtitle1">
            {severity}
          </Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
            {(['standard', 'outlined', 'filled'] as const).map((variant) => (
              <Button
                key={variant}
                variant="outlined"
                onClick={() => {
                  setSelection({ severity, variant });
                  setResult(`${severity} / ${variant}`);
                }}
              >
                {severity} {variant}
              </Button>
            ))}
          </Stack>
        </Box>
      ))}
      <Typography role="status">{result}</Typography>
      <Snackbar
        open={selection !== null}
        severity={selection?.severity}
        variant={selection?.variant}
        message={`${selection?.severity ?? ''} notification with the ${selection?.variant ?? ''} variant.`}
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') {
            setSelection(null);
            setResult(`Closed: ${reason ?? 'close button'}`);
          }
        }}
      />
    </Stack>
  );
}
export const SeverityAndVariantMatrix: Story = { render: () => <NotificationMatrixExample /> };

export const LoaderSizesAndLabels: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography component="h2" variant="h6">
        Loader size and naming
      </Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={3} alignItems="center">
        <Loader size={32} text="Refreshing" />
        <Loader size={64} text="Loading results" />
        <Loader text="Loading workspace" />
        <Loader size="4rem" aria-label="Background refresh" />
      </Stack>
      <Typography variant="body2">
        The final loader has an accessible label without visible copy. All loaders become static
        when reduced motion is enabled.
      </Typography>
    </Stack>
  ),
};
export const PageLoaderWithSlot: Story = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography component="h2" variant="h6">
        Section loading
      </Typography>
      <Box sx={{ position: 'relative', minHeight: 320, border: 1, borderColor: 'divider' }}>
        <PageLoader
          text="Default loading copy"
          slotProps={{
            loader: {
              size: 48,
              text: 'Preparing this section',
              'aria-label': 'Preparing this section',
            },
          }}
        />
      </Box>
    </Box>
  ),
};
function ProgressExample() {
  const [progress, setProgress] = React.useState(25);
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" spacing={3} alignItems="center">
        <Spinner size={24} aria-label="Fetching items" />
        <Spinner size={48} thickness={5} color="secondary" aria-label="Preparing preview" />
        <Spinner
          variant="determinate"
          value={progress}
          aria-label="Import progress"
          aria-valuetext={`${progress}% complete`}
        />
      </Stack>
      <Typography role="status">
        Progress: {progress}%{progress === 100 ? ' — complete' : ''}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          disabled={progress === 100}
          onClick={() => setProgress((value) => Math.min(100, value + 25))}
        >
          Advance progress
        </Button>
        <Button variant="outlined" onClick={() => setProgress(0)}>
          Reset progress
        </Button>
      </Stack>
    </Stack>
  );
}
export const SpinnerProgress: Story = { render: () => <ProgressExample /> };
