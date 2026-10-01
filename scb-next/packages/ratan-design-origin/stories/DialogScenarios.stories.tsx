import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog, Input, LoadingButton, type DialogProps } from '../src';
import { Box, DialogTitle, Stack, Typography } from '../src/primitives';

function DialogExample(args: DialogProps) {
  const [open, setOpen] = React.useState(false);
  const [lastAction, setLastAction] = React.useState('No close event yet');
  const close = (reason: string) => {
    setOpen(false);
    setLastAction(reason);
  };
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Typography role="status">Last action: {lastAction}</Typography>
      <Dialog
        {...args}
        open={open}
        onClose={(_event, reason) => close(reason)}
        onCloseButton={() => close('close button')}
        actionComponents={
          args.actionComponents === null ? null : (
            <>
              <Button variant="outlined" onClick={() => close('cancel')}>
                Cancel
              </Button>
              <Button variant="contained" onClick={() => close('confirm')}>
                Confirm
              </Button>
            </>
          )
        }
      />
    </Stack>
  );
}

const meta = {
  title: 'Feedback/Dialog scenarios',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controlled dialogs with scoped portals. Open a dialog, use Tab and Escape, and observe the close reason and focus returning to its trigger. Header/action slots and host policy remain explicit.',
      },
    },
  },
  args: {
    open: false,
    titleComponents: 'Review changes',
    fullWidth: true,
    maxWidth: 'sm',
    dividers: true,
    children: (
      <Typography>
        Review the proposed changes before confirming. Cancel leaves the draft untouched.
      </Typography>
    ),
  },
  argTypes: {
    open: { control: false, description: 'Controlled by the open button in these examples.' },
    maxWidth: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', false] },
    fullScreen: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    dividers: { control: 'boolean' },
    disabledClose: { control: 'boolean' },
    children: { control: false },
    actionComponents: { control: false },
    header: { control: false },
  },
  render: ({ ref: _ref, ...args }) => <DialogExample {...args} />,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const CompactConfirmation: Story = {
  args: { maxWidth: 'xs', dividers: false, titleComponents: 'Discard changes?' },
};
export const WideContent: Story = {
  args: { maxWidth: 'lg', titleComponents: 'Preview', contentProps: { sx: { py: 3 } } },
};
export const FullScreen: Story = {
  args: { fullScreen: true, titleComponents: 'Full-screen review' },
};
export const ScrollableContent: Story = {
  args: {
    titleComponents: 'Review guidelines',
    contentProps: { tabIndex: 0, sx: { maxHeight: '50vh' } },
    children: (
      <Stack spacing={2}>
        {Array.from({ length: 16 }, (_, index) => (
          <Typography key={index}>
            Guideline {index + 1}: Review field values, check supporting information, and confirm
            the intended changes.
          </Typography>
        ))}
      </Stack>
    ),
  },
};
export const CustomHeaderAndSurface: Story = {
  args: {
    header: (
      <DialogTitle component="h2" id="scenario-custom-header">
        Custom review header
      </DialogTitle>
    ),
    surfaceChildren: (
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption">
          Additional surface slot: draft changes remain local.
        </Typography>
      </Box>
    ),
    actionProps: { sx: { justifyContent: 'space-between', px: 3 } },
  },
};
export const HeaderlessAndActionless: Story = {
  args: {
    header: null,
    actionComponents: null,
    'aria-label': 'Preview without generated header',
    children: (
      <Typography>
        This preview has no header or actions. Press Escape or click the backdrop to close it.
      </Typography>
    ),
  },
};
export const DisabledCloseButton: Story = {
  args: {
    disabledClose: true,
    titleComponents: 'Explicit dismissal policy',
    children: (
      <Typography>
        The header close button is disabled. Cancel, Confirm, Escape, and backdrop dismissal remain
        available; hosts decide which dismissal reasons to accept.
      </Typography>
    ),
  },
};

function EditableDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('My saved view');
  const [submitted, setSubmitted] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [result, setResult] = React.useState('No changes saved');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const invalid = submitted && !name.trim();
  const close = () => {
    if (!saving) setOpen(false);
  };
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
          setSubmitted(false);
        }}
      >
        Edit saved view
      </Button>
      <Typography role="status">{result}</Typography>
      <Dialog
        open={open}
        titleComponents="Edit saved view"
        fullWidth
        maxWidth="xs"
        dividers
        onClose={close}
        onCloseButton={close}
        disabledClose={saving}
        disableEscapeKeyDown={saving}
        contentRef={contentRef}
        TransitionProps={{ onEntered: () => inputRef.current?.focus() }}
        actionComponents={
          <>
            <Button disabled={saving} onClick={close}>
              Cancel
            </Button>
            {saving ? (
              <Button
                variant="contained"
                onClick={() => {
                  setSaving(false);
                  setOpen(false);
                  setResult(`Saved: ${name}`);
                }}
              >
                Complete save
              </Button>
            ) : null}
            <LoadingButton
              variant="contained"
              loading={saving}
              onClick={() => {
                setSubmitted(true);
                if (name.trim()) setSaving(true);
                else inputRef.current?.focus();
              }}
            >
              Save
            </LoadingButton>
          </>
        }
      >
        <Input
          variant="outlined"
          label="View name"
          fullWidth
          value={name}
          inputRef={inputRef}
          onChange={(event) => setName(event.target.value)}
          disabled={saving}
          error={invalid}
          helperText={
            invalid ? 'Enter a name before saving.' : 'Clear the field to exercise validation.'
          }
        />
      </Dialog>
    </Stack>
  );
}
export const ValidationAndSaving: Story = {
  render: () => <EditableDialog />,
  parameters: {
    docs: {
      description: {
        story:
          'Host-owned validation and saving policy. Saving disables dismissal; Complete save advances the deterministic demo. The native input ref controls initial and invalid-submit focus.',
      },
    },
  },
};
