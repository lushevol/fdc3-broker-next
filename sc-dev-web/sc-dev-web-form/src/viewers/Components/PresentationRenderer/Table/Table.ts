import { html, css, nothing } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { FormBaseViewer } from '../../common/FormBaseViewer.js';
import TableStyle from './Table.style.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { generateDynamicDate, isValidFormat } from '../../../../shared/utils.js';
export class Table extends FormBaseViewer {
 
  static styles = css`
    ${FormBaseViewer.styles}
    ${TableStyle}
  `;

  onValueInput(e: MouseEvent, property: string, index: number) {
    const { value } = (e.target as HTMLInputElement);
    this.template.onDataChange(value, property, index);
    // @ts-ignore
    this.onValueChange(this.template.data, true, true);
  }

  renderTableCell(props: any, c: any) {
    const { 
      display, onDataChange, compact, disabled, data, conf,
    } = this.component.template;
    const isCompactMode = display?.includes('compact') || compact;
    const _index = display?.includes('multiSelect') ? props?.column?.getIndex() - 1 : props?.column?.getIndex();
    const currentColumnOptionConfig = conf?.[_index]?.['config'] || {};
    return html`${
      Object.keys(currentColumnOptionConfig)?.length > 0 
        ? html`
        ${
          currentColumnOptionConfig?.columnType === 'text-field'
          ? html`
            <sc-text-input
              part=input
              style='
                height: ${isCompactMode ? 'auto' : '2rem'};
                border: none;
                background: transparent;
                min-width: 6.25rem;
                outline: none;
                font-family: var(--sc-font-family);
                flex: 1;
                font-size: 1rem;
                color: inherit;
              '
              value=${props.getValue()}
              .maxLength=${currentColumnOptionConfig?.maxLength}
              ?readonly=${currentColumnOptionConfig?.readonly}
              ?max-rows=${!!currentColumnOptionConfig?.readonlyRows && currentColumnOptionConfig?.readonly} 
              readonly-rows=${currentColumnOptionConfig?.readonlyRows}
              rows=${currentColumnOptionConfig?.readonlyRows}
              border-type="box"
              @sc-input=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index);
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
            </sc-text-input>` 
          : currentColumnOptionConfig?.columnType === 'number'
          ? html`
            <sc-number-input
              value=${props.getValue()}
              type=${currentColumnOptionConfig?.maxDecimals ? 'digit' : 'number'}
              max-decimals=${currentColumnOptionConfig?.maxDecimals}
              .max=${currentColumnOptionConfig?.max !== '' ? currentColumnOptionConfig?.max : undefined}
              .min=${currentColumnOptionConfig?.min !== '' ? currentColumnOptionConfig?.min : undefined}
              ?readonly=${currentColumnOptionConfig?.readonly}
              @sc-input=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index);
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
            </sc-number-input>` 
          : currentColumnOptionConfig?.columnType === 'formatted-input'
          ? html`
            <sc-formatted-input
              value=${props.getValue()}
              .format=${currentColumnOptionConfig?.format}
              auto-show-error
              ?readonly=${currentColumnOptionConfig?.readonly}
              @sc-input=${(e: CustomEvent) => {
                onDataChange(isValidFormat(e.detail.value, currentColumnOptionConfig?.format) ? e.detail.value : '', c.property, props.row.index);
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
            </sc-formatted-input>`
          : currentColumnOptionConfig?.columnType === 'date'
          ? html`
            <sc-date-input
              hoist
              value=${props.getValue()}
              min=${currentColumnOptionConfig?.type === 'dynamic'
                ? generateDynamicDate(currentColumnOptionConfig?.dynamicDate?.minValue, currentColumnOptionConfig?.dynamicDate?.minDateType, currentColumnOptionConfig?.dynamicDate?.minDateRule)
                : currentColumnOptionConfig?.min}
              max=${currentColumnOptionConfig?.type === 'dynamic'
                ? generateDynamicDate(currentColumnOptionConfig?.dynamicDate?.maxValue, currentColumnOptionConfig?.dynamicDate?.maxDateType, currentColumnOptionConfig?.dynamicDate?.maxDateRule)
                : currentColumnOptionConfig?.max}
              ?readonly=${currentColumnOptionConfig?.readonly}
              border-type="box"
              format=${currentColumnOptionConfig?.format || 'DD MMM YYYY'}
              @sc-change=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index);
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
            </sc-date-input>`
          : currentColumnOptionConfig?.columnType === 'time'
          ? html`
            <sc-time-input
              hoist
              value=${props.getValue()}
              ?readonly=${currentColumnOptionConfig?.readonly}
              border-type="box"
              @sc-input=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index);
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
            </sc-time-input>`
            : currentColumnOptionConfig?.columnType === 'link'
            ? html`
              <sc-link
                href=${props.getValue()}
                ?disabled=${currentColumnOptionConfig?.disabled}
                target=${currentColumnOptionConfig?.target}
              >
                ${currentColumnOptionConfig?.label}
              </sc-link>`
          : currentColumnOptionConfig?.columnType === 'dropdown-input'
          ? html`
            <sc-dropdown-input
              ?max-rows=${!!currentColumnOptionConfig?.readonlyRows && currentColumnOptionConfig?.readonly} 
              readonly-rows=${currentColumnOptionConfig?.readonlyRows}
              rows=${currentColumnOptionConfig?.readonlyRows}
              ?readonly=${currentColumnOptionConfig?.readonly}
              value=${props.getValue()}
              hoist
              @sc-select=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index);
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
              ${
                currentColumnOptionConfig?.options?.map((option: {label: string; value: string;}) => html`<sc-dropdown-option value=${option.value}>${option.label}</sc-dropdown-option>`)
              }
            </sc-dropdown-input>`
          : currentColumnOptionConfig?.columnType === 'dropdown-multi-select'
          ? html`
            <sc-dropdown-multi-select
              hoist 
              ?max-rows=${!!currentColumnOptionConfig?.readonlyRows && currentColumnOptionConfig?.readonly} 
              readonly-rows=${currentColumnOptionConfig?.readonlyRows}
              rows=${currentColumnOptionConfig?.readonlyRows}
              ?readonly=${currentColumnOptionConfig?.readonly}
              value=${props.getValue()}
              @sc-select=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index);
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
              ${
                currentColumnOptionConfig?.options?.map((option: {label: string; value: string;}) => html`<sc-dropdown-option value=${option.value}>${option.label}</sc-dropdown-option>`)
              }
            </sc-dropdown-multi-select>`
          : currentColumnOptionConfig?.columnType === 'employee-input'
          ? html`
            <sc-employee-input
              hoist
              ?readonly=${currentColumnOptionConfig?.readonly}
              .value=${props.getValue()}
              @sc-select=${(e: CustomEvent) => { 
                onDataChange(e.detail.value, c.property, props.row.index); 
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
            </sc-employee-input>`
          : currentColumnOptionConfig?.columnType === 'employee-multi-input'
          ? html`
            <sc-employee-multi-input
              hoist
              ?readonly=${currentColumnOptionConfig?.readonly}
              .value=${props.getValue()}
              @sc-select=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index); 
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
            </sc-employee-multi-input>`
          : currentColumnOptionConfig?.columnType === 'toggle'
          ? html`
            <sc-toggle
              label=${currentColumnOptionConfig?.label}
              size=xxs
              ?readonly=${currentColumnOptionConfig?.readonly}
              value=${props.getValue()}
              @sc-select=${(e: CustomEvent) => {
                onDataChange(e.detail.value, c.property, props.row.index); 
                // @ts-ignore
                this.onValueChange(data, true, true);
              }}
            >
              ${
                currentColumnOptionConfig?.options?.map((option: {label: string; value: string;}) => html`
                <sc-toggle-option value=${option.value}>${option.label}</sc-toggle-option>
              `)}
            </sc-toggle>`
          : html`
            <input 
              ?disabled=${disabled}
              part=input
              style='
                height: ${isCompactMode ? 'auto' : '2rem'};
                border: none;
                background: transparent;
                min-width: 6.25rem;
                outline: none;
                font-family: var(--sc-font-family);
                flex: 1;
                font-size: 1rem;
                color: inherit;
              ' 
              value=${props.getValue()} 
              placeholder=Input
              @blur=${
                (e: MouseEvent) => this.onBlur({
                  value: (e.target as HTMLInputElement).value,
                  property: c.property,
                  index: props.row.index,
                })
              }
              @input=${(e: MouseEvent) => this.onValueInput(e, c.property, props.row.index)} 
            />`
        }`
      : html`
        <input 
          ?disabled=${disabled}
          part=input
          style='
            height: ${isCompactMode ? 'auto' : '2rem'};
            border: none;
            background: transparent;
            min-width: 6.25rem;
            outline: none;
            font-family: var(--sc-font-family);
            flex: 1;
            font-size: 1rem;
            color: inherit;
          ' 
          value=${props.getValue()} 
          placeholder=Input
          @blur=${
            (e: MouseEvent) => this.onBlur({
              value: (e.target as HTMLInputElement).value,
              property: c.property,
              index: props.row.index,
            })
          }
          @input=${(e: MouseEvent) => this.onValueInput(e, c.property, props.row.index)} 
        />`
    }`;
  }
  renderElement() {
    const { 
      data = [{}],
      options = [{}], 
      pinnedHeaders, 
      readonly, 
      label, 
      labelSize, 
      conf = [], 
      pageSize, 
      required, 
      display, 
      addRow, 
      deleteRow, 
      tooltip, 
      helpText, 
      compact,
      disabled,
      flex,
     } = this.template;
    const isCompactMode = display?.includes('compact') || compact;
    const dataLength = Array.isArray(data) ? data.length : 0;
    const _conf = conf.map((c: any, index: number) => {
      if (pinnedHeaders?.includes('row') && index === 0) {
        c.pinned = 'left';
      } else {
        delete c['pinned'];
      }
      const parsedWidth = Number(c?.config?.width);
      const hasCustomWidth = Number.isFinite(parsedWidth) && parsedWidth > 0;
      const columnWidth = hasCustomWidth ? parsedWidth : 150;
      const { flex: _legacyFlex, ...columnWithoutLegacyFlex } = c;
      return {
        ...columnWithoutLegacyFlex,
        ...((!flex || hasCustomWidth) ? { size: columnWidth } : {}),
        columnStyle: !flex
          ? `min-width: ${columnWidth}px; max-width: ${columnWidth}px`
          : hasCustomWidth
            ? `width: ${columnWidth}px; min-width: ${columnWidth}px; max-width: ${columnWidth}px`
            : 'min-width: 9.375rem',
        header: c?.config?.required
          ? html`${c.header} <span style='color: var(--sc-form-group-label-required-color, var(--sc-color-red-500)); margin-left: 0.25rem;'>*</span>`
          : html`${c.header}`,
        cell: (props: any) =>  readonly || this.readonly ? 
          props.getValue() :
          html`
            <div part=cell-container>
            ${
              keyed(dataLength, this.renderTableCell(props, c))
            }
            </div>
          `,
      };
    });
    if (display && display.includes('addAndDelete') && (!readonly && !this.readonly)) {
      _conf.push({
        property: 'actions',
        header: 'Actions',
        cell: (props: any) => html`
          <span>
            <sc-icon
              name=plus-circle--line
              size=${isCompactMode ? 'sm' : 'md'} 
              style='color: var(--sc-color-blue-500); cursor: pointer'
              @click=${() => {
                if (disabled) return;
                const data = addRow();
                if (this.onValueChange) {
                  // @ts-ignore
                  this.onValueChange(data, true, true);
                }
                this.requestUpdate();
              }}
            ></sc-icon>
            ${props.row.index === 0 ? nothing : html`
              <sc-icon
                name=minus-circle--line 
                size=${isCompactMode ? 'sm' : 'md'} 
                style='color: var(--sc-color-red-500); margin-left: 0.5rem; cursor: pointer'
                @click=${() => {
                  if (disabled) return;
                  const data = deleteRow(props.row.index);
                  if (this.onValueChange) {
                    // @ts-ignore
                    this.onValueChange(data, true, true);
                  }
                  this.requestUpdate();
                }}
              ></sc-icon>`
}
          </span>
        `,
      });
    }
    return html`
      <sc-label
        label=${label}
        label-size=${labelSize}
        tooltip=${tooltip}
        ?required=${required}
      ></sc-label>
      ${keyed(`${JSON.stringify({ display, flex, widths: conf?.map((item: any) => item?.config?.width) })}-${dataLength}`, html`<sc-data-grid
        .columns=${_conf}
        .data=${data}
        class=${isCompactMode ? 'compact' : ''}
        ?compact=${isCompactMode}
        page-size=${pageSize}
        @blur=${this.requestUpdate}
        @sc-select=${(e: CustomEvent) => this.onValueSelect(e.detail)}
        ?row-selection=${(!readonly && !this.readonly && !disabled) && display?.includes('multiSelect')}
        dynamic-column-width
        ?disable-flexible-column-width=${!flex}
      >
      </sc-data-grid>`)}
      <sc-label>
        <div slot="label" >
          <div class="sc-label-wrapper">
            <div class="sc-label-text" style='font-size: 0.625rem'>${ unsafeHTML(helpText) }</div>
          </div>
        </div>
      </sc-label>

      <sc-label>
        <div slot="label" >
          <div class="sc-label-wrapper">
            <div class="sc-label-text error-message">${ this.errorMessage }</div>
          </div>
        </div>
      </sc-label>
    `;
  }
 
}