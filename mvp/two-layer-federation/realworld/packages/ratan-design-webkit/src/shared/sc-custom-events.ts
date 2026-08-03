import { Enum } from './enum.js';

export interface CUSTOM_EVENTS_TYPE {
  'sc-change': string;
  'sc-editing-started': string;
  'sc-editing-stopped': string;
  'sc-show': string;
  'sc-hide': string;
  'sc-hiding': string;
  'sc-showing': string;
  'sc-after-show': string;
  'sc-after-hide': string;
  'sc-action': string;
  'sc-select': string;
  'sc-search': string;
  'sc-clear': string;
  'sc-close': string;
  'sc-advance-search-show': string;
  'sc-advance-search-hide': string;
  'sc-input': string;
  'sc-focus': string;
  'sc-blur': string;
  'sc-bubble-input': string;
  'sc-active-step-changing': string;
  'sc-active-step-changed': string;
  'sc-drop-zone-value-change': string;
  'sc-tab-select': string;
  'sc-tab-hide': string;
  'sc-tab-show': string;
  'sc-loading': string;
  'sc-tr-create': string;
  'sc-tr-tap': string;
  'sc-tr-mouseover': string;
  'sc-tr-mouseout': string;
  'sc-sort': string;
  'sc-direction-changed': string;
  'sc-page-change': string;
  'sc-error': string;
  'sc-load': string;
  'sc-loaded': string;
  'sc-remove': string;
  'sc-first-updated': string;
  'sc-year-updated': string;
  'sc-month-updated': string;
  'sc-locale-status': string;
  'sc-validate-status': string;
  'sc-filter': string;
  'sc-tr-expanded': string;
  'sc-timer-end': string;
  'sc-timer-start': string;
  'sc-timer-tick': string;
  'sc-duplication-add': string;
  'sc-duplication-remove': string;
  'sc-file-button-value-change': string;
  'sc-cancel': string;
  'sc-loaded-items': string;
  'sc-remove-items': string;
  'sc-select-items': string;
  'sc-cancel-items': string;
  'sc-card-click': string;
  'sc-mouseover': string;
  'sc-mouseleave': string;
  'sc-dragging': string;
  'sc-dimension-update': string;
  'sc-master-expand': string;
  'sc-group-expand': string;
  'sc-expand': string;
  'sc-mouse-down': string;
  'sc-mouse-move': string;
  'sc-mouse-up': string;
  'sc-rte-revision-show': string;
  'sc-dragstart': string;
  'sc-dragover': string;
  'sc-drop': string;
  'sc-dragend': string;
  'sc-dragleave': string;
  'sc-column-order': string;
  'sc-edit-save': string;
  'sc-edit-cancel': string;
}

export enum CUSTOM_EVENTS {
  'sc-change' = 'sc-change',
  'sc-editing-started' = 'sc-editing-started',
  'sc-editing-stopped' = 'sc-editing-stopped',
  'sc-show' = 'sc-show',
  'sc-hide' = 'sc-hide',
  'sc-hiding' = 'sc-hiding',
  'sc-showing' = 'sc-showing',
  'sc-after-show' = 'sc-after-show',
  'sc-after-hide' = 'sc-after-hide',
  'sc-action' = 'sc-action',
  'sc-select' = 'sc-select',
  'sc-input' = 'sc-input',
  'sc-focus' = 'sc-focus',
  'sc-blur' = 'sc-blur',
  'sc-bubble-input' = 'sc-bubble-input',
  'sc-active-step-changing' = 'sc-active-step-changing',
  'sc-active-step-changed' = 'sc-active-step-changed',
  'sc-drop-zone-value-change' = 'sc-drop-zone-value-change',
  'sc-tab-select' = 'sc-tab-select',
  'sc-tab-hide' = 'sc-tab-hide',
  'sc-tab-show' = 'sc-tab-show',
  'sc-error' = 'sc-error',
  'sc-load' = 'sc-load',
  'sc-loaded' = 'sc-loaded',
  'sc-remove' = 'sc-remove',
  'sc-search' = 'sc-search',
  'sc-clear' = 'sc-clear',
  'sc-close' = 'sc-close',
  'sc-advance-search-show' = 'sc-advance-search-show',
  'sc-advance-search-hide' = 'sc-advance-search-hide',
  'sc-loading' = 'sc-loading',
  'sc-locale-status' = 'sc-locale-status',
  'sc-validate-status' = 'sc-validate-status',
  'sc-tr-create' = 'sc-tr-create',
  'sc-tr-tap' = 'sc-tr-tap',
  'sc-tr-mouseover' = 'sc-tr-mouseover',
  'sc-tr-mouseout' = 'sc-tr-mouseout',
  'sc-sort' = 'sc-sort',
  'sc-direction-changed' = 'sc-direction-changed',
  'sc-page-change' = 'sc-page-change',
  'sc-first-updated' = 'sc-first-updated',
  'sc-year-updated' = 'sc-year-updated',
  'sc-month-updated' = 'sc-month-updated',
  'sc-filter' = 'sc-filter',
  'sc-tr-expanded' = 'sc-tr-expanded',
  'sc-timer-end' = 'sc-timer-end',
  'sc-timer-start' = 'sc-timer-start',
  'sc-timer-tick' = 'sc-timer-tick',
  'sc-duplication-add' = 'sc-duplication-add',
  'sc-duplication-remove' = 'sc-duplication-remove',
  'sc-cancel' = 'sc-cancel',
  'sc-loaded-items' = 'sc-loaded-items',
  'sc-remove-items' = 'sc-remove-items',
  'sc-select-items' = 'sc-select-items',
  'sc-cancel-items' = 'sc-cancel-items',
  'sc-file-button-value-change' = 'sc-file-button-value-change',
  'sc-card-click' = 'sc-card-click',
  'sc-mouseover' = 'sc-mouseover',
  'sc-mouseleave' = 'sc-mouseleave',
  'sc-dragging' = 'sc-dragging',
  'sc-dimension-update' = 'sc-dimension-update',
  'sc-master-expand' = 'sc-master-expand',
  'sc-group-expand' = 'sc-group-expand',
  'sc-expand' = 'sc-expand',
  'sc-mouse-down' = 'sc-expand',
  'sc-mouse-move' = 'sc-expand',
  'sc-mouse-up' = 'sc-expand',
  'sc-rte-revision-show' = 'sc-rte-revision-show',
  'sc-dragstart' = 'sc-dragstart',
  'sc-dragover' = 'sc-dragover',
  'sc-drop' = 'sc-drop',
  'sc-dragend' = 'sc-dragend',
  'sc-dragleave' = 'sc-dragleave',
  'sc-column-order' = 'sc-column-order',
  'sc-edit-save' = 'sc-edit-save',
  'sc-edit-cancel' = 'sc-edit-cancel',
}

const events = [
  'sc-table-focus',
  'sc-table-blur',
  'sc-table-click',
  'sc-context-trigger',
  'sc-range',
  'sc-column-order',
  'sc-column-visibility',
] as const;
export const INTERNAL_EVENTS = Enum(events);

/** Ensures that CustomEvent is properly typed */
export function customListener<T = Record<PropertyKey, unknown>, R = unknown>(
  fn: (event: CustomEvent<T>) => R | void,
): (event: Event) => R | void {
  return (event: Event) => {
    if (event instanceof CustomEvent) return fn(event);
  };
}
