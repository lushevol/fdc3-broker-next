import { MainIconLibrary } from '@scdevkit/icons';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import { html, nothing, render } from 'lit';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { guard } from 'lit/directives/guard.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { findAncestor } from '../utils/ancestor.js';
import { debounce } from '../utils/debounce.js';
import {
  excelTypes,
  navigationAvailableTypes,
  rotationAvailableTypes,
  scriberAvailableTypes,
  zoomAvailableTypes,
} from '../utils/filetypes.js';
import { watch } from '../utils/watch.js';
import { BaseToolbar } from './BaseToolbar.js';
import ScFileToolStyle from './ScFileTool.style.js';
import './ScFileToolIcon.js';
import { type ScPDFPage } from './ScPDFPage.js';
import { ScribbleDataSource } from './ScScriber.js';
import './ScScriberToolbar.js';

export type ToolState = {
  rotation: number
  zoomRatio: number
  currentPage: number
  isSheetOpen: boolean
  isScriberToolActive: boolean
};
type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
};
type SetOptions = {
  update?: boolean
  emit?: boolean
}

export type ToolConfig = {
  /** Delay in ms before applying the input value change. Set -1 to disable */
  inputDelay?: number
  /** Action to do on input blur */
  blurAction?: 'reset' | 'set' | 'none'
  /** If true, immediately disallow input of invalid values */
  strictLimits?: boolean
  /** Rotation affects all pages or just the current page */
  rotateScope?: 'all' | 'page'
}
export const defaultToolConfig = {
  inputDelay: 300,
  blurAction: 'set',
  strictLimits: true,
  rotateScope: 'all',
} as const;


@customElement('sc-file-tool')
export class ScFileTool extends BaseToolbar implements ToolState {
  static styles = [...BaseToolbar.styles, ScFileToolStyle];

  @property({ type: String }) filename = '';
  @property({ type: Array, attribute: false }) dataSource: ScribbleDataSource[];
  @property() initialZoom = 'auto';
  @property({ type: Number, attribute: false }) minZoom = 10;
  @property({ type: Number, attribute: false }) maxZoom = 200;
  @property({ type: Object }) config: ToolConfig = defaultToolConfig;

  @state() pages: ScPDFPage[] = [];
  @state() isSheetOpen = false;
  zoomRatio = 100;
  currentPage = 1;
  @state() rotation = 0;
  @state() activeFileType?: string;
  @state() isScriberToolActive = false;
  @state() totalPage = 1;

  @queryAll('.side-sheet .img-wrapper') tocThumbnails: HTMLDivElement[];
  @query('.page-input') pageInput: HTMLElement & { value: number };
  @query('.zoom-input') zoomInput: HTMLElement & { value: number };

  resConfig: Required<ToolConfig> = { ...defaultToolConfig };
  defaultFullWidthZoom = 100;
  zoomMode =
    typeof this.initialZoom === 'string' ? this.initialZoom : undefined;

  _tocIntersectionObserver?: IntersectionObserver;

  constructor() {
    super();
    // this.emitStateChange = debounce(this.emitStateChange, 100);
  }

  @watch('config')
  handleConfigChange() {
    Object.assign(this.resConfig, defaultToolConfig, this.config);

    if (this.resConfig.inputDelay >= 0) {
      this.setPageDebounced = debounce(this.setPage, this.resConfig.inputDelay);
      this.setZoomDebounced = debounce(this.setZoom, this.resConfig.inputDelay);
    }
  }

  reset() {
    // TODO: support full width, full page, full height
    this.zoomRatio = this.defaultFullWidthZoom;
    this.currentPage = 1;
    this.rotation = 0;
    this.isSheetOpen = false;
  }

