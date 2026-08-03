import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScRteAskInputBar } from '../../../src/components/ScRichTextEditor/ScRteAskInputBar.js';

describe('ScRteAskInputBar', () => {
  const mockSetTimeout = jest.spyOn(window,'setTimeout');
  mockSetTimeout.mockImplementation(():any=>{});
  it('renders ask AI input bar', async () => {
    const el = await fixture<ScRteAskInputBar>(html`<sc-rte-ask-input-bar rows=${2}></sc-rte-ask-input-bar>`, {
      scopedElements: { 'sc-rte-ask-input-bar': ScRteAskInputBar },
    });
    expect(el).to.be.instanceOf(ScRteAskInputBar);
    await el.updateComplete;
    const [clickHandler, clickTimeout] = mockSetTimeout.mock.calls[0];
    clickHandler();
    const inputBar = el.shadowRoot?.querySelector('.sc-rte-ask-ai-input-bar') as HTMLElement;
    expect(inputBar).to.exist;

    const moreButton = el.shadowRoot?.querySelector('.sc-rte-ask-ai-input-bar-more') as HTMLElement;
    expect(moreButton).to.exist;
    moreButton.click();

    const dropdownOptions = el.shadowRoot?.querySelectorAll('sc-dropdown-option');
    expect(dropdownOptions?.length).to.be.greaterThan(0);
    const scTextInput = el.shadowRoot?.querySelector('sc-text-input') as HTMLElement;
    scTextInput.dispatchEvent(new CustomEvent('sc-focus', {
      bubbles: true,
      detail: {
        value: 'test1',
      },
    }));
    scTextInput.dispatchEvent(new CustomEvent('sc-input', {
      bubbles: true,
      detail: {
        value: 'test1',
      },
    }));
    scTextInput.dispatchEvent(new CustomEvent('sc-blur', {
      bubbles: true,
      detail: {
        value: 'test1',
      },
    }));
    scTextInput.dispatchEvent(new CustomEvent('sc-clear', {
      bubbles: true,
      detail: {
        value: 'test1',
      },
    }));
    scTextInput.dispatchEvent(new CustomEvent('sc-input', {
      bubbles: true,
      detail: {
        value: 'test1',
      },
    }));
    scTextInput.dispatchEvent(new KeyboardEvent('keypress', {
      bubbles: true,
      shiftKey: false,
      charCode: 13,
    }));
    const scIconButton = el.shadowRoot?.querySelector('sc-icon-button') as HTMLElement;
    scIconButton.click();
    el.typingOrLoading = true;
    el.onSendOrStop();

  });
});