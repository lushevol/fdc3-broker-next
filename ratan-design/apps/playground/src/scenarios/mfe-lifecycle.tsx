import { useState } from 'react';
import { Button } from '@fm/ratan-design/button';
import { Dialog } from '@fm/ratan-design/dialog';

export function MfeLifecycleScenario() {
  const [open, setOpen] = useState(false);
  return (
    <section aria-labelledby="mfe-heading">
      <h2 id="mfe-heading">Independent MFE lifecycle</h2>
      <p>Use the exported mount/unmount functions repeatedly; all portals and document modes are cleaned on unmount.</p>
      <Button onPress={() => setOpen(true)}>Open MFE overlay</Button>
      <Dialog open={open} onOpenChange={setOpen} label="MFE overlay">Lifecycle-owned content</Dialog>
    </section>
  );
}
