import type { Meta, StoryObj } from '@storybook/react';
import { InlineAlert } from '../src';

const meta = {
  title: 'Interaction/InlineAlert',
  component: InlineAlert,
  args: { tone: 'info', message: 'Application-local feedback' },
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Information: Story = {};
export const Success: Story = {
  args: { tone: 'success', message: 'Profile limit saved' },
};
export const Warning: Story = {
  args: { tone: 'warning', message: 'Review this change' },
};
export const ErrorWithAction: Story = {
  args: {
    tone: 'error',
    title: 'Unable to load',
    message: 'The repository did not respond.',
    actionLabel: 'Retry',
    onAction: () => undefined,
  },
};
