import { html } from 'lit';
import { fixture, expect, nextFrame, oneEvent } from '@open-wc/testing';
import { ScRadioGroup } from '../../../src/components/ScRadio/ScRadioGroup.js';
import { ScRadio } from '../../../src/components/ScRadio/ScRadio.js';
import '../../../elements/sc-radio-group.js';
import '../../../elements/sc-radio.js';

describe('ScRadioGroup', () => {
  it('renders default radio group', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio">
        <sc-radio value="1">Default</sc-radio>
      </sc-radio-group>`
    );

    expect(el.radios.length).to.equal(1);
  });

  it('renders multiple radios', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio" value="2">
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );

    expect(el.radios.length).to.equal(2);
    expect(el.value).to.equal('2');
  });

  it('renders horizontal radio group', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio" value="2" horizontal>
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    expect(
      // @ts-ignore
      el.renderRoot.innerHTML.includes('.horizontal')
    ).to.equal(true);
  });

  it('renders disabled radio group', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio" value="2">
        <sc-radio value="1" disabled>Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    // @ts-ignore
    expect(el.renderRoot.innerHTML.includes('disabled')).to.equal(true);
  });

  it('call click handler', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio" value="2">
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    const radio = el.querySelectorAll('sc-radio')[0];
    radio.value = '1';
    // @ts-ignore
    el.handleClick({
      target: radio,
    });
    expect(el.clicked).to.equal(true);
  });

  it('setActiveRadio', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio" value="2">
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    // @ts-ignore
    el.setActiveRadio(null, {
      emitEvents: false,
    });
    expect(el.value).to.equal('2');
    // @ts-ignore
    el.setActiveRadio(el.querySelector('sc-radio'), {
      emitEvents: false,
    });
    expect(el.value).to.not.equal('2');
  });

  it('renders horizontal radio', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio" direction='horizontal' value="2">
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    expect(el.direction).to.equal('horizontal');
  });

  it('enable cancellation', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group enable-cancellation value="2">
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    expect(el.enableCancellation).to.equal(true);
    el.handleDoubleClick();
    expect(el.value).to.equal('');
  });
  
  it('renders readonly', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group class="sc-radio" value="2" readonly>
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    expect(el.readonly).to.equal(true);
    el.toggleAttribute('readonly');

    await nextFrame();

    const radio = el.querySelector('sc-radio[value="2"]') as ScRadio|undefined;
    expect(radio?.checked).to.equal(true);
    expect(el.value).to.equal('2');
  });

  it('should handle mouseup event', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group value="2">
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
  
    const radio = el.querySelector('sc-radio[value="2"]') as HTMLElement;
  
    const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, composed: true });
    radio.dispatchEvent(mouseUpEvent);

    expect(el.clicked).to.be.equal(false);
  });

  it('should initialize with columns set to 4', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group value="2" columns=4>
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    expect(el.columns).to.equal(4);
  });

  it('should return correct class map when columns is false', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group value="2">
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    expect(
      // @ts-ignore
      el.renderRoot.innerHTML.includes('sc-radio-group-flex')
    ).to.be.equal(true);
  });

  it('should return correct class map when columns is true', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group value="2" columns=2>
        <sc-radio value="1">Default</sc-radio>
        <sc-radio value="2">Default</sc-radio>
      </sc-radio-group>`
    );
    expect(
      // @ts-ignore
      el.renderRoot.innerHTML.includes('sc-radio-group-flex')
    ).to.be.equal(true);
  });

  it('should render correctly', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group value="2" >
        <sc-radio value="1">Option 1</sc-radio>
        <sc-radio value="2">Option 2</sc-radio>
        <sc-radio value="3" disabled>Option 3</sc-radio>
      </sc-radio-group>`
    );
    expect(el.radios.length).to.equal(3);
  });

  it('should sync radios on slot change', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group >
        <sc-radio value="1">Option 1</sc-radio>
        <sc-radio value="2">Option 2</sc-radio>
        <sc-radio value="3" disabled>Option 3</sc-radio>
      </sc-radio-group>`
    );
    const newRadio = document.createElement('sc-radio');
    newRadio.value = '4';
    newRadio.textContent = 'Option 4';
    el.appendChild(newRadio);
    await el.updateComplete;
    expect(el.radios.length).to.equal(4);
  });

  it('should handle click events and set active radio', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group value="1">
        <sc-radio value="1">Option 1</sc-radio>
        <sc-radio value="2">Option 2</sc-radio>
        <sc-radio value="3" disabled>Option 3</sc-radio>
      </sc-radio-group>`
    );
    const radio = el.querySelector<ScRadio>('sc-radio[value="1"]')!;
    expect(radio.checked).to.equal(true);
  });

  it('should not allow selection of disabled radios', async () => {
    const el = await fixture<ScRadioGroup>(
      html` <sc-radio-group  value="3" >
        <sc-radio value="1">Option 1</sc-radio>
        <sc-radio value="2">Option 2</sc-radio>
        <sc-radio value="3">Option 3</sc-radio>
      </sc-radio-group>`
    );

    const radio = el.querySelector<ScRadio>('sc-radio[value="2"]')!;
    expect(el.value).not.to.equal('2');
    expect(radio.checked).to.be.false;
  });

  it('should initialize with default properties', async () => {
    const el = await fixture<ScRadioGroup>(html`<sc-radio-group></sc-radio-group>`);
    expect(el.value).to.equal('');
    expect(el.enableCancellation).to.be.false;
    expect(el.direction).to.equal('vertical');
    expect(el.columns).to.be.undefined;
  });

  it('should set and reflect properties', async () => {
    const el = await fixture<ScRadioGroup>(html`
      <sc-radio-group value="test" enable-cancellation direction="horizontal" columns="3">
        <sc-radio value="1">Option 1</sc-radio>
        <sc-radio value="2">Option 2</sc-radio>
      </sc-radio-group>
    `);
    expect(el.value).to.equal('test');
    expect(el.enableCancellation).to.be.true;
    expect(el.direction).to.equal('horizontal');
    expect(el.columns).to.equal(3);
  });

  it('should render child radios and sync them', async () => {
    const el = await fixture<ScRadioGroup>(html`
      <sc-radio-group>
        <sc-radio value="1"></sc-radio>
        <sc-radio value="2"></sc-radio>
      </sc-radio-group>
    `);
    await el.updateComplete;
    expect(el.radios.length).to.equal(2);
    expect(el.radios[0].value).to.equal('1');
    expect(el.radios[1].value).to.equal('2');
  });

  it('should emit sc-change event on radio click', async () => {
    const el = await fixture<ScRadioGroup>(html`
      <sc-radio-group>
        <sc-radio value="1"></sc-radio>
        <sc-radio value="2"></sc-radio>
      </sc-radio-group>
    `);
    const radio = el.radios[1];
    setTimeout(() => radio.click());
    const event = await oneEvent(el, 'sc-change');
    expect(event.detail.value).to.equal('2');
  });

  it('should cancel selection on double click if enableCancellation is true', async () => {
    const el = await fixture<ScRadioGroup>(html`
      <sc-radio-group enable-cancellation >
        <sc-radio value="1"></sc-radio>
        <sc-radio value="2"></sc-radio>
      </sc-radio-group>
    `);
    el.handleDoubleClick();
    await el.updateComplete;
    expect(el.value).to.equal('');
    // @ts-ignore
    expect(el.activeRadio).to.be.undefined;
  });

  it('focus moves to next radio on Tab', async () => {
    const el = await fixture<ScRadioGroup>(
      html`<sc-radio-group>
        <sc-radio value="1">One</sc-radio>
        <sc-radio value="2">Two</sc-radio>
      </sc-radio-group>`
    );
    el.radios[0].tabIndex = 0;
    el.radios[1].focus();

    // Simulate Tab key
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    el.dispatchEvent(event);

    // Check if the focus has moved to the second radio
    expect(document.activeElement).to.equal(el.radios[1]);
  });

  it('selects radio on Spacebar', async () => {
    const el = await fixture<ScRadioGroup>(
      html`<sc-radio-group>
        <sc-radio value="1">One</sc-radio>
        <sc-radio value="2">Two</sc-radio>
      </sc-radio-group>`
    );
    await el.updateComplete;
    el.radios[0].focus();
  
    // Simulate Spacebar
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
    el.radios[0].dispatchEvent(event);
    expect(el.value).to.equal('1');
    expect(el.radios[0].checked).to.be.true;
  });

  it('setActiveRadio updates checked state', async () => {
    const el = await fixture<ScRadioGroup>(
      html`<sc-radio-group>
        <sc-radio value="1">One</sc-radio>
        <sc-radio value="2">Two</sc-radio>
      </sc-radio-group>`
    );
    
    el.setActiveRadio(el.radios[0]);
    expect(el.radios[0].checked).to.be.true;
    expect(el.radios[1].checked).to.be.false;
  });

  it('handleClick sets active radio and emits event', async () => {
    const el = await fixture<ScRadioGroup>(
      html`<sc-radio-group>
        <sc-radio value="1">One</sc-radio>
        <sc-radio value="2">Two</sc-radio>
      </sc-radio-group>`
    );
    const radio = el.radios[1];
    // monitor events
    setTimeout(() => radio.click());
    const event = await oneEvent(el, 'sc-change');
    expect(el.value).to.equal('2');
    expect(radio.checked).to.be.true;
    expect(event.detail.value).to.equal('2');
  });

  it('handleMouseUp resets clicked state', async () => {
    const el = await fixture<ScRadioGroup>(
      html`<sc-radio-group>
        <sc-radio value="1">One</sc-radio>
      </sc-radio-group>`
    );
    el.clicked = true;
    const radio = el.radios[0];
    // Simulate mouseup
    const event = new MouseEvent('mouseup', { bubbles: true });
    radio.dispatchEvent(event);
    expect(el.clicked).to.be.false;
  });
});
