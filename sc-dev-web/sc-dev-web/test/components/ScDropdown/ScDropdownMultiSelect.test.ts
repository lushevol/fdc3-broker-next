import { TemplateResult, html, render } from 'lit';
import { fixture, expect, aTimeout, oneEvent } from '@open-wc/testing';
import { ScDropdownMultiSelect } from '../../../src/components/ScDropdown/ScDropdownMultiSelect.js';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-checkbox.js';
import '../../../elements/sc-tag.js';
import '../../../elements/sc-side-sheet.js';
import '../../../elements/sc-text-input.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { hierarchyData, customData, customDataWithDisplayValue } from './testData.js';
import { mockMatchMedia } from '../../shared/mediaQuery.js';
import { mockAnimation } from '../../shared/animation.js';

function updateDataFn(element: ScDropdownMultiSelect) {
  const d = [];
  for (let i = 0; i < 100; i++) {
    const option = `${i}created option - XXXX`;
    d.push({
      label: () => html`<sc-dropdown-option style="" value="${option}">
        ${option}

        <sc-button no-pill @click=${() => console.log('test', i)}
          >555555</sc-button
        >
      </sc-dropdown-option>`,
      value: option,
      displayValue: option,
    });
  }
  for (let i = 120; i < 200; i++) {
    const option = `${i}created option - XXXX`;
    d.push({
      label: 'string',
      value: option,
      displayValue: option,
    });
  }
  for (let i = 220; i < 300; i++) {
    const option = `${i}created option - XXXX`;
    d.push({
      label: () => {
        const div = document.createElement('div');
        div.textContent = option;
        return div;
      },
      value: option,
      displayValue: option,
    });
  }
  element.data = d;
}

function templateToString(template: TemplateResult): string {
  const container = document.createElement('div');
  render(template, container);
  return container.innerHTML.replace(/>\s+</g, '><').trim();
}

let uniqueId = 0;
const generateData = (children: any[] = []) => {
  uniqueId++;
  return {
    label: `label - ${uniqueId}`,
    value: String(uniqueId),
    children: [...children],
    displayValue: String(uniqueId),
  };
};

