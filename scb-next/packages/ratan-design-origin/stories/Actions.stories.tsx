import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Button,
  LoadingButton,
  SearchButton,
  ResetButton,
  ToggleButton,
  type LoadingButtonProps,
} from '../src';
import { Box, Stack, ToggleButtonGroup, Typography } from '../src/primitives';
import { Add, ArrowForwardIos, Refresh } from '../src/icons';

const variants = ['text', 'outlined', 'contained'] as const;
const sizes = ['small', 'medium', 'large'] as const;
const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'inherit'] as const;
const toggleColors = [
  'standard',
  'primary',
  'secondary',
  'success',
  'error',
  'warning',
  'info',
] as const;
const rowSx = { display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' } as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack spacing={2}>
      <Typography component="h2" variant="h6">
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

const meta = {
  title: 'Components/Actions',
  component: LoadingButton,
  subcomponents: { Button, SearchButton, ResetButton, ToggleButton },
  tags: ['autodocs'],
  args: {
    children: 'Save changes',
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    loading: false,
    disabled: false,
    loadingPosition: 'inline',
    loadingSize: 14,
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The accessible action name stays visible while busy.',
    },
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    color: { control: 'select', options: colors },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    loadingPosition: { control: 'inline-radio', options: ['inline', 'startIcon'] },
    loadingSize: { control: { type: 'number', min: 8, max: 32, step: 2 } },
    onClick: { action: 'clicked' },
    startIcon: { control: false },
    endIcon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Core actions preserve MUI button props, refs and native form semantics. SearchButton and ResetButton deliberately keep their historical action styling. Use the toolbar to compare all four appearances; Tab then Enter/Space to inspect focus and activation.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 3, maxWidth: '72rem' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof LoadingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ButtonVariantsSizesAndColors: Story = {
  render: () => (
    <Stack spacing={4}>
      {variants.map((variant) => (
        <Section key={variant} title={`${variant} / semantic colors`}>
          {sizes.map((size) => (
            <Box key={size} sx={rowSx}>
              <Typography variant="body2" sx={{ minWidth: '5em' }}>
                {size}
              </Typography>
              {colors.map((color) => (
                <Button key={color} variant={variant} size={size} color={color}>
                  {color}
                </Button>
              ))}
            </Box>
          ))}
        </Section>
      ))}
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every supported size and semantic color against all three variants. Colors are passed through; visual policy depends on the selected theme generation.',
      },
    },
  },
};

export const ButtonIconsDisabledAndLongLabels: Story = {
  render: () => (
    <Stack spacing={4}>
      <Section title="Icons and disabled states">
        <Box sx={rowSx}>
          <Button variant="contained" startIcon={<Add />}>
            Create item
          </Button>
          <Button variant="outlined" endIcon={<ArrowForwardIos />}>
            Continue
          </Button>
          <Button variant="text" startIcon={<Refresh />} endIcon={<ArrowForwardIos />}>
            Refresh and continue
          </Button>
          {variants.map((variant) => (
            <Button key={variant} variant={variant} disabled startIcon={<Add />}>
              {variant} disabled
            </Button>
          ))}
        </Box>
      </Section>
      <Section title="Responsive full-width actions">
        <Stack spacing={2} sx={{ width: '100%', maxWidth: '24rem' }}>
          <Button variant="contained" fullWidth>
            Save all changes and return to the overview
          </Button>
          <Button variant="outlined" fullWidth disabled>
            Unavailable until the required fields are complete
          </Button>
          <Button variant="text" href="#action-link-target">
            Native link action
          </Button>
          <Typography id="action-link-target" variant="body2">
            Link destination within this story.
          </Typography>
        </Stack>
      </Section>
    </Stack>
  ),
  parameters: { controls: { disable: true } },
};

