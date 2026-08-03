import { css, LitElement } from 'lit';
import UtilCSS from '../src/styles/util.js';

export const UtilCSSMixin = (
  superClass: any
) => {
  class UtilCSSMixinClass extends superClass {
    static styles = [
      (superClass as unknown as typeof LitElement).styles ?? [],
      css`${UtilCSS}`,
    ];
  }

  return UtilCSSMixinClass as any;
};

