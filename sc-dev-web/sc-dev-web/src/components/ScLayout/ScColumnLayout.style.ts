import { css } from 'lit';

export default css`
  :host {
    position: relative;
  }

  /* Layout container */
  .sc-column-layout {
    overflow-x: hidden;
    padding: var(--sc-layout-top-offset, 1.5rem)
      var(--sc-layout-right-offset, 0.75rem) var(--sc-layout-bottom-offset, 1.5rem)
      var(--sc-layout-left-offset, 1.5rem);
    background: var(--sc-layout-background-color, var(--sc-color-white));
    color: var(--sc-layout-text-color, var(--sc-color-blue-900));
    --column-layout-sticky-top-offset: calc(var(--sc-layout-top-navigation-offset, 0rem) + var(--sc-column-extra-top-offset, 0rem));
    --column-layout-border-color: var(--sc-column-layout-border-color, var(--sc-divider-color));
    --min-scrollbar-padding-x: 0rem;
    --toggle-left-column-panel-width: var(--left-column-width, 18.75rem);
    --toggle-right-column-panel-width: var(--right-column-width, 18.75rem);

    /* left & right panel padding variables */
    --grid-column-padding-x: 0.75rem;
    &.standard-spacing {
      --grid-column-padding-y: 1.25rem;
  
      --column-layout-main-content-padding-x: var(--sc-layout-main-content-padding-x, 0.625rem);
      --column-layout-main-content-padding-top: var(--sc-layout-main-content-padding-top, 0rem);
    }

    --column-layout-max-container-height: calc(100vh - var(--sc-layout-top-navigation-offset, 0px) - var(--sc-bottom-offset, 0px));
    
    --column-layout-left-panel-padding-x: var(--sc-layout-left-panel-padding-x, var(--grid-column-padding-x));
    --column-layout-left-panel-padding-y: var(--sc-layout-left-panel-padding-y, var(--grid-column-padding-y, 0px));
    --column-layout-left-panel-padding-top: var(--sc-layout-left-panel-padding-top, var(--column-layout-left-panel-padding-y));
    --column-layout-left-panel-padding-bottom: var(--sc-layout-left-panel-padding-bottom, var(--column-layout-left-panel-padding-y));
    --column-layout-right-panel-padding-x: var(--sc-layout-right-panel-padding-x, var(--grid-column-padding-x));
    --column-layout-right-panel-padding-y: var(--sc-layout-right-panel-padding-y, var(--grid-column-padding-y, 0px));
    --column-layout-right-panel-padding-top: var(--sc-layout-right-panel-padding-top, var(--column-layout-right-panel-padding-y));
    --column-layout-right-panel-padding-bottom: var(--sc-layout-right-panel-padding-bottom, var(--column-layout-right-panel-padding-y));

    --column-layout-left-header-height: var(--sc-layout-left-header-height, 3.5rem);
    --column-layout-right-header-height: var(--sc-layout-right-header-height, 3.5rem);
    --column-layout-left-header-padding-x: var(--sc-layout-left-header-padding-x, var(--column-layout-left-panel-padding-x));
    --column-layout-right-header-padding-x: var(--sc-layout-right-header-padding-x, var(--column-layout-right-panel-padding-x));

    --column-layout-main-content-padding-x: var(--sc-layout-main-content-padding-x, var(--grid-column-padding-x));
    --column-layout-main-content-padding-top: var(--sc-layout-main-content-padding-top, var(--grid-column-padding-y, 2px));
    --column-layout-main-content-padding-bottom: var(--sc-layout-main-content-padding-bottom, var(--grid-column-padding-y, 2px));
    

    &.tablet-portrait-mode {
      --toggle-left-column-panel-width: 0rem;
      --toggle-right-column-panel-width: 0rem;
    }
  }

  .grid-column {
    &.show { display: block; }
    &.hide { display: none; }
  }

  /* Header, breadcrumb, sticky */
  .has-sticky-bar {
    --sc-layout-breadcrumb-padding-top: 1px;
    --column-layout-sticky-bar-height: 3.25rem;
  }
  .sc-column-layout.sticky-bar .page-content {
    margin-top: calc(var(--column-layout-sticky-bar-height, 3.25rem));
  }

  div.title {
    height: calc(var(--sc-layout-header-offset, 3.625rem) - 1.25rem);
    max-height: calc(var(--sc-layout-header-offset, 3.625rem) - 1.25rem);
    padding: 0rem 0rem 1.25rem;
    margin: 0rem;
    transition: padding-left 300ms ease-in-out, padding-right 300ms ease-in-out;
  }

  .breadcrumb-wrapper,
  .sc-column-layout:not(.sticky-bar) .header-bar-container {
    height: var(--sc-layout-breadcrumb-offset, 2.5rem);
    max-height: var(--sc-layout-breadcrumb-offset, 2.5rem);
    overflow-y: auto;
  }

  .breadcrumb-wrapper > ::slotted([slot='breadcrumb']) {
    width: 100%;
  }

  .header-bar {
    display: flex;
    justify-content: space-between;
  }

  .is-split-view.sticky-bar .header-bar {
    position: unset;
  }
  .sticky-bar .header-bar {
    position: fixed;
    left: calc(var(--sc-layout-sticky-bar-left-offset, 0px) + 0px);
    right: calc(var(--sc-layout-sticky-bar-right-offset, 0px) + 0px);
    top: var(--column-layout-sticky-top-offset, 0px);
    z-index: 400;
    padding: 0.625rem var(--sc-spacing-20) 0.625rem var(--sc-column-sticky-header-padding-left, var(--sc-spacing-24));
    display: flex;
    align-items: center;
    gap: 0.625rem;

    background: var(--sc-layout-header-bar-background-color, var(--sc-color-white));
    border-bottom: var(--sc-sticky-header-border-bottom-width, 1px) solid var(--sc-layout-border-bottom-color);

    height: calc(var(--column-layout-sticky-bar-height, 3.25rem) - 1.25rem);
  }

  .sticky-buttons {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  .additional-wrapper {
    height: var(--column-layout-additional-offset, 0px);
    max-height: var(--column-layout-additional-offset, 0px);
    overflow-y: auto;
  }

  .tablet-portrait-layout {
    --bottom-offset: calc(var(--sc-bottom-offset, 0rem) + var(--sc-layout-bottom-offset, 1.5rem));
  }

  /* Content wrapper */
  .content-wrapper {
    width: 100%;
    padding-left: var(--column-layout-content-wrapper-left-offset, 0px);
    padding-right: var(--column-layout-content-wrapper-right-offset, 0px);
    --collapse-panel-width: 0rem;
    --grid-column-border: 0rem;
    --top-offset: calc(
      var(--sc-layout-top-navigation-offset, 0rem) +
      var(--sc-column-extra-top-offset, 0rem) +
        var(--sc-layout-top-offset, 1.5rem) + var(--sc-layout-header-offset, 3.625rem) +
        var(
          --column-layout-sticky-bar-height,
          var(--sc-layout-breadcrumb-offset, 2.5rem)
        ) + var(--sc-layout-breadcrumb-padding-top, 0rem) +
        var(--column-layout-additional-offset, 0rem)
    );
    --bottom-offset: calc(var(--sc-bottom-offset, 0rem) + var(--sc-layout-bottom-offset, 1.5rem));

    &.unfloatable {
      --grid-column-border: 1px;
    }

    &.exclude-header-offset {
      --top-offset: calc(
        var(--sc-layout-top-navigation-offset, 0rem) +
        var(--sc-column-extra-top-offset, 0rem) +
          var(--sc-layout-top-offset, 1.5rem) +
          var(
            --column-layout-sticky-bar-height,
            var(--sc-layout-breadcrumb-offset, 2.5rem)
          ) + var(--sc-layout-breadcrumb-padding-top, 0rem) +
          var(--column-layout-additional-offset, 0rem)
      );
    }

    &.exclude-breadcrumb-offset {
      --top-offset: calc(
        var(--sc-layout-top-navigation-offset, 0rem) +
        var(--sc-column-extra-top-offset, 0rem) +
          var(--sc-layout-top-offset, 1.5rem) + var(--sc-layout-header-offset, 3.625rem) +
          var(--column-layout-additional-offset, 0rem)
      );
    }

    &.exclude-header-offset.exclude-breadcrumb-offset {
      --top-offset: calc(
        var(--sc-layout-top-navigation-offset, 0rem) +
        var(--sc-column-extra-top-offset, 0rem) +
          var(--sc-layout-top-offset, 1.5rem) +
          var(--column-layout-additional-offset, 0rem)
      );
    }

    &.zooming
      .row-wrapper
      .grid-row
      .grid-column.major
      .column-content-container
      .content-scroll-wrapper {
      transition: padding-left 300ms ease-in-out, padding-right 300ms ease-in-out;
    }

    &.height-cover .grid-row {
      height: calc(
        100vh - var(--top-offset, 0px) - var(--bottom-offset)
      );
      max-height: calc(
        100vh - var(--top-offset, 0px) - var(--bottom-offset)
      );
      overflow-y: auto;
      overflow-x: hidden;
    }

    &.height-cover .grid-column {
      padding-bottom: 0;
    }
  }

  /* Row & grid base */
  .row-wrapper {
    display: flex;
  }

  .content-wrapper .row-wrapper .grid-row {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin-left: calc(
      0px - var(--sc-layout-grid-column-padding-x, var(--grid-column-padding-x))
    );
    margin-right: calc(
      0px - var(--sc-layout-grid-column-padding-x, var(--grid-column-padding-x))
    );
    width: calc(
      100% +
        var(--sc-layout-grid-column-padding-x, var(--grid-column-padding-x)) * 2
    );
  }

  .content-wrapper .row-wrapper .grid-row .grid-column {
    padding-left: var(--column-layout-main-content-padding-x);
    padding-right: var(--column-layout-main-content-padding-x);
    overflow-x: hidden;
    position: relative;

    &.-sc-scroll-target.-sc-scroll-has-y {
      padding-right: max(calc(
        var(--grid-column-padding-x, 0.75rem) - var(--sc-scrollbar-gutter, 0px)
      ), var(--min-scrollbar-padding-x));
    }

    &.left-column.minor,
    &.right-column.minor {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .standard-spacing {
    .content-wrapper .row-wrapper .grid-row {
      padding-left: var(--column-layout-main-content-padding-x);
      padding-right: var(--column-layout-main-content-padding-x);

      &.right-column.major {
        padding-left: var(--column-layout-right-panel-padding-x);
        padding-right: var(--column-layout-right-panel-padding-x);
      }
      &.left-column.major {
        padding-left: var(--column-layout-left-header-padding-x);
        padding-right: var(--column-layout-left-header-padding-x);
      }
    }
  }

  .content-wrapper.main-middle.unfloatable {
    .row-wrapper .grid-row .grid-column {
      padding-left: calc(
        var(--column-layout-main-content-padding-x) - var(--grid-column-border, 1px)
      );
      padding-right: calc(
        var(--column-layout-main-content-padding-x) - var(--grid-column-border, 1px)
      );
      overflow-x: hidden;

      &.-sc-scroll-target.-sc-scroll-has-y {
        padding-right: max(calc(
          var(--column-layout-main-content-padding-x) - var(--grid-column-border, 1px) - var(--sc-scrollbar-gutter, 0px)
        ), var(--min-scrollbar-padding-x));
      }
    }

    .row-wrapper .grid-row .grid-column.left-column,
    .row-wrapper .grid-row .grid-column.right-column {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .content-wrapper.main-left.unfloatable .row-wrapper .grid-column.left-column,
  .content-wrapper.main-middle.unfloatable .row-wrapper .grid-column.left-column {
    overflow-y: auto;
  }

  .content-wrapper .grid-column {
    box-sizing: border-box;
    transition: width 300ms linear, max-width 300ms linear;
  }

  .grid-column.major {
    flex-grow: 1;
    width: auto;
  }

  .grid-column.left-column.minor {
    width: var(--toggle-left-column-panel-width);
    overflow-x: hidden;
  }
  .grid-column.right-column.minor {
    width: var(--toggle-right-column-panel-width);
    overflow-x: hidden;
  }


  /* Content wrapper borders */
  .content-wrapper.unfloatable:not(.right-collapsed):not(.no-right-border) .grid-column.right-column.minor {
    border-left: var(--grid-column-border, 1px) solid
      var(--column-layout-border-color, var(--sc-color-grey-200));
  }
  .content-wrapper.unfloatable .grid-column.right-column.minor {
    padding-left: 0;
  }
  .content-wrapper.unfloatable:not(.left-collapsed):not(.no-left-border) .grid-column.left-column.minor {
    border-right: var(--grid-column-border, 1px) solid
      var(--column-layout-border-color, var(--sc-color-grey-200));
  }

  .content-wrapper.unfloatable.resize-hover-left:not(.left-collapsed):not(.no-left-border) .grid-column.left-column.minor {
    border-right-color: var(--sc-color-blue-650);
    cursor: col-resize;
  }

  .content-wrapper.unfloatable.resize-hover-right:not(.right-collapsed):not(.no-right-border) .grid-column.right-column.minor {
    border-left-color: var(--sc-color-blue-650);
    cursor: col-resize;
  }

  .content-wrapper.resize-hover-left:not(.left-collapsed) .grid-column.left-column.minor,
  .content-wrapper.resize-hover-right:not(.right-collapsed) .grid-column.right-column.minor {
    cursor: col-resize;
  }

  .content-wrapper.resizing,
  .content-wrapper.resizing * {
    user-select: none;
  }

  .column-resize-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 0.625rem;
    z-index: 350;
    cursor: col-resize;
  }

  .column-resize-handle.left {
    right: 0;
  }

  .column-resize-handle.right {
    left: 0;
  }

  .column-resize-handle::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(50% - 0.5px);
    width: 1px;
    background: transparent;
    transition: background-color 120ms ease;
  }

  .column-resize-handle:hover::before,
  .column-resize-handle.active::before {
    background: var(--sc-color-blue-650);
  }

  /* Collapse behavior */
  .right-collapse .grid-column.right-column.minor,
  .right-collapsed .grid-column.right-column.minor,
  .left-collapse .grid-column.left-column.minor,
  .left-collapsed .grid-column.left-column.minor {
    width: 0;
    overflow: hidden;
  }

  .left-collapse .grid-column.left-column.minor .column-content-container,
  .manual-collapse.click-collapse-left:not(.left-collapse) .grid-column.left-column.minor .column-content-container {
    width: var(--toggle-left-column-panel-width);
  }
  .right-collapse .grid-column.right-column.minor .column-content-container,
  .manual-collapse.click-collapse-right:not(.right-collapse) .grid-column.right-column.minor .column-content-container {
    width: var(--toggle-right-column-panel-width);
  }

  .collapse-icon-wrapper {
    position: relative;

    &.collapsed {
      z-index: 410;
    }
  }
  .collapse-block {
    display: flex;
    padding: 8px;
    flex-shrink: 0;
    z-index: 100;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    cursor: pointer;
    color: var(
      --sc-column-layout-collapse-text-color,
      var(--sc-color-grey-black)
    );

    &.collapsed {
      position: absolute;
      overflow: hidden;
      right: 0px;
      padding: 6px;
      background: var(--sc-column-layout-collapse-background-color, var(--sc-color-white));
      box-shadow: 0px 0px 4px 0px rgba(0,0,0,.15);
    }
    &.collapsed sc-icon:hover {
      color: var(--sc-button-text-hover-text-color, var(--sc-color-blue-400));
    }

    &.left:not(.absolute):not(.collapsed) {
      padding-right: 0;
    }
    &.left.absolute:not(.collapsed) {
      position: absolute;
      top: 1px;
      right: 1px;
    }
    &.left.collapsed {
      padding-left: 4px;
      top: calc(var(--column-layout-additional-offset, var(--top-offset, 0px)) + var(--column-layout-left-header-height) / 2 - 0.75rem);
      left: 0;
      right: unset;
      border-radius: 0 50% 50% 0;
    }

    &.right.absolute:not(.collapsed) {
      position: absolute;
      top: 1px;
      left: 1px;
    }
    &.right:not(.absolute):not(.collapsed) {
      padding-left: 0;
    }
    &.right.collapsed {
      padding-right: 4px;
      top: calc(var(--column-layout-additional-offset, var(--top-offset, 0px)) + var(--column-layout-right-header-height) / 2 - 0.75rem);
      border-radius: 50% 0 0 50%;
    }

    sc-icon {
      margin-left: 2px;
    }
  }

  .collapse-block.left.collapsed sc-icon,
  .collapse-block.right:not(.collapsed) sc-icon {
    transform: rotate(180deg);
  }

  .collapse-panel {
    width: var(--collapse-panel-width, 0px);
    max-width: var(--collapse-panel-width, 0px);
    max-height: 1.25rem;
    overflow: hidden;
    position: absolute;
    padding-left: 1px;

    &.left {
      margin-left: calc(0px - var(--grid-column-padding-x, 0.75rem));
      margin-right: calc(var(--grid-column-padding-x, 0.75rem) * 2);
      left: 1.25rem;
    }
    &.right {
      margin-right: calc(0px - var(--grid-column-padding-x, 0.75rem));
      margin-left: calc(var(--grid-column-padding-x, 0.75rem) * 2);
      right: 1.25rem;
    }
  }

  .collapse-wrapper {
    max-height: calc(
      100vh - var(--top-offset, 0rem) - var(--bottom-offset)
    );
    width: var(--toggle-right-column-panel-width);

    &.left {
      width: var(--toggle-left-column-panel-width);
    }
  }

  /* Column headers */
  .left-column-header-bar,
  .right-column-header-bar {
    position: relative;
    box-sizing: border-box;
    height: var(--column-layout-left-header-height);
    max-height: var(--column-layout-left-header-height);
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;
    padding: 0 var(--column-layout-left-header-padding-x);
    align-items: center;
    justify-content: space-between;
  }
  .right-column-header-bar {
    padding: 0 var(--column-layout-right-header-padding-x);
    height: var(--column-layout-right-header-height);
    max-height: var(--column-layout-right-header-height);
    justify-content: unset;
  }
  .left-column-header-bar > ::slotted([slot='left-header']),
  .right-column-header-bar > ::slotted([slot='right-header']) {
    flex: 1;
  }
  .left-column-header-bar.collapsible {
    flex-direction: row-reverse;
  }

  .left-column-header-bar.divider,
  .right-column-header-bar.divider {
    border-bottom: 1px solid var(--column-layout-border-color, var(--sc-color-grey-200));
  }

  .draggable-bar {
    /* border and background part */
    --r: 1em; /* the radius */
    --smallR: 0.25rem;
    --bg-color: var(
            --sc-bottom-sheet-background-color,
            var(--sc-color-white)
          );

    position: relative;
    box-sizing: border-box;
    height: 2rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    padding: 0 0.75rem;
    background: var(--bg-color);
    box-shadow: 0px 0px 4px 0px rgba(26, 26, 26, 0.15);
    opacity: 0.9;
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: var(--r) var(--r) 0 0;
  }
  .rotate-90 {
    transform: rotateZ(90deg);
  }

  /* Height cover details (group by last selector) */
  .content-wrapper.height-cover .grid-row > .grid-column {
    max-height: 100%;
    overflow-y: auto;
  }
  .content-wrapper.height-cover .grid-row > .grid-column > .column-content-container > .content-scroll-wrapper {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin-left: calc(0px - var(--column-layout-main-content-padding-x));
    margin-right: calc(0px - var(--column-layout-main-content-padding-x));

    & ::slotted(*) {
      padding-left: calc(2 * var(--column-layout-main-content-padding-x));
      padding-right: calc(2 * var(--column-layout-main-content-padding-x));
      box-sizing: border-box;
    }
  }

  .content-wrapper.height-cover .grid-row > .grid-column > .column-content-container > .left-slot-wrapper {
    height: calc(100% - var(--column-layout-left-header-height, 0px));
    overflow-y: auto;
    overflow-x: hidden;

    & ::slotted([slot='left']) {
      box-sizing: border-box;
      overflow-x: hidden;
      padding: var(--column-layout-left-panel-padding-top) var(--column-layout-left-panel-padding-x) var(--column-layout-left-panel-padding-bottom);
    }
  }
  .sc-column-layout:not(.has-left-header-divider) .content-wrapper.height-cover .grid-row > .grid-column > .column-content-container > .left-slot-wrapper ::slotted([slot='left']) {
    padding-top: 0rem;
  }

  .content-wrapper.height-cover .grid-row > .grid-column > .column-content-container > .right-slot-wrapper {
    height: calc(100% - var(--column-layout-right-header-height, 0px));
    overflow-y: auto;
    overflow-x: hidden;
    
    & ::slotted([slot='right']) {
      box-sizing: border-box;
      overflow-x: hidden;
      padding: var(--column-layout-right-panel-padding-top) var(--column-layout-right-panel-padding-x) var(--column-layout-right-panel-padding-bottom);
      padding-left: calc(var(--column-layout-right-panel-padding-x) * 2 - var(--grid-column-border, 1px));
    }
  }
  .sc-column-layout:not(.has-right-header-divider) .content-wrapper.height-cover .grid-row > .grid-column > .column-content-container > .right-slot-wrapper ::slotted([slot='right']) {
    padding-top: 0rem;
  }

  .has-left-header .content-wrapper.height-cover .grid-row > .grid-column.left-column.major > .column-content-container > .content-scroll-wrapper,
  .has-left-action .content-wrapper.height-cover .grid-row > .grid-column.left-column.major > .column-content-container > .content-scroll-wrapper {
    height: calc(100% - var(--column-layout-left-header-height, 0px));
  }
  .has-left-header.has-left-action .content-wrapper.height-cover .grid-row > .grid-column.left-column.major > .column-content-container > .content-scroll-wrapper,
  .has-left-header.has-left-action .content-wrapper.height-cover .grid-row > .grid-column > .column-content-container > .left-slot-wrapper {
    height: calc(100% - var(--column-layout-left-header-height, 0px) * 2);
  }
  .has-right-header .content-wrapper.height-cover .grid-row > .grid-column.right-column.major > .column-content-container > .content-scroll-wrapper {
    height: calc(100% - var(--column-layout-right-header-height, 0px));
  }
  .has-right-header .content-wrapper.height-cover.unfloatable.main-right:not(.exclude-header-offset) .grid-row > .grid-column.right-column.major > .column-content-container > .content-scroll-wrapper {
    height: calc(100% - var(--sc-layout-header-offset, 3.625rem) - var(--column-layout-right-header-height, 0px));
  }

  .has-left-header .content-wrapper.height-cover .grid-row > .grid-column.left-column.major  > .column-content-container > .left-column-header-bar,
  .has-right-header .content-wrapper.height-cover .grid-row > .grid-column.right-column.major  > .column-content-container > .right-column-header-bar {
    margin-left: calc(0px - var(--column-layout-main-content-padding-x, 0.75rem));
    margin-right: calc(0px - var(--column-layout-main-content-padding-x, 0.75rem));
    padding: 0 calc(var(--column-layout-main-content-padding-x, 0.75rem) * 2); 
  }

  .has-left-header.standard-spacing .content-wrapper.height-cover .grid-row > .grid-column.left-column.major > .column-content-container > .left-column-header-bar {
    margin-left: calc(0px - var(--column-layout-left-header-padding-x));
    margin-right: calc(0px - var(--column-layout-left-header-padding-x));
    padding: 0 calc(var(--column-layout-left-header-padding-x) * 2);
  }
  .has-right-header.standard-spacing .content-wrapper.height-cover .grid-row > .grid-column.right-column.major > .column-content-container > .right-column-header-bar {
    margin-left: calc(0px - var(--column-layout-right-header-padding-x));
    margin-right: calc(0px - var(--column-layout-right-header-padding-x));
    padding: 0 calc(var(--column-layout-right-header-padding-x) * 2);
  }

  .content-wrapper.unfloatable.main-left:not(.exclude-header-offset) .grid-row > .grid-column.left-column.major > .column-content-container > .content-scroll-wrapper,
  .content-wrapper.unfloatable.main-middle:not(.exclude-header-offset) .grid-row > .grid-column.middle-column.major > .column-content-container > .content-scroll-wrapper,
  .content-wrapper.unfloatable.main-right:not(.exclude-header-offset) .grid-row > .grid-column.right-column.major > .column-content-container > .content-scroll-wrapper {
    height: calc(100% - var(--sc-layout-header-offset, 3.625rem));
  }

  .content-wrapper .grid-row > .grid-column > .column-content-container {
    box-sizing: border-box;
    height: 100%;
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .content-wrapper .grid-row > .grid-column.major > .column-content-container {
    padding-top: var(--column-layout-main-content-padding-top);
    padding-bottom: var(--column-layout-main-content-padding-bottom);
  }

  /* Overlays & animations */
  .portrait-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.35);
    z-index: 410;

    &.show {
      animation: show-overlay 0.25s ease forwards;
    }
  }
  
  /* support Safari check width */
  .is-safari .portrait-overlay {
    width: calc(100vw - var(--sc-layout-sticky-bar-left-offset, 0rem));
  }

  .left-collapsed .portrait-overlay.left {
    display: none;
  }
  .left-collapse:not(.left-collapsed) .portrait-overlay.left {
    animation: hide-overlay 0.25s ease forwards;
  }

  @keyframes show-overlay {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes hide-overlay {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  /* Tablet & mobile */
  .tablet-column-layout:not(.left-collapse):not(.left-collapsed) .grid-column.left-column.minor.tablet-portrait,
  .tablet-column-layout:not(.right-collapse):not(.right-collapsed) .grid-column.right-column.minor.tablet-portrait {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 420;

    &.left-column {
      width: var(--left-column-width);
    }
    
    &.right-column {
      top: unset;
      height: var(--column-layout-max-container-height);
      left: 0;
      right: auto;
      bottom: 0;
      width: calc(100vw - var(--sc-layout-sticky-bar-left-offset, 0rem));
    }
  }
  .tablet-column-layout {
    &.is-safari.right-collapse.has-right-column,
    &.is-safari.right-collapsed.has-right-column {
      will-change: transform;
    }

    .grid-column.right-column.minor.tablet-portrait {
      width: calc(100vw - var(--sc-layout-sticky-bar-left-offset, 0rem));
    }
    &.right-collapse .grid-column.right-column.minor.tablet-portrait,
    &.right-collapsed .grid-column.right-column.minor.tablet-portrait {
      position: absolute;
      z-index: 700;
      height: 2.2rem;
      left: 0;
      bottom: 0;
    }
  }
  .tablet-column-layout.height-auto {
    &:not(.left-collapse):not(.left-collapsed) .grid-column.left-column.minor.tablet-portrait {
      position: fixed;
      z-index: 700;
      height: var(--column-layout-max-container-height);
      top: var(--sc-layout-top-navigation-offset, 0rem);
    }

    &.right-collapse .grid-column.right-column.minor.tablet-portrait,
    &.right-collapsed .grid-column.right-column.minor.tablet-portrait {
      position: fixed;
      z-index: 700;
      width: calc(100vw - var(--sc-layout-sticky-bar-left-offset, 0rem));
      height: 2.2rem;
      left: var(--sc-layout-sticky-bar-left-offset, 0rem);
      bottom: max(var(--sc-bottom-offset, 0rem), 0rem);
    }
    
    &:not(.right-collapse):not(.right-collapsed) .grid-column.right-column.minor.tablet-portrait {
      position: fixed;
      z-index: 700;
      left: var(--sc-layout-sticky-bar-left-offset, 0rem);
      bottom: max(var(--sc-bottom-offset, 0rem), 0rem);
      padding-right: 2.5rem;
    }
  }

  .tablet-left-collapse-icon-container {
    position: absolute;
    height: 2rem;
    left: var(--left-column-width);
    bottom: 0;
    z-index: 420;
    transition: left 0.25s ease;

    &.collapsed {
      left: 0;
    }

    & .collapse-block.left {
      top: 0;
      box-sizing: border-box;
      width: 2rem;
      height: 2rem;
      background: var(--sc-column-layout-collapse-background-color, var(--sc-color-white));
      border-radius: 0 0.75rem 0 0;

      &:not(.collapsed):not(.absolute) {
        padding-right: 0.5rem;
      }
    }

    &.pc-device.left {
      top: calc(var(--column-layout-left-header-height) / 2 - 0.75rem);
      & .collapse-block.left {
        border-radius: 0 50% 50% 0;
      }
    }
  }
  .left-collapse .tablet-left-collapse-icon-container.left {
    left: 0;
  }
  .tablet-column-layout.height-auto .tablet-left-collapse-icon-container.left {
    position: fixed;
    bottom: var(--bottom-offset, var(--sc-bottom-offset, 0px));
  }

  @media (min-width: 1800px) {
    .content-wrapper.main-width-85
      .row-wrapper
      .grid-row
      .grid-column.major
      .column-content-container
      h1.title,
    .content-wrapper.main-width-85
      .row-wrapper
      .grid-row
      .grid-column.major
      .column-content-container
      .content-scroll-wrapper {
        padding-left: calc((100% - 1120px) / 2);
        padding-right: calc((100% - 1120px) / 2);

      &.-sc-scroll-target.-sc-scroll-has-y {
        padding-right: max(calc(
          calc((100% - 1120px) / 2) - var(--sc-scrollbar-gutter, 0px)
        ), var(--min-scrollbar-padding-x));
      }
    }
    .content-wrapper.main-width-85 .user-action-wrap {
      right: calc((100% - 1120px) / 2 - var(--grid-column-padding-x, 0.75rem));
    }
  }

  @media (min-width: 768px) {
    .grid-column {
      max-height: 100%;
    }

    .content-wrapper.unfloatable .right-column {
      overflow-y: auto;
    }

    .content-wrapper.manual-collapse.left-collapse:not(.normal) .grid-column[md='9'].major,
    .content-wrapper.manual-collapse.right-collapse:not(.normal) .grid-column[md='9'].major,
    .content-wrapper .grid-column[md='12'] {
      max-width: calc(100% - 2px);
      width: auto;
    }

    .left-collapse.content-wrapper.manual-collapse .grid-column[md='6'].middle-column,
    .left-collapsed.content-wrapper.manual-collapse.click-collapse-right:not(.right-collapse) .grid-column[md='9'].middle-column,
    .left-collapsed.content-wrapper:not(.manual-collapse) .grid-column[md='9'].middle-column {
      max-width: calc(100% - var(--toggle-right-column-panel-width) - 2px);
      width: auto;
    }
    .right-collapse.content-wrapper.manual-collapse .grid-column[md='6'].middle-column,
    .right-collapsed.content-wrapper.manual-collapse.click-collapse-left:not(.left-collapse) .grid-column[md='9'].middle-column,
    .right-collapsed.content-wrapper .grid-column[md='9'].middle-column {
      max-width: calc(100% - var(--toggle-left-column-panel-width) - 2px);
      width: auto;
    }
    .content-wrapper:not(.manual-collapse) .grid-column[md='9'].left-column.major,
    .content-wrapper.normal .grid-column[md='9'].left-column.major {
      max-width: calc(100% - var(--toggle-right-column-panel-width) - 2px);
      width: auto;
    }
    .content-wrapper:not(.manual-collapse) .grid-column[md='9'].right-column.major,
    .content-wrapper.normal .grid-column[md='9'].right-column.major {
      max-width: calc(100% - var(--toggle-left-column-panel-width) - 2px);
      width: auto;
    }

    .content-wrapper.normal .grid-column[md='6'].major,
    .content-wrapper:not(.manual-collapse) .grid-column[md='6'].major {
      width: auto;
      max-width: calc(100% - var(--toggle-left-column-panel-width) - var(--toggle-right-column-panel-width) - 2px);
    }

    .grid-column[md='3'],
    .grid-column[md='3'] {
      width: calc(25% - 2px);
    }

    .grid-column[md='0'],
    .grid-column[xl='0'] {
      display: none;
    }
  }

  @media (max-width: 1400px) {
    /* side column expand */
    .content-wrapper.manual-collapse.click-collapse-left:not(.left-collapse)
      .grid-column.left-column.minor {
      transition: width 300ms 10ms linear, max-width 300ms 10ms linear;
    }
    .content-wrapper.manual-collapse.click-collapse-right:not(.right-collapse)
      .grid-column.right-column.minor,
    .content-wrapper.manual-collapse.left-collapse
      .grid-column.right-column.major,
    .content-wrapper.manual-collapse.right-collapse
      .grid-column.left-column.major {
      transition: width 305ms linear, max-width 305ms linear;
    }
  }

  @media (max-width: 768px) {
    .grid-column[xs] {
      width: calc(
        100% - var(--grid-column-padding-x, 0.75rem) -
          var(--grid-column-padding-x, 0.75rem)
      );
    }

    .grid-column[xs='0'] {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .grid-column[xs] {
      width: calc(
        100% - var(--grid-column-padding-x, 0.75rem) -
          var(--grid-column-padding-x, 0.75rem)
      );
    }

    .grid-column[xs='0'] {
      display: none;
    }
  }

  /* ===== Component type overrides ===== */
  :host([type="component"]) {
    display: block;
  }

  :host([type="component"]) .sc-column-layout {
    padding: 0;
    height: 100%;
    --column-layout-max-container-height: 100%;
  }

  :host([type="component"]) .page-content,
  :host([type="component"]) .content-wrapper,
  :host([type="component"]) .row-wrapper {
    height: 100%;
  }

  :host([type="component"]) .content-wrapper.height-cover .grid-row {
    height: 100%;
    max-height: 100%;
  }

  :host([type="component"]) .collapse-wrapper {
    max-height: 100%;
  }

  :host([type="component"]) .sticky-bar .header-bar {
    position: sticky;
    top: 0;
    left: unset;
    right: unset;
  }

  :host([type="component"]) .tablet-column-layout.height-auto:not(.left-collapse):not(.left-collapsed) .grid-column.left-column.minor.tablet-portrait {
    position: absolute;
    height: 100%;
    top: 0;
  }

  :host([type="component"]) .tablet-column-layout.height-auto .grid-column.right-column.minor.tablet-portrait {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  :host([type="component"]) .tablet-column-layout.height-auto .tablet-left-collapse-icon-container.left {
    position: absolute;
    bottom: 0;
  }

  :host([type="component"]) .is-safari .portrait-overlay {
    width: 100%;
  }

  :host([type="component"]) .tablet-column-layout .grid-column.right-column.minor.tablet-portrait {
    width: 100%;
  }
`;
