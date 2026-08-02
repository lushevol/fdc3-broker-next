import { ScDialog } from '../src/components/ScDialog.js';

export const SC_DIALOG_TAG_NAME = 'sc-dialog';

export function defineScDialog(
  registry: CustomElementRegistry | null | undefined = globalThis.customElements,
): void {
  if (!registry || registry.get(SC_DIALOG_TAG_NAME)) return;
  registry.define(SC_DIALOG_TAG_NAME, ScDialog);
}

defineScDialog();

export { ScDialog };

declare global {
  interface HTMLElementTagNameMap {
    'sc-dialog': ScDialog;
  }
}
