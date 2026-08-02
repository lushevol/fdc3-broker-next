import { css } from 'lit';

export default css`
  :host {
    display: flex;
    /* z-index: 0;  */
    /** Ensure this is a stacking context so the indicator displays */
  }

  .tab {
    position: relative;
    display: flex;
    position: relative;
    align-items: center;
    color: var(--sc-tab-color, var(--sc-color-grey-650));
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition: var(--transition-speed) box-shadow,
      var(--transition-speed) color;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.375rem;
    padding: 0.9rem 0.5rem;
    margin-top: 2px;
    gap: 12px;
  }

  .tab.filled {
    color: var(--sc-tab-color-filled, var(--sc-color-white));
    padding: 0.75rem 1rem;
  }

  .tab.tab-active:not(.tab-disabled), .tab:not(.tab-disabled):hover,
  .tab.tab-active:not(.tab-disabled), .tab:not(.tab-disabled):focus {
    color: var(--sc-tab-active-color, var(--sc-color-blue-500));
    border-radius: 0px;
  }
  .tab.tab-active:not(.tab-disabled), .tab:focus-visible{
    outline: none;
  }
  
  .indicator{
    position: absolute;
    box-sizing: border-box;
    /* z-index: -1; */
    transform-origin: bottom left;
    background: var(--sc-tab-active-color, var(--sc-color-blue-500));
    height: 0.25rem;
    inset: auto 0 0 0;
    opacity: 0;
  }
  .tab.tab-active:not(.tab-disabled):not(.tab-no-active-bottom-line):not(.filled) .indicator{
    opacity: 1;
  }
      
  .tab.segmented {
    color: var(--sc-tab-color-segmented, var(--sc-color-grey-650));
    padding: 0.25rem 1rem;
    margin: 0px;
  }

  .tab:not(.filled):not(.segmented):first-of-type {
    margin-left: 2px;
  }

  .tab:not(.filled):not(.segmented):last-of-type {
    margin-right: 2px;
  }

  .tab .tab-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab .icon {
    color: var(--sc-tab-icon-color, var(--sc-color-grey-400));
  }

  .tab .close-icon {
    display: inline-flex;
    flex: 0 0 1rem;
    width: 1rem;
    height: 1rem;
  }

  .tab .counter {
    padding: 0px 6px;
    border: 2px solid
      var(--sc-tab-counter-border-color, var(--sc-color-grey-150));
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 800;
    line-height: 1.25rem;
  }

  .tab:focus {
    outline: none;
  }
  .tab:focus-visible {
    outline: 2px solid var(--sc-tab-focus-outline-color, var(--sc-color-blue-250));
    outline-offset: -2px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
  .tab.filled.focus-visible {
    outline-color: var(--sc-tab-filled-focus-outline-color, var(--sc-color-blue-100));
  }
  
  .tab.segmented:not(.tab-active) {
    border: 1px solid transparent;
  }
  .tab.segmented:focus-visible {
    outline-color: var(--sc-tab-segmented-focus-outline-color, var(--sc-color-blue-250));
    border-radius: 6px;
  }

  .tab.tab-active:not(.tab-disabled) {
    color: var(--sc-tab-active-color, var(--sc-color-blue-500));
  }

  .tab.filled.tab-active:not(.tab-disabled) {
    color: var(--sc-tab-filled-active-color, var(--sc-color-blue-900));
    background-color: var(
      --sc-tab-filled-active-background-color,
      var(--sc-color-white)
    );
    border-radius: var(--sc-tab-filled-active-border-radius, 4px 4px 0px 0px);
  }

  .tab.segmented.tab-active:not(.tab-disabled) {
    color: var(--sc-tab-segmented-active-color, var(--sc-color-blue-500));
    background-color: var(
      --sc-tab-segmented-active-background-color,
      var(--sc-color-blue-50)
    );
    border: 1px solid var(
      --sc-tab-segmented-active-border-color,
      var(--sc-color-blue-250)
    );
    border-radius: 6px;
  }

  .tab.tab-active:not(.tab-disabled) .icon {
    color: var(--sc-tab-active-icon-color, var(--sc-color-blue-500));
  }

  .tab.filled:not(.tab-disabled) .icon {
    color: var(--sc-tab-filled-active-icon-color, var(--sc-color-blue-250));
  }

  .tab:not(.filled).tab-active:not(.tab-disabled) .counter {
    border-color: var(
      --sc-tab-active-counter-border-color,
      var(--sc-color-blue-250)
    );
  }

  .tab:not(.tab-disabled):not(.tab-active):hover {
    color: var(--sc-tab-hover-color, var(--sc-color-blue-250));
  }

  .tab:not(.tab-disabled):not(.tab-active):hover .icon {
    color: var(--sc-tab-hover-icon-color, var(--sc-color-blue-250));
  }

  .tab:not(.tab-disabled):not(.tab-active):hover .counter {
    color: var(--sc-tab-hover-counter-color, var(--sc-color-grey-650));
  }

  .tab.filled:not(.tab-disabled):not(.tab-active):hover .counter {
    color: var(--sc-tab-filled-hover-counter-color, var(--sc-color-blue-250));
  }

  /* .tab:not(.filled):not(.segmented).tab-active:not(.tab-disabled):not(
      .tab-no-active-bottom-line
    ) {
    border-bottom: 0.125rem solid
      var(--sc-tab-active-color, var(--sc-color-blue-500));
  } */

  .tab.tab-active.tab-no-active-bottom-line {
    border-bottom: none;
  }

  .tab.tab-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab.filled.tab-disabled {
    color: var(--sc-tab-filled-disabled-color, var(--sc-color-blue-250));
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab.tab-error:not(.filled):not(.segmented) {
    color: var(--sc-tab-error-color, var(--sc-color-red-500));
  }

  .tab.tab-error:not(.filled):not(.segmented) .icon {
    color: var(--sc-tab-error-icon-color, var(--sc-color-red-500));
  }

  .tab.tab-error:not(.tab-active):not(.filled):not(.segmented) .counter {
    border-color: var(
      --sc-tab-error-counter-border-color,
      var(--sc-color-red-200)
    );
    background-color: var(
      --sc-tab-error-counter-background-color,
      var(--sc-color-red-50)
    );
  }

  @media (forced-colors: active) {
    .tab.tab-active:not(.tab-disabled) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`;
