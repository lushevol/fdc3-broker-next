import { css } from 'lit';

export default css`
  .sc-card {
    box-shadow: var(--sc-card-box-shadow-color) 0px 1px 4px 0px;
    border-radius: var(--sc-radius-sm, 0.375rem);
    position: relative;
    size: 0.75rem;
    color: var(--sc-card-text-color, var(--sc-color-blue-900));
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--sc-card-background, var(--sc-card-background-color, var(--sc-color-white)));
    border: 1px solid var(--sc-card-border-color, transparent);
    transition: border-color 0.2s ease-in-out, background 0.2s ease-in-out;
    cursor: pointer;
  }

  .sc-card.vertical {
    display: flex;
    flex-direction: column;
  }

  .sc-card:hover {
    --sc-card-border-color: var(
      --sc-card-hover-border-color,
      var(--sc-color-blue-650)
    );
  }

  .sc-card.non-clickable {
    --sc-card-box-shadow: var(--sc-card-non-clickable-box-shadow, none);
    --sc-card-border-color: var(
      --sc-card-non-clickable-border-color,
      var(--sc-color-grey-150)
    );
    cursor: default;
  }

  .card-content-image-wrapper {
    display: flex;
    flex-grow: 1;
    padding: 0;
    margin: 0;
    overflow: auto;
  }

  .sc-card.selected {
    --sc-card-border-color: var(
      --sc-card-selected-border-color,
      var(--sc-color-blue-650)
    );
    background: var(--sc-card-selected-background, var(--sc-color-blue-50));
  }

  .sc-card.disabled {
    --sc-card-border-color: var(
      --sc-card-disabled-border-color,
      var(--sc-color-grey-250)
    );
    background: var(--sc-card-disabled-background, var(--sc-color-grey-100));
    cursor: not-allowed;
  }

  .top-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: relative;
    margin-bottom: var(--sc-card-top-container-margin-bottom, 0.5rem);
    box-sizing: border-box;
  }

  .icon-container.with-drag {
    gap: 0.125rem;
  }

  .icon-container {
    display: flex;
    z-index: 1;
  }

  .icon-container:not(.vertical).items-center,
  .icon-container:not(.vertical).items-end {
    flex-direction: column;
  }

  .icon-container:not(.vertical).items-center {
    justify-content: center;
  }

  .icon-container:not(.vertical).items-end {
    justify-content: flex-end;
  }

  .icon-container.left {
    margin-right: var(--sc-card-icon-container-margin-right, 0.5rem);
  }

  .icon-container.right {
    margin-left: 0.5rem;
  }

  .card-action-dropdown-content {
    position: absolute;
    padding: 0.5rem;
    overflow: auto;
    right: 0;
    top: 100%;
    border-radius: var(--sc-radius-sm, 0.375rem);
    background: var(--sc-card-background-color, var(--sc-color-white));
    box-shadow: var(--sc-card-box-shadow-color) 0px 1px 4px 0px;
  }

  .card-drag-button,
  .card-action-button,
  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
    --sc-icon-button-display: flex;
  }

  .card-action-button {
    color: var(--sc-card-action-button-text-color, var(--sc-color-blue-850))
  }

  .card-drag-button {
    color: var(--sc-card-drag-color, var(--sc-color-grey-400));
  }

  .items-start {
    align-items: flex-start;
  }

  .items-end {
    align-items: flex-end;
  }

  .items-center {
    align-items: center;
  }

  .text-left {
    text-align: left;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-justify {
    text-align: justify;
  }

  .hover:hover {
    background: var(--sc-card-hover-background-color, var(--sc-color-blue-50)) !important;
    border-color: var(--sc-card-hover-border-color, var(--sc-color-blue-650)) !important;
  }

  .no-border {
    box-shadow: none;
    border: none;
  }

  .sc-card.vertical .content {
    flex-direction: column;
  }

  .content {
    display: flex;
    width: 100%;
    align-items: var(--sc-card-content-align-items, flex-start);
    overflow: hidden;
  }

  .content.icon-items-center,
  .content.icon-items-end {
    --sc-card-content-align-items: stretch;
  }

  .sc-card:not(.card-with-prefix-slot):not(.card-with-suffix-slot) .content {
    width: 100%;
  }

  .card-header {
    display: var(--sc-card-header-display, flex);
    overflow: hidden;
    width: 100%;
    flex-grow: 1;
    margin-bottom: var(--sc-card-header-margin-bottom, 0rem);
  }

  .sc-card:not(.card-with-header-slot) .card-header-slot {
    display: none;
  }

  .card-prefix {
    display: flex;
    margin-right: var(--sc-card-prefix-margin-right, -1rem);
    margin-left: var(--sc-card-prefix-margin-left, 1rem);
    margin-top: var(--sc-card-prefix-margin-top, 1.1rem);
    max-width: var(--sc-card-prefix-max-width, 15%);
    word-break: break-word;
  }
  
  .card-image-slot {
    display: flex;
    overflow: hidden;
  }

  .card-image-slot.vertical {
    width: 100%;
    border-top-left-radius: var(--sc-radius-sm, 0.375rem);
    border-top-right-radius: var(--sc-radius-sm, 0.375rem);
  }

  .card-image-slot.horizontal {
    height: 100%;
    border-top-left-radius: var(--sc-radius-sm, 0.375rem);
    border-bottom-left-radius: var(--sc-radius-sm, 0.375rem);
  }

  .sc-card:not(.card-with-prefix-slot) .card-prefix-slot {
    display: none;
    --sc-card-prefix-margin-right: 0;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    flex-grow: var(--sc-card-content-flex-grow, 1);
    flex-basis: var(--sc-card-content-flex-basis, auto);
    overflow: hidden;
  }

  .card-sub-title {
    display: var(--sc-card-sub-title-display, block);
    color: var(--sc-card-sub-title-color, var(--sc-color-grey-900));
    font-size: var(--sc-card-sub-title-font-size, 0.625rem);
    line-height: var(--sc-card-sub-title-line-height, 1.2em);
  }

  .sc-card:not(.card-with-sub-title-slot) .card-sub-title-slot {
    --sc-card-sub-title-display: none;
  }

  .card-title {
    display: block;
    color: var(--sc-card-title-color, var(--sc-color-grey-900));
    font-size: var(--sc-card-title-font-size, 0.875rem);
    font-weight: 600;
    line-height: var(--sc-card-title-line-height, 1.571em);
  }

  .sc-card:not(.card-with-title-slot) .card-title-slot {
    display: none;
  }

  .card-body {
    display: block;
    color: var(--sc-card-body-color, var(--sc-color-grey-600));
    font-size: var(--sc-card-font-size, 0.75rem);
    line-height: var(--sc-card-line-height, 1.333em);
  }

  .card-body.not-expanded {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sc-card:not(.card-with-body-slot) .card-body-slot {
    display: none;
  }

  .sc-card:not(.card-with-body-slot) .card-title-slot {
    margin-bottom: 0;
  }

  .card-suffix {
    display: flex;
    margin-left: var(--sc-card-suffix-margin-left, -1rem);
    margin-right: var(--sc-card-suffix-margin-right, 1rem);
    margin-top: var(--sc-card-suffix-margin-top, 1.1rem);
    max-width: var(--sc-card-suffix-max-width, 15%);
    word-break: break-word;
  }

  .sc-card:not(.card-with-suffix-slot) .card-suffix-slot {
    display: none;
    --sc-card-suffix-margin-left: 0;
  }

  .card-footer {
    display: flex;
    overflow: hidden;
    width: 100%;
    flex-grow: 1;
    margin-top: var(--sc-card-footer-margin-top, 0rem);
  }

  .sc-card:not(.card-with-footer-slot) .card-footer-slot {
    display: none;
  }

  .tags-container {
    display: flex;
    margin-top: var(--sc-card-tags-container-margin-top, 1rem);
    gap: 0.5rem;
    align-items: center;
    overflow: var(--sc-card-tags-container-overflow, hidden);
    white-space: nowrap;
  }

  .supplementary-container {
    display: flex;
    flex-wrap: wrap; /* Allow wrapping */
    margin-top: var(--sc-card-supplementary-container-margin-top, 1rem);
    flex-wrap: wrap;
  }

  .separator {
    margin: 0 0.5rem;
    font-weight: 500;
    font-size: var(
      --sc-card-supplementary-detail-separator-font-size,
      0.875rem
    );
  }

  .supplementary-detail {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    color: var(--sc-card-supplementary-detail-color, var(--sc-color-blue-750));
    font-size: var(--sc-card-supplementary-detail-font-size, 0.75rem);
    line-height: var(--sc-card-supplementary-detail-line-height, 1.5em);
  }

  .supplementary-detail sc-icon {
    margin-right: 0.25rem;
  }

  .button-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    border-top: 1px solid
      var(--sc-card-footer-border-top-color, var(--sc-color-grey-150));
    width: 100%;
    padding: 1rem;
    margin-top: var(--sc-card-footer-margin-top, 1rem);
    box-sizing: border-box;
  }

  .left-button-container {
    display: flex;
  }

  .right-button-container {
    display: flex;
    gap: 0.5rem;
  }
  
  .sc-button-truncate {
    .left-button-container,
    .left-button-container .left-button,
    .right-button-container,
    .right-button-container .primary-button,
    .right-button-container .secondary-button {
      flex: 1;
      min-width: 0;
      max-width: max-content;
    }
  }

  .expandable {
    font-size: var(--sc-card-expandable-font-size, 0.875rem);
    line-height: var(--fsc-card-expandable-line-height, 1.571em);
    color: var(--sc-card-expandable-color, var(--sc-color-blue-500));
    font-weight: 500;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  .number-tag::part(tooltip) {
    --sc-tooltip-container-cursor: pointer;
  }
`;
