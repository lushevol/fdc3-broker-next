export const FormMixin = (label: string) => {
  return class {
    label: string = label;
    labelSize: string;
    required: boolean;
    readonly: boolean;
    disabled: boolean;
    placeholder: string;
    value: any;
    hidden: boolean;
  };
};