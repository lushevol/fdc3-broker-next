import { html } from 'lit';
import './ScRteActionV2.js';
import { TViewContext } from './typeUtils.js';
import { fontSize, fontBackColor, fontTextColor, aiShortcuts } from './constant.js';
import { msg } from '@lit/localize';

export const undo = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-undo"
  .hintText="${msg('Undo', { id: 'sc-editor-toolbar-undo' })}"
  command="undo"
  ?disable=${!viewContext['has-undo']}
></sc-rte-action-v2>`;
export const redo = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-redo"
  .hintText="${msg('Redo', { id: 'sc-editor-toolbar-redo' })}"
  command="redo"
  ?disable=${!viewContext['has-redo']}
></sc-rte-action-v2>`;
export const fontstyle = (viewContext: TViewContext) => {
  return html`<sc-rte-action-v2
    icon="title"
    command="formatBlock"
    .values=${fontSize}
    .activeTags=${viewContext['active-tags']}
    type="font"
  ></sc-rte-action-v2>`;
};
export const bold = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-bold"
  .hintText="${msg('Bold', { id: 'sc-editor-toolbar-bold' })}"
  command="bold"
  ?active=${viewContext['font-bold'] === 'bold'}
></sc-rte-action-v2>`;
export const italic = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-italic"
  .hintText="${msg('Italic', { id: 'sc-editor-toolbar-italic' })}"
  command="italic"
  ?active=${viewContext['font-italic'] === 'italic'}
></sc-rte-action-v2>`;
export const underline = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-underline"
  .hintText="${msg('Underline', { id: 'sc-editor-toolbar-underline' })}"
  command="underline"
  ?active=${viewContext['font-underline'] === 'underline'}
></sc-rte-action-v2>`;
export const strikethrough = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-strikethrough"
  .hintText="${msg('Strikethrough', { id: 'sc-editor-toolbar-strikethrough' })}"
  command="strikeThrough"
  ?active=${viewContext['font-strikethrough'] === 'strikethrough'}
></sc-rte-action-v2>`;
export const subscript = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-subscript"
  .hintText="${msg('Subscript', { id: 'sc-editor-toolbar-subscript' })}"
  command="subscript"
  ?active=${viewContext['font-subscript'] === 'subscript'}
></sc-rte-action-v2>`;
export const superscript = (viewContext: TViewContext) => html`<sc-rte-action-v2
  icon="editor-superscript"
  .hintText="${msg('Superscript', { id: 'sc-editor-toolbar-superscript' })}"
  command="superscript"
  ?active=${viewContext['font-superscript'] === 'superscript'}
></sc-rte-action-v2>`;
export const backcolor = (viewContext: TViewContext) => {
  return html`<sc-rte-action-v2
    icon="editor-backgroundcolor"
    .hintText="${msg('Back Color', { id: 'sc-editor-toolbar-backcolor' })}"
    command="backColor"
    .values=${fontBackColor}
    .activeBgColor=${viewContext['background-color']}
    type="backcolor"
  ></sc-rte-action-v2>`;
};
export const forecolor = (viewContext: TViewContext) =>
  html` <sc-rte-action-v2
    icon="editor-fontcolor"
    .hintText="${msg('Text Color', { id: 'sc-editor-toolbar-textcolor' })}"
    command="foreColor"
    .values=${fontTextColor}
    .activeTextColor=${viewContext['color']}
    type="textcolor"
  ></sc-rte-action-v2>`;
export const clear = () =>
  html`<sc-rte-action-v2
    icon="editor-clearformat"
    .hintText="${msg('Clear', { id: 'sc-editor-toolbar-clear' })}"
    command="removeFormat"
  ></sc-rte-action-v2>`;
export const alignleft = () =>
  html`<sc-rte-action-v2
    icon="editor-alignleft"
    .hintText="${msg('Justify Left', { id: 'sc-editor-toolbar-alignleft' })}"
    command="justifyLeft"
  ></sc-rte-action-v2>`;
export const aligncenter = () =>
  html`<sc-rte-action-v2
    icon="editor-aligncenter"
    .hintText="${msg('Justify Center', {
    id: 'sc-editor-toolbar-aligncenter',
  })}"
    command="justifyCenter"
  ></sc-rte-action-v2>`;
export const alignright = () =>
  html`<sc-rte-action-v2
    icon="editor-alignright"
    .hintText="${msg('Justify Right', { id: 'sc-editor-toolbar-alignright' })}"
    command="justifyRight"
  ></sc-rte-action-v2>`;

export const orderedlist = () => html`<sc-rte-action-v2
  icon="editor-numberedlist"
  .hintText="${msg('Ordered List', { id: 'sc-editor-toolbar-orderedlist' })}"
  command="insertOrderedList"
