import { useState } from 'react';
import { Button, StatusBadge, TextField } from '../src';

export default function ComponentShowcase() {
  const [filter, setFilter] = useState('');
  return (
    <section>
      <h2>Foundation components</h2>
      <div className="demo-actions">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <TextField id="demo-filter" label="Filter cashflows" value={filter} onChange={setFilter} />
      <div className="demo-actions">
        <StatusBadge status="ready">Ready</StatusBadge>
        <StatusBadge status="review">Review</StatusBadge>
        <StatusBadge status="blocked">Blocked</StatusBadge>
        <StatusBadge>Neutral</StatusBadge>
      </div>
    </section>
  );
}
