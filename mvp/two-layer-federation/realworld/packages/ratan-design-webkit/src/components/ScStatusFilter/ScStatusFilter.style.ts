import { css } from 'lit';

export default css`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
  }

  .filter-group {
    display: grid;
    grid-template-columns: repeat(var(--_columns, 6), 1fr);
    width: 100%;
  }

  /* ===== SLOTTED ITEMS LAYOUT ===== */

  ::slotted(sc-status-filter-item) {
    position: relative;

    /* Full width item when grouped in grid */
    --_item-width: 100%;

    /* Negative margins to collapse borders */
    margin-left: -1px;
    margin-top: -1px;

    /* Default: No Radius */
    --_border-radius: 0;

    /* Force visible border on hover when grouped */
    --sc-status-filter-hover-border-color: var(--sc-status-filter-border);
  }

  /* First column: no left margin (JS-based) */
  ::slotted(sc-status-filter-item[data-first-col]) {
    margin-left: 0;
  }

  /* First row: no top margin (JS-based) */
  ::slotted(sc-status-filter-item[data-first-row]) {
    margin-top: 0;
  }

  /* Bring hovered/focused items to front */
  ::slotted(sc-status-filter-item:focus-visible),
  ::slotted(sc-status-filter-item:hover) {
    z-index: 2;
  }

  /* ===== BORDER RADIUS (JS-based position tracking) ===== */

  /* Top Left Corner */
  ::slotted(sc-status-filter-item[data-tl]) {
    --_border-radius-top-left: 0.375rem;
  }

  /* Top Right Corner */
  ::slotted(sc-status-filter-item[data-tr]) {
    --_border-radius-top-right: 0.375rem;
  }

  /* Bottom Left Corner */
  ::slotted(sc-status-filter-item[data-bl]) {
    --_border-radius-bottom-left: 0.375rem;
  }

  /* Bottom Right Corner */
  ::slotted(sc-status-filter-item[data-br]) {
    --_border-radius-bottom-right: 0.375rem;
  }

  /* ===== DISABLED STATE ===== */
  :host([disabled]) {
    cursor: not-allowed;
  }
`;
