import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  defineScDialog,
  DesignSystemProvider,
  Dialog,
  ScDialog,
} from '../src';

describe('WebKit Dialog adapter', () => {
  it('renders the promoted sc-dialog element with the established contract', () => {
    const onClose = vi.fn();
    const { container } = render(
      <DesignSystemProvider
        appearance={{ scheme: 'light', density: 'compact', direction: 'ltr' }}
        scope="host"
      >
        <Dialog
          open
          title="New tile"
          description="Choose an application."
          actions={<button type="button">Confirm</button>}
          width="large"
          onClose={onClose}
        >
          <span>Application catalog</span>
        </Dialog>
      </DesignSystemProvider>,
    );

    const element = container.querySelector('sc-dialog');

    expect(customElements.get('sc-dialog')).toBeDefined();
    expect(element).toHaveAttribute('data-ratan-component', 'dialog');
    expect(element).toHaveAttribute('data-ratan-width', 'large');
    expect(element).toHaveProperty('label', 'New tile');
    expect(element).toHaveProperty('open', true);
    expect(screen.getByText('Choose an application.')).toBeInTheDocument();
    expect(screen.getByText('Application catalog')).toBeInTheDocument();
    expect(element?.querySelector('[slot="footer"]')).toContainElement(
      screen.getByRole('button', { name: 'Confirm' }),
    );

    fireEvent(element as Element, new CustomEvent('sc-hide'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('updates the outer component when its scoped dialog requests close', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open title="New tile" onClose={onClose}>
        Application catalog
      </Dialog>,
    );

    const element = container.querySelector('sc-dialog') as ScDialog;
    await element.updateComplete;
    const scopedDialog = element.shadowRoot?.querySelector('sl-dialog');

    fireEvent(
      scopedDialog as Element,
      new CustomEvent('sl-request-close', {
        bubbles: true,
        composed: true,
        detail: { source: 'close-button' },
      }),
    );
    expect(onClose).toHaveBeenCalledOnce();
    await element.updateComplete;

    expect(element).toHaveProperty('open', false);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes from the scoped close-button even when its click is not composed', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open title="New tile" onClose={onClose}>
        Application catalog
      </Dialog>,
    );
    const element = container.querySelector('sc-dialog') as ScDialog;
    await element.updateComplete;
    const scopedDialog = element.shadowRoot?.querySelector('sl-dialog') as
      | (Element & { updateComplete?: Promise<unknown> })
      | null;
    await scopedDialog?.updateComplete;
    await Promise.resolve();
    const closeTrigger = scopedDialog?.shadowRoot?.querySelector(
      '[part~="close-button"]',
    );

    fireEvent(
      closeTrigger as Element,
      new MouseEvent('click', { bubbles: true, composed: false }),
    );

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes a dismissible dialog with Escape', () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="New tile" onClose={onClose}>
        Application catalog
      </Dialog>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('provides a host-owned accessible close action', () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="New tile" onClose={onClose}>
        Application catalog
      </Dialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close New tile' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('retains the established modal for a non-dismissible dialog', () => {
    const { container } = render(
      <DesignSystemProvider
        appearance={{ scheme: 'dark', density: 'comfortable', direction: 'rtl' }}
      >
        <Dialog
          open
          title="Locked task"
          dismissible={false}
          onClose={vi.fn()}
        >
          Cannot close yet
        </Dialog>
      </DesignSystemProvider>,
    );

    expect(container.querySelector('sc-dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Locked task' })).toBeInTheDocument();
  });

  it('supports a minimal dismissible dialog without optional content', () => {
    const { container } = render(
      <DesignSystemProvider
        appearance={{ scheme: 'light', density: 'compact', direction: 'ltr' }}
      >
        <Dialog open title="Minimal task" onClose={vi.fn()}>
          Required content
        </Dialog>
      </DesignSystemProvider>,
    );

    const element = container.querySelector('sc-dialog');
    expect(element).toHaveProperty('label', 'Minimal task');
    expect(element?.querySelector('[slot="footer"]')).toBeNull();
    expect(screen.getByText('Required content')).toBeInTheDocument();
  });

  it('removes a closed dismissible dialog from the light DOM', () => {
    const { container } = render(
      <DesignSystemProvider
        appearance={{ scheme: 'light', density: 'compact', direction: 'ltr' }}
      >
        <Dialog open={false} title="Closed task" onClose={vi.fn()}>
          Hidden content
        </Dialog>
      </DesignSystemProvider>,
    );

    expect(container.querySelector('sc-dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('registers safely across independent application reloads', () => {
    const define = vi.fn();
    const registry = {
      define,
      get: vi.fn(() => undefined),
    } as unknown as CustomElementRegistry;

    defineScDialog(registry);
    defineScDialog(null);
    defineScDialog(customElements);

    expect(define).toHaveBeenCalledWith('sc-dialog', ScDialog);
    expect(customElements.get('sc-dialog')).toBe(ScDialog);
  });
});
