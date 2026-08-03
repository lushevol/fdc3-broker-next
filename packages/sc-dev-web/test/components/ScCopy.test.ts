import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCopy } from '../../src/components/ScCopy/ScCopy.js';
import '../../elements/sc-copy.js';

describe('ScCopy', () => {
  it('renders default copy icon', async () => {
    const el = await fixture<ScCopy>(html`<sc-copy value="test"></sc-copy>`);
    const el1 = await fixture<ScCopy>(html`<sc-copy disabled></sc-copy>`);
    const el2 = await fixture<ScCopy>(html`<sc-copy
        from="test"
        tooltip-placement="top"
        help-text="Click to copy"
        error-message="Failed"
        success-message="Copied successfully!"
      ></sc-copy>
      <span id="test" class="test">test</span>`);
    const el3 = await fixture<ScCopy>(html`<sc-copy
        from="test.test"
        tooltip-placement="bottom"
        help-text="Click to copy"
        error-message="Failed"
        success-message="Copied successfully!"
      ></sc-copy>
      <span id="test" class="test">test</span>`);
    const el4 = await fixture<ScCopy>(html`<sc-copy
        from="test[data-id]"
        tooltip-placement="left"
        help-text="Click to copy"
        error-message="Failed"
        success-message="Copied successfully!"
      ></sc-copy>
      <span id="test" data-id="test">test</span>`);
    const el5 = await fixture<ScCopy>(html`<sc-copy
        from="test[test]"
        tooltip-placement="right"
        help-text="Click to copy"
        error-message="Failed"
        success-message="Copied successfully!"
      ></sc-copy>
      <span id="test1" data-id="test">test</span>`);
    await el1.handleCopy();
    await el2.getValueForFrom();
    await el3.getValueForFrom();
    await el4.getValueForFrom();
    await el5.getValueForFrom();

    expect(el.disabled).to.equal(false);
  });

  it('renders text copy', async () => {
    const el = await fixture<ScCopy>(
      html`<sc-copy mode="text" value="test"></sc-copy>`
    );
    const el1 = await fixture<ScCopy>(
      html`<sc-copy mode="text" disabled></sc-copy>`
    );
    const el2 = await fixture<ScCopy>(html`<sc-copy
        mode="text"
        from="test"
        tooltip-placement="right"
        help-text="Click to copy"
        label="copy content"
        error-message="Failed"
        success-message="Copied successfully!"
      ></sc-copy>
      <span id="test" class="test">test</span>`);
    const el3 = await fixture<ScCopy>(html`<sc-copy
        mode="text"
        from="test.test"
        tooltip-placement="right"
        help-text="Click to copy"
        label="copy content"
        error-message="Failed"
        success-message="Copied successfully!"
      ></sc-copy>
      <span id="test" class="test">test</span>`);
    const el4 = await fixture<ScCopy>(html`<sc-copy
        mode="text"
        from="test[test]"
        tooltip-placement="right"
        help-text="Click to copy"
        label="copy content"
        error-message="Failed"
        success-message="Copied successfully!"
      ></sc-copy>
      <span id="test" data-id="test">test</span>`);
    await el1.handleCopy();
    await el2.getValueForFrom();
    await el3.getValueForFrom();
    await el4.getValueForFrom();

    expect(el.disabled).to.equal(false);
  });
});
