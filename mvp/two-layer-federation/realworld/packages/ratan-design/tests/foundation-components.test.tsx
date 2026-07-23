import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../src/components/Button';
import { StatusBadge } from '../src/components/StatusBadge';
import { TextField } from '../src/components/TextField';
import { DesignSystemProvider, type DesignAppearance } from '../src/provider';

const appearance: DesignAppearance = { scheme: 'dark', density: 'compact', direction: 'ltr' };

function renderDesign(children: React.ReactNode, nextAppearance = appearance) {
  return render(
    <DesignSystemProvider appearance={nextAppearance} scope="standalone">
      {children}
    </DesignSystemProvider>,
  );
}

describe('production foundational components', () => {
  it.each(['primary', 'secondary', 'danger', 'ghost'] as const)(
    'renders the %s semantic button variant',
    (variant) => {
      renderDesign(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole('button', { name: variant })).toHaveAttribute('data-ratan-variant', variant);
    },
  );

  it('preserves native button semantics and disabled behavior', () => {
    const onClick = vi.fn();
    renderDesign(<Button disabled onClick={onClick}>Submit</Button>);
    const button = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(button);
    expect(button).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('labels a text field, reports values, and supports disabled state', () => {
    const onChange = vi.fn();
    const view = renderDesign(
      <TextField id="filter" label="Filter cashflows" value="" onChange={onChange} />,
    );
    const input = screen.getByRole('textbox', { name: 'Filter cashflows' });
    fireEvent.change(input, { target: { value: 'USD' } });
    expect(onChange).toHaveBeenCalledWith('USD');
    expect(input).toHaveAttribute('data-ratan-control', 'text-field');
    view.rerender(
      <DesignSystemProvider appearance={appearance}>
        <TextField id="filter" label="Filter cashflows" value="USD" onChange={onChange} disabled />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('textbox', { name: 'Filter cashflows' })).toBeDisabled();
  });

  it.each(['ready', 'review', 'blocked', 'neutral'] as const)(
    'renders %s status semantics',
    (status) => {
      renderDesign(<StatusBadge status={status}>{status}</StatusBadge>);
      expect(screen.getByText(status).closest('[data-status]')).toHaveAttribute('data-status', status);
    },
  );

  it('defaults status to neutral', () => {
    renderDesign(<StatusBadge>Unknown</StatusBadge>);
    expect(screen.getByText('Unknown').closest('[data-status]')).toHaveAttribute('data-status', 'neutral');
  });

  it('applies visible focus hooks and density across schemes', () => {
    const view = renderDesign(<Button>Focus target</Button>);
    const button = screen.getByRole('button', { name: 'Focus target' });
    button.focus();
    expect(button).toHaveFocus();
    expect(button.className).toContain('MuiButton');
    expect(view.container.querySelector('[data-ratan-scope="standalone"]')).toHaveAttribute(
      'data-ratan-density',
      'compact',
    );
    view.rerender(
      <DesignSystemProvider
        appearance={{ scheme: 'light', density: 'comfortable', direction: 'ltr' }}
        scope="standalone"
      >
        <Button>Focus target</Button>
      </DesignSystemProvider>,
    );
    expect(view.container.querySelector('[data-ratan-scope="standalone"]')).toHaveAttribute(
      'data-ratan-theme',
      'light',
    );
  });
});
