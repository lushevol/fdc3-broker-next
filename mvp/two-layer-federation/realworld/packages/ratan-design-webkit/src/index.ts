/**
 * Public Ratan WebKit boundary.
 *
 * Components remain API-compatible while individual Lit implementations are
 * validated and promoted from the imported component source.
 */
export * from '@fm/ratan-design';
export { Dialog, type DialogProps, type DialogWidth } from './dialog';
export { Divider, type DividerProps } from './divider';
export { defineScDialog, SC_DIALOG_TAG_NAME, ScDialog } from './elements/sc-dialog';
export { defineScDivider, SC_DIVIDER_TAG_NAME, ScDivider } from './elements/sc-divider';
export { defineScBadge, SC_BADGE_TAG_NAME, ScBadge } from './elements/sc-badge';
export { StatusBadge, type StatusBadgeProps, type StatusTone } from './status-badge';
export {
  WebkitDesignSystemProvider,
  WebkitDesignSystemProvider as DesignSystemProvider,
} from './provider';
