/**
 * Public Ratan WebKit boundary.
 *
 * Components remain API-compatible while individual Lit implementations are
 * validated and promoted from the imported component source.
 */
export * from '@fm/ratan-design';
export {
  Dialog,
  type DialogProps,
  type DialogWidth,
} from './dialog';
export {
  defineScDialog,
  SC_DIALOG_TAG_NAME,
  ScDialog,
} from './elements/sc-dialog';
export {
  WebkitDesignSystemProvider,
  WebkitDesignSystemProvider as DesignSystemProvider,
} from './provider';
