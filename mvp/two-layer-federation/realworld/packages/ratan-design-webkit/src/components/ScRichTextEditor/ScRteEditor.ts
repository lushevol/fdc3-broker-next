/* eslint-disable indent */
import { css, LitElement } from 'lit';
import { html, unsafeStatic } from 'lit/static-html.js';
import { property, state, query } from 'lit/decorators.js';
import './ScRteToolbar.js';
import './ScRteViewer.js';
import * as allFormatting from './formats.js';
import { Context, TDom, TOptions } from './Context.js';
import { makeReactiveObj } from './core/utils.js';
import env from './core/env.js';
import { watch } from '../../shared/watch.js';
import { INTERNAL_EVENTS } from '../../shared/sc-custom-events.js';
import { TConfiguration } from './typeUtils.js';

export class RTEEditor extends LitElement {
  static styles = css``;

  context: Context;
  @query('sc-rte-viewer') scRteViewer: any;
  @query('sc-rte-toolbar') scRteToolbar: any;
  @state() range: Range | null = null;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Array }) toolbar: Partial<keyof typeof allFormatting>[];
  @property({ type: Boolean }) showCount = false;
  @property({ type: Number }) maxLength = Infinity;
  @property({ type: Boolean }) shortcut = false;
  @property({ type: Object, attribute: 'configuration' })
  @property({ type: Boolean, attribute: 'pre-tag' }) preTag = false;

  configuration: TConfiguration = {
    toolbar: {
      maxImageSize: 1024,
    },
  };

  connectedCallback() {
    super.connectedCallback();
    const doms = makeReactiveObj(
      {
        viewer: 'scRteViewer',
        toolbar: 'scRteToolbar',
      },
      v => this[v as 'scRteViewer' | 'scRteToolbar']
    ) as TDom;
    const opt = {
      toolbarConf: this.toolbar,
      shortcut: this.shortcut,
    } as TOptions;
    this.context = new Context(opt, doms);
  }
  async firstUpdated() {
    await this.updateComplete;
    this.context.invokeHook('attachEvents');
  }

  @watch('toolbar', { waitUntilFirstUpdate: true })
  onToolbarChange() {
    this.context.updateOption('toolbarConf', () => this.toolbar);
  }
  @watch('shortcut', { waitUntilFirstUpdate: true })
  onshortcutChange() {
    this.context.updateOption('shortcut', () => this.shortcut);
  }

  @state() focusedElOfViewer: HTMLElement;
  onViewerFocused(e: CustomEvent<{ target: HTMLElement }>) {
    this.focusedElOfViewer = e.detail.target;
  }

  render() {
    const { readonly, range, toolbar } = this;
    const contextTriggerEvent = unsafeStatic(
      INTERNAL_EVENTS['sc-context-trigger']
    );
    const rangeEvent = unsafeStatic(INTERNAL_EVENTS['sc-range']);
    return html`<main>
      ${env.isSupportExec && !readonly && toolbar && toolbar.length
        ? html`<sc-rte-toolbar
              .range=${range}
              .toolbar=${toolbar}
              .focusedElOfViewer=${this.focusedElOfViewer}
              @${contextTriggerEvent}=${(
                event: CustomEvent<{ namespace: string; args: Array<any> }>
              ) => {
                this.context.invoke(
                  event.detail.namespace,
                  ...event.detail.args
                );
              }}
              .configuration=${this.configuration}
            ></sc-rte-toolbar>
            <div style="height: 20px;"></div>`
        : null}

      <sc-rte-viewer
        .showCount=${this.showCount}
        .maxLength=${this.maxLength}
        .preTag=${this.preTag}
        ?readonly=${readonly}
        @${rangeEvent}=${(e: Event) => {
          const event = e as CustomEvent;
          this.range = event.detail;
        }}
        @${contextTriggerEvent}=${(
          event: CustomEvent<{ namespace: string; args: Array<any> }>
        ) => {
          this.context.invoke(event.detail.namespace, ...event.detail.args);
        }}
        @sc-focus=${this.onViewerFocused}
      >
      </sc-rte-viewer>
    </main>`;
  }

  getSemanticHtml() {
    return this.scRteViewer.getSemanticHtml();
  }
  async setContent(str: string) {
    await this.updateComplete;
    this.scRteViewer.setContent(str);
  }
  isExceedCharacter() {
    return this.scRteViewer.isExceedCharacter();
  }
}

if (!customElements.get('sc-rte-editor')) customElements.define('sc-rte-editor', RTEEditor);
