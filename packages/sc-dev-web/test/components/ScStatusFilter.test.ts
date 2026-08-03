import { html } from 'lit';
import { fixture, expect, oneEvent } from '@open-wc/testing';
import { ScStatusFilter } from '../../src/components/ScStatusFilter/ScStatusFilter.js';
import { ScStatusFilterItem } from '../../src/components/ScStatusFilter/ScStatusFilterItem.js';
import '../../elements/sc-status-filter.js';
import '../../elements/sc-status-filter-item.js';

// Helper to click the correct Shadow DOM element inside the item
const clickItem = (item: ScStatusFilterItem) => {
  const wrapper = item.shadowRoot!.querySelector('.item') as HTMLElement;
  wrapper.click();
};

describe('ScStatusFilter', () => {
  it('renders with default values', async () => {
    const el = await fixture<ScStatusFilter>(
      html`<sc-status-filter></sc-status-filter>`
    );
    expect(el.multiple).to.equal(false);
    expect(el.disabled).to.equal(false);
    expect(el.size).to.equal('md');
    expect(el).to.not.equal(null);
  });

  it('syncs initial selection (single select)', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter>
        <sc-status-filter-item value="1" selected></sc-status-filter-item>
        <sc-status-filter-item value="2"></sc-status-filter-item>
      </sc-status-filter>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll('sc-status-filter-item');
    expect(items[0].selected).to.be.true;
    expect(items[1].selected).to.be.false;
  });

  it('enforces single selection on init if multiple are selected', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter>
        <sc-status-filter-item value="1" selected></sc-status-filter-item>
        <sc-status-filter-item value="2" selected></sc-status-filter-item>
      </sc-status-filter>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll('sc-status-filter-item');
    expect(items[0].selected).to.be.true;
    expect(items[1].selected).to.be.false;
  });

  it('syncs initial selection (multiple select)', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter multiple>
        <sc-status-filter-item value="1" selected></sc-status-filter-item>
        <sc-status-filter-item value="2" selected></sc-status-filter-item>
      </sc-status-filter>
    `);
    await el.updateComplete;

    const items = el.querySelectorAll('sc-status-filter-item');
    expect(items[0].selected).to.be.true;
    expect(items[1].selected).to.be.true;
  });

  it('handles single selection click interaction', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter>
        <sc-status-filter-item id="item1" value="1"></sc-status-filter-item>
        <sc-status-filter-item id="item2" value="2"></sc-status-filter-item>
      </sc-status-filter>
    `);

    const item1 = el.querySelector('#item1') as ScStatusFilterItem;
    const item2 = el.querySelector('#item2') as ScStatusFilterItem;

    // Click item 1 -> Selects it
    const p1 = oneEvent(el, 'sc-select');
    clickItem(item1);
    const ev1 = await p1;
    expect(ev1.detail.value).to.equal('1');
    expect(item1.selected).to.be.true;

    // Click item 2 -> Selects 2, Deselects 1
    const p2 = oneEvent(el, 'sc-select');
    clickItem(item2);
    const ev2 = await p2;
    expect(ev2.detail.value).to.equal('2');
    expect(item1.selected).to.be.false;
    expect(item2.selected).to.be.true;

    // Click item 2 again -> Deselects it
    const p3 = oneEvent(el, 'sc-select');
    clickItem(item2);
    const ev3 = await p3;
    expect(ev3.detail.value).to.equal('');
    expect(item2.selected).to.be.false;
  });

  it('handles multiple selection click interaction', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter multiple>
        <sc-status-filter-item id="item1" value="1"></sc-status-filter-item>
        <sc-status-filter-item id="item2" value="2"></sc-status-filter-item>
      </sc-status-filter>
    `);

    const item1 = el.querySelector('#item1') as ScStatusFilterItem;
    const item2 = el.querySelector('#item2') as ScStatusFilterItem;

    // Select 1
    const p1 = oneEvent(el, 'sc-select');
    clickItem(item1);
    const ev1 = await p1;
    expect(ev1.detail.values).to.include('1');

    // Select 2 (1 should stay selected)
    const p2 = oneEvent(el, 'sc-select');
    clickItem(item2);
    const ev2 = await p2;
    expect(ev2.detail.values).to.include('1');
    expect(ev2.detail.values).to.include('2');

    // Deselect 1
    const p3 = oneEvent(el, 'sc-select');
    clickItem(item1);
    const ev3 = await p3;
    expect(ev3.detail.values).to.not.include('1');
    expect(ev3.detail.values).to.include('2');
  });

  it('propagates disabled state to children', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter>
        <sc-status-filter-item id="child"></sc-status-filter-item>
      </sc-status-filter>
    `);

    const child = el.querySelector('#child') as ScStatusFilterItem;
    expect(child.disabled).to.be.false;

    el.disabled = true;
    await el.updateComplete;

    expect(child.disabled).to.be.true;
  });

  it('propagates size state to children', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter size="md">
        <sc-status-filter-item id="child"></sc-status-filter-item>
      </sc-status-filter>
    `);

    const child = el.querySelector('#child') as ScStatusFilterItem;
    expect(child.size).to.equal('md');

    el.size = 'lg';
    await el.updateComplete;

    expect(child.size).to.equal('lg');
  });

  it('calculates grid positioning attributes', async () => {
    const el = await fixture<ScStatusFilter>(html`
      <sc-status-filter>
        ${[1, 2, 3, 4, 5, 6, 7].map(
          i => html`<sc-status-filter-item id="i${i}"></sc-status-filter-item>`
        )}
      </sc-status-filter>
    `);
    await el.updateComplete;

    const i1 = el.querySelector('#i1')!;
    const i6 = el.querySelector('#i6')!;
    const i7 = el.querySelector('#i7')!;

    // i1 = Top Left
    expect(i1.hasAttribute('data-tl')).to.be.true;
    // i6 = Top Right (end of row 1)
    expect(i6.hasAttribute('data-tr')).to.be.true;
    // i7 = Bottom Left (start of row 2) AND Bottom Right (last item)
    expect(i7.hasAttribute('data-bl')).to.be.true;
    expect(i7.hasAttribute('data-br')).to.be.true;
  });
});
