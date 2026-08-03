import { html, css, nothing, PropertyValueMap } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { BaseEditor } from '../../common/BaseEditor.js';
import TableStyle from './Table.style.js';
import { OptionConfig } from '../../../../models/OptionConfig.js';
import { state } from 'lit/decorators.js';
import './TableEditorConfig.js';
import { generateDynamicDate, isValidFormat } from '../../../../shared/utils.js';

export class TableEditor extends BaseEditor {

  static styles = css`
    ${BaseEditor.styles}
    ${TableStyle}
  `;
  // @ts-ignore
  @state() _optionConfig: OptionConfig = {};
  @state() showModal = false;
  @state() columnConfigUpdateStep = '';
  @state() _columnOptionConfig:any = {};
  @state() ColumnHeaderRepeated:any = false;
  @state() _tableRequired = false;

  willUpdate() {
    const { optionConfig } = this.component.template;
    if (optionConfig) {
      this._optionConfig = optionConfig;
    }
  }

  updateOptionConfig(value: any, key: string) {
    // @ts-ignore
    this._optionConfig[key] = value;
    this.onChange(this._optionConfig, 'optionConfig');
    this.requestUpdate();
  }

  renderBehavior: any = () => {
    const { required, disabled, readonly, compact, flex } = this.component?.template ?? {};
    return html`
      <div>
        <div class=w-half>
          <sc-switch
            label="Required"
            ?checked=${required}
            @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'required')}
          >
          </sc-switch>
        </div>
        <div class=w-half>
          <sc-switch
            label="Disabled"
            ?checked=${disabled}
            @sc-change=${(e: CustomEvent) => {
              this.onChange(e.detail.checked, 'disabled');
              this.requestUpdate();
            }}
          >
          </sc-switch>
        </div>
      </div>
      <div class=w-half>
        <sc-switch
          label="Readonly"
          ?checked=${readonly}
          @sc-change=${(e: CustomEvent) => {
            this.onChange(e.detail.checked, 'readonly');
            this.requestUpdate();
          }}
        >
        </sc-switch>
      </div>
      <div class=w-half>
        <sc-switch
          label=Compact
          ?checked=${compact}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.checked, 'compact')}
        >
        </sc-switch>
      </div>
      <div class=w-half>
        <sc-switch
          label=Flex
          ?checked=${flex}
          @sc-change=${(e: CustomEvent) => {
            this.onChange(e.detail.checked, 'flex');
            this.requestUpdate();
          }}
        >
        </sc-switch>
      </div>
    `;
  };

