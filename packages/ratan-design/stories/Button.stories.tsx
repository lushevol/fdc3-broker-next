/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../src/Button';

/**
 * `Button` is a versatile button component that supports multiple variants, styles, and states
 * based on the SC Global Design System (GDS) specifications.
 *
 * ## Features
 *
 * - **Types**: Primary, Secondary, Floating (FAB), Link, Link - Contrast, Text
 * - **Styles**: Text (default), Icon only
 * - **Status**: Neutral, Error, Alert, Success
 * - **States**: Default, Hover, Pressed/Loading, Selected, Disabled
 * - **Icons**: Optional leading and trailing icons
 * - **Full Width**: Optional full-width button
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component based on SC GDS specifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'floating',
        'link',
        'link-contrast',
        'text',
      ],
      description: 'The button type/variant',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    status: {
      control: 'select',
      options: ['neutral', 'error', 'alert', 'success'],
      description: 'The button status color',
      table: {
        defaultValue: { summary: 'neutral' },
      },
    },
    styleVariant: {
      control: 'select',
      options: ['text', 'icon-only'],
      description: 'The button style variant',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in loading state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the button is selected (toggle state)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    onClick: { action: 'clicked' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Type Variants
// ============================================================================

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    type: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    type: 'secondary',
  },
};

export const Floating: Story = {
  args: {
    children: 'Floating Button',
    type: 'floating',
  },
};

export const Link: Story = {
  args: {
    children: 'Link Button',
    type: 'link',
  },
};

export const LinkContrast: Story = {
  args: {
    children: 'Link Contrast Button',
    type: 'link-contrast',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Text: Story = {
  args: {
    children: 'Text Button',
    type: 'text',
  },
};

// ============================================================================
// Status Variants
// ============================================================================

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export const Error: Story = {
  args: {
    children: 'Error Button',
    status: 'error',
  },
};

export const Alert: Story = {
  args: {
    children: 'Alert Button',
    status: 'alert',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Button',
    status: 'success',
  },
};

// ============================================================================
// Style Variants
// ============================================================================

const AddIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 2C8.55228 2 9 2.44772 9 3V13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13V3C7 2.44772 7.44772 2 8 2Z" />
    <path d="M3 8C3 7.44772 3.44772 7 4 7H12C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9H4C3.44772 9 3 8.55228 3 8Z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.64645 4.64645C4.84171 4.45118 5.15829 4.45118 5.35355 4.64645L12 11.2929L10.6464 12.6464L4 6L5.35355 4.64645C4.15829 3.45118 2.84171 3.45118 1.64645 4.64645C0.451184 5.84171 0.451184 7.15829 1.64645 8.35355L8 14.7071L14.3536 8.35355C15.5488 7.15829 15.5488 5.84171 14.3536 4.64645C13.1583 3.45118 11.8417 3.45118 10.6464 4.64645L4 11.2929L4.64645 4.64645Z" />
  </svg>
);

export const IconOnly: Story = {
  args: {
    type: 'primary',
    styleVariant: 'icon-only',
    'aria-label': 'Add item',
  },
  render: (args) => (
    <Button {...args}>
      <AddIcon />
    </Button>
  ),
};

export const IconOnlySecondary: Story = {
  args: {
    type: 'secondary',
    styleVariant: 'icon-only',
    'aria-label': 'Close',
  },
  render: (args) => (
    <Button {...args}>
      <CloseIcon />
    </Button>
  ),
};

// ============================================================================
// With Icons
// ============================================================================

export const WithLeadingIcon: Story = {
  args: {
    children: 'Search',
    iconLeading: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.5 0C10.09 0 13 2.91 13 6.5C13 8.03 12.36 9.38 11.34 10.4L15.71 14.77C16.1 15.16 16.1 15.83 15.71 16.22C15.32 16.61 14.69 16.61 14.3 16.22L9.93 11.85C8.91 12.87 7.56 13.5 6 13.5C2.41 13.5 0 11.09 0 7.5C0 3.91 2.41 1.5 6 1.5C9.59 1.5 12 3.91 12 7.5C12 8.03 12.03 8.55 12.09 9.06L12.18 9.73L11.45 9.41C11.05 9.2 10.58 9.1 10.09 9.1C7.88 9.1 6 10.98 6 13.19C6 15.4 7.88 17.28 10.09 17.28C12.3 17.28 14.18 15.4 14.18 13.19C14.18 11.57 13.33 10.17 12.09 9.35C12.35 8.65 12.5 7.85 12.5 7C12.5 3.41 10.09 1 6.5 1V0Z" />
      </svg>
    ),
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: 'Next',
    iconTrailing: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 1C6 0.447715 6.44772 0 7 0C7.55228 0 8 0.447715 8 1V11H13.5C14.0523 11 14.5 11.4477 14.5 12C14.5 12.5523 14.0523 13 13.5 13H8C7.44772 13 7 12.5523 7 12V1H6ZM2.14645 4.14645C2.34171 3.95118 2.65829 3.95118 2.85355 4.14645L7.85355 9.14645C8.04882 9.34171 8.04882 9.65829 7.85355 9.85355L2.85355 14.8536C2.65829 15.0488 2.34171 15.0488 2.14645 14.8536C1.95118 14.6583 1.95118 14.3417 2.14645 14.1464L6.79289 9.5L2.14645 4.85355C1.95118 4.65829 1.95118 4.34171 2.14645 4.14645Z" />
      </svg>
    ),
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Button',
    iconLeading: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 0C8.55228 0 9 0.447715 9 1V7H14C14.5523 7 15 7.44772 15 8C15 8.55228 14.5523 9 14 9H9V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V9H2C1.44772 9 1 8.55228 1 8C1 7.44772 1.44772 7 2 7H7V1C7 0.447715 7.44772 0 8 0Z" />
      </svg>
    ),
    iconTrailing: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.5 1C9.5 0.447715 9.05228 0 8.5 0C7.94772 0 7.5 0.447715 7.5 1V7H2C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9H7.5V15C7.5 15.5523 7.94772 16 8.5 16C9.05228 16 9.5 15.5523 9.5 15V9H14C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7H9.5V1Z" />
      </svg>
    ),
  },
};

// ============================================================================
// States
// ============================================================================

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected',
    selected: true,
    type: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

// ============================================================================
// Full Width
// ============================================================================

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

// ============================================================================
// All Types
// ============================================================================

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button type="primary">Primary</Button>
        <Button type="secondary">Secondary</Button>
        <Button type="floating">Floating</Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button type="link">Link</Button>
        <Button type="text">Text</Button>
      </div>
    </div>
  ),
};

// ============================================================================
// All Statuses
// ============================================================================

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Button status="neutral">Neutral</Button>
      <Button status="error">Error</Button>
      <Button status="alert">Alert</Button>
      <Button status="success">Success</Button>
    </div>
  ),
};
