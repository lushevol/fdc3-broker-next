import { html } from 'lit';
import './ScRteAction.js';
import { TViewContext } from './typeUtils.js';
import { fontSize, fontBackColor, fontTextColor } from './constant.js';
import { handleImageUpload } from './image.js';
import { msg } from '@lit/localize';

export const undo = () => html`<sc-rte-action
  icon="old-editor-undo--fill"
  .hintText="${msg('Undo', { id: 'sc-editor-toolbar-undo' })}"
  command="undo"
></sc-rte-action>`;
export const redo = () => html`<sc-rte-action
  icon="old-editor-redo--fill"
  .hintText="${msg('Redo', { id: 'sc-editor-toolbar-redo' })}"
  command="redo"
></sc-rte-action>`;
export const fontstyle = (viewContext: TViewContext) => {
  return html`<sc-rte-action
    icon="title"
    command="formatBlock"
    .values=${fontSize}
    .activeTags=${viewContext['active-tags']}
    type="font"
  ></sc-rte-action>`;
};
export const bold = (viewContext: TViewContext) => html`<sc-rte-action
  icon="old-editor-bold"
  .hintText="${msg('Bold', { id: 'sc-editor-toolbar-bold' })}"
  command="bold"
  ?active=${viewContext['font-bold'] === 'bold'}
></sc-rte-action>`;
export const italic = (viewContext: TViewContext) => html`<sc-rte-action
  icon="old-editor-italic"
  .hintText="${msg('Italic', { id: 'sc-editor-toolbar-italic' })}"
  command="italic"
  ?active=${viewContext['font-italic'] === 'italic'}
></sc-rte-action>`;
export const underline = (viewContext: TViewContext) => html`<sc-rte-action
  icon="old-editor-underline"
  .hintText="${msg('Underline', { id: 'sc-editor-toolbar-underline' })}"
  command="underline"
  ?active=${viewContext['font-underline'] === 'underline'}
></sc-rte-action>`;
export const strikethrough = (viewContext: TViewContext) => html`<sc-rte-action
  icon="old-editor-strikethrough"
  .hintText="${msg('Strikethrough', { id: 'sc-editor-toolbar-strikethrough' })}"
  command="strikeThrough"
  ?active=${viewContext['font-strikethrough'] === 'strikethrough'}
></sc-rte-action>`;
export const subscript = (viewContext: TViewContext) => html`<sc-rte-action
  icon="old-editor-subscript"
  .hintText="${msg('Subscript', { id: 'sc-editor-toolbar-subscript' })}"
  command="subscript"
  ?active=${viewContext['font-subscript'] === 'subscript'}
></sc-rte-action>`;
export const superscript = (viewContext: TViewContext) => html`<sc-rte-action
  icon="old-editor-superscript"
  .hintText="${msg('Superscript', { id: 'sc-editor-toolbar-superscript' })}"
  command="superscript"
  ?active=${viewContext['font-superscript'] === 'superscript'}
></sc-rte-action>`;
export const backcolor = (viewContext: TViewContext) =>
  html`<sc-rte-action
    icon="old-editor-backcolor"
    .hintText="${msg('Back Color', { id: 'sc-editor-toolbar-backcolor' })}"
    command="backColor"
    .values=${fontBackColor}
    .activeBgColor=${viewContext['background-color']}
    type="backcolor"
  ></sc-rte-action>`;
export const forecolor = (viewContext: TViewContext) =>
  html` <sc-rte-action
    icon="old-editor-textcolor"
    .hintText="${msg('Text Color', { id: 'sc-editor-toolbar-textcolor' })}"
    command="foreColor"
    .values=${fontTextColor}
    .activeTextColor=${viewContext['color']}
    type="textcolor"
  ></sc-rte-action>`;
export const clear = () =>
  html`<sc-rte-action
    icon="old-editor-clear"
    .hintText="${msg('Clear', { id: 'sc-editor-toolbar-clear' })}"
    command="removeFormat"
  ></sc-rte-action>`;
