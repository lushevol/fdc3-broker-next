import { html } from 'lit';
import { Editor } from 'hugerte';


export type CustomToolbarButton = {
  icon: string,
  hintText: string,
  handler: (editorInstance: Editor | null) => void;
}

export const customToolbarButton = (props: CustomToolbarButton) => {
  return html`<sc-rte-action-v2
    .icon=${props.icon}
    .hintText=${props.hintText}
    @click=${props.handler}
    command="custom"
  ></sc-rte-action-v2>`;
};