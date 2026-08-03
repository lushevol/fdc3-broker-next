import { css } from 'lit';

export const monthGridStyling = css`
:host {
  --_border-width: 0px;
  --_col: var(--sc-month-grid-col, 2.8125rem);
  --_padding: 0.625rem;
  --_margin: var(--sc-date-picker-grid-margin, 1.125rem);
  --_inset: 0.125rem;
  --_row: 2rem;
  --_col-n: 4;
  --_body-h: 12.375rem;

  display: block;
  font-size: 0.875rem;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(var(--_col-n), minmax(calc(var(--_col) + var(--_padding)), auto));
  align-items: center;
  justify-items: center;
  margin-left: var(--_margin);
  width: var(--sc-date-picker-grid-width, calc(var(--_col) * var(--_col-n)));
  margin-bottom: var(--sc-date-picker-month-grid-margin-top, 1.875rem);
  min-height: var(--date-picker-month-grid-min-height, var(--_body-h));
  max-height: var(--date-picker-month-grid-max-height, var(--_body-h));
}

:host([show-time]) .month-grid {
  grid-template-columns: repeat(var(--_col-n), calc(var(--_col) + var(--_padding)));
  width: var(--sc-date-picker-grid-width, calc((var(--_col) + var(--_padding)) * var(--_col-n)));
}
@supports (scrollbar-width: thin) {
  .month-grid {
    scrollbar-width: thin;
  }
}

.month-grid-button,
.month-grid-button::before,
.month-grid-button::after {
  --_offset: calc(var(--_inset) + var(--_border-width));;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  top: var(--_inset);
  right: var(--_inset);
  bottom: var(--_inset);
  left: var(--_inset);
  inset: var(--_inset);
  width: calc(var(--_col) + var(--_padding));
  height: var(--_row);
  border: var(--_border-width) solid var(--_border-color);
  border-radius: 0.25rem;
  outline: none;
}

.month-grid-button {
  min-width: calc(var(--_col) + var(--_padding));
  min-height: var(--_row);
  max-width: calc(var(--_col) + var(--_padding));
  max-height: var(--_row);
  margin-top: 1.875rem;
}

.month-grid-button::before,
.month-grid-button::after {
  margin-left: calc(0px - var(--_offset));
  margin-top: calc(0px - var(--_offset));
}

.month-grid-button.is-between {
  background: var(--_selected-range);
  border-radius: 0;
}

@media (any-hover: hover) {
  .month-grid-button:not([aria-disabled="true"]):hover {
    cursor: pointer;
  }
}

.month-grid-button::before,
.month-grid-button::after {
  content: attr(aria-label);

  position: absolute;
  pointer-events: none;
}

.month-grid-button::before {
  z-index: 1;
}
.month-grid-button:focus-visible::before,
.month-grid-button:hover::before {
  background-color: var(--_on-hover);
  color: var(--_selected-on-hover);
}

.month-grid-button[aria-selected="true"]::before {
  color: var(--_on-primary);
}

.month-grid-button.month--today {
  color: var(--_primary);
}

.month-grid-button::after {
  content: '';
}

.month-grid-button[aria-selected="true"]::after {
  background-color: var(--sc-date-picker-selected-background-color, var(--sc-color-blue-650));
}

.month-grid-button[aria-disabled="true"]::before {
  color: var(--_on-disabled);
}

.month-grid-button[aria-disabled="true"]:hover::before {
  background-color: transparent;
}
`;
