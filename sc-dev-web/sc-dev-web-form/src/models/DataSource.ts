import { v4 } from 'uuid';
import { cloneProperties } from '../shared/utils.js';

export class DataSource {
  id: string = v4();
  type: string;
  apiType?: string;
  name: string;
  apiNameSpace: string;
  apiNameSpaceId: string;
  apiNameSpaceName?: string;
  apiNameSpaceLabel?: string;
  apiQueryName: string;
  apiQueryNameLabel?: string;
  apiEndpoint: string;
  apiEndpointSummary: string;
  apiMethod: string;
  apiArguments: [];
  apiFields: [];
  showErrorMessage: boolean;
  errorMessageParameter: string;
  attachments: [];
  parsedData: {
    properties: {
      [key: string]: string
    };
    contents: [];
  };
  parsedDataTab: {
    sheetNo: number;
    sheetName: string;
    sheetDetail: {
      properties: {
        [key: string]: string
      },
      contents: [];
    }}[];

  constructor(type?: string, name?: string) {
    if (!type) return this;
    this.type = type;
    if (!name) return this;
    this.name = name;
  }

  static from(target: any) {
    const obj = { ...target };
    if (!obj) return new DataSource();

    if (!obj.apiNameSpaceName) {
      obj.apiNameSpaceName = obj.apiNameSpace || obj.apiNameSpaceId;
    }

    if (!obj.apiNameSpaceLabel) {
      obj.apiNameSpaceLabel = '';
    }

    if (!obj.apiQueryNameLabel) {
      obj.apiQueryNameLabel = obj.apiEndpointSummary || obj.apiQueryName;
    }

    if (obj.type === 'api-process') {
      obj.type = 'api';
      obj.apiType = obj.apiType || 'process';
    }

    const newInstance = new DataSource(obj.type, obj.name);
    cloneProperties(newInstance, obj);
    return newInstance;
  }

}