></sc-rte-action-v2>`;
export const unorderedlist = () => html`<sc-rte-action-v2
  icon="editor-list"
  .hintText="${msg('Unordered List', {
    id: 'sc-editor-toolbar-unorderedlist',
  })}"
  command="insertUnorderedList"
></sc-rte-action-v2>`;

export const outdent = () => html`<sc-rte-action-v2
  icon="editor-outdent"
  .hintText="${msg('Outdent', { id: 'sc-editor-toolbar-outdent' })}"
  command="outdent"
></sc-rte-action-v2>`;
export const indent = () => html`<sc-rte-action-v2
  icon="editor-indent"
  .hintText="${msg('Indent', { id: 'sc-editor-toolbar-indent' })}"
  command="indent"
></sc-rte-action-v2>`;
export const addlink = () => html`<sc-rte-action-v2
  icon="editor-link"
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
</sc-rte-action-v2>`;
export const table = (
  viewContext: TViewContext,
  focusedElOfViewer?: HTMLElement
) => {
  const isScTable = focusedElOfViewer?.tagName.toLowerCase() === 'sc-table';
  return html`<sc-rte-action-v2
    .hintText="${msg('Insert Table', { id: 'sc-editor-toolbar-insert-table' })}"
    type="table"
    icon="editor-table"
    command="inserttablev2"
    ?disable=${isScTable}
  >
  </sc-rte-action-v2>`;
};
export const unlink = () => html`<sc-rte-action-v2
  icon="editor-unlink"
  .hintText="${msg('Unlink', { id: 'sc-editor-toolbar-unlink' })}"
  command="unlink"
>
</sc-rte-action-v2>`;
export const quote = () => html`<sc-rte-action-v2
  icon="editor-quote"
  .hintText="${msg('Block Quote', { id: 'sc-editor-toolbar-quote' })}"
  command="formatBlock"
  value="blockquote"
></sc-rte-action-v2>`;
export const separate = () => html`<sc-rte-action-v2
  type="separate"
></sc-rte-action-v2>`;

/**
 * The insert image action will open a file dialog to select an image and insert it into the editor.
 */
export const insertimage = () => {
  return html`<sc-rte-action-v2
    icon="editor-image"
    .hintText="${msg('Insert Image', { id: 'sc-editor-toolbar-insert-image' })}"
    command="insertimagev2"
  ></sc-rte-action-v2>`;
};

/**
 * The revision history action will open a side panel that displays the revisions
 */
export const revisionhistory = () => {
  return html`<sc-rte-action-v2
    icon="editor-revisionhistory"
    .hintText="${msg('Revision History', { id: 'sc-editor-toolbar-revision-history' })}"
    command="revisionhistory"
  ></sc-rte-action-v2>`;
};

/**
 * The ask ai action will open a ai modal popup for asking LLM modal
 */
export const askai = () => {
  return html`<sc-rte-action-v2
    icon="editor-askai"
    .hintText="${msg('AI Assistant', { id: 'sc-editor-toolbar-ask-ai' })}"
    command="askai"
  ></sc-rte-action-v2>`;
};

/**
 * The ai shortcuts action will open a dropdown list that displays the ai prompts
 */
export const aishortcuts = () => {
  return html`<sc-rte-action-v2
    icon="editor-aishortcuts"
    command="aishortcuts"
    .aiShortcutValues=${aiShortcuts}
    type="aishortcuts"
  ></sc-rte-action-v2>`;
};
export const copy = (viewContext: TViewContext) => {
  const isDisabled = viewContext['is-selection-collapsed'] !== false;
  return html`<sc-rte-action-v2
    icon="${isDisabled ? 'editor-copy--disabled' : 'editor-copy'}"
    .hintText="${isDisabled ? 'Select text to copy' : 'Copy'}"
    command="copy"
    ?disable=${isDisabled}
  ></sc-rte-action-v2>`;
};

export const paste = () => html`<sc-rte-action-v2
  icon="editor-paste"
  .hintText="${msg('Paste', { id: 'sc-editor-toolbar-paste' })}"
  command="paste"
></sc-rte-action-v2>`;
