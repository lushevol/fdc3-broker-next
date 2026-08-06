import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { assertNoAxeViolations } from '@fm/ratan-design-vitest';

import parityManifest from '../../../manifests/parity-manifest.json';
import { Dialog } from '../src/dialog';

describe('Dialog parity contract', () => {
  it('uses the frozen closed default', () => {
    render(<Dialog label="Details">Content</Dialog>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const contract = parityManifest.components.find(
      (component) => component.legacy.tag === 'sc-dialog',
    )?.contract;
    expect(contract?.defaults).toEqual({ label: "''", open: 'false' });
  });

  it('portals named content and footer to document.body and forwards the dialog ref', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Dialog ref={ref} open label="Account details" footer={<button>Done</button>}>
        Dialog content
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Account details' });
    expect(ref.current).toBe(dialog);
    expect(container).toHaveAttribute('aria-hidden', 'true');
    expect(dialog).toHaveTextContent('Dialog content');
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    expect(container).not.toContainElement(dialog);
    expect(document.body).toContainElement(dialog);
  });

  it('dismisses uncontrolled state with Escape and reports the reason', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onHide = vi.fn();
    render(
      <Dialog
        defaultOpen
        label="Dismiss me"
        onOpenChange={onOpenChange}
        onHide={onHide}
      >
        Content
      </Dialog>,
    );

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'dismiss' });
    expect(onHide).toHaveBeenLastCalledWith({ open: false, reason: 'dismiss' });
  });

  it('reports controlled dismissal intent without mutating controlled state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Dialog open label="Controlled" onOpenChange={onOpenChange}>
        Content
      </Dialog>,
    );

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: 'dismiss' });
    expect(screen.getByRole('dialog', { name: 'Controlled' })).toBeInTheDocument();

    rerender(
      <Dialog open={false} label="Controlled" onOpenChange={onOpenChange}>
        Content
      </Dialog>,
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('reports close-button dismissal and restores focus to the logical trigger', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open dialog</button>
          <Dialog
            open={open}
            label="Focusable"
            onOpenChange={(nextOpen, detail) => {
              onOpenChange(nextOpen, detail);
              setOpen(nextOpen);
            }}
          >
            <input aria-label="First field" />
          </Dialog>
        </>
      );
    }
    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    expect(await screen.findByRole('dialog', { name: 'Focusable' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false, {
      reason: 'close-button',
    });
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('supports nested overlays and removes owned nodes on unmount', async () => {
    const user = userEvent.setup();
    function NestedHarness() {
      const [innerOpen, setInnerOpen] = useState(false);
      return (
        <Dialog open label="Outer">
          <button onClick={() => setInnerOpen(true)}>Open inner</button>
          <Dialog open={innerOpen} label="Inner">
            Nested
          </Dialog>
        </Dialog>
      );
    }
    const { unmount } = render(
      <NestedHarness />,
    );

    await user.click(screen.getByRole('button', { name: 'Open inner' }));
    expect(screen.getByRole('dialog', { name: 'Inner' })).toBeInTheDocument();
    expect(screen.getAllByRole('dialog', { hidden: true })).toHaveLength(2);
    expect(document.querySelectorAll('[data-ratan-component="DialogOverlay"]')).toHaveLength(2);
    unmount();
    expect(document.querySelectorAll('[data-ratan-component="DialogOverlay"]')).toHaveLength(0);
  });

  it('passes automated accessibility checks', async () => {
    render(
      <Dialog open label="Accessible dialog" footer={<button>Save</button>}>
        <p>Review the details.</p>
      </Dialog>,
    );

    const overlay = screen
      .getByRole('dialog', { name: 'Accessible dialog' })
      .closest<HTMLElement>('[data-ratan-component="DialogOverlay"]');
    expect(overlay).not.toBeNull();
    await expect(
      assertNoAxeViolations({ context: overlay! }),
    ).resolves.toBeDefined();
  });
});
