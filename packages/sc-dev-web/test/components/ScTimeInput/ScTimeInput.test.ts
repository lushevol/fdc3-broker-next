import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTimeInput } from '../../../src/components/ScTimeInput/ScTimeInput.js';
import '../../../elements/sc-time-input.js';
import sinon from 'sinon';

describe('ScTimeInput', () => {
  it('renders default time input', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input'></sc-time-input>
    `);

    expect(el.placeholder).to.equal('Input here');
    expect(el.value).to.equal(null);
    expect(el.seconds).to.equal(false);
    expect(el.format).to.equal('HH:mm');
    expect(el.hourStep).to.equal(1);
    expect(el.minuteStep).to.equal(1);
    expect(el.secondeStep).to.equal(1);
    expect(el.disabledHours.length).to.equal(0);
    expect(el.disabledMinutes.length).to.equal(0);
    expect(el.disabledSeconds.length).to.equal(0);
    expect(el.error).to.equal(false);
    expect(el.success).to.equal(false);
    expect(el.readonly).to.equal(false);
    expect(el.required).to.equal(false);
    expect(el.label).to.equal('Time input');
    expect(el.helpText).to.equal('');
    expect(el.errorMessage).to.equal('');
    expect(el.successMessage).to.equal('');
  });

  it('renders time input with custom format', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='hh:mm:ss'></sc-time-input>
    `);
    expect(el.format).to.equal('hh:mm:ss');
  });

  it('renders readonly time input', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='hh:mm:ss' readonly></sc-time-input>
    `);
    await fixture<ScTimeInput>(html`
      <sc-time-input tooltip='tooltip' format='hh:mm:ss' readonly></sc-time-input>
    `);
    expect(el.readonly).to.equal(true);
  });

  it('renders time input with default value', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' value='17:30'></sc-time-input>
    `);
    expect(el.value).to.equal('17:30');
  });

  it('renders time input with am pm', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='hh:mm:ss a'></sc-time-input>
    `);
    expect(el.format).to.equal('hh:mm:ss a');
    expect(Array.from(el.renderRoot.querySelectorAll('.list-container')).length).to.equal(3);
  });

  it('renders time input with second', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' seconds format='hh:mm:ss a'></sc-time-input>
    `);
    expect(el.seconds).to.equal(true);
    expect(Array.from(el.renderRoot.querySelectorAll('.list-container')).length).to.equal(4);
  });

  it('renders time input with disabled hours', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' disabled-hours=[3,10]></sc-time-input>
    `);
    expect(el.disabledHours[0]).to.equal(3);
    expect(el.disabledHours[1]).to.equal(10);
  });

  it('does not preselect HH:mm options when value is empty', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='HH:mm'></sc-time-input>
    `);
    const selected = el.renderRoot.querySelectorAll('.item-content.selected');
    expect(selected.length).to.equal(0);
  });

  it('call handleFocus event', async () => {
    const el = await fixture<ScTimeInput>(html`<sc-time-input placeholder="Select time here" value='07:10:50'>Time input</sc-time-input>`);
    const ele:any = el?.shadowRoot?.querySelector('sc-text-input');
    const inputEvent = new CustomEvent('sc-focus', { detail: { value: '07:10' } });
    await el.updateComplete;
    const eventHandler = sinon.spy((e: any) => {
      expect(e.detail.value).to.equal('07:10');
    });
    el.addEventListener('sc-focus', eventHandler); 
    ele?.dispatchEvent(inputEvent);
    // Has it been called
    expect(eventHandler.calledOnce).to.be.true;
  });
  it('call handleBlur event', async () => {
    const el = await fixture<ScTimeInput>(html`<sc-time-input placeholder="Select time here" value='07:10:50'>Time input</sc-time-input>`);
    const ele:any = el?.shadowRoot?.querySelector('sc-text-input');
    const inputEvent = new CustomEvent('sc-blur', { detail: { value: '07:10' } });
    await el.updateComplete;
    const eventHandler = sinon.spy((e: any) => {
      expect(e.detail.value).to.equal('07:10');
    });
    el.addEventListener('sc-blur', eventHandler); 
    ele?.dispatchEvent(inputEvent);
    // Has it been called
    expect(eventHandler.calledOnce).to.be.true;
  });

  it('call handleInput event', async () => {
    const el = await fixture<ScTimeInput>(html`<sc-time-input placeholder="Select time here" value='07:11'
     minute-step="5" 
    >Time input</sc-time-input>`);
    const ele:any = el?.shadowRoot?.querySelector('sc-text-input');
    let inputEvent = new CustomEvent('sc-input', { detail: { value: '07:10' } });
    await el.updateComplete;
    ele?.dispatchEvent(inputEvent);
    inputEvent = new CustomEvent('sc-input', { detail: { value: '07:11' } });
    await el.updateComplete;
    ele?.dispatchEvent(inputEvent);
    const inputEventBlur = new CustomEvent('sc-blur', { detail: { value: '07:11' } });
    await el.updateComplete;
    window.setTimeout = ((callback:any)=>{ callback(); }) as any;
    ele?.dispatchEvent(inputEventBlur);
    const inputEventError = new CustomEvent('sc-input', { detail: { value: '07:111' } });
    await el.updateComplete;
    ele?.dispatchEvent(inputEventError);
    el.scrollToTarget();
    el.readonly = true;
    el.handleMouseOver();
  });

  it('renders time input with default placeholder and AM', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='hh:mm a'></sc-time-input>
    `);
    expect(el.format).to.equal('hh:mm a');
    const _placeholder = Reflect.get(el, '_placeholder');
    expect(_placeholder).to.equal('HH:MM AM');
  });

  it('renders time input with new props', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='hh:mm a' hint='just a hint msg' size="md" iconSize="" textAlign="left" labelSize=""></sc-time-input>
    `);
    expect(el.hint).to.equal('just a hint msg');
    expect(el.size).to.equal('md');
    expect(el.textAlign).to.equal('left');
    expect(el.labelSize).to.equal('md');
    expect(el.iconSize).to.be.undefined;
  });

  it('renders time input with some events', async () => {
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='hh:mm a'></sc-time-input>
    `);
    el.handleFocus(new CustomEvent('sc-focus', { detail: { value: '07:10' } }));
    let _focused = Reflect.get(el,  '_focused');
    expect(_focused).to.equal(true);

    el.handleBlur(new CustomEvent('sc-focus', { detail: { value: '07:10' } }));
    _focused = Reflect.get(el,  '_focused');
    expect(_focused).to.equal(false);

    el.handleMouseOver();
    let _hovered = Reflect.get(el,  '_hovered');
    expect(_hovered).to.equal(true);

    el.handleMouseLeave();
    _hovered = Reflect.get(el,  '_hovered');
    expect(_hovered).to.equal(false);

    el.handleClear();
    const _timeStr = Reflect.get(el,  '_timeStr');
    expect(_timeStr).to.equal('');

    
    const _shouldRenderClockIcon = Reflect.get(el, ' _shouldRenderClockIcon');
    _shouldRenderClockIcon && _shouldRenderClockIcon.call(el);
    expect(typeof _shouldRenderClockIcon).to.not.equal(null);
    
  }); 

  it('updateStyle', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 360,
    });
    const el = await fixture<ScTimeInput>(html`
      <sc-time-input label='Time input' format='hh:mm a'></sc-time-input>
    `);
    el.updateStyle();
    const callback = () => {
      const popup: HTMLElement | null | undefined = el.dropdown.shadowRoot?.querySelector('sl-popup')?.shadowRoot?.querySelector('div[part="popup"]');
      expect(popup?.style?.width).to.not.equal(el.input?.getBoundingClientRect().width);
    };
    jest.useFakeTimers();
    setTimeout(callback, 100);
    jest.runAllTimers();
  });
});