export const alignleft = () =>
  html`<sc-rte-action
    icon="old-editor-alignleft"
    .hintText="${msg('Justify Left', { id: 'sc-editor-toolbar-alignleft' })}"
    command="justifyLeft"
  ></sc-rte-action>`;
export const aligncenter = () =>
  html`<sc-rte-action
    icon="old-editor-aligncenter"
    .hintText="${msg('Justify Center', {
    id: 'sc-editor-toolbar-aligncenter',
  })}"
    command="justifyCenter"
  ></sc-rte-action>`;
export const alignright = () =>
  html`<sc-rte-action
    icon="old-editor-alignright"
    .hintText="${msg('Justify Right', { id: 'sc-editor-toolbar-alignright' })}"
    command="justifyRight"
  ></sc-rte-action>`;

export const orderedlist = () => html`<sc-rte-action
  icon="old-editor-orderedlist"
  .hintText="${msg('Ordered List', { id: 'sc-editor-toolbar-orderedlist' })}"
  command="insertOrderedList"
></sc-rte-action>`;
export const unorderedlist = () => html`<sc-rte-action
  icon="old-editor-unorderedlist"
  .hintText="${msg('Unordered List', {
    id: 'sc-editor-toolbar-unorderedlist',
  })}"
  command="insertUnorderedList"
></sc-rte-action>`;

export const outdent = () => html`<sc-rte-action
  icon="old-editor-outdent"
  .hintText="${msg('Outdent', { id: 'sc-editor-toolbar-outdent' })}"
  command="outdent"
></sc-rte-action>`; 
export const indent = () => html`<sc-rte-action
  icon="old-editor-indent"
  .hintText="${msg('Indent', { id: 'sc-editor-toolbar-indent' })}"
  command="indent"
></sc-rte-action>`;
export const addlink = () => html`<sc-rte-action
  icon="old-editor-link"
  .hintText="${msg('Link', { id: 'sc-editor-toolbar-link' })}"
  @sc-action=${(e: CustomEvent) => {
    const moduleInvoke = e.detail.moduleInvoke;
    const newLink = prompt('Write the URL here', 'https://');
    // Check if valid url
    if (newLink && newLink.match(/^(http|https):\/\/[^ "]+$/)) {
      moduleInvoke('editor.createlink', newLink);
    }
  }}
>
</sc-rte-action>`;
export const table = (
  viewContext: TViewContext,
  focusedElOfViewer?: HTMLElement
) => {
  const isScTable = focusedElOfViewer?.tagName.toLowerCase() === 'sc-table';
  return html`<sc-rte-action
    .hintText="${msg('Insert Table', { id: 'sc-editor-toolbar-insert-table' })}"
    type="table"
    icon="insert-table"
    command="insertHTML"
    ?disable=${isScTable}
  >
  </sc-rte-action>`;
};
export const unlink = () => html`<sc-rte-action
  icon="old-editor-unlink"
  .hintText="${msg('Unlink', { id: 'sc-editor-toolbar-unlink' })}"
  command="unlink"
>
</sc-rte-action>`;
export const quote = () => html`<sc-rte-action
  icon="old-editor-quote"
  .hintText="${msg('Block Quote', { id: 'sc-editor-toolbar-quote' })}"
  command="formatBlock"
  value="blockquote"
></sc-rte-action>`;
export const separate = () => html`<sc-rte-action
  type="separate"
></sc-rte-action>`;

/**
 * The insert image action will open a file dialog to select an image and insert it into the editor.
 */
export const insertimage = (viewContext: TViewContext) => {
  return html`<sc-rte-action
    icon="image-fill"
    .hintText="${msg('Insert Image', { id: 'sc-editor-toolbar-insert-image' })}"
    @sc-action=${() =>
    handleImageUpload(viewContext['max-image-size'] as number)}
  ></sc-rte-action>`;
};
