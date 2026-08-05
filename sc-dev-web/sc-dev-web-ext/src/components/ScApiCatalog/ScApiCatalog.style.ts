import { css } from 'lit';

export default css`
  :host {
    position: relative;
    display: block;
  }
  sc-text-input {
    --sc-form-readonly-margin-left: 0;

    sc-card[slot='form-control'] {
      outline: none;

      &::part(base) {
        border: var(--sc-form-input-border, 1px solid transparent);
        border-bottom: 1px solid
          var(--sc-form-input-border-color, var(--sc-color-grey-150));
        border-radius: var(--sc-form-input-border-radius, none);
        cursor: pointer;
      }
      &::part(text) {
        padding: 0.75rem 1rem !important;
        height: 3.1875rem !important;
      }
      [disabled] > &::part(base) {
        background-color: var(
          --sc-form-disabled-input-background-color,
          var(--sc-color-grey-50)
        );
        cursor: not-allowed;
      }
      [readonly] > &::part(base) {
        cursor: auto;
      }

      :not([readonly]):not([disabled]) > &:focus-visible::part(base) {
        outline: 2px solid
          var(--sc-form-input-focus-outline-color, var(--sc-color-blue-100));
      }

      [border-type='box']:not([readonly]):not([disabled]) > &:hover,
      [border-type='box']:not([readonly]):not([disabled]) > &:focus {
        &::part(base) {
          border-color: var(
            --sc-form-input-focus-border-color,
            var(--sc-color-blue-500)
          );
        }
      }
      [border-type='line']:not([readonly]):not([disabled]) > &:hover,
      [border-type='line']:not([readonly]):not([disabled]) > &:focus {
        &::part(base) {
          border: var(--sc-form-input-border, 1px solid transparent);
          border-bottom: var(
            --sc-form-input-border,
            1px solid
              var(--sc-form-input-focus-border-color, var(--sc-color-blue-500))
          );
        }
      }

      sc-text-input[error] &::part(base) {
        border: var(
          --sc-form-input-error-border,
          var(--sc-form-input-border, 1px solid transparent)
        );
        border-bottom: 1px solid
          var(--sc-form-input-error-border-color, var(--sc-color-red-500));
      }
      sc-text-input[success] &::part(base) {
        border: var(
          --sc-form-input-success-border,
          var(--sc-form-input-border, 1px solid transparent)
        );
        border-bottom: var(
          --sc-form-input-success-border,
          var(
            --sc-form-input-border,
            1px solid
              var(
                --sc-form-input-success-border-color,
                var(--sc-color-green-700)
              )
          )
        );
      }

      [slot='title'],
      [slot='body'] {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }

      .placeholder {
        line-height: 3.1875rem;
      }

      sc-spinner[slot='suffix'] {
        margin-left: 0.5rem;
      }
    }
  }

  .modal-content {
    display: flex;
    justify-content: stretch;
    gap: 1.5rem;
    height: 60dvh;
    min-height: 100%;

    .column {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      transition: width 0.3s linear;
      overflow: hidden;
      min-width: 0;

      &.api {
        flex: 1;
        min-width: 0;
      }
      &.end-pt {
        width: 0;
        &.has-selected {
          width: 18rem;
        }
      }

      sc-scrollbar {
        flex: 1;
        min-height: 0;
      }
    }

    .scroll-results {
      height: 100%;
      overflow: hidden auto;
      padding: 1px 1px 1rem;
      gap: 1rem;

      &.grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
      }
      &.list {
        display: flex;
        flex-direction: column;
      }

      .no-results {
        grid-column: 1 / -1;
        text-align: center;
        align-self: center;
        margin: auto;
      }
      sc-spinner {
        grid-column: 1 / -1;
        text-align: center;
        align-self: center;
        margin: auto;
      }
    }

    sc-card {
      [slot='title'],
      [slot='body'] {
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
      [slot='body'] {
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }

      &.selected {
        position: sticky;
        top: 0;
        bottom: -1rem;
        z-index: 1;
        --sc-card-background: var(
          --sc-card-selected-background,
          var(--sc-color-blue-50)
        );
        --sc-card-background-color: var(
          --sc-card-selected-background,
          var(--sc-color-blue-50)
        );
        --sc-card-border-color: var(
          --sc-card-hover-border-color,
          var(--sc-color-blue-650)
        );
        outline: 4px solid
          var(--sc-modal-background-color, var(--sc-color-white));
      }

      [slot='card-action-button'] {
        margin-top: 0.25rem;
        margin-right: 0.25rem;

        &::slotted(sc-icon) {
          min-width: 1.25rem;
          min-height: 1.25rem;
        }
      }

      &.end-pt {
        [slot='title'] {
          word-break: break-all;
          overflow-wrap: break-word;
          -webkit-line-clamp: 2;
          line-clamp: 2;
        }
      }

      &:focus-visible::part(base) {
        outline: 2px solid var(--sc-color-blue-250);
        outline-offset: -1px;
      }
    }
  }
`;
