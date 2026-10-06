import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createPortalPresentationTheme } from '../theme';
import StyleConsoleBoundary from './Boundary';
import { DEFAULT_STYLE_SETTINGS, STYLE_STORAGE_KEY, saveStyleSettings } from './settings';

describe('local console Portal boundary', () => {
  beforeEach(() => sessionStorage.clear());

  it('starts with baseline appearance, applies temporary settings, then restores it', async () => {
    const onPreviewChange = vi.fn();
    render(<StyleConsoleBoundary onPreviewChange={onPreviewChange} />);
    expect(onPreviewChange).toHaveBeenLastCalledWith(null);
    fireEvent.click(screen.getByRole('button', { name: 'Styling console' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Apply to Portal' }));
    await waitFor(() => expect(onPreviewChange).toHaveBeenLastCalledWith(expect.objectContaining({ mode: 'light', designGeneration: 'webkit' })));
    const preview = onPreviewChange.mock.lastCall?.[0];
    const baseline = createPortalPresentationTheme('light');
    expect(preview.composeTheme(baseline).components.MuiCssBaseline.styleOverrides).toEqual(expect.arrayContaining([
      expect.objectContaining({ 'html.ratan-design-root[data-generation][data-mode]': expect.objectContaining({ '--portal-preview-body-font-size': '14px' }) }),
    ]));
    fireEvent.click(screen.getByRole('button', { name: 'Reset styles' }));
    expect(onPreviewChange).toHaveBeenLastCalledWith(null);
    expect(sessionStorage.getItem(STYLE_STORAGE_KEY)).toBeNull();
  });

  it('restores a saved preview after reload without application dispatch', () => {
    saveStyleSettings(sessionStorage, { ...DEFAULT_STYLE_SETTINGS, applyToPortal: true, mode: 'dark', fontSize: 18 });
    const onPreviewChange = vi.fn();
    const view = render(<StyleConsoleBoundary onPreviewChange={onPreviewChange} />);
    expect(onPreviewChange).toHaveBeenLastCalledWith(expect.objectContaining({ mode: 'dark' }));
    view.unmount();
    expect(onPreviewChange).toHaveBeenLastCalledWith(null);
  });

  it('remains usable when accessing browser storage throws', () => {
    const storage = vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => { throw new Error('blocked'); });
    const onPreviewChange = vi.fn();
    render(<StyleConsoleBoundary onPreviewChange={onPreviewChange} />);
    expect(screen.getByRole('button', { name: 'Styling console' })).toBeInTheDocument();
    expect(onPreviewChange).toHaveBeenLastCalledWith(null);
    storage.mockRestore();
  });
});
