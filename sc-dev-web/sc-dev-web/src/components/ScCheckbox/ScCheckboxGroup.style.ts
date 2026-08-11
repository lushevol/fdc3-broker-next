import { css } from 'lit';

export default css`
  :host {
    --sc-input-icon-top: 0.8125rem;
  }
  
  .sc-checkbox-group.disabled {
    cursor: not-allow;
  }

  .sc-checkbox-group.has-message .sc-form-group-main-context {
    margin-bottom: 3px;
  }

  .sc-checkbox-group.has-child ::slotted(sc-checkbox:not([role='parent'])) {
    display: block;
    margin-left: 1.5rem;
  }

  .sc-checkbox-group.has-child {
    position: relative;
  }

  .sc-checkbox-group.has-child::before {
    content: "";
    position: absolute;
    top: 2.188rem;
    bottom: 0px;
    left: 0.375rem;
    width: 1px;
    background-color: var(--sc-checkbox-group-parent-line-color, var(--sc-color-blue-400));
  }
  
  .horizontal slot {
    display: flex;
    flex-wrap: wrap;
  }

  .sc-checkbox-group:not(.horizontal) ::slotted(sc-checkbox:not(:last-child)) {
    display: block;
    margin-bottom: 0.5rem;
    height: 1.375rem,;
  }
  .sc-checkbox-group.horizontal ::slotted(sc-checkbox:not(:last-child)) {
    height: 1.375rem,;
  }
  .box.sc-form-group-readonly .sc-form-control{
    line-height:1rem;
    padding:0;
  }
`;