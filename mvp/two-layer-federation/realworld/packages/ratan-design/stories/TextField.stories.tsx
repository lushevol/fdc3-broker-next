import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../src';

const meta = {
  title: 'Foundation/TextField',
  component: TextField,
  args: {
    id: 'cashflow-filter',
    label: 'Filter cashflows',
    value: '',
    onChange: () => undefined,
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, value: 'USD' } };
