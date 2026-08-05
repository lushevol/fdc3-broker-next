import { html } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { Feature } from '../../types/Feature.js';
import { property } from 'lit/decorators.js';
import { watch } from '../../../../shared/watch.js';
import {
  ColumnDef,
  Row,
  RowData,
  createColumnHelper,
} from '@tanstack/lit-table';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { RowSelectionMode, RowSelectionStrategy } from '../../types/utils.js';
import ScElement from '../../../../shared/sc-element.js';
import { msg } from '@lit/localize';

const columnHelper = createColumnHelper();

export type TMixin = {
  getRowSelectionOptions: () => Record<string, any>;
  isRowSelectable?: (row: Row<unknown>) => boolean;
  defaultSelectedRows?: string[];
  hideUnselectableRows?: boolean;
  rowSelection?: boolean;
  enableClickSelection?: boolean;
  hideCheckbox?: boolean;
  selectionQuantity?: boolean;
  selectAllButton?: boolean;
  rowSelectionStrategy: RowSelectionStrategy;
  rowSelectionMode: RowSelectionMode;
  rowSelectionRadio: boolean;
  countRowGroupSelection: boolean;
  rowGroupOverrideSelectable: boolean;
  handleSelectAll: (isChecked: boolean) => void;
  handleSelectSingle: (row: Row<unknown>) => (isChecked: boolean) => void;
  selectedRowsInOrder: Row<unknown>[];
  getActivatedKey(): string;
  activatedKeys: Map<'shift' | 'ctrl', boolean>
  handleKeydownForRowSelection: (e: KeyboardEvent) => void;
  handleKeyupForRowSelection: (e: KeyboardEvent) => void;
};

