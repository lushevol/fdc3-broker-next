import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationDialog } from '../src';

const meta = {
  title: 'Interaction/ConfirmationDialog',
  component: ConfirmationDialog,
  args: {
    open: true,
    title: 'Delete profile limit?',
    message: 'The application decides whether this action is authorized.',
    confirmLabel: 'Delete',
    onConfirm: () => undefined,
    onCancel: () => undefined,
  },
} satisfies Meta<typeof ConfirmationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Danger: Story = { args: { tone: 'danger' } };
export const Loading: Story = { args: { tone: 'danger', loading: true } };
