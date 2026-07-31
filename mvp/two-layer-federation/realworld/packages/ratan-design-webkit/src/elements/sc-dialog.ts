import '@webcomponents/scoped-custom-element-registry';
import { ScDialog } from '../components/ScDialog.js';

export const SC_DIALOG_TAG_NAME = 'sc-dialog';

/** Registers the WebKit dialog once and remains safe across MFE reloads. */
export function defineScDialog(
  registry: CustomElementRegistry | null | undefined = globalThis.customElements,
): void {
  if (!registry || registry.get(SC_DIALOG_TAG_NAME)) return;
  registry.define(SC_DIALOG_TAG_NAME, ScDialog);
}

defineScDialog();

export { ScDialog };
