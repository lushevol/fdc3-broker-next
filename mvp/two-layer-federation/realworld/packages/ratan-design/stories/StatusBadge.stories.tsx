import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '../src';

const meta = {
  title: 'Foundation/StatusBadge',
  component: StatusBadge,
  args: { children: 'Ready', status: 'ready' },
  argTypes: {
    status: { control: 'select', options: ['ready', 'review', 'blocked', 'neutral'] },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
export const Review: Story = { args: { status: 'review', children: 'Review' } };
export const Blocked: Story = { args: { status: 'blocked', children: 'Blocked' } };
export const Neutral: Story = { args: { status: 'neutral', children: 'Unknown' } };
