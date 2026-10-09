import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import StyleConsoleBoundary from './Boundary';
import { switchPortalGeneration } from './portal-generation';
import { DEFAULT_STYLE_SETTINGS, type StyleSettings } from './settings';

vi.mock('./portal-generation', () => ({
  switchPortalGeneration: vi.fn((generation: StyleSettings['designGeneration'], settings: StyleSettings) => ({
    ...settings, applyToPortal: false, designGeneration: generation,
  })),
}));

describe('local Portal switch integration', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('uses the host generation and requests a complete Portal switch', () => {
    render(<StyleConsoleBoundary designGeneration="webkit" onPreviewChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Use WebKit portal style' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Use Legacy portal style' }));
    expect(switchPortalGeneration).toHaveBeenCalledExactlyOnceWith(
      'legacy', DEFAULT_STYLE_SETTINGS, {
        href: window.location.href, history: window.history, dispatch: expect.any(Function), storage: sessionStorage,
      },
    );
  });

  it('still switches when accessing browser storage is blocked', () => {
    const storage = vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => { throw new Error('blocked'); });
    const onPreviewChange = vi.fn();
    render(<StyleConsoleBoundary designGeneration="webkit" onPreviewChange={onPreviewChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Use Legacy portal style' }));
    expect(switchPortalGeneration).toHaveBeenCalledWith('legacy', DEFAULT_STYLE_SETTINGS, {
      href: window.location.href, history: window.history, dispatch: expect.any(Function), storage: null,
    });
    expect(onPreviewChange).toHaveBeenLastCalledWith(null);
    storage.mockRestore();
  });

  it('hides both development controls in a production build on localhost', () => {
    vi.stubEnv('DEV', false);
    render(<StyleConsoleBoundary designGeneration="webkit" onPreviewChange={vi.fn()} />);
    expect(screen.queryByRole('group', { name: 'Local portal style' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Styling console' })).not.toBeInTheDocument();
  });

  it('hides both development controls on a nonlocal hostname', () => {
    vi.stubGlobal('window', new Proxy(window, {
      get(target, key) {
        return key === 'location' ? new URL('https://portal.example.com/') : Reflect.get(target, key, target);
      },
    }));
    render(<StyleConsoleBoundary designGeneration="webkit" onPreviewChange={vi.fn()} />);
    expect(screen.queryByRole('group', { name: 'Local portal style' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Styling console' })).not.toBeInTheDocument();
  });
});
