import { useState } from 'react';
import { Button, DesignSystemProvider, type DesignDensity, type DesignScheme } from '../src';
import ComponentShowcase from './ComponentShowcase';
import './demo.css';

export default function App() {
  const [scheme, setScheme] = useState<DesignScheme>('dark');
  const [density, setDensity] = useState<DesignDensity>('compact');
  return (
    <DesignSystemProvider appearance={{ scheme, density, direction: 'ltr' }} scope="standalone">
      <main className="demo-content">
        <header>
          <h1>Ratan production design foundation</h1>
          <p>Local provider · build-time package · no runtime UI container</p>
          <div className="demo-actions">
            <Button variant="secondary" onClick={() => setScheme(scheme === 'dark' ? 'light' : 'dark')}>
              Use {scheme === 'dark' ? 'light' : 'dark'} theme
            </Button>
            <Button variant="secondary" onClick={() => setDensity(density === 'compact' ? 'comfortable' : 'compact')}>
              Use {density === 'compact' ? 'comfortable' : 'compact'} density
            </Button>
          </div>
        </header>
        <ComponentShowcase />
      </main>
    </DesignSystemProvider>
  );
}
