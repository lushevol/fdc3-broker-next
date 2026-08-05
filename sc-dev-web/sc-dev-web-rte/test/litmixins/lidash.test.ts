import { LitElement, html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { customElement } from 'lit/decorators.js';
import { ToolMixin } from '../../src/mixins/tool-mixin.js';

@customElement('test-mixin')
class Test extends ToolMixin(LitElement) {
  constructor() {
    super();
  }
  render() {
    return html`
      <div class="parent" style="height: 300px;">
        <div class="child"></div>
      </div>
    `;
  }
}

describe('Lidash mixin', () => {
  it('Lidash mixin', async () => {
    const callback = jest.fn();
    const el = await fixture<Test>(html` <test-mixin> </test-mixin> `);
    const res = el.stripExpressionMarkers('html');
    el.animationFrame.cancel(el.animationFrame.run(callback));
    el.timeout.cancel(el.timeout.run(callback, 0));
    el.generateId();
    await el.isAllUpdateComplete(el);

    const sourceEl = el.shadowRoot?.querySelector('.child');
    if (sourceEl) {
      el.seekParentElement(sourceEl, 'div');
      el.removeAllNodes(sourceEl);
    }
    el.noop();

    expect(res).to.equal('html');
    expect(el.createArray(3).length).to.equal(3);
    expect(el.clamp(3, 2, 4)).to.equal(3);
    expect(el.isClamp(3, 2, 4)).to.equal(true);
  });
});
