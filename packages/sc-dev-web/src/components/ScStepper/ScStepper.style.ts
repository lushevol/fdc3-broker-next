import { css } from 'lit';

export default css`
  /*STEPPER [HORIZONTAL]*/
  .sc-stepper.horizontal {
    --header-padding: 0px;
  }

  /*STEPPER [VERTICAL], LEFT & RIGHT STEPPER [HORIZONTAL]*/
  .sc-stepper.horizontal.title-left,
  .sc-stepper.horizontal.title-right,
  .sc-stepper.horizontal.mode-title,
  .sc-stepper:not(.horizontal) {
    --header-padding: 0.5rem;
  }

  /*STEPPER*/
  :host {
    display: block;
    overflow: visible;
    max-width: 100%;
    max-height: 100%;
  }

  .sc-stepper {
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;
    --step-background: transparent;
    --margin: 0px calc(0px - var(--header-padding));
    --header-gap: 0;
    --header-text-gap: 0.5rem;
    --step-header-padding: var(--header-padding);
    --step-header-align-items: center;

    /*Indicator*/
    --indicator-size: 1.5rem;
    --indicator-size-default: 1.5rem;
    --indicator-size-compact: 0.625rem;
    --indicator-box-shadow-size: 1px;
    --step-indicator-display: flex;
    --step-indicator-container-display: block;

    /*Separator*/
    --separator-size: 1px;
    --separator-type: solid;
    --separator-position: calc(
      var(--header-padding) + (var(--indicator-size) / 2) -
        (var(--separator-size) / 2)
    );
    --separator-min-width: 2.25rem;
    --separator-min-width--header: 0px;
    --separator-min-width--full: calc(
      var(--separator-min-width) + var(--separator-min-width--header)
    );

    /*Step min width*/
    --header-min-width: calc(
      var(--indicator-size) + (var(--header-padding) * 2)
    );
    --step-min-width: calc(
      var(--header-min-width) + var(--separator-min-width--full)
    );
    --step-min-width--first-step: var(--header-min-width);
  }

  /*STEPPER [HORIZONTAL]*/
  .sc-stepper.horizontal {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    /* for scrollbar height */
    padding-bottom: 0.375rem;
  }

  .sc-stepper {
    margin: var(--margin, 0);
  }

  .sc-stepper.horizontal ::slotted(sc-step) {
    /*display: contents make all direct children of the step to behave like they are direct children of the stepper*/
    display: contents;
    pointer-events: none;

    --align-text: center;
    --align-text-left: left;
    --align-items: center;
    --align-items-start: flex-start;
  }

  .sc-stepper.horizontal ::slotted(sc-step[flex-column='true']) {
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    flex: 1;
    scroll-snap-align: center;
    max-width: 100%;
  }

  /*FIRST STEP*/
  .sc-stepper.horizontal ::slotted(sc-step:first-of-type) {
    --horizontal-separator-visibility--first-of-type: none;
  }

  /*LAST STEP*/
  .sc-stepper.horizontal ::slotted(sc-step:last-of-type) {
    --horizontal-separator-visibility--last-of-type: none;
    flex-grow: 0;
  }

  .sc-stepper.horizontal.title-left,
  .sc-stepper.horizontal.title-right {
    --step-min-width--first-step: calc(
      var(--header-min-width) + var(--indicator-size) + var(--header-padding)
    );
    /* stylelint-disable */
    --step-min-width: calc(
      var(--header-min-width) + var(--separator-min-width--full) -
        var(--separator-min-width--header) + var(--indicator-size) +
        var(--header-padding)
    );
    /* stylelint-enable */
  }

  /*FIRST STEP*/
  ::slotted(sc-step:first-of-type) {
    --horizontal-separator-display--first-of-type: none;
    --horizontal-info-padding-left-first-of-step: 0;
  }

  /*LAST STEP*/
  ::slotted(sc-step:last-of-type) {
    --horizontal-separator-display--last-of-type: none;
    --horizontal-info-padding-right-last-of-step: 0;
  }

  /*NOT FULL HEADER*/
  .sc-stepper:not(.mode-full) {
    /* stylelint-disable */
    --step-min-width: calc(
      var(--header-min-width) + var(--separator-min-width--full) -
        var(--separator-min-width--header)
    );
    /* stylelint-enable */

    --separator-display-not-full: none;
  }

  .sc-stepper:not(.mode-full) ::slotted(sc-step) {
    --step-not-full-header-alignment: center;
  }

  /*FULL HEADER*/
  .sc-stepper.mode-full ::slotted(sc-step) {
    --step-separator-position: var(--separator-position);
  }

  /*STEPPER [VERTICAL]*/
  .sc-stepper:not(.horizontal) {
    --vertical-header-z-index: 2;
    --header-width-vertical: 100%;
    --hide-horizontal-separator: none;

    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .sc-stepper:not(.horizontal) ::slotted(sc-step) {
    --horizontal-separator-display: none;
    --vertical-separator-height: 100%;
    --step-header-padding: 0 var(--header-padding)
      calc(var(--header-padding) * 2);
    --step-header-align-items: start;
    --step-separator-padding: var(--indicator-size) 0px 0px;
    --step-separator-left-position: calc(var(--indicator-size) / 2 + 0.5rem);
    --step-hide-last-of-type: none;
    --step-hide-first-of-type: none;
    --step-width: 100%;

    display: flex;
    flex-direction: column;
  }

  .sc-stepper:not(.horizontal) ::slotted(sc-step:last-of-type) {
    --step-header-padding: 0 var(--header-padding) 0;
  }

  .sc-stepper:not(.horizontal) ::slotted(sc-step:last-of-type) {
    --hide-last-separator: none;
    --vertical-separator-height: 0%;
  }

  .expand-collapse {
    padding: 0.5rem 0 0 0.5rem;
    font-size: 0.875rem;
    color: var(--sc-color-blue-500);
    cursor: pointer;

    sc-icon {
      vertical-align: sub;
      margin-left: 0.25rem;
    }
  }
  .display-none {
    display: none !important;
  }
  .display-block {
    display: block;
  }


  :host([min-horizontal-response='scroll']) {
    .sc-stepper.horizontal {
      --header-padding: 0px;
      
      overflow-x: auto;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;

      &.dragging {
        cursor: grabbing;
        scroll-snap-type: none;
        scroll-behavior: auto;
        user-select: none;
      }
    }
  }

`;

