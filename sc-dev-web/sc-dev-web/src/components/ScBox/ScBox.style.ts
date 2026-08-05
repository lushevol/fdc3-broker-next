import { css } from 'lit';

export default css`
  .sc-box.sc-box-view-default {
    padding-right: 1px;
    padding-bottom: 4px;
  }
  
  .sc-box-content {
    border-radius: none;
    background-color: var(--sc-box-default-background-color, var(--sc-color-white));
    color: var(--sc-box-default-text-color, var(--sc-color-blue-900));
  }
  
  .sc-box-view-default .sc-box-content {
    box-shadow: var(--sc-box-shadow-color) 0px 1px 4px 0px;
  }
  
  .sc-box-view-outline .sc-box-content {
    border: 1px solid var(--sc-box-border-color, var(--sc-color-grey-150));
  }
  
  .sc-box-type-default {
    background-color: var(--sc-box-default-background-color, var(--sc-color-white));
    color: var(--sc-box-default-text-color, var(--sc-color-blue-900));
  }
  
  .sc-box-type-transparent {
    background-color: var(--sc-box-background-color, transparent);
    color: var(--sc-box-text-color, var(--sc-color-blue-900));
  }
  
  .sc-box-type-info {
    background-color: var(--sc-box-info-background-color, var(--sc-color-blue-100));
    color: var(--sc-box-info-text-color, var(--sc-color-blue-650));
  }
  
  .sc-box-type-success {
    background-color: var(--sc-box-success-background-color, var(--sc-color-green-100));
    color: var(--sc-box-success-text-color, var(--sc-color-green-700));
  }
  
  .sc-box-type-warning {
    background-color: var(--sc-box-warning-background-color, var(--sc-color-amber-150));
    color: var(--sc-box-warning-text-color, var(--sc-color-amber-550));
  }
  
  .sc-box-type-error {
    background-color: var(--sc-box-error-background-color, var(--sc-color-red-50));
    color: var(--sc-box-error-text-color, var(--sc-color-red-700));
  }
  
  .sc-box-type-disabled {
    background-color: var(--sc-box-disabled-background-color, var(--sc-color-grey-100));
    color: var(--sc-box-disabled-text-color, var(--sc-color-blue-900));
  } 
`;
