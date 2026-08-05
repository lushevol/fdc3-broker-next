import ScElement from '../../../../shared/sc-element.js';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { Feature } from '../../types/Feature.js';
import { property, queryAsync } from 'lit/decorators.js';
import { ScDataGridColumnManager } from '../../ScDataGridColumnManager.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { watch } from '../../../../shared/watch.js';
import { Updater, VisibilityState } from '@tanstack/lit-table';
import { INTERNAL_EVENTS } from '../../../../shared/sc-custom-events.js';

export type TMixin = {
  getColumnVisibilityOptions(): Record<string, any>;
  toggleColumnVisibility: (e: Event) => Promise<void>;
  columnVisibility: boolean
};

export const ColumnVisibilityMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'columnVisibility'>
    {
      
      @storybook('boolean', {
        description: 'Set to set columns visibility',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'column-visibility', reflect: true })
      columnVisibility = false;

      @queryAsync('sc-data-grid-column-manager')
      columnVisbilityEl: Promise<ScDataGridColumnManager>;

      toggleColumnVisibility = async (e: Event) => {
        const columnFilterEl = await this.columnVisbilityEl;
        if (columnFilterEl.isPopupActive) {
          columnFilterEl.hidePopup();
          return;
        }

        const target = e.target as HTMLElement;
        columnFilterEl.setVirtualAnchor(target);
        columnFilterEl.showPopup();
        // fixes race condition where flattenHeaders is not yet populated
        columnFilterEl.handleSearchTextChange();
      };

      @watch('columns')
      updateColumnVisibility() {
        const visibility: Record<string, boolean> = {};
        const allHeaders = this.table.getHighestHeaders().flatMap(header =>
          this.table.getDeepestHeader(header)
        );
        allHeaders.forEach(header => {
          const isHide = header.column.columnDef.meta?.hide ?? false;
          visibility[header.column.id] = !isHide;
        });
        this.table.setColumnVisibility(visibility);
      }

      getColumnVisibilityOptions() {
        return {
          onColumnVisibilityChange: (visibility: Updater<VisibilityState>) => {
            const columnVisibility =
              visibility instanceof Function
                ? visibility(this.table.getState().columnVisibility)
                : visibility;
            if (columnVisibility) {
              this.table.setState(old => ({
                ...old,
                columnVisibility,
              }));
              this.internalEmit(INTERNAL_EVENTS['sc-column-visibility']);
            }
          },
        };
      }
    }
    return Mixin;
  }
);
