import { css, LitElement } from 'lit';
import { expect } from '@open-wc/testing';
import { BasicCSSMixin } from '../../mixins/basic-css-mixin.js';
import BasicCSS from '../../src/styles/basic.js';

describe('BasicCSSMixin', () => {
  it('has basic styles', () => {
    const TestClass = BasicCSSMixin(LitElement);
    expect(JSON.stringify(TestClass.styles[1])).to.equal(JSON.stringify(css`${BasicCSS}`));
  });
});