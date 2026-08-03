import { PropertyValueMap, html, render } from 'lit';
import { property, query } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import style, { classNamePrefix } from './ScDataGridMasterCell.style.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import { Cell } from '@tanstack/lit-table';
import { ScDataGrid } from './ScDataGrid.js';

export class ScDataGridMasterCell extends StyleToolMixin(classNamePrefix)(
  ScElement
) {
  static styles = ScTheme.getStyles().concat([style]);

  @property({ type: String, attribute: 'row-id' }) rowId: string;
  @property({ type: Number, attribute: 'row-index' }) rowIndex: number;
  @property({ type: Number, attribute: 'col-span' }) colSpan: number;

  @property({ type: Object }) expandedCell?: Cell<unknown, unknown>;

  @property({ type: Object }) masterCellRenderer: (
    cell: Cell<unknown, unknown>,
    renderCallback: (template: unknown) => void
  ) => any;

  resizeObserver: ResizeObserver;

  constructor() {
    super();
    // dont need disconnect observer since cached
    this.resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const height = Math.ceil(entry.borderBoxSize[0].blockSize);
        this.emit('sc-dimension-update', {
          detail: {
            height,
          },
        });
      }
    });
  }

  emitScShowFromMaserCell(e: Event) {
    this.emit('sc-show', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        e,
      },
    });
  }

  watchTooltip() {
    this.shadowRoot?.addEventListener(
      'sl-show',
      (e: Event) => {
        this.emitScShowFromMaserCell(e);
      },
      {
        capture: true,
      }
    );
  }
  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    const rootClassname = `.${this.makeClassName('root')}`;
    const root = this.shadowRoot?.querySelector(rootClassname);
    if (root) {
      this.resizeObserver.observe(root);
    }
    this.watchTooltip();
  }

  @query('.sc-data-grid-master-cell-root')
  root: HTMLDivElement;

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(_changedProperties);
    if (this.masterCellRenderer && this.expandedCell) {
      this.masterCellRenderer(this.expandedCell, (template: unknown) => {
        render(template, this.root);
      });
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('focus', this._handleFocus);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._handleFocus);
  }

  private _handleFocus() {
    (
      this.root.querySelector<HTMLElement>(
        'a[href], input, textarea, select, button, [tabindex]'
      ) ?? this.root.querySelector<HTMLElement>('*')
    )?.focus();
  }

  private _handleBackFocus() {
    const root = this.getRootNode();
    const scGrid =
      root instanceof ShadowRoot ? (root.host as ScDataGrid) : null;
    if (scGrid) {
      scGrid.setFocusCell(this.rowId, this.rowIndex, this.colSpan - 1);
    }
  }

  render() {
    return html`
      <span tabindex="0" @focus=${this._handleBackFocus}></span>
      <div class="${this.makeClassName('root')}"></div>
    `;
  }
}
