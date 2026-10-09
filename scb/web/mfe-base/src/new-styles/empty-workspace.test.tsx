import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRatanTheme, ThemeProvider } from 'ratan-design-origin/theme';
import PrototypeEmptyWorkspace from './empty-workspace';
import { portalPresentationTokens as t } from './portal-tokens';

describe('prototype empty workspace', () => {
  it.each(['dark', 'light'] as const)('keeps Find Tile usable in %s mode', (mode) => {
    const onFindTile = vi.fn();
    render(
      <ThemeProvider theme={createRatanTheme({ mode })}>
        <PrototypeEmptyWorkspace onFindTile={onFindTile} />
      </ThemeProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Start customizing your workspace' })).toHaveStyle(t.typography.title);
    expect(screen.getByText('Find out what workspace preference options you have and how those options work.')).toHaveStyle(t.typography.body);
    const findTile = screen.getByRole('button', { name: 'Find Tile' });
    expect(findTile).toHaveStyle({ ...t.typography.body, height: '48px' });
    fireEvent.click(findTile);
    expect(onFindTile).toHaveBeenCalledOnce();
  });
});
