import { LitElement } from 'lit';
import { ScButtonDropdown } from '../../ScButton/ScButtonDropdown.js';
import { ScDateInput } from '../../ScDatePicker/DateInput/ScDateInput.js';
import { ScDateRangeInput } from '../../ScDatePicker/DateRangeInput/ScDateRangeInput.js';
import { ScDropdownInput } from '../../ScDropdown/ScDropdownInput.js';
import { ScDropdownMultiSelect } from '../../ScDropdown/ScDropdownMultiSelect.js';
import { ScSearchField } from '../../ScSearchField/ScSearchField.js';
import { ScTimeInput } from '../../ScTimeInput/ScTimeInput.js';
import { ScTooltip } from '../../ScTooltip/ScTooltip.js';

/**
 * popup components which need to hack
 */
export enum EPopupComs {
  searchField = 'searchField',
  timeInput = 'timeInput',
  buttonDropdown = 'buttonDropdown',
  dropdown = 'dropdown',
  dropdownMulti = 'dropdownMulti',
  dateInput = 'dateInput',
  dateRange = 'dateRange',
  tooltip = 'tooltip',
  employeeInput = 'employeeInput',
  employeeMultiInput = 'employeeMultiInput',
}

export type TPopupComs = {
  [EPopupComs.searchField]: ScSearchField;
  [EPopupComs.timeInput]: ScTimeInput;
  [EPopupComs.buttonDropdown]: ScButtonDropdown;
  [EPopupComs.dropdown]: ScDropdownInput;
  [EPopupComs.dropdownMulti]: ScDropdownMultiSelect;
  [EPopupComs.dateInput]: ScDateInput;
  [EPopupComs.dateRange]: ScDateRangeInput;
  [EPopupComs.tooltip]: ScTooltip;
  [EPopupComs.employeeInput]: LitElement;
  [EPopupComs.employeeMultiInput]: LitElement;
};

export type TElementMatchFn = (target: EventTarget) => boolean;

export type TInputType<T extends EPopupComs> = T[];
export type TReturnType<T extends TInputType<EPopupComs>> =
  T extends (infer Key)[]
    ? {
        [K in Key & EPopupComs]?: TPopupComs[K];
      }
    : never;

export const isThisEqualTo = {
  [EPopupComs.timeInput]: (timeInput?: ScTimeInput) => {
    return timeInput !== undefined;
  },
  [EPopupComs.searchField]: (searchField?: ScSearchField) => {
    return searchField !== undefined;
  },
  [EPopupComs.buttonDropdown]: (buttonDropdown?: ScButtonDropdown) => {
    return buttonDropdown !== undefined;
  },
  [EPopupComs.tooltip]: (tooltip?: ScTooltip) => {
    return tooltip !== undefined;
  },
  [EPopupComs.employeeInput]: (employeeInput?: LitElement) => {
    return employeeInput !== undefined;
  },
  [EPopupComs.employeeMultiInput]: (employeeInput?: LitElement) => {
    return employeeInput !== undefined;
  },
  [EPopupComs.dropdown]: (dropdown?: ScDropdownInput) => {
    return dropdown !== undefined;
  },
  [EPopupComs.dropdownMulti]: (dropdownMulti?: ScDropdownMultiSelect) => {
    return dropdownMulti !== undefined;
  },
  [EPopupComs.dateInput]: (
    datePicker?: ScDateInput,
    dateRangePicker?: ScDateRangeInput
  ) => {
    return datePicker !== undefined && !dateRangePicker;
  },
  [EPopupComs.dateRange]: (
    datePicker?: ScDateInput,
    dateRangePicker?: ScDateRangeInput
  ) => {
    return datePicker !== undefined && dateRangePicker !== undefined;
  },
};

export enum ETags {
  dropdown = 'sc-dropdown-input',
  dropdownMulti = 'sc-dropdown-multi-select',
  buttonDropdown = 'sc-button-dropdown',
  tooltip = 'sc-tooltip',
  masterCell = 'sc-data-grid-master-cell',
  dataGridCell = 'sc-data-grid-cell',
  dateInput = 'sc-date-input',
  dateRange = 'sc-date-range-input',
  searchField = 'sc-search-field',
  timeInput = 'sc-time-input',
  employeeInput = 'sc-employee-input',
  employeeMultiInput = 'sc-employee-multi-input',
}

export const isSameTag = (source: string, target: ETags) => source === target;

export const getIsElement = (target: EventTarget) => {
  return target instanceof Element ? target : false;
};

export const getTagName = (target: EventTarget) => {
  const el = getIsElement(target);
  if (!el) {
    return '';
  }
  return el.tagName.toLowerCase();
};

const invalidParentTags = ['sc-tag'];
export const isInvalidTooltip = (target: EventTarget) => {
  const el = target as HTMLElement;
  const node = el.getRootNode();
  if (node && node instanceof ShadowRoot) {
    return invalidParentTags.includes(getTagName(node.host));
  }
  return false;
};

export const matchPopupElement: Record<EPopupComs, TElementMatchFn> = {
  [EPopupComs.searchField]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.searchField);
  },
  [EPopupComs.timeInput]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.timeInput);
  },
  [EPopupComs.buttonDropdown]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.buttonDropdown);
  },
  [EPopupComs.tooltip]: (target: EventTarget) => {
    const isMatched = isSameTag(getTagName(target), ETags.tooltip);
    if (isMatched) {
      return !isInvalidTooltip(target);
    }
    return isMatched;
  },
  [EPopupComs.employeeInput]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.employeeInput);
  },
  [EPopupComs.employeeMultiInput]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.employeeMultiInput);
  },
  [EPopupComs.dropdown]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.dropdown);
  },
  [EPopupComs.dropdownMulti]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.dropdownMulti);
  },
  [EPopupComs.dateInput]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.dateInput);
  },
  [EPopupComs.dateRange]: (target: EventTarget) => {
    return isSameTag(getTagName(target), ETags.dateRange);
  },
};

export const getIsWraperEqualMasterCell = (target: EventTarget) => {
  return isSameTag(getTagName(target), ETags.masterCell);
};
export const getIsWraperEqualRow = (target: EventTarget) => {
  return isSameTag(getTagName(target), ETags.dataGridCell);
};
