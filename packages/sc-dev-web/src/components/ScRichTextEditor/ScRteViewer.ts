/* eslint-disable indent */
import { html, css, nothing } from "lit";
import { html as sHtml, unsafeStatic } from "lit/static-html.js";
import { property, query, state } from "lit/decorators.js";
import { customElement } from "../../shared/custom-element.js";
import { editorCommand } from "./core/utils.js";
import { classMap } from "lit/directives/class-map.js";
import "../../../elements/sc-table.js";
import "../../../elements/sc-icon.js";
import { PopupMixin } from "../../mixins/popup-mixin.js";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";
import { ToolMixin } from "../../mixins/tool-mixin.js";
import type { ScTooltip } from "../ScTooltip/ScTooltip.js";
import { E_OPERATORS } from "./constant.js";
import ScElement from "../../shared/sc-element.js";
import { RangeMixin } from "../../mixins/range-mixin.js";
import { ObserverMxin } from "../../mixins/observer-mixin.js";
import { watch } from "../../shared/watch.js";
import { RteViewMixin } from "./mixins/rte-view-mixin.js";
import { INTERNAL_EVENTS } from "../../shared/sc-custom-events.js";
import { sanitizeHTML, trustHTML } from "../../shared/trusted-types-policy.js";

@customElement("sc-rte-viewer")
export class RTEViewer extends ObserverMxin(
  RteViewMixin(ToolMixin(PopupMixin(RangeMixin(ScElement)))),
) {
  static styles = css`
    :host {
      --sc-text-box-min-height: 100px;
      --sc-text-box-overflow: auto;
      --sc-icon-color: var(--sc-rich-text-editor-icon-color);
    }
    .article {
      padding: 10px 20px;
      border-radius: 12px;
      height: var(--sc-text-box-height);
      min-height: var(--sc-text-box-min-height);
      overflow: var(--sc-text-box-overflow);
    }
    .article {
      background: var(--sc-rte-bg-color);
    }
    .article[contenteditable="true"] {
      border: 1px solid var(--sc-rte-border-color);
      outline: none;
    }
    :host .count {
      color: var(--sc-rte-count-color);
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      text-align: right;
    }
    :host .exceed {
      color: var(--sc-rich-text-editor-count-error-color);
    }
    pre {
      font-family: var(--sc-font-family);
    }
    .article h1,
    .article h2,
    .article h3,
    .article h4,
    .article h5 {
      font-weight: 600;
    }
    .article h1 {
      font-size: 2.5rem;
      line-height: 3.5rem;
    }
    .article h2 {
      font-size: 2rem;
      line-height: 3rem;
    }
    .article h3 {
      font-size: 1.75rem;
      line-height: 2.75rem;
    }
    .article h4 {
      font-size: 1.38rem;
      line-height: 2.38rem;
    }
    .article h5 {
      font-size: 1.13rem;
      line-height: 2.13rem;
    }

    .article h6,
    .article div,
    .article p,
    .article aside,
    .article section {
      font-weight: 400;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    }
    .article h6 {
      font-size: 1.13rem;
      line-height: 1.63rem;
    }
    .article div {
      font-size: 1rem;
      line-height: 1.5rem;
    }
    .article p {
      font-size: 0.88rem;
      line-height: 1.38rem;
    }
    .article aside {
      font-size: 0.75rem;
      line-height: 1.25rem;
    }
    .article section {
      font-size: 0.63rem;
      line-height: 1.13rem;
    }
    .article[contenteditable="true"]:focus {
      outline: 2px solid var(--sc-rte-focus-border-color);
    }
    .article[contenteditable="true"]:focus-visible {
      outline: 2px solid var(--sc-rte-focus-border-color);
    }
    .article[contenteditable="true"] blockquote:not(blockquote[style]) {
      padding-left: 20px;
      position: relative;
    }
    .article[contenteditable="true"] blockquote:not(blockquote[style]):before {
      content: "";
      position: absolute;
      width: 5px;
      height: 100%;
      left: 0px;
      top: 0px;
      background-color: #ccc;
    }
    .table-operator {
      box-shadow: 3px 3px 8px gray;
      border-radius: 5px;
      padding: 6px 6px 0 6px;
      background-color: var(--sc-rte-bg-color);
      display: flex;
    }
    .operator-wrap {
      margin: 0 5px;
    }
    .operator-wrap sc-icon {
      cursor: pointer;
      color: var(--sc-icon-color);
    }
    .panel-item {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
    .panel-item sc-icon {
      margin-right: 4px;
    }
  `;

  @query("#content") content!: HTMLDivElement;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) showCount = false;
  @property({ type: Number }) maxLength = Infinity;
  @property({ type: Boolean, attribute: "pre-tag" }) preTag = false;
  /**
   * content length
   */
  @state() count = 0;

  constructor() {
    super();
    this.updateSelection = this.updateSelection.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickDoc = this.onClickDoc.bind(this);
  }

  @state() focusedElement: any;
  activeCell: HTMLTableCellElement;
  /**
   * make contenteditable focus
   */
  focus() {
    setTimeout(() => {
      if (this.focusedElement) {
        this.focusedElement.focus();
      } else {
        this.content.focus();
      }
    }, 0);
  }
  @watch("focusedElement")
  onFocusedElChange() {
    this.emit("sc-focus", {
      detail: {
        target: this.focusedElement,
      },
    });
  }

  onTextboxFocus(e: Event) {
    this.focusedElement = e.target;
  }
  onTableFocus(e: CustomEvent) {
    // use focus method of custom element
    this.focusedElement = e.target;
  }
  onTableBlur() {}
  onClickDoc() {
    this.hidePopup();
  }
  onClickOperator(e: Event) {
    e.stopPropagation();
  }

  onTableClick(
    e: CustomEvent<{
      clientX: number;
      clientY: number;
      cell: HTMLTableCellElement;
    }>,
  ) {
    this.activeCell = e.detail.cell;
    if (this.activeCell.tagName.toLowerCase() === "th") {
      this.hidePopup();
      return;
    }
    this.showPopup();
    this.animationFrame.run(() =>
      this.setVirtualAnchor({
        getBoundingClientRect: () => {
          return new DOMRect(e.detail.clientX, e.detail.clientY, 100, 100);
        },
      }),
    );
  }
  showPopup() {
    this.hideTooltips();
    super.showPopup();
  }

  renderCount() {
    const { readonly, showCount, maxLength } = this;
    return html` ${!readonly
      ? html`<div
          class=${classMap({
            count: true,
            exceed: this.count > maxLength,
          })}
        >
          ${showCount ? this.count : nothing}
          ${showCount && maxLength !== Infinity
            ? html`/&nbsp;${maxLength}`
            : nothing}
        </div>`
      : nothing}`;
  }
  renderSubOperators(
    data: { icon: string; desc: string; action: () => void }[],
  ) {
    return html` <div class="panel">
      ${map(data, v => {
        return html` <div class="panel-item" @click=${v.action}>
          <sc-icon size="md" name=${v.icon}> </sc-icon>
          <div>${v.desc}</div>
        </div>`;
      })}
    </div>`;
  }
  hideTooltips() {
    Array.from(this.renderRoot.querySelectorAll("sc-tooltip")).forEach(
      tooltip => {
        tooltip.hide();
      },
    );
  }
  onTooltipClick(e: Event) {
    const target = this.seekParentElement<ScTooltip>(
      e.target as Element,
      "sc-tooltip",
    );
    this.hideTooltips();
    target && target.show();
  }
  operatorAction(command: E_OPERATORS) {
    if (command === E_OPERATORS["toggle-header"]) {
      this.toggleHeader();
    } else if (
      [E_OPERATORS["delete-column"], E_OPERATORS["delete-row"]].includes(
        command,
      )
    ) {
      this.deleteTable(command);
    } else if (
      [
        E_OPERATORS["insert-column-left"],
        E_OPERATORS["insert-column-right"],
        E_OPERATORS["insert-row-above"],
        E_OPERATORS["insert-row-below"],
      ].includes(command)
    ) {
      this.insertToTable(command);
    } else {
      this.changeCellSize(command);
    }
    this.hidePopup();
  }
  changeCellSize(command: E_OPERATORS) {
    this.invoke("viewer.changeCellSize", command);
  }
  toggleHeader() {
    this.focusedElement.hideHeader = !this.focusedElement.hideHeader;
  }
  insertToTable(command: E_OPERATORS) {
    this.invoke("viewer.insertToTable", command);
  }
  deleteTable(command: E_OPERATORS) {
    this.invoke("viewer.deleteTable", command);
  }

  invoke(namespace: string, ...args: any) {
    this.emit(INTERNAL_EVENTS["sc-context-trigger"] as any, {
      bubbles: true,
      composed: true,
      detail: {
        namespace,
        args,
      },
    });
  }
  renderOperators() {
    const data = this.tableOperatorsOpts;
    return html`${map(data, v => {
      return html`<div class="operator-wrap">
        ${when(
          v.action,
          () => {
            return html`<sc-icon
              size="md"
              name=${v.icon}
              @click=${() => {
                this.hideTooltips();
                v.action && v.action();
              }}
            >
            </sc-icon>`;
          },
          () => {
            return html`<sc-tooltip
              .contentMaxWidth=${"unset"}
              placement="bottom"
              mode="light"
              distance="10"
              skidding="0"
              trigger="manual"
              @click=${this.onTooltipClick}
            >
              <sc-icon size="md" name=${v.icon}> </sc-icon>
              <div slot="content">
                ${
                  this.renderSubOperators(v.operators!) // eslint-disable-line
                }
              </div>
            </sc-tooltip>`;
          },
        )}
      </div>`;
    })}
      </div>`;
  }
  renderTableOperators() {
    return html`<sl-popup placement="top" distance="10" flip>
      <div class="table-operator" @click=${this.onClickOperator}>
        ${this.renderOperators()}
      </div>
    </sl-popup>`;
  }

  render() {
    const { readonly, preTag } = this;

    if (preTag) {
      return sHtml`<pre
        part="sc-rich-text-editor-area"
        class=article
        id="content"
        contenteditable=${readonly ? "false" : "true"}
        @input=${() => {
          this.updateSelection();
          this.onChange();
        }}
        @focus=${this.onTextboxFocus}
        @${unsafeStatic(INTERNAL_EVENTS["sc-table-focus"])}=${this.onTableFocus}
        @${unsafeStatic(INTERNAL_EVENTS["sc-table-blur"])}=${this.onTableBlur}
        @${unsafeStatic(INTERNAL_EVENTS["sc-table-click"])}=${this.onTableClick}
      ><p><br /></p></pre>
      ${this.renderCount()} ${this.renderTableOperators()}`;
    }

    return sHtml`<article
        part="sc-rich-text-editor-area"
        class=article
        id="content"
        contenteditable=${readonly ? "false" : "true"}
        @input=${() => {
          this.updateSelection();
          this.onChange();
        }}
        @focus=${this.onTextboxFocus}
        @${unsafeStatic(INTERNAL_EVENTS["sc-table-focus"])}=${this.onTableFocus}
        @${unsafeStatic(INTERNAL_EVENTS["sc-table-blur"])}=${this.onTableBlur}
        @${unsafeStatic(INTERNAL_EVENTS["sc-table-click"])}=${this.onTableClick}
      ><p><br /></p></article>
      ${this.renderCount()} ${this.renderTableOperators()} `;
  }

  getSemanticHtml() {
    return this.content.innerHTML.replace(/^\<\!--\?lit[^-]+--\>/, "");
  }
  async setContent(str: string) {
    await this.updateComplete;

    this.content.innerHTML = sanitizeHTML(str || this.placeholder);
    this.updateCount();
  }
  isExceedCharacter() {
    return this.count > this.maxLength;
  }

  updateSelection() {
    this.dispatchEvent(
      new CustomEvent(INTERNAL_EVENTS["sc-range"], {
        detail: this.range,
        bubbles: true,
        composed: true,
      }),
    );
  }

  get extraLength() {
    let len = 0;
    const blockquote = this.content.querySelectorAll("blockquote");
    const scTable = this.content.querySelectorAll("sc-table");
    if (blockquote.length) {
      len += 1;
    }
    if (scTable.length) {
      len += 1;
    }
    return len;
  }
  /**
   * set latest content length
   */
  updateCount() {
    const textLen = this.content?.textContent?.length ?? 0;
    this.count = textLen + this.extraLength;
  }

  resetEditor() {
    if (this.content.innerHTML.trim() === "") {
      this.content.innerHTML = trustHTML("<p><br /></p>");
    }
  }

  onChange() {
    this.resetEditor();
    this.updateCount();

    this.dispatchEvent(
      new CustomEvent("sc-change", {
        detail: {
          text: this.getSemanticHtml(),
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  connectedCallback(): void {
    super.connectedCallback();
    editorCommand("defaultParagraphSeparator", "p");
    document.addEventListener("selectionchange", this.updateSelection);
    window.addEventListener("selectionchange", this.updateSelection);
    document.addEventListener("keydown", this.updateSelection);
    document.addEventListener("click", this.onClickDoc);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("selectionchange", this.updateSelection);
    window.removeEventListener("selectionchange", this.updateSelection);
    document.removeEventListener("keydown", this.updateSelection);
    document.removeEventListener("click", this.onClickDoc);
  }
}
