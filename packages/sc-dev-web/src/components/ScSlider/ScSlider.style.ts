import { css } from 'lit';

export default css`
  .container {
    display: flex;
    flex-direction: row;
    align-items: start;
    gap: 1rem;
    width: 100%;
  }
  .container.no-label {
    padding-top: 1.25rem;
  }
  .container.no-label.string,
  .container.no-label.compact {
    padding-top: 0;
  }
  .container.marked {
    padding-bottom: 2rem;
  }

  .slider {
    position: relative;
    display: block;
    height: 0.25rem;
    flex: 1;
    padding: 0.875rem 0;
    margin: 0 0.625rem;
    cursor: pointer;
  }
  .slider:focus {
    outline: none;
  }

  .slider-rail {
    display: block;
    background-color: var(--sc-slider-rail-color, var(--sc-color-grey-200));
    height: inherit;
    margin: 0 -0.625rem;
  }
  .slider-track {
    display: block;
    position: absolute;
    top: 0.875rem;
    background-color: var(--sc-slider-track-color, var(--sc-color-blue-500));
    height: inherit;
    transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, 
      width 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
  .slider-handle {
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--sc-slider-background-color, var(--sc-color-white));
    border: 1px solid var(--sc-slider-border-color, var(--sc-color-grey-200));
    border-radius: 50%;
    outline: 0 solid var(--sc-slider-focus-color, var(--sc-color-blue-200));
    outline-offset: 0.125rem;
    transition: left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
  .slider-handle::before {
    display: block;
    content: ' ';
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    box-shadow: 0px 1px 3px 1px var(--sc-slider-shadow-color, var(--sc-color-grey-900));
    opacity: 0.15;
  }

  .slider.no-transition .slider-track,
  .slider.no-transition .slider-handle {
    transition: none;
  }
  .slider-handle:hover {
    background-color: var(--sc-slider-hover-background-color, var(--sc-color-blue-50));
    border-color: var(--sc-slider-hover-border-color, var(--sc-color-blue-450));
  }
  .slider-handle.active {
    background-color: var(--sc-slider-pressed-background-color, var(--sc-color-grey-100));
    border-color: var(--sc-slider-pressed-border-color, var(--sc-color-blue-600));
  }
  
  .slider-handle:focus-visible {
    outline: 0.125rem solid var(--sc-slider-focus-color, var(--sc-color-blue-200));
  }

  .slider-handle::after {
    content: attr(value);
    display: block;
    position: absolute;
    top: -24px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0.625rem;
    padding: 0.25rem;
    min-width: 1.25rem;
    background-color: var(--sc-slider-tooltip-background-color, var(--sc-color-blue-500));
    font-size: 0.75rem;
    color: var(--sc-slider-tooltip-color, var(--sc-color-white));
    text-align: center;
  }
  .container.string .slider-handle::after {
    display: none;
  }
  .container.no-badge .slider-handle::after {
    display: none;
  }



  .stops {
    display: block;
    position: relative;
  }
  .stops.hidden {
    display: none;
  }
  .stops.step-stops > [value="0"]:first-child {
    text-align: center;
  }

  .input {
    width: 3.25em;
  }
  sc-number-input::part(more-icons) {
    display: none;
  }

  .sc-form-group-readonly .sc-form-group-input {
    margin-left: 0px;
    font-size: 0.875rem;
  }
  .sc-form-group-disabled .slider {
    cursor: not-allowed;
  }
  .sc-form-group-disabled .slider-handle {
    background-color: var(--sc-slider-disabled-background-color, var(--sc-color-grey-100));
    border-color: var(--sc-slider-disabled-border-color, var(--sc-color-grey-200));
  }
  .sc-form-group-disabled .slider-track {
    background-color: none;
  }
  
  .sc-form-group-error {
    --sc-slider-track-color: var(--sc-slider-error-track-color, var(--sc-color-red-650));
    --sc-slider-tooltip-background-color: var(--sc-slider-error-tooltip-background-color, var(--sc-color-red-600));
    --sc-slider-tooltip-color: var(--sc-slider-error-tooltip-color, var(--sc-color-white));
    --sc-slider-background-color: var(--sc-slider-error-background-color, var(--sc-color-white));
    --sc-slider-border-color: var(--sc-slider-error-border-color, var(--sc-color-red-650));
    --sc-slider-hover-background-color: var(--sc-slider-error-hover-background-color, var(--sc-color-red-50));
    --sc-slider-hover-border-color: var(--sc-slider-error-hover-border-color, var(--sc-color-red-600));
    --sc-slider-pressed-background-color: var(--sc-slider-error-pressed-background-color, var(--sc-color-grey-100));
    --sc-slider-pressed-border-color: var(--sc-slider-error-pressed-border-color, var(--sc-color-red-650));
  }

`;
