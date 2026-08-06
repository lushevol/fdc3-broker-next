import { createElement, useEffect, useState } from 'react';
import { Button } from '@fm/ratan-design/button';

export function CoexistenceScenario() {
  const [registered, setRegistered] = useState(customElements.get('sc-button') !== undefined);

  useEffect(() => {
    let active = true;
    void import('@scdevkit/webkit/elements').then(() => {
      if (active) setRegistered(customElements.get('sc-button') !== undefined);
    });
    return () => { active = false; };
  }, []);

  return (
    <section aria-labelledby="coexistence-heading">
      <h2 id="coexistence-heading">WebKit and Ratan coexistence</h2>
      <div className="playground-preview">
        {createElement('sc-button', { type: 'primary' }, 'Frozen WebKit button')}
        <Button variant="primary">Ratan React button</Button>
      </div>
      <p role="status">WebKit registration: {registered ? 'ready' : 'loading'}</p>
    </section>
  );
}
