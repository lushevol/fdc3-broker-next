import type { Meta, StoryObj } from '@storybook/react';
import { SideNavigation } from '../src';

const meta = {
  title: 'Navigation/SideNavigation',
  component: SideNavigation,
  args: {
    ariaLabel: 'Application launcher',
    title: 'Applications',
    selectedId: 'cashflow',
    items: [
      { id: 'cashflow', label: 'Cashflow', description: 'Settlement operations' },
      { id: 'profile', label: 'Identity profile', description: 'User access' },
    ],
    onAction: () => undefined,
  },
} satisfies Meta<typeof SideNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