  setPage(value: number, opts: SetOptions = {}) {
    const _value = Math.min(this.totalPage, Math.max(1, value));
    const changed = _value !== this.currentPage;
    this.currentPage = _value;
    if (opts.emit !== false && changed) this.emitStateChange('currentPage');
    if (
      opts.update !== false &&
      this.pageInput &&
      +this.pageInput.value !== this.currentPage
    )
      this.pageInput.value = this.currentPage;
    this.shadowRoot?.querySelector<HTMLElement>(
      'sc-file-tool-icon.prev-page'
    )?.toggleAttribute('disabled', _value === 1);
    this.shadowRoot?.querySelector<HTMLElement>(
      'sc-file-tool-icon.next-page'
    )?.toggleAttribute('disabled', _value === this.totalPage);
  }
  setPageDebounced = debounce(this.setPage, defaultToolConfig.inputDelay);

  setZoom(value: number, opts: SetOptions & { asDefault?: 'width' } = {}) {
    this.zoomRatio = Math.min(this.maxZoom, Math.max(this.minZoom, value));

    if (opts.emit !== false) this.emitStateChange('zoomRatio');
    if (
      opts.update !== false &&
      this.zoomInput &&
      +this.zoomInput.value !== this.zoomRatio
    )
      this.zoomInput.value = this.zoomRatio;

    switch (opts.asDefault) {
      case 'width':
        this.defaultFullWidthZoom = this.zoomRatio;
        break;
      default:
        break;
    }
    this.shadowRoot?.querySelector<HTMLElement>(
      'sc-file-tool-icon.zoom-out'
    )?.toggleAttribute('disabled', this.zoomRatio === this.minZoom);
    this.shadowRoot?.querySelector<HTMLElement>(
      'sc-file-tool-icon.zoom-in'
    )?.toggleAttribute('disabled', this.zoomRatio === this.maxZoom);
  }
  setZoomDebounced = debounce(this.setZoom, defaultToolConfig.inputDelay);

  setRotation(value: number) {
    const nValue = ((value % 360) + 360) % 360;
    if (nValue !== this.rotation) {
      this.rotation = nValue;
      this.emitStateChange('rotation');

      if (navigationAvailableTypes.includes(this.activeFileType ?? '')) {
        if (this.resConfig.rotateScope === 'page') {
          this.tocThumbnails[this.currentPage - 1]?.replaceChildren();
        } else {
          this.tocThumbnails.forEach(item => item.replaceChildren());
        }
        // forces intersection re-observe
        this.setTotalPage(this.totalPage);
      }
    }
  }

  toggleState(name: keyof PickByType<ToolState, boolean>) {
    this[name] = !this[name];
    this.emitStateChange(name);

    switch (name) {
      case 'isScriberToolActive':
        this.shadowRoot
          ?.querySelector('sc-file-tool-icon.scriber-tool')
          ?.toggleAttribute('active', this.isScriberToolActive);
        break;
      default:
        break;
    }
  }

  async setTotalPage(value: number) {
    this._tocIntersectionObserver?.disconnect();

    this.totalPage = value;
    await this.updateComplete;

    this.tocThumbnails.forEach(item => {
      this._tocIntersectionObserver?.observe(item);
    });
    this.setPage(this.currentPage, { update: false, emit: false });
  }

  updateCurrentPageViaToc(pageNumber: number) {
    this.emitStateChange('currentPage', pageNumber);
  }
  renderSheetOfTOC() {
    if (!this.activeFileType) {
      return nothing;
    }

    if (!navigationAvailableTypes.includes(this.activeFileType ?? '')) {
      return nothing;
    }

    return html` <sc-side-sheet
      .open=${this.isSheetOpen}
      class="sc-side-sheet"
      width="144px"
      position="left"
      contained
      no-header
    >
      <div class="side-sheet">
        <!-- <div class="side-sheet-title">Table of Contents</div> -->
        <div class="img-navigations">
          ${guard([this.filename, this.totalPage, this.currentPage], () =>
            repeat(
              Array.from({ length: this.totalPage }, (_, i) => i + 1),
              i => `${this.filename} ${i}/${this.totalPage}`,
              pageNum => html`<div
                  class=${classMap({
                    'img-wrapper': true,
                    'active-page': pageNum === this.currentPage,
                  })}
                  data-page=${pageNum}
                  data-id=${`${this.filename} ${pageNum}/${this.totalPage}`}
                  @click=${() => this.updateCurrentPageViaToc(pageNum)}
                ></div>
                <div class="page-number">${pageNum}</div>`
            )
          )}
        </div>
      </div>
    </sc-side-sheet>`;
  }

