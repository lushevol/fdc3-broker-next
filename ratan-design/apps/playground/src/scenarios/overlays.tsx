import { useState } from 'react';
import { Button } from '@fm/ratan-design/button';
import { Dialog } from '@fm/ratan-design/dialog';

export function OverlaysScenario() {
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <section aria-labelledby="overlays-heading">
      <h2 id="overlays-heading">Overlay portal and focus restoration</h2>
      <Button onPress={() => setOuterOpen(true)}>Open account dialog</Button>
      <Dialog open={outerOpen} onOpenChange={setOuterOpen} label="Account details">
        <p>The overlay portals to document.body and restores trigger focus.</p>
        <Button onPress={() => setInnerOpen(true)}>Open nested confirmation</Button>
        <Dialog open={innerOpen} onOpenChange={setInnerOpen} label="Confirm action">
          <Button onPress={() => setInnerOpen(false)}>Confirm</Button>
        </Dialog>
      </Dialog>
    </section>
  );
}
