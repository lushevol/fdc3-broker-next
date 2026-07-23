import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src';

const meta = {
  title: 'Foundation/Button',
  component: Button,
  args: { children: 'Action' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger', 'ghost'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Disabled: Story = { args: { disabled: true } };