  emitStateChange(name: keyof ToolState, expectedValue?: any) {
    const value = expectedValue ?? this[name];
    this.emit('sc-file-tool-state-change', {
      detail: { name, value },
    });
  }

  connectedCallback(): void {
    super.connectedCallback();

    const root = findAncestor(this, el => {
      const { overflow } = getComputedStyle(el);
      return overflow.includes('auto') || overflow.includes('scroll');
    });
    this._tocIntersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const el = entry.target;
          if (
            entry.isIntersecting &&
            el instanceof HTMLElement &&
            !el.childElementCount
          ) {
            const provide = (source: HTMLCanvasElement) => {
              const canvas = document.createElement('canvas');
              const ratio = source.width / source.height;
              if (ratio > 1) {
                canvas.width = Math.min(128, source.width);
                canvas.height = canvas.width / ratio;
              } else {
                canvas.height = Math.min(128, source.height);
                canvas.width = canvas.height * ratio;
              }
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(source, 0, 0, canvas.width, canvas.height);
              el.childNodes.forEach(child => child.remove());
              el.appendChild(canvas);
            };
            const pageNumber = parseInt(el.dataset.page ?? '1');
            this.emit('sc-toc-thumbnail-request', {
              detail: { pageNumber, provide },
            });
          }
        });
      },
      { root, threshold: 0, rootMargin: '40% 0px' }
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    this._tocIntersectionObserver?.disconnect();
  }

  getTool(type: string): ReturnType<typeof html> | typeof nothing {
    if (!this.activeFileType) return nothing;
    switch (type) {
      case 'contents':
        if (!navigationAvailableTypes.includes(this.activeFileType ?? '')) break;
        return html`<sc-file-tool-icon
          class="tool lock"
          icon="menu"
          label="Contents"
          @click=${() => this.toggleState('isSheetOpen')}
        >
        </sc-file-tool-icon>`;
      case 'next-page':
        return html`<sc-file-tool-icon
          class="next-page"
          icon="chevron-right"
          label="Next Page"
          @click=${() => this.setPage(this.currentPage + 1)}
        >
        </sc-file-tool-icon>`;
      case 'prev-page':
        return html`<sc-file-tool-icon
          class="prev-page"
          icon="chevron-left"
          label="Previous Page"
          @click=${() => this.setPage(this.currentPage - 1)}
        >
        </sc-file-tool-icon>`;
      case 'page':
        if (!navigationAvailableTypes.includes(this.activeFileType)) break;
        return html`<div class="tool group page-group center divider-after">
          ${this.getTool('prev-page')}
          <span>Page</span>
          <sc-number-input
            class="page-input d-${this.totalPage.toString().length}"
            value=${this.currentPage}
            @sc-input=${(e: CustomEvent) => {
              if (!(e.target as HTMLElement).matches(':focus-within')) return;
              if (this.resConfig.inputDelay < 0) return;
              const value = parseInt(e.detail.value);
              if (!isNaN(value)) {
                // this.setPage(value, { emit: false, update: false });
                this.setPageDebounced(value, { update: false });
              }
            }}
            @sc-blur=${(e: Event) => {
              const action = this.resConfig.blurAction;
              if (action !== 'none') {
                if (action === 'set') this.setPage(+(e.target as any).value);
                (e.target as any).value = `${this.currentPage}`;
              }
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                const el = e.target as any;
                if (el) {
                  this.setPage(+el.value);
                  requestAnimationFrame(() =>
                    el.formControl?.setSelectionRange(0, el.value.length)
                  );
                }
              }
            }}
            placeholder=""
            border-type="box"
            .min=${this.resConfig.strictLimits ? 1 : undefined}
            .max=${this.resConfig.strictLimits ? this.totalPage : undefined}
            size="md"
            text-align="center"
            type="digit"
            max-decimals="0"
          >
          </sc-number-input>
          <span style="white-space:nowrap">of ${this.totalPage}</span>
          ${this.getTool('next-page')}
        </div>`;
      case 'zoom-in':
        return html`<sc-file-tool-icon
          class="zoom-in"
          icon="zoom-in--line"
          label="Zoom in"
          @click=${() => this.setZoom(this.zoomRatio + 10)}
        >
        </sc-file-tool-icon>`;
      case 'zoom-out':
        return html`<sc-file-tool-icon
          class="zoom-out"
          icon="zoom-out--line"
          label="Zoom out"
          @click=${() => this.setZoom(this.zoomRatio - 10)}
        >
        </sc-file-tool-icon>`;
      case 'zoom':
        if (!zoomAvailableTypes.includes(this.activeFileType)) break;
        return html`<div class="tool group zoom-group center divider-after">
          ${this.getTool('zoom-out')}
          <sc-number-input
            class="zoom-input"
            value=${this.zoomRatio}
            @sc-input=${(e: CustomEvent) => {
              if (!(e.target as HTMLElement).matches(':focus-within')) return;
              if (this.resConfig.inputDelay < 0) return;
              const value = parseInt(e.detail.value);
              if (!isNaN(value)) {
                this.setZoomDebounced(value);
              }
            }}
            @sc-blur=${(e: Event) => {
              const action = this.resConfig.blurAction;
              if (action !== 'none') {
                if (action === 'set') this.setZoom(+(e.target as any).value);
                (e.target as any).value = `${this.zoomRatio}`;
              }
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                const el = e.target as any;
                if (el) {
                  this.setZoom(+el.value);
                  requestAnimationFrame(() =>
                    el.formControl?.setSelectionRange(
                      0,
                      `${this.zoomRatio}`.length
                    )
                  );
                }
              }
            }}
            .min=${this.resConfig.strictLimits ? this.minZoom : undefined}
            .max=${this.resConfig.strictLimits ? this.maxZoom : undefined}
            placeholder=""
            border-type="box"
            size="md"
            text-align="left"
            type="digit"
            max-decimals="0"
          >
          </sc-number-input>
          <span>%</span>
          ${this.getTool('zoom-in')}
        </div>`;
      case 'rotate':
        if (!rotationAvailableTypes.includes(this.activeFileType)) break;
        return html`<sc-file-tool-icon
          class="tool divider-after"
          label="Rotate"
          @click=${() => this.setRotation(this.rotation - 90)}
        >
          ${rotateIcon()}
        </sc-file-tool-icon>`;

      case 'scriber':
        if (!scriberAvailableTypes.includes(this.activeFileType)) break;
        return html`<sc-file-tool-icon
          class="tool scriber-tool"
          label="Scriber"
          @click=${() => this.toggleState('isScriberToolActive')}
        >
          ${scriberIcon()}
        </sc-file-tool-icon>`;
      case 'download':
        return html`<sc-file-tool-icon
          class="tool"
          icon="download"
          label="Download"
          @click=${() =>
            this.emit('sc-file-tool-download', {
              detail: {
                file: this.activeFileType,
              },
            })}
        >
        </sc-file-tool-icon>`;
      case 'fullscreen':
        if (excelTypes.includes(this.activeFileType)) break;
        return html`<sc-file-tool-icon
          class="tool"
          icon="enlarge"
          label="Fullscreen"
          @click=${() => this.emit('sc-file-tool-fullscreen')}
        >
        </sc-file-tool-icon>`;
      default:
        break;
    }
    return nothing;
  }

  renderDocTitle() {
    if (!this.activeFileType) {
      return nothing;
    }
    return html` <sc-paragraph
      title=${this.filename ?? 'No document'}
      size="md"
      rows="1"
      ellipsis
    >
      ${this.filename ?? 'No document'}
    </sc-paragraph>`;
  }

  renderToolbar() {
    return html`
      <div class="set left-set">
        ${this.getTool('contents')} ${this.renderDocTitle()}
      </div>
      <div class="set center-set">
        ${this.getTool('page')} ${this.getTool('zoom')}
        ${this.getTool('rotate')}
      </div>
      <div class="set right-set">
        ${this.getTool('scriber')} ${this.getTool('download')}
        ${this.getTool('fullscreen')}
      </div>
      ${this.renderMoreTool()}
    `;
  }

  render() {
    return html`
      <sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
        <div
          class="main-toolbar toolbar"
          ${ref(
            el => el instanceof HTMLElement && render(this.renderToolbar(), el)
          )}
        ></div>
        <sc-scriber-toolbar
          .dataSource=${this.dataSource}
          @scriber-toolbar=${(e: CustomEvent) =>
            this.emit('sc-file-tool-scriber-change', {
              detail: e.detail,
            })}
          ?hidden=${!this.isScriberToolActive}
        ></sc-scriber-toolbar>
          ${this.renderSheetOfTOC()}
      </sc-icon-provider>
    `;
  }
}

