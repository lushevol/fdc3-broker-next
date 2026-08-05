import { html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { safeMixin, TConstructor } from '../../../../../shared/mixin.js';
import { TableStateMixin } from '../../table-state-mixin.js';
import { Feature } from '../../../types/Feature.js';
import { storybook } from '../../../../../shared/storybook.decorators.js';
import { DataExportConfiguration, DataExportTMixin } from './types.js';
import { DataProcessor } from './data-processor.js';
import { CsvExporter } from './csv-exporter.js';
import { ExcelExporterInstance } from './excel-exporter.js';

export const DataExportMixin = safeMixin(
    <T extends TConstructor<LitElement>>(
      superClass: T
    ): TConstructor<DataExportTMixin> & T => {
      class Mixin
        extends TableStateMixin(superClass)
        implements Feature<'dataExport'> {

        @storybook('boolean', {
          description: 'Set to enable data export feature',
          defaultValue: false,
        })
        @property({ type: Boolean, attribute: 'enable-export', reflect: true })
        enableExport = false;

        @storybook('boolean', {
          description: 'Set to disable Excel data export feature',
          defaultValue: false,
        })
        @property({ type: Boolean, attribute: 'disable-excel-export', reflect: true })
        disableExcelExport = false;

        @storybook('boolean', {
          description: 'Set to disable CSV data export feature',
          defaultValue: false,
        })
        @property({ type: Boolean, attribute: 'disable-csv-export', reflect: true })
        disableCsvExport = false;

        @query('slot[name="data-export"]')
        _dataExportSlot?: HTMLSlotElement;

        connectedCallback() {
          super.connectedCallback();
          requestAnimationFrame(() => {
            this._dataExportSlot?.addEventListener('click', this._onExportButtonClick as EventListener);
          });
        }

        disconnectedCallback() {
          super.disconnectedCallback?.();
          this._dataExportSlot?.removeEventListener('click', this._onExportButtonClick as EventListener);
        }

        private _onExportButtonClick = async (event: Event) => {
          const exportElement = (event.composedPath() as HTMLElement[]).find(
            el => el instanceof HTMLElement && (el as any).dataExportOptions
          ) as HTMLElement | undefined;

          if (!exportElement || !this._dataExportSlot) return;

          const assigned = this._dataExportSlot.assignedElements({ flatten: true });
          const isValidElement = assigned.includes(exportElement) ||
                                assigned.some(parent => parent.contains(exportElement));

          if (!isValidElement) return;

          const config = (exportElement as any).dataExportOptions;
          if (!config) {
            console.error('Data export element missing dataExportOptions property');
            return;
          }

          await this.exportData(config);
        };

        async exportData(configuration: DataExportConfiguration): Promise<void> {
          if (!configuration) {
            return Promise.reject('No configuration provided');
          }

          if (configuration.manualExport) {
            return configuration.manualExport();
          }

          const table = this.table;
          if (!table) {
            return Promise.reject('Table not found');
          }

          const rows = DataProcessor.getRowsByModifier(table, configuration.modifier);
          const { fileHeaderIdsSet, header, exportColumns } = DataProcessor.processHeadersAndColumns(
            table,
            configuration,
            this.columns,
            configuration.type === 'xlsx' ? Object.keys(ExcelExporterInstance.handlers) : undefined
          );

          const data = DataProcessor.processDataRows(rows, configuration, table, exportColumns, fileHeaderIdsSet);
          const fileName = configuration.fileName || 'data_export';

          if (configuration.type === 'xlsx') {
            await ExcelExporterInstance.exportToXlsx(fileName, header, data);
          } else {
            await CsvExporter.exportToCsv(fileName, header, data, configuration.csvDelimiter);
          }
        }

        shouldRenderDataExportBar() {
          return this.enableExport && (!this.disableExcelExport || !this.disableCsvExport);
        }

        renderDataExportBar() {
          return html`
            <slot name="data-export">
              <sc-button-dropdown button-text="Export" type="link" left-icon="export"
                                  @sc-select=${(event: any) => {
                                    this.exportData({
                                      type: event.detail.value,
                                      fileName: 'data_export',
                                      respectColumnOrder: true,
                                      respectColumnVisibility: true,
                                    });
                                  }}>
                ${this.disableExcelExport ? nothing : html`
                  <sc-dropdown-option value="xlsx">Export as excel</sc-dropdown-option>`}
                ${this.disableCsvExport ? nothing : html`
                  <sc-dropdown-option value="csv">Export as CSV</sc-dropdown-option>`}
              </sc-button-dropdown>
            </slot>`;
        }

        getDataExportOptions(): Record<string, any> {
          return {};
        }

        updateDataExport(): void {
          // No-op implementation
        }
      }

      return Mixin;
    }
  )
;
