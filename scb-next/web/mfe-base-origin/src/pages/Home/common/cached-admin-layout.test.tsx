import React from 'react';
import { render, screen } from '@testing-library/react';
import Provider from '../../../hooks/provider';
import ThemeProvider from '../../../theme';
import Root, { classes, PREFIX } from './style';

function renderPanels() {
  render(
    <Provider data={{ theme: 'dark' }}>
      <ThemeProvider>
        <Root>
          <div className={classes.box}>
            <div
              hidden
              data-testid="cached-admin"
              className={`${classes.tabpanel} ${PREFIX}-cachedAdminPanel`}
            >
              <div hidden className="tabmain" data-testid="cached-content">
                <button data-testid="hidden-control">Cached action</button>
              </div>
            </div>
            <div
              data-testid="active-admin"
              className={`${classes.tabpanel} ${PREFIX}-cachedAdminPanel`}
            >
              <div className="tabmain" data-testid="active-content" />
            </div>
            <div hidden data-testid="cached-remote" className={classes.tabpanel}>
              <div hidden className="tabmain" />
            </div>
          </div>
        </Root>
      </ThemeProvider>
    </Provider>,
  );
}

it('keeps hidden admin panels laid out without exposing descendants', () => {
  renderPanels();
  const panel = screen.getByTestId('cached-admin');
  expect(panel).toHaveAttribute('hidden');
  expect(getComputedStyle(panel).display).toBe('block');
  expect(getComputedStyle(panel).position).toBe('absolute');
  expect(getComputedStyle(panel).width).toBe('100%');
  expect(getComputedStyle(panel).visibility).toBe('hidden');
  expect(getComputedStyle(panel).pointerEvents).toBe('none');
  expect(getComputedStyle(screen.getByTestId('cached-content')).display).toBe('block');
  expect(getComputedStyle(screen.getByTestId('hidden-control')).visibility).toBe('hidden');
});

it('retains active admin and cached remote layout rules', () => {
  renderPanels();
  expect(getComputedStyle(screen.getByTestId('active-admin')).position).not.toBe('absolute');
  expect(getComputedStyle(screen.getByTestId('active-content')).visibility).not.toBe('hidden');
  expect(getComputedStyle(screen.getByTestId('cached-remote')).display).toBe('none');
});
