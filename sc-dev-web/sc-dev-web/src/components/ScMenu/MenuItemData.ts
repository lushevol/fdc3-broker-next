import { TemplateResult } from 'lit-html';

export interface MenuItemData {
  title: string;
  description: string;
  category: string;
  value?: any;
  disabled: boolean;
  prefixIcon: TemplateResult;
  suffixIcon: TemplateResult;
  href: string;
  target: string;
  selected?: boolean;
  checked?: boolean;
  elementType?: string;
}