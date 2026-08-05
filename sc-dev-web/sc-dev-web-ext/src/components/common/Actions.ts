import { html } from 'lit';
import { preventDefault } from '../../shared/event.js';

export const renderMoreActions = (actions: any[], disabled?: boolean,options?:any) => {
  if (!actions || actions.length <= 0) return;
  const { dropdownInputStyle = '', dropdownSlotTemplate } = options || {};
  const data = actions.map((item, index) => {
    return {
      label: item,
      value: index,
    };
  });
  return html`<sc-dropdown-input
    style="
      --sc-dropdown-min-width: var(--sc-actions-width, 200px);
      cursor: pointer;
      ${dropdownInputStyle}
    "
    @click=${preventDefault}
    @mousedown=${preventDefault}
    class="actions"
    hoist
    ?disabled=${disabled}
    .data=${data}
  >
  ${
  dropdownSlotTemplate ? 
    dropdownSlotTemplate : 
    html`<sc-icon
      slot="trigger"
      name="more-horizontal"
    ></sc-icon>`
}
  </sc-dropdown-input>`;
};
