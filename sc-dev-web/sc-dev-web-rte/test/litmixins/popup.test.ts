import { LitElement, html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { customElement } from 'lit/decorators.js';
import { PopupMixin } from '../../src/mixins/popup-mixin.js';

@customElement('test-mixin')
class Test extends PopupMixin(LitElement) {
  constructor() {
    super();
  }
  render() {
    return html`
      <div class="parent" style="height: 300px;">
        <div class="child"></div>
        <sl-popup>
          <span slot="anchor"> anchor </span>
          <div class="box">box</div>
        </sl-popup>
      </div>
    `;
  }
}

describe('Popup mixin', () => {
  it('Popup mixin', async () => {
    const el = await fixture<Test>(html` <test-mixin> </test-mixin> `);

    el.popupElement;
    el.togglePopup();
    el.showPopup();
    el.hidePopup();
    el.setVirtualAnchor({
      getBoundingClientRect: () => {
        return new DOMRect(0, 0, 100, 100);
      },
    });

    expect(el.renderRoot).to.equal(el.renderRoot);
  });
});
