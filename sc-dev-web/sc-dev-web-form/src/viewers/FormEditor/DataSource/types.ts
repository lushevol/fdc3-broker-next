export type ParameterType = {
  value: string;
  type: string;
  in?: string;
}

export type ParsedDataType = {
  properties: PropertyItemType;
  contents: any[]
}

export type ParsedSheetDataType = {
  sheetNo: number;
  sheetName: string;
  sheetDetail: ParsedDataType;
}

export type PropertyItemType = {
  [key: string]: string;
 }