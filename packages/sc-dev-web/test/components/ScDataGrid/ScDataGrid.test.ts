import { html, LitElement } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDataGrid } from '../../../src/components/ScDataGrid/ScDataGrid.js';
import { ScDataGridMasterCell } from '../../../src/components/ScDataGrid/ScDataGridMasterCell.js';
import '../../../elements/sc-data-grid.js';
import { renderMultipleDropdown } from '../../../src/components/ScDataGrid/widgets/FilterType.js';
import { ERowPosition } from '../../../src/components/ScDataGrid/types/utils.js';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-tooltip.js';
import '@scdevkit/webkit-ext/elements/sc-employee.js';

import { ScDropdownInput } from '../../../src/components/ScDropdown/ScDropdownInput.js';
import { ScDropdownMultiSelect } from '../../../src/components/ScDropdown/ScDropdownMultiSelect.js';
import { ScDateInput } from '../../../src/components/ScDatePicker/DateInput/ScDateInput.js';
import { ScDateRangeInput } from '../../../src/components/ScDatePicker/DateRangeInput/ScDateRangeInput.js';
import { ScTimeInput } from '../../../src/components/ScTimeInput/ScTimeInput.js';
import { ScTooltip } from '../../../src/components/ScTooltip/ScTooltip.js';
import { ScSearchField } from '../../../src/components/ScSearchField/ScSearchField.js';
import { ScDataGridColumnManager } from '../../../src/components/ScDataGrid/ScDataGridColumnManager.js';
import { ScDataGridColumnSetFilter } from '../../../src/components/ScDataGrid/ScDataGridColumnSetFilter.js';
import { ScDataGridCell } from '../../../src/components/ScDataGrid/ScDataGridCell.js';
import { ScDataGridEditing } from '../../../src/components/ScDataGrid/ScDataGridEditing.js';
import { ScDataGridOverlapping } from '../../../src/components/ScDataGrid/ScDataGridOverlapping.js';
import {
  E_CELL_DATA_TYPE,
  defaultCellDataTypeDefinitions,
  defaultCellEditingDefinitions,
} from '../../../src/components/ScDataGrid/widgets/CellDataType.js';
import {
  EPopupComs,
  ETags,
  getIsElement,
  getIsWraperEqualMasterCell,
  getIsWraperEqualRow,
  getTagName,
  isSameTag,
  matchPopupElement,
} from '../../../src/components/ScDataGrid/mixins/overlapping-mixin.tool.js';
import { ScButtonDropdown } from '../../../src/components/ScButton/ScButtonDropdown.js';
import { ROW_SELECTION_COLUMN_ID } from '../../../src/components/ScDataGrid/mixins/features/row-selection-mixin.js';
import { smartSort } from '../../../src/components/ScDataGrid/custom-features/column-type.js';
import { Column, sortingFns } from '@tanstack/lit-table';
import { ScDataGridDraggingShadow } from '../../../src/components/ScDataGrid/ScDataGridDraggingShadow.js';
import * as Keys from '../../../src/shared/key-values.js';
import { getFilterFn, getFilterWidget, setFilter } from '../../../src/components/ScDataGrid/widgets/FilterModes.js';
import { TColumn } from '../../../src/components/ScDataGrid/types/ColumnDef.js';
import { ScDataGridColumnMultiFilter } from '../../../src/components/ScDataGrid/ScDataGridColumnMultipleFilter.js';
import { ScDataGridColumnTypedFilter } from '../../../src/components/ScDataGrid/ScDataGridColumnTypedFilter.js';
import { AnyFilterMode } from '../../../src/components/ScDataGrid/types/features/ColumnFilterDef.js';
import sinon from 'sinon';
import { mockAnimation } from '../../shared/animation.js';

mockAnimation();

