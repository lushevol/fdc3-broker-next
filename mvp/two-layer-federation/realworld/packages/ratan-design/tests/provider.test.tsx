import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import * as publicApi from '../src';
import {
  DesignSystemProvider,
  type DesignAppearance,
} from '../src/provider';

const darkCompact: DesignAppearance = {
  scheme: 'dark',
  density: 'compact',
  direction: 'ltr',
};

function StatefulChild() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((value) => value + 1)}>Count {count}</button>;
}

describe('production design provider', () => {
  it('scopes independent roots without document-global attributes', () => {
    render(
      <>
        <DesignSystemProvider appearance={darkCompact} scope="host"><span>Host</span></DesignSystemProvider>
        <DesignSystemProvider
          appearance={{ ...darkCompact, scheme: 'light', density: 'comfortable', direction: 'rtl' }}
          scope="application"
        >
          <span>Application</span>
        </DesignSystemProvider>
      </>,
    );
    const host = document.querySelector('[data-ratan-scope="host"]');
    const application = document.querySelector('[data-ratan-scope="application"]');
    expect(host).toHaveAttribute('data-ratan-theme', 'dark');
    expect(host).toHaveAttribute('data-ratan-density', 'compact');
    expect(application).toHaveAttribute('data-ratan-theme', 'light');
    expect(application).toHaveAttribute('data-ratan-density', 'comfortable');
    expect(application).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).not.toHaveAttribute('data-ratan-theme');
  });

  it('updates appearance without remounting application state', () => {
    const view = render(
      <DesignSystemProvider appearance={darkCompact}><StatefulChild /></DesignSystemProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));
    view.rerender(
      <DesignSystemProvider appearance={{ ...darkCompact, scheme: 'light', density: 'comfortable' }}>
        <StatefulChild />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    expect(document.querySelector('[data-ratan-scope="application"]')).toHaveAttribute(
      'data-ratan-theme',
      'light',
    );
  });

  it('exposes appearance as a local CSS and direction contract', () => {
    render(
      <DesignSystemProvider appearance={darkCompact} scope="standalone">
        <span>Content</span>
      </DesignSystemProvider>,
    );
    const root = document.querySelector('[data-ratan-scope="standalone"]');
    expect(root).toHaveClass('ratan-design-root');
    expect(root).toHaveAttribute('data-ratan-theme', 'dark');
    expect(root).toHaveAttribute('data-ratan-density', 'compact');
    expect(root).toHaveAttribute('dir', 'ltr');
  });

  it('does not expose raw implementation or legacy experimental components', () => {
    expect(publicApi).not.toHaveProperty('MuiButton');
    expect(publicApi).not.toHaveProperty('ThemeProvider');
    expect(publicApi).not.toHaveProperty('AriaButton');
    expect(publicApi).not.toHaveProperty('Input');
    expect(publicApi).not.toHaveProperty('cleanUnusedCss');
  });
});
