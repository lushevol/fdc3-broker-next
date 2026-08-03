import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';

export type TMixin = {
  getRowSpanningConfigurationsOptions(): Record<string, any>;
};

// not support pinned row

export const RowSpanningMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'rowSpanningConfigurations'>
    {
      @watch('columns')
      updateRowSpanningConfigurations() {
        this.table.setRowSpanningConfigurations(this.table.getRowSpanConf());
        this.table.updateRowSpanning();
      }
      getRowSpanningConfigurationsOptions() {
        return {};
      }
    }
    return Mixin;
  }
);
