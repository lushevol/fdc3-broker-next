import { expect, fixture, html } from '@open-wc/testing';
import { ScRteBase } from '../../../src/components/ScRichTextEditor/ScRichTextEditorBase.js';
import { COMPACT_SIZE } from '../../../src/shared/util.js';
import '../../../elements/sc-rich-text-editor-v2.js';

class TestComponent extends ScRteBase {
  render():any {
    return html`<div>1234</div>`;
  }
}
global.customElements.define('sc-test-component', TestComponent);
describe('ScRteBase', () => {
  it('renders attributes', () => {
    
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
    expect(testInstance.required).to.equal(false);
    
  });

  it('handles state', async () => {
    const el = await fixture<TestComponent>(html`<sc-test-component></sc-test-component>`);
    expect(el.hasLabel).to.equal(false);
    el.truncate = true;
    expect(el.truncate).to.equal(true);
    expect(el.size).to.equal(COMPACT_SIZE.md);
  });

  it('bind events', async () => {
    const el = await fixture<TestComponent>(html`<sc-test-component></sc-test-component>`);
    const input = document.createElement('input');
    const scFormGroupInput = document.createElement('div');
    scFormGroupInput.className = 'sc-form-group-input';
    input.className = el.formControlClsName;
    el.renderRoot.appendChild(input);
    el.renderRoot.appendChild(scFormGroupInput);
    el.bindEvents();
    await el.updateComplete;

    const mouseOverEvent = new Event('mouseover', { bubbles: true });
    scFormGroupInput.dispatchEvent(mouseOverEvent);
    expect(el._hover).to.be.true;

    const mouseLeaveEvent = new Event('mouseleave', { bubbles: true });
    scFormGroupInput.dispatchEvent(mouseLeaveEvent);
    expect(el._hover).to.be.false;

    const inputEvent = new Event('input', { 
      bubbles: true,
      target: {
        value: 'test 1',
      },
    } as any);
    input.dispatchEvent(inputEvent);
    expect(el._active).to.be.true;

    const focusEvent = new Event('focus', { bubbles: true });
    input.dispatchEvent(focusEvent);
    expect(el._focus).to.be.true;

    const blurEvent = new Event('blur', { bubbles: true });
    input.dispatchEvent(blurEvent);
    expect(el._focus).to.be.false;

    const mouseDownEvent = new Event('mousedown', { bubbles: true });
    input.dispatchEvent(mouseDownEvent);
    expect(el._focusPointer).to.be.true;

    const touchStartEvent = new Event('touchstart', { bubbles: true });
    input.dispatchEvent(touchStartEvent);
    expect(el._focusPointer).to.be.true;
  });

  it('renders label and tooltip correctly', async () => {
    const el = await fixture<TestComponent>(html`
      <sc-test-component label="Test Label" tooltip="Test Tooltip"></sc-test-component>
    `);
    el.render = function() {
      return html` ${el.renderBaseFormInput()} `;
    };
    el.render();
  });

  it('handles disconnectedCallback correctly', async () => {
    const el = await fixture<TestComponent>(html`<sc-test-component></sc-test-component>`);
    const prefixIcon = document.createElement('div');
    prefixIcon.appendChild(document.createElement('sc-icon'));
    prefixIcon.className = 'sc-form-prefix-icon sc-icon';
    el.shadowRoot?.appendChild(prefixIcon);

    const observer = new ResizeObserver(() => {});
    el.iconChangeObserver = observer;
    await el.updateComplete;
    el.observePrefixIconSize();
    el.disconnectedCallback();

    expect(el.iconChangeObserver).to.be.undefined;
  });
});

