import '@webcomponents/scoped-custom-element-registry';
import { ScDivider } from '../components/ScDivider/ScDivider.js';

export const SC_DIVIDER_TAG_NAME = 'sc-divider';

/** Registers the WebKit divider once and remains safe across MFE reloads. */
export function defineScDivider(
  registry: CustomElementRegistry | null | undefined = globalThis.customElements,
): void {
  if (!registry || registry.get(SC_DIVIDER_TAG_NAME)) return;
  registry.define(SC_DIVIDER_TAG_NAME, ScDivider);
}

defineScDivider();

export { ScDivider };
