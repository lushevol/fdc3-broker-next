import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { LitElement, html } from 'lit';

import { customElement } from 'lit/decorators.js';
import { Virtualizer } from '../../../src/controllers/virtualizer/virtualizer.js';

@customElement('test-list')
class List extends LitElement {
  private virtualizerController: Virtualizer;
  constructor() {
    super();
    
  }
  render() {
    return html`
      <div class="dropdown-menu" style="height: 300px;">
        <div class="scroll-element"></div>
      </div>
    `;
  }
}

describe('virtualizer', () => {
  it('large list', async () => {
    const el = await fixture<List>(html`<test-list></test-list>`);
    await elementUpdated(el);
    const scroller = el.shadowRoot?.querySelector('.dropdown-menu') as HTMLDivElement;
    Object.defineProperty(scroller, 'offsetHeight', {
      configurable: true,
      value: 300,
    });
    const scrollContainer = el.shadowRoot?.querySelector('.scroll-element') as HTMLDivElement;
    const v = new Virtualizer({
      createElements: (count: number) =>
        [...Array(count)].map(() => {
          const div = document.createElement('div');
          div.style.height = '30px';
          return div;
        }),
      updateElement: (el: HTMLElement, index: number) => {
        el.textContent = `row ${index}`;
      },
      scrollTarget: scroller,
      scrollContainer,
      reorderElements: true,
      // maxHeight: 300,
    });

    v.size = 300;
    
    await elementUpdated(el);
    v.scrollToIndex(30);
    
    await elementUpdated(el);
    
    expect(scrollContainer.children.length).to.equal(300);
  }, 10000);
});
