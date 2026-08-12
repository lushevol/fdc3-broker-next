/// <reference types="react-scripts" />

declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare let ratanConfig: any;

declare let fin: any;

interface Window {
  fin: {
    InterApplicationBus: any;
    Platform?: any;
    System: any;
  };
  openPortal: Function;
  portalClient: any;
}

declare interface MapType {
  [key: string]: any;
}

declare interface ActionType {
  type: string;
  data: any;
}

declare interface Filter {
  field: string;
  operator: string;
  values: any;
  label?: string;
}

declare interface CascaderFilter {
  field: string[];
  operator: string;
  values: any;
  name: string;
}

declare interface ActionType {
  type: string;
  data: any;
}

declare interface NostroSSI {
  id: string;
  createdAt: string;
  updatedAt: string;
  legalEntity: string;
  legalEntityFmid: string;
  settlementCurrency: string;
  ebbsNostroAccount: string;
  settlementMeans: string;
  settlementAccount: string;
  sendersCorrespondent53Swift: string;
  sendersCorrespondent53Fullname: string;
  sendersCorrespondent53Address: string;
  sendersCorrespondent53City: string;
  sendersCorrespondent53Postcode: string;
  sendersCorrespondent53Account: string;
  noticeToReceive: string;
}

declare module "flat";

interface ManyInOneConfig {
  label: string;
  field: string;
  disabled?: boolean;
  component: string;
  valueList?: string[] | { label: string; value: string }[];
  searchFun?: string;
  searchField?: string;
  selectMode?: string;
  placeholder?: string;
  disableLabel?: boolean;
}
interface QuickSearchItemConfig {
  label: string;
  field: string;
  disabled?: boolean;
  disableLabel?: boolean;
  component: string;
  valueList?: string[] | { label: string; value: string }[];
  searchFun?: string;
  searchField?: string;
  selectMode?: string;
  placeholder?: string;
  manyInOne?: ManyInOneConfig[];
  suffix?: string;
  commas?: boolean;
  searching?: boolean;
  copyOption?: boolean;
}

interface FieldsType {
  [key: string]: {
    businessTerm?: string;
    displayStyle?: string;
    operators?: string;
    valueList?: string | string[];
    colDefs?: ColDef;
    disabledView?: boolean | string[];
    disabledFilter?: boolean | string[];
    detailsFixed?: boolean;
    detailsGroup?: string;
    dynamicList?: boolean;
    context?: string;
    index?: number;
  };
}
