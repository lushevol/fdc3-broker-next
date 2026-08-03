import { html } from 'lit';
import { expect, fixture, oneEvent } from '@open-wc/testing';
import { ScChatInput } from '../../../src/components/ScChat/ScChatInput.js';

if (!customElements.get('sc-chat-input-test')) {
  customElements.define('sc-chat-input-test', ScChatInput);
}

describe('ScChatInput', () => {
  it('renders input and send icon by default', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);

    await el.updateComplete;

    const textInput = el.shadowRoot?.querySelector('sc-text-input');
    const iconButton = el.shadowRoot?.querySelector('sc-icon-button') as any;

    expect(textInput).to.exist;
    expect(iconButton).to.exist;
    expect(iconButton.name).to.equal('send');
  });

  it('emits send event with default value when send button is clicked', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);
    el.defaultValue = 'preset value';

    await el.updateComplete;

    const sendEventPromise = oneEvent(el, 'send');
    const iconButton = el.shadowRoot?.querySelector('sc-icon-button') as HTMLElement;
    iconButton.click();

    const event = (await sendEventPromise) as CustomEvent;
    expect(event.detail.value).to.equal('preset value');
  });

  it('updates current value on sc-input and emits send with updated value', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);

    await el.updateComplete;

    const textInput = el.shadowRoot?.querySelector('sc-text-input') as HTMLElement;
    const inputEventPromise = oneEvent(el, 'sc-input');

    textInput.dispatchEvent(new CustomEvent('sc-input', { detail: { value: 'hello chat' } }));

    const inputEvent = (await inputEventPromise) as CustomEvent;
    expect(inputEvent.detail.value).to.equal('hello chat');

    const sendEventPromise = oneEvent(el, 'send');
    const iconButton = el.shadowRoot?.querySelector('sc-icon-button') as HTMLElement;
    iconButton.click();

    const sendEvent = (await sendEventPromise) as CustomEvent;
    expect(sendEvent.detail.value).to.equal('hello chat');
  });

  it('emits cancel instead of send when processing is true', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);
    el.processing = true;

    await el.updateComplete;

    const iconButton = el.shadowRoot?.querySelector('sc-icon-button') as any;
    expect(iconButton.name).to.equal('stop--line');

    let sendCount = 0;
    let cancelCount = 0;

    el.addEventListener('send', () => {
      sendCount += 1;
    });
    el.addEventListener('cancel', () => {
      cancelCount += 1;
    });

    (iconButton as HTMLElement).click();

    expect(sendCount).to.equal(0);
    expect(cancelCount).to.equal(1);
  });

  it('does not emit send or cancel when disabled', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);
    el.disabled = true;

    await el.updateComplete;

    const iconButton = el.shadowRoot?.querySelector('sc-icon-button') as any;
    const textInput = el.shadowRoot?.querySelector('sc-text-input') as any;
    expect(textInput.disabled).to.equal(true);

    let sendCount = 0;
    let cancelCount = 0;

    el.addEventListener('send', () => {
      sendCount += 1;
    });
    el.addEventListener('cancel', () => {
      cancelCount += 1;
    });

    (iconButton as HTMLElement).click();

    expect(sendCount).to.equal(0);
    expect(cancelCount).to.equal(0);
  });

  it('disables text input while processing', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);
    el.processing = true;

    await el.updateComplete;

    const textInput = el.shadowRoot?.querySelector('sc-text-input') as any;
    expect(textInput.disabled).to.equal(true);
  });

  it('pressing Enter without Shift prevents default and emits send', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);
    el.defaultValue = 'enter-send';

    await el.updateComplete;

    const textInput = el.shadowRoot?.querySelector('sc-text-input') as HTMLElement;
    const sendEventPromise = oneEvent(el, 'send');

    const event = new KeyboardEvent('keypress', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
      shiftKey: false,
    });

    textInput.dispatchEvent(event);

    const sendEvent = (await sendEventPromise) as CustomEvent;
    expect(event.defaultPrevented).to.equal(true);
    expect(sendEvent.detail.value).to.equal('enter-send');
  });

  it('pressing Shift+Enter does not emit send', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);

    await el.updateComplete;

    let sendCount = 0;
    el.addEventListener('send', () => {
      sendCount += 1;
    });

    const textInput = el.shadowRoot?.querySelector('sc-text-input') as HTMLElement;
    const event = new KeyboardEvent('keypress', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
      shiftKey: true,
    });

    textInput.dispatchEvent(event);

    expect(event.defaultPrevented).to.equal(false);
    expect(sendCount).to.equal(0);
  });

  it('pressing non-Enter key does not emit send', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);

    await el.updateComplete;

    let sendCount = 0;
    el.addEventListener('send', () => {
      sendCount += 1;
    });

    const textInput = el.shadowRoot?.querySelector('sc-text-input') as HTMLElement;
    const event = new KeyboardEvent('keypress', {
      key: 'A',
      bubbles: true,
      cancelable: true,
      shiftKey: false,
    });

    textInput.dispatchEvent(event);

    expect(event.defaultPrevented).to.equal(false);
    expect(sendCount).to.equal(0);
  });

  it('emits sc-focus and sc-blur with latest value', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);

    await el.updateComplete;

    const textInput = el.shadowRoot?.querySelector('sc-text-input') as HTMLElement;
    const focusEventPromise = oneEvent(el, 'sc-focus');

    textInput.dispatchEvent(new CustomEvent('sc-focus', { detail: { value: 'focus value' } }));

    const focusEvent = (await focusEventPromise) as CustomEvent;
    expect(focusEvent.detail.value).to.equal('focus value');

    const blurEventPromise = oneEvent(el, 'sc-blur');
    textInput.dispatchEvent(new CustomEvent('sc-blur', { detail: { value: 'blur value' } }));

    const blurEvent = (await blurEventPromise) as CustomEvent;
    expect(blurEvent.detail.value).to.equal('blur value');

    const sendEventPromise = oneEvent(el, 'send');
    const iconButton = el.shadowRoot?.querySelector('sc-icon-button') as HTMLElement;
    iconButton.click();

    const sendEvent = (await sendEventPromise) as CustomEvent;
    expect(sendEvent.detail.value).to.equal('blur value');
  });

  it('resets rows on clear and restores rows on next input', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);
    el.rows = 4;

    await el.updateComplete;

    expect((el as any).innerRows).to.equal(4);

    const textInput = el.shadowRoot?.querySelector('sc-text-input') as HTMLElement;
    const clearEventPromise = oneEvent(el, 'sc-clear');

    textInput.dispatchEvent(new CustomEvent('sc-clear', { detail: { value: '' } }));

    const clearEvent = (await clearEventPromise) as CustomEvent;
    expect(clearEvent.detail.value).to.equal('');
    expect((el as any).innerRows).to.equal(1);

    textInput.dispatchEvent(new CustomEvent('sc-input', { detail: { value: 'x' } }));
    expect((el as any).innerRows).to.equal(4);
  });

  it('updates internal state when rows/defaultValue changes and resets on disconnect', async () => {
    const el = await fixture<ScChatInput>(html`<sc-chat-input-test></sc-chat-input-test>`);

    el.rows = 5;
    el.defaultValue = 'state test';
    await el.updateComplete;

    expect((el as any).innerRows).to.equal(5);
    expect((el as any)._currentValue).to.equal('state test');

    el.remove();

    expect((el as any).multiline).to.equal(false);
    expect((el as any).innerRows).to.equal(1);
  });
});
