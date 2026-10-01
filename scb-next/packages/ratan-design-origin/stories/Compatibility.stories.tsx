import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button as BaseButton,
  Dialog as BaseDialog,
  Loader as BaseLoader,
  LoadingButton as BaseLoadingButton,
  Time as BaseTime,
} from '../src/base-compat';
import {
  InputStyled,
  LoaderRoot,
  loaderClasses,
  SnackbarRoot,
  DialogRoot,
  dialogClasses,
  DialogTitle,
  setBg,
  darkBg,
  lightBg,
  colorAliases,
  darkAliases,
  lightAliases,
  legacyColorAliases,
  legacyDarkAliases,
  legacyLightAliases,
} from '../src/compatibility';
import {
  Alert,
  Box,
  Button,
  DialogActions,
  DialogContent,
  Paper,
  Stack,
  TextField,
  Typography,
} from '../src/primitives';
import { styled } from '../src/theme';
import { Add } from '../src/icons';

const LegacyInput = styled(TextField)(InputStyled({ left: 'example-label-left' }));
const meta = {
  title: 'Migration/Compatibility',
  component: BaseButton.default,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Migration-only namespaces and styled surfaces. These preserve existing Base contracts; new components should use the core named exports. Examples intentionally retain primary-type translation, 16px start-slot spinners, default-open portaled dialogs and string-only Time rendering.',
      },
    },
  },
} satisfies Meta<typeof BaseButton.default>;
export default meta;
type Story = StoryObj<typeof meta>;

function NamespaceButtonsDemo() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState('Ready');
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
        <BaseButton.default
          type="primary"
          variant="contained"
          onClick={() => setResult('Primary maps to button')}
        >
          Legacy primary
        </BaseButton.default>
        <BaseButton.default type="button" disabled>
          Disabled
        </BaseButton.default>
        <BaseLoadingButton.default
          type="primary"
          loading={loading}
          startIcon={<Add />}
          variant="outlined"
          onClick={() => setResult('Action invoked')}
        >
          Save example
        </BaseLoadingButton.default>
        <BaseLoadingButton.default loading loadingSize={24}>
          Custom spinner
        </BaseLoadingButton.default>
      </Stack>
      <Button onClick={() => setLoading(!loading)} aria-pressed={loading}>
        {loading ? 'Stop loading' : 'Start loading'}
      </Button>
      <Typography role="status">
        {result}. Loading uses a 16px start-icon spinner by default and restores the Add icon
        afterward.
      </Typography>
    </Stack>
  );
}
export const ButtonNamespaces: Story = { render: () => <NamespaceButtonsDemo /> };
export const LoaderAndTimeNamespaces: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      <BaseLoader.default />
      <Typography>
        ISO input is unchanged:{' '}
        <BaseTime.Time value="2026-10-01T09:30:00Z" field="createdAt" isAccurateToDay />
      </Typography>
      <Typography>
        Number becomes a string: <BaseTime.Time value={12345} />
      </Typography>
      <Typography>
        Missing value renders nothing between these brackets: [<BaseTime.Time />]
      </Typography>
      <Typography>
        The host owns date formatting; field and isAccurateToDay are accepted legacy props.
      </Typography>
    </Stack>
  ),
};
function NamespaceDialogDemo({ fixedSize = false }: { fixedSize?: boolean }) {
  const [mounted, setMounted] = React.useState(false);
  const [result, setResult] = React.useState('Closed');
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => setMounted(true)}>
        Mount default-open legacy dialog
      </Button>
      <Typography role="status">{result}</Typography>
      {mounted && (
        <BaseDialog.default
          titleComponents="Legacy namespace dialog"
          defaultWidth={fixedSize ? 640 : 'auto'}
          defaultHeight={fixedSize ? 400 : 'auto'}
          disablePortal
          dividers
          onClose={() => {
            setMounted(false);
            setResult('Legacy no-argument close callback fired');
          }}
          actionComponents={
            <BaseButton.default
              onClick={() => {
                setMounted(false);
                setResult('Done');
              }}
            >
              Done
            </BaseButton.default>
          }
        >
          <Box sx={{ p: 2 }}>
            <Typography paragraph>
              No open prop was passed: mounting opens this dialog. Portal rendering stays enabled
              even when disablePortal is requested.
            </Typography>
            <TextField label="Example input" fullWidth />
            <Typography sx={{ mt: 2 }}>
              Numeric sizes are capped to the viewport with 16px margins.
            </Typography>
          </Box>
        </BaseDialog.default>
      )}
    </Stack>
  );
}
export const DefaultOpenDialog: Story = { render: () => <NamespaceDialogDemo /> };
export const SizedLegacyDialog: Story = { render: () => <NamespaceDialogDemo fixedSize /> };

