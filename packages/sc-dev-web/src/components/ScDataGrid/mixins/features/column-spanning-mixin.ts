import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';

export type TMixin = {
  getColumnSpanningConfigurationsOptions(): Record<string, any>;
};

export const ColumnSpanningMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'columnSpanningConfigurations'>
    {
      @watch('columns')
      updateColumnSpanningConfigurations() {
        const spanningConf = new Map();
        this.table.getAllLeafColumns().forEach(column => {
          if (column.columnDef.meta?.colSpanning) {
            spanningConf.set(column.id, column.columnDef.meta.colSpanning);
          }
        });
        this.table.setColumnSpanningConfigurations(spanningConf);
      }
      getColumnSpanningConfigurationsOptions() {
        return {};
      }
    }
    return Mixin;
  }
);
