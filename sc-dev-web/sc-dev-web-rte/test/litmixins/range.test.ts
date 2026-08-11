import { LitElement, html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { customElement } from 'lit/decorators.js';
import { RangeMixin } from '../../src/mixins/range-mixin.js';

@customElement('test-mixin')
class Test extends RangeMixin(LitElement) {
  constructor() {
    super();
  }
  render() {
    return html`
      <div class="parent" style="height: 300px;">
        <div class="child"></div>
        <input type="text" />
      </div>
    `;
  }
}

describe('Range mixin', () => {
  it('Range mixin', async () => {
    const el = await fixture<Test>(html` <test-mixin> </test-mixin> `);
    el.shadowrootGetSelection();
    const input = el.renderRoot.querySelector('input');

    if (input) {
      input.focus();
    }
    expect(typeof el.range).to.equal('undefined');
  });
});
