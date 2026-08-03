import { Row } from '@tanstack/lit-table';

export type DataModifier =
  | 'filtered'
  | 'sorted'
  | 'pre-paginated'
  | 'paginated'
  | 'core'
  | 'grouped'
  | 'expanded'
  | 'faceted'
  | 'all';

export type DataExportConfigurationBase = {
  modifier?: DataModifier;
  fileName?: string;
  dataFilter?: (record: Record<string, any>) => boolean;
  rowFilter?: (row: Row<any>) => boolean;
  dataMapper?: (record: Record<string, any>) => Record<string, any>;
  headers?: Record<string, string>;
  respectColumnOrder?: boolean;
  respectColumnVisibility?: boolean;
  manualExport?: () => Promise<void>;
};

export type DataExportConfigurationCsv = {
  type: 'csv';
  csvDelimiter?: string;
} & DataExportConfigurationBase;

export type DataExportConfigurationXlsx = {
  type: 'xlsx';
} & DataExportConfigurationBase;

export type DataExportConfiguration = DataExportConfigurationCsv | DataExportConfigurationXlsx;

export type DataExportTMixin = {
  enableExport: boolean;
  disableExcelExport: boolean;
  disableCsvExport: boolean;
  exportData(configuration: DataExportConfiguration): Promise<void>;
  renderDataExportBar: () => unknown;
  shouldRenderDataExportBar: () => boolean;
};
