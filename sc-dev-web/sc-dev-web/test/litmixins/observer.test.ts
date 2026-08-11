import { LitElement, html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { customElement } from 'lit/decorators.js';
import { ObserverMxin } from '../../src/mixins/observer-mixin.js';

@customElement('test-mixin')
class Test extends ObserverMxin(LitElement) {
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

describe('Observer mixin', () => {
  it('Observer mixin', async () => {
    const callback = jest.fn();
    const el = await fixture<Test>(html` <test-mixin> </test-mixin> `);

    const child = el.shadowRoot?.querySelector('.child');
    if (child) {
      const contentObserver = el.createMutationObserver(callback);
      contentObserver.observe(child, el.observerScope.nodeState);
    }

    expect(callback.mock.calls.length).to.equal(0);
  });
});
