import { useState } from 'react';
import {
  Button,
  ConfirmationDialog,
  Dialog,
  InlineAlert,
  NumberField,
  StatusBadge,
  TextField,
} from '../src';

export default function ComponentShowcase() {
  const [filter, setFilter] = useState('');
  const [limit, setLimit] = useState<number | null>(1000);
  const [editorOpen, setEditorOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  return (
    <section>
      <h2>Foundation components</h2>
      <div className="demo-actions">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <TextField
        id="demo-filter"
        label="Filter cashflows"
        value={filter}
        onChange={setFilter}
      />
      <NumberField
        id="demo-limit"
        label="Profile limit"
        value={limit}
        min={0}
        onChange={setLimit}
      />
      <div className="demo-actions">
        <StatusBadge status="ready">Ready</StatusBadge>
        <StatusBadge status="review">Review</StatusBadge>
        <StatusBadge status="blocked">Blocked</StatusBadge>
        <StatusBadge>Neutral</StatusBadge>
      </div>
      <InlineAlert
        tone="info"
        title="Application-owned interaction"
        message="The design package renders feedback; the application owns request state."
        actionLabel="Open editor"
        onAction={() => setEditorOpen(true)}
      />
      <div className="demo-actions">
        <Button onClick={() => setEditorOpen(true)}>Open dialog</Button>
        <Button variant="danger" onClick={() => setConfirmationOpen(true)}>
          Open confirmation
        </Button>
      </div>
      <Dialog
        open={editorOpen}
        title="Edit profile limit"
        description="This demo owns the controlled value and dialog lifecycle."
        onClose={() => setEditorOpen(false)}
        actions={<Button onClick={() => setEditorOpen(false)}>Save</Button>}
      >
        <NumberField
          id="dialog-limit"
          label="Limit"
          value={limit}
          min={0}
          onChange={setLimit}
        />
      </Dialog>
      <ConfirmationDialog
        open={confirmationOpen}
        title="Delete profile limit?"
        message="Confirmation does not perform a service call."
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => setConfirmationOpen(false)}
        onCancel={() => setConfirmationOpen(false)}
      />
    </section>
  );
}
