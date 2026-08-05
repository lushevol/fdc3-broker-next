import { ComponentNames } from './componentTypes.js';

export type OptionType = {
  label: string;
  value: string;
  types: Array<string>;
}

export type Condition = {
  condition?: string;
  rule: string;
  component: string;
  value: Array<string> | string | number;
  type: string;
}

export const conditionOptions = [
  {
    label: 'Equals to',
    value: '===',
    types: [
      ComponentNames.DROPDOWNINPUT,
      ComponentNames.DROPDOWNMULTISELECT,
      ComponentNames.RADIOGROUP,
      ComponentNames.CHECKBOX,
      ComponentNames.TEXTFIELD,
      ComponentNames.NUMBERINPUT,
      ComponentNames.DATEINPUT,
      ComponentNames.DATERANGEINPUT,
      ComponentNames.FORMATTEDINPUT,
      ComponentNames.CARDNUMBERINPUT,
    ],
  },
  {
    label: 'Not equal to',
    value: '!==',
    types: [
      ComponentNames.DROPDOWNINPUT,
      ComponentNames.DROPDOWNMULTISELECT,
      ComponentNames.RADIOGROUP,
      ComponentNames.CHECKBOX,
      ComponentNames.TEXTFIELD,
      ComponentNames.NUMBERINPUT,
      ComponentNames.DATEINPUT,
      ComponentNames.DATERANGEINPUT,
      ComponentNames.FORMATTEDINPUT,
      ComponentNames.CARDNUMBERINPUT,
    ],
  },
  {
    label: 'Greater than',
    value: '>',
    types: [ComponentNames.NUMBERINPUT, ComponentNames.DATEINPUT],
  },
  {
    label: 'Greater than or equal to',
    value: '>=',
    types: [ComponentNames.NUMBERINPUT, ComponentNames.DATEINPUT],
  },
  {
    label: 'Less than',
    value: '<',
    types: [ComponentNames.NUMBERINPUT, ComponentNames.DATEINPUT],
  },
  {
    label: 'Less than or equal to',
    value: '<=',
    types: [ComponentNames.NUMBERINPUT, ComponentNames.DATEINPUT],
  },
  {
    label: 'Contains',
    value: 'isContains',
    types: [
      ComponentNames.TEXTFIELD,
      ComponentNames.CHECKBOX,
      ComponentNames.DROPDOWNMULTISELECT,
    ],
  },
  {
    label: 'Not contain',
    value: 'isNotContains',
    types: [
      ComponentNames.TEXTFIELD,
      ComponentNames.CHECKBOX,
      ComponentNames.DROPDOWNMULTISELECT,
    ],
  },
  {
    label: 'Is empty',
    value: 'isEmpty',
    types: [
      ComponentNames.DROPDOWNINPUT,
      ComponentNames.DROPDOWNMULTISELECT,
      ComponentNames.RADIOGROUP,
      ComponentNames.CHECKBOX,
      ComponentNames.TEXTFIELD,
      ComponentNames.NUMBERINPUT,
      ComponentNames.DATEINPUT,
      ComponentNames.DATERANGEINPUT,
      ComponentNames.FORMATTEDINPUT,
      ComponentNames.CARDNUMBERINPUT,
    ],
  },
  {
    label: 'Not empty',
    value: 'isNotEmpty',
    types: [
      ComponentNames.DROPDOWNINPUT,
      ComponentNames.DROPDOWNMULTISELECT,
      ComponentNames.RADIOGROUP,
      ComponentNames.CHECKBOX,
      ComponentNames.TEXTFIELD,
      ComponentNames.NUMBERINPUT,
      ComponentNames.DATEINPUT,
      ComponentNames.DATERANGEINPUT,
      ComponentNames.FORMATTEDINPUT,
      ComponentNames.CARDNUMBERINPUT,
    ],
  },
];