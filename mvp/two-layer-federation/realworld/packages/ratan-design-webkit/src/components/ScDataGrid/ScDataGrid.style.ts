import { css } from 'lit';

export const classNamePrefix = 'sc-data-grid-';

const horizontalScollerBox = css`
  .sc-data-grid-scroller {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }
`;
const separator = css`
  .sc-data-grid-separator {
    position: absolute;
    top: 0;
    right: 0px;
    height: 100%;
    width: 6px;
    min-width: 6px;
    max-width: 6px;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;
    justify-content: flex-end;

    &.sc-data-grid-separator-can-resize {
      cursor: col-resize;
    }

    .sc-data-grid-separator-placeholder {
      height: 1rem;
      width: 2px;
      border-left: 1.4px solid var(--sc-data-grid-outline-color);
    }

    &.sc-data-grid-separator-resizing,
    &:hover {
      .sc-data-grid-separator-placeholder {
        border-left-color: var(--sc-color-blue-550-dark);
      }
    }
  }
`;

const boxShadow = css`
  .sc-data-grid-tbody {
    position: relative;
  }
  .sc-data-grid-thead {
    position: relative;
  }
  .sc-data-grid-box-shadow-wrapper {
    position: absolute;
    height: 100%;
    top: 0;
    pointer-events: none;
    z-index: 2;
  }
  .sc-data-grid-box-shadow-wrapper-left {
    left: 0;
  }
  .sc-data-grid-box-shadow-wrapper-right {
    right: 0;
  }

  .sc-data-grid-box-shadow-left {
    --sc-data-grid-pinned-shadow: 14px 0px 14px -6px rgba(6, 29, 51, 0.06);
  }
  .sc-data-grid-box-shadow-right {
    --sc-data-grid-pinned-shadow: -14px 0px 14px -6px rgba(6, 29, 51, 0.06);
  }
  .sc-data-grid-box-shadow {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: var(--sc-data-grid-pinned-shadow);
  }
`;

const scrollerBayStyle = css`
  ::-webkit-scrollbar {
    height: var(--sc-data-grid-faker-scroller);
    width: var(--sc-data-grid-faker-scroller);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--sc-data-grid-scrollbar-color);
    border-radius: 5px;
  }
`;

const actionBar = css`
  .sc-data-grid-actions-bar {
    background: var(--sc-data-grid-basic-bg-color);
    display: flex;
    align-items: center;
    padding: var(--sc-data-grid-functional-bar-padding);
    border-bottom: 1px solid var(--sc-data-grid-outline-color);
  }
  .sc-data-grid-selection-info {
    display: flex;
    padding-right: 1rem;
  }
  .sc-data-grid-selection-info-bold {
    color: var(--sc-data-grid-basic-text-color);
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1rem;
  }
  .sc-data-grid-selection-info-text {
    color: var(--sc-data-grid-basic-text-color);
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1rem;
  }
`;