describe('ScDropdownMultiSelect', () => {
  beforeEach(() => mockAnimation());

  it('renders default search field', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select 
        multiple-rows 
        label='Select from dropdown' 
        tooltip="Select from dropdown" 
        advanced-search-text='Advanced search'
        >
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    expect(el.emptyText).to.equal('No data found');
    expect(el.placeholder).to.equal('Please select');
    expect(el.threshold).to.equal(3);
    expect(el.error).to.equal(false);
    expect(el.success).to.equal(false);
    expect(el.readonly).to.equal(false);
    expect(el.required).to.equal(false);
    expect(el.label).to.equal('Select from dropdown');
    expect(el.tooltip).to.equal('Select from dropdown');
    expect(el.helpText).to.equal('');
    expect(el.errorMessage).to.equal('');
    expect(el.successMessage).to.equal('');
  });

  it('renders search field with suggestions', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select
        error
        error-message="Error Message"
        .value=${['1']}
        tooltip="tooltip"
      >
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <div slot="empty-text">No data, please try another value</div>
      </sc-dropdown-multi-select>
    `);
    expect(el.error).to.equal(true);
    expect(el.errorMessage).to.equal('Error Message');
  });

  it('renders disabled dropdown', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select success disabled>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    expect(el.success).to.equal(true);
  });

  it('should calculate items to show and remaining items correctly', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
  
    el.calculateItemWidth = (item: any) => {
      if (item.label === 'lastItem') return 50;
      if (item.label === 'item1') return 30;
      if (item.label === 'item2') return 40;
      return 0;
    };
  
    el.inputWidth = 160;
    el.error = false;
    el.prefixIcon = '';
  
    const closeableItems = [
      { label: 'item1' },
      { label: 'item2' },
      { label: 'lastItem' },
    ];
  
    el.closeableItems = closeableItems;
    await el.updateComplete; 
  
    const result = el['getItemsToShow'](closeableItems);
  
    expect(result.remainingItems).to.equal(2);
    expect(result.itemsToShow).to.deep.equal([{ label: 'lastItem' }]);
  });
  

  it('should handle single item that fits', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    el['calculateItemWidth'] = () => 50;
    el['inputWidth'] = 100;
    el['error'] = false;
    el['prefixIcon'] = '';
    const closeableItems = [{ label: 'singleItem' }];
    const result = el['getItemsToShow'](closeableItems);
    expect(result.itemsToShow).to.deep.equal([{ label: 'singleItem' }]);
    expect(result.remainingItems).to.equal(0);
  });

  it('should handle single item that does not fit', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    el['calculateItemWidth'] = () => 100;
    el['inputWidth'] = 30;
    el['error'] = false;
    el['prefixIcon'] = '';
    const closeableItems = [{ label: 'singleItem' }];
    const result = el['getItemsToShow'](closeableItems);
    expect(result.itemsToShow).to.deep.equal([{ label: 'singleItem' }]);
    expect(result.remainingItems).to.equal(0);
  });

  it('should handle items with error and prefixIcon', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);

    el['calculateItemWidth'] = () => 30;
    el['inputWidth'] = 200;
    el['error'] = true;
    el['prefixIcon'] = 'clock--line';

    const closeableItems = [
      { label: 'item1' },
      { label: 'item2' },
      { label: 'lastItem' },
    ];

    const result = el['getItemsToShow'](closeableItems);
    expect(result.itemsToShow).to.deep.equal([{ label: 'item1' }, { label: 'item2' }, { label: 'lastItem' }]);
    expect(result.remainingItems).to.equal(0);
  });

  it('should calculate item width for an Element', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    const item = document.createElement('div');
    item.textContent = 'Test Element';
    document.body.appendChild(item);

    const width = el.calculateItemWidth(item);
    expect(width).to.be.a('number');
    document.body.removeChild(item);
  });

  it('should calculate item width for a non-Element item', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    const item = { label: 'Test Value' };

    const width = el.calculateItemWidth(item);
    expect(width).to.be.a('number');
  });

  it('should calculate item width for an Element with displayRawValue', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    el.displayRawValue = true;
    const item = document.createElement('div');
    item.setAttribute('value', 'Raw Value');
    document.body.appendChild(item);

    const width = el.calculateItemWidth(item);
    expect(width).to.be.a('number');
    document.body.removeChild(item);
  });

  it('should calculate item width for a non-Element item with displayRawValue', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    el.displayRawValue = true;

    el.replaceTag = (value: any) => value;
    el.reCompile = (item: any) => item.value; 

    const item = { value: 'Raw Value', displayValue: 'Displayed Raw Value' };

    const width = el.calculateItemWidth(item);
    expect(width).to.be.a('number');
  });

  it('should calculate item width for an Element item with displayRawValue', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    el.displayRawValue = true;

    const item = document.createElement('div');
    item.setAttribute('value', 'Element Value');
    item.textContent = 'Element Text';

    const width = el.calculateItemWidth(item);
    expect(width).to.be.a('number');
  });

  it('should update selected classes correctly', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <div class="list-item">
          <sc-checkbox value="1"></sc-checkbox>
        </div>
        <div class="list-item">
          <sc-checkbox value="2"></sc-checkbox>
        </div>
        <div class="list-item">
          <sc-checkbox value="3"></sc-checkbox>
        </div>
      </sc-dropdown-multi-select>
    `);

    (el as any).selectedItems = ['1', '3'];
    el.updateSelectedClasses();
    const items = el.shadowRoot?.querySelectorAll('.list-item');
    items?.forEach(item => {
      const checkbox = item.querySelector('sc-checkbox');
      if (checkbox && ['1', '3'].includes(checkbox.value)) {
        expect(item.classList.contains('selected')).to.be.true;
      } else {
        expect(item.classList.contains('selected')).to.be.false;
      }
    });
  });

  it('should return original text when search string is empty', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    const result = el['highlightMatch']('Sample Text', '');
    const expected = html`${unsafeHTML('Sample Text')}`;
    expect(templateToString(result)).to.equal(templateToString(expected));
  });

  it('should return original text when there is no match', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    const result = el['highlightMatch']('Sample Text', 'xyz');
    const expected = html`${unsafeHTML('Sample Text')}`;
    expect(templateToString(result)).to.equal(templateToString(expected));
  });

  it('should update affixTopPadding based on input element height', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    const inputCover = document.createElement('div');
    inputCover.classList.add('sc-dropdown-input', 'multiple', 'input-cover');
    el.shadowRoot?.appendChild(inputCover);
    const testCases = [{ height: 32, expectedPadding: '0.5rem' }];
    for (const { height, expectedPadding } of testCases) {
      inputCover.style.height = `${height}px`;
      Object.defineProperty(inputCover, 'clientHeight', { value: height, configurable: true });
      el.updateAffixPadding();
      await el.updateComplete;
      expect(el.affixTopPadding).to.equal(expectedPadding);
    }
  });

  it('renders label slot when label is not set and hasLabelSlot is true', async () => {
    let el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    const labelSlotContent = 'Label Slot Content';
    el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <span slot="label">${labelSlotContent}</span>
      </sc-dropdown-multi-select>
    `);

    const labelSlot = el.shadowRoot?.querySelector('slot[name="label"]') as HTMLSlotElement;
    expect(labelSlot).to.exist;
    const assignedNodes = labelSlot.assignedNodes() as HTMLElement[];
    expect(assignedNodes[0].textContent).to.equal(labelSlotContent);
  });

  it('renders tooltip slot when hasTooltip is true', async () => {
    let el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);
    const tooltipContent = 'Tooltip Content';
    el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select tooltip="${tooltipContent}">
        <span slot="label-tooltip">${tooltipContent}</span>
      </sc-dropdown-multi-select>
    `);

    const tooltipSlot = el.shadowRoot?.querySelector('slot[name="label-tooltip"]') as HTMLSlotElement;
    expect(tooltipSlot).to.exist;
    const assignedNodes = tooltipSlot.assignedNodes() as HTMLElement[];
    expect(assignedNodes[0].textContent).to.equal(tooltipContent);
  });

  it('should update selected classes based on selectedItems', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select></sc-dropdown-multi-select>
    `);

    const listItem1 = document.createElement('div');
    listItem1.classList.add('list-item');
    const checkbox1 = document.createElement('sc-checkbox');
    checkbox1.value = 'item1';
    listItem1.appendChild(checkbox1);

    const listItem2 = document.createElement('div');
    listItem2.classList.add('list-item');
    const checkbox2 = document.createElement('sc-checkbox');
    checkbox2.value = 'item2';
    listItem2.appendChild(checkbox2);

    el.shadowRoot?.appendChild(listItem1);
    el.shadowRoot?.appendChild(listItem2);

    checkbox1.checked = true;
    checkbox2.checked = false;

    el.updateSelectedClasses();
    await el.updateComplete;

    expect(listItem1.classList.contains('selected')).to.be.true;
    expect(listItem2.classList.contains('selected')).to.be.false;

    checkbox1.checked = false;
    checkbox2.checked = true;

    el.updateSelectedClasses();
    await el.updateComplete;

    expect(listItem1.classList.contains('selected')).to.be.false;
    expect(listItem2.classList.contains('selected')).to.be.true;
  });

  it('virtual', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select success> </sc-dropdown-multi-select>
    `);

    updateDataFn(el);
    expect(el.success).to.equal(true);
  });

  it('call removeTag function', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <div slot="label">this is label</div>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <div slot="empty-text">No data, please try another value</div>
      </sc-dropdown-multi-select>
    `);
    el.removeTag(
      new CustomEvent('sc-remove', {
        detail: {
          tag: 1,
        },
      })
    );
    expect(el.querySelectorAll('sc-closable-tag').length).to.equal(0);
  });

  it('call updateFocus function', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <div slot="label">this is label</div>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <div slot="empty-text">No data, please try another value</div>
      </sc-dropdown-multi-select>
    `);
    el.updateFocus(true, new CustomEvent('sc-hide'));
    expect(el.querySelectorAll('sc-closable-tag').length).to.equal(0);
  });

  it('call updateListItem', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <div slot="label">this is label</div>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <div slot="empty-text">No data, please try another value</div>
      </sc-dropdown-multi-select>
    `);
    expect(el.originalOptions.length).to.equal(2);
  });

  it('call updateElement', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <div slot="label">this is label</div>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <div slot="empty-text">No data, please try another value</div>
      </sc-dropdown-multi-select>
    `);
    const div = document.createElement('div');
    render(
      html`
        <sc-checkbox style="padding-top: 10px;opacity: 0;">
          <sc-dropdown-option></sc-dropdown-option>
        </sc-checkbox>
      `,
      div
    );
    el.updateElement(div, 1);

    expect(el.originalOptions.length).to.equal(2);
  });

  it('updateElement sets selectAllOptions checkbox checked state based on all options selected', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    await el.updateComplete;

    // Inject a selectAllOptions entry into dropdownOptionsWithIndex
    el.dropdownOptionsWithIndex.set(99, {
      value: 'selectAllOptions',
      label: 'Select All',
      path: '99',
      parentPath: '-1',
      disabled: false,
      children: [],
    } as any);

    const div = document.createElement('div');
    render(html`<sc-checkbox></sc-checkbox>`, div);

    // All options selected -> selectAllOptions checkbox should be checked
    el._value = ['1', '2'];
    el.updateElement(div, 99);
    const checkbox = div.querySelector('sc-checkbox') as any;
    expect(checkbox.checked).to.equal(true);

    // Not all options selected -> selectAllOptions checkbox should not be checked
    el._value = ['1'];
    el.updateElement(div, 99);
    expect(checkbox.checked).to.equal(false);
  });

  it('does not apply select-all state to recycled virtual item rows', async () => {
    const data = [
      { label: 'phone', value: 'phone' },
      { label: 'phonev2', value: 'phonev2' },
    ];

    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all .data=${data}></sc-dropdown-multi-select>
    `);
    await el.updateComplete;

    const indexedOptions = Array.from(el.dropdownOptionsWithIndex.entries());
    const selectAllEntry = indexedOptions.find(([, option]) => option.value === 'selectAllOptions');
    const phoneEntry = indexedOptions.find(([, option]) => option.value === 'phone');

    expect(selectAllEntry).to.exist;
    expect(phoneEntry).to.exist;

    const selectAllIndex = selectAllEntry![0];
    const phoneIndex = phoneEntry![0];

    const recycledRow = (el as any).createPhysicalEl({ index: 0 }) as HTMLElement;
    (el as any).updateElement(recycledRow, selectAllIndex);

    (el as any)._value = ['phone'];
    (el as any).updateElement(recycledRow, phoneIndex);

    const checkbox = recycledRow.querySelector('sc-checkbox') as unknown as HTMLInputElement;
    expect(checkbox.checked).to.equal(true);

    await (el as any).updateSelectAllCheckboxState();

    expect(checkbox.checked).to.equal(true);
    expect((el as any).selectAllCheckboxRef).to.equal(null);
  });

  it('method test', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select> </sc-dropdown-multi-select>
    `);

    el.data = hierarchyData;
    el.clear();
    el.resetInput();
    el.show();
    el._value.push(hierarchyData[0].value);
    el.getSelectValueForReadonly();

    await el.updateComplete;

    el.handleSelect(
      new CustomEvent<{ checked: boolean }>('text-event', {
        detail: {
          checked: true,
        },
      }),
      hierarchyData[0].value,
      '0'
    );
    el.handleSelect(
      new CustomEvent<{ checked: boolean }>('text-event', {
        detail: {
          checked: false,
        },
      }),
      hierarchyData[0].value,
      '0'
    );
    el.handleTextInput({
      target: {
        value: hierarchyData[0].value,
        style: {
          width: 0,
        },
      },
    });
    el.renderPrefix();
    const checkbox = document.createElement('div');
    checkbox.classList.add('checkbox__control');
    checkbox.setAttribute('part', 'control');
    el.isCheckbox([checkbox]);
    el.isParentCheckbox(checkbox, true);
    el.indetCheckbox('0', true, { toggleAttribute() { } } as any);
    el.indetCheckbox('0-0', false, { toggleAttribute() { } } as any);

    expect(el.originalOptions.length).to.equal(0);
  });

  it('select options right', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select> </sc-dropdown-multi-select>
    `);

    let uniqueValue = 0;
    const createOptionObject = (depth: number, parentPath: string | null = null) => {
      const currentPath = parentPath ? `${parentPath}-${uniqueValue}` : `${uniqueValue}`;
      const optionObject: any = {
        label: String(uniqueValue),
        value: String(uniqueValue),
        parentPath,
        path: currentPath,
      };
      uniqueValue++;
      if (depth > 0) {
        optionObject.children = [createOptionObject(depth - 1, currentPath)];
      }
      return optionObject;
    };

    const mockData = [];
    for (let i = 0; i < 15; i++) {
      mockData.push(createOptionObject(2));
    }
    el.data = mockData;

    el.clear();
    await el.resetInput();
    el.show();
    el.handleSelectAll(false, '1'); 
    expect(el._value.length).to.equal(3);

    el.clear();
    el.handleSelectAll(false, '1-0');
    expect(el._value.length).to.equal(2); 
  });

  it('select correct option when set dorpdown.value', async () => {
    console.time('dropdown');
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select> </sc-dropdown-multi-select>
    `);

    console.timeLog('dropdown', 'fixture');

    const virtualData = [
      generateData([
        generateData([
          generateData(),
          generateData(),
          generateData(),
          generateData(),
        ]),
        generateData(),
        generateData(),
        generateData(),
      ]),
      generateData([generateData()]),
      generateData([generateData()]),
      generateData([generateData()]),
      generateData([generateData()]),
    ];
    el.data = virtualData as any;
    el.value = ['9', '13', '300'];

    console.timeLog('dropdown', 'set value');

    await el.updateComplete;
    console.timeLog('dropdown', 'updateComplete');

    await aTimeout(5);

    console.timeLog('dropdown', 'timeout 50');


    expect(el._value.join()).to.equal([
      '9', '13', '300',
      '5', '1', '2',
      '3', '4', '6',
      '7', '8', '12',
    ].join());


    el.value = ['11'];

    console.timeLog('dropdown', 'set value');

    await el.updateComplete;
    console.timeLog('dropdown', 'updateComplete');

    await aTimeout(5);

    console.timeLog('dropdown', 'timeout 50');

    expect(el._value.join()).to.equal(['11', '10'].join());
    console.timeEnd('dropdown');
  }, 10000);

  it('test render customer label', async () => {
  
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select> </sc-dropdown-multi-select>
    `);

    el.data = customData;
    el.clear();
    el.resetInput();
    el.show();
    el._value.push(customData[0].value);
    el.getSelectValueForReadonly();

    await el.updateComplete;

    el.handleSelect(
      new CustomEvent<{ checked: boolean }>('text-event', {
        detail: {
          checked: true,
        },
      }),
      customData[0].value,
      '0'
    );
    el.handleSelect(
      new CustomEvent<{ checked: boolean }>('text-event', {
        detail: {
          checked: false,
        },
      }),
      customData[0].value,
      '0'
    );
    el.handleTextInput({
      target: {
        value: customData[0].value,
        style: {
          width: 0,
        },
      },
    });
    el.renderPrefix();
    const checkbox = document.createElement('div');
    checkbox.classList.add('checkbox__control');
    checkbox.setAttribute('part', 'control');
    el.isCheckbox([checkbox]);
    el.isParentCheckbox(checkbox, true);
    el.indetCheckbox('0', true, { toggleAttribute() {} } as any);
    el.indetCheckbox('0-0', false, { toggleAttribute() {} } as any);

    expect(el.originalOptions.length).to.equal(0);
  });

  it('test render customer label with displayValue', async () => {
  
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select> </sc-dropdown-multi-select>
    `);

    el.data = customDataWithDisplayValue;
    el.clear();
    el.resetInput();
    el.show();
    el._value.push(customDataWithDisplayValue[0].value);
    el.getSelectValueForReadonly();

    await el.updateComplete;

    el.handleSelect(
      new CustomEvent<{ checked: boolean }>('text-event', {
        detail: {
          checked: true,
        },
      }),
      customDataWithDisplayValue[0].value,
      '0'
    );
    el.handleSelect(
      new CustomEvent<{ checked: boolean }>('text-event', {
        detail: {
          checked: false,
        },
      }),
      customDataWithDisplayValue[0].value,
      '0'
    );
    el.handleTextInput({
      target: {
        value: customDataWithDisplayValue[0].value,
        style: {
          width: 0,
        },
      },
    });
    el.renderPrefix();
    const checkbox = document.createElement('div');
    checkbox.classList.add('checkbox__control');
    checkbox.setAttribute('part', 'control');
    el.isCheckbox([checkbox]);
    el.isParentCheckbox(checkbox, true);
    el.indetCheckbox('0', true, { toggleAttribute() {} } as any);
    el.indetCheckbox('0-0', false, { toggleAttribute() {} } as any);

    expect(el.originalOptions.length).to.equal(0);
  });

  it('renders Select All option with listener sc-select set value', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    el.shouldRenderMenu = true;
    await el.updateComplete;
    const selectAllCheckbox = el.shadowRoot?.querySelector('#selectAllCheckbox');
    expect(selectAllCheckbox).to.exist;
    el.value = ['1','2'];
    el.dispatchEvent(new MouseEvent('click',{
      bubbles: true,
    }));
    aTimeout(50);
    await el.updateComplete;
    const options:any = el.querySelectorAll('sc-dropdown-option');
    expect(options.length).to.equal(2);
    const option1 = options[0];
    expect(option1.textContent).to.equal('Option1');
    const checkboxes = el.shadowRoot?.querySelectorAll('sc-checkbox') as any;
    expect(checkboxes.length).to.equal(3);
    el.clear();
  });

  it('renders Select All option when select-all attruibute is passed', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    el.shouldRenderMenu = true;
    await el.updateComplete;
    const selectAllCheckbox = el.shadowRoot?.querySelector('#selectAllCheckbox');
    expect(selectAllCheckbox).to.exist;
  });

  it('does not render Select All option by default', async () => {
    const el = await fixture(html`
      <sc-dropdown-multi-select>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    const selectAllCheckbox = el.shadowRoot?.querySelector('#selectAllCheckbox');
    expect(selectAllCheckbox).to.not.exist;
  });

  it('allows deselection when selected count is at min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1']} min-count="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;

    await el.handleSelect(
      { detail: { checked: false } } as any,
      '1',
      '-1'
    );

    expect(el._value).to.deep.equal([]);
    expect(el.selectedItems.includes('1')).to.equal(false);
    expect((el as any)._minCountError).to.equal(false);
  });

  it('emits isMinReached only when selected count exactly matches min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1']} min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;

    const firstSelect = oneEvent(el, 'sc-select');
    await el.handleSelect(
      { detail: { checked: true } } as any,
      '2',
      '-1'
    );
    const firstEvt: any = await firstSelect;
    expect(firstEvt.detail.isMinReached).to.equal(true);

    const secondSelect = oneEvent(el, 'sc-select');
    await el.handleSelect(
      { detail: { checked: true } } as any,
      '3',
      '-1'
    );
    const secondEvt: any = await secondSelect;
    expect(secondEvt.detail).to.not.have.property('isMinReached');
  });

  it('does not emit sc-select when selected count is below min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;

    let emittedCount = 0;
    let lastDetail: any;
    el.addEventListener('sc-select', (event: Event) => {
      emittedCount += 1;
      lastDetail = (event as CustomEvent).detail;
    });

    await el.handleSelect(
      { detail: { checked: true } } as any,
      '1',
      '-1'
    );
    await aTimeout(10);

    expect(emittedCount).to.equal(0);

    await el.handleSelect(
      { detail: { checked: true } } as any,
      '2',
      '-1'
    );
    await aTimeout(10);

    expect(emittedCount).to.equal(1);
    expect(lastDetail.value).to.deep.equal(['1', '2']);
    expect(lastDetail.addedValues).to.deep.equal(['1', '2']);
    expect(lastDetail.isMinReached).to.equal(true);
  });

  it('shows min-count error when selecting below min-count from empty value', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;

    await el.handleSelect(
      { detail: { checked: true } } as any,
      '1',
      '-1'
    );
    await el.updateComplete;

    expect((el as any)._minCountError).to.equal(true);
    expect((el as any).minCountMessage).to.equal('Please select at least 2 options');
  });

  it('does not emit sc-select when selected count exceeds max-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select max-count="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;

    let emittedCount = 0;
    el.addEventListener('sc-select', () => {
      emittedCount += 1;
    });

    el._value = ['1', '2'];
    el.emitScSelect();

    expect(emittedCount).to.equal(0);
    expect((el as any)._maxCountError).to.equal(true);
  });

  it('allows removeTag when selected count is at min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1']} min-count="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    el.selectedItems = ['1'];

    const selectEvent = oneEvent(el, 'sc-select');
    el.removeTag(
      new CustomEvent('sc-remove', {
        detail: {
          tag: '1',
        },
      })
    );
    const evt: any = await selectEvent;

    expect(el._value).to.deep.equal([]);
    expect((el as any)._minCountError).to.equal(false);
    expect(evt.detail.value).to.deep.equal([]);
    expect(evt.detail.allValues).to.deep.equal([]);
  });

  it('does not show min-count error when removeTag leaves exactly min-count selections', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1', '2', '3', '4']} min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
        <sc-dropdown-option value="4">Option4</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    el.selectedItems = ['1', '2', '3', '4'];

    el.removeTag(new CustomEvent('sc-remove', { detail: { tag: '1' } }));
    await el.updateComplete;
    expect(el._value).to.deep.equal(['2', '3', '4']);
    expect((el as any)._minCountError).to.equal(false);

    el.removeTag(new CustomEvent('sc-remove', { detail: { tag: '2' } }));
    await el.updateComplete;
    expect(el._value).to.deep.equal(['3', '4']);
    expect((el as any)._minCountError).to.equal(false);
  });

  it('allows clear when selected count is at min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1']} min-count="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    el.selectedItems = ['1'];

    const selectEvent = oneEvent(el, 'sc-select');
    el.clear();
    const evt: any = await selectEvent;

    expect(el._value).to.deep.equal([]);
    expect((el as any)._minCountError).to.equal(false);
    expect(evt.detail.value).to.deep.equal([]);
    expect(evt.detail.allValues).to.deep.equal([]);
  });

  it('shows min-count error when removeTag results below min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1', '2', '3']} min-count="3">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    el.selectedItems = ['1', '2', '3'];

    el.removeTag(new CustomEvent('sc-remove', { detail: { tag: '1' } }));
    await el.updateComplete;

    expect((el as any)._minCountError).to.equal(true);
    expect((el as any).minCountMessage).to.equal('Please select at least 3 options');
  });

  it('keeps default min-count message after 3 seconds when deletion is allowed', async () => {
    jest.useFakeTimers();
    try {
      const el = await fixture<ScDropdownMultiSelect>(html`
        <sc-dropdown-multi-select .value=${['1', '2']} min-count="2">
          <sc-dropdown-option value="1">Option1</sc-dropdown-option>
          <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        </sc-dropdown-multi-select>
      `);

      await el.updateComplete;
      el.selectedItems = ['1', '2'];

      el.removeTag(new CustomEvent('sc-remove', { detail: { tag: '1' } }));
      await el.updateComplete;

      expect((el as any)._minCountError).to.equal(true);
      expect((el as any).minCountMessage).to.equal('Please select at least 2 options');

      jest.advanceTimersByTime(3000);
      await el.updateComplete;

      expect((el as any)._minCountError).to.equal(true);
      expect((el as any).minCountMessage).to.equal((el as any).defaultMinCountMessage);
    } finally {
      jest.useRealTimers();
    }
  });

  it('uses consumer error-message instead of default when provided', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1']} min-count="1" error-message="Custom error">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    el.selectedItems = ['1'];

    el.removeTag(new CustomEvent('sc-remove', { detail: { tag: '1' } }));
    await el.updateComplete;

    expect(el.errorMessage).to.equal('Custom error');
  });

  it('clears error state when selection is recovered to min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;

    // Trigger error state with partial selection below min.
    await el.handleSelect(
      { detail: { checked: true } } as any,
      '1',
      '-1'
    );
    await el.updateComplete;
    expect((el as any)._minCountError).to.equal(true);

    // Recover by reaching min-count.
    await el.handleSelect(
      { detail: { checked: true } } as any,
      '2',
      '-1'
    );
    await el.updateComplete;
    expect((el as any)._minCountError).to.equal(false);
  });

  it('clears error state when value is set externally above min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1']} min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;

    // Manually trigger error state
    (el as any).markMinViolationAttempt();
    expect((el as any)._minCountError).to.equal(true);

    // Set value externally to satisfy min
    el.value = ['1', '2'];
    await el.updateComplete;
    await aTimeout(5);
    expect((el as any)._minCountError).to.equal(false);
  });

  it('allows deselection and updates value when selected count is at min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1', '2']} min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    let updateMenuItemsCheckboxStateCalled = false;
    const original = el.updateMenuItemsCheckboxState.bind(el);
    el.updateMenuItemsCheckboxState = () => {
      updateMenuItemsCheckboxStateCalled = true;
      original();
    };

    await el.handleSelect(
      { detail: { checked: false } } as any,
      '1',
      '-1'
    );

    expect(el._value).to.deep.equal(['2']);
    expect(updateMenuItemsCheckboxStateCalled).to.equal(false);
    expect((el as any)._minCountError).to.equal(true);
  });

  it('_value is replaced by new array reference when item is deselected', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1', '2']}>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    const originalRef = el._value;

    await el.handleSelect(
      { detail: { checked: false } } as any,
      '1',
      '-1'
    );

    expect(el._value).to.not.equal(originalRef);
    expect(el._value).to.deep.equal(['2']);
  });

  it('keeps max-count behavior unchanged when min-count is absent', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select max-count="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    el._value = ['1'];
    el.selectedItems = ['1'];
    await el.updateMaxCount();
    expect(el.isOverflow).to.equal(true);
  });

  it('clamps externally set value to max-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1', '2', '3']} max-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    await aTimeout(5);

    expect(el._value).to.deep.equal(['1', '2']);
    expect(el.isOverflow).to.equal(true);
  });

  it('shows min-count error when external value is below min-count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1']} min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    await aTimeout(5);

    expect((el as any)._minCountError).to.equal(true);
    expect((el as any).defaultMinCountMessage).to.equal('Please select at least 2 options');
  });

  it('blocks select-all when selectable options exceed max-count and closes popup', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all max-count="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    el.shouldRenderMenu = true;
    await el.updateComplete;

    const closePopupSpy = jest.spyOn(el as any, 'closeDropdownPopup').mockImplementation(() => Promise.resolve());

    const selectAllCheckbox = el.shadowRoot?.querySelector('#selectAllCheckbox') as HTMLInputElement;
    expect(selectAllCheckbox).to.exist;
    const selectAllItem = selectAllCheckbox.closest('.list-item') as HTMLElement;
    expect(selectAllItem).to.exist;

    (el as any).handleSelectAllOptions(selectAllItem, true);
    await aTimeout(10);

    expect(el._value).to.deep.equal([]);
    expect((el as any)._maxCountError).to.equal(true);
    expect((el as any).defaultMaxCountMessage).to.equal('Please select less than 1 option');
    expect(selectAllCheckbox.checked).to.equal(false);
    expect(closePopupSpy.mock.calls.length).to.equal(1);
  });

  it('does not show min-count error when initial value is empty', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    await aTimeout(5);

    expect((el as any)._minCountError).to.equal(false);
  });

  it('does not show min-count error when value transitions from non-empty to empty', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .value=${['1', '2']} min-count="2">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    await el.updateComplete;
    await aTimeout(5);
    expect((el as any)._minCountError).to.equal(false);

    el.value = [];
    await el.updateComplete;
    await aTimeout(5);

    expect((el as any)._minCountError).to.equal(false);
  });

  it('checks all checkboxes when selectAllCheckbox is checked', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    el.shouldRenderMenu = true;
    await el.updateComplete;

    const selectAllCheckbox = el.shadowRoot?.querySelector('#selectAllCheckbox') as HTMLInputElement;
    const checkboxes = el.shadowRoot?.querySelectorAll('sc-dropdown-option input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    selectAllCheckbox.checked = true;
    selectAllCheckbox.dispatchEvent(new Event('sc-change'));

    checkboxes.forEach(checkbox => {
      expect(checkbox.checked).to.be.true;
    });
  });

  it('unchecks all checkboxes when selectAllCheckbox is unchecked', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    el.shouldRenderMenu = true;
    await el.updateComplete;

    const selectAllCheckbox = el.shadowRoot?.querySelector('#selectAllCheckbox') as HTMLInputElement;
    const checkboxes = el.shadowRoot?.querySelectorAll('sc-dropdown-option input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    selectAllCheckbox.checked = true;
    selectAllCheckbox.dispatchEvent(new Event('sc-change'));

    selectAllCheckbox.checked = false;
    selectAllCheckbox.dispatchEvent(new Event('sc-change'));

    checkboxes.forEach(checkbox => {
      expect(checkbox.checked).to.be.false;
    });
  });

  it('should render disable option as disabled', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option disabled="true" value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option disabled="true" value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    const items = el.shadowRoot?.querySelectorAll('.list-item');
    items?.forEach(item => {
      const checkbox = item.querySelector('sc-checkbox');
      if (checkbox && ['2', '3'].includes(checkbox.value)) {
        expect(item).to.have.attribute('disabled', 'true');
      }
    });
  });

  it('should not select disabled option', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select select-all>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2" disabled="true">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3" disabled="true">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    el.shouldRenderMenu = true;
    await el.updateComplete;
    const selectAllCheckbox = el.shadowRoot?.querySelector('#selectAllCheckbox') as HTMLInputElement;
    const checkboxes = el.shadowRoot?.querySelectorAll('sc-dropdown-option input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    selectAllCheckbox.checked = true;
    selectAllCheckbox.dispatchEvent(new Event('sc-change'));

    checkboxes.forEach(checkbox => {
      if (['2', '3'].includes(checkbox.value)) {
        expect(checkbox.checked).to.be.false;
      }
      else {
        expect(checkbox.checked).to.be.true;
      }
    });
  });

  it('should not render options with hideOption=true in virtual data', async () => {
    const dataWithHidden = [
      { label: 'Visible Option', value: 'visible', displayValue: 'Visible Option' },
      { label: 'Hidden Option', value: 'hidden', displayValue: 'Hidden Option', hideOption: true },
      { label: 'Visible Option 2', value: 'visible2', displayValue: 'Visible Option 2' },
    ];
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select .data=${dataWithHidden} label="Test hideOption"></sc-dropdown-multi-select>
    `);
    el.onDataChange(undefined, dataWithHidden);
    el.updateIndexDropdownOptions(el.immutableDropdownOptions);

    const allValues = Array.from(el.immutableDropdownOptions.values()).map(opt => opt.value);
    expect(allValues).to.not.include('hidden'); 

    const renderedValues = Array.from(el.dropdownOptionsWithIndex.values())
      .filter(opt => !opt.hideOption)
      .map(opt => opt.value);
    expect(renderedValues).to.include('visible');
    expect(renderedValues).to.include('visible2');
    expect(renderedValues).to.not.include('hidden');
  });

  it('renders readonly mode correctly', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select 
        readonly 
        label="Readonly dropdown" 
        tooltip="Readonly tooltip"
      >
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    expect(el.readonly).to.equal(true);
    expect(el.label).to.equal('Readonly dropdown');
    expect(el.tooltip).to.equal('Readonly tooltip');

    const readonlyInput = el.shadowRoot?.querySelector('sc-text-input');
    expect(readonlyInput).to.exist;
    expect(readonlyInput?.getAttribute('readonly')).to.be.null;
  });

  it('renders with slots correctly', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select>
        <span slot="label">Custom Label</span>
        <span slot="help">Help Text</span>
        <span slot="error">Error Message</span>
        <span slot="success">Success Message</span>
      </sc-dropdown-multi-select>
    `);

    const labelSlot = el.shadowRoot?.querySelector('slot[name="label"]')  as HTMLSlotElement;
    const helpSlot = el.shadowRoot?.querySelector('slot[name="help"]') as HTMLSlotElement;
    const errorSlot = el.shadowRoot?.querySelector('slot[name="error"]') as HTMLSlotElement;
    const successSlot = el.shadowRoot?.querySelector('slot[name="success"]') as HTMLSlotElement;

    expect(labelSlot).to.exist;
    expect(helpSlot).to.exist;
    expect(errorSlot).to.exist;
    expect(successSlot).to.exist;
  });

  it('renders default search field', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select 
        multiple-rows 
        label="Select from dropdown" 
        tooltip="Select from dropdown" 
        advanced-search-text="Advanced search"
      >
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    // Verify default properties
    expect(el.multipleRows).to.equal(true);
    expect(el.label).to.equal('Select from dropdown');
    expect(el.tooltip).to.equal('Select from dropdown');
    expect(el.selectAll).to.equal(false);
    expect(el.hideCheckbox).to.equal(false);
    expect(el.readonly).to.equal(false);

    // Verify rendered content
    const label = el.shadowRoot?.querySelector('.sc-dropdown-input.multiple');
    expect(label).to.exist;
    expect(label?.classList.contains('no-label')).to.equal(false);

    const dropdown = el.shadowRoot?.querySelector('sl-dropdown');
    expect(dropdown).to.exist;

    const options = el.querySelectorAll('sc-dropdown-option');
    expect(options.length).to.equal(2);
    expect(options[0].getAttribute('value')).to.equal('1');
    expect(options[0].textContent?.trim()).to.equal('Option1');
    expect(options[1].getAttribute('value')).to.equal('2');
    expect(options[1].textContent?.trim()).to.equal('Option2');
  });
  
  it('renders max count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select 
        max-count=2
        label="Select from dropdown" 
        tooltip="Select from dropdown" 
        advanced-search-text="Advanced search"
      >
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    expect(el.maxCount).to.equal(2);
    expect(el.isOverflow).to.equal(false);
  });
  it('should render with auto-create-tag and tag-type attributes', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select auto-create-tag tag-type="success"></sc-dropdown-multi-select>
    `);
    expect(el.autoCreateTag).to.be.true;
    expect(el.tagType).to.equal('success');
  });
  
  it('should add a tag when pressing Enter and no results, if auto-create-tag is true', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select auto-create-tag></sc-dropdown-multi-select>
    `);
    el.searchValue = 'newtag';
    el._value = [];
    // Simulate Enter keydown
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    el.handleInputMousedown(event);
    expect(el._value).to.include('newtag');
  });

  it('should emit sc-select event when tag is auto-created', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select auto-create-tag></sc-dropdown-multi-select>
    `);
    el.searchValue = 'newtag';
    el._value = [];
    setTimeout(() => { el.handleInputMousedown(new KeyboardEvent('keydown', { key: 'Enter' })); }, 0);
    const event = await oneEvent(el, 'sc-select');
    expect(event.detail.allValues).to.include('newtag');
  });

  it('should use the correct tag type for closable tags', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select tag-type="warning" .value=${['tag1']}></sc-dropdown-multi-select>
    `);
    expect(el.tagType).to.equal('warning');
  });
});

describe('mobile responsive', () => {
  beforeAll(() => mockMatchMedia());
  afterAll(() => mockMatchMedia.stopMocking());

  it('renders in mobile', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select 
        multiple-rows 
        label="Select from dropdown" 
        tooltip="Select from dropdown" 
        advanced-search-text="Advanced search"
      >
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);
    await el.updateComplete;
    mockMatchMedia.toggle(el.mediaQuery.mobileLg.media);
    el.requestUpdate();
    await el.updateComplete;

    expect(el.isMobile).to.equal(true);
    expect(el.isTablet).to.equal(false);
    expect(el.isDesktop).to.equal(false);
    expect(el.shadowRoot?.querySelector('sc-bottom-sheet')).to.exist;
    // disconnect coverage
    el.remove();
  });
  
  it('renders max count', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select 
        max-count=2
        label="Select from dropdown" 
        tooltip="Select from dropdown" 
        advanced-search-text="Advanced search"
      >
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option value="3">Option3</sc-dropdown-option>
      </sc-dropdown-multi-select>
    `);

    expect(el.maxCount).to.equal(2);
    expect(el.isOverflow).to.equal(false);
  });
  
  it('should render with auto-create-tag and tag-type attributes', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select auto-create-tag tag-type="success"></sc-dropdown-multi-select>
    `);
    expect(el.autoCreateTag).to.be.true;
    expect(el.tagType).to.equal('success');
  });
  
  it('should add a tag when pressing Enter and no results, if auto-create-tag is true', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select auto-create-tag></sc-dropdown-multi-select>
    `);
    el.searchValue = 'newtag';
    el._value = [];
    // Simulate Enter keydown
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    el.handleInputMousedown(event);
    expect(el._value).to.include('newtag');
  });

  it('should use the correct tag type for closable tags', async () => {
    const el = await fixture<ScDropdownMultiSelect>(html`
      <sc-dropdown-multi-select tag-type="warning" .value=${['tag1']}></sc-dropdown-multi-select>
    `);
    expect(el.tagType).to.equal('warning');
  });
});

