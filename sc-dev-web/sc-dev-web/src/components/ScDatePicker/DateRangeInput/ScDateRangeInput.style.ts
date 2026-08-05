import { css } from 'lit';

export const dateRangePickerInputStyling = css`
  :host {
    position: relative;
  }
  .container {
    display: flex;
  }
  .container sc-date-input {
    flex: 1;
    --sc-form-group-help-margin-top: 0;
  }
  .container .divider {
    position: absolute;
    margin-left: calc(50% - 3px);
    border-left: 1px solid var(--sc-date-picker-border-color);
  }

  .container .line-divider {
    height: 34.5px;
    margin-top: 10px;
  }
  .container .box-divider {
    height: 40px;
    margin-top: 1px;
  }

  .end-date-picker::part(surface) {
    margin-left: calc(-100% - 0.5rem);
  }

  .date-picker-focus::part(form-control):focus {
    border-color: var(--sc-form-input-focus-border-color);
  }

  .end-date-picker::part(form-control) {
    text-indent: 15px;
    position: relative;
  }


  .box-end-date-picker::part(form-control) {
    text-indent: 0px;
  }
  .date-range-input-gap {
    width: 0.5rem;
  }
`;