const functionalRow = css`
  .sc-data-grid-header-tools {
    background: var(--sc-data-grid-basic-bg-color);
    display: flex;
    padding: var(--sc-data-grid-functional-bar-padding);
    border-bottom: 1px solid var(--sc-data-grid-outline-color);
  }
  .sc-data-grid-header-tools-main {
    display: flex;
    align-items: center;
    flex: 1;
    padding-right: 2rem;

    &:only-child {
      padding-right: 0;
    }
  }
  .sc-data-grid-header-tools-main sc-text-input {
    height: 2rem;
    width: 100%;
  }
  .sc-data-grid-header-tools-icons {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .sc-data-grid-header-tools-icon {
    padding: 0.375rem;
    display: grid;
    place-content: center;
    border-radius: 6px;
    color: var(--sc-data-grid-basic-icon-color);
    cursor: pointer;
  }
  .sc-data-grid-header-tools-icon:hover {
    /* background-color: var(); */
  }
  .sc-data-grid-header-tools sc-text-input::part(input-area) {
    z-index: 0;
  }
`;
const horizontalScroller = css`
  .sc-data-grid-horizontal-scroller {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    height: var(--sc-data-grid-faker-scroller);
    min-height: var(--sc-data-grid-faker-scroller);
    max-height: var(--sc-data-grid-faker-scroller);
    width: 100%;
  }
  .sc-data-grid-horizontal-scroller-container {
    flex: 1;
    max-height: var(--sc-data-grid-faker-scroller);
    overflow-x: auto;
    overflow-y: hidden;
    
    opacity: var(--sc-data-grid-scrollbar-active-opacity, 1);
    transition: opacity .25s ease-in;

    &.disappear {
      opacity: var(--sc-data-grid-scrollbar-inactive-opacity, 0.3);
    }
    &.appear {
      opacity: var(--sc-data-grid-scrollbar-active-opacity, 1);
      transition: none;
    }
  }
  .sc-data-grid-horizontal-scroller-content {
    height: var(--sc-data-grid-faker-scroller);

    &[style*="width: 0%"], &[style*="width:0%"] {
      display: none;
    }
  }
`;
const verticalScroller = css`
  .sc-data-grid-vertical-scroller {
    position: absolute;
    height: 100%;
    right: 0;
    width: var(--sc-data-grid-faker-scroller);
    min-width: var(--sc-data-grid-faker-scroller);
    max-width: var(--sc-data-grid-faker-scroller);
    flex: 1 1 auto;
    min-height: 0;
    z-index: 1;
  }
  .sc-data-grid-vertical-scroller-container {
    max-width: var(--sc-data-grid-faker-scroller);
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    
    opacity: var(--sc-data-grid-scrollbar-active-opacity, 1);
    transition: opacity .25s ease-in;

    &.disappear {
      opacity: var(--sc-data-grid-scrollbar-inactive-opacity, 0.3);
    }
    &.appear {
      opacity: var(--sc-data-grid-scrollbar-active-opacity, 1);
      transition: none;
    }
  }
  .sc-data-grid-vertical-scroller-content {
    width: var(--sc-data-grid-faker-scroller);
    
    &[style*="height: 0%"], &[style*="height:0%"] {
      display: none;
    }
  }
`;
const rowSpanning = css`
  .sc-data-grid-row-spanning-wrapper {
    position: absolute;
    box-sizing: border-box;
    pointer-events: all;
  }
  .sc-data-grid-row-spanning-wrapper sc-data-grid-cell {
    width: 100%;
    height: 100%;
  }
`;

const pinnedRows = css`
  .sc-data-grid-pinned-body-area-viewport {
    display: flex;
    scrollbar-width: none;
  }
`;

const masterDetailLayer = css`
  .sc-data-grid-master-detial-layer {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  
  .keyboard-enabled sc-data-grid-master-cell:focus-visible {
    outline: 2px solid var(--sc-data-grid-cell-focus-shadow);
    outline-offset: -2px;
  }
`;

const spanningLayer = css`
  .sc-data-grid-row-spanning-layer {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
`;

