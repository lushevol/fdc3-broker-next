/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Card } from '../src/Card';

/**
 * `Card` is a versatile card component that supports multiple variants, styles, and content
 * based on the SC Global Design System (GDS) specifications.
 *
 * ## Features
 *
 * - **Variants**: Base, Clickable, Selected
 * - **Content**: Image, Leading (icon/avatar), Title, Eyebrow, Helper text, Tags
 * - **Trailing Content**: Chevron, Switch, More menu, Buttons, Hint text
 * - **Selection**: Checkbox, Radio, None
 * - **Footer Actions**: Optional footer with actions
 * - **States**: Default, Hover, Pressed, Selected, Disabled
 * - **Draggable**: Optional drag handle
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component based on SC GDS specifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['base', 'clickable', 'selected'],
      description: 'The card variant',
      table: {
        defaultValue: { summary: 'base' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'The card padding size',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    selectionType: {
      control: 'select',
      options: ['none', 'checkbox', 'radio'],
      description: 'Selection type for actionable cards',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    trailingContent: {
      control: 'select',
      options: ['none', 'chevron', 'switch', 'more-menu', 'hint-text'],
      description: 'Trailing content type',
      table: {
        defaultValue: { summary: 'none' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the card is selected',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    draggable: {
      control: 'boolean',
      description: 'Whether the card is draggable',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  args: { onClick: fn(), onSelectionChange: fn() },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Base Variants
// ============================================================================

export const Base: Story = {
  args: {
    title: 'Card Title',
    helperText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
};

export const WithEyebrow: Story = {
  args: {
    eyebrow: 'Category',
    title: 'Card with Eyebrow',
    helperText: 'This card has an eyebrow label above the title.',
  },
};

export const WithHelperText: Story = {
  args: {
    title: 'Card with Helper Text',
    helperText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};

export const WithAdditionalDetails: Story = {
  args: {
    title: 'Card with Details',
    helperText: 'This card includes additional details like date and time.',
    additionalDetails: (
      <>
        <span>Dec 19, 2025</span>
        <span>•</span>
        <span>5 min read</span>
      </>
    ),
  },
};

// ============================================================================
// With Tags
// ============================================================================

export const WithTags: Story = {
  args: {
    title: 'Card with Status Tags',
    helperText: 'Tags can indicate status or category.',
    tags: [
      { label: 'Active', variant: 'success' },
      { label: 'New', variant: 'default' },
      { label: 'Featured', variant: 'info' },
    ],
  },
};

export const WithWarningTag: Story = {
  args: {
    title: 'Card with Warning Tag',
    helperText: 'This card has a warning status tag.',
    tags: [{ label: 'Pending Review', variant: 'warning' }],
  },
};

export const WithErrorTag: Story = {
  args: {
    title: 'Card with Error Tag',
    helperText: 'This card has an error status tag.',
    tags: [{ label: 'Failed', variant: 'error' }],
  },
};

// ============================================================================
// With Image
// ============================================================================

const sampleImage =
  'https://www.figma.com/api/mcp/asset/b9d81ea1-620d-4ea4-a106-081468543cec';

export const WithImage: Story = {
  args: {
    image: { src: sampleImage, alt: 'Sample card image' },
    title: 'Card with Image',
    helperText: 'This card features an image at the top.',
  },
};

export const WithImageAndTags: Story = {
  args: {
    image: { src: sampleImage, alt: 'Product card' },
    title: 'Product Card',
    helperText: 'Product description with status tags.',
    tags: [
      { label: 'In Stock', variant: 'success' },
      { label: 'Sale', variant: 'warning' },
    ],
  },
};

// ============================================================================
// With Leading Content
// ============================================================================

const UserAvatar = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#e5f1fc" />
    <circle cx="20" cy="16" r="6" fill="#0473ea" />
    <path
      d="M8 36C8 29.3726 13.3726 24 20 24C26.6274 24 32 29.3726 32 36"
      stroke="#0473ea"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const IconPlaceholder = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="#0473ea"
      strokeWidth="2"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="#0473ea"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const WithLeadingIcon: Story = {
  args: {
    leading: <IconPlaceholder />,
    title: 'Card with Leading Icon',
    helperText: 'This card has a leading icon for extra context.',
  },
};

export const WithLeadingAvatar: Story = {
  args: {
    leading: <UserAvatar />,
    title: 'Employee Card',
    eyebrow: 'Team Member',
    helperText: 'John Doe - Software Engineer',
    additionalDetails: 'Engineering Team',
  },
};

// ============================================================================
// Clickable Cards
// ============================================================================

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    helperText: 'This card is clickable with hover effects.',
    variant: 'clickable',
    onClick: fn(),
  },
};

export const ClickableWithChevron: Story = {
  args: {
    title: 'Clickable with Chevron',
    helperText: 'Click to view more details.',
    variant: 'clickable',
    trailingContent: 'chevron',
    onClick: fn(),
  },
};

export const ClickableWithMoreMenu: Story = {
  args: {
    title: 'Card with More Menu',
    helperText: 'Has a trailing more menu icon.',
    variant: 'clickable',
    trailingContent: 'more-menu',
    onClick: fn(),
  },
};

// ============================================================================
// Selectable Cards
// ============================================================================

export const SelectableCheckbox: Story = {
  args: {
    title: 'Selectable Card',
    helperText: 'Click checkbox to select.',
    selectionType: 'checkbox',
    selected: false,
    onSelectionChange: fn(),
  },
};

export const SelectableCheckboxSelected: Story = {
  args: {
    title: 'Selected Card',
    helperText: 'This card is currently selected.',
    selectionType: 'checkbox',
    selected: true,
    onSelectionChange: fn(),
  },
};

export const SelectableRadio: Story = {
  args: {
    title: 'Radio Selection',
    helperText: 'Choose one option.',
    selectionType: 'radio',
    selected: false,
    onSelectionChange: fn(),
  },
};

export const SelectableRadioSelected: Story = {
  args: {
    title: 'Selected Radio Card',
    helperText: 'This option is selected.',
    selectionType: 'radio',
    selected: true,
    onSelectionChange: fn(),
  },
};

// ============================================================================
// With Footer Actions
// ============================================================================

export const WithFooterActions: Story = {
  args: {
    title: 'Card with Footer Actions',
    helperText: 'Actions are placed in the footer.',
    footerActions: (
      <>
        <button type="button" onClick={() => {}}>
          Cancel
        </button>
        <button type="button" onClick={() => {}}>
          Confirm
        </button>
      </>
    ),
  },
};

// ============================================================================
// With Hint Text
// ============================================================================

export const WithHintText: Story = {
  args: {
    title: 'Card with Hint',
    helperText: 'This card has hint text in the trailing area.',
    trailingContent: 'hint-text',
    hintText: '2 days ago',
  },
};

// ============================================================================
// Disabled State
// ============================================================================

export const Disabled: Story = {
  args: {
    title: 'Disabled Card',
    helperText: 'This card is disabled and not interactive.',
    disabled: true,
  },
};

export const DisabledSelected: Story = {
  args: {
    title: 'Disabled Selected',
    helperText: 'This card is selected but disabled.',
    selected: true,
    disabled: true,
    selectionType: 'checkbox',
  },
};

// ============================================================================
// Draggable Cards
// ============================================================================

export const Draggable: Story = {
  args: {
    title: 'Draggable Card',
    helperText: 'This card can be dragged to reorder.',
    draggable: true,
  },
};

// ============================================================================
// All Variants
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '500px',
      }}
    >
      <Card title="Base Card" helperText="Default card without elevation" />
      <Card
        title="Clickable Card"
        helperText="Card with elevation and hover effect"
        variant="clickable"
        onClick={() => {}}
      />
      <Card
        title="Selected Card"
        helperText="Card with selected border state"
        variant="selected"
      />
      <Card
        title="Selectable with Checkbox"
        helperText="Card with checkbox for multi-selection"
        selectionType="checkbox"
      />
    </div>
  ),
};

export const CardCollection: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        maxWidth: '800px',
      }}
    >
      <Card
        image={{ src: sampleImage, alt: 'Product' }}
        title="Product 1"
        helperText="Product description"
        tags={[{ label: 'New', variant: 'default' }]}
        variant="clickable"
        onClick={() => {}}
      />
      <Card
        image={{ src: sampleImage, alt: 'Product' }}
        title="Product 2"
        helperText="Product description"
        tags={[{ label: 'Sale', variant: 'warning' }]}
        variant="clickable"
        onClick={() => {}}
      />
      <Card
        image={{ src: sampleImage, alt: 'Product' }}
        title="Product 3"
        helperText="Product description"
        tags={[{ label: 'In Stock', variant: 'success' }]}
        variant="clickable"
        onClick={() => {}}
      />
    </div>
  ),
};
