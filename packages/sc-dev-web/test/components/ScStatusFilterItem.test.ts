import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import { ScStatusFilterItem } from '../../src/components/ScStatusFilter/ScStatusFilterItem.js';
import '../../elements/sc-status-filter-item.js';

describe('ScStatusFilterItem', () => {
  it('renders with default values', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item></sc-status-filter-item>`
    );
    expect(el.type).to.equal('information');
    expect(el.size).to.equal('md');
    expect(el.selected).to.equal(false);
    expect(el.disabled).to.equal(false);
    expect(el.count).to.equal(null);
  });

  it('renders all types', async () => {
    const types = [
      'locked',
      'on-hold',
      'archived',
      'draft',
      'missing',
      'information',
      'in-progress',
      'complete',
      'error',
      'rejected',
      'warning',
      'pending',
      'success',
      'minor-error',
      'critical',
    ] as const;

    for (const type of types) {
      const el = await fixture<ScStatusFilterItem>(
        html`<sc-status-filter-item type="${type}"></sc-status-filter-item>`
      );
      expect(el.type).to.equal(type);
    }
  });

  it('renders all sizes', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    for (const size of sizes) {
      const el = await fixture<ScStatusFilterItem>(
        html`<sc-status-filter-item size="${size}"></sc-status-filter-item>`
      );
      expect(el.size).to.equal(size);
    }
  });

  it('renders label and count', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item
        label="Test Label"
        count="99"
      ></sc-status-filter-item>`
    );
    expect(el.label).to.equal('Test Label');
    expect(el.count).to.equal(99);

    const labelNode = el.shadowRoot?.querySelector('.label');
    const countNode = el.shadowRoot?.querySelector('.count');

    expect(labelNode?.textContent).to.equal('Test Label');
    expect(countNode?.textContent).to.equal('99');
  });

  it('renders selected state', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item selected></sc-status-filter-item>`
    );
    expect(el.selected).to.equal(true);
    const wrapper = el.shadowRoot?.querySelector('div');
    expect(wrapper?.classList.contains('selected')).to.be.true;
    expect(wrapper?.getAttribute('aria-pressed')).to.equal('true');
  });

  it('renders disabled state', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item disabled></sc-status-filter-item>`
    );
    expect(el.disabled).to.equal(true);
    const wrapper = el.shadowRoot?.querySelector('div');
    expect(wrapper?.classList.contains('disabled')).to.be.true;
    expect(wrapper?.getAttribute('tabindex')).to.equal('-1');
  });

  it('handles click event toggling selected state', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item value="test-val"></sc-status-filter-item>`
    );

    const wrapper = el.shadowRoot!.querySelector('.item') as HTMLElement;

    const listener = oneEvent(el, 'sc-select');

    wrapper.click();

    const ev = await listener;

    expect(el.selected).to.be.true;
    expect(ev.detail.selected).to.be.true;
    expect(ev.detail.value).to.equal('test-val');
  });

  it('does not fire click event when disabled', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item disabled></sc-status-filter-item>`
    );

    let fired = false;
    el.addEventListener('sc-filter-item-click', () => {
      fired = true;
    });

    // Attempt to click inner element
    const wrapper = el.shadowRoot!.querySelector('.item') as HTMLElement;
    wrapper.click();

    await el.updateComplete;

    expect(fired).to.be.false;
    expect(el.selected).to.be.false;
  });

  it('handles keyboard Enter key', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item></sc-status-filter-item>`
    );

    const wrapper = el.shadowRoot!.querySelector('.item') as HTMLElement;

    const listener = oneEvent(el, 'sc-select');

    // Dispatch keydown on inner element
    wrapper.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    const ev = await listener;
    expect(el.selected).to.be.true;
  });

  it('handles keyboard Space key', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item></sc-status-filter-item>`
    );

    const wrapper = el.shadowRoot!.querySelector('.item') as HTMLElement;

    const listener = oneEvent(el, 'sc-select');

    wrapper.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    const ev = await listener;
    expect(el.selected).to.be.true;
  });

  it('ignores other keys', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item></sc-status-filter-item>`
    );

    let fired = false;
    el.addEventListener('sc-filter-item-click', () => {
      fired = true;
    });

    const wrapper = el.shadowRoot!.querySelector('.item') as HTMLElement;
    wrapper.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

    await el.updateComplete;
    expect(fired).to.be.false;
  });

  it('ignores keyboard events when disabled', async () => {
    const el = await fixture<ScStatusFilterItem>(
      html`<sc-status-filter-item disabled></sc-status-filter-item>`
    );

    let fired = false;
    el.addEventListener('sc-filter-item-click', () => {
      fired = true;
    });

    const wrapper = el.shadowRoot!.querySelector('.item') as HTMLElement;
    wrapper.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    await el.updateComplete;
    expect(fired).to.be.false;
  });
});