const headerCellColor = css`
  .sc-data-grid-row-of-header .sc-data-grid-cell {
    background-color: var(--sc-data-grid-header-cell-bg-color);
  }
  .sc-data-grid-header-cell.sc-data-grid-cell {
    &.drag-start {
      sc-data-grid-cell {
        opacity: 0.4;
      }
    }
    &.drag-clone {
      background-color: var(--sc-data-grid-header-cell-bg-color);
      opacity: 0.6;
      position: absolute;
      z-index: 10;
      pointer-events: none;
      left: calc(var(--client-x) - var(--offset-x));
      top: calc(var(--client-y) - var(--offset-y));
    }
    &.drop-before::before, 
    &.drop-after::after {
      content: ' ';
      display: block;
      background-color: var(--sc-data-grid-draggable-divider-color);
      position: absolute;
      width: 2px;
      top: 0px;
      bottom: 0px;
      z-index: 1;
    }
    &.drop-before::before {
      left: 0px;
    }
    &.drop-after::after {
      right: 0px;
    }
  }
`;
const bodyCellColor = css`
  /* non zebra & readonly */
  .sc-data-grid-row-of-body-non-zebra .sc-data-grid-cell,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-non-zebra {
    background-color: var(--sc-data-grid-body-cell-readonly-bg-color);
  }
  /* zebra & readonly */
  .sc-data-grid-row-of-body-zebra .sc-data-grid-cell,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-zebra {
    background-color: var(--sc-data-grid-body-cell-zebra-readonly-bg-color);
  }

  /* non zebra & editable */
  .sc-data-grid-row-of-body-non-zebra .sc-data-grid-cell-editable,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-non-zebra.sc-data-grid-cell-editable {
    background-color: var(--sc-data-grid-body-cell-default-bg-color);
  }
  /* zebra & editable */
  .sc-data-grid-row-of-body-zebra .sc-data-grid-cell-editable,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-zebra.sc-data-grid-cell-editable {
    background-color: var(--sc-data-grid-body-cell-zebra-default-bg-color);
  }

  /* zebra & selected */
  .sc-data-grid-row-selected.sc-data-grid-row-of-body-zebra .sc-data-grid-cell,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-zebra.sc-data-grid-row-selected {
    background-color: var(--sc-data-grid-body-cell-zebra-selected-bg-color);
  }
  /* non zebra & selected */
  .sc-data-grid-row-selected.sc-data-grid-row-of-body-non-zebra
    .sc-data-grid-cell,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-non-zebra.sc-data-grid-row-selected {
    background-color: var(--sc-data-grid-body-cell-selected-bg-color);
  }

  /* zebra & hover */
  .sc-data-grid-row-of-body-hover.sc-data-grid-row-of-body-zebra
    .sc-data-grid-cell,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-zebra.sc-data-grid-row-of-body-hover {
    background-color: var(--sc-data-grid-body-cell-zebra-hover-bg-color);
  }
  /* non zebra & hover */

  .sc-data-grid-row-of-body-hover.sc-data-grid-row-of-body-non-zebra
    .sc-data-grid-cell,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-non-zebra.sc-data-grid-row-of-body-hover {
    background-color: var(--sc-data-grid-body-cell-hover-bg-color);
  }

  /* zebra & pressed */
  .sc-data-grid-row-of-body-zebra .sc-data-grid-cell:active,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-zebra:active {
    background-color: var(--sc-data-grid-body-cell-zebra-pressed-bg-color);
  }
  /* non zebra & pressed */
  .sc-data-grid-row-of-body-non-zebra .sc-data-grid-cell:active,
  .sc-data-grid-row-spanning-wrapper.sc-data-grid-row-of-body-non-zebra:active {
    background-color: var(--sc-data-grid-body-cell-pressed-bg-color);
  }
`;
const tableBorder = css`
  .sc-data-grid-header-area {
    border-bottom: 1px solid var(--sc-data-grid-outline-color);

    .sc-data-grid-thead {
      margin-bottom: -1px;
      box-sizing: content-box;

      .sc-data-grid-row {
        border-bottom: 1px solid var(--sc-data-grid-outline-color);
      }
    }
  }

  .sc-data-grid-thead,
  .sc-data-grid-tbody {
    .sc-data-grid-row {
      .keyboard-enabled & {
        .sc-data-grid-cell:focus-visible,
        .sc-data-grid-row-spanning-wrapper:focus-visible {
          box-shadow: inset var(--sc-data-grid-cell-focus-shadow);
        }
      }
    }
  }
  .sc-data-grid-body-area .sc-data-grid-cell,
  .sc-data-grid-pinned-body-area .sc-data-grid-cell,
  .sc-data-grid-row-spanning-wrapper {
    box-shadow: inset -1px 0px 0 0 var(--sc-data-grid-body-vertical-border-color),
    inset 0 -1px 0 0 var(--sc-data-grid-body-horizontal-border-color);
    
    .keyboard-enabled &:focus-visible {
      box-shadow: inset var(--sc-data-grid-cell-focus-shadow),
      inset -1px 0px 0 0 var(--sc-data-grid-body-vertical-border-color),
      inset 0 -1px 0 0 var(--sc-data-grid-body-horizontal-border-color);
    }
  }
  .sc-data-grid-body-area, .sc-data-grid-pinned-body-area {
    .sc-data-grid-tbody {
      &.sc-data-grid-tbody-center { 
        .sc-data-grid-cell.sc-data-grid-last-cell-of-row {
          --sc-data-grid-body-vertical-border-color: transparent;
        }
      }
      &.sc-data-grid-pinned-right {
        .sc-data-grid-row-of-body {
          border-left: 1px solid var(--sc-data-grid-body-vertical-border-color);
        }
      }
    }
  }


  .sc-data-grid-body-area {
    margin-bottom: -1px;
  }
  .sc-data-grid-pinned-body-area {
    &.bottom:not(.empty) {
      border-bottom: 1px solid var(--sc-data-grid-outline-color);
      margin-top: -1px;
      margin-bottom: -1px;

      .sc-data-grid-tbody {
        padding-top: 1px;

        &.sc-data-grid-pinned-left, &.sc-data-grid-pinned-right {
          overflow: hidden;
        }

        .sc-data-grid-cell,
        .sc-data-grid-row-spanning-wrapper {
          /* change border to top + right */
          box-shadow: inset -1px 0px 0 0 var(--sc-data-grid-body-vertical-border-color),
            inset 0 1px 0 0 var(--sc-data-grid-body-horizontal-border-color);

          .keyboard-enabled &:focus-visible {
            box-shadow: inset var(--sc-data-grid-cell-focus-shadow),
              inset -1px 0px 0 0 var(--sc-data-grid-body-vertical-border-color),
              inset 0 1px 0 0 var(--sc-data-grid-body-horizontal-border-color);
          }
        }
      }
    }
  }
`;

