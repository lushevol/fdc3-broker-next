import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Console } from './Console';
import { DEFAULT_STYLE_SETTINGS } from './settings';

describe('local Portal style control', () => {
  it('shows the host generation and requests an explicit alternative', () => {
    const onChange = vi.fn();
    const view = render(<Console settings={DEFAULT_STYLE_SETTINGS} onChange={vi.fn()} onReset={vi.fn()}
      portalGeneration={{ value: 'legacy', onChange }} />);
    expect(screen.getByRole('group', { name: 'Local portal style' })).toBeVisible();
    const legacy = screen.getByRole('button', { name: 'Use Legacy portal style' });
    const webkit = screen.getByRole('button', { name: 'Use WebKit portal style' });
    expect(legacy).toHaveAttribute('aria-pressed', 'true');
    expect(webkit).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(legacy);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(webkit);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('webkit');
    view.rerender(<Console settings={DEFAULT_STYLE_SETTINGS} onChange={vi.fn()} onReset={vi.fn()}
      portalGeneration={{ value: 'webkit', onChange }} />);
    expect(webkit).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(legacy);
    expect(onChange).toHaveBeenLastCalledWith('legacy');
  });

  it('avoids obstructing the open console drawer', () => {
    render(<Console settings={DEFAULT_STYLE_SETTINGS} onChange={vi.fn()} onReset={vi.fn()}
      portalGeneration={{ value: 'webkit', onChange: vi.fn() }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Styling console' }));
    expect(screen.queryByRole('group', { name: 'Local portal style' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close styling console' }));
    expect(screen.getByRole('group', { name: 'Local portal style' })).toBeVisible();
  });
});
