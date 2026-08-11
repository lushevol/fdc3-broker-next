import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { assertNoAxeViolations } from '@fm/ratan-design-vitest';

import parityManifest from '../../../manifests/parity-manifest.json';
import {
  TEXT_INPUT_BORDER_TYPES,
  TEXT_INPUT_LABEL_ALIGNMENTS,
  TEXT_INPUT_LABEL_POSITIONS,
  TEXT_INPUT_PLACEMENTS,
  TEXT_INPUT_SIZES,
  TextInput,
} from '../src/text-input';

describe('TextInput parity contract', () => {
  it('uses frozen defaults and forwards the native input ref', () => {
    const ref = createRef<HTMLInputElement | HTMLTextAreaElement>();
    render(<TextInput ref={ref} label="Account" />);

    const input = screen.getByRole('textbox', { name: 'Account' });
    expect(ref.current).toBe(input);
    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('placeholder')).toBe('Input here');
    expect(input.dataset.borderType).toBe('box');
    expect(input.dataset.size).toBe('md');
    expect(input.dataset.textAlign).toBe('left');
    const field = input.closest<HTMLElement>('[data-ratan-component="TextInput"]');
    expect(field?.dataset.labelPosition).toBe('top');
    expect(field?.dataset.labelAlignment).toBe('left');
    expect(field?.dataset.tooltipPlacement).toBe('top');
    expect(field?.dataset.hintPlacement).toBe('right');
  });

  it('supports uncontrolled and controlled value changes without mutating controlled state', () => {
    const onValueChange = vi.fn();
    const onBubbleInput = vi.fn();
    const { rerender } = render(
      <TextInput
        aria-label="Name"
        defaultValue="A"
        onValueChange={onValueChange}
        onBubbleInput={onBubbleInput}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;

    fireEvent.input(input, { target: { value: 'Ada' } });
    expect(input.value).toBe('Ada');
    expect(onValueChange).toHaveBeenLastCalledWith('Ada', expect.any(Object));
    expect(onBubbleInput).toHaveBeenLastCalledWith('Ada', expect.any(Object));

    rerender(
      <TextInput
        aria-label="Name"
        value="Controlled"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.input(input, { target: { value: 'Attempted' } });
    expect(onValueChange).toHaveBeenLastCalledWith('Attempted', expect.any(Object));
    expect(input.value).toBe('Controlled');
  });

  it('renders multiline controls and clamps character count to maxLength', () => {
    render(
      <TextInput
        label="Notes"
        multiline
        resizable="auto"
        rows={3}
        value="123456"
        maxLength={4}
        showCharacterCount
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Notes' });
    expect(input.tagName).toBe('TEXTAREA');
    expect(input).toHaveValue('1234');
    expect(input.dataset.resizable).toBe('auto');
    expect(screen.getByText('4 / 4')).toBeInTheDocument();
  });

  it('preserves native form, validation, disabled, and readonly attributes', () => {
    render(
      <TextInput
        label="Code"
        name="code"
        required
        disabled
        readOnly
        autoComplete="off"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Code' }) as HTMLInputElement;
    expect(input.name).toBe('code');
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.autocomplete).toBe('off');
  });

  it('submits successful controls and excludes disabled controls', () => {
    const { container } = render(
      <form>
        <TextInput aria-label="Enabled" name="enabled" defaultValue="yes" />
        <TextInput aria-label="Disabled" name="disabled" defaultValue="no" disabled />
        <TextInput aria-label="Read only" name="readonly" defaultValue="kept" readOnly />
      </form>,
    );

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    const data = new FormData(form!);
    expect([...data.entries()]).toEqual([
      ['enabled', 'yes'],
      ['readonly', 'kept'],
    ]);
  });

  it('restores uncontrolled defaults on native reset without mutating controlled state', async () => {
    const { container } = render(
      <form>
        <TextInput aria-label="Uncontrolled" defaultValue="initial" />
        <TextInput aria-label="Controlled" value="owned" onValueChange={vi.fn()} />
        <button type="reset">Reset</button>
      </form>,
    );
    const uncontrolled = screen.getByRole('textbox', {
      name: 'Uncontrolled',
    }) as HTMLInputElement;
    const controlled = screen.getByRole('textbox', {
      name: 'Controlled',
    }) as HTMLInputElement;

    fireEvent.input(uncontrolled, { target: { value: 'changed' } });
    expect(uncontrolled).toHaveValue('changed');
    fireEvent.reset(container.querySelector('form')!);

    await waitFor(() => expect(uncontrolled).toHaveValue('initial'));
    expect(controlled).toHaveValue('owned');
  });

  it('uses native required validation and accessible error relationships', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <TextInput
        label="Required code"
        name="code"
        required
        error
        errorMessage="Code is required"
      />,
    );
    const input = screen.getByRole('textbox', {
      name: /Required code/,
    }) as HTMLInputElement;

    expect(input.checkValidity()).toBe(false);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-errormessage')).toContain('error');
    await user.type(input, 'ABC');
    expect(input.checkValidity()).toBe(false);
    rerender(<TextInput label="Required code" name="code" required />);
    expect(input.checkValidity()).toBe(true);
  });

  it('clears uncontrolled input, reports the clear event, and restores focus', () => {
    const onClear = vi.fn();
    render(
      <TextInput label="Search" defaultValue="query" clearable onClear={onClear} />,
    );
    const input = screen.getByRole('textbox', { name: 'Search' }) as HTMLInputElement;

    fireEvent.click(screen.getByRole('button', { name: 'Clear Search' }));
    expect(input.value).toBe('');
    expect(onClear).toHaveBeenCalledOnce();
    expect(input).toHaveFocus();
  });

  it('composes labels, messages, adornments, and unique accessibility relationships', () => {
    const { container } = render(
      <>
        <TextInput
          label="Amount"
          required
          prefix={<span>$</span>}
          suffix={<span>USD</span>}
          help="Enter a whole number"
          error
          errorContent="Invalid amount"
        />
        <TextInput label="Reference" helpText="Optional" />
      </>,
    );

    const amount = screen.getByRole('textbox', { name: /Amount/ });
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(amount.getAttribute('aria-invalid')).toBe('true');
    expect(amount.getAttribute('aria-describedby')).toContain('help');
    expect(amount.getAttribute('aria-errormessage')).toContain('error');
    const field = amount.closest<HTMLElement>('[data-ratan-component="TextInput"]');
    expect(field?.dataset.invalid).toBe('true');

    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('preserves the complete frozen variant sets and default state contract', () => {
    const contract = parityManifest.components.find(
      (component) => component.legacy.tag === 'sc-text-input',
    )?.contract;

    expect(contract).toBeDefined();
    expect(contract?.variants).toEqual([...TEXT_INPUT_BORDER_TYPES]);
    expect(contract?.sizes).toEqual([...TEXT_INPUT_SIZES]);
    expect(TEXT_INPUT_LABEL_POSITIONS).toEqual([
      'top',
      'top-right',
      'right',
      'bottom',
      'left',
    ]);
    expect(TEXT_INPUT_LABEL_ALIGNMENTS).toEqual(['left', 'right']);
    expect(TEXT_INPUT_PLACEMENTS).toEqual(['top', 'left', 'right', 'bottom']);
    expect(contract?.defaults).toMatchObject({
      type: 'text',
      value: '',
      borderType: 'box',
      size: 'md',
      labelPosition: 'top',
      labelAlignment: 'left',
      textAlign: 'left',
      tooltipPlacement: 'top',
      hintPlacement: 'right',
      labelSize: 'md',
      placeholder: 'Input here',
      readOnlyRows: 5,
    });
  });

  it('exposes exact stable states and passes automated accessibility checks', async () => {
    const { container } = render(
      <>
        <TextInput label="Error" error errorMessage="Invalid" />
        <TextInput label="Success" success successMessage="Saved" />
        <TextInput label="Disabled" disabled />
        <TextInput label="Read only" readOnly defaultValue="Fixed" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Error' }).closest('[data-ratan-component]')).toHaveAttribute('data-error', 'true');
    expect(screen.getByRole('textbox', { name: 'Success' }).closest('[data-ratan-component]')).toHaveAttribute('data-success', 'true');
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Read only' })).toHaveAttribute('readonly');
    await expect(assertNoAxeViolations({ context: container })).resolves.toBeDefined();
  });
});