const predefinedSize = css`
  :host {
    /* emtraSmall small default large extraLarge */
    /* xxs        xs    sm       md   lg */

    /* header cell padding */
    --sc-data-grid-header-cell-padding-vertical-sm: 0.875rem;

    --sc-data-grid-header-cell-padding-horizontal-sm: 0.5rem;

    /* body cell padding */
    --sc-data-grid-body-cell-padding-vertical-sm: 0.875rem;
    --sc-data-grid-body-cell-padding-vertical-compact: 0.5rem;

    --sc-data-grid-body-cell-padding-horizontal-sm: 0.5rem;

    /* header cell font size */
    --sc-data-grid-header-cell-font-size-sm: 0.875rem;

    /* body cell font size */
    --sc-data-grid-body-cell-font-size-sm: 0.875rem;

    /* cell line height */
    --sc-data-grid-cell-line-height-sm: 1rem;

    /* functional bar padding */
    --sc-data-grid-functional-bar-padding-sm: 0.5rem 0.5rem;
    
    /* scrollbar opacity */
    --sc-data-grid-scrollbar-active-opacity: 1;
    --sc-data-grid-scrollbar-inactive-opacity: 0.3;
    /* focus */
    --sc-data-grid-cell-focus-shadow: 0px 0px 0px 2px var(--sc-data-grid-cell-focus-shadow-color);
  }
`;

const draggableRow = css`
  .draggable-row-indicator {
    position: absolute;
    width: 100%;
    height: 1px;
    z-index: 1;
    background: var(--sc-color-blue-550-dark);
    display: none;
  }

  .sc-data-grid-row[placement='before'] .draggable-row-indicator {
    top: 0;
    display: block;
  }
  .sc-data-grid-row[placement='after'] .draggable-row-indicator {
    bottom: 0;
    display: block;
  }
`;

