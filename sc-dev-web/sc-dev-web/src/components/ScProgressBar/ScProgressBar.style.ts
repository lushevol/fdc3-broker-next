import { css } from 'lit';

export default css`
  .sc-progress-bar .progress-bar::part(base) {
    margin-top: 4px;
    background-color: var(--sc-progress-bar-background-color, var(--sc-color-grey-150));
  }

  .sc-progress-bar .progress-bar::part(indicator) {
    border-radius: 4px;
  }

  .sc-progress-bar .label {
    font-size: 0.75rem;
    font-weight: 400; 
    line-height: 1.25rem; 
    color: var(--sc-progress-bar-label-color, var(--sc-color-grey-650));
  }

  .sc-progress-bar .help-text {
    font-size: 0.625rem;
    margin-top: 4px;
    color: var(--sc-progress-bar-help-text-color, var(--sc-color-grey-600));
  }

  .sc-progress-bar .progress-bar::part(indicator), 
  .sc-progress-bar .progress-bar.success::part(indicator) {
    background-color: var(--sc-progress-bar-indicator-success-background-color, var(--sc-color-green-400));
  }

  .sc-progress-bar .progress-bar.info::part(indicator) {
    background-color: var(--sc-progress-bar-indicator-info-background-color, var(--sc-color-blue-400));
  }

  .sc-progress-bar .progress-bar.disabled::part(indicator) {
    background-color: var(--sc-progress-bar-indicator-disabled-background-color, var(--sc-color-grey-50));
  }

  .sc-progress-bar .progress-bar.warning::part(indicator) {
    background-color: var(--sc-progress-bar-indicator-warning-background-color, var(--sc-color-amber-400));
  }

  .sc-progress-bar .progress-bar.error::part(indicator) {
    background-color: var(--sc-progress-bar-indicator-error-background-color, var(--sc-color-red-400));
  }
`;