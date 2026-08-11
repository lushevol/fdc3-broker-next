import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { Feature } from '../../types/Feature.js';
import { CellContext } from '@tanstack/lit-table';
import { property } from 'lit/decorators.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { watch } from '../../../../shared/watch.js';

export type TMixin = {
  getCellDataTypeOptions: () => Record<string, any>;
  cellDataTypeDefinitions: Record<
    string,
    (props: CellContext<unknown, unknown>) => any
  >;
};

export const CellDataTypeMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'cellDataType'>
    {
      @storybook('object', {
        description: 'Add more cell data type for cell display',
        defaultValue: {},
      })
      @property({ type: Object })
      cellDataTypeDefinitions: Record<
        string,
        (props: CellContext<unknown, unknown>) => any
      > = {};

      @watch('cellDataTypeDefinitions')
      handleCellDataTypeDefinitionsChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            cellDataTypeDefinitions: this.cellDataTypeDefinitions,
          };
        });
      }

      updateCellDataType() {
        // updateCellDataType
      }
      getCellDataTypeOptions() {
        return {};
      }
    }
    return Mixin;
  }
);
