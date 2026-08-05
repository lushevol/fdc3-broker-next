import { css } from 'lit';

export const yearGridStyling = css`
:host {
  --_border-width: 0px;
  --_col: var(--sc-year-grid-col, 40px);
  --_padding: 14px;
  --_margin: 10px;
  --_inset: 2px;
  --_row: 32px;
  --_col-n: 4;
  
  display: block;
  font-size: 0.875rem;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(var(--_col-n), minmax(calc(var(--_col) + var(--_padding)), auto));
  align-items: center;
  justify-items: center;
  margin-left: var(--sc-date-picker-grid-margin, 10px);
  width: var(-sc-date-picker-grid-width, calc(var(--_col) * var(--_col-n)));
}
@supports (scrollbar-width: thin) {
  .year-grid {
    scrollbar-width: thin;
  }
}

.year-grid-button,
.year-grid-button::before,
.year-grid-button::after {
  --_offset: calc(var(--_inset) + var(--_border-width));

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

.year-grid-button {
  min-width: calc(var(--_col) + var(--_padding));
  min-height: var(--_row);
  max-width: calc(var(--_col) + var(--_padding));
  max-height: var(--_row);
  margin-top: 5px;
  padding-right: 15px;
}

.year-grid-button::before,
.year-grid-button::after {
  margin-left: calc(0px - var(--_offset));
  margin-top: calc(0px - var(--_offset));
}

.year-grid-button.is-between {
  background: var(--_selected-range);
  border-radius: 0;
}

@media (any-hover: hover) {
  .year-grid-button:not([aria-disabled="true"]):hover {
    cursor: pointer;
  }
}

.year-grid-button::before,
.year-grid-button::after {
  content: attr(aria-label);

  position: absolute;
  pointer-events: none;
}

.year-grid-button::before {
  z-index: 1;
}
.year-grid-button:focus-visible::before,
.year-grid-button:hover::before {
  background-color: var(--_on-hover);
  color: var(--_selected-on-hover);
}

.year-grid-button[aria-selected="true"]::before {
  color: var(--_on-primary);
}

.year-grid-button.year--today {
  color: var(--_primary);
}

.year-grid-button::after {
  content: '';
}
.year-grid-button[aria-selected="true"]::after {
  background-color: var(--sc-date-picker-selected-background-color, var(--sc-color-blue-650));
}

.year-grid-button[aria-disabled="true"]::before {
  color: var(--_on-disabled);
}

.year-grid-button[aria-disabled="true"]:hover::before {
  background-color: transparent;
}
`;