export default css`
  ${predefinedSize}
  :host {
    display: block;
    width: 100%;
    height: inherit;
    max-height: inherit;
    --sc-data-grid-faker-scroller: 0.5rem;
    font-family: var(--sc-font-family);

    --sc-data-grid-header-cell-padding-vertical: var(
      --sc-data-grid-header-cell-padding-vertical-sm
    );
    --sc-data-grid-header-cell-padding-horizontal: var(
      --sc-data-grid-header-cell-padding-horizontal-sm
    );
    --sc-data-grid-body-cell-padding-vertical: var(
      --sc-data-grid-body-cell-padding-vertical-sm
    );
    --sc-data-grid-body-cell-padding-horizontal: var(
      --sc-data-grid-body-cell-padding-horizontal-sm
    );
    --sc-data-grid-header-cell-font-size: var(
      --sc-data-grid-header-cell-font-size-sm
    );
    --sc-data-grid-body-cell-font-size: var(
      --sc-data-grid-body-cell-font-size-sm
    );
    --sc-data-grid-cell-line-height: var(--sc-data-grid-cell-line-height-sm);
    --sc-data-grid-functional-bar-padding: var(
      --sc-data-grid-functional-bar-padding-sm
    );
  }

  /* box-shadow: inset -1px 0px 0 0 var(--sc-data-grid-body-vertical-border-color),
      inset 0 -1px 0 0 var(--sc-data-grid-body-horizontal-border-color); */
  :host([border='vertical']) {
    --sc-data-grid-body-horizontal-border-color: transparent;
  }
  :host([border='horizontal']) {
    --sc-data-grid-body-vertical-border-color: transparent;
  }
  :host([border='none']) {
    --sc-data-grid-body-vertical-border-color: transparent;
    --sc-data-grid-body-horizontal-border-color: transparent;
  }

  :host([compact]) {
    --sc-data-grid-body-cell-padding-vertical: var(
      --sc-data-grid-body-cell-padding-vertical-compact
    );
  }
  * {
    box-sizing: border-box;
  }

  .sc-data-grid-table-wrapper {
    position: relative;
    height: inherit;
    max-height: inherit;
  }
  .sc-data-grid-table {
    display: flex;
    flex-direction: column;
    height: inherit;
    max-height: inherit;
    outline: 1px solid var(--sc-data-grid-outline-color);
    border-radius: 6px;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--sc-data-grid-basic-bg-color);
    
    &:focus-visible {
      outline: none;
    }
  }
  .sc-data-grid-row {
    display: flex;
    width: fit-content;
    transition: transform 0.2s;
    position: absolute;
    pointer-events: all;
  }
  .sc-data-grid-active-draggable-row {
    opacity: var(--sc-data-grid-draggable-row-active);
  }
  .sc-data-grid-header-area {
    background-color: var(--sc-data-grid-header-cell-bg-color);
    display: flex;
    position: relative;
  }

  .sc-data-grid-cell {
    position: relative;
    display: grid;

    &:focus {
      outline: none;
    }

    .keyboard-enabled &:focus-visible {
      box-shadow: inset var(--sc-data-grid-cell-focus-shadow);
    }
  }

  .sc-data-grid-body-area {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    position: relative;
  }
  .sc-data-grid-empty-body-area {
    flex-grow: 0;
  }
  .sc-data-grid-body-area-viewport {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    position: relative;
    
    &:focus-visible {
      outline: none;
    }
  }

  .sc-data-grid-tbody {
    /* height: fit-content; */
    /* useful for dropdown height since overflow */
    min-height: 100%;
  }
  .sc-data-grid-tbody-center {
    flex: 1;
  }

  .sc-data-grid-empty {
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sc-data-grid-empty-box {
    text-align: center;
    padding: 1rem 0;
  }
  .sc-data-grid-a11y-only {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
  }
  ${masterDetailLayer}
  ${spanningLayer}
  ${separator}
  ${horizontalScollerBox}
  ${boxShadow}
  ${verticalScroller}
  ${horizontalScroller}
  ${rowSpanning}
  ${pinnedRows}
  ${scrollerBayStyle}
  ${headerCellColor}
  ${bodyCellColor}
  ${tableBorder}
  ${functionalRow}
  ${actionBar}
  ${draggableRow}
`;
