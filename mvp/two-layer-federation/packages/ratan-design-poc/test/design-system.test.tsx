import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  DesignSystemProvider,
  StatusBadge,
  TextField,
  createRatanTheme,
  type DesignAppearance,
} from '../src';

const darkCompact: DesignAppearance = {
  scheme: 'dark',
  density: 'compact',
  direction: 'ltr',
};

describe('DesignSystemProvider', () => {
  it('scopes scheme, density, and direction to its subtree', () => {
    render(
      <DesignSystemProvider appearance={darkCompact}>
        <div>Content</div>
      </DesignSystemProvider>,
    );
    const root = screen.getByTestId('ratan-design-root');
    expect(root).toHaveAttribute('data-ratan-theme', 'dark');
    expect(root).toHaveAttribute('data-ratan-density', 'compact');
    expect(root).toHaveAttribute('dir', 'ltr');
  });

  it('creates distinct light/dark and compact/comfortable themes', () => {
    const compact = createRatanTheme(darkCompact);
    const comfortable = createRatanTheme({ ...darkCompact, scheme: 'light', density: 'comfortable' });
    expect(compact.palette.mode).toBe('dark');
    expect(comfortable.palette.mode).toBe('light');
    expect(compact.components?.MuiButton?.defaultProps?.size).toBe('small');
    expect(comfortable.components?.MuiButton?.defaultProps?.size).toBe('medium');
  });
});

describe('shared components', () => {
  it('renders a bounded button and forwards activation', () => {
    const onClick = vi.fn();
    render(
      <DesignSystemProvider appearance={darkCompact}>
        <Button variant="primary" onClick={onClick}>Save</Button>
      </DesignSystemProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each([
    ['primary', 'contained'],
    ['secondary', 'outlined'],
    ['danger', 'outlined'],
    ['ghost', 'text'],
  ] as const)('maps %s to its bounded MUI treatment', (variant, muiVariant) => {
    render(
      <DesignSystemProvider appearance={darkCompact}>
        <Button variant={variant}>{variant}</Button>
      </DesignSystemProvider>,
    );
    const button = screen.getByRole('button', { name: variant });
    expect(button).toHaveAttribute('data-ratan-variant', variant);
    expect(button).toHaveClass(`MuiButton-${muiVariant}`);
  });

  it('renders an accessible labelled text field and reports changes', () => {
    const onChange = vi.fn();
    render(
      <DesignSystemProvider appearance={darkCompact}>
        <TextField id="filter" label="Filter cashflows" value="" onChange={onChange} />
      </DesignSystemProvider>,
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter cashflows' }), {
      target: { value: 'USD' },
    });
    expect(onChange).toHaveBeenCalledWith('USD');
  });

  it.each(['ready', 'review', 'blocked'] as const)('renders readable %s status', (status) => {
    render(
      <DesignSystemProvider appearance={darkCompact}>
        <StatusBadge status={status}>{status.toUpperCase()}</StatusBadge>
      </DesignSystemProvider>,
    );
    expect(screen.getByText(status.toUpperCase()).closest('[data-status]')).toHaveAttribute(
      'data-status',
      status,
    );
  });
});
