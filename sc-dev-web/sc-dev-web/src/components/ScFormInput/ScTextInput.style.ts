import { css } from 'lit';

export default css`
  :host {
    --sc-form-input-multiline-padding-top: 0.5rem;
    --sc-form-input-multiline-padding-right: 0.5rem;
  }
  textarea {
    resize: none;
    width: 100% !important;
    padding: 5px;
    box-sizing: border-box;
    order: 1;
  }

  textarea + sc-scrollbar {
    &:dir(ltr) {
      &::part(y) {
        border-top-right-radius: var(--sc-form-input-border-radius, none);
      }
      &::part(x) {
        border-bottom-left-radius: var(--sc-form-input-border-radius, none);
      }
    }
    &:dir(rtl) {
      &::part(y) {
        border-top-left-radius: var(--sc-form-input-border-radius, none);
      }
      &::part(x) {
        border-bottom-right-radius: var(--sc-form-input-border-radius, none);
      }
    }
  }
  .sc-form-group-readonly .sc-form-control {
    --sc-form-input-focus-border-color: transparent;
    --sc-form-control-border-color: transparent;
  }

  .sc-form-control.multiline {
    height: auto;
  }
  .sc-form-control.resizable {
    resize: vertical;
    min-height: 1.5em;
  }
  .sc-form-control.resizable-auto {
    height: 1.5em;
  }

  .more-icons-container, .suffix-container {
    display: flex;
    justify-content: center;
  }

  .sc-form-group-lg {
    --sc-form-input-multiline-padding-top: 0.625rem;
  }
  .sc-form-group-sm {
    --sc-form-input-multiline-padding-top: 0.375rem;
  }
  .sc-form-more-icons .more-icons-container.multiline-item {
    padding-top: var(--sc-form-input-multiline-padding-top, 0.5rem);
    align-items: flex-start;
  }
  .multiline-item .suffix-container, .multiline-item .suffix-text {
    padding-right: .25rem;
  }
  .multiline-item .suffix-text {
    margin-top: -.25rem;
  }

  .prefix-icon-item.multiline-item {
    height: fit-content;
    padding-top: var(--sc-form-input-multiline-padding-top, 0.5rem);
    padding-right: var(--sc-form-input-multiline-padding-right, 0.5rem);
  }
  
  .suffix {
    font-size: 0.875rem;
  }

  .suffix-text {
    color: var(--sc-form-control-color, var(--sc-color-blue-900));
  }

  .sc-form-group-sm .suffix {
    font-size: 0.75rem;
  }

  .sc-form-group-lg .suffix {
    font-size: 1rem;
  }

  .suffix-container .suffix-text {
    padding-left: 0.5rem;
  }

  .suffix-container sc-icon {
    color: var(--sc-text-input-suffix-icon-color, var(--sc-color-blue-500-dark))
  }

  .error-icon {
    color: var(--sc-text-input-error-color, var(--sc-color-red-500));
  }

  :host-context(sc-input-group) .error-icon {
    display: none;
  }

  .clear {
    cursor: pointer;
    display: flex;
    color: var(--sc-color-grey-150);
  }

  .character-count {
    order: 3;
    font-size: 0.625rem;
    flex-shrink: 0;
    margin-left: auto;
    margin-top: var(--sc-form-group-help-margin-top, 0.25rem);
  }

  .help-text-container{
    display:flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    gap: 0.625rem;
  }
`;