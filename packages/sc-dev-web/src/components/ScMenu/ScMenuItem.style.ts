import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .sc-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    line-height: 1.8;
    color: var(--sc-menu-item-color, var(--sc-color-blue-900));
    padding: 10px 2px;
    transition: 150ms fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .sc-menu-item.menu-item-disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .sc-menu-item .menu-item-content {
    display: block;
    padding-right: 1px;
    padding-left: 1px;
  }

  .sc-menu-item .menu-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.5rem;
    display: -webkit-box;
    text-wrap: wrap;
  }

  .sc-menu-item .menu-item-description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1rem;
    text-wrap: wrap;
  }

  .sc-menu-item .menu-item-label.hasDescription {
    margin-bottom: 8px;
  }

  .sc-menu-item .menu-item-prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .sc-menu-item .menu-item-prefix::slotted(*) {
    margin-inline-end: 8px;
    display: flex;
  }

  .sc-menu-item .menu-item-suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .sc-menu-item menu-item-suffix::slotted(*) {
    margin-inline-start: 8px;
    display: flex;
  }

  :host(.sc-menu-item:not(.menu-item-disabled):hover) {
    outline: none;
  }

  .sc-menu-item:not(.menu-item-disabled):hover {
    outline: none;
    color: var(--sc-menu-item-hover-color, var(--sc-color-blue-500));
    background: var(--sc-menu-item-background-hover-color, none);
  }

  .sc-menu-item .menu-item-check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    visibility: hidden;
  }

  .menu-item-checked .menu-item-check {
    visibility: visible;
  }
  
  .menu-item-suffix-padding {
    width: 24px;
  }

  .menu-item__chevron {
    display: flex;
  }
    
  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .sc-menu-item,
    .sc-menu-item:not(.menu-item-disabled):hover {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;