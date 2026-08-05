import { css, html } from 'lit';
import { query, queryAll } from 'lit/decorators.js';
import ScElement from '../utils/ScElement.js';
import { ScFileToolIcon } from './ScFileToolIcon.js';

export class BaseToolbar extends ScElement {
  static styles = [
    css`
      .toolbar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(2rem, max-content));
        justify-content: space-between;
        align-content: center;
        align-items: center;
        gap: 1px;
        padding: 0.5rem;
        height: 2rem;
        background-color: var(--sc-color-gray-50, #f2f2f2);
        z-index: 3;

        .set {
          height: 2rem;
          display: flex;
          align-items: center;
          gap: 1px;
        }

        .divider-after {
          position: relative;
          margin-right: 0.5rem;

          &::after {
            display: block;
            content: ' ';
            background-color: var(--sc-color-grey-200, #ccc);
            width: 1px;
            height: 1rem;
            position: absolute;
            top: 0.5rem;
            right: -0.25rem;
          }
        }

        .placeholder {
          width: 0;
          height: 0;
        }

        .more-tool {
          --sl-z-index-dropdown: 900;
          position: absolute;
          right: 0;
          visibility: hidden;
          pointer-events: none;
        }

        &.truncated {
          justify-content: start;
          padding-right: 2rem;

          .more-tool {
            visibility: visible;
            pointer-events: auto;
          }
        }
        &.more-toolbar {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: end;
          border: 1px solid var(--sc-color-grey-150, #d9d9d9);
          box-shadow: rgba(82, 83, 85, 0.1) 0px 2px 4px 0px;
          width: fit-content;
          max-width: 920%;
          min-height: 2rem;
          height: auto;
          row-gap: 0.5rem;
          margin: 0 0.5rem;

          .placeholder {
            display: none;
          }
        }
      }
    `,
  ];

  @queryAll('.main-toolbar > .tool:not(.lock), .main-toolbar > :not(.more-toolbar) > .tool:not(.lock)')
  tools: HTMLElement[];
  @query('.main-toolbar') toolbar: HTMLDivElement;
  @query('.more-tool') moreTool: HTMLElement;
  @query('.more-toolbar') moreToolbar: HTMLDivElement;

  _placeholderTools = new WeakMap<HTMLElement, HTMLElement>();
  _lastWidth = Number.MAX_SAFE_INTEGER;

  _resizeObserver = new ResizeObserver(this.handleResize.bind(this));

  protected handleResize() {
    // all fits, restore only or do nothing
    if (this.toolbar.clientWidth === this._lastWidth) return;
    if (
      this.toolbar.clientWidth === this.toolbar.scrollWidth &&
      !this.toolbar.classList.contains('truncated')
    )
      return;

    this.toolbar.classList.add('truncated');
    // force re-layout
    this.toolbar.offsetWidth;

    const { clientWidth, classList } = this.toolbar;
    const offset = this.moreTool.offsetWidth || 0;
    const list: HTMLElement[] = [];

    if (clientWidth < this._lastWidth) {
      for (const el of [...this.tools].reverse()) {
        if (el.classList.contains('placeholder')) continue;

        const w =
          1 +
          el.offsetWidth +
          parseInt(getComputedStyle(el).marginRight || '0');
        // is overflowing, must hide
        if (el.offsetLeft + w > clientWidth - offset) {
          list.push(el);
        } else {
          break;
        }
      }
      list.forEach(el => {
        const div = document.createElement('div');
        div.className = 'placeholder tool';
        div.dataset.width = `${el.offsetWidth}`;
        el.replaceWith(div);
        this.moreToolbar.prepend(el);
        this._placeholderTools.set(div, el);
      });
    } else {
      let move = 0;
      for (const el of [...this.tools]) {
        if (!el.classList.contains('placeholder')) continue;
        const w =
          1 +
          parseInt(el.dataset.width ?? '') +
          parseInt(getComputedStyle(el).marginRight || '0');
        if (el.offsetLeft + move + w <= clientWidth - offset) {
          list.push(el);
          move += w;
        } else {
          break;
        }
      }
      list.forEach(el => {
        const tool = this._placeholderTools.get(el);
        if (tool) {
          el.replaceWith(tool);
          this._placeholderTools.delete(el);
        }
      });
    }
    this._lastWidth = clientWidth;
    classList.toggle('truncated', this.moreToolbar.hasChildNodes());
  }

  protected renderMoreTool() {
    return html`
      <sl-dropdown
        class="more-tool lock"
        placement="bottom-end"
        distance="6"
        hoist
        @sl-show=${(e: Event) => {
          if (e.target instanceof HTMLElement) {
            const el =
              e.target.querySelector<ScFileToolIcon>('sc-file-tool-icon');
            if (el) el.label = '';
          }
        }}
        @sl-hide=${(e: Event) => {
          if (e.target instanceof HTMLElement) {
            const el =
              e.target.querySelector<ScFileToolIcon>('sc-file-tool-icon');
            if (el) el.label = 'More';
          }
        }}
      >
        <sc-file-tool-icon
          slot="trigger"
          icon="more-horizontal"
          label="More"
          @click=${() => this.emit('sc-file-tool-more')}
        >
        </sc-file-tool-icon>
        <div class="toolbar more-toolbar"></div>
      </sl-dropdown>
    `;
  }

  protected firstUpdated(): void {
    requestAnimationFrame(() => this._resizeObserver.observe(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver.disconnect();
  }

  render() {
    return html`<slot></slot>`;
  }
}
