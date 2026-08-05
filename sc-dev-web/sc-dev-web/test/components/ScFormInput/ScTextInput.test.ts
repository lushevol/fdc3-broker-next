import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTextInput } from '../../../src/components/ScFormInput/ScTextInput.js';
import '../../../elements/sc-text-input.js';

describe('ScTextInput', () => {
  it('renders default text input', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input> Default text input label </sc-text-input>`
    );
    expect(el.type).to.equal('text');
  });

  it('renders multiple input', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input multiline rows="2">
        Default text input label
      </sc-text-input>`
    );
    expect(el.multiline).to.equal(true);
  });

  it('renders multiline resizable', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input multiline resizable>
        Default text input label
      </sc-text-input>`
    );
    expect(el.multiline).to.equal(true);
    expect(el.resizable).to.equal(true);
  });

  it('renders multiline resizable auto', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input multiline resizable="auto">
        Default text input label
      </sc-text-input>`
    );
    expect(el.multiline).to.equal(true);
    expect(el.resizable).to.equal('auto');
  });

  it('renders readonly maxRows', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input readonly max-rows>
        Default text input label
      </sc-text-input>`
    );
    expect(el.readonly).to.equal(true);
    expect(el.maxRows).to.equal(true);
  });

  it('renders readonly maxRow to check shouldShowExpandButton', async () => {
    const el = await fixture<ScTextInput>(
      html`<sc-text-input readonly max-rows>
        Default text input label
      </sc-text-input>`
    );

    const scFormControl = document.createElement('div');
    scFormControl.className = 'form-control';

    Object.defineProperty(scFormControl, 'scrollHeight', { get: () => 200 });
    Object.defineProperty(scFormControl, 'clientHeight', { get: () => 100 });

    el.shadowRoot!.appendChild(scFormControl);
    await el.updateComplete;

    const formControl = el.shadowRoot!.querySelector('.form-control');
    expect(formControl).to.not.be.null;
    expect(el.isExpanded).to.be.false;
  });

  it('renders readonly maxRows with newline breaks', async () => {
    const el = await fixture<ScTextInput>(
      html`<sc-text-input readonly max-rows .value=${'Line 1\nLine 2\nLine 3'}>
      </sc-text-input>`
    );

    await el.updateComplete;

    const formControl = el.shadowRoot!.querySelector('.sc-form-control');
    expect(formControl).to.not.be.null;
    expect(formControl!.querySelectorAll('br').length).to.equal(2);
  });

  it('renders help text', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input>
        Default text input label
        <div slot="help">This is help message</div>
      </sc-text-input>`
    );
    // @ts-ignore
    expect(el.innerHTML.includes('This is help message')).to.equal(true);
  });

  it('renders error text', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input error>
        Default text input label
        <div slot="error">This is error message</div>
      </sc-text-input>`
    );
    expect(el.error).to.equal(true);
  });

  it('renders success text', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input success>
        Default text input label
        <div slot="success">This is success message</div>
      </sc-text-input>`
    );
    expect(el.success).to.equal(true);
  });

  it('keeps error message and counter in same container', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input
        error
        error-message="This is error message"
        max-length="10"
        show-character-count
        value="abc"
      >
        Default text input label
      </sc-text-input>`
    );

    const description = el.shadowRoot?.querySelector(
      '.sc-form-group-description'
    );
    expect(description).to.not.be.null;

    const messageContainer = description?.querySelector('.message-container');
    expect(messageContainer).to.not.be.null;

    const errorMessage = messageContainer?.querySelector('.error-message');
    expect(errorMessage).to.not.be.null;

    const characterCount = description?.querySelector('.character-count');
    expect(characterCount).to.not.be.null;

    const helpMessage = messageContainer?.querySelector('.help-message');
    expect(helpMessage?.classList.contains('hide')).to.equal(true);
  });

  it('renders password input', async () => {
    const el = await fixture<ScTextInput>(
      html` <sc-text-input type="password"> Password </sc-text-input>`
    );
    // @ts-ignore
    expect(el.renderRoot.innerHTML.includes('type="password"')).to.equal(true);
  });
});