  renderTableCell(props: any, c: any) {
    const { 
      display, onDataChange, compact, conf,
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
                e.stopPropagation();
                onDataChange(e.detail.value, c.property, props.row.index);
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
                e.stopPropagation();
                onDataChange(e.detail.value, c.property, props.row.index);
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
                e.stopPropagation();
                onDataChange(e.detail.value, c.property, props.row.index); 
              }}
              @mousedown=${(e: MouseEvent) => { e.stopPropagation(); }}
              @click=${(e: MouseEvent) => { e.stopPropagation(); }}
            >
            </sc-employee-input>`
          : currentColumnOptionConfig?.columnType === 'employee-multi-input'
          ? html`
            <sc-employee-multi-input
              hoist
              ?readonly=${currentColumnOptionConfig?.readonly}
              .value=${props.getValue()}
              @sc-select=${(e: CustomEvent) => { 
                e.stopPropagation();
                onDataChange(e.detail.value, c.property, props.row.index); 
              }}
              @mousedown=${(e: MouseEvent) => { e.stopPropagation(); }}
              @click=${(e: MouseEvent) => { e.stopPropagation(); }}
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
              }}
            >
              ${
                currentColumnOptionConfig?.options?.map((option: {label: string; value: string;}) => html`
                <sc-toggle-option value=${option.value}>${option.label}</sc-toggle-option>
              `)}
            </sc-toggle>`
          : html`
            <input 
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
              @input=${(e: MouseEvent) => {
                e.stopPropagation();
                onDataChange((e.target as HTMLInputElement).value, c.property, props.row.index);
              }}
              @mousedown=${(e: MouseEvent) => { e.stopPropagation(); }}
            />`
        }`
      : html`
        <input 
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
          @input=${(e: MouseEvent) => {
            e.stopPropagation();
            onDataChange((e.target as HTMLInputElement).value, c.property, props.row.index);
          }}
          @mousedown=${(e: MouseEvent) => { e.stopPropagation(); }}
        />`
    }`;
  }

  onColumnConfigSave(property: string, index:number) {
    const { onDataChange, data, conf } = this.component.template;
    const _config:any[] = [...conf];
    const changedData = _config?.[index];
    const previousDefaultValue = changedData?.config?.defaultValue;
    if (changedData) {
      changedData['config'] = this._columnOptionConfig;
    } else if (index >= 0) {
      _config[index] = {
        ['config']: this._columnOptionConfig,
      };
    }

    const hasDefaultValueInCurrentConfig =
      this._columnOptionConfig && Object.prototype.hasOwnProperty.call(this._columnOptionConfig, 'defaultValue');
    const nextDefaultValue = this._columnOptionConfig?.defaultValue;
    const defaultValueChanged = previousDefaultValue !== nextDefaultValue;

    if (hasDefaultValueInCurrentConfig && defaultValueChanged) {
      data?.forEach((row: any, rowIndex: number) => {
        const currentValue = row?.[property];
        const isEmptyCell = currentValue === '' || currentValue === undefined || currentValue === null;
        if (isEmptyCell) {
          onDataChange(nextDefaultValue, property, rowIndex);
        }
      });
    }

    this.onChange([..._config], 'conf');
    this.onChange([...data], 'data');
    // if has required column, then set the whole table required
    if (!this.component?.template?.required && _config.some((c: any) => c.config?.required)) {
      this.onChange(true, 'required');
      this._tableRequired = true;
    }
    // if table required turn on by column required, then turn off when no column is required
    if (this._tableRequired && _config.every((c: any) => !c.config?.required)) {
      this.onChange(false, 'required');
      this._tableRequired = false;
    }
    this.columnConfigUpdateStep = '';
  }

  onColumnConfigDelete(property: string, index:number) {
    const { conf, onDataChange, data } = this.component.template;
    this.columnConfigUpdateStep = `delete_${Math.random()}`;
    this._columnOptionConfig = {};
    const _config:any[] = [...conf];
    if (_config[index]) {
      _config[index]['config'] = undefined;
    }
    data?.map((_: any, _index: number) => {
      onDataChange('' , property, _index);
    });
    
    this.onChange(_config, 'conf');
    this.onChange([...data], 'data');
    this.requestUpdate();
  }

  onColumnConfigCancel(index: number) {
    const { conf = [] } = this.component.template;
    this.columnConfigUpdateStep = `cancel_${Math.random()}`;
    this._columnOptionConfig = conf?.[index]?.config ? JSON.parse(JSON.stringify(conf[index].config)) : {};
    this.requestUpdate();
  }

  renderOtherGeneral = () => {
    const { 
      display, pinnedHeaders, pageSize, conf = [], data = [{}], helpText, tooltip, 
      addColumn, addRow, deleteRow, deleteColumn, onHeaderChange, onDataChange, columnHeaderRepeated, compact, flex,
    } = this.component.template;
    const isCompactMode = display?.includes('compact') || compact;
    const _conf = conf.map((c: any, index: number) => {
      if (pinnedHeaders?.includes('row') && index === 0) {
        c.pinned = 'left';
      }
      const _config = conf?.[index]?.['config'];
      const parsedWidth = Number(_config?.width);
      const hasCustomWidth = Number.isFinite(parsedWidth) && parsedWidth > 0;
      const columnWidth = hasCustomWidth ? parsedWidth : 150;
      const { flex: _legacyFlex, ...columnWithoutLegacyFlex } = c;
      return {
        ...columnWithoutLegacyFlex,
        header: (property: string) => html`
          <div class=header-container style='display: flex; align-items: center; min-width: 0; gap: 0.25rem;' @click=${(e:any)=>{ e.stopPropagation(); }}>
            <input 
              part=header-input
              style='
                height: ${isCompactMode ? 'auto' : '0.875rem'};
                border: none;
                background: transparent;
                min-width: 0;
                outline: none;
                font-family: var(--sc-font-family);
                flex: 1;
                font-size: 0.875rem;
                color: inherit;
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              '
              value=${c.property} 
              placeholder=Input
              @input=${(e: MouseEvent) => {
                e.stopPropagation();
                const value = (e.target as HTMLInputElement).value;
                const propertyKeys = columnHeaderRepeated(value, index);
                if (propertyKeys.length > 0) {
                  this.ColumnHeaderRepeated = true;
                } else {
                  this.ColumnHeaderRepeated = false;
                  onHeaderChange(value, index);
                }
              }}
            />
              ${_config?.required ? html`
                <span style='color: var(--sc-form-group-label-required-color, var(--sc-color-red-500)); margin-top: 0.375rem; margin-right: 0.25rem;'>*</span>
              ` : nothing}
              <sc-tooltip
                class=${`manual_${index} manual-tooltip`}
                style='display: flex; flex-shrink: 0;'
                placement=bottom
                mode=light
                distance=10
                content-max-width='30rem'
              >
                <sc-icon
                  part=header-edit-icon
                  style='margin-right: 0.3rem; flex-shrink: 0;'
                  name=edit-alt--fill
                ></sc-icon>
                <div slot="content">
                  <sc-scrollbar selector=".scrollable-content" no-x></sc-scrollbar>
                  <div class="scrollable-content" style="max-height: 50vh; overflow-y: auto; padding: 0 0.5rem 0.25rem;">
                    <table-editor-config
                      .configUpdateStep=${this.columnConfigUpdateStep}
                      .columnOptionConfig=${_config ? JSON.parse(JSON.stringify(_config)) : {}}
                      @value-changed=${(event: CustomEvent) => {
                        this._columnOptionConfig = event.detail.value;
                      }}
                      @sl-hide=${(event: CustomEvent)=>event.stopImmediatePropagation()}
                      @sl-after-hide=${(event: CustomEvent)=>event.stopImmediatePropagation()}
                    ></table-editor-config>
                    <div class=footer-button style="display:flex; gap: 0.5rem; padding-top:0.625rem; ">
                      <sc-button 
                        ?disabled=${conf.length === 1}
                        size=sm state="error" 
                        @mousedown=${(e: MouseEvent)=> {
                          const newColumns = deleteColumn(index);
                          this.onChange(newColumns, 'conf');
                          this.requestUpdate();
                        }} width=6.25rem>Delete</sc-button>
                      <sc-button size=sm type=secondary 
                        @mousedown=${(e: MouseEvent)=> { 
                          e.stopPropagation();
                          this.onColumnConfigCancel(index);
                        }} width=6.25rem>Cancel</sc-button>
                      <sc-button 
                        size=sm  
                        @mousedown=${(e: MouseEvent)=> {
                          this.onColumnConfigSave(c.property, index); 
                          this.requestUpdate();
                        }} width=6.25rem>Save</sc-button>
                    </div>
                  </div>
                </div>
              </sc-tooltip>
          </div>
        `,
        ...((!flex || hasCustomWidth) ? { size: columnWidth } : {}),
        columnStyle: !flex
          ? `min-width: ${columnWidth}px; max-width: ${columnWidth}px`
          : hasCustomWidth
            ? `width: ${columnWidth}px; min-width: ${columnWidth}px; max-width: ${columnWidth}px`
            : 'min-width: 9.375rem',
        cell: (props: any) => html`
          <div class=cell-container style='display: flex' @click=${(e:any)=>{ e.stopPropagation(); }}>
          ${ this.renderTableCell(props, c) }
          </div>`,
      };
    });
    _conf.push({
      property: 'actions',
      header: () => html`<sc-link @click=${(e: MouseEvent) => { 
        e.stopPropagation();
        const newColumns = addColumn(); 
        const _index = newColumns.length - 1;
        data?.map((_: any, index: number) => {
          onDataChange('', newColumns[_index]?.property, index);
        });
        this.onChange(newColumns, 'conf'); 
        this.requestUpdate(); 
      }}>+ Add column</sc-link>`,
      cell: (props: any) => html`
        <span>
          <sc-icon
            name=plus-circle--line
            size=${isCompactMode ? 'sm' : 'md'}
            style='color: var(--sc-color-blue-500); cursor: pointer'
            @click=${(e: MouseEvent) => {
              e.stopPropagation();
              const newRows = addRow();
              this.onChange(newRows, 'data');
              this.requestUpdate();
            }}
          ></sc-icon>
          ${props.row.index === 0 ? nothing : html`<sc-icon
            name=minus-circle--line 
            size=${isCompactMode ? 'sm' : 'md'}
            style='color: var(--sc-color-red-500); margin-left: 0.5rem; cursor: pointer'
            @click=${(e: MouseEvent) => {
              e.stopPropagation();
              const newRows = deleteRow(props.row.index);
              this.onChange(newRows, 'data');
              this.requestUpdate();
            }}
          ></sc-icon>`}
        </span>
      `,
    });
    return html`
      <div class=row>
        <sc-text-input
          label="Tooltip"
          value=${tooltip}
          @sc-input=${(e: CustomEvent) => this.onChange(e.detail.value, 'tooltip')}
        >
        </sc-text-input>
      </div>
      <div class=row>
        <sc-label label='Description'></sc-label>
        <sc-rich-text-editor-v2
          .toolbar=${this.simpleToolbars}
          value=${helpText}
          @sc-change=${(e: CustomEvent) => {
    this.onChange(e.detail.text, 'helpText');
    this.requestUpdate();
  }}
        >
        </sc-rich-text-editor-v2>
      </div>
      <div class=row>
        <sc-checkbox-group
          label="Display"
          .value=${display}
          @sc-change=${
            (e: CustomEvent) => {
              this.onChange(e.detail.value, 'display');
              this.requestUpdate();
            }}
        >
          <sc-checkbox value=addAndDelete>Add and delete row</sc-checkbox>
          <sc-checkbox value=multiSelect>Multiple row select</sc-checkbox>
        </sc-checkbox-group>
      </div>
      
      <!-- <div class=row>
        <sc-number-input
          label="Page size"
          value=${pageSize}
          @sc-change=${
  (e: CustomEvent) => this.onChange(e.detail.value, 'pageSize')
}
        >
        </sc-number-input>
      </div> -->
      <div class=row>
      <sc-button compact no-border
        type="link" 
        size="sm" 
        width="auto" 
        left-icon="settings--line"
        @click=${() => this.showModal = true }
      > Configure </sc-button>
      ${
        this.showModal 
        ? html`
          <style>
          .modal-container{
            min-height: 22rem;  
          }
          </style>
            <sc-modal size=lg open=${this.showModal} 
              @sc-hide=${() => { this.showModal = false; }} 
              disable-outside-click
              header="Edit table details">
              <div class=modal-container>
                ${
                  this.ColumnHeaderRepeated ? html`
                  <sc-alert type="error" mode="banner" open>  
                    <div slot="title">
                      <sc-icon name="alert-circle--line" size="sm"></sc-icon> Column names cannot be repeated
                    </div>  
                  </sc-alert>` : nothing
                }
                  ${keyed(JSON.stringify({ flex, display, widths: conf?.map((item: any) => item?.config?.width) }), html`<sc-data-grid
                    dynamic-column-width
                    ?disable-flexible-column-width=${!flex}
                    .columns=${_conf}
                    .data=${data}
                    class=${isCompactMode ? 'compact' : ''}
                    ?compact=${isCompactMode}
                    page-size=${pageSize}
                    @blur=${()=>{
                      this.requestUpdate();
                    }}
                    ?sticky-header=${pinnedHeaders?.includes('column')}
                    ?row-selection=${display?.includes('multiSelect')}
                  >
                  </sc-data-grid>`)}
              </div>
            </sc-modal>`
        : nothing
      }
      </div>
    `;
  };

  renderPrefillAnswer: any = () => {
    const { conf = [] } = this.component.template;
    return html`
      <div class="options-container">
        <data-source-selector-for-option 
          .conf=${conf}
          config=${JSON.stringify(this._optionConfig)}
          component=${JSON.stringify(this.component)}
          @config-updated=${(event: CustomEvent) => this.updateOptionConfig(event.detail.value, event.detail.key)}
        >
        </data-source-selector-for-option>
      </div>
    `;
  };

  renderStyleAndLayout = () => {
    const { labelSize, pinnedHeaders } = this.component.template;
    return html`
    <div class=row>
        <sc-checkbox 
          ?checked=${pinnedHeaders === 'row'}
          @sc-change=${(e: CustomEvent) => {
    if (e.detail.checked) {
      this.onChange('row', 'pinnedHeaders');
    } else {
      this.onChange('', 'pinnedHeaders');
    }
  }}
        >
          Row header
        </sc-checkbox>
      </div>
      <div class=row>
        <sc-radio-group
          columns=3
          direction=horizontal
          label="Label size"
          value=${labelSize}
          @sc-change=${(e: CustomEvent) => this.onChange(e.detail.value, 'labelSize')}
        >
          <sc-radio value=sm>SM</sc-radio>
          <sc-radio value=md>MD</sc-radio>
          <sc-radio value=lg>LG</sc-radio>
        </sc-radio-group>
      </div>
    `;
  };
  renderBasicComponent = () => {
    return html`
      <form-table .component=${this.component} .key=${this.key}>
      </form-table>
    `;
  };
}