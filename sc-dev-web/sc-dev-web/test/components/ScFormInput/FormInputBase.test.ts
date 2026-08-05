import { expect } from '@open-wc/testing';
import { html } from 'lit';
import { FormInputBase } from '../../../src/components/ScFormInput/FormInputBase.js';

describe('FormInputBase', () => {
  it('renders attributes', () => {
    class TestComponent extends FormInputBase {
      render() {
        return html`<div>1234</div>`;
      }
    }
    global.customElements.define('sc-test-component', TestComponent);
    const testInstance = new TestComponent();
    expect(testInstance.value).to.equal('');
    expect(testInstance.label).to.equal('');
    expect(testInstance.helpText).to.equal('');
    expect(testInstance.errorMessage).to.equal('');
    expect(testInstance.successMessage).to.equal('');
    expect(testInstance.placeholder).to.equal('Input here');
    expect(testInstance.error).to.equal(false);
    expect(testInstance.success).to.equal(false);
    expect(testInstance.readonly).to.equal(false);
    expect(testInstance.maxRows).to.equal(false);
    expect(testInstance.readonlyRows).to.equal(5);
    expect(testInstance.required).to.equal(false);
  });
});

