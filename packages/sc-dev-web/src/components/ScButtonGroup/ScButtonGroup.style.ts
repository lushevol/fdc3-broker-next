import { css } from 'lit';

export default css`  
  :host {
      --sc-input-icon-top: 0.6875rem;
      --sc-form-readonly-margin-left: 0;
  }

  div.sc-button-group {
    padding-left: 0 !important;
    display: block;
    max-width: 100%;
    font-size: 0.875rem;
    line-height: 1.375rem;
    height: var(--height, auto);
    
    &.size-sm {
      --height: var(--sc-button-height-xs, 1.75rem);
      --font-size: var(--sc-button-font-size-sm, 0.75rem);
    }
    &.size-md {
      --height: var(--sc-button-height-sm, 2rem);
      --font-size: var(--sc-button-font-size-sm, 0.875rem);
    }
    &.size-lg {
      --height: var(--sc-button-height-md, 2.5rem);
      --font-size: var(--sc-button-font-size-md, 1rem);
    }
    

    .sc-button-group-container {
      width: var(--sc-button-group-container-width, auto);
    }

    div[part='inputs'] {
      display: flex;
      font-size: 0.875rem;
      line-height: 1.375rem;
    }
    &:not(.has-lower-text).readonly .sc-button-group-container {
      display: none;
    }

    div[part='selected-values'] {
      display: none;
      font-size: var(--font-size);

      & > div:not(:last-of-type)::after {
        content: ', ';
      }

      :not(.has-lower-text).readonly & {
        display: block;
        
        & > div {
          display: inline;
          line-height: var(--height);
        }
      }

      :not(.has-lower-text).readonly.sc-truncate & {
        display: flex;
        height: 100%;
        align-items: center;
        gap: 0.125rem;
      }
      
      .sc-truncate & > div {
        flex: 1;
        min-width: 0;
        max-width: max-content;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  
  .separator {
    margin-right: 0.25rem;
  }

  .sc-form-group-icon {
    display: none;
  }

  .sc-button-group-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sc-button-group-lower-text {
    display: flex;
    justify-content: space-between;
    margin-top: .5rem;
    font-size: .625rem;
    line-height: 1.125rem;
  }

  sc-dropdown-input {
    --sc-dropdown-min-width: 100dvw;
    --sc-dropdown-menu-margin-top: 0;
    display: inline-block;
    max-width: 100%;

    div[slot='trigger'] {
      display: flex;

      sc-button {
        --sc-button-border-radius-md: .375rem 0 0 .375rem;
        margin-right: -1px;
        flex: 1;
        min-width: 0;
        
        &:hover {
          z-index: 1;
        }
      }
      sc-icon-button {
        --sc-button-border-radius-md: 0 .375rem .375rem 0;
        --sc-button-primary-background-color: var(--sc-button-secondary-background-color, var(--sc-color-white));
        --sc-button-primary-text-color: var(--sc-button-secondary-text-color, var(--sc-color-black));
        --sc-button-primary-border-color: var(--sc-button-secondary-border-color, var(--sc-color-grey-200));
        --sc-button-primary-error-background-color: var(--sc-button-secondary-error-background-color, var(--sc-color-white));
        --sc-button-primary-error-text-color: var(--sc-button-secondary-error-text-color, var(--sc-color-red-650));
        --sc-button-primary-error-border-color: var(--sc-button-secondary-error-border-color, var(--sc-color-red-650));
      }

      :host([error]) & {
        sc-button, sc-icon-button {
          --sc-button-primary-disabled-border-color: var(--sc-button-primary-error-border-color, var(--sc-color-red-650));
          --sc-button-secondary-disabled-border-color: var(--sc-button-secondary-error-border-color, var(--sc-color-red-650));
        }
      }
    }
  }
`;