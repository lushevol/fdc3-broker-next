import { css } from 'lit';

export default css`
  .sc-time-input {
    position: relative;
  }

  .sc-time-input .time-list-wrapper {
    display: flex;
    gap: var(--sc-time-input-list-wrapper-gap, 0.25rem);
    background: var(--sc-time-input-list-background-color, var(--sc-color-white));
  }

  .sc-time-input .time-list-wrapper .list {
    flex: var(--sc-time-input-list-flex);
  }

  .sc-time-input .list ul {
    list-style: none;
    padding: 0 0 0.25rem;
    margin: 0;
  }

  .sc-time-input .list-container {
    box-shadow: 0 1px 0.25rem 0 var(--sc-time-input-list-box-shadow-color, var(--sc-color-blue-darkest));
  }

  .sc-time-input .list .list-item-container {
    width: var(--sc-time-input-list-item-container-width,var(--sc-time-input-list-item-width, 8.375rem));
    min-width: var(--sc-time-input-list-item-min-width); 
    height: var(--sc-time-input-list-item-container-height,18.44rem);
    overflow-y: scroll;
    scrollbar-width: 0.313rem;
    overflow-x: hidden;
    margin: 0 0.25rem;
  }

  .sc-time-input .list .list-item-container::-webkit-scrollbar {
    width: 0.25rem;
  }

  .sc-time-input .list .list-item-container::-webkit-scrollbar-thumb {
    background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-500));
    border-radius: 0.25rem;
  }

  .sc-time-input .list .list-container li {
    /* width: 8.875rem; */
    width: 100%;
    line-height: var(--sc-time-input-list-container-li-line-height, 2.125rem);
    text-align: center;
  }

  .sc-time-input .list .list-container .list-title {
    height: var(--sc-time-input-list-title-height, 2.5rem);
    padding-top: 0;
    color: var(--sc-time-input-list-title-color, var(--sc-color-grey-500));
  }

  .sc-time-input .list .list-container .list-title .title-content {
    display: inline-block;
    border-bottom: 1px solid var(--sc-time-input-list-title-border-color, var(--sc-color-grey-150));
    font-size: 0.75rem;
    text-align: var(--sc-time-input-list-title-text-align,left);
    width: var(--sc-time-input-list-title-width, calc(100% - 2rem));
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .sc-time-input .list .list-container .list-item {
    padding: 0 0.125rem 0 0.25rem;
    height: 2.125rem;
    box-sizing: border-box;
    text-align: left;
    cursor: pointer;
  }

  .sc-time-input .list .list-container .list-item .item-content {
    display: flex;
    align-items: center;
    justify-content: var(--sc-time-input-list-item-justify-content, flex-start);
    padding: 0.5rem 0.5rem;
    /* width: 7.875rem; */
    width: 100%;
    height: 2.125rem;
    box-sizing: border-box;
    font-size: var(--sc-time-input-list-item-font-size, 0.875rem);
    font-weight: 400;
    color: var(--sc-time-input-list-item-color, var(--sc-color-blue-darkest));
    border-radius: 0.25rem;
  }

  .sc-time-input .list .list-container .list-item .item-content:hover {
    background: var(--sc-time-input-list-item-focus-background-color, var(--sc-color-blue-lightest));
  }

  .sc-time-input .list .list-container .list-item .item-content.selected {
    background: var(--sc-time-input-list-item-focus-background-color, var(--sc-color-blue-100));
    color: var(--sc-time-input-list-item-focus-color, var(--sc-color-blue-500));
    font-weight: 400;
  }

  .sc-time-input .list .list-container .list-item .item-content.disabled {
    color: var(--sc-time-input-list-item-disabled-color, var(--sc-color-grey-150));
    cursor: not-allowed;
  }

  .sc-time-input .list .list-container .list-item .item-content.disabled:hover {
    background: none;
  }

  .sc-time-input:not(.readonly) sc-text-input::part(help-message),
  .sc-time-input sc-text-input::part(error-message),
  .sc-time-input sc-text-input::part(success-message) {
    height: 0;
  }  

  .sc-time-input sc-text-input::part(more-icons) {
    top: var(--sc-input-icon-top, 0.25rem);
    right: var(--sc-form-input-padding-right, 0.85rem);
    cursor: pointer;
  }

  .sc-time-input sc-text-input::part(text-input-more-icons) {
    flex-direction: row-reverse;
    margin-top: -0.6rem;
  }

  .sc-time-input sl-dropdown::part(panel) {
    border-radius: 0.5rem;
    overflow: hidden;
  }
`;
