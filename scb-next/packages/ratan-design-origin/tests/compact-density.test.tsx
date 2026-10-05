import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button, Input, RatanDesignProvider, Select } from '../src';
import MenuItem from '@mui/material/MenuItem';
import { createRatanTheme } from '../src/theme';
import { compactControlTokens } from '../src/tokens';

describe('WebKit business control density', () => {
  it('exports compact business roles for framework adapters', () => {
    expect(compactControlTokens.typography.fontFamily).toContain('SC Prosper Sans');
    expect(compactControlTokens.typography.gridHeader).toBe(11);
    expect(compactControlTokens.typography.gridCell).toBe(12);
    expect(compactControlTokens.control.small.minHeight).toBe(28);
  });
  it.each(['light', 'dark'] as const)('uses coherent typography roles in %s mode', (mode) => {
    const { typography } = createRatanTheme({ mode, designGeneration: 'webkit' });
    for (const role of ['body1', 'body2', 'button', 'caption', 'subtitle1', 'subtitle2'] as const) {
      expect(typography[role].fontFamily).toBe(typography.fontFamily);
    }
    expect(typography.body1.fontSize).toBe('14px');
    expect(typography.body2.fontSize).toBe('12px');
    expect(typography.button.fontSize).toBe('12px');
  });

  it.each([
    ['small', '12px', '28px'],
    ['medium', '14px', '32px'],
    ['large', '16px', '40px'],
  ] as const)('honors the %s button size across variants', (size, fontSize, minHeight) => {
    render(
      <RatanDesignProvider designGeneration="webkit">
        <Button size={size}>Text action</Button>
        <Button size={size} variant="outlined">
          Outlined action
        </Button>
        <Button size={size} variant="contained">
          Contained action
        </Button>
      </RatanDesignProvider>,
    );
    for (const button of screen.getAllByRole('button')) {
      const styles = getComputedStyle(button);
      expect(styles.fontSize).toBe(fontSize);
      expect(styles.minHeight).toBe(minHeight);
      expect(styles.fontFamily).toContain('SC Prosper Sans');
    }
  });

  it('defaults inputs and buttons to the same compact role', () => {
    render(
      <RatanDesignProvider designGeneration="webkit">
        <Button>Search</Button>
        <Input variant="outlined" label="Reference" />
      </RatanDesignProvider>,
    );
    const button = screen.getByRole('button');
    const input = screen.getByRole('textbox', { name: 'Reference' });
    expect(getComputedStyle(button).fontSize).toBe('12px');
    expect(getComputedStyle(input).fontSize).toBe('12px');
    expect(getComputedStyle(input.closest('.MuiOutlinedInput-root')!).minHeight).toBe('28px');
  });

  it('keeps compact selects aligned without consuming their arrow spacing', () => {
    render(
      <RatanDesignProvider designGeneration="webkit">
        <Select label="Currency" variant="outlined" value="SGD">
          <MenuItem value="SGD">Singapore Dollar</MenuItem>
        </Select>
      </RatanDesignProvider>,
    );
    const select = screen.getByRole('combobox', { name: 'Currency' });
    const styles = getComputedStyle(select);
    expect(styles.fontSize).toBe('12px');
    expect(getComputedStyle(select.closest('.MuiOutlinedInput-root')!).minHeight).toBe('28px');
    expect(parseFloat(styles.paddingRight)).toBeGreaterThanOrEqual(24);
  });
});
