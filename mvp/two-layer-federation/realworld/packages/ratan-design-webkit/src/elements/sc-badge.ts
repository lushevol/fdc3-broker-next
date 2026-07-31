import '@webcomponents/scoped-custom-element-registry';
import { ScBadge } from '../components/ScBadge/ScBadge.js';

export const SC_BADGE_TAG_NAME = 'sc-badge';

/** Registers the WebKit badge once and remains safe across MFE reloads. */
export function defineScBadge(
  registry: CustomElementRegistry | null | undefined = globalThis.customElements,
): void {
  if (!registry || registry.get(SC_BADGE_TAG_NAME)) return;
  registry.define(SC_BADGE_TAG_NAME, ScBadge);
}

defineScBadge();

export { ScBadge };
