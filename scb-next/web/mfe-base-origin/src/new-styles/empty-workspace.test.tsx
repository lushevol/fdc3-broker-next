import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRatanTheme, ThemeProvider } from 'ratan-design-origin/theme';
import PrototypeEmptyWorkspace from './empty-workspace';

describe('prototype empty workspace', () => {
  it.each(['dark', 'light'] as const)('keeps Find Tile usable in %s mode', (mode) => {
    const onFindTile = vi.fn();
    render(
      <ThemeProvider theme={createRatanTheme({ mode })}>
        <PrototypeEmptyWorkspace onFindTile={onFindTile} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Start customizing your workspace' })).toHaveStyle({
      fontSize: '20px', lineHeight: '26px',
    });
    expect(screen.getByText('Find out what workspace preference options you have and how those options work.')).toHaveStyle({
      fontSize: '14px', lineHeight: '20px',
    });
    const findTile = screen.getByRole('button', { name: 'Find Tile' });
    expect(findTile).toHaveStyle({ fontSize: '14px', lineHeight: '20px', height: '48px' });
    fireEvent.click(findTile);
    expect(onFindTile).toHaveBeenCalledOnce();
  });
});
