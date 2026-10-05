import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Input, RatanDesignProvider, useRatanAppearance } from '../src';
import { Alert, Box, CssBaseline, Paper, Stack, Typography } from '../src/primitives';
import { createRatanTheme, createTheme, ThemeProvider, useTheme } from '../src/theme';
import { compactControlTokens, legacyTokens, newStyleTokens } from '../src/tokens';
import { Config, getPortalTheme } from '../src/portal-theme';

function AppearanceSample() {
  const appearance = useRatanAppearance();
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography variant="h6" component="h3">
        {appearance.designGeneration} / {appearance.mode}
      </Typography>
      <Input label="Example field" variant="outlined" defaultValue="Theme-aware value" />
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        <Button variant="contained">Primary</Button>
        <Button variant="outlined">Secondary</Button>
        <Button disabled>Disabled</Button>
      </Stack>
      <Alert severity="info">Colors, typography, focus and spacing follow this scope.</Alert>
    </Stack>
  );
}
const meta = {
  title: 'Foundation/Appearance',
  component: RatanDesignProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Provider, standalone theme factory, semantic tokens and explicit portal compatibility. The global toolbar selects mode and generation for ordinary stories. Providers never choose application state or reset the document implicitly.',
      },
    },
  },
} satisfies Meta<typeof RatanDesignProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FourAppearances: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, p: 2 }}>
      {(['legacy', 'webkit'] as const).flatMap((designGeneration) =>
        (['light', 'dark'] as const).map((mode) => (
          <RatanDesignProvider
            key={`${designGeneration}-${mode}`}
            designGeneration={designGeneration}
            mode={mode}
          >
            <AppearanceSample />
          </RatanDesignProvider>
        )),
      )}
    </Box>
  ),
};
export const CompactBusinessControls: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 2 }}>
      {(['light', 'dark'] as const).map((mode) => (
        <RatanDesignProvider key={mode} mode={mode} designGeneration="webkit">
          <Stack spacing={2} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="body1">Cashflow actions</Typography>
            <Typography variant="body2">Pending verification</Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Button size="small" variant="contained">Pending Verification</Button>
              <Button size="medium" variant="outlined">Search</Button>
              <Button size="large">Export</Button>
              <Button size="small" disabled>Clear Filters</Button>
            </Stack>
            <Input size="small" label="Reference" variant="outlined" defaultValue="SGD-001" />
            <Typography sx={{ fontSize: compactControlTokens.typography.gridHeader }}>Currency</Typography>
            <Typography sx={{ fontSize: compactControlTokens.typography.gridCell }}>SGD 1,250.00</Typography>
          </Stack>
        </RatanDesignProvider>
      ))}
    </Stack>
  ),
};
export const NestedInheritance: Story = {
  render: () => (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography>
        Outer provider selects WebKit/dark. The first child inherits both fields; the second
        overrides only mode.
      </Typography>
      <RatanDesignProvider designGeneration="webkit" mode="dark">
        <Box sx={{ p: 2 }}>
          <AppearanceSample />
          <RatanDesignProvider>
            <Paper variant="outlined">
              <AppearanceSample />
            </Paper>
          </RatanDesignProvider>
          <RatanDesignProvider mode="light">
            <AppearanceSample />
          </RatanDesignProvider>
        </Box>
      </RatanDesignProvider>
    </Stack>
  ),
};
function HostThemeDemo() {
  const appearance = useRatanAppearance();
  const hostTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: appearance.mode,
          primary: { main: appearance.mode === 'dark' ? '#c4b5fd' : '#5b21b6' },
        },
        shape: { borderRadius: 12 },
        typography: { fontFamily: 'Inter, sans-serif' },
        components: { MuiButton: { defaultProps: { size: 'large' } } },
      }),
    [appearance.mode],
  );
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography>
        baseTheme preserves the host palette, rounded corners, Inter typography and large button
        default while adding appearance metadata and scoped overlays.
      </Typography>
      <RatanDesignProvider baseTheme={hostTheme}>
        <AppearanceSample />
      </RatanDesignProvider>
    </Stack>
  );
}
export const HostBaseTheme: Story = { render: () => <HostThemeDemo /> };
function StandaloneThemeDemo() {
  const appearance = useRatanAppearance();
  const theme = React.useMemo(() => createRatanTheme(appearance), [appearance]);
  return (
    <ThemeProvider theme={theme}>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography>
          createRatanTheme supplies MUI overrides. The surrounding Storybook provider supplies CSS
          token scope.
        </Typography>
        <AppearanceSample />
      </Stack>
    </ThemeProvider>
  );
}
export const StandaloneThemeFactory: Story = { render: () => <StandaloneThemeDemo /> };

