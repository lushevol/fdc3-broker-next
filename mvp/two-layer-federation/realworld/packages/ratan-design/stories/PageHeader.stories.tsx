import type { Meta, StoryObj } from '@storybook/react';
import { Button, PageHeader } from '../src';

const meta = {
  title: 'Shell/PageHeader',
  component: PageHeader,
  args: {
    eyebrow: 'FMO NEXT',
    title: 'Operations Workspace',
    description: 'Post-trade applications',
    actions: <Button variant="secondary">Theme</Button>,
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
