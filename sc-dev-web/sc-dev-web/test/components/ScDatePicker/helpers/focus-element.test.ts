import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import { focusElement } from '../../../../src/components/ScDatePicker/helpers/focus-element.js';

describe(focusElement.name, () => {
  it('focuses element', async () => {
    const el = await fixture<HTMLButtonElement>(html`<button>Focus me</button>`);

    const focusedElement = await focusElement(Promise.resolve(el));

    expect(focusedElement.outerHTML).to.equal('<button>Focus me</button>');
  });

  it('focuses element with optional callback', async () => {
    const el = await fixture<HTMLButtonElement>(html`<button>Focus me</button>`);

    const focusedElement = await new Promise<HTMLButtonElement>(async resolve => {
      await focusElement(Promise.resolve(el), (n => {
        resolve(n);
      }));
    });

    expect(focusedElement.outerHTML).to.equal('<button>Focus me</button>');
  });

});
