import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCardNumberInput } from '../../src/components/ScFormInput/ScCardNumberInput.js';
import '../../elements/sc-card-number-input.js';

describe('ScCardNumberInput', () => {
  it('renders default input', async () => {
    const el = await fixture<ScCardNumberInput>(
      html` <sc-card-number-input value="12-12"> Default text input label </sc-card-number-input>`
    );
    expect(el.type).to.equal('tel');
  });

  it('renders input without suffix', async () => {
    const el = await fixture<ScCardNumberInput>(
      html` <sc-card-number-input readonly>
        Default text input label
      </sc-card-number-input>`
    );
    expect(el.readonly).to.equal(true);
  });

  it('renders help text', async () => {
    const el = await fixture<ScCardNumberInput>(
      html` <sc-card-number-input required no-suffix-icon >
        Default text input label
        <div slot="help">This is help message</div>
      </sc-card-number-input>`
    );
    // @ts-ignore
    expect(el.innerHTML.includes('This is help message')).to.equal(true);
  });

  it('renders error text', async () => {
    const el = await fixture<ScCardNumberInput>(
      html` <sc-card-number-input error>
        Default text input label
        <div slot="error">This is error message</div>
      </sc-card-number-input>`
    );
    expect(el.error).to.equal(true);
  });

  it('renders success text', async () => {
    const el = await fixture<ScCardNumberInput>(
      html` <sc-card-number-input success clearable>
        Default text input label
        <div slot="success">This is success message</div>
      </sc-card-number-input>`
    );
    el.clearValue(new Event(''));
    el.renderClearIcon();
    expect(el.success).to.equal(true);
  });
});
