import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import {
  Cell,
  Row,
  RowModel,
  Table,
  getExpandedRowModel,
} from '@tanstack/lit-table';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { property } from 'lit/decorators.js';
import ScElement from '../../../../shared/sc-element.js';
import { memo } from '../../../../shared/memo.js';
import { PropertyValues } from 'lit';

export type TMixin = {
  masterCellRenderer: (
    cell: Cell<unknown, unknown>,
    renderCallback: (template: unknown) => void
  ) => any;
  isCellExpandable?: (cell: Cell<unknown, unknown>) => boolean;
  handleRowExpand(cell: Cell<unknown, unknown>): void;
  getIsParentVisible(row: Row<unknown>): boolean;
  getExpandedOptions(): {
    getExpandedRowModel: (table: Table<unknown>) => () => RowModel<unknown>;
    autoResetExpanded: boolean;
  };
  initialExpanded: boolean;
};

function defaultRender(
  cell: Cell<unknown, unknown>,
  renderCallback: (template: unknown) => void
) {
  renderCallback(
    'Please configure masterCellRenderer to customize the master render area'
  );
}

// ANA: currently, nothing about grouping, has commonly logic for now.
// support grouping and master detail only
export const ExpandingMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'expanded'>
    {
      @storybook('boolean', {
        description: 'Set to initially expand grouped rows',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'initial-expanded' })
      initialExpanded = false;

      // ANA: expand level can down to cell, up to row
      @storybook('object', {
        description: 'Set to make cell expandable',
        defaultValue: () => false,
      })
      @property({ type: Object })
      isCellExpandable?: (cell: Cell<unknown, unknown>) => boolean;

      @storybook('object', {
        description:
          'Set master cell renderer to render anything you need, will invoke when the corresponding cell expanded. that means you need to maintain the state manually.',
        defaultValue: defaultRender,
      })
      @property({ type: Object })
      masterCellRenderer: (
        cell: Cell<unknown, unknown>,
        renderCallback: (template: unknown) => void
      ) => any = defaultRender;

      @watch('columns')
      updateExpanded() {}
      getExpandedOptions() {
        return {
          getExpandedRowModel: getExpandedRowModel(),
          autoResetExpanded: false,
          isCellExpandable: this.isCellExpandable,
        };
      }

      @watch('isCellExpandable')
      handleGetCellCanExpandChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            isCellExpandable: this.isCellExpandable,
          };
        });
      }

      protected firstUpdated(_changedProperties: PropertyValues): void {
        super.firstUpdated?.(_changedProperties);
        if (this.initialExpanded)
          this.table.setExpanded(true);
      }

      visibleRowsById = memo(
        () => [this.table.getCenterRows()],
        rows => {
          const res: Record<string, Row<unknown>> = {};
          rows.forEach(row => (res[row.id] = row));
          return res;
        }
      );

      getIsParentVisible(row: Row<unknown>) {
        const visibleRows = this.visibleRowsById();
        
        return Boolean(visibleRows[row.id]);
      }

      handleRowExpand(cell: Cell<unknown, unknown>) {
        // is expandable master cell?
        const isExpandableMaster = cell.getIsExpandableMaster();
        // is expandable grouped cell?
        const isExpandableGroup = cell.getIsGrouped();
        if (!isExpandableGroup && !isExpandableMaster) {
          return;
        }

        let eventName: 'sc-master-expand' | 'sc-group-expand';
        let currentExpandState: boolean;
        if (isExpandableMaster) {
          currentExpandState = cell.getIsExpanded();
          // master detail expand
          eventName = 'sc-master-expand';
          this.table.setMasterCell(old => {
            if (currentExpandState) {
              old.delete(cell.row.id);
            } else {
              old.set(cell.row.id, cell);
            }
            return new Map(old);
          });
        } else if (isExpandableGroup) {
          currentExpandState = cell.row.getIsExpanded();
          // grouping
          eventName = 'sc-group-expand';

          cell.row.toggleExpanded();
        } else {
          return;
        }

        this.emit(eventName, {
          detail: {
            cell,
            row: cell.row,
            column: cell.column,
            isExpanded: !currentExpandState,
          },
        });

        this.table.updateRowSpanning();
      }
    }
    return Mixin;
  }
);