export const LoadingAndSearchStateMatrix: Story = {
  render: () => (
    <Stack spacing={4}>
      {(['inline', 'startIcon'] as const).map((position) => (
        <Section key={position} title={`${position} loading placement`}>
          {sizes.map((size) => (
            <Box sx={rowSx} key={size}>
              <LoadingButton
                size={size}
                variant="contained"
                loadingPosition={position}
                startIcon={<Add />}
              >
                Save {size}
              </LoadingButton>
              <LoadingButton
                size={size}
                variant="contained"
                loadingPosition={position}
                startIcon={<Add />}
                loading
              >
                Saving {size}
              </LoadingButton>
              <SearchButton size={size} loadingPosition={position} startIcon={<Refresh />}>
                Search {size}
              </SearchButton>
              <SearchButton size={size} loadingPosition={position} startIcon={<Refresh />} loading>
                Searching {size}
              </SearchButton>
            </Box>
          ))}
        </Section>
      ))}
      <Section title="Variants, custom size and unavailable actions">
        <Box sx={rowSx}>
          {variants.map((variant) => (
            <LoadingButton key={variant} variant={variant} color="success" loading loadingSize={20}>
              {variant} saving
            </LoadingButton>
          ))}
          <LoadingButton disabled>Save unavailable</LoadingButton>
          <SearchButton disabled>Search unavailable</SearchButton>
          <LoadingButton disabled loading>
            Disabled and busy
          </LoadingButton>
          <ResetButton disabled>Reset unavailable</ResetButton>
        </Box>
      </Section>
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The 14px inline spinner is the core default. startIcon replaces the caller icon while busy, then restores it. Busy actions retain their name, expose aria-busy, and cannot activate. Compatibility namespace defaults are documented separately.',
      },
    },
  },
};

export const SearchAndResetVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      {variants.map((variant) => (
        <Section key={variant} title={`${variant} search / reset`}>
          {sizes.map((size) => (
            <Box key={size} sx={rowSx}>
              <SearchButton variant={variant} size={size}>
                Search {size}
              </SearchButton>
              <ResetButton variant={variant} size={size}>
                Reset {size}
              </ResetButton>
              <SearchButton variant={variant} size={size} color="error">
                Error color
              </SearchButton>
              <ResetButton variant={variant} size={size} color="error">
                Error color
              </ResetButton>
            </Box>
          ))}
        </Section>
      ))}
    </Stack>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Search and reset use dedicated visual roles. Passing color/variant preserves the MUI API, but does not replace the package's fixed action styling.",
      },
    },
  },
};

function AsyncActionDemo(props: LoadingButtonProps) {
  const [busy, setBusy] = React.useState(false);
  const [completed, setCompleted] = React.useState(0);
  const [activations, setActivations] = React.useState(0);
  return (
    <Stack spacing={2}>
      <Typography variant="body2">
        Start a local operation, then use “Complete operation” to release it. No network or timer is
        involved.
      </Typography>
      <Box sx={rowSx}>
        <LoadingButton
          {...props}
          loading={busy}
          onClick={(event) => {
            props.onClick?.(event);
            setBusy(true);
            setActivations((count) => count + 1);
          }}
          startIcon={<Add />}
        >
          Save changes
        </LoadingButton>
        <Button
          disabled={!busy}
          onClick={() => {
            setBusy(false);
            setCompleted((count) => count + 1);
          }}
        >
          Complete operation
        </Button>
      </Box>
      <Typography role="status">
        Started: {activations}; completed: {completed}; state: {busy ? 'busy' : 'idle'}
      </Typography>
    </Stack>
  );
}

export const InteractiveLoadingLifecycle: Story = {
  render: ({ ref: _ref, ...args }) => <AsyncActionDemo {...args} />,
  args: { loadingPosition: 'startIcon' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole('button', { name: 'Save changes' });
    await userEvent.click(save);
    await expect(save).toBeDisabled();
    await expect(save).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Complete operation' }));
    await expect(save).toBeEnabled();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Started: 1; completed: 1; state: idle',
    );
  },
};

