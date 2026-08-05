import { css } from 'lit';

export default css`
  :host {
    display: block;
    container-type: inline-size;
  }

  .condition-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--sc-color-grey-100);
    margin-bottom: 0.5rem;
  }

  .condition-wrapper.compact, .condition-wrapper.compact .condition-right {
    display: block;
  }

  .condition-wrapper.compact >div, .condition-wrapper.compact .condition-right >div {
    margin-bottom: 0.5rem;
  }

  .condition-wrapper.compact .condition-right >div {
    display: flex;
    gap: 0rem;
    span{
      width: 3.75rem;
    }
    sc-dropdown-input {
      width: 100%;
    }
  }

  .comments-count {
    color: var(--sc-comment-color, var(--sc-brand-grey));
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.5rem;
  }

  .condition-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .poster,
  .sorter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .compact .poster span,
  .compact .sorter span {
    height: 1.5rem;
  }

  .poster span,
  .sorter span {
    color: var(--sc-comment-content-color, var(--sc-color-grey-900));
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    height: 1.875rem;
    white-space: nowrap;
  }

  sc-dropdown-input {
    min-width: 8rem;
    /* Remove the invisible help-message margin that shifts the visible input
       upward inside sc-text-input, causing vertical misalignment in the toolbar */
    --sc-form-group-help-margin-top: 0;
  }
`;