export const StyledInputCompatibility: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3, maxWidth: 600 }}>
      <Typography>
        InputStyled retains static labels and the caller-owned left-label class.
      </Typography>
      <LegacyInput
        label="Top label"
        variant="outlined"
        defaultValue="Example"
        InputLabelProps={{ shrink: true }}
      />
      <LegacyInput
        className="example-label-left"
        label="Left label"
        variant="outlined"
        defaultValue="Example"
        InputLabelProps={{ shrink: true }}
      />
      <LegacyInput
        label="Validation"
        variant="outlined"
        error
        required
        helperText="Required value"
        InputLabelProps={{ shrink: true }}
      />
    </Stack>
  ),
};
export const StyledLoaderCompatibility: Story = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <LoaderRoot
        className={loaderClasses.root}
        role="status"
        aria-label="Loading compatibility example"
      >
        <div className={loaderClasses.loader}>
          <div className={loaderClasses.spinner}>
            <svg
              className={loaderClasses.svg}
              width="72"
              height="72"
              viewBox="0 0 40 40"
              aria-hidden="true"
            >
              <circle className={loaderClasses.outerCircle} cx="20" cy="20" r="16" />
              <path
                className={loaderClasses.outerLine}
                d="M20 4A16 16 0 0 1 36 20L32 20A12 12 0 0 0 20 8Z"
              />
              <circle className={loaderClasses.innerCircle} cx="20" cy="20" r="8" />
              <path
                className={loaderClasses.innerLine}
                d="M20 12A8 8 0 0 1 28 20L24 20A4 4 0 0 0 20 16Z"
              />
            </svg>
          </div>
        </div>
        <p className={loaderClasses.text}>Loading compatibility example</p>
      </LoaderRoot>
      <Typography>
        Existing class hooks remain available. Prefer core Loader for new rendering.
      </Typography>
    </Box>
  ),
};
function StyledSnackbarDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => setOpen(true)}>Open styled snackbar</Button>
      <SnackbarRoot
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setOpen(false)}>
          Legacy SnackbarRoot with caller-owned content.
        </Alert>
      </SnackbarRoot>
    </Box>
  );
}
export const StyledSnackbarCompatibility: Story = { render: () => <StyledSnackbarDemo /> };
function StyledDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [maximized, setMaximized] = React.useState(false);
  const id = React.useId();
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open styled legacy dialog
      </Button>
      <DialogRoot
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={`${id}-title`}
        fullWidth
        maxWidth="sm"
        fullScreen={maximized}
      >
        <DialogTitle
          id={`${id}-title`}
          isResizeble
          isMax={maximized}
          onResize={() => setMaximized(!maximized)}
          onClose={() => setOpen(false)}
        >
          Legacy header
        </DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            The header requests maximize and close; this example owns the local state. Host dragging
            and workspace behavior stay outside the package.
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, background: setBg }}>
            setBg resolves the header surface for the current appearance.
          </Paper>
          <Typography variant="caption" component="div" sx={{ mt: 2, overflowWrap: 'anywhere' }}>
            Retained hooks: {Object.values(dialogClasses).join(', ')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close example</Button>
        </DialogActions>
      </DialogRoot>
    </Box>
  );
}
export const StyledDialogCompatibility: Story = { render: () => <StyledDialogDemo /> };
export const AliasContracts: Story = {
  render: () => (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2">
        Retained CSS alias declarations
      </Typography>
      <Typography>
        These strings are exposed for existing adapters. The package stylesheets already apply the
        appropriate aliases; do not inject all modes together.
      </Typography>
      {Object.entries({
        colorAliases,
        lightAliases,
        darkAliases,
        legacyColorAliases,
        legacyLightAliases,
        legacyDarkAliases,
      }).map(([name, aliases]) => (
        <Paper key={name} variant="outlined" sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="h6" component="h3">
            {name}
          </Typography>
          <Box
            component="pre"
            role="region"
            sx={{ m: 0, mt: 1, maxHeight: 160, overflow: 'auto', fontSize: 12 }}
            tabIndex={0}
            aria-label={`${name} declaration source`}
          >
            {aliases}
          </Box>
        </Paper>
      ))}
      <Typography variant="h6" component="h3">
        Legacy header backgrounds
      </Typography>
      <Box
        sx={{ height: 48, background: lightBg, border: '1px solid', borderColor: 'divider' }}
        role="img"
        aria-label="Light legacy header background"
      />
      <Box
        sx={{ height: 48, background: darkBg, border: '1px solid', borderColor: 'divider' }}
        role="img"
        aria-label="Dark legacy header background"
      />
    </Stack>
  ),
};
