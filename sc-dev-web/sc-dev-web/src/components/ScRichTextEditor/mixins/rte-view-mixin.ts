import {
  COLUMN_OPERATORS,
  E_OPERATORS,
  ROW_OPERATORS,
  SIZE_OPERATORS,
} from '../constant.js';
import { safeMixin, TConstructor } from '../../../shared/mixin.js';
import { LitElement } from 'lit';

type TRteView = {
  placeholder: string;
  operatorAction(command: E_OPERATORS): void;
  finalizeOperators(
    operators: {
      icon: string;
      actionType: E_OPERATORS;
      desc: string;
    }[]
  ): {
    icon: string;
    desc: string;
    action: () => void;
  }[];
  tableOperatorsOpts: (
    | {
        icon: string;
        action: () => void;
        operators?: undefined;
      }
    | {
        icon: string;
        operators: {
          icon: string;
          desc: string;
          action: () => void;
        }[];
        action?: undefined;
      }
  )[];
};

export const RteViewMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TRteView> & T => {
    class RteViewMixin extends superClass {
      placeholder = '<p><br /></p>';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      operatorAction(command: E_OPERATORS) {}
      finalizeOperators(
        operators: { icon: string; actionType: E_OPERATORS; desc: string }[]
      ) {
        return operators.map(operator => ({
          icon: operator.icon,
          desc: operator.desc,
          action: () => {
            this.operatorAction(operator.actionType);
          },
        }));
      }
      tableOperatorsOpts = [
        {
          icon: 'table-header',
          action: () => {
            this.operatorAction(E_OPERATORS['toggle-header']);
          },
        },
        {
          icon: 'row-operator',
          operators: this.finalizeOperators(ROW_OPERATORS),
        },
        {
          icon: 'columns-operator',
          operators: this.finalizeOperators(COLUMN_OPERATORS),
        },
        {
          icon: 'table-size',
          operators: this.finalizeOperators(SIZE_OPERATORS),
        },
      ];
      content!: HTMLDivElement;
    }
    return RteViewMixin;
  }
);