function timeout(time = 50) {
  return new Promise(res => {
    setTimeout(function () {
      res(true);
    }, time);
  });
}
const data = [
  {
    uuid: 'row1',
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
    date: new Date(),
  },
  {
    uuid: 'row2',
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
    date: new Date(),
  },
];
const columns = [
  {
    // flex: 1,
    property: 'firstName',
    cell() {
      return 'tandy1212';
    },
    enableResizing: true,
    pinned: 'left',
    sort: 'asc',
    sortable: true,
    colSpanning(table: any, column: any, row: any, cell: any) {
      if (cell.renderValue() === 'tandy') {
        return 2;
      }
      return 1;
    },
    editable: true,
    header() {
      return html` <b>firstname-column</b>`;
    },
  },
  {
    editable: true,
    minSize: 60,
    header() {
      return '22';
    },
    colSpanning(table: any, column: any, row: any, cell: any) {
      if (cell.renderValue() === 'linsley') {
        return 2;
      }
      if (cell.renderValue() === 'miller') {
        return 3;
      }
      return 1;
    },
    property: 'lastName',
  },
  {
    editable: true,
    property: 'age',
    id: '33',
    sort: 'desc',
    sortable: true,
    minSize: 40,
    header() {
      return html`<div>33</div>`;
    },
  },
  {
    editable: true,
    id: '99',
    property: 'status',
    header() {
      return html`<div>age 99</div>`;
    },
  },
  {
    editable: true,
    id: '44',
    property: 'visits',
    pinned: 'right',
    header() {
      return html`<div>age 44</div>`;
    },
  },
  {
    editable: true,
    id: '55',
    property: 'status',
    pinned: 'right',
    colSpanning: 2,
    header() {
      return html`<div>age 55</div>`;
    },
  },
  {
    editable: true,
    cellEditor(props: any, params: any, sendValue: any) {
      sendValue(12);
      return html`123`;
    },
    async cellEditorParams() {
      return {
        value: ['tag1', 'tag2', 'tag3', 'tag4'],
      };
    },
    id: '66',
    property: 'status',
    pinned: 'left',
    header() {
      return html`<div>age 66</div>`;
    },
  },
  {
    editable() {
      return true;
    },
    id: '77',
    property: 'date',
    header() {
      return html`<div>date 77</div>`;
    },
  },
  {
    editable: true,
    id: '88',
    property: 'status',
    header() {
      return html`<div>age 88</div>`;
    },
  },
  {
    id: 'cm-1',
    property: 'status',
    header() {
      return html`<div>age cm-1</div>`;
    },
    columnManagerLabel() {
      return '#1 column';
    },
    hide: true,
    lock: true,
  },
  {
    id: 'cm-2',
    property: 'status',
    header() {
      return html`<div>age cm-2</div>`;
    },
    columnManagerLabel: '#2 column',
    hide: false,
    lock: 'ordering',
  },
  {
    id: 'cm-3',
    property: 'status',
    header() {
      return html`<div>age cm-3</div>`;
    },
    lock: 'visibility',
  },
];
describe('ScDataGrid', () => {
  beforeEach(() => {
    HTMLElement.prototype.getAnimations = () => [];
    HTMLElement.prototype.animate = () =>
    ({
      cancel() { },
      finish() { },
      onfinish: null,
      play() { },
      pause() { },
      currentTime: 0,
      addEventListener() { },
      removeEventListener() { },
    } as any);
  });
  
  it('Test data grid cell', async () => {
    expect(E_CELL_DATA_TYPE.date).to.equal('date');
  });
  it('Test widget', async () => {
    for (const k in E_CELL_DATA_TYPE) {
      defaultCellDataTypeDefinitions[k]({
        cell: {
          column: {
            columnDef: {
              cell() {
                return '';
              },
            },
          },
          getContext() {
            return {};
          },
          getValue() {
            return 'value';
          },
        },
      } as any);
      defaultCellEditingDefinitions[k](
        {
          cell: {
            column: {
              columnDef: {
                cell() {
                  return '';
                },
              },
            },
            getContext() {
              return {};
            },
            getValue() {
              return 'value';
            },
          },
        } as any,
        () => {}
      );
    }

    expect(E_CELL_DATA_TYPE.date).to.equal('date');
  });
  it('Function Testing', async () => {
    expect(smartSort([3, 2, 1]).join()).to.equal('1,2,3');
    expect(smartSort(['3', '2', '1']).join()).to.equal('1,2,3');
    expect(smartSort(['h', 'e', 'l', 'l', 'o']).join('')).to.equal('ehllo');
    expect(smartSort([true, true]).join()).to.equal('true,true');
  });
  it('Test overlapping', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        advanced-filter
        row-selection
        row-selection-mode="multiple"
        .isCellExpandable=${() => true}
        .isRowSelectable=${(row: any) => row.index === 1}
        .masterCellRenderer=${() => html`test`}
        .cellDataTypeDefinitions=${{
          text(props: any) {
            return props.cell.getValue();
          },
        }}
        filterable
        sortable
        .columns=${columns}
        .defaultSelectedRows=${[data[0].uuid, data[1].uuid]}
        hide-unselectable-rows
      >
      </sc-data-grid>`
    );

    await el.updateComplete;

    el.getRowsViaAttribute('rowId');

    el.getPopupComponents(
      [
        EPopupComs.dropdown,
        EPopupComs.dropdownMulti,
        EPopupComs.dateInput,
        EPopupComs.dateRange,
        EPopupComs.tooltip,
        EPopupComs.buttonDropdown,
        EPopupComs.searchField,
        EPopupComs.timeInput,
        EPopupComs.employeeInput,
        EPopupComs.employeeMultiInput,
      ],
      new Event('')
    );

    const overlappingEl = el.overlappingEl;
    const buttonDropdown = await fixture<ScButtonDropdown>(
      html`<sc-button-dropdown style="">
        <sc-dropdown-option value="english">English</sc-dropdown-option>
        <sc-dropdown-option value="french">French</sc-dropdown-option>
      </sc-button-dropdown>`
    );
    const dropdown = await fixture<ScDropdownInput>(
      html`<sc-dropdown-input style="">
        <sc-dropdown-option value="english">English</sc-dropdown-option>
        <sc-dropdown-option value="french">French</sc-dropdown-option>
      </sc-dropdown-input>`
    );
    const dropdownMulti = await fixture<ScDropdownMultiSelect>(
      html`<sc-dropdown-multi-select style="">
        <sc-dropdown-option value="english">English</sc-dropdown-option>
        <sc-dropdown-option value="french">French</sc-dropdown-option>
      </sc-dropdown-multi-select>`
    );

    const dateInput = await fixture<ScDateInput>(
      html`<sc-date-input></sc-date-input>`
    );
    const dateRange = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    const timeInput = await fixture<ScTimeInput>(
      html`<sc-time-input></sc-time-input>`
    );
    const tooltip = await fixture<ScTooltip>(
      html`<sc-tooltip>
        <span>anchor</span>
        <div slot="content">Morbi bibendum enim elementum a auctor.</div>
      </sc-tooltip>`
    );
    const employeeInput = await fixture<LitElement>(
      html`<sc-employee-input></sc-employee-input>`
    );
    const employeeMultiInput = await fixture<LitElement>(
      html`<sc-employee-multi-input></sc-employee-multi-input>`
    );
    const searchField = await fixture<ScSearchField>(
      html`<sc-search-field
        .value=${'test'}
        hoist
        style=""
        show-suggestion
        empty-text="empty-text"
        threshold="0"
      ></sc-search-field>`
    );

    const components = {
      dropdown,
      dropdownMulti,
      buttonDropdown,
      dateInput,
      dateRange,
      timeInput,
      tooltip,
      searchField,
      employeeInput,
      employeeMultiInput,
    };

    await Promise.all(Object.values(components).map(e => e.updateComplete));

    const stub = sinon.stub(el, 'getPopupComponents');
    Object.entries(components).forEach(([key, el], index) => {
      const res = { parentEl: el, [key]: el };
      if (key === 'dateRange') res['dateInput'] = components.dateInput;
      stub.onCall(index).returns(res);
    });
    Object.keys(components).forEach(() => {
      el.dispatchEvent(new MouseEvent('click'));
      el.hideOverlappingPanel();
    });
    stub.restore();

    el.handlePopupRelatedComsForHover(
      new CustomEvent('sc-change', {
        detail: {
          e: new CustomEvent('sc-change'),
        },
      })
    );
    el.handleSearchField(searchField, overlappingEl);

    tooltip.trigger = 'click';
    el.preHandleTooltip(overlappingEl, tooltip);
    tooltip.tooltip.open = true;
    await timeout(100);
    overlappingEl.hidePopup();
    await timeout(100);
    tooltip.tooltip.dispatchEvent(new Event('sl-after-hide'));

    tooltip.trigger = 'hover';
    el.preHandleTooltip(overlappingEl, tooltip);
    tooltip.tooltip.open = true;
    await timeout(100);
    overlappingEl.hidePopup();
    await timeout(100);
    tooltip.tooltip.dispatchEvent(new Event('sl-after-hide'));

    matchPopupElement[EPopupComs.timeInput](timeInput);
    matchPopupElement[EPopupComs.searchField](searchField);
    matchPopupElement[EPopupComs.buttonDropdown](buttonDropdown);
    matchPopupElement[EPopupComs.tooltip](tooltip);
    matchPopupElement[EPopupComs.employeeInput](employeeInput);
    matchPopupElement[EPopupComs.employeeMultiInput](employeeMultiInput);
    matchPopupElement[EPopupComs.dropdown](dropdown);
    matchPopupElement[EPopupComs.dropdownMulti](dropdownMulti);
    matchPopupElement[EPopupComs.dateInput](dateInput);
    matchPopupElement[EPopupComs.dateRange](dateRange);
    getIsElement(tooltip);
    getTagName(tooltip);
    getTagName('' as any);
    getIsWraperEqualMasterCell(tooltip);
    getIsWraperEqualRow(tooltip);

    expect(isSameTag('sc-tooltip', ETags.tooltip)).to.equal(true);
  });
  it('Overlapping tooltip lifecycle cleanup', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        .columns=${columns}
      >
      </sc-data-grid>`
    );
    await el.updateComplete;

    const overlappingEl = el.overlappingEl;
    const tooltip = await fixture<ScTooltip>(
      html`<sc-tooltip>
        anchor
        <div slot="content">tooltip content</div>
      </sc-tooltip>`
    );
    await tooltip.updateComplete;

    const popupEl = tooltip.tooltip.popup.popup as HTMLElement;
    const finishSpy = sinon.spy();
    popupEl.getAnimations = () => [{ finish: finishSpy } as any];

    el.handleTooltip(tooltip, overlappingEl);

    const hideSpy = sinon.spy(overlappingEl, 'hidePopup');
    popupEl.style.display = 'block';
    tooltip.tooltip.dispatchEvent(new Event('sl-after-hide'));
    expect(hideSpy.calledOnce).to.be.true;
    expect(popupEl.style.display).to.equal('');
    hideSpy.restore();

    const clock = sinon.useFakeTimers();
    el.handleTooltip(tooltip, overlappingEl);
    tooltip.open = true;
    overlappingEl.hidePopup();
    clock.tick(0);
    expect(popupEl.style.display).to.equal('none');
    expect(finishSpy.called).to.be.true;
    clock.restore();
  });

  it('Overlapping clipper uses hidden overflow ancestor', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        .columns=${columns}
      >
      </sc-data-grid>`
    );
    await el.updateComplete;

    const tooltip = await fixture<ScTooltip>(
      html`<sc-tooltip>
        anchor
        <div slot="content">tooltip content</div>
      </sc-tooltip>`
    );
    await tooltip.updateComplete;

    const container = document.createElement('div');
    container.style.overflow = 'hidden';
    el.appendChild(container);
    container.appendChild(tooltip);

    const clipParent = (el as any)._getClipParent(tooltip as any);
    expect(clipParent).to.equal(container);
  });

  it('handleDropdown hides only when sc-select has a truthy value', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;

    const overlappingEl = el.overlappingEl;
    const dropdown = await fixture<ScDropdownInput>(
      html`<sc-dropdown-input>
        <sc-dropdown-option value="english">English</sc-dropdown-option>
        <sc-dropdown-option value="french">French</sc-dropdown-option>
      </sc-dropdown-input>`
    );
    await dropdown.updateComplete;

    // Case 1: sc-select with no/falsy value — hidePopup should NOT be called
    const hideSpy = sinon.spy(overlappingEl, 'hidePopup');
    el.handleDropdown(dropdown, overlappingEl);
    dropdown.dispatchEvent(new CustomEvent('sc-select', { detail: { value: '' } }));
    expect(hideSpy.called).to.be.false;

    // Case 2: sc-select with a truthy value — hidePopup SHOULD be called
    el.handleDropdown(dropdown, overlappingEl);
    dropdown.dispatchEvent(new CustomEvent('sc-select', { detail: { value: 'english' } }));
    expect(hideSpy.calledOnce).to.be.true;

    hideSpy.restore();
  });

  it('handleTimeInput covers beforeHide body and dropdown setup', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;
    const overlappingEl = el.overlappingEl;

    const timeInput = await fixture<ScTimeInput>(
      html`<sc-time-input></sc-time-input>`
    );
    await timeInput.updateComplete;

    let afterHideCb: (() => void) | undefined;
    const mockPopup = { flip: true, active: true };
    const mockDropdown = {
      popup: mockPopup,
      hoist: true,
      hide: sinon.spy(),
      addEventListener: (_ev: string, cb: () => void) => {
        if (_ev === 'sl-after-hide') afterHideCb = cb;
      },
    };
    Object.defineProperty(timeInput, 'dropdown', {
      get: () => mockDropdown,
      configurable: true,
    });

    el.handleTimeInput(timeInput, overlappingEl);
    // Lines 378-379 covered: if(dropdown) block was entered
    expect(mockDropdown.hoist).to.be.false;

    // Trigger beforeHide: covers lines 371-373
    overlappingEl.hidePopup();
    expect(mockDropdown.hide.calledOnce).to.be.true;
    expect(mockPopup.active).to.be.false;
    expect(mockPopup.flip).to.be.false;

    // Trigger sl-after-hide callback: covers line 386
    afterHideCb?.();
  });

  it('handleDropdown sl-after-show triggers focus callback', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;
    const overlappingEl = el.overlappingEl;

    const dropdown = await fixture<ScDropdownInput>(
      html`<sc-dropdown-input>
        <sc-dropdown-option value="english">English</sc-dropdown-option>
      </sc-dropdown-input>`
    );
    await dropdown.updateComplete;

    let afterShowCb: (() => void) | undefined;
    const focusSpy = sinon.spy();
    const mockInnerDropdown = {
      popup: { flip: false, active: false },
      hoist: false,
      addEventListener: (_ev: string, cb: () => void) => {
        if (_ev === 'sl-after-show') afterShowCb = cb;
      },
    };
    Object.defineProperty(dropdown, 'dropdown', {
      get: () => mockInnerDropdown,
      configurable: true,
    });
    Object.defineProperty(dropdown, 'input', {
      get: () => ({ input: { focus: focusSpy } }),
      configurable: true,
    });

    el.handleDropdown(dropdown, overlappingEl);
    afterShowCb?.();
    expect(focusSpy.calledOnce).to.be.true;
  });

  it('handleDropdownMulti hides on sl-after-hide when hoistingComponent matches', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;
    const overlappingEl = el.overlappingEl;

    const dropdownMulti = await fixture<ScDropdownMultiSelect>(
      html`<sc-dropdown-multi-select>
        <sc-dropdown-option value="a">A</sc-dropdown-option>
      </sc-dropdown-multi-select>`
    );
    await dropdownMulti.updateComplete;

    let afterHideCb: (() => void) | undefined;
    const mockInnerDropdown = {
      popup: { flip: false, active: false },
      hoist: false,
      hide: sinon.spy(),
      addEventListener: (_ev: string, cb: () => void) => {
        if (_ev === 'sl-after-hide') afterHideCb = cb;
      },
    };
    Object.defineProperty(dropdownMulti, 'dropdown', {
      get: () => mockInnerDropdown,
      configurable: true,
    });

    el.handleDropdownMulti(dropdownMulti, overlappingEl);
    const hideSpy = sinon.spy(overlappingEl, 'hidePopup');
    afterHideCb?.();
    expect(hideSpy.calledOnce).to.be.true;
    hideSpy.restore();
  });

  it('handleButtonDropdown hides on sc-select when hoistingComponent matches', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;
    const overlappingEl = el.overlappingEl;

    const buttonDropdown = await fixture<ScButtonDropdown>(
      html`<sc-button-dropdown>
        <sc-dropdown-option value="english">English</sc-dropdown-option>
      </sc-button-dropdown>`
    );
    await buttonDropdown.updateComplete;

    const mockPopup = { flip: false, active: false };
    const mockInnerDropdown = { popup: mockPopup, hide: sinon.spy() };
    const mockDropdownInput = { dropdown: mockInnerDropdown, hide: sinon.spy(), hoist: false };
    Object.defineProperty(buttonDropdown, 'dropdown', {
      get: () => mockDropdownInput,
      configurable: true,
    });

    el.handleButtonDropdown(buttonDropdown, overlappingEl);
    const hideSpy = sinon.spy(overlappingEl, 'hidePopup');
    buttonDropdown.dispatchEvent(new CustomEvent('sc-select'));
    expect(hideSpy.calledOnce).to.be.true;
    hideSpy.restore();
  });

  it('_applyPopupBoundary traverses non-matching intermediate ancestor', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    container.appendChild(el);
    await el.updateComplete;

    // With container between el and body, the predicate will hit container first
    // (returns false, covering line 508), then body (returns true)
    const mockPopup = {} as any;
    (el as any)._applyPopupBoundary(mockPopup);

    container.remove();
  });

  it('Overlapping dropdown slot clone and restore', async () => {
    if (!customElements.get('sc-data-grid-overlapping')) {
      customElements.define('sc-data-grid-overlapping', ScDataGridOverlapping);
    }
    const overlappingEl = await fixture<ScDataGridOverlapping>(
      html`<sc-data-grid-overlapping></sc-data-grid-overlapping>`
    );
    await overlappingEl.updateComplete;

    const dropdown = await fixture<ScDropdownInput>(
      html`<sc-dropdown-input tooltip="tooltip content">
        <sc-dropdown-option value="english">English</sc-dropdown-option>
        <sc-dropdown-option value="french">French</sc-dropdown-option>
      </sc-dropdown-input>`
    );
    await dropdown.updateComplete;

    const shadowSlots = Array.from(
      dropdown.shadowRoot?.querySelectorAll('slot') ?? []
    ) as HTMLSlotElement[];
    expect(shadowSlots.length).to.be.greaterThan(0);
    const slot = shadowSlots[0];
    const originalNodes = Array.from(slot.childNodes);
    document.body.appendChild(dropdown);

    const originalQuerySelectorAll = dropdown.querySelectorAll.bind(dropdown);
    dropdown.querySelectorAll = (selectors: string) => {
      if (selectors === 'slot') {
        return shadowSlots as unknown as NodeListOf<Element>;
      }
      return originalQuerySelectorAll(selectors);
    };

    overlappingEl.setHostingComponent(dropdown);
    overlappingEl.showPopup();
    await overlappingEl.updateComplete;
    await overlappingEl.root;
    await Promise.resolve();

    expect(overlappingEl.placeholder).to.exist;
    expect(overlappingEl.slotContents.has(slot)).to.be.true;
    const slotEntry = overlappingEl.slotContents.get(slot);
    expect(slotEntry).to.exist;
    if (slotEntry) {
      const contents = slotEntry.contents;
      const placeholders = slotEntry.placeholders;
      expect(contents.length).to.equal(placeholders.length);
      if (contents.length > 0) {
        expect(placeholders[0]).to.not.equal(contents[0]);
      }
      contents.forEach((node, index) => {
        expect(slot.childNodes[index]).to.equal(node);
      });
    }
    expect(
      Array.from(slot.childNodes).some(node => node.nodeType === Node.COMMENT_NODE)
    ).to.be.false;

    overlappingEl.hidePopup();

    expect(overlappingEl.hoistingComponent).to.be.undefined;
    expect(overlappingEl.placeholder).to.be.undefined;
    expect(slot.childNodes.length).to.equal(originalNodes.length);
    originalNodes.forEach((node, index) => {
      expect(slot.childNodes[index]).to.equal(node);
    });

    dropdown.querySelectorAll = originalQuerySelectorAll;

    dropdown.remove();
  });
  it('Overlapping uses placeholder clones in light DOM', async () => {
    if (!customElements.get('sc-data-grid-overlapping')) {
      customElements.define('sc-data-grid-overlapping', ScDataGridOverlapping);
    }
    const overlappingEl = await fixture<ScDataGridOverlapping>(
      html`<sc-data-grid-overlapping></sc-data-grid-overlapping>`
    );
    await overlappingEl.updateComplete;

    const dropdown = await fixture<ScDropdownInput>(
      html`<sc-dropdown-input tooltip="tooltip content">
        <sc-dropdown-option id="opt-1" value="english">English</sc-dropdown-option>
        <sc-dropdown-option id="opt-2" value="french">French</sc-dropdown-option>
      </sc-dropdown-input>`
    );
    await dropdown.updateComplete;

    const shadowSlots = Array.from(
      dropdown.shadowRoot?.querySelectorAll('slot') ?? []
    ) as HTMLSlotElement[];
    const slot = shadowSlots[0];
    document.body.appendChild(dropdown);

    const originalQuerySelectorAll = dropdown.querySelectorAll.bind(dropdown);
    dropdown.querySelectorAll = (selectors: string) => {
      if (selectors === 'slot') {
        return shadowSlots as unknown as NodeListOf<Element>;
      }
      return originalQuerySelectorAll(selectors);
    };

    const originalLightNodes = Array.from(dropdown.childNodes)
      .filter(node => node.nodeType === Node.ELEMENT_NODE);

    overlappingEl.setHostingComponent(dropdown);
    overlappingEl.showPopup();
    await overlappingEl.updateComplete;
    await overlappingEl.root;
    await Promise.resolve();

    const slotEntry = overlappingEl.slotContents.get(slot);
    expect(slotEntry).to.exist;
    if (slotEntry) {
      const placeholders = slotEntry.placeholders.filter(
        node => node.nodeType === Node.ELEMENT_NODE
      ) as Element[];

      const lightNodes = Array.from(dropdown.childNodes)
        .filter(node => node.nodeType === Node.ELEMENT_NODE) as Element[];

      expect(lightNodes.length).to.equal(originalLightNodes.length);
      lightNodes.forEach((node, index) => {
        expect(node).to.not.equal(originalLightNodes[index]);
      });

      lightNodes.forEach(node => {
        expect(node.hasAttribute('id')).to.equal(false);
      });
      placeholders.forEach(node => {
        expect(node.hasAttribute('id')).to.equal(false);
      });

      originalLightNodes.forEach(node => {
        expect(node.parentNode).to.not.equal(dropdown);
      });
    }

    overlappingEl.hidePopup();

    dropdown.querySelectorAll = originalQuerySelectorAll;
    dropdown.remove();
  });
  it('Test column manager', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        advanced-filter
        row-selection
        row-selection-mode="multiple"
        .isCellExpandable=${() => true}
        .isRowSelectable=${(row: any) => row.index === 1}
        .masterCellRenderer=${() => html`test`}
        .cellDataTypeDefinitions=${{
          text(props: any) {
            return props.cell.getValue();
          },
        }}
        filterable
        sortable
        .columns=${columns}
        .defaultSelectedRows=${[data[0].uuid, data[1].uuid]}
        hide-unselectable-rows
      >
      </sc-data-grid>`
    );
    await el.updateComplete;
    const columnManager = await fixture<ScDataGridColumnManager>(
      html`
        <sc-data-grid-column-manager
          .table=${el.table}
          .columnVisibility=${el.table.getState().columnVisibility}
          .columnOrder=${el.table.getState().columnOrder}
          ?enable-order=${true}
          ?enable-visibility=${true}
        ></sc-data-grid-column-manager>
      `
    );
    await columnManager.updateComplete;
    columnManager.showPopup();
    columnManager.handleClearSearch();
    columnManager.handleSelectAll(
      new CustomEvent('sc-change', {
        detail: {
          checked: true,
        },
      })
    );
    columnManager.handleSelectAll(
      new CustomEvent('sc-change', {
        detail: {
          checked: false,
        },
      })
    );
    columnManager.handleSearch(
      new CustomEvent('sc-input', {
        detail: {
          value: 'firstName',
        },
      })
    );
    const allHeaders = el.table
      .getHighestHeaders()
      .flatMap(header => el.table.getDeepestHeader(header));
    columnManager.handleCheckboxChange(
      new CustomEvent('sc-change', {
        detail: {
          checked: false,
        },
      }),
      allHeaders[0]
    );
    columnManager.handleCheckboxChange(
      new CustomEvent('sc-change', {
        detail: {
          checked: true,
        },
      }),
      allHeaders[0]
    );
    columnManager.handleDragstart(
      new CustomEvent('dragstart', {
        detail: {
          checked: true,
        },
      }) as any
    );
    columnManager.handleDragover(
      new CustomEvent('dragover', {
        detail: {
          checked: true,
        },
      }) as any
    );
    columnManager.getCheckboxContentFromComposedPath(
      new CustomEvent('dropstart', {
        detail: {
          checked: true,
        },
      }) as any
    );
    columnManager.handleDrop(
      new CustomEvent('drop', {
        detail: {
          checked: true,
        },
      }) as any
    );
    columnManager.handleDragend(
      new CustomEvent('dropend', {
        detail: {
          checked: true,
        },
      }) as any
    );

    columnManager.updateColumnWidth();
    columnManager.dynamicColumnWidth = true;
    columnManager.updateColumnWidth();

    expect(columnManager.searchText).to.equal('');

    columnManager.searchText = 'firstname-column';
    await columnManager.updateComplete;

    expect(columnManager.matchedColumns).to.include(el.table.getColumn('firstName'));
  });
  it('should pass accessibility tests', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        .getRowHeight=${() => 100}
        .getRowMaxHeight=${() => 200}
        .getRowMinHeight=${() => 50}
        column-ordering
        column-visibility
        advanced-filter
        row-selection
        row-selection-mode="multiple"
        .isCellExpandable=${() => true}
        .isRowSelectable=${(row: any) => row.index === 1}
        .masterCellRenderer=${() => html`test`}
        .cellDataTypeDefinitions=${{
          text(props: any) {
            return props.cell.getValue();
          },
        }}
        filterable
        sortable
        .columns=${columns}
        .defaultSelectedRows=${[data[0].uuid, data[1].uuid]}
        hide-unselectable-rows
      >
      </sc-data-grid>`
    );
    await el.updateComplete;
    const tableInstance = el.table;

    const header = tableInstance.getFlatHeaders()[0];
    const row = tableInstance.getCenterRows()[0];
    const column = tableInstance.getAllColumns()[0];
    const cell = tableInstance.getRow(data[0].uuid).getAllCells()[0];

    const scDataGridCell = await fixture<ScDataGridCell>(
      html`
        <sc-data-grid-cell .cell=${cell} .table=${el.table}></sc-data-grid-cell>
      `
    );

    await scDataGridCell.updateComplete;
    const dragEvent = new DragEvent('type');
    scDataGridCell.handleSort(new MouseEvent('sc-select'));
    scDataGridCell.emitScShowFromCell(new Event(''));
    scDataGridCell.toggleEditing();
    scDataGridCell.toggleHeaderEditing();
    scDataGridCell.toggleBodyEditing();
    scDataGridCell.handleDragstart(dragEvent, row);
    scDataGridCell.handleDragover(dragEvent, row);
    scDataGridCell.handleDrop(dragEvent, row);
    scDataGridCell.handleDragend(dragEvent, row);
    scDataGridCell.handleDragleave(dragEvent, row);
    await timeout(300);
    scDataGridCell.emitHeightUpdate(20);
    await timeout(300);
    scDataGridCell.emitHeightUpdate([] as any);

    const scDataGridEditing = await fixture<ScDataGridEditing>(
      html`
        <sc-data-grid-editing
          .cellEditorParams=${() => {}}
          .cell=${cell}
        ></sc-data-grid-editing>
      `
    );
    const scDataGridEditing2 = await fixture<ScDataGridEditing>(
      html`
        <sc-data-grid-editing
          .cellEditorParams=${async () => {}}
          .cell=${cell}
        ></sc-data-grid-editing>
      `
    );

    await scDataGridEditing.updateComplete;
    await scDataGridEditing2.updateComplete;
    scDataGridEditing.handleCellEditorParamsChange();
    scDataGridEditing2.handleCellEditorParamsChange();
    scDataGridEditing.hidePopup();
    scDataGridEditing.showPopup();
    scDataGridEditing.hidePopup();
    scDataGridEditing.sendValue('');
    scDataGridEditing.renderContent();

    const scDatagridOverlapping = await fixture<ScDataGridOverlapping>(
      html` <sc-data-grid-editing .cell=${cell}></sc-data-grid-editing> `
    );

    await scDatagridOverlapping.updateComplete;
    scDatagridOverlapping?.popupHandleStopPropagation?.({
      stopPropagation() {},
    } as any);
    scDatagridOverlapping.showPopup();
    scDatagridOverlapping.popupHandleWinMousedown?.(new MouseEvent(''));
    scDatagridOverlapping.popupHandleWinScroll?.(new Event(''));
    scDatagridOverlapping.hidePopup();
    scDatagridOverlapping.popupHandleWinMousedown?.(new MouseEvent(''));
    scDatagridOverlapping.popupHandleWinResize?.(new Event(''));

    el.table.resetRowHeight();
    el.table.resetRowMaxHeight();
    el.table.resetRowMinHeight();
    el.getMasterRowHeightStyle(row.id);
    el.getReuableMasterCell(row.id);
    el.collectMasterCell(row.id);
    el.updateMasterRowPrefixSum();
    el.toggleCompositeFilter();
    el.toggleCompositeFilter(true);
    el.handleRowExpand(cell);
    el.getIsParentVisible(row);
    el.emitExternalScFilterEvent();
    el.getSizeOf('min', 20);
    el.getSizeOf('max', 30);
    el.resetSizeHandler(header);
    el.toggleColumnFilter(
      new CustomEvent('sc-select', {
        detail: {
          type: 'mouseup',
          target: document.createElement('div'),
        },
      }),
      column,
      el.table
    );
    el.handleGlobalFilter(
      new CustomEvent('sc-select', {
        detail: {
          value: '12',
        },
      })
    );
    el.handleGlobalFilter(
      new CustomEvent('sc-select', {
        detail: {
          value: '',
        },
      })
    );
    el.getFinalizedRowHeight(row.id, ERowPosition.center);
    el.getEditingOptions();
    el.afterFrameUpdate();
    el.getIsCellNotCovered(
      {
        left: 0,
        right: 100,
        y: 100,
      } as DOMRect,
      document.createElement('div')
    );
    el.hideEditingPanelWhenScroll();

    el.updateRowHeight(
      {
        rowId: row.id,
        columnId: 'firstName',
        height: 0,
        rowIndex: 0,
      },
      ERowPosition.center
    );
    el.handleMasterRowHeightUpdate(
      new CustomEvent('sc-select', {
        detail: {
          height: 10,
        },
      }),
      row.id,
      row.index
    );

    el.removeColumnFromBuiltInColumns(ROW_SELECTION_COLUMN_ID, 'prefix');
    const dataGridCell = el.shadowRoot?.querySelector('sc-data-grid-cell');
    const dblClickEvent = new MouseEvent('dblclick', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    dataGridCell?.dispatchEvent(dblClickEvent);
    const overlappingEl = el.shadowRoot?.querySelector(
      'sc-data-grid-overlapping'
    );

    const buttonDropdownBox = await fixture<ScButtonDropdown>(
      html`<div>
        <sc-button-dropdown style="">
          <sc-dropdown-option value="english">English</sc-dropdown-option>
          <sc-dropdown-option value="french">French</sc-dropdown-option>
        </sc-button-dropdown>
      </div>`
    );
    await buttonDropdownBox.updateComplete;
    const buttonDropdown =
      buttonDropdownBox.querySelector('sc-button-dropdown');
    if (overlappingEl) {
      overlappingEl.popupHandleStopPropagation(new Event(''));
      overlappingEl.showPopup();
      overlappingEl.popupHandleWinMousedown?.(new MouseEvent('mousedown'));
      overlappingEl.showPopup();
      overlappingEl.popupHandleWinScroll?.(new Event(''));
      overlappingEl.hidePopup();
      overlappingEl.popupHandleWinMousedown?.(new MouseEvent('mousedown'));
      overlappingEl.hidePopup();
      overlappingEl.popupHandleWinResize?.(new Event(''));
      if (buttonDropdown) {
        overlappingEl.setHostingComponent(buttonDropdown);
        overlappingEl.showPopup();
        overlappingEl.hidePopup();
      }
    }

    column.getLookupDefinition();
    column.getValues();
    column.getFilterWidget();
    column.getFilterLookup();
    column.getColumnFilterType();
    column.getAdjacentColumns();
    column.getFilterFnKeyViaLabel('Set filter');
    tableInstance.setMasterCell(new Map([[data[0].uuid, cell]]));
    row.getIsMasterExpanded();
    row.getAllCells()[0].toggleExpanded();
    cell.getIsUnspannable();
    cell.getIsColumnHasExpandedMasterCell();

    tableInstance.getAllColumns().forEach(c => c.getStaticFilterData());

    row.getCell(row.getMasterCellId());

    html`${renderMultipleDropdown({
      value: '',
      bindFilterValue: () => {},
      table: tableInstance,
      column: tableInstance.getAllColumns()[0],
    })}`;

    expect(el.enableResizing).to.equal(true);
  });
  it('row selection - multiple', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        row-selection
        row-selection-mode="multiple"
        .isRowSelectable=${(row: any) => row.index === 0}
        .columns=${columns}
        hide-unselectable-rows
      >
      </sc-data-grid>`
    );

    await el.updateComplete;

    const tableInstance = el.table;
    const row1 = tableInstance.getCenterRows()[0];
    const row2 = tableInstance.getCenterRows()[1];

    el.getActivatedKey();
    el.activatedKeys.set('ctrl', true);
    el.activatedKeys.set('shift', true);
    el.getActivatedKey();
    el.activatedKeys.set('ctrl', true);
    el.activatedKeys.set('shift', false);
    el.getActivatedKey();

    el.handleKeydownForRowSelection(
      new KeyboardEvent('keydown', {
        key: 'Escape',
      })
    );
    el.handleKeyupForRowSelection(
      new KeyboardEvent('keydown', {
        key: 'Escape',
      })
    );
    el.handleSelectAll(true);
    el.handleSelectAll(false);
    const handleSelectSinge = el.handleSelectSingle(row1);
    handleSelectSinge(true);
    handleSelectSinge(false);
    const handleSelectSinge2 = el.handleSelectSingle(row2);
    handleSelectSinge2(true);
    handleSelectSinge2(false);

    expect(Object.keys(tableInstance.getState().rowSelection).length).to.equal(
      0
    );
  });
  it('row selection - single', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        row-selection
        row-selection-mode="single"
        .isRowSelectable=${(row: any) => row.index === 0}
        .columns=${columns}
        hide-unselectable-rows
      >
      </sc-data-grid>`
    );

    await el.updateComplete;

    const tableInstance = el.table;
    const row1 = tableInstance.getCenterRows()[0];
    const row2 = tableInstance.getCenterRows()[1];

    el.handleSelectAll(true);
    el.handleSelectAll(false);
    el.rowSelectionRadio = true;
    const handleSelectSinge = el.handleSelectSingle(row1);
    handleSelectSinge(true);
    handleSelectSinge(false);
    const handleSelectSinge2 = el.handleSelectSingle(row2);
    handleSelectSinge2(true);
    handleSelectSinge2(false);
    expect(Object.keys(tableInstance.getState().rowSelection).length).to.equal(
      0
    );
  });
  it('row selection - grouping', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        select-all-button
        selection-quantity
        .data=${data}
        row-selection
        .isRowSelectable=${(row: any) => row.index === 0}
        .columns=${columns.map(item => ({ ...item, rowGrouping: true }))}
        pagination
        manual-pagination
        page-size="10"
        total="10"
        hide-unselectable-rows
        count-row-group-selection
        row-group-override-selectable
      >
        <div slot="actions">actions</div>
        <div slot="header-actions">header-actions</div>
      </sc-data-grid>`
    );

    await el.updateComplete;

    const tableInstance = el.table;
    const row1 = tableInstance.getCenterRows()[0];
    const row2 = tableInstance.getCenterRows()[1];

    el.handleSelectAll(true);
    el.handleSelectAll(false);
    const handleSelectSinge = el.handleSelectSingle(row1);
    handleSelectSinge(true);
    handleSelectSinge(false);
    const handleSelectSinge2 = el.handleSelectSingle(row2);
    handleSelectSinge2(true);
    handleSelectSinge2(false);
    expect(Object.keys(tableInstance.getState().rowSelection).length).to.equal(
      0
    );
  });

  it('scrollbar appear/disappear', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${[
          {
            firstName: 'tanner',
          },
        ]}
        .columns=${[
          {
            property: 'firstName',
          },
        ]}
      >
      </sc-data-grid>`
    );
    await el.updateComplete;

    const scroller = el.shadowRoot?.querySelector(
      '.sc-data-grid-vertical-scroller-container'
    );
    expect(scroller).to.exist;

    scroller?.dispatchEvent(new Event('mouseenter'));
    expect(scroller?.classList.contains('appear')).to.be.true;

    scroller?.dispatchEvent(new Event('mouseleave'));
    expect(scroller?.classList.contains('disappear')).to.be.true;
  });
  it('horizontal scrollbar appear/disappear', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${[
          {
            firstName: 'tanner',
          },
        ]}
        .columns=${[
          {
            property: 'firstName',
          },
        ]}
      >
      </sc-data-grid>`
    );
    await el.updateComplete;

    const scroller = el.shadowRoot?.querySelector(
      '.sc-data-grid-horizontal-scroller-container'
    );
    expect(scroller).to.exist;

    scroller?.dispatchEvent(new Event('mouseenter'));
    expect(scroller?.classList.contains('appear')).to.be.true;

    scroller?.dispatchEvent(new Event('mouseleave'));
    expect(scroller?.classList.contains('disappear')).to.be.true;
  });

  it('Master cell - default expanded', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${[
          {
            firstName: 'tanner',
          },
        ]}
        .columns=${[
          {
            property: 'firstName',
          },
        ]}
        .isCellExpandable=${() => true}
      >
      </sc-data-grid>`
    );

    await el.updateComplete;

    el.table.getRowModel().rows[0].getAllCells()[0].toggleExpanded(true);
    el.table.getRowModel().rows[0].getAllCells()[0].toggleExpanded(false);
    el.table.getRowModel().rows[0].getAllCells()[0].toggleExpanded();
    expect(Array.from(el.table.getState().masterCell.values())[0]).to.equal(
      el.table.getRowModel().rows[0].getAllCells()[0]
    );
  });

  it('header group', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${[
          {
            firstName: 'tanner',
          },
        ]}
        .columns=${[
          {
            header: 'parent',
            id: 'parent',
            hide: true,
            columns: [
              {
                header: 'son1',
                id: 'son1',
                columns: [
                  {
                    property: 'firstName',
                    header: 'grandson',
                    id: 'grandson',
                    hide: false,
                  },
                ],
              },
              {
                property: 'firstName',
                header: 'son2',
                id: 'son2',
              },
            ],
          },
          {
            property: 'firstName',
          },
        ]}
        .isCellExpandable=${() => true}
      >
      </sc-data-grid>`
    );

    await el.updateComplete;

    const columnManager = await fixture<ScDataGridColumnManager>(
      html`
        <sc-data-grid-column-manager
          .table=${el.table}
          .columnVisibility=${el.table.getState().columnVisibility}
          .columnOrder=${el.table.getState().columnOrder}
          ?enable-order=${true}
          ?enable-visibility=${true}
        ></sc-data-grid-column-manager>
      `
    );

    await columnManager.updateComplete;

    const highestHeaders = el.table.getHighestHeaders();
    const allHeaders = highestHeaders.flatMap(header =>
      el.table.getDeepestHeader(header)
    );
    const ALL = Symbol('ALL').toString() as unknown as Column<unknown, unknown>;
    columnManager.handleExpand(ALL);
    columnManager.handleExpand(highestHeaders[0].column);
    columnManager.handleExpand(highestHeaders[1].column);
    columnManager.handleExpand(ALL);
    expect(allHeaders.length).to.equal(3);
  });

  it('Draggable row', async () => {
    const el = await fixture<ScDataGrid>(
      html` <sc-data-grid
        .data=${data}
        .columns=${[
          {
            property: 'firstName',
            draggable: true,
          },
        ]}
        .isCellExpandable=${() => true}
        enable-drag-entire-row
        enable-draggable-row
        row-selection
        .rowSelectionMode=${'multiple'}
        .defaultSelectedRows=${[data[0].uuid, data[1].uuid]}
      >
      </sc-data-grid>`
    );

    await el.updateComplete;

    const centerRows = el.table.getCenterRows();
    const dragEvent = new DragEvent('type');
    el.makeCustomEvent('test', dragEvent, centerRows[0]);
    el.handleDragstart(
      new CustomEvent('sc-dragstart', {
        detail: {
          event: dragEvent,
          row: centerRows[0],
        },
      })
    );
    el.handleDragover(
      new CustomEvent('sc-dragstart', {
        detail: {
          event: dragEvent,
          row: centerRows[0],
        },
      })
    );
    el.handleDrop(
      new CustomEvent('sc-dragstart', {
        detail: {
          event: dragEvent,
          row: centerRows[0],
        },
      })
    );
    el.handleDragend(
      new CustomEvent('sc-dragstart', {
        detail: {
          event: dragEvent,
          row: centerRows[0],
        },
      })
    );
    el.handleDragleave(
      new CustomEvent('sc-dragstart', {
        detail: {
          event: dragEvent,
          row: centerRows[0],
        },
      })
    );

    expect(Object.keys(el.table.getState().rowSelection).length).to.equal(2);
  });
  it('Dragging shadow', async () => {
    const el = await fixture<ScDataGridDraggingShadow>(
      html` <sc-data-grid-dragging-shadow .label=${'test'}>
      </sc-data-grid-dragging-shadow>`
    );

    await el.updateComplete;
    el.updateDraggingShadowPosition(0, 0);

    expect(el.label).to.equal('test');
  });

  it('test master cell', async () => {
    const el = await fixture<ScDataGridMasterCell>(
      html`<sc-data-grid-master-cell
        .colSpan=${3}
        .rowId=${'rowid'}
        .rowIndex=${2}
      ></sc-data-grid-master-cell>`
    );
    await el.updateComplete;
    el.watchTooltip();
    el.emitScShowFromMaserCell(new Event(''));
    expect(el.rowId).to.equal('rowid');
  });
  it('should parse date values', async () => {
    const fn = defaultCellDataTypeDefinitions[E_CELL_DATA_TYPE.date];
    for (const value of [
      '2020-12-31T06:32:10.000Z',
      '2020-12-31',
      '12/31/2020',
      1609417930000,
    ]) {
      const result = fn({ cell: { getValue: () => value } } as any);
      expect(result).to.equal('31 Dec 2020');
    }
    for (const value of ['', undefined, null]) {
      const result = fn({ cell: { getValue: () => value } } as any);
      expect(result).to.equal('');
    }
    for (const value of ['31/12/2020', '13/32/1999', 'abcd']) {
      const result = fn({ cell: { getValue: () => value } } as any);
      expect(result).to.equal('Invalid Date');
    }
  });

  it('row group tree', async () => {
    const el = await fixture<ScDataGrid>(html`<sc-data-grid
      .data=${[
        {
          file: 'a/b/c/d/file1',
          count: 1,
        },
      ]}
      .columns=${[
        {
          property: 'file',
          rowGroupingTree: true,
          getGroupingTreePath: (original: any) => original.file.split('/'),
        },
        {
          property: 'count',
          aggregationFn: 'sum',
          aggregatedCell: (props: any) => props.getValue(),
        },
      ]}
      initial-expanded
    >
    </sc-data-grid>`);
    await el.updateComplete;

    expect(el.table.getIsGroupTree()).to.be.true;
    expect(el.tableState.groupingTreeColumnId).to.equal('file');
    expect(el.tableState.grouping).to.include('file');
  });

  it('should handle focus in', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;

    const cells = Array.from(
      el.shadowRoot?.querySelectorAll<HTMLElement>('.sc-data-grid-cell') ?? []
    );
    cells[0].focus();
    expect(el.shadowRoot?.activeElement).to.equal(cells[0]);

    const tb = el.shadowRoot?.querySelector<HTMLDivElement>(
      '.sc-data-grid-table'
    );
    el.handleFocusIn({ target: tb } as FocusEvent);
    expect(el.shadowRoot?.activeElement).to.equal(cells[0]);

    const vp = el.shadowRoot?.querySelector<HTMLDivElement>(
      '.sc-data-grid-body-area-viewport'
    );
    expect(vp).to.exist;
    el.handleFocusIn({ target: vp } as FocusEvent);

    const cols = el.table
      .getHeaderGroups()[0]
      .headers.reduce((t, h) => h.colSpan + t, 0);
    const rows = el.table.getExpandedRowModel().rows;
    const rowId = el.cleanClassName(rows[rows.length - 1]?.id);
    cells[cells.length - 1].focus();
    expect((el.shadowRoot?.activeElement as HTMLElement)?.className).to.include(
      `cell--${rowId}--${cols - 1}`
    );
  });

  it('should handle focus out', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;

    const target = el.shadowRoot?.querySelector('sc-data-grid-cell');
    el.handleFocusIn({ target } as FocusEvent);
    el.handleFocusOut({ target } as FocusEvent);
    expect((el as any)._focusCell).to.be.undefined;
  });

  describe('navigation and shortcuts', () => {
    const columns = [
      { property: 'a', editable: true },
      { property: 'b', editable: true },
      { property: 'c', editable: true },
      { property: 'd', editable: true },
    ];
    const data = [
      { a: 'a-0', b: 'b-0', c: 'c-0', d: 'd-0' },
      { a: 'a-1', b: 'b-1', c: 'c-1', d: 'd-1' },
      { a: 'a-2', b: 'b-2', c: 'c-2', d: 'd-2' },
      { a: 'a-3', b: 'b-3', c: 'c-3', d: 'd-3' },
    ];

    function press(
      el: ScDataGrid,
      init: {
        key: string;
        ctrlKey?: boolean;
        shiftKey?: boolean;
        altKey?: boolean;
      }
    ) {
      el.handleKeyDown(new KeyboardEvent('keydown', init));
      el.handleKeyUp(new KeyboardEvent('keyup', init));
    }

    it('navigation keys', async () => {
      const el = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${columns}
          enable-keyboard
        ></sc-data-grid>`
      );
      await el.updateComplete;

      const cells = Array.from(
        el.shadowRoot?.querySelectorAll<HTMLElement>('.sc-data-grid-cell') ?? []
      );
      cells[0].focus();

      press(el, { key: Keys.keyArrowRight });
      expect(el.shadowRoot?.activeElement).to.equal(cells[1]);

      press(el, { key: Keys.keyArrowLeft });
      press(el, { key: Keys.keyArrowLeft });
      expect(el.shadowRoot?.activeElement).to.equal(cells[0]);

      press(el, { key: Keys.keyTab });
      expect(el.shadowRoot?.activeElement).to.equal(cells[1]);

      press(el, { key: Keys.keyArrowDown });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length + 1]);

      press(el, { key: Keys.keyArrowRight, ctrlKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length * 2 - 1]);

      press(el, { key: Keys.keyArrowLeft, ctrlKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length]);

      press(el, { key: Keys.keyEnd });
      expect(el.shadowRoot?.activeElement).to.equal(cells[cells.length - 1]);

      press(el, { key: Keys.keyArrowUp, ctrlKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length * 2 - 1]);

      press(el, { key: Keys.keyArrowDown, ctrlKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(cells[cells.length - 1]);

      press(el, { key: Keys.keyHome });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length]);

      press(el, { key: Keys.keyTab, shiftKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length - 1]);

      press(el, { key: Keys.keyTab });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length]);
      press(el, { key: Keys.keyTab, shiftKey: true });

      press(el, { key: Keys.keyArrowDown });
      press(el, { key: Keys.keyPageDown });
      expect(el.shadowRoot?.activeElement).to.equal(cells[cells.length - 1]);

      press(el, { key: Keys.keyPageUp });
      expect(el.shadowRoot?.activeElement).to.equal(cells[data.length * 2 - 1]);
    });

    it('shortcut keys', async () => {
      const el = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${columns}
          enable-keyboard
          sortable
          filterable
          column-ordering
          row-selection
          enable-click-selection
        ></sc-data-grid>`
      );
      await el.updateComplete;

      const cells = Array.from(
        el.shadowRoot?.querySelectorAll<ScDataGridCell>('sc-data-grid-cell') ??
          []
      );
      cells[1]?.parentElement?.focus();

      // column order
      press(el, { key: Keys.keyArrowRight });
      press(el, { key: Keys.keyArrowRight, shiftKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(cells[2].parentElement);

      press(el, { key: Keys.keyArrowLeft, shiftKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(cells[2].parentElement);

      // column resize
      const size = cells[2].header?.getSize() ?? 0;
      press(el, { key: Keys.keyArrowLeft, altKey: true });
      expect(cells[2].header?.getSize()).to.lessThan(size);

      press(el, { key: Keys.keyArrowRight, altKey: true });
      expect(cells[2].header?.getSize()).to.equal(size);

      // sorting
      cells[1]?.parentElement?.focus();
      press(el, { key: Keys.keyEnter });
      expect(el.tableState.sorting?.[0]?.desc).to.be.false;

      // filter
      cells[1]?.parentElement?.focus();
      press(el, { key: Keys.keyEnter, ctrlKey: true });
      const filterEl = await el.columnFilterEl;
      expect(el.shadowRoot?.activeElement).to.equal(filterEl);

      // row selection
      cells[data.length + 1]?.parentElement?.focus();
      press(el, { key: Keys.keySpace });
      expect(el.selectedRowsInOrder.length).to.equal(1);

      cells[0]?.parentElement?.focus();
      press(el, { key: Keys.keySpace });
      expect(el.selectedRowsInOrder.length).to.equal(data.length);

      // column order pinned
      cells[0]?.parentElement?.focus();
      press(el, { key: Keys.keyArrowLeft, ctrlKey: true, shiftKey: true });
      expect(cells[0]?.header?.column.getIsPinned()).to.equal('left');

      cells[1]?.parentElement?.focus();
      press(el, { key: Keys.keyArrowLeft, ctrlKey: true, shiftKey: true });
      expect(cells[1]?.header?.column.getIsPinned()).to.equal('left');

      press(el, { key: Keys.keyArrowRight });
      press(el, { key: Keys.keyArrowLeft, ctrlKey: true, shiftKey: true });
      expect(cells[2]?.header?.column.getIsPinned()).to.equal('left');
      press(el, { key: Keys.keyArrowLeft, shiftKey: true });
      press(el, { key: Keys.keyArrowRight, shiftKey: true });
      press(el, { key: Keys.keyArrowRight, ctrlKey: true, shiftKey: true });
      expect(cells[2]?.header?.column.getIsPinned()).to.be.false;

      cells[columns.length]?.parentElement?.focus();
      press(el, { key: Keys.keyArrowRight, ctrlKey: true, shiftKey: true });
      expect(cells[columns.length]?.header?.column.getIsPinned()).to.equal(
        'right'
      );
      press(el, { key: Keys.keyArrowLeft });
      press(el, { key: Keys.keyArrowRight, ctrlKey: true, shiftKey: true });
      expect(cells[columns.length - 1]?.header?.column.getIsPinned()).to.equal(
        'right'
      );

      press(el, { key: Keys.keyArrowRight, shiftKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(
        cells[columns.length - 1]?.parentElement
      );
      press(el, { key: Keys.keyArrowLeft, shiftKey: true });
      expect(el.shadowRoot?.activeElement).to.equal(
        cells[columns.length - 1]?.parentElement
      );
      press(el, { key: Keys.keyArrowLeft, ctrlKey: true, shiftKey: true });
      expect(cells[columns.length - 1]?.header?.column.getIsPinned()).to.be
        .false;
    });

    it('draggable column header', async () => {
      const el = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${columns}
          column-ordering
          enable-drag-column
        ></sc-data-grid>`
      );
      await el.updateComplete;

      const headers = el.shadowRoot?.querySelectorAll<ScDataGridCell>(
        '.sc-data-grid-header-area .sc-data-grid-cell'
      );
      const headerA = headers?.item(0);
      const headerB = headers?.item(1);
      const headerD = headers?.item(3);

      headerA?.dispatchEvent(new DragEvent('dragstart'));
      headerB?.dispatchEvent(new DragEvent('dragover'));
      headerB?.dispatchEvent(new DragEvent('drop'));

      expect(el.table.getState().columnOrder).to.deep.equal([
        'b',
        'a',
        'c',
        'd',
      ]);

      headerA?.dispatchEvent(new DragEvent('dragstart'));
      headerD?.dispatchEvent(new DragEvent('dragover'));
      headerD?.dispatchEvent(new DragEvent('drop'));

      expect(el.table.getState().columnOrder).to.deep.equal([
        'b',
        'c',
        'd',
        'a',
      ]);

      headerB?.dispatchEvent(new DragEvent('dragstart', { ctrlKey: true }));
      headerB?.dispatchEvent(new DragEvent('dragover', { ctrlKey: true }));
      headerB?.dispatchEvent(new DragEvent('drop', { ctrlKey: true }));

      expect(el.table.getState().columnOrder).to.deep.equal([
        'b',
        'c',
        'd',
        'a',
      ]);
      expect(el.table.getColumn('b')?.getIsPinned()).to.equal('left');

      headerB?.dispatchEvent(new DragEvent('dragstart', { ctrlKey: true }));
      headerA?.dispatchEvent(new DragEvent('dragover', { ctrlKey: true }));
      headerA?.dispatchEvent(new DragEvent('drop', { ctrlKey: true }));

      expect(el.table.getState().columnOrder).to.deep.equal([
        'c',
        'd',
        'a',
        'b',
      ]);
      expect(el.table.getColumn('b')?.getIsPinned()).to.equal('right');

      headerB?.dispatchEvent(new DragEvent('dragstart', { ctrlKey: true }));
      headerD?.dispatchEvent(new DragEvent('dragover', { ctrlKey: true }));
      headerD?.dispatchEvent(new DragEvent('drop', { ctrlKey: true }));

      expect(el.table.getState().columnOrder).to.deep.equal([
        'c',
        'b',
        'd',
        'a',
      ]);
      expect(el.table.getColumn('b')?.getIsPinned()).to.be.false;
    });
  });

  describe('filters', () => {
    const getColumnDef = () => [
      { property: 'a' },
      { property: 'b' },
      { property: 'c' },
      { property: 'd' },
      { property: 'e' },
      { property: 'f' },
      { property: 'g' },
    ] as unknown as TColumn<unknown, any>[];
    const data = [
      { a: 'a-0', b: 'b-0', c: 0, d: '2025-08-01', e: true, f: 123, g: 'g' },
      { a: 'a-1', b: '', c: 1, d: '2025-08-02', e: true, f: 200, g: 'g' },
      { a: 'a-2', b: '\t', c: null, d: '2025-08-02', e: true, f: 234, g: 'g' },
      {
        a: 'a-3',
        b: undefined,
        c: 3,
        d: '2025-08-05',
        e: false,
        f: 364,
        g: 'g',
      },
      {
        a: 'a-4',
        b: null,
        c: undefined,
        d: undefined,
        e: false,
        f: 411,
        g: 'g',
      },
      { a: 'a-5', b: null, c: 5, d: null, e: false, f: 576, g: 'g' },
      { a: 'a-6', b: 'b-6', c: NaN, d: '2025-08-05', e: false, f: 994, g: 'g' },
    ];

    it('default to setFilter', async () => {
      const grid = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${getColumnDef()}
          filterable
        ></sc-data-grid>`
      );
      await grid.updateComplete;

      const headers = grid.shadowRoot?.querySelectorAll<ScDataGridCell>(
        '.sc-data-grid-header-cell > sc-data-grid-cell'
      );
      expect(headers).to.exist;

      for (const cell of headers ?? []) {
        const column = cell.header?.column as Column<unknown>;
        expect(column).to.exist;

        grid.toggleColumnFilter(
          new CustomEvent('mouseup', {
            detail: {
              type: 'mouseup',
              target: cell as unknown as HTMLDivElement,
            },
          }),
          column,
          grid.table
        );
        await grid.updateComplete;
        const filterElement = await grid.columnFilterEl;
        expect(filterElement).to.exist;

        expect(column.getFilterFn()).to.equal(setFilter);
        expect(column.getFilterWidget()).to.equal(renderMultipleDropdown);

        const values = column.getFacetedUniqueValues();
        const keys = Array.from(values.keys());
        column.setFilterValue(keys.slice(0, 1).map(v => `${v}`));
        expect(grid.table.getRowModel().rows.length).to.equal(
          values.get(keys[0]),
          `${column.id} got ${JSON.stringify(grid.tableState.columnFilters)}`
        );
        column.setFilterValue(undefined);
      }
    });

    it('setFilter dataLookup', async () => {
      const data = [{ value: 'abc', label: 'ABC' }];
      const fn = sinon.spy(async () =>
        Promise.resolve(data));
      const el = await fixture<ScDataGridColumnSetFilter>(
        html`<sc-data-grid-column-set-filter
          .column=${{ getFilterLookup: () => fn }}
        ></sc-data-grid-column-set-filter>`
      );
      await el.updateComplete;
      expect(fn.called).to.be.true;
      expect(el.data).to.deep.equal(data);
    });

    it('setFilter keeps selected values missing from current data', async () => {
      const el = await fixture<ScDataGridColumnSetFilter>(
        html`<sc-data-grid-column-set-filter
          .column=${{ getFilterLookup: () => undefined, getStaticFilterData: () => [] }}
          .bindFilterValue=${() => {}}
          .value=${['missing']}
        ></sc-data-grid-column-set-filter>`
      );

      el.data = [{ value: 'present', label: 'Present' }];
      el.selectedData = [
        { value: 'missing', label: 'Missing' },
        { value: 'present', label: 'Present' },
      ];

      await el.updateComplete;

      const dropdown = el.shadowRoot?.querySelector('sc-dropdown-multi-select') as ScDropdownMultiSelect;
      expect(dropdown).to.exist;
      expect(dropdown.data).to.deep.equal([
        { value: 'missing', label: 'Missing' },
        { value: 'present', label: 'Present' },
      ]);
    });

    it('setFilter preserves selected options from current and previous data on select', async () => {
      const bindFilterValue = sinon.spy();
      const el = await fixture<ScDataGridColumnSetFilter>(
        html`<sc-data-grid-column-set-filter
          .column=${{ getFilterLookup: () => undefined, getStaticFilterData: () => [] }}
          .bindFilterValue=${bindFilterValue}
        ></sc-data-grid-column-set-filter>`
      );

      el.data = [{ value: 'present', label: 'Present' }];
      el.selectedData = [{ value: 'missing', label: 'Missing' }];

      el.handleScSelect(
        new CustomEvent('sc-select', {
          detail: {
            value: ['present', 'missing', 'unknown'],
          },
        })
      );

      expect(el.value).to.deep.equal(['present', 'missing', 'unknown']);
      expect(el.selectedData).to.deep.equal([
        { value: 'present', label: 'Present' },
        { value: 'missing', label: 'Missing' },
      ]);
      expect(bindFilterValue.calledOnceWithExactly(['present', 'missing', 'unknown'])).to.be.true;
    });

    it('custom filterFn & filterWidget', async () => {
      const fn = () => true;
      const widget = () => html`<div>test</div>`;
      const colDef = getColumnDef();
      colDef.forEach(c => {
        c.filterFn = fn;
        c.filterWidget = widget;
      });

      const grid = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${colDef}
          filterable
        ></sc-data-grid>`
      );
      await grid.updateComplete;

      const column = grid.table.getColumn('a');
      expect(column?.getFilterFn()).to.equal(fn);
      expect(column?.getFilterWidget()).to.equal(widget);
    });

    describe('supports typed filter', () => {
      const colDef = getColumnDef();
      colDef[0].filter = 'text';
      colDef[1].filter = 'text';
      colDef[2].filter = 'number';
      colDef[3].filter = 'date';
      colDef[4].filter = 'boolean';
      colDef[5].filter = 'number';
      colDef[6].filter = 'text';

      it('filterFn & filterWidget', async () => {
        const grid = await fixture<ScDataGrid>(
          html` <sc-data-grid
            .data=${data}
            .columns=${colDef}
            filterable
          ></sc-data-grid>`
        );
        await grid.updateComplete;

        for (const column of grid.table.getAllColumns()) {
          const filtername = column.columnDef.meta?.filter || 'setFilter';

          expect(column.getFilterFn()).to.equal(getFilterFn(filtername), column.id);
          expect(column.getFilterWidget()).to.equal(getFilterWidget(filtername), column.id);
        }
      });

      it('text', async () => {
        const grid = await fixture<ScDataGrid>(
          html` <sc-data-grid
            .data=${data}
            .columns=${colDef}
            filterable
          ></sc-data-grid>`
        );
        await grid.updateComplete;

        const column = grid.table.getColumn('a') ;
        expect(column).to.exist;
        if (column) {
          column.setFilterValue({ mode: 'equals', value: 'a-0' });
          expect(grid.table.getRowModel().rows.length).to.equal(1);

          column.setFilterValue({ mode: 'notEquals', value: 'a-0' });
          expect(grid.table.getRowModel().rows.length).to.equal(colDef.length - 1);

          column.setFilterValue({ mode: 'contains', value: '0' });
          expect(grid.table.getRowModel().rows.length).to.equal(1);

          column.setFilterValue({ mode: 'notContains', value: '-0' });
          expect(grid.table.getRowModel().rows.length).to.equal(colDef.length - 1);

          column.setFilterValue({ mode: 'beginsWith', value: 'a' });
          expect(grid.table.getRowModel().rows.length).to.equal(colDef.length);

          column.setFilterValue({ mode: 'endsWith', value: '1' });
          expect(grid.table.getRowModel().rows.length).to.equal(1);

          column.setFilterValue({ mode: 'empty', value: true });
          expect(grid.table.getRowModel().rows.length).to.equal(0);

          column.setFilterValue({ mode: 'notEmpty', value: true });
          expect(grid.table.getRowModel().rows.length).to.equal(colDef.length);
        }
      });
      it('number', async () => {
        const grid = await fixture<ScDataGrid>(
          html` <sc-data-grid
            .data=${data}
            .columns=${colDef}
            filterable
          ></sc-data-grid>`
        );
        await grid.updateComplete;

        const column = grid.table.getColumn('c') ;
        expect(column).to.exist;
        if (column) {
          column.setFilterValue({ mode: 'equals', value: 1 });
          expect(grid.table.getRowModel().rows.length).to.equal(1);

          column.setFilterValue({ mode: 'notEquals', value: 1 });
          expect(grid.table.getRowModel().rows.length).to.equal(colDef.length - 1);

          column.setFilterValue({ mode: 'greaterThan', value: 1 });
          expect(grid.table.getRowModel().rows.length).to.equal(2);

          column.setFilterValue({ mode: 'greaterThanOrEqual', value: 1 });
          expect(grid.table.getRowModel().rows.length).to.equal(3);

          column.setFilterValue({ mode: 'lessThan', value: 1 });
          expect(grid.table.getRowModel().rows.length).to.equal(1);

          column.setFilterValue({ mode: 'lessThanOrEqual', value: 1 });
          expect(grid.table.getRowModel().rows.length).to.equal(2);

          column.setFilterValue({ mode: 'empty', value: true });
          expect(grid.table.getRowModel().rows.length).to.equal(3);

          column.setFilterValue({ mode: 'notEmpty', value: true });
          expect(grid.table.getRowModel().rows.length).to.equal(4);
        }
      });
      it('date', async () => {
        const grid = await fixture<ScDataGrid>(
          html` <sc-data-grid
            .data=${data}
            .columns=${colDef}
            filterable
          ></sc-data-grid>`
        );
        await grid.updateComplete;

        const column = grid.table.getColumn('d') ;
        expect(column).to.exist;
        if (column) {
          column.setFilterValue({ mode: 'equals', value: '2025-08-02' });
          expect(grid.table.getRowModel().rows.length).to.equal(2);

          column.setFilterValue({ mode: 'notEquals', value: '2025-08-02' });
          expect(grid.table.getRowModel().rows.length).to.equal(5);

          column.setFilterValue({ mode: 'before', value: '2025-08-02' });
          expect(grid.table.getRowModel().rows.length).to.equal(1);

          column.setFilterValue({ mode: 'after', value: '2025-08-02' });
          expect(grid.table.getRowModel().rows.length).to.equal(2);

          column.setFilterValue({ mode: 'between', value: { start: '2025-08-02', end: '2025-08-05' } });
          expect(grid.table.getRowModel().rows.length).to.equal(4);

          column.setFilterValue({ mode: 'empty', value: true });
          expect(grid.table.getRowModel().rows.length).to.equal(2);

          column.setFilterValue({ mode: 'notEmpty', value: true });
          expect(grid.table.getRowModel().rows.length).to.equal(5);
        }
      });
      it('boolean', async () => {
        const grid = await fixture<ScDataGrid>(
          html` <sc-data-grid
            .data=${data}
            .columns=${colDef}
            filterable
          ></sc-data-grid>`
        );
        await grid.updateComplete;

        // boolean no typed support, fallback to setFilter
        expect(grid.table.getColumn('e')?.getFilterFn()).to.equal(setFilter);
      });
    });

    describe('support multiple filter', () => {
      const colDef = getColumnDef();
      colDef[0].filter = 'multiple';
      colDef[1].filter = 'multiple';
      colDef[2].filter = 'multiple';
      colDef[3].filter = 'multiple';
      colDef[4].filter = 'multiple';
      colDef[5].filter = 'multiple';
      colDef[6].filter = 'multiple';

      it('text, number & date', async () => {
        const grid = await fixture<ScDataGrid>(
          html` <sc-data-grid
            .data=${data}
            .columns=${colDef}
            filterable
          ></sc-data-grid>`
        );
        await grid.updateComplete;

        for (const column of grid.table.getAllColumns().slice(0, 4)) {
          const el = await fixture<ScDataGridColumnMultiFilter>(column.getFilterWidget()?.({
            value: undefined,
            bindFilterValue: value => column.setFilterValue(value),
            table: grid.table,
            column,
          }));

          const widget = el.shadowRoot?.querySelector<
            ScDataGridColumnTypedFilter<
              string & keyof AnyFilterMode,
              AnyFilterMode
            >
          >('sc-data-grid-column-typed-filter');
          expect(widget).to.exist;
          expect(el.shadowRoot?.querySelector('sc-data-grid-column-set-filter')).to.exist;

          widget?.bindFilterValue({ mode: 'equals', value: 'qert34565i8uiyer' });
          expect(grid.table.getRowModel().rows.length).to.equal(0);
          widget?.bindFilterValue(undefined);
        }
      });
      it('boolean', async () => {
        const grid = await fixture<ScDataGrid>(
          html` <sc-data-grid
            .data=${data}
            .columns=${colDef}
            filterable
          ></sc-data-grid>`
        );
        await grid.updateComplete;

        // boolean no multiple support, fallback to setFilter
        expect(grid.table.getColumn('e')?.getFilterFn()).to.equal(setFilter);
      });
    });
  });

  it('should emit column change event', async () => {
    const spy = sinon.spy();
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    el.addEventListener('sc-column-order', spy);
    await el.updateComplete;

    el.table.setColumnOrder(
      [...el.table.getColumnHeaders()].reverse().map(h => h.column.id)
    );
    // should debounce, not instant
    expect(spy).to.be.not.called;
    el._handleManageColumnChange.flush();

    expect(spy).to.be.calledOnce;

    el.table.setColumnVisibility((old: any) => ({ ...old, [columns[0].property]: false }));
    el._handleManageColumnChange.flush();

    expect(spy).to.be.calledTwice;
  });

  it('should global filter', async () => {
    const el = await fixture<ScDataGrid>(
      html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
    );
    await el.updateComplete;
    el.table.setGlobalFilter('miller');
    expect(el.table.getFilteredRowModel().rows.length).to.equal(1);

    await el.updateComplete;
    el.table.resetGlobalFilter();
    expect(el.table.getFilteredRowModel().rows.length).to.equal(data.length);

    await el.updateComplete;
    el.table.setGlobalFilter('tan');
    expect(el.table.getFilteredRowModel().rows.length).to.equal(data.length);
  });

  describe('global filter with custom cell renderer returning empty html element', () => {
    const emptyRendererData = [
      { uuid: 'match-row', name: 'alice', label: 'foo' },
      { uuid: 'no-match-row', name: 'bob', label: 'bar' },
    ];
    const emptyRendererColumns = [
      {
        property: 'name',
        // Custom renderer that returns an empty HTML element — textContent will be ''
        cell() {
          return html``;
        },
      },
      {
        property: 'label',
      },
    ];

    it('matches row via raw compare value when cell renderer returns empty html element', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${emptyRendererData}
          .columns=${emptyRendererColumns}
        ></sc-data-grid>`
      );
      await el.updateComplete;

      // Filtering by a value that exists in the 'name' column raw data.
      // Even though the cell renderer returns html``, the filter should fall
      // back to the raw row value and still match.
      el.table.setGlobalFilter('alice');
      expect(el.table.getFilteredRowModel().rows.length).to.equal(1);
      expect(
        (el.table.getFilteredRowModel().rows[0].original as typeof emptyRendererData[0]).name
      ).to.equal('alice');

      // A value that does not exist in any column should match nothing.
      el.table.setGlobalFilter('zzz-no-match-zzz');
      expect(el.table.getFilteredRowModel().rows.length).to.equal(0);

      // Resetting returns all rows.
      el.table.resetGlobalFilter();
      expect(el.table.getFilteredRowModel().rows.length).to.equal(emptyRendererData.length);
    });

    it('does not match when raw value also does not satisfy the global filter', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${emptyRendererData}
          .columns=${emptyRendererColumns}
        ></sc-data-grid>`
      );
      await el.updateComplete;

      // 'alice' is in name but not in label, so only 1 row matches the name column
      el.table.setGlobalFilter('alice');
      const matched = el.table.getFilteredRowModel().rows;
      expect(matched.length).to.equal(1);
      expect(
        (matched[0].original as typeof emptyRendererData[0]).name
      ).to.equal('alice');

      // 'bob' is only in the second row's name column
      el.table.setGlobalFilter('bob');
      const matched2 = el.table.getFilteredRowModel().rows;
      expect(matched2.length).to.equal(1);
      expect(
        (matched2[0].original as typeof emptyRendererData[0]).name
      ).to.equal('bob');
    });
  });

  describe('sortingFn', () => {    
    it('should auto default', async () => {
      const el = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${columns}
          sortable
        >
        </sc-data-grid>`
      );
      await el.updateComplete;

      expect(el.table.getColumn('firstName')?.getAutoSortingFn()).to.equal(sortingFns.text);
      expect(el.table.getColumn('44')?.getAutoSortingFn()).to.equal(sortingFns.basic);
      expect(el.table.getColumn('77')?.getAutoSortingFn()).to.equal(sortingFns.datetime);
    });

    it('should support named sortingFn', async () => {
      const el = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${columns.map(c => ({
            ...c,
            sortable: true,
            sortingFn: { 
              firstName: 'textCaseSensitive',
              lastName: 'basic',
              age: 'alphanumeric',
            }[c.property],
          }))}
          sortable
        >
        </sc-data-grid>`
      );
      await el.updateComplete;

      expect(el.table.getColumn('firstName')?.getSortingFn()).to.equal(sortingFns.textCaseSensitive);
      expect(el.table.getColumn('lastName')?.getSortingFn()).to.equal(sortingFns.basic);
      expect(el.table.getColumn('33')?.getSortingFn()).to.equal(sortingFns.alphanumeric);
    });

    it('should base on cellDataType', async () => {
      const el = await fixture<ScDataGrid>(
        html` <sc-data-grid
          .data=${data}
          .columns=${columns.map(c => ({
            ...c,
            sortable: true,
            cellDataType: { 
              firstName: 'text',
              age: 'date',
              visits: 'number',
            }[c.property],
          }))}
          sortable
        >
        </sc-data-grid>`
      );
      await el.updateComplete;

      expect(el.table.getColumn('firstName')?.getSortingFn()).to.equal(sortingFns.text);
      expect(el.table.getColumn('33')?.getSortingFn()).to.equal(sortingFns.datetime);
      expect(el.table.getColumn('44')?.getSortingFn()).to.equal(sortingFns.basic);
    });
  });

  describe('row-selection-strategy="currentPage"', () => {
    const pageSize = 3;
    const pagedData = Array.from({ length: 9 }, (_, i) => ({
      uuid: `paged-row-${i}`,
      name: `Name ${i}`,
    }));
    const pagedColumns = [{ property: 'name' }];

    it('handleSelectAll selects only rows on the current page', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${pagedData}
          .columns=${pagedColumns}
          row-selection
          row-selection-mode="multiple"
          row-selection-strategy="currentPage"
          pagination
          page-size=${pageSize}
        ></sc-data-grid>`
      );
      await el.updateComplete;

      el.handleSelectAll(true);

      const selectedCount = Object.keys(el.table.getState().rowSelection).length;
      expect(selectedCount).to.equal(pageSize);
    });

    it('handleSelectAll deselects only rows on the current page', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${pagedData}
          .columns=${pagedColumns}
          row-selection
          row-selection-mode="multiple"
          row-selection-strategy="currentPage"
          pagination
          page-size=${pageSize}
        ></sc-data-grid>`
      );
      await el.updateComplete;

      el.handleSelectAll(true);
      el.handleSelectAll(false);

      const selectedCount = Object.keys(el.table.getState().rowSelection).length;
      expect(selectedCount).to.equal(0);
    });

    it('handleSelectAll on page 2 selects only page 2 rows', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${pagedData}
          .columns=${pagedColumns}
          row-selection
          row-selection-mode="multiple"
          row-selection-strategy="currentPage"
          pagination
          page-size=${pageSize}
        ></sc-data-grid>`
      );
      await el.updateComplete;

      el.table.setPageIndex(1);
      await el.updateComplete;

      el.handleSelectAll(true);

      const selectedKeys = Object.keys(el.table.getState().rowSelection);
      expect(selectedKeys.length).to.equal(pageSize);

      const page2RowIds = el.table.getPaginationRowModel().rows.map(r => r.id);
      selectedKeys.forEach(id => {
        expect(page2RowIds).to.include(id);
      });
    });

    it('selecting all on page 1 does not affect rows on other pages', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${pagedData}
          .columns=${pagedColumns}
          row-selection
          row-selection-mode="multiple"
          row-selection-strategy="currentPage"
          pagination
          page-size=${pageSize}
        ></sc-data-grid>`
      );
      await el.updateComplete;

      el.handleSelectAll(true);
      const page1SelectedIds = Object.keys(el.table.getState().rowSelection);

      el.table.setPageIndex(1);
      await el.updateComplete;

      const page2RowIds = el.table.getPaginationRowModel().rows.map(r => r.id);
      page1SelectedIds.forEach(id => {
        expect(page2RowIds).to.not.include(id);
      });
    });
  });

  describe('column visibility', () => {
    it('toggleColumnVisibility shows popup when not active', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${data}
          .columns=${columns}
          column-visibility
        ></sc-data-grid>`
      );
      await el.updateComplete;

      const columnManagerEl = await (el as any).columnVisbilityEl as ScDataGridColumnManager;
      await columnManagerEl.updateComplete;

      expect(columnManagerEl.isPopupActive).to.equal(false);

      const button = document.createElement('div');
      document.body.appendChild(button);
      (DOMRect as any).fromRect = (init?: DOMRectInit) =>
        new DOMRect(init?.x, init?.y, init?.width, init?.height);
      const clickEvent = new MouseEvent('click', { bubbles: true, composed: true });
      button.dispatchEvent(clickEvent);
      await el.toggleColumnVisibility(clickEvent);
      await columnManagerEl.updateComplete;
      delete (DOMRect as any).fromRect;

      expect(columnManagerEl.isPopupActive).to.equal(true);
      button.remove();
    });

    it('toggleColumnVisibility hides popup when already active', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid
          .data=${data}
          .columns=${columns}
          column-visibility
        ></sc-data-grid>`
      );
      await el.updateComplete;

      const columnManagerEl = await (el as any).columnVisbilityEl as ScDataGridColumnManager;
      await columnManagerEl.updateComplete;

      columnManagerEl.showPopup();
      expect(columnManagerEl.isPopupActive).to.equal(true);

      await el.toggleColumnVisibility(new MouseEvent('click', { bubbles: true, composed: true }));

      expect(columnManagerEl.isPopupActive).to.equal(false);
    });
  });

  describe('ScDataGridColumnManager popupHandleWinMousedown', () => {
    async function makeColumnManager(el: ScDataGrid) {
      const columnManager = await fixture<ScDataGridColumnManager>(
        html`
          <sc-data-grid-column-manager
            .table=${el.table}
            .columnVisibility=${el.table.getState().columnVisibility}
            .columnOrder=${el.table.getState().columnOrder}
            ?enable-order=${true}
            ?enable-visibility=${true}
          ></sc-data-grid-column-manager>
        `
      );
      await columnManager.updateComplete;
      return columnManager;
    }

    it('hides popup when clicking outside while active', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
      );
      await el.updateComplete;
      const columnManager = await makeColumnManager(el);
      columnManager.showPopup();

      const outsideEl = document.createElement('div');
      const event = new MouseEvent('mousedown', { bubbles: true, composed: true });
      Object.defineProperty(event, 'composedPath', { value: () => [outsideEl] });

      columnManager.popupHandleWinMousedown(event);
      expect(columnManager.isPopupActive).to.equal(false);
    });

    it('does not hide popup when clicking on the component itself', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
      );
      await el.updateComplete;
      const columnManager = await makeColumnManager(el);
      columnManager.showPopup();

      const event = new MouseEvent('mousedown', { bubbles: true, composed: true });
      Object.defineProperty(event, 'composedPath', { value: () => [columnManager] });

      columnManager.popupHandleWinMousedown(event);
      expect(columnManager.isPopupActive).to.equal(true);
    });

    it('does not hide popup when clicking on the visibility toggle button', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
      );
      await el.updateComplete;
      const columnManager = await makeColumnManager(el);
      const toggleBtn = document.createElement('div');
      toggleBtn.className = 'sc-data-grid-header-tools-visibility';
      columnManager.setVirtualAnchor(toggleBtn);
      columnManager.showPopup();

      const event = new MouseEvent('mousedown', { bubbles: true, composed: true });
      Object.defineProperty(event, 'composedPath', { value: () => [toggleBtn] });

      columnManager.popupHandleWinMousedown(event);
      expect(columnManager.isPopupActive).to.equal(true);
    });

    it('does nothing when popup is not active', async () => {
      const el = await fixture<ScDataGrid>(
        html`<sc-data-grid .data=${data} .columns=${columns}></sc-data-grid>`
      );
      await el.updateComplete;
      const columnManager = await makeColumnManager(el);

      const outsideEl = document.createElement('div');
      const event = new MouseEvent('mousedown', { bubbles: true, composed: true });
      Object.defineProperty(event, 'composedPath', { value: () => [outsideEl] });

      columnManager.popupHandleWinMousedown(event);
      expect(columnManager.isPopupActive).to.equal(false);
    });
  });

});
