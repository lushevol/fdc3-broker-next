import { PropertyValueMap, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { PopupMixin } from '../../mixins/popup-mixin.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import style, { classNamePrefix } from './ScDataGridEditing.style.js';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-spinner.js';
import { Cell } from '@tanstack/lit-table';
import { watch } from '../../shared/watch.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import { TCellEditor, TCellEditorParams } from './types/features/EditingDef.js';
import { PopupHandledMixin } from '../../mixins/popup-handled-mixin.js';

export class ScDataGridEditing extends StyleToolMixin(classNamePrefix)(
  PopupHandledMixin(PopupMixin(ScElement))
) {
  static styles = ScTheme.getStyles().concat([style]);

  @property({ type: Object, attribute: false })
  cell?: Cell<unknown, unknown> | undefined;

  @property({ type: Object, attribute: false })
  cellEditor?: TCellEditor;

  @property({ type: Object, attribute: false })
  cellEditorParams?: TCellEditorParams;

  @state()
  loading = false;

  @state()
  finalizedParams: {
    value: any;
  };

  @watch('cellEditorParams')
  handleCellEditorParamsChange() {
    if (!this.cellEditorParams || !this.cell) {
      return;
    }
    this.loading = true;
    const params = this.cellEditorParams(this.cell.getContext());
    if (params instanceof Promise) {
      params.then(res => {
        this.finalizedParams = res;
        this.loading = false;
      });
    } else {
      this.finalizedParams = params;
      this.loading = false;
    }
  }

  override hidePopup() {
    super.hidePopup();
    this.emit('sc-editing-stopped', {
      composed: true,
      detail: {
        value: this.cell,
      },
    });
    this.cell = undefined;
    this.loading = false;
    this.cellEditor = undefined;
    this.cellEditorParams = undefined;
  }

  sendValue = (updatedVal: any) => {
    this.emit('sc-change', {
      composed: true,
      detail: {
        value: updatedVal,
        cell: this.cell,
      },
    });
  };

  renderContent() {
    if (!this.cell) {
      return nothing;
    }
    if (this.loading) {
      return html`<sc-spinner
        type="component"
        size="sm"
        color="blue"
      ></sc-spinner>`;
    }
    if (this.cellEditor) {
      return html`${this.cellEditor(
        this.cell.getContext(),
        this.finalizedParams,
        this.sendValue
      )}`;
    }

    const renderFn = this.cell.getRenderableComponentForEditor();

    return html` ${renderFn(this.cell.getContext(), this.sendValue)} `;
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.updated(_changedProperties);
    this.updateComplete.then(() => {
      const editableEl = this.shadowRoot?.querySelector(
        '.sc-data-grid-built-in-edit-element'
      ) as HTMLElement;
      if (editableEl) {
        const input = editableEl.shadowRoot?.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    });
  }

  render() {
    return html`
      <sl-popup placement="bottom" strategy="fixed" flip sync="both">
        <div class="${this.makeClassName('root')}">${this.renderContent()}</div>
      </sl-popup>
    `;
  }
}
