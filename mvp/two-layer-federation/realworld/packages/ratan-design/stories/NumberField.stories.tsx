import type { Meta, StoryObj } from '@storybook/react';
import { NumberField } from '../src';

const meta = {
  title: 'Interaction/NumberField',
  component: NumberField,
  args: {
    id: 'profile-limit',
    label: 'Profile limit',
    value: 1000,
    min: 0,
    max: 99999999999,
    step: 1,
    onChange: () => undefined,
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { value: null } };
export const Invalid: Story = {
  args: { value: null, error: true, helperText: 'A limit is required' },
};
export const Disabled: Story = { args: { disabled: true } };
