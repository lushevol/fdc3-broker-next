/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from '../src/Input';

/**
 * `Input` is a text input component based on SC Global Design System (GDS) specifications,
 * built on top of Ant Design's Input component with custom theming.
 *
 * ## Features
 *
 * - **Validation States**: Error, Alert, Success, Default
 * - **Sizes**: Small, Medium, Large
 * - **Prefix/Suffix Text**: For input limitations like currency or email
 * - **Helper Text**: Additional context or instructions
 * - **Labels**: With optional required asterisk
 * - **Clear Button**: Built-in clear functionality
 * - **Icons**: Optional leading and trailing icons
 */
const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A text input component based on SC GDS specifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['default', 'error', 'alert', 'success'],
      description: 'The validation status of the input',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the input',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether to show the required asterisk',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      control: 'text',
      description: 'The value of the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    onChange: { action: 'changed' },
    onPressEnter: { action: 'pressed Enter' },
  },
  args: { onChange: fn(), onPressEnter: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Input
// ============================================================================

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export const Required: Story = {
  args: {
    label: 'Email Address',
    required: true,
    placeholder: 'Enter your email',
  },
};

// ============================================================================
// Sizes
// ============================================================================

export const Small: Story = {
  args: {
    label: 'Small Input',
    size: 'small' as const,
    placeholder: 'Small size',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Input',
    size: 'middle' as const,
    placeholder: 'Medium size',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Input',
    size: 'large' as const,
    placeholder: 'Large size',
  },
};

// ============================================================================
// With Prefix/Suffix
// ============================================================================

export const WithPrefixText: Story = {
  args: {
    label: 'Price',
    prefixText: '$',
    placeholder: '0.00',
  },
};

export const WithSuffixText: Story = {
  args: {
    label: 'Email',
    suffixText: '@email.com',
    placeholder: 'user',
  },
};

export const WithBothPrefixSuffix: Story = {
  args: {
    label: 'Amount',
    prefixText: '$',
    suffixText: 'USD',
    placeholder: '0.00',
  },
};

// ============================================================================
// Validation States
// ============================================================================

export const Error: Story = {
  args: {
    label: 'Email',
    validationStatus: 'error',
    validationMessage: 'Please enter a valid email address',
    placeholder: 'Enter your email',
    defaultValue: 'invalid-email',
  },
};

export const Alert: Story = {
  args: {
    label: 'Password',
    validationStatus: 'alert',
    validationMessage: 'Password will expire in 3 days',
    placeholder: 'Enter password',
  },
};

export const Success: Story = {
  args: {
    label: 'Username',
    validationStatus: 'success',
    validationMessage: 'Username is available',
    placeholder: 'Choose a username',
  },
};

// ============================================================================
// Helper Text
// ============================================================================

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    helperText: 'Must be at least 8 characters',
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const WithRequiredAndHelper: Story = {
  args: {
    label: 'Phone Number',
    required: true,
    helperText: 'Include country code (e.g., +1)',
    placeholder: '+1 (555) 000-0000',
  },
};

// ============================================================================
// States
// ============================================================================

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    disabled: true,
    placeholder: 'Cannot edit',
    defaultValue: 'Disabled value',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Filled Input',
    placeholder: 'Enter text',
    defaultValue: 'Pre-filled value',
  },
};

// ============================================================================
// With Icons
// ============================================================================

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.5 0C10.09 0 13 2.91 13 6.5C13 8.03 12.36 9.38 11.34 10.4L15.71 14.77C16.1 15.16 16.1 15.83 15.71 16.22C15.32 16.61 14.69 16.61 14.3 16.22L9.93 11.85C8.91 12.87 7.56 13.5 6 13.5C2.41 13.5 0 11.09 0 7.5C0 3.91 2.41 1.5 6 1.5C9.59 1.5 12 3.91 12 7.5C12 8.03 12.03 8.55 12.09 9.06L12.18 9.73L11.45 9.41C11.05 9.2 10.58 9.1 10.09 9.1C7.88 9.1 6 10.98 6 13.19C6 15.4 7.88 17.28 10.09 17.28C12.3 17.28 14.18 15.4 14.18 13.19C14.18 11.57 13.33 10.17 12.09 9.35C12.35 8.65 12.5 7.85 12.5 7C12.5 3.41 10.09 1 6.5 1V0Z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C4.13 10 0 11.34 0 13V14H16V13C16 11.34 11.87 10 8 10Z" />
  </svg>
);

export const WithLeadingIcon: Story = {
  args: {
    label: 'Username',
    prefix: <UserIcon />,
    placeholder: 'Enter username',
  },
};

export const WithTrailingIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
  },
  render: (args) => <Input {...args} prefix={<SearchIcon />} />,
};

// ============================================================================
// Form Examples
// ============================================================================

export const LoginForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
        helperText="Forgot password?"
      />
    </div>
  ),
};

export const RegistrationForm: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Input label="Full Name" placeholder="Enter your full name" required />
      <Input
        label="Email"
        suffixText="@email.com"
        placeholder="user"
        required
      />
      <Input
        label="Phone"
        placeholder="+1 (555) 000-0000"
        helperText="Include country code"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        required
        helperText="Must be at least 8 characters"
      />
    </div>
  ),
};

// ============================================================================
// All Validation States
// ============================================================================

export const AllValidationStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <Input label="Default" placeholder="Default state" />
      <Input
        label="Error"
        validationStatus="error"
        validationMessage="This field is required"
        placeholder="Error state"
      />
      <Input
        label="Alert"
        validationStatus="alert"
        validationMessage="Please review this field"
        placeholder="Alert state"
      />
      <Input
        label="Success"
        validationStatus="success"
        validationMessage="Looks good!"
        placeholder="Success state"
      />
    </div>
  ),
};

// ============================================================================
// All Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '320px',
      }}
    >
      <Input size="small" placeholder="Small size (24px)" />
      <Input size="middle" placeholder="Medium size (32px)" />
      <Input size="large" placeholder="Large size (40px)" />
    </div>
  ),
};
