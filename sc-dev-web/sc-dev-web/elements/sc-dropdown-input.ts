import { defineElement } from "./define-element.js";
import { ScDropdownInput } from "../src/components/ScDropdown/ScDropdownInput.js";
import { ScDropdownMultiSelect } from "../src/components/ScDropdown/ScDropdownMultiSelect.js";
import { ScDropdownOption } from "../src/components/ScDropdown/ScDropdownOption.js";
export * from "../src/components/ScDropdown/ScDropdownInput.js";
export * from "../src/components/ScDropdown/ScDropdownMultiSelect.js";
export * from "../src/components/ScDropdown/ScDropdownOption.js";

defineElement("sc-dropdown-input", ScDropdownInput);
defineElement("sc-dropdown-multi-select", ScDropdownMultiSelect);
defineElement("sc-dropdown-option", ScDropdownOption);

declare global {
  interface HTMLElementTagNameMap {
    "sc-dropdown-input": ScDropdownInput;
    "sc-dropdown-multi-select": ScDropdownMultiSelect;
    "sc-dropdown-option": ScDropdownOption;
  }
}
