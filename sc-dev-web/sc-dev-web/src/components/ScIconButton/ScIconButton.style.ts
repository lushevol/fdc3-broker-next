import { css } from 'lit';

export default css`  
  .sc-icon-button {
    --sc-button-display: var(--sc-icon-button-display, inline-block);
    --sc-button-width: auto;
  
    --sc-button-label-display: flex;
    --icon-button-box-sizing: border-box;
    --icon-button-border-radius: 50%;

    --icon-button-padding-lg: 0.25rem;
    --icon-button-height-lg: 3rem;
    --icon-button-width-lg: 3rem;
    --icon-button-font-size-lg: 1rem;
    --icon-button-label-line-height-lg: 1.5rem;
    
    --icon-button-padding-md: 0.25rem;
    --icon-button-height-md: 2.5rem;
    --icon-button-width-md: 2.5rem;
    --icon-button-font-size-md: 1.25rem;
    --icon-button-label-line-height-md: 1.5rem;
    
    --icon-button-padding-sm: 0.25rem;
    --icon-button-height-sm: 2rem;
    --icon-button-width-sm: 2rem;
    --icon-button-font-size-sm: 1rem;
    --icon-button-label-line-height-sm: 1.5rem;
    
    --icon-button-padding-xs: 0.25rem;
    --icon-button-height-xs: 1.75rem;
    --icon-button-width-xs: 1.75rem;
    --icon-button-font-size-xs: 0.75rem;
    --icon-button-label-line-height-xs: 1.25rem;
    
    --icon-button-padding-xxs: 0.25rem;
    --icon-button-height-xxs: 1.5rem;
    --icon-button-width-xxs: 1.5rem;
    --icon-button-font-size-xxs: 0.75rem;
    --icon-button-label-line-height-xxs: 0.75rem;
  }

  .sc-icon-button.no-border:not(.disabled) {
    --icon-button-padding-lg: 0;
    --icon-button-padding-md: 0;
    --icon-button-padding-sm: 0;
    --icon-button-padding-xs: 0;
    --icon-button-padding-xxs: 0;
    
    --icon-button-min-height-lg: 0;
    --icon-button-min-height-md: 0;
    --icon-button-min-height-sm: 0;
    --icon-button-min-height-xs: 0;
    --icon-button-min-height-xxs: 0;
  
    --sc-button-secondary-border-color: transparent;
    --sc-button-secondary-hover-border-color: transparent;
    --sc-button-secondary-press-border-color: transparent;
    
    --sc-button-secondary-inverse-border-color: transparent;
    
    --sc-button-secondary-warning-border-color: transparent;
    --sc-button-secondary-warning-hover-border-color: transparent;
    --sc-button-secondary-warning-press-border-color: transparent;
    
    --sc-button-secondary-error-border-color: transparent;
    --sc-button-secondary-error-hover-border-color: transparent;
    --sc-button-secondary-error-press-border-color: transparent;
    --sc-button-active-outline-color: transparent;
  }

  .sc-icon-button.no-border{
    --sc-button-disabled-border-color: transparent;
    --sc-button-active-outline-color: transparent;
  }
`;