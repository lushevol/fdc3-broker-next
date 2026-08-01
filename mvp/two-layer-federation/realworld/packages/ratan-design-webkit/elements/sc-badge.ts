import '@webcomponents/scoped-custom-element-registry';

import { ScBadge } from '../src/components/ScBadge/ScBadge.js';

export const SC_BADGE_TAG_NAME = 'sc-badge';

export function defineScBadge(
  registry: CustomElementRegistry | null | undefined = globalThis.customElements,
): void {
  if (!registry || registry.get(SC_BADGE_TAG_NAME)) return;
  registry.define(SC_BADGE_TAG_NAME, ScBadge);
}

defineScBadge();

export { ScBadge };
declare global {
  interface HTMLElementTagNameMap {
    'sc-badge': ScBadge;
  }
}
