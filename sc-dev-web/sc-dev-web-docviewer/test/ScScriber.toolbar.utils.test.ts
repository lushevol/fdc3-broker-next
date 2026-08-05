import { fixture, expect } from '@open-wc/testing';
import {
  Color,
  ETools,
  Size,
} from '../src/components/ScScriber.toolbar.util.js';
import { html } from 'lit';

describe('test scriber toolbar utils', () => {
  it('color and size', async () => {
    const color = new Color(() => {});
    const size = new Size(() => {});
    color.reset();
    const el = await fixture(
      html`<div>
        <div class="target"></div>
        <div></div>
        <div></div>
      </div>`
    );
    const eventDom = el.querySelector('.target');
    const e = {
      target: eventDom,
    } as any as Event;
    color.handleValueChange(e, '', ETools.arrow);
    color.setup(ETools.arrow);
    size.reset();
    size.handleValueChange(
      new CustomEvent('sc-select', {
        detail: {
          value: 'label',
        },
      }),
      ETools.arrow
    );
    size.setup(ETools.arrow);

    expect(color.getDefaultValue()).to.equal(color.default);
    expect(size.getDefaultValue()).to.equal(size.default);
  });
});
