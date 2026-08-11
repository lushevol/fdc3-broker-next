import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScPasswordInput } from '../../../src/components/ScFormInput/ScPasswordInput.js';
import '../../../elements/sc-password-input.js';

describe('ScPasswordInput', () => {
  it('renders default value input', async () => {
    const el = await fixture<ScPasswordInput>(
      html` <sc-password-input label="Default value input label"></sc-password-input>`
    );
    expect(el.label).to.equal('Default value input label');
  });

  it('renders help text', async () => {
    const el = await fixture<ScPasswordInput>(
      html` <sc-password-input help-text="This is help message">
        Value input with help message
        <div slot="help">This is help message</div>
      </sc-password-input>`
    );
    expect(el.helpText).to.equal('This is help message');
    expect(el.innerHTML.includes('This is help message')).to.equal(true);
  });

  it('renders help text by slot', async () => {
    const el = await fixture<ScPasswordInput>(
      html` <sc-password-input>
        Value input with help message
        <div slot="help">This is help message</div>
      </sc-password-input>`
    );
    expect(el.innerHTML.includes('This is help message')).to.equal(true);
  });

  it('renders error text', async () => {
    const el = await fixture<ScPasswordInput>(
      html` <sc-password-input error error-message="This is error message">
        Default text input label
      </sc-password-input>`
    );
    expect(el.errorMessage).to.equal('This is error message');
    expect(el.error).to.equal(true);
  });

  it('renders success text', async () => {
    const el = await fixture<ScPasswordInput>(
      html` <sc-password-input success>
        Default text input label
        <div slot="success">This is success message</div>
      </sc-password-input>`
    );
    expect(el.success).to.equal(true);
  });

  it('renders readonly status', async () => {
    const el = await fixture<ScPasswordInput>(
      html` <sc-password-input readonly>
        Default text input label
      </sc-password-input>`
    );
    expect(el.readonly).to.equal(true);
  });
});
