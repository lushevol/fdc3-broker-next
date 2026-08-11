import { css } from 'lit';
export default css`
  :host {
    display: flex;
    flex-direction: column;
    align-content: stretch;
    gap: 1px;
    width: 100%;
  }
  :host([hidden]) {
    display: none;
  }

  sc-icon-provider {
    display: contents;
  }
  .toolbar {
    grid-template-columns: minmax(6rem, 1fr) min-content 1fr;
    &.truncated {
      grid-template-columns: minmax(6rem, min-content) min-content min-content;
    }

    .group {
      position: relative;
      display: flex;
      flex-direction: row;
      align-content: center;
      align-items: center;
      gap: 1px;
      font-size: 0.875rem;

      sc-number-input {
        height: 2rem;
        &::part(more-icons) {
          display: none;
        }

        &.zoom-input {
          width: 3.5rem;

          & + span {
            transform: translate(-1.2rem, 0);
            pointer-events: none;
            width: 0px;
            pointer-events: none;
          }
        }

        &.page-input {
          width: 3rem;
          margin: 0 0.25rem;
          &.d-3 {
            width: 3.5rem;
          }
          &.d-4 {
            width: 4rem;
          }
        }
      }
    }

    .set {
      &.left-set {
        min-width: 6rem;
      }
      &.right-set {
        justify-content: end;
      }
    }

    sc-paragraph {
      min-width: 2rem;
    }

    .scriber-tool[active]::part(button) {
      --sc-button-text-background-color: transparent;
      --sc-button-text-text-color: var(--sc-color-blue-650);
    }
  }


  sc-side-sheet {
    --sc-sheet-overlay-display: none;
    --sc-side-sheet-background-color: #f9f9f9 !important;
    display: block;
    position: absolute;
    top: 3rem;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: 1px;

    sc-scriber-toolbar:not([hidden]) + & {
      top: 6rem;
    }
  }

  .side-sheet .side-sheet-title {
    color: #525355;
    font-family: 'SC Prosper Sans';
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px;
    margin-bottom: 24px;
  }
  .img-navigations {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .img-navigations .img-wrapper {
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 6px;
    overflow: hidden;
    background: white;
    height: fit-content;
    width: fit-content;
    max-width: 89px;
    max-height: 128px;

    &:empty {
      width: 100%;
      height: 128px;
    }
  }

  .img-navigations img {
    width: 95px;
    height: 128px;
    margin: 12px;
  }
  .img-navigations .img-wrapper.active-page {
    border-color: #0250a3;
  }
  .page-number {
    font-size: 12px;
    margin-top: 2px;
    margin-bottom: 6px;
  }
`;
