import '@webcomponents/scoped-custom-element-registry';

import { ScDivider } from '../src/components/ScDivider/ScDivider.js';

export const SC_DIVIDER_TAG_NAME = 'sc-divider';

export function defineScDivider(
  registry: CustomElementRegistry | null | undefined = globalThis.customElements,
): void {
  if (!registry || registry.get(SC_DIVIDER_TAG_NAME)) return;
  registry.define(SC_DIVIDER_TAG_NAME, ScDivider);
}

defineScDivider();

export { ScDivider };
declare global {
  interface HTMLElementTagNameMap {
    'sc-divider': ScDivider;
  }
}
