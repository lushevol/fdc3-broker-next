import { html, LitElement, nothing } from 'lit';

import ScTheme from '../../styles/ScTheme.js';
import style from './styles/ScRichTextEditor.style.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import './ScRteEditor.js';
import * as allFormatting from './formats.js';
import { property, query } from 'lit/decorators.js';
import { watch } from '../../shared/watch.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { TConfiguration } from './typeUtils.js';
import ScElement from '../../shared/sc-element.js';

const defaultToolbar = [
  'undo',
  'redo',
  'separate',
  'fontstyle',
  'separate',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'backcolor',
  'forecolor',
  'clear',
  'separate',
  'alignleft',
  'aligncenter',
  'alignright',
  'orderedlist',
  'unorderedlist',
  'outdent',
  'indent',
  'separate',
  'addlink',
  'insertimage',
  'unlink',
  'quote',
  'table',
] as (keyof typeof allFormatting)[];

export class ScRichTextEditor extends ScopedElementsMixin(ScElement) {
  static styles = ScTheme.getStyles().concat([style]);

  @query('sc-rte-editor') scRteEditor: any;
  @property({ type: Array }) toolbar: Partial<keyof typeof allFormatting>[] =
    defaultToolbar;
  @property({ type: String }) value: string;
  @property({ type: Boolean }) shortcut = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean, attribute: 'show-count' }) showCount = false;
  @property({ type: Number, attribute: 'max-length' }) maxLength = Infinity;
  @property({ type: Object, attribute: 'configuration' })
  @property({ type: Boolean, attribute: 'pre-tag' }) preTag = false;

    configuration: TConfiguration = {
      toolbar: {
        maxImageSize: 1024,
      },
    };

  publishAnalyticsEvent() {
    try {
      // send the analytics request
      this._analytics?.publishEvent('sc-webkit-comp-load',{ name: 'sc-rich-text-editor-v1' });
    } catch (error) {
      
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.publishAnalyticsEvent();
  }

  getSemanticHtml() {
    return this.scRteEditor.getSemanticHtml();
  }

  updateContentViaValue() {
    if (ifDefined(this.value) !== nothing) {
      this.scRteEditor.setContent(this.value);
    }
  }

  @watch('value')
  async onValueChange() {
    await this.updateComplete;
    this.updateContentViaValue();
  }

  render() {
    return html`
      <sc-rte-editor
        ?shortcut=${this.shortcut}
        .toolbar=${this.toolbar}
        ?showCount=${this.showCount}
        ?readonly=${this.readonly}
        .maxLength=${this.maxLength}
        .configuration=${this.configuration}
        .preTag=${this.preTag}
      >
      </sc-rte-editor>
    `;
  }
}
