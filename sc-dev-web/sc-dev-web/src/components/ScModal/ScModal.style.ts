import { css } from 'lit';

export default css`
  .sc-modal {
    --sl-spacing-2x-large: 5rem;
  }
  .sc-modal.expanded-view {
    --sl-spacing-2x-large: 2.5rem;
  }

  .sc-modal .default-slot::-webkit-scrollbar {
    width: 0.3125rem;
  }

  .sc-modal .default-slot::-webkit-scrollbar-thumb {
    background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-500));
    border-radius: 0.3125rem;
  }

  .sc-modal {
    --header-spacing: 0;
    --body-spacing: 0; 
    --footer-spacing: 0;
  }

  .sc-modal::part(body) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sc-modal::part(close-button) {
    display: var(--sl-dialog-close-icon, none);
  }
  .sc-modal::part(header) {
    display:none;
  }
  .sc-modal.no-header {
    --sc-modal-header-display: var(--sc-modal-no-header-display, none);
  }
  .sc-modal .header-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: var(--sc-radius-sm, .375rem) var(--sc-radius-sm, .375rem) 0 0;
    padding: var(--sc-modal-padding, 1rem 1.5rem);
    border-bottom: var(--sc-modal-divider, none);
    top: 0;
  }
  .sc-modal.no-header .header-container {
    padding: 0;
  }
  .sc-modal.no-padding {
    --sc-modal-padding: 0;
  }
  .sc-modal.sticky-header .header-container {
    --sc-modal-divider: 1px solid var(--sc-modal-header-border-bottom-color, var(--sc-color-grey-150));
  }
  .sc-modal.expanded-view.sticky-header .default-slot {
    overflow: auto; 
  }
  .sc-modal .header-container.no-content {
    border-radius: var(--sc-radius-sm, .375rem);
  }
  .sc-modal .header-container.with-content {
    border-radius: var(--sc-radius-sm, .375rem) var(--sc-radius-sm, .375rem) 0 0;
  }
  .sc-modal .header-top {
    display: flex;
    width: 100%;
  }
  .sc-modal .header-text {
    flex-grow: 1;
    margin-left: var(--sc-modal-icon-margin, 0);
    color: var(--sc-modal-header-text-color, var(--sc-color-blue-900));
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 2.125rem;
  }
  .sc-modal .title-text {
    color: var(--sc-modal-title-text-color, var(--sc-color-blue-900));
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.375rem;
    font-weight: 500;
    line-height: 2.375rem;
    align-self: flex-start;
    width: var(--sc-modal-title-text-width, 100%);
  }
  .sc-modal .header-container .icon {
    display: var(--sc-modal-icon-display, none);
  }
  .sc-modal.icon .header-container {
    --sc-modal-icon-display: flex;
    --sc-modal-icon-margin: 0.75rem;
  }
  .sc-modal .default-slot {
    overflow: auto;
  }
  .sc-modal .default-slot.hasContent {
    color: var(--sc-modal-content-text-color);
    font-size: .875rem;
    padding: var(--sc-modal-padding, 1.5rem);
    overflow: auto;
  }
  .sc-modal .default-slot.noContent {
    padding: 1rem;
  }
  .sc-modal::part(overlay) {
    background-color: var(--sc-overlay, rgba(0, 0, 0, 0.35));
  }
  .sc-modal::part(header-actions) {
    padding: var(--header-spacing) var(--header-spacing) 0 0;
    align-self: flex-start;
  }
  .sc-modal .close-icon {
    margin-left: auto;
    cursor: pointer;
    color: var(--sc-modal-close-icon-color, var(--sc-color-blue-900));
  }
  .sc-modal::part(panel) {
    border-radius: var(--sc-radius-sm, .375rem);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.15);
    background-color: var(--sc-modal-background-color, var(--sc-color-white));
  }
  .sc-modal.expanded-view::part(body) {
    display: flex;
    flex-direction: column;
  }
  .sc-modal.expanded-view::part(panel) {
    display: flex;
    flex-direction: column;
    height: calc(100% - 1.25rem); 
    width: calc(100% - 1.25rem);
    box-sizing: border-box;
  }
  .sc-modal.expanded-view .header-container {
    flex-shrink: 0; 
  }
  .sc-modal.expanded-view .default-slot {
    flex: 1 1 auto; 
  }
  .sc-modal.expanded-view .footer {
    flex-shrink: 0; 
    margin-top: auto;
  }

  .sc-modal .footer {
    bottom: 0;
    border-top: var(--sc-modal-footer-divider, none);
    border-radius: 0 0 var(--sc-radius-sm, .375rem) var(--sc-radius-sm, .375rem);
    background-color: var(--sc-modal-footer-background-color, var(--sc-color-white));
  }
  .sc-modal.footer-divider {
    --sc-modal-footer-divider: 1px solid var(--sc-modal-footer-border-top-color, var(--sc-color-grey-150));
  }
  .sc-modal .alternative-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: .875rem;
    line-height: 1.375rem;
    padding: var(--sc-modal-padding, 1rem 1.5rem);
    color: var(--sc-modal-alternative-footer-color, var(--sc-color-blue-500));
    background-color: var(--sc-modal-default-background-color, var(--sc-color-white));
    border-radius: 0 0 var(--sc-radius-sm, .375rem) var(--sc-radius-sm, .375rem);
  }
  .sc-modal.alternative {
    --sc-modal-footer-background-color: var(--sc-modal-alternative-footer-background-color, var(--sc-color-grey-100));
  }
  .sc-modal .pagination-footer {
    padding: var(--sc-modal-padding, 0 1.5rem);
    background-color: var(--sc-modal-default-background-color, var(--sc-color-white));
    border-radius: 0 0 var(--sc-radius-sm, .375rem) var(--sc-radius-sm, .375rem);
  }
  .sc-modal .button-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--sc-modal-padding, 1rem 1.5rem);
    background-color: var(--sc-modal-default-background-color, var(--sc-color-white));
    border-radius: 0 0 var(--sc-radius-sm, .375rem) var(--sc-radius-sm, .375rem);
  }
  .sc-modal .button-footer.stacked {
    flex-direction: column-reverse;
    align-items: center; 
    justify-content: center; 
  }
  .sc-modal .button-footer.reverse {
    flex-direction: row-reverse;
  }
  .sc-modal .button-footer.footer-slot {
    padding-top: 0;
  }
  .left-button-container {
    display: flex;
    margin-right: var(--sc-modal-left-button-container-margin-right, 0.5rem);
  }
  .sc-modal .button-footer.stacked .left-button-container {
    --sc-modal-left-button-container-margin-right: 0;
    margin-top: 0.5rem;
    align-items: center;
    width: 100%;
  }
  .right-button-container {
    display: flex;
    gap: 0.5rem;
  }
  .sc-modal .button-footer.stacked .right-button-container {
    flex-direction: column-reverse;
    align-items: center;
    width: 100%;
  }
  .sc-modal .header-container {
    background-color: var(--sc-modal-default-background-color, var(--sc-color-white));
  }
  .sc-modal .header-container .icon {
    color: var(--sc-modal-default-icon-color, var(--sc-color-green-500));
  }
  .sc-modal .header-container {
    background-color: var(--sc-modal-blue-background-color, var(--sc-color-blue-100));
  }
  .sc-modal .header-container .icon {
    color: var(--sc-modal-blue-icon-color, var(--sc-color-blue-500));
  }
  .sc-modal .header-container {
    background-color: var(--sc-modal-green-background-color, var(--sc-color-green-50));
  }
  .sc-modal .header-container .icon {
    color: var(--sc-modal-green-icon-color, var(--sc-color-green-500));
  }
  .sc-modal .header-container {
    background-color: var(--sc-modal-amber-background-color, var(--sc-color-amber-50));
  }
  .sc-modal .header-container .icon {
    color: var(--sc-modal-amber-icon-color, var(--sc-color-amber-500));
  }
  .sc-modal .header-container {
    background-color: var(--sc-modal-red-background-color, var(--sc-color-red-50));
  }
  .sc-modal .header-container .icon {
    color: var(--sc-modal-red-icon-color, var(--sc-color-red-500));
  }

  .sc-modal.blue .header-container {
    background-color: var(--sc-modal-blue-background-color, var(--sc-color-blue-100));
  }
  .sc-modal.blue .header-container .icon {
    color: var(--sc-modal-blue-icon-color, var(--sc-color-blue-500));
  }
  
  .sc-modal.green .header-container {
    background-color: var(--sc-modal-green-background-color, var(--sc-color-green-50));
  }
  .sc-modal.green .header-container .icon {
    color: var(--sc-modal-green-icon-color, var(--sc-color-green-500));
  }
  
  .sc-modal.amber .header-container {
    background-color: var(--sc-modal-amber-background-color, var(--sc-color-amber-50));
  }
  .sc-modal.amber .header-container .icon {
    color: var(--sc-modal-amber-icon-color, var(--sc-color-amber-500));
  }
  
  .sc-modal.red .header-container {
    background-color: var(--sc-modal-red-background-color, var(--sc-color-red-50));
  }
  .sc-modal.red .header-container .icon {
    color: var(--sc-modal-red-icon-color, var(--sc-color-red-500));
  }
  
  .sc-modal.default .header-container {
    background-color: var(--sc-modal-default-background-color, var(--sc-color-white));
  }
  .sc-modal.default .header-container .icon {
    color: var(--sc-modal-default-icon-color, var(--sc-color-green-500));
  }
`;
