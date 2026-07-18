import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from '../src/components/NumberField';
import { DesignSystemProvider, type DesignAppearance } from '../src/provider';

const appearance: DesignAppearance = { scheme: 'dark', density: 'compact', direction: 'ltr' };

function renderDesign(children: React.ReactNode) {
  return render(
    <DesignSystemProvider appearance={appearance} scope="standalone">
      {children}
    </DesignSystemProvider>,
  );
}

describe('NumberField', () => {
  it('emits controlled numbers and null when cleared', () => {
    const onChange = vi.fn();
    renderDesign(<NumberField id="limit" label="Limit" value={12} onChange={onChange} />);

    const input = screen.getByRole('spinbutton', { name: 'Limit' });
    expect(input).toHaveValue(12);
    fireEvent.change(input, { target: { value: '27.5' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenNthCalledWith(1, 27.5);
    expect(onChange).toHaveBeenNthCalledWith(2, null);
    expect(input).toHaveAttribute('data-ratan-control', 'number-field');
  });

  it('exposes native constraints and controlled states', () => {
    renderDesign(
      <NumberField
        id="bounded-limit"
        label="Bounded limit"
        value={null}
        onChange={vi.fn()}
        min={0}
        max={100}
        step={0.5}
        required
        disabled
      />,
    );

    const input = screen.getByRole('spinbutton', { name: /Bounded limit/ });
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '0.5');
  });

  it('associates helper and error text and exposes invalid state', () => {
    const view = renderDesign(
      <NumberField
        id="validated-limit"
        label="Validated limit"
        value={null}
        onChange={vi.fn()}
        helperText="Enter a positive amount"
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Validated limit' });
    const helper = screen.getByText('Enter a positive amount');
    expect(input).toHaveAttribute('aria-describedby', helper.id);
    expect(input).not.toHaveAttribute('aria-invalid', 'true');

    view.rerender(
      <DesignSystemProvider appearance={appearance} scope="standalone">
        <NumberField
          id="validated-limit"
          label="Validated limit"
          value={null}
          onChange={vi.fn()}
          helperText="A limit is required"
          error
        />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('spinbutton', { name: 'Validated limit' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByText('A limit is required')).toBeInTheDocument();
  });

  it('accepts focus without owning validation or form state', () => {
    renderDesign(<NumberField id="focus-limit" label="Focus limit" value={4} onChange={vi.fn()} />);
    const input = screen.getByRole('spinbutton', { name: 'Focus limit' });
    input.focus();
    expect(input).toHaveFocus();
  });
});
