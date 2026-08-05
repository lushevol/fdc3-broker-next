import { html } from 'lit';

export const preventDefault = (event: any) => {
  event.preventDefault(); 
  event.stopPropagation();
};

export const MoreActions = (actions: any[], isLinkStyle = false) => {
  if (!actions || actions.length <= 0) return;
  const data = actions.map((item, index) => {
    return {
      label: item,
      value: index,
    };
  });
  return html`
    <sc-dropdown-input class=more-action hoist @click=${preventDefault} .data=${data} style="--sc-dropdown-min-width: var(--sc-actions-width, 6.875rem)">
      <sc-icon 
        slot=trigger 
        name=more-horizontal
        style="cursor: pointer; ${isLinkStyle ? 'color: var(--sc-color-blue-500)' : ''}"
      ></sc-icon>
    </sc-dropdown-input>`;
};