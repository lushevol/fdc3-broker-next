import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '../src/primitives';
import { Close, Edit } from '../src/icons';
import { createTheme } from '../src/theme';

const contrastPalette = createTheme({ palette: { contrastThreshold: 4.5 } }).palette;

const meta = {
  title: 'Foundation/Overlay primitives',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controlled primitive dialogs, menus and drawers retain MUI focus, dismissal and portal behavior. Open each example to exercise Escape and focus restoration.',
      },
    },
  },
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AlertVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Filled severity samples apply a host-owned 4.5 contrastThreshold through sx, retaining the theme background colors and component variants. Historical package defaults are unchanged.',
      },
    },
  },
  render: () => (
    <Stack spacing={2} sx={{ p: 3 }}>
      {(['standard', 'outlined', 'filled'] as const).map((variant) => (
        <Stack key={variant} spacing={1}>
          {(['success', 'info', 'warning', 'error'] as const).map((severity) => (
            <Alert
              key={severity}
              severity={severity}
              variant={variant}
              sx={
                variant === 'filled'
                  ? (theme) => ({
                      // MUI filled alerts use the dark shade in dark mode.
                      color: contrastPalette.getContrastText(
                        theme.palette[severity][theme.palette.mode === 'dark' ? 'dark' : 'main'],
                      ),
                    })
                  : undefined
              }
            >
              {variant} {severity}: useful feedback includes text, not color alone.
            </Alert>
          ))}
        </Stack>
      ))}
      <Alert
        icon={false}
        severity="info"
        action={
          <Button color="inherit" size="small">
            Review
          </Button>
        }
      >
        Optional icon and action
      </Alert>
    </Stack>
  ),
};

function DismissibleAlertDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      {open ? (
        <Alert severity="success" onClose={() => setOpen(false)}>
          Saved locally. Dismiss this message.
        </Alert>
      ) : (
        <Typography role="status">Message dismissed.</Typography>
      )}
      <Button onClick={() => setOpen(true)}>Restore alert</Button>
    </Stack>
  );
}
export const DismissibleAlert: Story = { render: () => <DismissibleAlertDemo /> };

export const Tooltips: Story = {
  render: () => (
    <Stack direction="row" useFlexGap flexWrap="wrap" spacing={3} sx={{ p: 5 }}>
      <Tooltip title="Edit the selected item" arrow>
        <IconButton aria-label="Edit item">
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Appears above on hover or focus" placement="top">
        <Button>Top tooltip</Button>
      </Tooltip>
      <Tooltip title="This action is unavailable">
        <span>
          <Button disabled>Disabled action</Button>
        </span>
      </Tooltip>
      <Tooltip
        title={
          <span>
            Rich text
            <br />
            Still concise and accessible
          </span>
        }
        placement="right"
      >
        <Button>Rich tooltip</Button>
      </Tooltip>
    </Stack>
  ),
};

function MenuDemo() {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [choice, setChoice] = React.useState('None');
  const id = React.useId();
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Button
        id={`${id}-trigger`}
        variant="outlined"
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-haspopup="menu"
        aria-controls={anchor ? `${id}-menu` : undefined}
        aria-expanded={anchor ? 'true' : undefined}
      >
        Open actions menu
      </Button>
      <Menu
        id={`${id}-menu`}
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        MenuListProps={{ 'aria-labelledby': `${id}-trigger` }}
      >
        {['Copy', 'Rename', 'Unavailable', 'Remove'].map((item) => (
          <MenuItem
            key={item}
            disabled={item === 'Unavailable'}
            selected={item === choice}
            onClick={() => {
              setChoice(item);
              setAnchor(null);
            }}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
      <Typography role="status">Selected action: {choice}</Typography>
    </Stack>
  );
}
export const ActionMenu: Story = { render: () => <MenuDemo /> };

function DrawerDemo() {
  const [anchor, setAnchor] = React.useState<'left' | 'right' | 'top' | 'bottom' | null>(null);
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
        {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
          <Button variant="outlined" key={side} onClick={() => setAnchor(side)}>
            Open {side} drawer
          </Button>
        ))}
      </Stack>
      <Drawer
        anchor={anchor ?? 'left'}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        PaperProps={{
          role: 'dialog',
          'aria-modal': true,
          'aria-label': `${anchor ?? 'Example'} drawer`,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 280,
            maxWidth: '100vw',
            p: 3,
          }}
        >
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
              Drawer content
            </Typography>
            <IconButton aria-label="Close drawer" onClick={() => setAnchor(null)}>
              <Close />
            </IconButton>
          </Stack>
          <TextField label="Filter items" />
          <Button onClick={() => setAnchor(null)}>Apply and close</Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
export const DrawerAnchors: Story = { render: () => <DrawerDemo /> };

function DialogDemo({
  fullScreen = false,
  scroll = 'paper',
}: {
  fullScreen?: boolean;
  scroll?: 'paper' | 'body';
}) {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState('Not submitted');
  const id = React.useId();
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open primitive dialog
      </Button>
      <Typography role="status">{result}</Typography>
      <Dialog
        open={open}
        onClose={(_event, reason) => {
          setResult(`Closed: ${reason}`);
          setOpen(false);
        }}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        scroll={scroll}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
      >
        <DialogTitle id={`${id}-title`}>Edit example details</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id={`${id}-description`}>
            Changes are kept in this example only. Escape closes without saving.
          </DialogContentText>
          <TextField label="Display name" fullWidth margin="normal" defaultValue="Example item" />
          {scroll === 'body' &&
            Array.from({ length: 12 }, (_, index) => (
              <Typography paragraph key={index}>
                Additional description {index + 1} demonstrates scrolling while preserving dialog
                actions.
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setResult('Cancelled');
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setResult('Saved');
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
export const DialogComposition: Story = { render: () => <DialogDemo /> };
export const FullScreenDialog: Story = { render: () => <DialogDemo fullScreen /> };
export const BodyScrollDialog: Story = { render: () => <DialogDemo scroll="body" /> };
