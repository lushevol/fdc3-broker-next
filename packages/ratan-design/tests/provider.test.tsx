import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import * as publicApi from '../src';
import {
  DesignSystemProvider,
  createRatanTheme,
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

  it('adapts semantic appearance into MUI theme values', () => {
    const compactTheme = createRatanTheme(darkCompact);
    const comfortableTheme = createRatanTheme({ ...darkCompact, density: 'comfortable', direction: 'rtl' });
    expect(compactTheme.palette.mode).toBe('dark');
    expect(compactTheme.palette.primary.main).toBe('#5eead4');
    expect(compactTheme.direction).toBe('ltr');
    expect(compactTheme.components?.MuiButton?.defaultProps).toMatchObject({ size: 'small' });
    expect(comfortableTheme.direction).toBe('rtl');
    expect(comfortableTheme.components?.MuiButton?.defaultProps).toMatchObject({ size: 'medium' });
  });

  it('does not expose raw MUI or legacy experimental components', () => {
    expect(publicApi).not.toHaveProperty('MuiButton');
    expect(publicApi).not.toHaveProperty('ThemeProvider');
    expect(publicApi).not.toHaveProperty('Card');
    expect(publicApi).not.toHaveProperty('Input');
    expect(publicApi).not.toHaveProperty('cleanUnusedCss');
  });
});
