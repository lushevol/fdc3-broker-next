import { css } from 'lit';

export default css`
  .sc-label {
    font-size: var(--sc-label-font-size, 0.875rem);
    line-height: var(--sc-label-line-height, 1.375rem);
    margin-bottom: var(--sc-label-margin-bottom, 0.25rem);
    color: var(--sc-label-color, var(--sc-color-grey-650));
  }
  .sc-label-left {
    display: flex;
    justify-content: space-between;
  }
  
  .sc-label-base {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .sc-label-base.label-right {
    flex-direction: row-reverse;
  }

  .sc-label .label{
    font-weight: 500;
    color: var(--sc-label-color, var(--sc-color-grey-650));
  }

  .margin-4{
    margin-left: 4px;
  }

  .sc-label-base.sc-truncate .label-box {
    min-width: 0;
  }
  
  .sc-label-wrapper {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
  }

  .trust-point-suffix, .trust-point-prefix {
    display: none;
  }

  .trust-point-suffix {
    width: 10px;
  }

  .trust-point-suffix:before {
    color: var(--sc-label-trust-point-suffix-color, var(--sc-color-green-500));
    content: "]]";
  }

  .trust-point-prefix:after {
    color: var(--sc-label-trust-point-prefix-color, var(--sc-color-blue-500));
    content: "[[";
  }

  .sc-label-base.trustpoint .trust-point-prefix,
  .sc-label-base.trustpoint .trust-point-suffix{
    display: block;
  }

  .sc-label-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
 
  .sc-label-base ::slotted([slot='tooltip']), .sc-label-base .sc-label-tooltip {
    margin-left: 4px;
  }
  .sc-label-base .sc-label-tooltip {
    display: flex;
  }
  .sc-label-base .sc-label-tooltip sc-icon{
    color: var(--sc-label-icon-color, var(--sc-color-blue-500));
  }

  .sc-label-base .sc-label-hint sc-tooltip{
    --sc-tooltip-background-color: var(--sc-label-icon-color, var(--sc-color-blue-500));
  }
  .sc-label-base .sc-label-hint{
    position: absolute;
    right: 0;
  }
  .sc-label-base .sc-label-hint sc-icon{
    color: var(--sc-label-icon-color, var(--sc-color-blue-500));
  }
  .sc-label-left .sc-label-tooltip, .sc-label-right .sc-label-tooltip {
    color: var(--sc-label-icon-color, var(--sc-color-blue-500));
  }

  .sc-label-base .no-label {
    margin-left: 0;
  }
  
  .sc-label .required {
    color: var(--sc-form-group-label-required-color, var(--sc-color-red-500));
    margin-left: 0.25rem;
  }

  .sc-label .required.no-others {
    margin-left: 0;
  }
`;
