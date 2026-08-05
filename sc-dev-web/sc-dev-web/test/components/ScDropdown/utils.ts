import { html } from 'lit';
import { TData } from '../../../src/components/ScDropdown/ScDropdownInput.js';
import '../../../elements/sc-dropdown-input.js';

export const pieceOfData = (
  funcLabel = false,
  childrenDeep = 0,
  childrenLen = 0
): TData => {
  const unique = Math.random();
  const label = `label - ${unique}`;
  const value = `value - ${unique}`;
  const children = [];
  const displayValue = '';
  if (childrenDeep) {
    for (let i = 0; i < childrenLen; ++i) {
      children.push(pieceOfData(funcLabel, childrenDeep - 1, childrenLen));
    }
  }
  return {
    label: funcLabel ? () => html`<h1>${label}</h1>` : label,
    value,
    children,
    displayValue,
  };
};

export const pieceOfHtml = (len: number) => {
  const arr = Array(len).fill(1);
  return html`${arr.map((_, index) => {
    return html`<sc-dropdown-option value="${index}"
      >option ${index}</sc-dropdown-option
    >`;
  })}`;
};

export const generateOptionDom = (value: string) => {
  const option = document.createElement('sc-dropdown-option');
  option.setAttribute('value', value);
  option.innerHTML = value;
  return option;
};
