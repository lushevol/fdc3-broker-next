import { ComponentNames } from './componentTypes.js';

interface ComponentPropertyCategory {
  [key: string]: string;
}

export const PropertyCategories: ComponentPropertyCategory = {
  GENERAL: 'General',
  BEHAVIOR: 'Behavior',
  DATABINDING: 'Data Binding',
  VALIDATION: 'Validation',
  CONDITIONS: 'Conditions',
  ERRORMESSAGE: 'Error message',
  EVENTS: 'Events',
  STYLINGLAYOUT: 'Styling & Layout',
  ADDINTIONALSETTINGS: 'Additional settings',
};

export const CommonPropertyCategories = [
  PropertyCategories.GENERAL,
  PropertyCategories.CONDITIONS,
  PropertyCategories.ADDINTIONALSETTINGS,
];

const BasePropertyCategories = [
  PropertyCategories.GENERAL,
  PropertyCategories.BEHAVIOR,
  PropertyCategories.DATABINDING,
  PropertyCategories.STYLINGLAYOUT,
];

export const PropertiesMapping = {
  [ComponentNames.TEXTFIELD]: [
    ...BasePropertyCategories,
    PropertyCategories.VALIDATION,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.NUMBERINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.VALIDATION,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.PASSWORDINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.TIMEINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DATEINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.VALIDATION,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DATERANGEINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.VALIDATION,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.RTE]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.FILEINPUT]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.VALIDATION,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.FORMATTEDINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.VALIDATION,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.LABEL]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.TITLE]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.PARAGRAPH]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.CARDNUMBERINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.VALIDATION,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.RATING]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.TOGGLE]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.SWITCH]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.CHECKBOX]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.RADIOGROUP]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DROPDOWNINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DROPDOWNMULTISELECT]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.BUTTONGROUP]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.EMPLOYEEINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.EMPLOYEEMULTIINPUT]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DATEDISPLAY]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
  ],
  [ComponentNames.DIVIDER]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.BANNER]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.TAG]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.ICON]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.PROGRESSBAR]: [
    PropertyCategories.GENERAL,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.SPINNER]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.CONTENTLOADER]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.IMAGE]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.SPACER]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.TABLE]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DATAVIEW]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.ACCORDION]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.BOX]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DYNAMICDISPLAY]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.TABS]: [
    PropertyCategories.GENERAL,
    PropertyCategories.DATABINDING,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.STEPPER]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.REPEATER]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.BUTTON]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.LINK]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.GRID1COLUMN]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.GRID2COLUMNS]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.GRID3COLUMNS]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.DOCUMENTVIEWER]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
    PropertyCategories.ADDINTIONALSETTINGS,
  ],
  [ComponentNames.CAROUSEL]: [
    PropertyCategories.GENERAL,
    PropertyCategories.BEHAVIOR,
    PropertyCategories.DATABINDING,
    PropertyCategories.CONDITIONS,
  ],
  [ComponentNames.COMMENTS]: [
    ...BasePropertyCategories,
    PropertyCategories.CONDITIONS,
  ],
  [ComponentNames.MODAL]: [
    PropertyCategories.GENERAL,
    PropertyCategories.STYLINGLAYOUT,
    PropertyCategories.CONDITIONS,
  ],
};
