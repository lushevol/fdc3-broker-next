import { css } from 'lit';

export default css`
  :host {
    display: block;
  }

  .tab-group {
    display: flex;
    flex-direction: column;
    border-radius: 0;
  }

  .tab-group .tab-group__nav-container {
    order: 1;
    display: flex;
    background-color: var(--sc-tab-group-background-color, inherit)
  }

  .tab-group .tab-group__bottom-line {
    border-bottom: 1px solid var(--sc-divider-color, var(--sc-color-grey-150));
  }

  .tab-group.filled .tab-group__nav-container {
    display: block;
    width: 100%;
  }

  .tab-group .tab-group__nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  .tab-group.segmented .tab-group__nav {
    border: 1px solid var(
      --sc-tab-active-border-color-segmented,
      var(--sc-color-grey-200)
    );
    border-radius: 6px;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group .tab-group__nav::-webkit-scrollbar,
  .tab-group .tab-group__tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-group .tab-group__tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    scrollbar-width: none;
  }

  .tab-group .tab-group__body {
    order: 2;
  }

  .tab-group:not(.filled):not(.segmented) ::slotted(sc-tab),
  .tab-group ::slotted(sc-tab-divider) {
    margin-right: var(--sc-tab-margin, 2rem);
  }

  .tab-group:not(.filled):not(.segmented).tab-group--align-center ::slotted(sc-tab),
  .tab-group:not(.filled):not(.segmented).tab-group--align-center ::slotted(sc-tab-divider) {
    margin-right: calc(var(--sc-tab-margin, 2rem) / 2);
    margin-left: calc(var(--sc-tab-margin, 2rem) / 2);
  }

  .tab-group ::slotted(sc-tab-panel) {
    --padding: var(--sc-tab-panel-spacing, 1rem) 0;
  }

  .tab-group__tabs {
    display: flex;
    position: relative;
  }

  .tab-group.filled .tab-group__tabs {
    padding: 8px 20px 0px;
    background: var(--sc-tab-group-filled-background, var(--sc-color-prosper-blue));
  }

  .tab-group--has-scroll-controls .tab-group__nav-container {
    position: relative;
    padding: 0 var(--sc-tab-nav-spacing, 1.75rem);
  }

  .tab-group__body {
    display: block;
    overflow: auto;
  }

  .tab-group__scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    color: var(--sc-tab-group-scroll-button-color, var(--sc-color-grey-150));
    width: var(--sc-tab-scroll-button-width, 1.75rem);
  }

  .tab-group__scroll-button--start {
    left: 0;
    justify-content: right;
    z-index: 2;
    cursor: pointer;
    background: var(
      --sc-tab-group-scroll-button-background-color,
      var(--sc-color-white)
    );
    box-shadow: 3px 0px 10px -6px rgba(6,29,51,00.25);
  }

  .tab-group__scroll-button--start::after,
  .tab-group__scroll-button--end::before {
    content: ' ';
    border-left: 1px solid
      var(--sc-tab-group-scroll-button-color, var(--sc-color-grey-150));
    height: 100%;
  }

  .tab-group__scroll-button--end::before {
    margin-left: -7px;
  }
  .tab-group__scroll-button--end {
    right: 0;
    cursor: pointer;
    background: var(
      --sc-tab-group-scroll-button-background-color,
      var(--sc-color-white)
    );
    box-shadow: -3px 0px 10px -6px rgba(6,29,51,0.25);
  }

  @media screen and (max-width: 768px) {
    .tab-group .tab-group__nav-container {
      padding-left: 0;
    }
  }
`;
