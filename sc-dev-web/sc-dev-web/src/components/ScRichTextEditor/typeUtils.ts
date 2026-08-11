export enum TStyleKeysOfContext {
  'background-color' = 'background-color',
  'color' = 'color',
  'font-family' = 'font-family',
  'font-size' = 'font-size',
  'text-align' = 'text-align',
  'list-style-type' = 'list-style-type',
  'line-height' = 'line-height',
  'font-bold' = 'font-bold',
  'font-italic' = 'font-italic',
  'font-underline' = 'font-underline',
  'font-subscript' = 'font-subscript',
  'font-superscript' = 'font-superscript',
  'font-strikethrough' = 'font-strikethrough',
  'active-tags' = 'active-tags',
  'max-image-size' = 'max-image-size',
  'is-selection-collapsed' = 'is-selection-collapsed',
}

export type TViewContext = {
  [key in TStyleKeysOfContext]?: key extends 'active-tags'
    ? string[]
    : key extends 'is-selection-collapsed'
    ? boolean
    : string | number;
};

export type returnType<T> = T extends (...args: any[]) => infer R ? R : any;

export type TConfiguration = {
  toolbar: {
    maxImageSize: number;
  };
};
