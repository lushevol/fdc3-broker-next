import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScRepeater } from '../../src/components/ScRepeater/ScRepeater.js';
import '../../elements/sc-repeater.js';

describe('ScRepeater', () => {
  it('renders repeater', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater label='Repeater'></sc-repeater>`);
    expect(el).to.not.equal(null);
  });

  it('appends a new field when button is clicked', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="append"></sc-repeater>`);
    const button = el.shadowRoot?.querySelector('sc-link') as HTMLElement;
    button.click();
    await el.updateComplete;
    const fields = el.shadowRoot?.querySelectorAll('.icon-container');
    expect(fields?.length).to.equal(2);
  });

  it('prepends a new field when button is clicked', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="prepend"></sc-repeater>`);
    const button = el.shadowRoot?.querySelector('sc-link') as HTMLElement;
    button.click();
    await el.updateComplete;
    const fields = el.shadowRoot?.querySelectorAll('.icon-container');
    expect(fields?.length).to.equal(2);
  });

  it('starts empty with only a button', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="startingEmpty"></sc-repeater>`);
    const fields = el.shadowRoot?.querySelectorAll('.icon-container');
    expect(fields?.length).to.equal(0);
    const button = el.shadowRoot?.querySelector('sc-link') as HTMLElement;
    expect(button).to.not.be.null;
  });

  it('renders disabled', async () => {
    const el = await fixture<ScRepeater>(
      html`<sc-repeater type="error" disabled></sc-repeater>`
    );

    expect(el.disabled).to.equal(true);
  });

  it('expands button width to 100%', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater buttonExpand></sc-repeater>`);
    const button = el.shadowRoot?.querySelector('sc-link') as HTMLElement;
    expect(button.style.width).to.equal('');
  });

  it('group fields are working', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="append">
    <div style="padding-bottom :10px; padding-top: 10px">
      <sc-text-input tooltip="" tooltip-placement="top" label-size="xs" value="" placeholder="" rows="5" prefix-icon="" 
      suffix-icon="" suffix-label="" help-text="" border-type="box" 
      max-length="10" success-message="" error-message=""> 
      </sc-text-input>
      <sc-text-input tooltip="" tooltip-placement="top" label-size="xs" value="" placeholder="" rows="5" prefix-icon="" 
      suffix-icon="" suffix-label="" help-text="" border-type="box" 
      max-length="10" success-message="" error-message=""> 
      </sc-text-input>
      </div>
      </sc-repeater>
    `);
    const button = el.shadowRoot?.querySelector('sc-link') as HTMLElement;
    button.click();
    await el.updateComplete;
    const groups = el.shadowRoot?.querySelectorAll('.slot-group');
    expect(groups?.length).to.equal(2);
  });

  it('deletes element when icon is clicked', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="append"></sc-repeater>`);
    const icon = el.shadowRoot?.querySelector('sc-icon');
    if (icon) {
      icon.click();
      await el.updateComplete;
    }
    const div = el.shadowRoot?.querySelector('.icon-container');
    expect(div).to.equal(null);
  });


  it('deletes 2 element when icon is clicked for append', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="append"></sc-repeater>`);
    const button = el.shadowRoot?.querySelector('sc-link') as HTMLElement;
    button.click();
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector('sc-icon');
    if (icon) {
      icon.click(); 
      await el.updateComplete; }
    const icon2 = el.shadowRoot?.querySelector('sc-icon');
    if (icon2) {
      icon2.click();
      await el.updateComplete;
    }
    const div = el.shadowRoot?.querySelector('.icon-container'); 
    expect(div).to.equal(null);
  });

  it('deletes 2 element when icon is clicked for prepend', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="prepend"></sc-repeater>`);
    const button = el.shadowRoot?.querySelector('sc-link') as HTMLElement;
    button.click();
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector('sc-icon');
    if (icon) {
      icon.click(); 
      await el.updateComplete; }
    const icon2 = el.shadowRoot?.querySelector('sc-icon');
    if (icon2) {
      icon2.click();
      await el.updateComplete;
    }
    const div = el.shadowRoot?.querySelector('.icon-container'); 
    expect(div).to.equal(null);
  });

  it('call handleScBubbleInput event', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater position="append">
    <sc-text-input tooltip="" tooltip-placement="top" label-size="xs" value="" placeholder="" rows="5" 
    prefix-icon="" suffix-icon="" suffix-label="" help-text="" 
    border-type="box" max-length="10" success-message="" error-message="" hide=""> 
    </sc-text-input></sc-repeater>`);
    const ele = el?.shadowRoot?.querySelector('sc-text-input');
    const inputEvent = new CustomEvent('sc-bubble-input', { bubbles: true, detail: { value: '1231241' } });
    ele?.dispatchEvent(inputEvent);
    await el.updateComplete;
    el.addEventListener('sc-change',(e:any) => {
      expect(e).to.not.be.null;
    }
    ); 
  });


  it('passes the a11y audit', async () => {
    const el = await fixture<ScRepeater>(html`<sc-repeater label='repeater'></sc-repeater>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
