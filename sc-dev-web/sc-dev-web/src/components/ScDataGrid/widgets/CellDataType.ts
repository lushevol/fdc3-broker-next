import { CellContext, flexRender } from '@tanstack/lit-table';
import { html } from 'lit';
import dayjs from 'dayjs/esm/index.js';

import '../../../../elements/sc-number-input.js';
import '../../../../elements/sc-text-input.js';
import '../../../../elements/sc-date-picker.js';
import '../../../../elements/sc-checkbox.js';

export enum E_CELL_DATA_TYPE {
  number = 'number',
  boolean = 'boolean',
  text = 'text',
  date = 'date',
  default = 'default',
}

export const defaultCellDataTypeDefinitions: Record<
  string,
  (props: CellContext<unknown, unknown>) => any
> = {
  [E_CELL_DATA_TYPE.number]: (props: CellContext<unknown, unknown>) => {
    return props.cell.getValue();
  },
  [E_CELL_DATA_TYPE.boolean]: (props: CellContext<unknown, unknown>) => {
    return html` <sc-data-grid-selection-cell
      ?checked=${Boolean(props.cell.getValue())}
      a11y-label=${String(props.cell.getValue())}
    >
    </sc-data-grid-selection-cell>`;
  },
  [E_CELL_DATA_TYPE.text]: (props: CellContext<unknown, unknown>) => {
    return props.cell.getValue();
  },
  [E_CELL_DATA_TYPE.date]: (props: CellContext<unknown, unknown>) => {
    const value = props.cell.getValue() as any;
    return value ? dayjs(value).format('DD MMM YYYY') : '';
  },
  [E_CELL_DATA_TYPE.default]: (props: CellContext<unknown, unknown>) => {
    return flexRender(
      props.cell.column.columnDef.cell,
      props.cell.getContext()
    );
  },
};

export const defaultCellEditingDefinitions: Record<
  string,
  (
    props: CellContext<unknown, unknown>,
    sendValue: (updatedVal: any) => void
  ) => any
> = {
  [E_CELL_DATA_TYPE.number]: (props, sendValue) => {
    return html` <sc-number-input
      clearable
      class="sc-data-grid-built-in-edit-element"
      .value=${props.cell.getValue()}
      border-type="box"
      size="md"
      @sc-input=${(e: CustomEvent) => {
        sendValue(e.detail.value);
      }}
      @sc-clear=${() => {
        sendValue(0);
      }}
    >
    </sc-number-input>`;
  },
  [E_CELL_DATA_TYPE.boolean]: (props, sendValue) => {
    return html`<sc-checkbox
      ?checked=${Boolean(props.cell.getValue())}
      @sc-change=${(e: CustomEvent) => {
        sendValue(e.detail.checked);
      }}
    >
      <span class="sc-data-grid-a11y-only"
        >${String(props.cell.getValue())}</span
      >
    </sc-checkbox>`;
  },
  [E_CELL_DATA_TYPE.text]: (props, sendValue) => {
    return html` <sc-text-input
      clearable
      class="sc-data-grid-built-in-edit-element"
      .value=${props.cell.getValue()}
      size="md"
      text-align="left"
      @sc-input=${(e: CustomEvent) => {
        sendValue(e.detail.value);
      }}
      @sc-clear=${() => {
        sendValue('');
      }}
    >
    </sc-text-input>`;
  },
  [E_CELL_DATA_TYPE.date]: (props, sendValue) => {
    return html` <sc-date-input
      clearable
      @sc-select=${(e: CustomEvent) => e.stopPropagation()}
      @sc-change=${(e: CustomEvent) => {
        e.stopPropagation();
        sendValue(e.detail.value);
      }}
      @sc-clear=${(e: CustomEvent) => {
        e.stopPropagation();
        sendValue('');
      }}
      .value=${props.cell.getValue()}
      size="md"
    >
    </sc-date-input>`;
  },
  [E_CELL_DATA_TYPE.default]: (props, sendValue) => {
    return html` <sc-text-input
      clearable
      class="sc-data-grid-built-in-edit-element"
      .value=${props.cell.getValue()}
      size="md"
      text-align="left"
      @sc-input=${(e: CustomEvent) => {
        sendValue(e.detail.value);
      }}
      @sc-clear=${() => {
        sendValue('');
      }}
    >
    </sc-text-input>`;
  },
};
