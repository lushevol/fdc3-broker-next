import { css } from 'lit';

export const ListNavigationStyle = css`
  .sc-list-navigation {
    background-color: var(--sc-list-navigation-background-color, transparent);
    border-radius: none;
  }
  .sc-list-navigation-prefix {
    display: flex;
  }
  .sc-list-navigation-prefix sc-icon {
    color: var(--sc-list-navigation-arrow-color, var(--sc-color-blue-900));
    padding: var(--sc-list-navigation-prefix-padding, 0 0.5rem 0 0);
    align-items: flex-start;
    position: relative;
    top: 5px;
  }
  .sc-list-navigation-prefix-disabled sc-icon {
    color: var(--sc-list-navigation-title-disabled-color, var(--sc-color-grey-400));
  }
  .item-container {
    display: none;
  }
  /** 
  .item-container sc-list-navigation-item.open >.sc-list-navigation-prefix sc-icon {
    transform: rotate(0.25turn);
    top: 10px;
    width: 32px;
  } **/
  .item-container.child {
    margin-left: 1.875rem;
  }
  .item-container .last-item::part(item) {
    border-bottom: none;
    padding-bottom: 0;
  }
  .item-container .first-item::part(item) {
    margin-top: 0.5rem;
  }
  .item-container .parent-item::part(item) {
    padding: 0.25rem 0;
  }
  .item-container .child-item::part(text) {
    padding-left: 1.6875rem;
  }
  .item-container.show {
    display: block;
    transition: display 2s;
  }
  sc-search-field {
    padding-bottom: 1rem;
    display: block;
  }
`;

export const ListNavigationItemStyle = css`
  .sc-list-navigation-item:not(.disabled) a:hover {
    --sc-list-navigation-title-color: var(--sc-list-navigation-hover-color, var(--sc-color-blue-500));
    --sc-list-navigation-sub-title-color: var(--sc-list-navigation-hover-color, var(--sc-color-blue-500));
    --sc-list-navigation-prefix-icon-color: var(--sc-list-navigation-hover-color, var(--sc-color-blue-500));
    --sc-list-navigation-suffix-icon-color: var(--sc-list-navigation-hover-color, var(--sc-color-blue-500));
    --sc-list-navigation-arrow-color: var(--sc-list-navigation-hover-color, var(--sc-color-blue-500));
  }
  .sc-list-navigation-item a {
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--sc-list-navigation-margin, 1rem 0.875rem);
    background-color: var(--sc-list-navigation-item-background-color, transparent);
  }
  .sc-list-navigation-item.compact a {
    --sc-list-navigation-margin: 0.25rem 0.75rem;
  }
  .sc-list-navigation-item.with-body a {
    padding: var(--sc-list-navigation-margin, 0.375rem 0.875rem 0.375rem 0.875rem);
  }
  .sc-list-navigation-item.selected a {
    background-color: var(--sc-list-navigation-item-selected-background-color, var(--sc-color-blue-lightest));
    border-radius: 0.375rem;
  }
  .sc-list-navigation-item .sc-list-navigation-item-base {
    display: flex;
    flex-grow: 1;
    align-items: baseline;
    position: relative;
  }
  .sc-list-navigation-item sc-icon.sc-list-navigation-prefix {
    padding: var(--sc-list-navigation-prefix-padding, 0 0.75rem 0 0);
    color: var(--sc-list-navigation-prefix-icon-color, var(--sc-color-100));
    align-items: flex-start;
    position: relative;
    top: 5px;
  }
  .sc-list-navigation-item sc-icon.sc-list-navigation-suffix {
    padding: var(--sc-list-navigation-suffix-padding, 0 0.5rem);
    color: var(--sc-list-navigation-suffix-icon-color, var(--sc-color-grey-300));
  }
  .sc-list-navigation-item [part='title'], 
  .sc-list-navigation-item [part='body'] {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .sc-list-navigation-item [part='title'] {
    color: var(--sc-list-navigation-title-color, var(--sc-color-blue-900));
    font-weight: var(--sc-navigation-title-font-weight, 600);
    
  }
  .sc-list-navigation-item [part='body'] {
    color: var(--sc-list-navigation-sub-title-color, var(--sc-color-grey-600));
    font-size: 0.75rem;
    line-height: 1rem;
  }
  .sc-list-navigation-item.disabled [part='title'] {
    color: var(--sc-list-navigation-title-disabled-color, var(--sc-color-grey-400));
  }
  .sc-list-navigation-item.disabled a {
    cursor: not-allowed;
  }
  .sc-list-navigation-item.disabled sc-icon.sc-list-navigation-prefix {
    color: var(--sc-list-navigation-title-disabled-color, var(--sc-color-grey-400));
  }
`;
