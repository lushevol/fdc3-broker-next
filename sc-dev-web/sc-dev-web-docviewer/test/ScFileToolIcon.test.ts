import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';

import type { ScFileToolIcon } from '../src/components/ScFileToolIcon.js';
// eslint-disable-next-line no-duplicate-imports
import '../src/components/ScFileToolIcon.js';

describe('sc-file-tool-icon', () => {
  it('renders icon and slot variants, and reflects active/disabled state', async () => {
    const withIcon = await fixture<ScFileToolIcon>(html`
      <sc-file-tool-icon label="Download" icon="download"></sc-file-tool-icon>
    `);
    await withIcon.updateComplete;

    expect(withIcon.shadowRoot?.querySelector('sc-icon[name="download"]')).to.exist;
    expect(withIcon.shadowRoot?.querySelector('sc-tooltip')).to.exist;

    withIcon.active = true;
    withIcon.disabled = true;
    await withIcon.updateComplete;
    expect(withIcon.hasAttribute('active')).to.equal(true);
    expect(withIcon.hasAttribute('disabled')).to.equal(true);

    const withSlot = await fixture<ScFileToolIcon>(html`
      <sc-file-tool-icon label="Custom">X</sc-file-tool-icon>
    `);
    await withSlot.updateComplete;

    expect(withSlot.shadowRoot?.querySelector('slot')).to.exist;
    expect(withSlot.shadowRoot?.querySelector('sc-icon')).to.equal(null);
  });

  it('stops tooltip click propagation on the host tooltip element', async () => {
    const withIcon = await fixture<ScFileToolIcon>(html`
      <sc-file-tool-icon label="Download" icon="download"></sc-file-tool-icon>
    `);
    await withIcon.updateComplete;

    const tooltip = withIcon.shadowRoot?.querySelector('sc-tooltip') as HTMLElement;
    const stopSpy = jest.fn();
    const event = new Event('click', { bubbles: true, composed: true, cancelable: true });
    Object.defineProperty(event, 'stopImmediatePropagation', {
      value: stopSpy,
      configurable: true,
    });

    tooltip.dispatchEvent(event);

    expect(stopSpy.mock.calls.length).to.be.greaterThan(0);
  });
});