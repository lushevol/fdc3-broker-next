import { ScRichTextEditorV2 } from '../src/components/ScRichTextEditor/ScRichTextEditorV2.js';
import { ScRteActionTable } from '../src/components/ScRichTextEditor/ScRteActionTable.js';
import { ScRteActionV2 } from '../src/components/ScRichTextEditor/ScRteActionV2.js';
import { ScRteAskAIModal } from '../src/components/ScRichTextEditor/ScRteAskAIModal.js';
import { ScRteAskInputBar } from '../src/components/ScRichTextEditor/ScRteAskInputBar.js';
import { ScRteRevisionHistory } from '../src/components/ScRichTextEditor/ScRteRevisionHistory.js';
import { ScRteRevisionItem } from '../src/components/ScRichTextEditor/ScRteRevisionItem.js';
import { ScRteToolbarV2 } from '../src/components/ScRichTextEditor/ScRteToolbarV2.js';
import { ScRteFullscreenModal } from '../src/components/ScRichTextEditor/ScRteFullscreenModal.js';

export * from '../src/components/ScRichTextEditor/ScRichTextEditorV2.js';

if (!window.customElements.get('sc-rich-text-editor-v2')) {
  window.customElements.define('sc-rich-text-editor-v2', ScRichTextEditorV2);
}
if (!window.customElements.get('sc-rte-action-table-v2')) {
  window.customElements.define('sc-rte-action-table-v2', ScRteActionTable);
}
if (!window.customElements.get('sc-rte-action-v2')) {
  window.customElements.define('sc-rte-action-v2', ScRteActionV2);
}
if (!window.customElements.get('sc-rte-ask-ai-modal')) {
  window.customElements.define('sc-rte-ask-ai-modal', ScRteAskAIModal);
}
if (!window.customElements.get('sc-rte-ask-input-bar')) {
  window.customElements.define('sc-rte-ask-input-bar', ScRteAskInputBar);
}
if (!window.customElements.get('sc-rte-revision-history')) {
  window.customElements.define('sc-rte-revision-history', ScRteRevisionHistory);
}
if (!window.customElements.get('sc-rte-revision-item')) {
  window.customElements.define('sc-rte-revision-item', ScRteRevisionItem);
}
if (!window.customElements.get('sc-rte-toolbar-v2')) {
  window.customElements.define('sc-rte-toolbar-v2', ScRteToolbarV2);
}
if (!window.customElements.get('sc-rte-fullscreen-modal')) {
  window.customElements.define('sc-rte-fullscreen-modal', ScRteFullscreenModal);
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-rich-text-editor-v2': ScRichTextEditorV2
  }
}