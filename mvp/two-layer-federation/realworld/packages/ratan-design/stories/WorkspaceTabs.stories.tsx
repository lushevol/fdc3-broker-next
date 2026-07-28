import type { Meta, StoryObj } from '@storybook/react';
import { WorkspaceTabs } from '../src';

const meta = {
  title: 'Navigation/WorkspaceTabs',
  component: WorkspaceTabs,
  args: {
    ariaLabel: 'Open applications',
    selectedId: 'cashflow-1',
    tabs: [
      {
        id: 'cashflow-1',
        label: 'Cashflow 1',
        closeLabel: 'Close Cashflow',
        content: 'Cashflow application',
      },
      {
        id: 'profile-1',
        label: 'Identity profile 1',
        closeLabel: 'Close Identity profile',
        content: 'Identity profile application',
      },
    ],
    onSelectionChange: () => undefined,
    onClose: () => undefined,
  },
} satisfies Meta<typeof WorkspaceTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
