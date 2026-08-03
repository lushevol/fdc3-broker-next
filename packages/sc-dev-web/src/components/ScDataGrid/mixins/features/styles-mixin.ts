import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { Feature } from '../../types/Feature.js';
import { HeaderGroup, Row } from '@tanstack/lit-table';
import { property } from 'lit/decorators.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { StyleInfo } from '../../types/utils.js';


const BorderType = {
  none: 'none',
  vertical: 'vertical',
  horizontal: 'horizontal',
  both: 'both',
} as const;

export type TMixin = {
  getStyleOptions: () => Record<string, any>;
  getRowStyle?: (row: Row<unknown>) => StyleInfo;
  getHeaderStyle?: (header: HeaderGroup<unknown>) => StyleInfo;
  border: keyof typeof BorderType;

};


// provide a api to change cell value. than can update cell and style it.
// expose some common css variable for use to custom in style function
export const StylesMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'style'>
    {
      @storybook('inline-radio', {
        description: 'Set ',
        defaultValue: BorderType.horizontal,
        options: [BorderType.both, BorderType.horizontal, BorderType.vertical, BorderType.none],
      })
      @property({
        type: String,
        attribute: 'border',
        reflect: true,
      })
      border: keyof typeof BorderType = BorderType.horizontal;

      // @storybook('object', {
      //   description: 'Customized style of body rows',
      //   defaultValue: () => {},
      // })
      // @property({ type: Object })
      getRowStyle?: (row: Row<unknown>) => StyleInfo;

      // @storybook('object', {
      //   description: 'Customized style of header rows',
      //   defaultValue: () => {},
      // })
      @property({ type: Object })
      getHeaderStyle?: (header: HeaderGroup<unknown>) => StyleInfo;

      updateStyle() {
        // updateStyle
      }
      getStyleOptions() {
        return {};
      }
    }
    return Mixin;
  }
);
