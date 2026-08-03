import { css } from 'lit';

export const absoluteHidden = css`[hidden] { display: none !important; }`;

export const baseStyling = css`
:host {
  --_focus: var(--sc-date-picker-focus, var(--sc-color-blue-900));
  --_hover: var(--sc-date-picker-hover, #6200ee);
  --_on-disabled: var(--sc-date-picker-on-disabled, var(--sc-color-grey-400));
  --_on-focus: var(--sc-date-picker-on-focus, var(--sc-color-blue-900));
  --_on-hover: var(--sc-date-picker-on-hover, var(--sc-color-blue-100));
  --_on-primary: var(--sc-date-picker-on-primary, var(--sc-color-white));
  --_on-surface: var(--sc-date-picker-on-surface, var(--sc-color-blue-900));
  --_on-today: var(--sc-date-picker-on-today, var(--sc-color-blue-900));
  --_on-today: var(--sc-date-picker-on-today, var(--sc-color-blue-900));
  --_on-week-number: var(--sc-date-picker-on-week-number, #8c8c8c);
  --_on-weekday: var(--sc-date-picker-on-weekday, var(--sc-color-blue-darkest));
  --_primary: var(--sc-date-picker-primary, var(--sc-color-blue-500));
  --_selected-range: var(--sc-date-picker-selected-range, var(--sc-color-blue-50));
  --_selected-focus: var(--sc-date-picker-selected-focus, var(--sc-color-blue-900));
  --_selected-hover: var(--sc-date-picker-selected-hover, #6200ee);
  --_selected-on-focus: var(--sc-date-picker-selected-on-focus, var(--sc-color-white));
  --_selected-on-hover: var(--sc-date-picker-selected-on-hover, var(--sc-color-blue-450));
  --_shape: var(--sc-date-picker-shape, 4px);
  --_surface: var(--sc-date-picker-surface, var(--sc-color-white));
  --_today: var(--sc-date-picker-today, var(--sc-color-blue-900));
}
`;

export const resetAnchor = css`
a {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  position: relative;
  display: inline-block;
  background: initial;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  text-decoration: none;
  outline: none;
}
a:focus:not(:focus-visible) {
  text-decoration: none;
}
a:focus-visible {
  text-decoration: underline;
}
`;

export const resetButton = css`
button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  background: none; /** NOTE: IE11 fix */
  color: inherit;
  border: none;
  font: inherit;
  text-align: left;
  text-transform: inherit;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
`;

export const resetShadowRoot = css`
:host {
  position: relative;
}

* {
  box-sizing: border-box;
}
`;

export const resetSvgIcon = css`
svg {
  display: block;
  min-width: var(--svg-icon-min-width, 24px);
  min-height: var(--svg-icon-min-height, 24px);
  fill: var(--svg-icon-fill, currentColor);
  pointer-events: none;
}
`;

export const webkitScrollbarStyling = css`
/**
 * NOTE: Webkit-specific scrollbar styling
 */

::-webkit-scrollbar {
  width: 0.25rem;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  width: inherit;
  background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-500));
  border-radius: 0.25rem;
}
`;
