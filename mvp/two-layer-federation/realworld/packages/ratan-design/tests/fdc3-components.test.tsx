import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { parseDate } from '@internationalized/date';
import { DatePicker, DesignSystemProvider, Select, TextArea } from '../src';

const appearance = { scheme: 'dark', density: 'comfortable', direction: 'ltr' } as const;

function SelectHarness() {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <Select
      id="application"
      label="Application"
      selectedId={selected}
      onChange={setSelected}
      options={[
        { id: 'cashflow', label: 'Cashflow' },
        { id: 'profile', label: 'Identity & Profile' },
      ]}
    />
  );
}

describe('FDC3 design-system controls', () => {
  it('selects an application with listbox keyboard semantics', async () => {
    const user = userEvent.setup();
    render(<DesignSystemProvider appearance={appearance}><SelectHarness /></DesignSystemProvider>);
    await user.click(screen.getByRole('button', { name: /Application/ }));
    expect(screen.getByRole('listbox')).toBeVisible();
    await user.click(screen.getByRole('option', { name: 'Identity & Profile' }));
    expect(screen.getByRole('button', { name: /Identity & Profile/ })).toBeInTheDocument();
  });

  it('associates multiline JSON guidance and validation with its field', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <TextArea
          id="interop-json"
          label="Interop JSON"
          value="{"
          onChange={vi.fn()}
          helperText="JSON must describe intents."
          error
          required
        />
      </DesignSystemProvider>,
    );
    const input = screen.getByRole('textbox', { name: 'Interop JSON' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('JSON must describe intents.')).toBeInTheDocument();
  });

  it('supports optional guidance and disabled select state', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <Select
          id="disabled-application"
          label="Disabled application"
          options={[]}
          selectedId="missing"
          onChange={vi.fn()}
          helperText="No applications are available."
          disabled
        />
        <TextArea
          id="guided-json"
          label="Guided JSON"
          value="{}"
          onChange={vi.fn()}
          helperText="Use a JSON object."
          disabled
          readOnly
        />
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('button', { name: /Disabled application/ })).toBeDisabled();
    expect(screen.getByText('No applications are available.')).toBeInTheDocument();
    expect(screen.getByText('Use a JSON object.')).toBeInTheDocument();
  });

  it('provides a locale-aware date field and calendar trigger', async () => {
    const user = userEvent.setup();
    render(
      <DesignSystemProvider appearance={appearance}>
        <DatePicker id="effective-date" label="Effective date" value={parseDate('2026-07-27')} onChange={vi.fn()} helperText="Choose an effective business date." />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('Choose an effective business date.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Open Effective date calendar/ }));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('supports disabled and invalid date-field states', () => {
    render(
      <DesignSystemProvider appearance={appearance}>
        <DatePicker id="invalid-date" label="Invalid date" value={null} onChange={vi.fn()} helperText="A date is required." error required disabled />
      </DesignSystemProvider>,
    );
    expect(screen.getByText('A date is required.')).toHaveClass('ratan-field-error');
    expect(screen.getByRole('button', { name: /Open Invalid date calendar/ })).toBeDisabled();
  });
});
