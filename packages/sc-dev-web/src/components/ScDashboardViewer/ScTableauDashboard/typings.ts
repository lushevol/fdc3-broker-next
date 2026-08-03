export type TableauReportFilter = { field: string; value: string | string[] };
export type TableauReportParameter = { name: string; value: string };
export type TableauReportCustomParameter = { name: string; value: string };

export enum TableauFilterUpdateType {
  Add = 'add',
  All = 'all',
  Replace = 'replace',
  Remove = 'remove'
}
