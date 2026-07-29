import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    box-sizing: border-box;
    position: relative;

    /* Border radius - can be overridden by parent group */
    --_border-radius: 0;
    --_border-radius-top-left: var(--_border-radius);
    --_border-radius-top-right: var(--_border-radius);
    --_border-radius-bottom-left: var(--_border-radius);
    --_border-radius-bottom-right: var(--_border-radius);

    /* Default Setup (Neutral) */
    --_icon-color: var(--sc-status-neutral-icon);
    --_count-color: var(--sc-status-neutral-count);
    --_hover-bg: var(--sc-status-neutral-hover-bg);
    --_pressed-bg: var(--sc-status-neutral-pressed-bg);
    --_selected-bg: var(--sc-status-neutral-selected-bg);
    --_selected-icon: var(--sc-status-neutral-selected-icon);
    --_selected-text: var(--sc-status-neutral-selected-text);
    --_selected-count: var(--sc-status-neutral-selected-count);
  }

  /* ===== TYPE PALETTE MAPPINGS ===== */

  /* --- Neutral Group (Grey) --- */

  :host([type='locked']),
  :host([type='on-hold']) {
    --_icon-color: var(--sc-status-neutral-icon-light);
  }

  :host([type='archived']) {
    --_icon-color: var(--sc-status-neutral-icon);
  }

  :host([type='draft']),
  :host([type='missing']) {
    --_icon-color: var(--sc-status-neutral-icon-dark);
  }

  /* --- Info Group (Blue) --- */

  :host([type='information']) {
    --_icon-color: var(--sc-status-info-icon);
    --_count-color: var(--sc-status-info-count);
    --_hover-bg: var(--sc-status-info-hover-bg);
    --_pressed-bg: var(--sc-status-info-pressed-bg);
    --_selected-bg: var(--sc-status-info-selected-bg);
    --_selected-icon: var(--sc-status-info-selected-icon);
    --_selected-text: var(--sc-status-info-selected-text);
    --_selected-count: var(--sc-status-info-selected-count);
  }

  :host([type='in-progress']) {
    --_icon-color: var(--sc-status-info-icon-medium);
    --_count-color: var(--sc-status-info-count-dark);
    --_hover-bg: var(--sc-status-info-hover-bg);
    --_pressed-bg: var(--sc-status-info-pressed-bg);
    --_selected-bg: var(--sc-status-info-selected-bg);
    --_selected-icon: var(--sc-status-info-selected-icon-alt);
    --_selected-text: var(--sc-status-info-selected-text);
    --_selected-count: var(--sc-status-info-selected-count);
  }

  :host([type='complete']) {
    --_icon-color: var(--sc-status-info-icon-dark);
    --_count-color: var(--sc-status-info-count-dark);
    --_hover-bg: var(--sc-status-info-hover-bg);
    --_pressed-bg: var(--sc-status-info-pressed-bg);
    --_selected-bg: var(--sc-status-info-selected-bg);
    --_selected-icon: var(--sc-status-info-selected-icon);
    --_selected-text: var(--sc-status-info-selected-text);
    --_selected-count: var(--sc-status-info-selected-count);
  }

  /* --- Success Group (Green) --- */

  :host([type='success']) {
    --_icon-color: var(--sc-status-success-icon);
    --_count-color: var(--sc-status-success-count);
    --_hover-bg: var(--sc-status-success-hover-bg);
    --_pressed-bg: var(--sc-status-success-pressed-bg);
    --_selected-bg: var(--sc-status-success-selected-bg);
    --_selected-icon: var(--sc-status-success-selected-icon);
    --_selected-text: var(--sc-status-success-selected-text);
    --_selected-count: var(--sc-status-success-selected-count);
  }

  /* --- Warning Group (Amber) --- */

  :host([type='warning']),
  :host([type='pending']) {
    --_icon-color: var(--sc-status-warning-icon);
    --_count-color: var(--sc-status-warning-count);
    --_hover-bg: var(--sc-status-warning-hover-bg);
    --_pressed-bg: var(--sc-status-warning-pressed-bg);
    --_selected-bg: var(--sc-status-warning-selected-bg);
    --_selected-icon: var(--sc-status-warning-selected-icon);
    --_selected-text: var(--sc-status-warning-selected-text);
    --_selected-count: var(--sc-status-warning-selected-count);
  }

  /* --- Danger Group (Red) --- */

  :host([type='error']),
  :host([type='rejected']) {
    --_icon-color: var(--sc-status-danger-icon);
    --_count-color: var(--sc-status-danger-count);
    --_hover-bg: var(--sc-status-danger-hover-bg);
    --_pressed-bg: var(--sc-status-danger-pressed-bg);
    --_selected-bg: var(--sc-status-danger-selected-bg);
    --_selected-icon: var(--sc-status-danger-selected-icon);
    --_selected-text: var(--sc-status-danger-selected-text);
    --_selected-count: var(--sc-status-danger-selected-count);
  }

  /* --- Caution Group (Orange) --- */

  :host([type='minor-error']) {
    --_icon-color: var(--sc-status-caution-icon);
    --_count-color: var(--sc-status-caution-count);
    --_hover-bg: var(--sc-status-caution-hover-bg);
    --_pressed-bg: var(--sc-status-caution-pressed-bg);
    --_selected-bg: var(--sc-status-caution-selected-bg);
    --_selected-icon: var(--sc-status-caution-selected-icon);
    --_selected-text: var(--sc-status-caution-selected-text);
    --_selected-count: var(--sc-status-caution-selected-count);
  }

  /* --- Critical Group (Black/White) --- */

  :host([type='critical']) {
    --_icon-color: var(--sc-status-critical-icon);
    --_count-color: var(--sc-status-critical-count);
    --_hover-bg: var(--sc-status-critical-hover-bg);
    --_pressed-bg: var(--sc-status-critical-pressed-bg);
    --_selected-bg: var(--sc-status-critical-selected-bg);
    --_selected-icon: var(--sc-status-critical-selected-icon);
    --_selected-text: var(--sc-status-critical-selected-text);
    --_selected-count: var(--sc-status-critical-selected-count);
  }

  /* ===== ITEM LAYOUT ===== */

  .item {
    display: inline-flex;
    align-items: center;
    width: var(--_item-width, 15rem); /* Default width for individual items */
    min-width: 8.75rem;
    padding: 1rem 0.75rem;
    border: 1px solid var(--sc-status-filter-border);
    border-radius: var(--_border-radius-top-left)
      var(--_border-radius-top-right) var(--_border-radius-bottom-right)
      var(--_border-radius-bottom-left);
    background-color: var(--sc-status-filter-bg);
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    user-select: none;
    box-sizing: border-box;
    font-family: var(--sc-font-family);
  }

  .content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .icon {
    flex-shrink: 0;
    color: var(--_icon-color);
  }

  .label {
    flex: 1;
    min-width: 0;
    font-weight: 500;
    color: var(--sc-status-filter-text);
    --sc-paragraph-color: var(--sc-status-filter-text);
  }

  .count {
    flex-shrink: 0;
    font-weight: 700;
    margin-left: 0.5rem;
    color: var(--_count-color);
    --sc-paragraph-color: var(--_count-color);
  }

  /* ===== RESPONSIVE (Tablet/Mobile) ===== */

  @media (max-width: 48rem) {
    .item {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-width: 5rem;
      min-height: 5rem;
      padding: 0.5rem;
      gap: 0.25rem;
    }

    .content {
      width: 100%;
      max-width: 7rem;
      justify-content: center;
      flex: 0;
    }

    .label {
      flex: 0 1 auto;
    }

    .count {
      margin-left: 0;
      margin-top: 0;
      text-align: center;
    }
  }

  /* ===== INTERACTION STATES ===== */

  /* Hover */
  .item:hover:not(.disabled):not(.selected) {
    background-color: var(--_hover-bg);
    border-color: var(--sc-status-filter-hover-border-color, transparent);
  }

  /* Pressed/Active */
  .item:active:not(.disabled):not(.selected) {
    background-color: var(--_pressed-bg);
    border-color: transparent;
  }

  /* Selected */
  .item.selected {
    background-color: var(--_selected-bg);
    border-color: transparent;
  }

  .item.selected .icon {
    color: var(--_selected-icon);
  }

  .item.selected .label {
    color: var(--_selected-text);
    --sc-paragraph-color: var(--_selected-text);
  }

  .item.selected .count {
    color: var(--_selected-count);
    --sc-paragraph-color: var(--_selected-count);
  }

  /* ===== FOCUS RING ===== */

  .item:focus {
    outline: none;
  }

  .item:focus-visible {
    outline: 2px solid var(--sc-status-filter-focus-ring);
    outline-offset: 2px;
    z-index: 3;
  }

  /* ===== DISABLED STATE ===== */

  .item.disabled {
    background-color: var(--sc-status-filter-disabled-bg);
    border-color: var(--sc-status-filter-border);
    cursor: not-allowed;
  }

  .item.disabled.selected {
    background-color: var(--sc-status-filter-disabled-bg);
    border-color: var(--sc-status-filter-border);
  }

  .item.disabled.selected .icon {
    color: var(--_icon-color);
  }

  .item.disabled.selected .label {
    color: var(--sc-status-filter-text);
    --sc-paragraph-color: var(--sc-status-filter-text);
  }

  .item.disabled.selected .count {
    color: var(--_count-color);
    --sc-paragraph-color: var(--_count-color);
  }
`;
