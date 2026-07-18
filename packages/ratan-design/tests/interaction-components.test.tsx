import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../src/components/Button';
import { ConfirmationDialog } from '../src/components/ConfirmationDialog';
import { Dialog } from '../src/components/Dialog';
import { InlineAlert } from '../src/components/InlineAlert';
import { NumberField } from '../src/components/NumberField';
import { DesignSystemProvider, type DesignAppearance } from '../src/provider';

const appearance: DesignAppearance = {
  scheme: 'dark',
  density: 'compact',
  direction: 'ltr',
};

afterEach(cleanup);

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
    renderDesign(
      <NumberField id="limit" label="Limit" value={12} onChange={onChange} />,
    );

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
    expect(
      screen.getByRole('spinbutton', { name: 'Validated limit' }),
    ).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('A limit is required')).toBeInTheDocument();
  });

  it('accepts focus without owning validation or form state', () => {
    renderDesign(
      <NumberField
        id="focus-limit"
        label="Focus limit"
        value={4}
        onChange={vi.fn()}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Focus limit' });
    input.focus();
    expect(input).toHaveFocus();
  });
});

describe('Dialog', () => {
  it('names and describes modal content with bounded actions and width', () => {
    renderDesign(
      <Dialog
        open
        title="Edit limit"
        description="Update the selected profile limit."
        width="medium"
        onClose={vi.fn()}
        actions={<Button>Save</Button>}
      >
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Edit limit' });
    expect(dialog).toHaveAccessibleDescription(
      'Update the selected profile limit.',
    );
    expect(dialog).toHaveAttribute('data-ratan-width', 'medium');
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('supports the three documented widths', () => {
    const view = renderDesign(
      <Dialog open title="Width" width="small" onClose={vi.fn()}>
        Content
      </Dialog>,
    );
    expect(screen.getByRole('dialog', { name: 'Width' })).toHaveAttribute(
      'data-ratan-width',
      'small',
    );
    view.rerender(
      <DesignSystemProvider appearance={appearance} scope="standalone">
        <Dialog open title="Width" width="large" onClose={vi.fn()}>
          Content
        </Dialog>
      </DesignSystemProvider>,
    );
    expect(screen.getByRole('dialog', { name: 'Width' })).toHaveAttribute(
      'data-ratan-width',
      'large',
    );
  });

  it('closes from its close button, Escape, and backdrop when dismissible', () => {
    const onClose = vi.fn();
    renderDesign(
      <Dialog open title="Dismissible" onClose={onClose}>
        Content
      </Dialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close Dismissible' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Dismissible' }), {
      key: 'Escape',
    });
    expect(onClose).toHaveBeenCalledTimes(2);
    const dialogRoot = document.querySelector('.MuiDialog-root');
    const dialogContainer = document.querySelector('.MuiDialog-container');
    expect(dialogRoot).not.toBeNull();
    expect(dialogContainer).not.toBeNull();
    fireEvent.mouseDown(dialogContainer!);
    fireEvent.click(dialogRoot!);

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('blocks close button, Escape, and backdrop dismissal when non-dismissible', () => {
    const onClose = vi.fn();
    renderDesign(
      <Dialog
        open
        title="Pending"
        onClose={onClose}
        dismissible={false}
        actions={<Button>Wait</Button>}
      >
        Content
      </Dialog>,
    );

    expect(
      screen.queryByRole('button', { name: 'Close Pending' }),
    ).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Pending' }), {
      key: 'Escape',
    });
    const dialogRoot = document.querySelector('.MuiDialog-root');
    const dialogContainer = document.querySelector('.MuiDialog-container');
    fireEvent.mouseDown(dialogContainer!);
    fireEvent.click(dialogRoot!);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Wait' })).toBeInTheDocument();
  });

  it('restores focus to the invoking control after close', async () => {
    function FocusFixture() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open editor</Button>
          <Dialog open={open} title="Editor" onClose={() => setOpen(false)}>
            Content
          </Dialog>
        </>
      );
    }
    renderDesign(<FocusFixture />);
    const trigger = screen.getByRole('button', { name: 'Open editor' });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Editor' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close Editor' }));
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});

describe('ConfirmationDialog', () => {
  it.each(['default', 'danger'] as const)(
    'runs %s confirmation and cancellation callbacks',
    (tone) => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();
      renderDesign(
        <ConfirmationDialog
          open
          title="Confirm action"
          message="This change is application-owned."
          confirmLabel="Apply"
          tone={tone}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />,
      );
      const confirm = screen.getByRole('button', { name: 'Apply' });
      expect(confirm).toHaveAttribute(
        'data-ratan-variant',
        tone === 'danger' ? 'danger' : 'primary',
      );
      fireEvent.click(confirm);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onCancel).toHaveBeenCalledTimes(1);
    },
  );

  it('prevents repeat confirmation and all dismissal while loading', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    renderDesign(
      <ConfirmationDialog
        open
        title="Delete limit"
        message="Delete this record?"
        confirmLabel="Delete"
        loading
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    const progress = screen.getByRole('button', { name: 'Delete in progress' });
    expect(progress).toBeDisabled();
    expect(progress).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Close Delete limit' }),
    ).not.toBeInTheDocument();
    fireEvent.click(progress);
    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Delete limit' }), {
      key: 'Escape',
    });
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('supports application-owned disabled confirmation', () => {
    const onConfirm = vi.fn();
    renderDesign(
      <ConfirmationDialog
        open
        title="Approve"
        message="Approve this record?"
        confirmLabel="Approve"
        confirmDisabled
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );
    const confirm = screen.getByRole('button', { name: 'Approve' });
    expect(confirm).toBeDisabled();
    fireEvent.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('InlineAlert', () => {
  it.each([
    ['info', 'status'],
    ['success', 'status'],
    ['warning', 'status'],
    ['error', 'alert'],
  ] as const)(
    'renders %s feedback with the appropriate live-region role',
    (tone, role) => {
      renderDesign(<InlineAlert tone={tone} message={`${tone} feedback`} />);
      const alert = screen.getByRole(role);
      expect(alert).toHaveTextContent(`${tone} feedback`);
      expect(alert).toHaveAttribute('data-ratan-tone', tone);
    },
  );

  it('renders structured content and invokes one labeled action', () => {
    const onAction = vi.fn();
    renderDesign(
      <InlineAlert
        tone="error"
        title="Unable to load"
        message="The repository did not respond."
        actionLabel="Retry"
        onAction={onAction}
      />,
    );
    expect(screen.getByRole('alert')).toHaveAccessibleName('Unable to load');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('keeps independent application feedback isolated', () => {
    renderDesign(
      <>
        <section aria-label="Application one">
          <InlineAlert tone="info" message="First" />
        </section>
        <section aria-label="Application two">
          <InlineAlert tone="success" message="Second" />
        </section>
      </>,
    );
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });
});
