import { css, LitElement } from 'lit';
import BasicCSS from '../src/styles/basic.js';

export const BasicCSSMixin = (
  superClass: any
) => {
  class BasicCSSMixinClass extends superClass {
    static styles = [
      (superClass as unknown as typeof LitElement).styles ?? [],
      css`${BasicCSS}`,
    ];
  }

  return BasicCSSMixinClass as any;
};
