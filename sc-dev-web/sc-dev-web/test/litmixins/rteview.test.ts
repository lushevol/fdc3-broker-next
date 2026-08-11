import { LitElement, html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { customElement } from 'lit/decorators.js';
import { RteViewMixin } from '../../src/components/ScRichTextEditor/mixins/rte-view-mixin.js';
import {
  E_OPERATORS,
  MARKS,
} from '../../src/components/ScRichTextEditor/constant.js';

@customElement('test-mixin')
class Test extends RteViewMixin(LitElement) {
  constructor() {
    super();
  }
  render() {
    return html`
      <div class="parent" style="height: 300px;">
        <div class="child">
          <div data-mark="${MARKS.injectedTablePlaceholder}"></div>
        </div>
      </div>
    `;
  }
}

describe('Range mixin', () => {
  it('Range mixin', async () => {
    const el = await fixture<Test>(html` <test-mixin> </test-mixin> `);
    const sourceEl = el.renderRoot.querySelector('.child');
    if (sourceEl) {}
    el.operatorAction(E_OPERATORS['delete-column']);

    expect(el.tableOperatorsOpts.length).to.equal(4);
  });
});
