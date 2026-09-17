import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Loader, PageLoader, Snackbar } from '../src';

function Feedback() {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ padding: 24 }}>
      <Loader text="Loading trades" size={48} />
      <Button onClick={() => setOpen(true)}>Show notification</Button>
      <Snackbar
        open={open}
        message={<strong>Trades updated</strong>}
        severity="success"
        onClose={(_event, reason) => {
          if (reason !== 'clickaway') setOpen(false);
        }}
        action={<Button onClick={() => setOpen(false)}>Dismiss</Button>}
      />
    </div>
  );
}

const meta: Meta<typeof Feedback> = {
  title: 'Feedback/States',
  component: Feedback,
};
export default meta;
export const Notification: StoryObj<typeof Feedback> = {};
export const Page: StoryObj<typeof Feedback> = {
  render: () => <PageLoader text="Loading workspace" />,
};
export const LongMessage: StoryObj<typeof Feedback> = {
  render: () => (
    <Snackbar
      open
      severity="warning"
      variant="outlined"
      message={'Some trades could not be updated. '.repeat(12)}
      alertsx={{ maxWidth: '100%' }}
    />
  ),
};
