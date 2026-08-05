import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
    overflow: auto;
  }

  sl-tree {
    --tree-item-spacing: 0.5rem;
    --tree-item-padding: 0.5rem;
    --tree-item-border-radius: 0.25rem;
  }

  .tree-with-lines {
    --indent-guide-width: 1px;
    --indent-guide-style: dashed;
  }

  /*
   * Override Shoelace's part(label) so it fills the remaining row width
   * after the expand toggle / checkbox, enabling proper text truncation.
   */
  sl-tree-item::part(label) {
    font-size: var(--sc-tree-font-size, 0.875rem);
    display: flex;
    align-items: center;
    /* stretch to fill all remaining row space */
    flex: 1 1 0;
    min-width: 0;
    color: var(--sc-list-navigation-title-color, var(--sc-color-blue-900));
  }

  /* Row: [icon] [label — grows & truncates] [actions — fixed right] */
  .tree-item-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    min-width: 0;
  }

  .tree-item-icon {
    flex: 0 0 1rem;
    width: 1rem;
    height: 1rem;
  }

  /* Label: takes all leftover space and clips with ellipsis */
  .tree-item-label {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Inline edit input — same row height as the label */
  .tree-item-edit-input {
    flex: 1 1 0;
    min-width: 0;
    width: 100%;
    padding: 0 0.25rem;
    height: 1.5rem;
    font-size: var(--sc-tree-font-size, 0.875rem);
    font-family: inherit;
    color: var(--sc-list-navigation-title-color, var(--sc-color-blue-900));
    background: var(--sc-color-white, #fff);
    border: 1px solid var(--sc-color-blue-500, #3b82f6);
    border-radius: 0.25rem;
    outline: none;
    box-sizing: border-box;
  }

  .tree-item-edit-input:focus {
    box-shadow: 0 0 0 2px var(--sc-color-blue-200, #bfdbfe);
  }

  /*
   * Actions slot wrapper — hidden by default, revealed on row hover/focus.
   * flex-shrink:0 prevents it from being squashed by a long label.
   * display:none when the slot is empty (no slotted nodes).
   */
  .tree-item-actions {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 120ms ease;
  }

  sl-tree-item:hover:not(:has(sl-tree-item:hover)) > .tree-item-content .tree-item-actions,
  sl-tree-item:not(:has(sl-tree-item:hover)) .tree-item-actions:focus-within {
    opacity: 1;
    pointer-events: auto;
  }

  .actions-always sl-tree-item .tree-item-actions {
    opacity: 1;
    pointer-events: auto;
  }

  sl-menu-item::part(label) {
    font-size: var(--sc-tree-option-font-size, 0.625rem);
  }

  sl-menu-item::part(item) ::part(expand-button) {
    padding: 0;
  }

  sl-tree-item::part(item--selected) {
    background-color: var(
      --sc-list-navigation-item-selected-background-color,
      var(--sc-color-blue-lightest)
    );
  }

  /* ── Drag & Drop ───────────────────────────────────────────────── */

  sl-tree-item[draggable='true'] {
    cursor: grab;
  }

  sl-tree-item[draggable='true']:active {
    cursor: grabbing;
  }

  /* Semi-transparent while being dragged — matches ScDataGrid draggable row opacity */
  sl-tree-item.dragging {
    opacity: var(--sc-data-grid-draggable-row-active, 0.4);
    will-change: transform;
  }

  /* Drop indicator: insert BEFORE
     Uses a 1px absolute pseudo-element line, same as ScDataGrid .draggable-row-indicator */
  sl-tree-item.drag-over-before {
    position: relative;
  }
  sl-tree-item.drag-over-before::before {
    content: '';
    position: absolute;
    top: 0;
    left: var(--_indicator-left, 0px);
    right: 0;
    height: 2px;
    background: var(--sc-color-blue-550-dark, var(--sc-color-blue-500, #2563eb));
    border-radius: 1px;
    z-index: 2;
    pointer-events: none;
  }

  /* Drop indicator: insert AFTER */
  sl-tree-item.drag-over-after {
    position: relative;
  }
  sl-tree-item.drag-over-after::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: var(--_indicator-left, 0px);
    right: 0;
    height: 2px;
    background: var(--sc-color-blue-550-dark, var(--sc-color-blue-500, #2563eb));
    border-radius: 1px;
    z-index: 2;
    pointer-events: none;
  }

  /* Drop indicator: drop INSIDE (nest as child)
     Subtle background highlight — no outline/border to keep visual consistency */
  sl-tree-item.drag-over-inside::part(item) {
    background-color: var(--sc-data-grid-body-cell-selected-bg-color, var(--sc-color-blue-lightest, #eff6ff));
    border-radius: var(--sl-border-radius-medium, 0.25rem);
    transition: background-color 60ms ease;
  }
`;
