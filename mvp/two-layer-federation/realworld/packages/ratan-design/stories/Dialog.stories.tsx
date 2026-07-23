import type { Meta, StoryObj } from '@storybook/react';
import { Button, Dialog } from '../src';

const meta = {
  title: 'Interaction/Dialog',
  component: Dialog,
  args: {
    open: true,
    title: 'Edit profile limit',
    description: 'The application owns validation and submission.',
    children: 'Application-composed form content',
    actions: (
      <>
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
    onClose: () => undefined,
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { width: 'small' } };
export const Medium: Story = { args: { width: 'medium' } };
export const NonDismissible: Story = { args: { dismissible: false } };
