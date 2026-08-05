
interface ComponentNamesTypes {
  [key: string]: string;
}

export const ComponentNames: ComponentNamesTypes = {
  TEXTFIELD: 'text-field',
  NUMBERINPUT: 'number-input',
  BUTTON: 'button',
  PASSWORDINPUT: 'password-input',
  TIMEINPUT: 'time-input',
  DATEINPUT: 'date-input',
  FILEINPUT: 'file-input',
  DATERANGEINPUT: 'date-range-input',
  RTE: 'rich-text-editor',
  FORMATTEDINPUT: 'formatted-input',
  CARDNUMBERINPUT: 'card-number-input',
  CHECKBOX: 'checkbox',
  RADIOGROUP: 'radio-group',
  DROPDOWNINPUT: 'dropdown-input',
  DROPDOWNMULTISELECT: 'dropdown-multi-select',
  ACCORDION: 'accordion',
  BOX: 'box',
  DYNAMICDISPLAY: 'dynamic-display',
  REPEATER: 'repeater',
  GRID1COLUMN: 'grid-1-column',
  GRID2COLUMNS: 'grid-2-columns',
  GRID3COLUMNS: 'grid-3-columns',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  TABLE: 'table',
  BUTTONGROUP: 'button-group',
  LINK: 'link',
  RATING: 'rating',
  TOGGLE: 'toggle',
  SWITCH: 'switch',
  EMPLOYEEINPUT: 'employee-input',
  EMPLOYEEMULTIINPUT: 'employee-multi-input',
  DATEDISPLAY: 'date-display',
  TABS: 'tabs',
  STEPPER: 'stepper',
  BANNER: 'banner',
  LABEL: 'label',
  TITLE: 'title',
  PARAGRAPH: 'paragraph',
  IMAGE: 'image',
  TAG: 'tag',
  ICON: 'icon',
  CONTENTLOADER: 'content-loader',
  PROGRESSBAR: 'progress-bar',
  SPINNER: 'spinner',
  DATAVIEW: 'data-view',
  DOCUMENTVIEWER: 'document-viewer',
  CAROUSEL: 'carousel',
  COMMENTS: 'comments',
  MODAL: 'modal',
};

export const InputAndSelectionComponentTypes = {
  [ComponentNames.TEXTFIELD]: 'Text Field',
  [ComponentNames.NUMBERINPUT]: 'Number Input',
  [ComponentNames.PASSWORDINPUT]: 'Password Input',
  [ComponentNames.TIMEINPUT]: 'Time Input',
  [ComponentNames.DATEINPUT]: 'Date Input',
  [ComponentNames.DATERANGEINPUT]: 'Date Range Input',
  [ComponentNames.FILEINPUT]: 'File Input',
  [ComponentNames.FORMATTEDINPUT]: 'Formatted Input',
  [ComponentNames.CARDNUMBERINPUT]: 'Card Number Input',
  [ComponentNames.TOGGLE]: 'Toggle',
  [ComponentNames.SWITCH]: 'Switch',
  [ComponentNames.DROPDOWNINPUT]: 'Dropdown Input',
  [ComponentNames.DROPDOWNMULTISELECT]: 'Dropdown Multi Select',
  [ComponentNames.CHECKBOX]: 'Checkbox',
  [ComponentNames.RADIOGROUP]: 'Radio Group',
  [ComponentNames.LABEL]: 'Label',
  [ComponentNames.TITLE]: 'Title',
  [ComponentNames.PARAGRAPH]: 'Paragraph',
  [ComponentNames.DATEDISPLAY]: 'Date display',
  [ComponentNames.CONTENTLOADER]: 'Content Loader',
  [ComponentNames.RTE]: 'Rich Text Editor',
};

export const StatusComponentTypes = {
  [ComponentNames.RATING]: 'Rating',
  [ComponentNames.STEPPER]: 'Stepper',
  [ComponentNames.TAG]: 'Tag',
  [ComponentNames.ICON]: 'Icon',
  [ComponentNames.CONTENTLOADER]: 'Content Loader',
  [ComponentNames.PROGRESSBAR]: 'Progress Bar',
  [ComponentNames.SPINNER]: 'Spinner',
};

export const ContentComponentTypes = {
  [ComponentNames.ACCORDION]: 'Accordion',
  [ComponentNames.BOX]: 'Box',
  [ComponentNames.DYNAMICDISPLAY]: 'Dynamic Display',
  [ComponentNames.EMPLOYEEINPUT]: 'Employee Input',
  [ComponentNames.EMPLOYEEMULTIINPUT]: 'Employee Multi Input',
  [ComponentNames.DATEDISPLAY]: 'Date Display',
  [ComponentNames.BANNER]: 'Banner',
  [ComponentNames.IMAGE]: 'Image',
  [ComponentNames.DOCUMENTVIEWER]: 'Document Viewer',
  [ComponentNames.CAROUSEL]: 'Carousel',
  [ComponentNames.COMMENTS]: 'Comments',
  [ComponentNames.MODAL]: 'Modal',
};

export const LayoutAndOrgComponentTypes = {
  [ComponentNames.TABS]: 'Tabs',
  [ComponentNames.DIVIDER]: 'Divider',
  [ComponentNames.SPACER]: 'Spacer',
  [ComponentNames.GRID1COLUMN]: 'Grid 1 Column',
  [ComponentNames.GRID2COLUMNS]: 'Grid 2 Columns',
  [ComponentNames.GRID3COLUMNS]: 'Grid 3 Columns',
};

export const DataVisualisationComponentTypes = {
  [ComponentNames.TABLE]: 'Table',
  [ComponentNames.DATAVIEW]: 'Data View',
};


export const MenusAndActionTypes = {
  [ComponentNames.BUTTON]: 'Button',
  [ComponentNames.LINK]: 'Link',
  [ComponentNames.BUTTONGROUP]: 'Button Group',
  [ComponentNames.REPEATER]: 'Repeater',
};

export const ComponentTypes = {
  ...InputAndSelectionComponentTypes,
  ...StatusComponentTypes,
  ...ContentComponentTypes,
  ...MenusAndActionTypes,
  ...LayoutAndOrgComponentTypes,
  ...DataVisualisationComponentTypes,
};
