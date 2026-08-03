import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScOption } from '../../../src/components/common/ScOption.js';
import '../../../elements/sc-option.js';

describe('ScOption', () => {
  it('renders default option', async () => {
    const el = await fixture<ScOption>(
      html` <sc-option> Hello world </sc-option> `
    );
    const option = el.renderRoot.querySelectorAll('.sc-option');
    expect(Array.from(option).length).to.equal(1);
  });
});
