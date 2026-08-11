import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScButtonDropdown } from '../../src/components/ScButton/ScButtonDropdown.js';
import '../../elements/sc-button.js';

describe('ScButtonDropdown', () => {
  beforeEach(()=>{
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      ...new CSSStyleDeclaration(),
      getPropertyValue: (v: string) => '',
    });
    HTMLElement.prototype.getAnimations = () => [];
      HTMLElement.prototype.animate = () =>
      ({
        cancel() { },
        finish() { },
        onfinish: null,
        play() { },
        pause() { },
        currentTime: 0,
        addEventListener() { },
        removeEventListener() { },
      } as any);
  });

  it('Slot', async () => {
    const el = await fixture<ScButtonDropdown>(
      html`
        <sc-button-dropdown update-button-text>
            <sc-dropdown-option value="english">English</sc-dropdown-option>
            <sc-dropdown-option value="mandarin">Mandarin<sc-link>View more</sc-link></sc-dropdown-option>
            <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
            <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
            <sc-dropdown-option value="french">French</sc-dropdown-option>
            </sc-button-dropdown>
        </sc-icon-provider>
      `
    );

    expect(el.buttonText).to.equal('Button');
    el.handleSelect(
      new CustomEvent('sc-select', {
        detail: {
          value: 'label',
        },
      })
    );
    expect(el.buttonText).to.equal('label');
  });

  it('renders left icon', async () => {
    const el = await fixture<ScButtonDropdown>(
      html`
        <sc-button-dropdown left-icon="cross">
          <sc-dropdown-option value="english">English</sc-dropdown-option>
        </sc-button-dropdown>
      `
    );

    expect(el.leftIcon).to.equal('cross');
  });

  it('forwards empty-text to dropdown input', async () => {
    const el = await fixture<ScButtonDropdown>(
      html`
        <sc-button-dropdown empty-text="Nothing to show">
          <sc-dropdown-option value="english">English</sc-dropdown-option>
        </sc-button-dropdown>
      `
    );

    const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input')?.shadowRoot?.querySelector('slot[name="empty-text"]') as any;
    expect(dropdown?.assignedNodes()[0].textContent).to.equal('Nothing to show');
  });

  it('change the open state', async () => {
    const el = await fixture<ScButtonDropdown>(
      html`
        <sc-button-dropdown left-icon="cross">
          <sc-dropdown-option value="english">English</sc-dropdown-option>
        </sc-button-dropdown>
      `
    );
    const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input');
    expect(el._open).to.equal(false);
    dropdown?.dispatchEvent(new CustomEvent('sc-show'));
    await el.updateComplete;
    expect(el._open).to.equal(true);
  });
});