function TokenSwatches({ values }: { values: Record<string, string | number> }) {
  return (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 2 }}
    >
      {Object.entries(values).map(([name, value]) => (
        <Paper key={name} variant="outlined" sx={{ p: 1.5, overflowWrap: 'anywhere' }}>
          <Box
            aria-hidden
            sx={{ height: 44, bgcolor: value, border: '1px solid', borderColor: 'divider', mb: 1 }}
          />
          <Typography variant="body2">{name}</Typography>
          <Typography variant="caption" component="div">
            {value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
export const WebkitSemanticTokens: Story = {
  render: () => (
    <RatanDesignProvider designGeneration="webkit">
      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2">
          Live semantic colors
        </Typography>
        <TokenSwatches values={newStyleTokens.color} />
        <Typography variant="h6" component="h3">
          Spacing
        </Typography>
        {Object.entries(newStyleTokens.spacing).map(([name, value]) => (
          <Stack key={name} direction="row" alignItems="center" spacing={2}>
            <Box
              aria-hidden
              sx={{ width: value, height: 24, bgcolor: 'primary.main', flexShrink: 0 }}
            />
            <Typography>
              {name}: {value}
            </Typography>
          </Stack>
        ))}
        <Typography variant="h6" component="h3">
          Radii
        </Typography>
        <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
          {Object.entries(newStyleTokens.radius).map(([name, value]) => (
            <Box
              key={name}
              sx={{ p: 2, border: '2px solid', borderColor: 'primary.main', borderRadius: value }}
            >
              {name}
            </Box>
          ))}
        </Stack>
        <Typography
          sx={{
            fontFamily: newStyleTokens.typography.fontFamily,
            fontSize: newStyleTokens.typography.fontSize,
          }}
        >
          Semantic typography: {newStyleTokens.typography.fontFamily}
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, boxShadow: newStyleTokens.shadow.focus }}>
          Focus shadow: {newStyleTokens.shadow.focus}
        </Paper>
      </Stack>
    </RatanDesignProvider>
  ),
};
export const LegacyTokenPalette: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2">
        Legacy constants
      </Typography>
      <Typography>
        These compatibility values are fixed literals. Semantic WebKit references adapt to
        appearance.
      </Typography>
      <TokenSwatches
        values={Object.fromEntries(
          Object.entries(legacyTokens.color).filter(([name]) => !name.startsWith('font-size')),
        )}
      />
      <Typography>
        Legacy font: {legacyTokens.font.fontFamilyPoppins}; sizes {legacyTokens.font.fontSizeS},{' '}
        {legacyTokens.font.fontSizeM}, {legacyTokens.font.fontSizeL}px. Poppins is supplied by the
        host.
      </Typography>
    </Stack>
  ),
};
export const FontFamilies: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      {['SC Prosper Sans', 'Inter', 'Roboto Mono', 'OpenDyslexic', 'Poppins'].map((fontFamily) => (
        <Box key={fontFamily}>
          <Typography variant="h6" component="h2">
            {fontFamily}
            {fontFamily === 'Poppins' ? ' (host supplied)' : ''}
          </Typography>
          {[400, 500, 700].map((fontWeight) => (
            <Typography
              key={fontWeight}
              sx={{ fontFamily: `"${fontFamily}", sans-serif`, fontWeight }}
            >
              Weight {fontWeight}: The quick brown fox 0123456789
            </Typography>
          ))}
        </Box>
      ))}
    </Stack>
  ),
};
export const CssEntryPoints: Story = {
  render: () => (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2">
        Choose the CSS scope explicitly
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography component="code" sx={{ overflowWrap: 'anywhere' }}>
          ratan-design-origin/styles.css
        </Typography>
        <Typography>Provider-scoped tokens and fonts. Used by this catalog.</Typography>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography component="code" sx={{ overflowWrap: 'anywhere' }}>
          ratan-design-origin/tokens.css
        </Typography>
        <Typography>
          Global CSS-only tokens. Defaults to WebKit/light; the host controls data-generation and
          data-mode on the document root.
        </Typography>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography component="code" sx={{ overflowWrap: 'anywhere' }}>
          ratan-design-origin/styles-and-tokens.css
        </Typography>
        <Typography>
          Combined global and scoped declarations. Import once instead of importing both standalone
          stylesheets.
        </Typography>
      </Paper>
      <Typography>
        Tokens do not apply a document reset. Each iframe or separate document must load its own
        stylesheet.
      </Typography>
    </Stack>
  ),
};
function PortalThemeDemo() {
  const appearance = useRatanAppearance();
  const { config } = React.useMemo(
    () => Config(getPortalTheme(appearance.mode, appearance.designGeneration === 'webkit', false)),
    [appearance.mode, appearance.designGeneration],
  );
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography>
        Historical portal overrides via Config(getPortalTheme(mode, newStyles, isNewLayout)). Gold
        maps to dark; unknown values map to light. The host owns URL flags, scroll rules and
        explicit CssBaseline use.
      </Typography>
      <RatanDesignProvider baseTheme={config}>
        <AppearanceSample />
      </RatanDesignProvider>
    </Stack>
  );
}
export const HistoricalPortalTheme: Story = { render: () => <PortalThemeDemo /> };
function BaselineDemo() {
  const [enabled, setEnabled] = React.useState(false);
  const theme = useTheme();
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      {enabled && <CssBaseline />}
      <Typography variant="h5" component="h2">
        Explicit document reset
      </Typography>
      <Typography>
        This opt-in applies MUI CssBaseline only within this Storybook preview document. It can
        affect every story on the same Docs page while enabled.
      </Typography>
      <Button aria-pressed={enabled} variant="outlined" onClick={() => setEnabled(!enabled)}>
        {enabled ? 'Remove CssBaseline' : 'Apply CssBaseline'}
      </Button>
      <Typography role="status">
        Reset {enabled ? 'enabled' : 'disabled'}; palette mode: {theme.palette.mode}.
      </Typography>
    </Stack>
  );
}
export const CssBaselineOptIn: Story = {
  render: () => <BaselineDemo />,
  parameters: { docs: { disable: true } },
};
