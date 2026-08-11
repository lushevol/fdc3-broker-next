import { css } from 'lit';
export default css`
  :host {
    display: block;
  }
  :host([hidden]) {
    display: none;
  }

  .toolbar {
    grid-template-columns: min-content min-content;
  }

  .right-set {
    justify-content: end;
  }

  .common-tools {
    display: flex;
    align-items: center;
    gap: 1px;
    height: 100%;
    
    :not(disabled) {
      svg, sc-icon {
        cursor: pointer;
      }
    }
  }

  
  .color-block {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    display: inline-block;
  }
  .disabled-setting .color-block {
    opacity: 0.3;
  }
  .scriber-toolbar-wrapper {
    height: 100%;
  }
  .selectable-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .selectable-item {
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;
  }
  .selectable-item:hover {
    background: #e5f1fc;
  }
  .selectable-item sc-icon {
    opacity: 0;
  }
  .selectable-item.selectable-item-active {
    background: #e5f1fc;
  }
  .selectable-item.selectable-item-active sc-icon {
    opacity: 1;
  }
  .selectable-item-content {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .divider {
    width: 1px;
    background-color: #ccc;
    margin: 0 4px;
    height: 16px;
  }
  .spacer {
    flex: 1;
  }
  .disabled-setting {
    color: #cccccc;
    cursor: not-allowed;
  }
  .common-tools .disabled-setting svg,
  .common-tools .disabled-setting sc-icon {
    cursor: not-allowed;
  }
  .icon-wrapper {
    display: flex;
    align-items: stretch;
    padding-right: 0.5rem;

    sc-file-tool-icon::part(button) {
      --sc-button-padding-sm: 0.5rem 1.25rem 0.5rem 0.5rem;
    }
    sc-tooltip, & > sc-icon {
      margin-left: -1rem;
      z-index: 1;
    }
    sc-icon {
      width: 1rem;
    }
  }
`;
