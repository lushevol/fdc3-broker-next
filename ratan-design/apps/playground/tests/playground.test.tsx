import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PlaygroundApp, playgroundRoutes } from '../src/playground-app.js';
import { supportsReactVersion } from '../src/scenarios/compatibility.js';
import { mountPlayground, unmountPlayground } from '../src/mount.js';
import { applyDocumentMode } from '../src/theme.js';

describe('packed-package playground', () => {
  it('provides every proof integration route', () => {
    expect(playgroundRoutes.map(({ path }) => path)).toEqual([
      '/compatibility', '/forms', '/overlays', '/theme-modes', '/data-grid', '/mfe-lifecycle', '/coexistence',
    ]);
  });

  it('declares React 18.2 through 19 compatibility', () => {
    expect(supportsReactVersion('18.2.0')).toBe(true);
    expect(supportsReactVersion('18.3.1')).toBe(true);
    expect(supportsReactVersion('19.0.0')).toBe(true);
    expect(supportsReactVersion('17.0.2')).toBe(false);
    expect(supportsReactVersion('20.0.0')).toBe(false);
  });

  it('submits and resets the native form route through public subpaths', async () => {
    window.location.hash = '/forms';
    render(<PlaygroundApp />);
    expect(screen.getByRole('heading', { name: 'Native form lifecycle' })).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByRole('status').textContent).toContain('Copper');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('status').textContent).toContain('Reset');
  });

  it('applies and cleans document-global modes across MFE mount cycles', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    applyDocumentMode({ theme: 'cpbb', mode: 'dark', font: 'dyslexic', direction: 'rtl', locale: 'ar-AE' });
    await act(async () => mountPlayground(host, { initialRoute: '/mfe-lifecycle' }));
    expect(host.textContent).toContain('Independent MFE lifecycle');
    expect([...document.documentElement.classList]).toEqual(expect.arrayContaining(['sc-theme-cpbb', 'sc-mode-dark', 'sc-mode-dyslexic']));
    await act(async () => unmountPlayground(host));
    expect(host.childElementCount).toBe(0);
    expect([...document.documentElement.classList]).not.toEqual(expect.arrayContaining(['sc-theme-cpbb', 'sc-mode-dark', 'sc-mode-dyslexic']));
    host.remove();
  });

  it('renders WebKit and Ratan side by side for migration coexistence', () => {
    window.location.hash = '/coexistence';
    render(<PlaygroundApp />);
    expect(document.querySelector<HTMLElement>('sc-button')?.textContent).toContain('Frozen WebKit button');
    expect(screen.getByRole('button', { name: 'Ratan React button' })).toBeTruthy();
  });
});