function scriberIcon() {
  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 21.1679V14L12 7L16 14V21.1679"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 14C8 14 9.12676 15 10 15C10.8732 15 12 14 12 14C12 14 13.1268 15 14 15C14.8732 15 16 14 16 14"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 7.5L8.5 14L10.5 15L11.5 13.5L13 15L16 14.5L12 7.5Z"
      fill="currentColor"
    />
  </svg>`;
}
function rotateIcon() {
  return html`<svg
    style="cursor: pointer;"
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
  >
    <path
      d="M10.2136 0.909004C10.4478 0.674851 10.8276 0.674957 11.0619 0.909004C11.2961 1.14329 11.2967 1.52364 11.0625 1.75796L10.0794 2.74038C11.425 2.81482 12.6776 3.49588 13.5964 4.61148C14.5682 5.79167 15.1003 7.37185 15.1003 9.00015C15.1002 10.6285 14.5683 12.2086 13.5964 13.3888C12.6218 14.5722 11.2718 15.267 9.83335 15.2671C9.50203 15.2671 9.23318 14.9981 9.23309 14.6668C9.23309 14.3354 9.50198 14.0666 9.83335 14.0666C10.87 14.0665 11.8943 13.5675 12.6699 12.6258C13.4483 11.6806 13.8997 10.3775 13.8998 9.00015C13.8998 7.62287 13.4482 6.31967 12.6699 5.3745C11.8943 4.43276 10.87 3.93382 9.83335 3.93374C9.82535 3.93374 9.81717 3.93275 9.80926 3.93244L11.0625 5.1857C11.2967 5.42002 11.2961 5.79974 11.0619 6.034C10.8276 6.2681 10.4478 6.26876 10.2136 6.03466L8.33204 4.15249C7.95626 3.77653 7.95622 3.16652 8.33204 2.79051L10.2136 0.909004Z"
      fill="currentColor"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.50978 4.68374C5.82217 4.37145 6.32889 4.37145 6.64129 4.68374L10.6016 8.64338C10.9139 8.95576 10.9137 9.4625 10.6016 9.77489L6.64129 13.7352C6.32887 14.0473 5.82212 14.0474 5.50978 13.7352L1.55014 9.77489C1.23786 9.46251 1.23783 8.9558 1.55014 8.64338L5.50978 4.68374ZM2.6823 9.20914L6.07553 12.603L9.46941 9.20914L6.07553 5.81525L2.6823 9.20914Z"
      fill="currentColor"
    />
  </svg>`;
}