import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RatanDesignProvider, SearchConditionContainer } from '../src';
import * as themeApi from '../src/theme';

afterEach(() => vi.restoreAllMocks());

describe('render work budgets', () => {
  it('builds the theme only once through initial portal-root attachment and unchanged rerenders', () => {
    const createTheme = vi.spyOn(themeApi, 'createRatanTheme');
    function Consumer() {
      return <span>Content</span>;
    }
    const { rerender } = render(<RatanDesignProvider><Consumer /></RatanDesignProvider>);
    for (let iteration = 0; iteration < 10; iteration++)
      rerender(<RatanDesignProvider><Consumer /></RatanDesignProvider>);
    console.info('Provider theme builds (mount + 10 unchanged rerenders):', createTheme.mock.calls.length);
    expect(createTheme).toHaveBeenCalledTimes(1);
    rerender(<RatanDesignProvider mode="dark"><Consumer /></RatanDesignProvider>);
    expect(createTheme).toHaveBeenCalledTimes(2);
  });

  it('does not measure expanded criteria on resize or child mutations', async () => {
    render(<SearchConditionContainer data-testid="criteria">
      {Array.from({ length: 50 }, (_, index) => <button key={index}>Criterion {index}</button>)}
    </SearchConditionContainer>);
    fireEvent.click(screen.getByRole('button', { name: 'Expand search criteria' }));
    const root = screen.getByTestId('criteria');
    const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    fireEvent(window, new Event('resize'));
    await act(async () => { root.firstElementChild!.textContent = 'Changed criterion'; });
    console.info('Expanded criteria geometry reads (resize + mutation, 50 criteria):', bounds.mock.calls.length);
    expect(bounds).not.toHaveBeenCalled();
    expect(root.querySelector('[inert]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Collapse search criteria' }));
    expect(bounds).toHaveBeenCalled();
  });
});
