import { css, LitElement } from 'lit';
import { expect } from '@open-wc/testing';
import { UtilCSSMixin } from '../../mixins/util-css-mixin.js';
import UtilCSS from '../../src/styles/util.js';

describe('UtilCSSMixin', () => {
  it('has util styles', () => {
    const TestClass = UtilCSSMixin(LitElement);
    expect(JSON.stringify(TestClass.styles[1])).to.equal(JSON.stringify(css`${UtilCSS}`));
  });
});