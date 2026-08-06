import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { assertNoAxeViolations } from '@fm/ratan-design-vitest';

import parityManifest from '../../../manifests/parity-manifest.json';
import { DatePicker } from '../src/date-picker';

describe('DatePicker proof contract', () => {
  it('renders an ISO date through locale-aware segments and forwards its root ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <DatePicker
        ref={ref}
        label="Settlement date"
        value="2026-08-06"
        locale="en-GB"
      />,
    );

    const group = screen.getByRole('group', { name: 'Settlement date' });
    expect(ref.current).toContainElement(group);
    const segments = within(group).getAllByRole('spinbutton');
    expect(segments.map((segment) => segment.getAttribute('data-type'))).toEqual([
      'day',
      'month',
      'year',
    ]);
    expect(segments.map((segment) => segment.textContent)).toEqual(['06', '08', '2026']);
    expect(segments.every((segment) => segment.getAttribute('aria-labelledby'))).toBe(true);
  });

  it('uses React Aria keyboard editing and reports an ISO controlled change', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DatePicker
        label="Trade date"
        value="2026-08-06"
        locale="en-US"
        onValueChange={onValueChange}
      />,
    );

    const month = screen.getByRole('spinbutton', { name: /month.*Trade date/i });
    await user.click(month);
    await user.keyboard('{ArrowUp}');
    expect(onValueChange).toHaveBeenLastCalledWith('2026-09-06');
  });

  it('participates in native forms and resets uncontrolled state', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <DatePicker
          label="Value date"
          name="valueDate"
          defaultValue="2026-08-06"
          locale="en-US"
          required
        />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector('form')!;
    expect(new FormData(form).get('valueDate')).toBe('2026-08-06');

    const month = screen.getByRole('spinbutton', { name: /month.*Value date/i });
    await user.click(month);
    await user.keyboard('{ArrowUp}');
    expect(new FormData(form).get('valueDate')).toBe('2026-09-06');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    await waitFor(() =>
      expect(new FormData(form).get('valueDate')).toBe('2026-08-06'),
    );
  });

  it('opens a body-portalled calendar and honors document RTL', async () => {
    const user = userEvent.setup();
    const previousDirection = document.body.dir;
    document.body.dir = 'rtl';
    try {
      const { container } = render(
        <DatePicker label="Calendar date" defaultValue="2026-08-06" locale="ar-AE" />,
      );
      await user.click(screen.getByRole('button', { name: /calendar/i }));

      const dialog = await screen.findByRole('dialog');
      expect(container).not.toContainElement(dialog);
      expect(document.body).toContainElement(dialog);
      expect(dialog.closest('[dir="rtl"]') ?? document.body).toHaveAttribute('dir', 'rtl');
    } finally {
      document.body.dir = previousDirection;
    }
  });

  it('exposes validation state and rejects invalid ISO input', () => {
    const { rerender } = render(
      <DatePicker
        label="Required date"
        required
        invalid
        errorMessage="Choose a date"
      />,
    );
    const root = screen
      .getByRole('group', { name: 'Required date' })
      .closest('[data-ratan-component="DatePicker"]');
    expect(root).toHaveAttribute('data-invalid', 'true');
    expect(screen.getByText('Choose a date')).toBeInTheDocument();

    expect(() =>
      rerender(<DatePicker label="Invalid date" value="2026-99-99" />),
    ).toThrow(/ISO calendar date/);
  });

  it('maps the complete frozen date-picker cohort to one public subpath', () => {
    const entries = parityManifest.components.filter(
      (component) => component.react?.subpath === './date-picker',
    );
    const included = entries
      .filter((component) => component.classification === 'included')
      .map((component) => component.legacy.tag);

    expect(included).toEqual([
      'sc-date-input',
      'sc-date-picker',
      'sc-date-range-input',
      'sc-date-range-picker',
    ]);
    expect(entries.every((component) => component.react?.subpath === './date-picker')).toBe(true);
  });

  it('passes automated accessibility checks for the field and calendar', async () => {
    const user = userEvent.setup();
    render(<DatePicker label="Accessible date" defaultValue="2026-08-06" />);
    const root = screen
      .getByRole('group', { name: 'Accessible date' })
      .closest<HTMLElement>('[data-ratan-component="DatePicker"]');
    expect(root).not.toBeNull();
    await expect(assertNoAxeViolations({ context: root! })).resolves.toBeDefined();

    await user.click(screen.getByRole('button', { name: /calendar/i }));
    const dialog = await screen.findByRole('dialog');
    await expect(assertNoAxeViolations({ context: dialog })).resolves.toBeDefined();
  });
});
