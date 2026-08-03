import { css } from 'lit';

export const dateRangePickerStyling = css`
:host {
  --_shape: 0.5rem;
  --sc-date-picker-border-color: transparent;
  --sc-date-picker-box-shadow: none;
}

.sc-date-range-picker-start {
  --sc-date-picker-border-radius: 0.5rem 0 0 0.5rem;
}

.sc-date-range-picker-end {
  --sc-date-picker-border-radius: 0 0.5rem 0.5rem 0;
}

.container {
  display: flex;
  flex-direction: var(--sc-date-range-container-direction);
}

.container:not(.without-border) {
  border: 1px solid var(--sc-date-range-border-color, var(--sc-color-grey-150));
  box-shadow: var(--sc-date-range-box-shadow, 0px 0.5rem 1.5rem 0px rgba(26, 26, 26, 0.15));
  border-radius: var(--_shape);
  width: fit-content;
}

.date-range-picker-gap {
  width: 0.5rem;
}
`;