export const ROW_SELECTION_COLUMN_ID = Symbol(
  'sc-data-grid-row-selection'
).toString();
export const RowSelectionMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'rowSelection'>
    {
      @storybook('object', {
        description: 'Set to whether a row can be selected',
        defaultValue: () => undefined,
      })
      @property({ type: Object })
      isRowSelectable?: (row: Row<unknown>) => boolean;

      @storybook('object', {
        description: 'Set to selected specific rows by default',
        defaultValue: [],
      })
      @property({ type: Array })
      defaultSelectedRows?: string[];

      @storybook('boolean', {
        description: 'Set to hide unselectable rows',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'hide-unselectable-rows',
        reflect: true,
      })
      hideUnselectableRows?: boolean;

      @storybook('boolean', {
        description: 'Set to hide checkbox column when enable row-selection.',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'hide-checkbox',
        reflect: true,
      })
      hideCheckbox?: boolean;

      @storybook('boolean', {
        description: 'Set to enable row selection',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'row-selection', reflect: true })
      rowSelection?: boolean;

      @storybook('boolean', {
        description: 'Enable select a row by clicking on it',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'enable-click-selection',
        reflect: true,
      })
      enableClickSelection?: boolean;

      @storybook('boolean', {
        description: 'Set to also count grouping row for row-selection',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'count-row-group-selection', reflect: true })
      countRowGroupSelection = false;
      
      @storybook('boolean', {
        description: 'Set to allow grouping row to select non-selectable sub-rows',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'row-group-override-selectable', reflect: true })
      rowGroupOverrideSelectable = false;

      @storybook('boolean', {
        description: 'Show selection quantity above data grid when enable',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'selection-quantity',
        reflect: true,
      })
      selectionQuantity?: boolean;

      @storybook('boolean', {
        description: 'Show select all button above data grid when enable',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        attribute: 'select-all-button',
        reflect: true,
      })
      selectAllButton?: boolean;

      @storybook('inline-radio', {
        description: 'Set to change row selection strategy',
        defaultValue: 'all',
        options: ['all', 'currentPage'],
      })
      @property({
        type: String,
        attribute: 'row-selection-strategy',
        reflect: true,
      })
      rowSelectionStrategy: RowSelectionStrategy = 'all';

      @storybook('inline-radio', {
        description: 'Set to change row selection mode',
        defaultValue: 'multiple',
        options: ['single', 'multiple'],
      })
      @property({
        type: String,
        attribute: 'row-selection-mode',
        reflect: true,
      })
      rowSelectionMode: RowSelectionMode = 'multiple';

      @storybook('boolean', {
        description: 'Uses radio input when mode is single',
        defaultValue: false,
        if: { arg: 'rowSelectionMode', eq: 'single' },
      })
      @property({ type: Boolean, reflect: true, attribute: 'row-selection-radio' })
      rowSelectionRadio = false;

      selectedRowsInOrder: Row<unknown>[] = [];

      activatedKeys = new Map<'shift' | 'ctrl', boolean>();

      emitExternalSelectEvent() {
        const rowsById = this.table.getCoreRowModel().rowsById;
        const selectedData = Object.keys(this.tableState.rowSelection ?? {})
          .filter(rowId => rowsById[rowId])
          .map(rowId => this.table.getRow(rowId, true));
        this.emit('sc-select', {
          detail: {
            selectedData,
            isSelectedAll:
              selectedData.length === this.table.getSelectableRows().length,
          },
        });
      }

      mutateselectedRowsInOrder(isChecked: boolean, row: Row<unknown>) {
        this.selectedRowsInOrder = this.selectedRowsInOrder.filter(
          orderedRow => {
            return orderedRow.id !== row.id;
          }
        );
        if (isChecked) {
          this.selectedRowsInOrder.push(row);
        }
      }

      handleSelectAll = (isChecked: boolean) => {
        if (this.table.getIsSingleSelectionMode()) return;

        const rows = this.table.getSelectableGroupRows().rows;
        this._selectSubRows(rows, isChecked);
        this.emitExternalSelectEvent();
      };

      private _selectSubRows(rows: Row<unknown>[], isChecked: boolean): void {
        rows.forEach(row => {
          const selectable = row.getIsRowSelectable();
          if (selectable || (this.rowGroupOverrideSelectable && !row.subRows?.length)) {
            // do not register group row as selected but allow selection of it's child rows
            !row.subRows?.length && row.toggleSelected(isChecked);
            this.mutateselectedRowsInOrder(isChecked, row);
            this._selectSubRows(row.subRows, isChecked);
          }
        });
      }

      handleSelectSingle = (row: Row<unknown>) => {
        const isGroupedRow = row.getIsGrouped();
        const isRowSelectable = row.getIsRowSelectable();
        const isSingleMode = this.table.getIsSingleSelectionMode();
        return isGroupedRow
          ? (isChecked: boolean) => {
              if (!isRowSelectable || isSingleMode) {
                return;
              }
              this._selectSubRows(row.subRows, isChecked);
              this.emitExternalSelectEvent();
            }
          : (isChecked: boolean) => {
              let undeterminedIsChecked = isChecked;
              if (!isRowSelectable) {
                return;
              }
              const selectedRow = this.table.getState().rowSelection;
              const selectedRowLengh = Object.keys(selectedRow).length;
              const activatedKey = this.getActivatedKey();
              if (isSingleMode) {
                if (selectedRowLengh > 1) {
                  undeterminedIsChecked = true;
                }
                this.table.resetRowSelection(true);
                this.selectedRowsInOrder = [];
              }
              if (!isSingleMode && selectedRowLengh > 0 && activatedKey === 'shift') {
                const rowsBeforePagination =
                  this.table.getIsEnableDraggableRow()
                    ? this.table.getCenterRowsAfterDragging()
                    : this.table.getExpandedRowModel().rows;
                const previousSelectedRow =
                  this.selectedRowsInOrder[this.selectedRowsInOrder.length - 1];
                const previousSelectedRowIndex = rowsBeforePagination.findIndex(
                  _row => {
                    return previousSelectedRow.id === _row.id;
                  }
                );
                const rowIndex = rowsBeforePagination.findIndex(_row => {
                  return row.id === _row.id;
                });
                const left = Math.min(previousSelectedRowIndex, rowIndex);
                const right = Math.max(previousSelectedRowIndex, rowIndex);

                const rowsToBeSelect = rowsBeforePagination.slice(
                  left,
                  right + 1
                );
                rowsToBeSelect.forEach(row => {
                  row.toggleSelected(true);
                  this.mutateselectedRowsInOrder(true, row);
                });
              } else {
                row.toggleSelected(undeterminedIsChecked);
                this.mutateselectedRowsInOrder(undeterminedIsChecked, row);
              }
              this.emitExternalSelectEvent();
            };
      };

      makeRowSelectionColumn() {
        return columnHelper.accessor(ROW_SELECTION_COLUMN_ID, {
          id: ROW_SELECTION_COLUMN_ID,
          enableSorting: false,
          enableColumnFilter: false,
          enableResizing: false,
          header: () => {
            return html`
              <sc-data-grid-selection-cell
                ?checked=${this.table.getIsSelectedAll()}
                ?indeterminate=${this.table.getIsIndeterminate()}
                ?hide=${this.table.getIsSingleSelectionMode()}
                @sc-select=${(e: CustomEvent<{ value: boolean }>) => {
                  const isChecked = e.detail.value;
                  this.handleSelectAll(isChecked);
                }}
                a11y-label=${this.table.getIsSelectedAll()
                  ? msg('Unselect all', { id: 'sc-dropdown-unselect-all' })
                  : msg('Select all', { id: 'sc-dropdown-select-all' })}
              ></sc-data-grid-selection-cell>
            `;
          },
          cell: ({ row }) => {
            return html`
              <sc-data-grid-selection-cell
                ?radio=${this.table.getIsSingleSelectionMode() &&
                this.table.getIsSelectionRadio()}
                ?checked=${row.getIsRowSelected()}
                ?indeterminate=${row.getIsIndeterminate()}
                ?disabled=${!row.getIsRowSelectable()}
                ?hide=${row.getIsUnvisibleSelection()}
                @sc-select=${(e: CustomEvent<{ value: boolean }>) => {
                  const isChecked = e.detail.value;
                  this.handleSelectSingle(row)(isChecked);
                }}
                a11y-label=${row.getIsRowSelected()
                  ? 'Unselect row'
                  : 'Select row'}
              ></sc-data-grid-selection-cell>
            `;
          },
          size: 32,
          minSize: 32,
          maxSize: 32,
          meta: { lock: true },
        }) as ColumnDef<RowData, any>;
      }

      @watch('defaultSelectedRows')
      onDefaultSelectedRowsChange() {
        const rowSelection =
          this.defaultSelectedRows?.reduce((res, cur) => {
            const row = this.table.getRow(cur);
            if (row) {
              this.mutateselectedRowsInOrder(true, row);
              return {
                ...res,
                [cur]: true,
              };
            }
            return res;
          }, {}) ?? {};
        this.table.setRowSelection(rowSelection);
      }

      @watch('rowSelectionMode')
      onRowSelectionModeChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            rowSelectionMode: this.rowSelectionMode,
            rowSelectionRadio:
              this.rowSelectionMode === 'single' && this.rowSelectionRadio,
          };
        });
        this.table.resetRowSelection(true);
      }

      @watch('rowSelectionRadio')
      onRowSelectionRadioChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            rowSelectionRadio:
              this.rowSelectionMode === 'single' && this.rowSelectionRadio,
          };
        });
      }

      @watch('hideUnselectableRows')
      onHideUnselectableRowsChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            hideUnselectableRows: this.hideUnselectableRows,
          };
        });
      }

      @watch(['isRowSelectable', 'rowGroupOverrideSelectable'])
      onIsRowSelectableChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            isRowSelectable: this.isRowSelectable,
            rowGroupOverrideSelectable: this.rowGroupOverrideSelectable,
          };
        });
      }

      @watch('rowSelectionStrategy')
      updateRowSelectionStrategy() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            rowSelectionStrategy: this.rowSelectionStrategy,
          };
        });
      }

      @watch(['rowSelection', 'hideCheckbox'])
      handleHideCheckbox() {
        if (!this.rowSelection) {
          return;
        }
        if (this.hideCheckbox) {
          this.removeColumnFromBuiltInColumns(
            ROW_SELECTION_COLUMN_ID,
            'prefix'
          );
        } else {
          if (this.getColumnIndex(ROW_SELECTION_COLUMN_ID, 'prefix') === -1) {
            this.builtInColumns.prefix?.unshift(this.makeRowSelectionColumn());
            this.putSelectionColumnAtFirst();
          }
        }
        this.updateColumnDefs();
      }

      @watch('rowSelection')
      updateRowSelection() {
        if (this.rowSelection) {
          this.builtInColumns.prefix?.unshift(this.makeRowSelectionColumn());
          this.putSelectionColumnAtFirst();
        } else {
          this.removeColumnFromBuiltInColumns(
            ROW_SELECTION_COLUMN_ID,
            'prefix'
          );
          this.table.resetRowSelection(true);
        }
        this.updateColumnDefs();
      }
      putSelectionColumnAtFirst() {
        const { left = [], right = [] } = this.table.getState().columnPinning;
        if (left.length && !left.includes(ROW_SELECTION_COLUMN_ID)) {
          this.table.setColumnPinning(() => {
            return {
              left: [ROW_SELECTION_COLUMN_ID, ...left],
              right: [...right],
            };
          });
        }
      }
      getRowSelectionOptions() {
        return {
          enableSubRowSelection: true,
        };
      }

      getActivatedKey() {
        let key = 'none';

        if (this.activatedKeys.get('shift')) {
          key = 'shift';
        } else if (this.activatedKeys.get('ctrl')) {
          key = 'ctrl';
        }
        return key;
      }

      handleKeydownForRowSelection = (e: KeyboardEvent) => {
        this.activatedKeys.set('ctrl', e.ctrlKey);
        this.activatedKeys.set('shift', e.shiftKey);
      };
      handleKeyupForRowSelection = (e: KeyboardEvent) => {
        this.activatedKeys.set('ctrl', e.ctrlKey);
        this.activatedKeys.set('shift', e.shiftKey);
      };

      connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('keydown', this.handleKeydownForRowSelection);
        window.addEventListener('keyup', this.handleKeyupForRowSelection);
      }
      disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener(
          'keydown',
          this.handleKeydownForRowSelection
        );
        window.removeEventListener('keyup', this.handleKeyupForRowSelection);
      }
    }
    return Mixin;
  }
);
