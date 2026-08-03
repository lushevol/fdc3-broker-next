import { css } from 'lit';

export default css`
:host {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: visible;
  position: relative;
  line-height: 1.5;
  box-sizing: border-box;

  /* Constants */
  --_stroke-width: 0.125rem;
  --_focus-ring-color: var(--sc-avatar-focus-ring-color);

  /* Colors - defaults */
  --_bg-color: var(--sc-avatar-default-background-color);
  --_hover-stroke: var(--sc-avatar-hover-stroke-default);
  --_pressed-stroke: var(--sc-avatar-pressed-stroke-default);
  --_selected-stroke: var(--sc-avatar-selected-stroke-default);
  --_outline-stroke: var(--sc-avatar-default-background-color);
}

/* Stroke Overlay (for images) */
:host::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  pointer-events: none;
  box-sizing: border-box;
  z-index: 5;
  transition: box-shadow 0.15s ease;
}

::slotted(*) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border-radius: inherit;
  margin: 0;
  padding: 0;
  color: inherit;
}

:host img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border-radius: inherit;
}

svg {
  width: 60%;
  height: 60%;
  object-fit: cover;
}

.badge-container {
  position: absolute;
  width: max-content;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  pointer-events: none;
  z-index: 20;
}

.default-avatar {
  color: inherit;
}

sc-badge {
  position: relative;
  pointer-events: auto;
}

  /* ========================================================================== */
  /* LAYOUT HELPERS */
  /* ========================================================================== */

  .avatar-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .tooltip-overlay {
    display: block;
  }

  .avatar-box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: inherit;
    text-align: center;
    color: inherit;
  }

  :host(:not([data-has-image])) .avatar-box {
    position: absolute;
    top: 0;
    left: 0;
  }

  /* ========================================================================== */
  /* COLOR MAPPINGS */
  /* ========================================================================== */

  :host([background='red']) {
    --_bg-color: var(--sc-avatar-red-background-color);
    --_hover-stroke: var(--sc-avatar-hover-stroke-red);
    --_pressed-stroke: var(--sc-avatar-pressed-stroke-red);
    --_selected-stroke: var(--sc-avatar-selected-stroke-red);
    --_outline-stroke: var(--sc-avatar-red-background-color);
  }

  :host([background='green']) {
    --_bg-color: var(--sc-avatar-green-background-color);
    --_hover-stroke: var(--sc-avatar-hover-stroke-green);
    --_pressed-stroke: var(--sc-avatar-pressed-stroke-green);
    --_selected-stroke: var(--sc-avatar-selected-stroke-green);
    --_outline-stroke: var(--sc-avatar-green-background-color);
  }

  :host([background='blue']) {
    --_bg-color: var(--sc-avatar-blue-background-color);
    --_hover-stroke: var(--sc-avatar-hover-stroke-blue);
    --_pressed-stroke: var(--sc-avatar-pressed-stroke-blue);
    --_selected-stroke: var(--sc-avatar-selected-stroke-blue);
    --_outline-stroke: var(--sc-avatar-blue-background-color);
  }

  :host([background='yellow']) {
    --_bg-color: var(--sc-avatar-yellow-background-color);
    --_hover-stroke: var(--sc-avatar-hover-stroke-yellow);
    --_pressed-stroke: var(--sc-avatar-pressed-stroke-yellow);
    --_selected-stroke: var(--sc-avatar-selected-stroke-yellow);
    --_outline-stroke: var(--sc-avatar-yellow-background-color);
  }

  :host([background='default']),
  :host(:not([background])) {
    --_bg-color: var(--sc-avatar-default-background-color);
    --_hover-stroke: var(--sc-avatar-hover-stroke-default);
    --_pressed-stroke: var(--sc-avatar-pressed-stroke-default);
    --_selected-stroke: var(--sc-avatar-selected-stroke-default);
    --_outline-stroke: var(--sc-avatar-default-background-color);
  }

  :host([data-has-image]) {
    --_hover-stroke: var(--sc-avatar-hover-stroke-default);
    --_pressed-stroke: var(--sc-avatar-pressed-stroke-default);
    --_selected-stroke: var(--sc-avatar-selected-stroke-default);
    --_outline-stroke: var(--sc-avatar-outline-image-stroke);
  }

  /* ========================================================================== */
  /* TEXT COLOR LOGIC */
  /* ========================================================================== */

  /* Default (Filled) */
  :host(:not([outlined])) .avatar-box {
    color: var(--sc-color-white);
  }

  /* Outlined */
  :host([outlined]) .avatar-box {
    color: var(--_outline-stroke);
  }

  /* Disabled */
  :host([disabled]) .avatar-box {
    color: var(--sc-avatar-disabled-icon);
  }

  /* ========================================================================== */
  /* STROKE LOGIC (Applied to ::after to sit over images) */
  /* ========================================================================== */

  /* Outlined Static State */
  :host([outlined])::after {
    box-shadow: inset 0 0 0 var(--_stroke-width) var(--_outline-stroke);
  }

  /* Interactive States */
  :host([clickable]) {
    cursor: pointer;
    user-select: none;
  }

  /* Hover Stroke + Shadow */
  :host([clickable]:not([disabled]):hover)::after {
    /* Inner stroke */
    box-shadow: inset 0 0 0 var(--_stroke-width) var(--_hover-stroke),
    /* Outer shadow: x-offset y-offset blur color */
    0 0.125rem 0.25rem color-mix(in srgb, var(--sc-color-grey-900) 30%, transparent);
  }

  /* Pressed Stroke */
  :host([clickable]:not([disabled]):active)::after {
    box-shadow: inset 0 0 0 var(--_stroke-width) var(--_pressed-stroke);
  }

  /* Selected Stroke */
  :host([clickable][selected]:not([disabled]))::after {
    box-shadow: inset 0 0 0 var(--_stroke-width) var(--_selected-stroke);
  }

  /* Disabled Styling */
  :host([disabled]) {
    cursor: not-allowed;
    pointer-events: none;
    --_outline-stroke: var(--sc-avatar-disabled-stroke);
  }

  /* Disabled Outlined */
  :host([disabled][outlined])::after {
    box-shadow: inset 0 0 0 var(--_stroke-width)
      var(--sc-avatar-disabled-stroke);
  }

  /* Disabled Filled */
  :host([disabled]:not([outlined]))::after {
    box-shadow: inset 0 0 0 var(--_stroke-width)
      var(--sc-avatar-disabled-stroke);
  }

  /* ========================================================================== */
  /* FOCUS RING */
  /* ========================================================================== */

  :host(:focus) {
    outline: none;
  }

  :host([focus-enabled][clickable]:not([disabled]):focus-visible) {
    outline: var(--_stroke-width) solid var(--_focus-ring-color);
    outline-offset: 0.125rem;
  }
`;
