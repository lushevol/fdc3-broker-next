import { css } from 'lit';

export default css`
  /* ====== CONTAINER & LAYOUT ====== */

  .sc-pagination-container {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .sc-pagination-container.no-margin {
    margin-top: 0;
    margin-bottom: 0;
  }

  .sc-pagination-container.center {
    justify-content: center;
  }

  .sc-pagination-container.right {
    justify-content: flex-end;
  }

  .sc-pagination {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .sc-pagination input,
  .sc-pagination button {
    font-family: inherit;
  }

  /* ====== LABEL STYLES ====== */

  .sc-pagination-label {
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .sc-pagination-label.size-changer-quick-jumper {
    margin-right: 0.5rem;
  }

  .sc-pagination-label.xs {
    font-size: 0.6875rem;
    line-height: 1rem;
  }
  .sc-pagination-label.sm {
    font-size: 0.75rem;
    line-height: 1.125rem;
  }
  .sc-pagination-label.md {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .sc-pagination-label.lg {
    font-size: 1.125rem;
    line-height: 1.5rem;
  }
  .sc-pagination-label.xl {
    font-size: 1.3125rem;
    line-height: 1.75rem;
  }

  /* ====== BASE PAGINATION ITEM STYLES ====== */

  .sc-pagination .sc-pagination-item,
  .sc-pagination .sc-pagination-next,
  .sc-pagination .sc-pagination-prev,
  .sc-pagination .sc-pagination-last,
  .sc-pagination .sc-pagination-first,
  .sc-pagination .sc-pagination-jump-prev,
  .sc-pagination .sc-pagination-jump-next {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.25rem;
    border-radius: var(--sc-pagination-border-radius, 0.25rem);
    border: solid 0.0625rem var(--sc-pagination-border-color);
    background-color: var(--sc-pagination-background-color);
    color: var(--sc-pagination-color);
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    box-sizing: border-box;
  }

  .sc-pagination li {
    list-style: none;
  }

  .sc-pagination .sc-pagination-item-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .sc-pagination .sc-pagination-item > a > .sc-pagination-item-label {
    padding: 0 var(--sc-spacing-4, 0.25rem);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ====== SIZE VARIANTS - Dimensions ====== */

  .sc-pagination.xs .sc-pagination-item,
  .sc-pagination.xs .sc-pagination-next,
  .sc-pagination.xs .sc-pagination-prev,
  .sc-pagination.xs .sc-pagination-last,
  .sc-pagination.xs .sc-pagination-first,
  .sc-pagination.xs .sc-pagination-jump-prev,
  .sc-pagination.xs .sc-pagination-jump-next {
    min-width: 1.5rem;
    height: 1.5rem;
  }

  .sc-pagination.sm .sc-pagination-item,
  .sc-pagination.sm .sc-pagination-next,
  .sc-pagination.sm .sc-pagination-prev,
  .sc-pagination.sm .sc-pagination-last,
  .sc-pagination.sm .sc-pagination-first,
  .sc-pagination.sm .sc-pagination-jump-prev,
  .sc-pagination.sm .sc-pagination-jump-next {
    min-width: 1.75rem;
    height: 1.75rem;
  }

  .sc-pagination.md .sc-pagination-item,
  .sc-pagination.md .sc-pagination-next,
  .sc-pagination.md .sc-pagination-prev,
  .sc-pagination.md .sc-pagination-last,
  .sc-pagination.md .sc-pagination-first,
  .sc-pagination.md .sc-pagination-jump-prev,
  .sc-pagination.md .sc-pagination-jump-next {
    min-width: 2rem;
    height: 2rem;
  }

  .sc-pagination.lg .sc-pagination-item,
  .sc-pagination.lg .sc-pagination-next,
  .sc-pagination.lg .sc-pagination-prev,
  .sc-pagination.lg .sc-pagination-last,
  .sc-pagination.lg .sc-pagination-first,
  .sc-pagination.lg .sc-pagination-jump-prev,
  .sc-pagination.lg .sc-pagination-jump-next {
    min-width: 2.5rem;
    height: 2.5rem;
  }

  .sc-pagination.xl .sc-pagination-item,
  .sc-pagination.xl .sc-pagination-next,
  .sc-pagination.xl .sc-pagination-prev,
  .sc-pagination.xl .sc-pagination-last,
  .sc-pagination.xl .sc-pagination-first,
  .sc-pagination.xl .sc-pagination-jump-prev,
  .sc-pagination.xl .sc-pagination-jump-next {
    min-width: 3rem;
    height: 3rem;
  }

  /* ====== SIZE VARIANTS - Typography ====== */

  .sc-pagination.xs .sc-pagination-item,
  .sc-pagination.xs .sc-pagination-jump-prev,
  .sc-pagination.xs .sc-pagination-jump-next {
    font-size: 0.6875rem;
    line-height: 1rem;
  }

  .sc-pagination.sm .sc-pagination-item,
  .sc-pagination.sm .sc-pagination-jump-prev,
  .sc-pagination.sm .sc-pagination-jump-next {
    font-size: 0.75rem;
    line-height: 1.125rem;
  }

  .sc-pagination.md .sc-pagination-item,
  .sc-pagination.md .sc-pagination-jump-prev,
  .sc-pagination.md .sc-pagination-jump-next {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .sc-pagination.lg .sc-pagination-item,
  .sc-pagination.lg .sc-pagination-jump-prev,
  .sc-pagination.lg .sc-pagination-jump-next {
    font-size: 1.125rem;
    line-height: 1.5rem;
  }

  .sc-pagination.xl .sc-pagination-item,
  .sc-pagination.xl .sc-pagination-jump-prev,
  .sc-pagination.xl .sc-pagination-jump-next {
    font-size: 1.3125rem;
    line-height: 1.75rem;
  }

  /* ====== SIZE VARIANTS - Icons ====== */

  .sc-pagination.xs sc-icon {
    --sc-icon-size: 0.75rem;
  }
  .sc-pagination.sm sc-icon {
    --sc-icon-size: 0.875rem;
  }
  .sc-pagination.md sc-icon {
    --sc-icon-size: 1rem;
  }
  .sc-pagination.lg sc-icon {
    --sc-icon-size: 1.25rem;
  }
  .sc-pagination.xl sc-icon {
    --sc-icon-size: 1.5rem;
  }

  /* ====== SIZE VARIANTS - Spinners ====== */

  .sc-pagination.xs sc-spinner {
    font-size: 0.75rem;
  }
  .sc-pagination.sm sc-spinner {
    font-size: 0.875rem;
  }
  .sc-pagination.md sc-spinner {
    font-size: 1rem;
  }
  .sc-pagination.lg sc-spinner {
    font-size: 1.25rem;
  }
  .sc-pagination.xl sc-spinner {
    font-size: 1.5rem;
  }

  .sc-pagination sc-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ====== STATES - Hover ====== */

  .sc-pagination
    .sc-pagination-item:not(.active):not(.disabled):not(.loading):hover,
  .sc-pagination .sc-pagination-prev:not(.disabled):not(.loading):hover,
  .sc-pagination .sc-pagination-next:not(.disabled):not(.loading):hover,
  .sc-pagination .sc-pagination-first:not(.disabled):not(.loading):hover,
  .sc-pagination .sc-pagination-last:not(.disabled):not(.loading):hover,
  .sc-pagination .sc-pagination-jump-prev:not(.loading):hover,
  .sc-pagination .sc-pagination-jump-next:not(.loading):hover {
    border-color: var(
      --sc-pagination-hover-border-color,
      var(--sc-pagination-active-border-color)
    );
    color: var(--sc-pagination-hover-color);
  }

  /* ====== STATES - Active/Selected ====== */

  .sc-pagination .sc-pagination-item.active {
    background-color: var(--sc-pagination-active-background-color);
    border-color: var(--sc-pagination-active-border-color);
    color: var(--sc-pagination-active-color);
    font-weight: 600;
  }

  /* ====== STATES - Disabled ====== */

  .sc-pagination .sc-pagination-item.disabled,
  .sc-pagination .sc-pagination-prev.disabled,
  .sc-pagination .sc-pagination-next.disabled,
  .sc-pagination .sc-pagination-first.disabled,
  .sc-pagination .sc-pagination-last.disabled {
    background-color: var(--sc-pagination-disabled-background-color);
    border-color: var(--sc-pagination-disabled-border-color);
    color: var(--sc-pagination-disabled-color);
    cursor: not-allowed;
    pointer-events: none;
  }

  .sc-pagination .sc-pagination-prev.disabled sc-icon,
  .sc-pagination .sc-pagination-next.disabled sc-icon,
  .sc-pagination .sc-pagination-first.disabled sc-icon,
  .sc-pagination .sc-pagination-last.disabled sc-icon {
    color: var(--sc-pagination-disabled-color);
  }

  /* ====== STATES - Loading ====== */

  .sc-pagination .sc-pagination-item.loading,
  .sc-pagination .sc-pagination-prev.loading,
  .sc-pagination .sc-pagination-next.loading,
  .sc-pagination .sc-pagination-first.loading,
  .sc-pagination .sc-pagination-last.loading,
  .sc-pagination .sc-pagination-jump-prev.loading,
  .sc-pagination .sc-pagination-jump-next.loading {
    border-color: var(--sc-pagination-active-border-color);
    background-color: var(--sc-pagination-background-color);
    cursor: wait;
    pointer-events: none;
  }

  /* ====== JUMP PREV/NEXT (Ellipsis) ====== */

  .sc-pagination .sc-pagination-jump-prev,
  .sc-pagination .sc-pagination-jump-next {
    color: var(--sc-pagination-jump-color);
    border-color: var(--sc-pagination-jump-border-color);
  }

  /* ====== NAVIGATION BUTTONS ====== */

  .sc-pagination .sc-pagination-next,
  .sc-pagination .sc-pagination-prev,
  .sc-pagination .sc-pagination-last,
  .sc-pagination .sc-pagination-first {
    border-color: var(
      --sc-pagination-nav-border-color,
      var(--sc-pagination-border-color)
    );
    background-color: var(
      --sc-pagination-nav-background-color,
      var(--sc-pagination-background-color)
    );
  }

  /* ====== DOCUMENT MODE ====== */

  .sc-pagination li.document-info {
    margin: 0 0.75rem;
    color: var(--sc-pagination-document-color);
    cursor: default;
    display: flex;
    align-items: center;
    list-style: none;
  }

  .sc-pagination.xs li.document-info {
    font-size: 0.6875rem;
    line-height: 1rem;
  }
  .sc-pagination.sm li.document-info {
    font-size: 0.75rem;
    line-height: 1.125rem;
  }
  .sc-pagination.md li.document-info {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .sc-pagination.lg li.document-info {
    font-size: 1.125rem;
    line-height: 1.5rem;
  }
  .sc-pagination.xl li.document-info {
    font-size: 1.3125rem;
    line-height: 1.75rem;
  }

  /* ====== OPTIONS - Quick Jumper & Size Changer ====== */

  .sc-pagination-options {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .sc-pagination .sc-pagination-options-quick-jumper,
  .sc-pagination .sc-pagination-options-size-changer {
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
  }

  .sc-pagination .sc-pagination-go-to-text {
    margin: 0 0.5rem;
  }

  .sc-pagination.xs .sc-pagination-go-to-text {
    font-size: 0.6875rem;
  }
  .sc-pagination.sm .sc-pagination-go-to-text {
    font-size: 0.75rem;
  }
  .sc-pagination.md .sc-pagination-go-to-text {
    font-size: 0.875rem;
  }
  .sc-pagination.lg .sc-pagination-go-to-text {
    font-size: 1.125rem;
  }
  .sc-pagination.xl .sc-pagination-go-to-text {
    font-size: 1.3125rem;
  }

  /* ====== QUICK JUMPER INPUT ====== */

  .sc-pagination .sc-pagination-options-quick-jumper input {
    background: transparent;
    border: 0.0625rem solid
      var(--sc-pagination-input-border-color, var(--sc-pagination-border-color));
    border-radius: var(--sc-pagination-border-radius, 0.25rem);
    text-align: center;
    outline: none;
    color: var(--sc-pagination-input-color, var(--sc-pagination-color));
    box-sizing: border-box;
  }

  .sc-pagination .sc-pagination-options-quick-jumper input:focus {
    border-color: var(--sc-pagination-active-border-color);
  }

  .sc-pagination.xs .sc-pagination-options-quick-jumper input {
    height: 1.5rem;
    width: 2.5rem;
    font-size: 0.6875rem;
  }
  .sc-pagination.sm .sc-pagination-options-quick-jumper input {
    height: 1.75rem;
    width: 2.75rem;
    font-size: 0.75rem;
  }
  .sc-pagination.md .sc-pagination-options-quick-jumper input {
    height: 2rem;
    width: 3rem;
    font-size: 0.875rem;
  }
  .sc-pagination.lg .sc-pagination-options-quick-jumper input {
    height: 2.5rem;
    width: 3.5rem;
    font-size: 1.125rem;
  }
  .sc-pagination.xl .sc-pagination-options-quick-jumper input {
    height: 3rem;
    width: 4rem;
    font-size: 1.3125rem;
  }

  /* ====== SIZE CHANGER DROPDOWN ====== */

  .sc-pagination .sc-pagination-options-size-changer {
    display: flex;
    align-items: center;
    margin-top: 0.5rem; // Fixes alignment issue
  }

  /* xs */
  .sc-pagination .sc-pagination-options-size-changer.xs .size-changer-dropdown {
    width: 6.5rem;
  }
  /* sm */
  .sc-pagination .sc-pagination-options-size-changer.sm .size-changer-dropdown {
    width: 7rem;
  }
  /* md */
  .sc-pagination .sc-pagination-options-size-changer.md .size-changer-dropdown {
    width: 7.5rem;
  }
  /* lg */
  .sc-pagination .sc-pagination-options-size-changer.lg .size-changer-dropdown {
    width: 8rem;
  }
  /* xl */
  .sc-pagination .sc-pagination-options-size-changer.xl .size-changer-dropdown {
    width: 8.5rem;
  }

  /* ====== ACCESSIBILITY - Focus Styles ====== */

  .sc-pagination .sc-pagination-item:focus-visible,
  .sc-pagination .sc-pagination-prev:focus-visible,
  .sc-pagination .sc-pagination-next:focus-visible,
  .sc-pagination .sc-pagination-first:focus-visible,
  .sc-pagination .sc-pagination-last:focus-visible,
  .sc-pagination .sc-pagination-jump-prev:focus-visible,
  .sc-pagination .sc-pagination-jump-next:focus-visible {
    outline: 0.125rem solid
      var(
        --sc-pagination-focus-ring-color,
        var(--sc-pagination-active-border-color)
      );
    outline-offset: 0.125rem;
  }
`;
