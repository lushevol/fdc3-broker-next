import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTableFilter } from '../../../src/components/ScTable/ScTableFilter.js';
import '../../../elements/sc-table.js';

jest.mock('../../../src/shared/util.ts', () => {
  const originalModule = jest.requireActual('../../../src/shared/util.ts');
  return {
    ...originalModule,
    closest() {
      const scTable = document.createElement('sc-table');
      jest.spyOn(scTable, 'scrollWidth', 'get').mockReturnValue(1000);
      jest.spyOn(scTable, 'clientWidth', 'get').mockReturnValue(500);
      jest.spyOn(scTable, 'scrollHeight', 'get').mockReturnValue(1000);
      jest.spyOn(scTable, 'clientHeight', 'get').mockReturnValue(500);
      scTable.getBoundingClientRect = function () {
        return {
          x: 20,
          y: 20,
          width: 500,
          height: 200,
          left: 20,
          right: 520,
          top: 20,
          bottom: 220,
          toJSON() {},
        };
      };
      return scTable;
    },
  };
});


describe('sc-table-filter', () => {
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  it('renders default attributes', async () => {
    const el = await fixture<ScTableFilter>(
      html` <sc-table-filter></sc-table-filter>`
    );
    await el.updateComplete;

    jest.spyOn(el.triggerEl, 'clientWidth', 'get').mockReturnValue(210);

    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      ...new CSSStyleDeclaration(),
      borderLeftWidth: '6px',
      borderRightWidth: '6px',
    });

    el.triggerEl.getBoundingClientRect = function () {
      return {
        x: 20,
        y: 20,
        width: 500,
        height: 200,
        left: 10,
        right: 600,
        top: 20,
        bottom: 220,
        toJSON() {},
      };
    };
    el.setPopupWidth();
    expect(el.slMenuEl.style.width).to.equal('106px');
    el.onDropdownShow(new CustomEvent('sc-show'));
    expect(el.scInput.value).to.equal('');

    el.onDropdownHide(new CustomEvent('sc-hide'));
    expect(el.scInput.value).to.equal('');
    el.onInput(
      new CustomEvent('selectItemChanged', {
        bubbles: true,
        detail: {
          value: 'a',
        },
      })
    );
    el.createPhysicalEl();
    const div = document.createElement('div');
    const checkbox = document.createElement('sc-checkbox');
    div.appendChild(checkbox);
    el.updateElement(div, 0);
    const _event = new CustomEvent('selectItemChanged', {
      bubbles: true,
      detail: {
        value: 'a',
      },
    });
    el.onScrollClick(_event);
    el.onItemClick(
      _event,
      'apple'
    );
    expect(el.renderEmptyOptions().strings[0]).to.equal(' <div class=\"empty-options\">No data found</div> ');
  });
});
