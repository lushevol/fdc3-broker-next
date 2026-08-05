import { css } from 'lit';
export default css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: max-content;
    height: max-content;
  }

  sc-pdf-page {
    margin: 1rem;
  }

  sc-side-sheet {
    --sc-sheet-overlay-display: none;
    --sc-side-sheet-background-color: #f9f9f9 !important;

    .side-sheet-container {
      margin: 70px 0;
      
      .side-sheet-title {
        color: #525355;
        font-family: 'SC Prosper Sans';
        font-size: 24px;
        font-style: normal;
        font-weight: 500;
        line-height: 32px;
        margin-bottom: 24px;
      }

      .item {
        width: 95px;
        height: 128px;
        max-width: 95px;
        max-height: 128px;
        margin: 0.5rem;
        padding: 0.25rem;
        border-radius: 0.375rem;

        &::after {
          display: block;
          width: 100%;
          margin-top: 0.175rem;
          content: attr(data-page);
          text-align: center;
          font-size: 0.75rem;
        }

        &.active {
          outline: 1px solid #0250a3;
          outline-offset: 0.125rem;
        }
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
      }

      .img-navigations img {
        width: 95px;
        height: 128px;
        margin: 12px;
      }
      .img-navigations .img-wrapper.active-page {
        border-color: #0250a3;
      }
    }
  }
  
`;