function NativeActionsDemo() {
  const actionRef = React.useRef<HTMLButtonElement>(null);
  const [submits, setSubmits] = React.useState(0);
  const [resets, setResets] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmits((count) => count + 1);
      }}
      onReset={() => setResets((count) => count + 1)}
    >
      <Box sx={rowSx}>
        <Button ref={actionRef} type="submit" variant="contained" onFocus={() => setFocused(true)}>
          Submit form
        </Button>
        <ResetButton type="reset">Reset form</ResetButton>
        <Button type="button" onClick={() => actionRef.current?.focus()}>
          Focus submit by ref
        </Button>
      </Box>
      <Typography role="status">
        Submits: {submits}; resets: {resets}; submit received focus: {String(focused)}
      </Typography>
    </Stack>
  );
}

export const NativeTypesCallbacksAndRef: Story = {
  render: () => <NativeActionsDemo />,
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Focus submit by ref' }));
    await expect(canvas.getByRole('button', { name: 'Submit form' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset form' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Submits: 1; resets: 1; submit received focus: true',
    );
  },
};

function ToggleDemo() {
  const [view, setView] = React.useState<string | null>('list');
  const [details, setDetails] = React.useState<string[]>(['labels']);
  const [standalone, setStandalone] = React.useState(false);
  return (
    <Stack spacing={4}>
      <Section title="Exclusive selection">
        <ToggleButtonGroup
          exclusive
          value={view}
          onChange={(_event, next: string | null) => setView(next)}
          aria-label="View mode"
          sx={{ width: 'fit-content' }}
        >
          <ToggleButton value="list">List</ToggleButton>
          <ToggleButton value="cards">Cards</ToggleButton>
          <ToggleButton value="locked" disabled>
            Unavailable
          </ToggleButton>
        </ToggleButtonGroup>
      </Section>
      <Section title="Multiple selection">
        <ToggleButtonGroup
          value={details}
          onChange={(_event, next: string[]) => setDetails(next)}
          aria-label="Visible details"
          sx={{ width: 'fit-content' }}
        >
          <ToggleButton value="labels">Labels</ToggleButton>
          <ToggleButton value="descriptions">Descriptions</ToggleButton>
        </ToggleButtonGroup>
      </Section>
      <Section title="Standalone and vertical">
        <Box sx={rowSx}>
          <ToggleButton
            value="pin"
            selected={standalone}
            onChange={() => setStandalone((selected) => !selected)}
          >
            Pin view
          </ToggleButton>
          <ToggleButtonGroup
            orientation="vertical"
            exclusive
            value={view}
            onChange={(_event, next: string | null) => setView(next)}
            aria-label="Vertical view mode"
          >
            <ToggleButton value="list">List view</ToggleButton>
            <ToggleButton value="cards">Card view</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Section>
      <Typography role="status">
        View: {view ?? 'none'}; details: {details.join(', ') || 'none'}; pinned:{' '}
        {String(standalone)}
      </Typography>
    </Stack>
  );
}

export const ControlledToggleSelections: Story = {
  render: () => <ToggleDemo />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Exclusive groups can return null when deselected; multiple groups return an array. Selection remains controlled by the consumer. Tab through buttons and use Space to toggle.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Cards' }));
    await expect(canvas.getByRole('button', { name: 'Cards' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Descriptions' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'View: cards; details: labels, descriptions',
    );
  },
};

export const ToggleSizeColorAndStateMatrix: Story = {
  render: () => (
    <Stack spacing={4}>
      {sizes.map((size) => (
        <Section key={size} title={`${size} toggles`}>
          {toggleColors.map((color) => (
            <Box key={color} sx={rowSx}>
              <ToggleButton size={size} color={color} value={`${color}-idle`}>
                {color} idle
              </ToggleButton>
              <ToggleButton size={size} color={color} selected value={`${color}-selected`}>
                {color} selected
              </ToggleButton>
              <ToggleButton size={size} color={color} disabled value={`${color}-disabled`}>
                {color} disabled
              </ToggleButton>
              <ToggleButton
                size={size}
                color={color}
                selected
                disabled
                value={`${color}-selected-disabled`}
              >
                {color} selected disabled
              </ToggleButton>
            </Box>
          ))}
        </Section>
      ))}
    </Stack>
  ),
  parameters: { controls: { disable: true } },
};
