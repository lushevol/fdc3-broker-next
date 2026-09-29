import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MuiDialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import { Dialog, RatanDesignProvider, Select } from '../src';

describe('provider portal readiness', () => {
  it.each([false, true])('contains initially open overlays with host theme=%s', async (host) => {
    const baseTheme = host ? createTheme({ typography: { fontFamily: 'Host Font' } }) : undefined;
    const { rerender } = render(
      <RatanDesignProvider baseTheme={baseTheme} className="owning-root">
        <Dialog open transitionDuration={0}><p>Initially open</p></Dialog>
      </RatanDesignProvider>,
    );
    const root = document.querySelector('.owning-root')!;
    expect(await within(root as HTMLElement).findByRole('dialog')).toHaveTextContent('Initially open');
    rerender(<RatanDesignProvider baseTheme={baseTheme} mode="dark" className="owning-root">
      <Dialog open transitionDuration={0}><p>Still open</p></Dialog>
    </RatanDesignProvider>);
    expect(root).toHaveAttribute('data-mode', 'dark');
    expect(root).toContainElement(screen.getByRole('dialog'));
  });

  it('retains primitive dialog placement when open at mount', () => {
    render(<RatanDesignProvider className="primitive-root">
      <MuiDialog open transitionDuration={0}><p>Primitive</p></MuiDialog>
    </RatanDesignProvider>);
    // The raw primitive does not use the core Dialog's portal-readiness gate.
    expect(document.querySelector('.primitive-root')).toContainElement(
      screen.getByRole('dialog', { hidden: true }),
    );
  });

  it('puts an initially open select in its nearest nested provider', () => {
    render(<RatanDesignProvider className="outer-root">
      <RatanDesignProvider mode="dark" className="inner-root">
        <Select open variant="outlined" label="Currency" value="USD">
          <MenuItem value="USD">USD</MenuItem>
        </Select>
      </RatanDesignProvider>
    </RatanDesignProvider>);
    expect(document.querySelector('.inner-root')).toContainElement(screen.getByRole('listbox'));
  });
});
