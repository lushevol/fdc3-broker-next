declare module "*.html" {
  const rawHtmlFile: string;
  export = rawHtmlFile;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

interface GraphqlFilterProps {
  field: string;
  operator: string;
  values: string | string[];
}

interface CashflowDetailsDialogProps {
  isOpen: boolean;
  details: any;
  onClose: Function;
  onQueryCashflow: (cashflowIds: string[], isPass?: boolean) => void;
  onOpenTradeDetails?: () => Promise<void>;
  defaultActiveKey: string;
  refreshCashflow?: () => Promise<any>;
  hasNecessaryData?: boolean;
  inside?: boolean;
}
