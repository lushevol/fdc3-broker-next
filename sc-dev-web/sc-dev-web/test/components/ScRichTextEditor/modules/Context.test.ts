import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import {
  Context,
  TOptions,
} from '../../../../src/components/ScRichTextEditor/Context.js';
import '../../../../src/components/ScRichTextEditor/ScRteToolbar.js';
import '../../../../src/components/ScRichTextEditor/ScRteViewer.js';
import { htmlTemplate } from '../html.js';
import '../../../../src/components/ScTable/ScTable.js';
import { E_OPERATORS } from '../../../../src/components/ScRichTextEditor/constant.js';
const conf = [
  { property: 'fruit', header: 'Fruit' },
  { property: 'color', header: 'color' },
  { property: 'weight', header: 'Weight' },
  { property: 'action', header: 'Action' },
];
const data = [
  { fruit: 'apple', color: 'green', weight: '100gr', action: 1 },
  { fruit: 'banana', color: 'yellow', weight: '140gr', action: 2 },
  { fruit: 'grapes3', color: 'purple', weight: '140gr', action: 3 },
];

describe('Context', () => {
  it('contains', async () => {
    const toolbar = await fixture<any>(
      html` <sc-rte-toolbar></sc-rte-toolbar> `
    );
    const viewer = await fixture<any>(
      html` <sc-rte-viewer></sc-rte-viewer> `
    );
    await viewer.updateComplete;
    
    const scTable = await fixture<any>(html` <sc-table contenteditable .conf=${conf} .data=${data}></sc-table> `);

    
    viewer.shadowRoot.querySelector('#content').appendChild(scTable);
    
    viewer.focusedElement = scTable;
    viewer.activeCell = document.createElement('th');
    viewer.activeCell.setAttribute('row-index', 0);
    viewer.activeCell.setAttribute('col-index', 0);

    viewer.onTextboxFocus(new Event('focus'));
    viewer.onTooltipClick(new Event('focus'));
    viewer.onTableBlur();
    viewer.invoke('viewer.updateCount');
    viewer.onClickDoc();
    viewer.showPopup();
    viewer.onClickOperator(new Event('focus'));
    viewer.hideTooltips();
    viewer.onTableClick(new CustomEvent('-focus', {
      bubbles: true,
      detail: {
        clientX: 0,
        clientY: 0,
        cell: document.createElement('th'),
      },
    }));
    viewer.onTextboxFocus(new CustomEvent('-focus', {
      bubbles: true,
      detail: {},
    }));
    const context = new Context(
      {
        shortcut: true,
        toolbarConf: ['bold'],
      } as TOptions,
      {
        viewer,
        toolbar,
      }
    );

    const parser = new DOMParser();

    const doc = parser.parseFromString(htmlTemplate, 'text/html');

    context.invoke('editor.tab');
    context.invoke('editor.backspace');
    context.invoke('editor.formatPara');
    context.invoke('editor.formatBlockquote');
    context.invoke('editor.formatBlock', 'h1');
    context.invoke('editor.preCommand');
    context.invoke('editor.postCommand');
    context.invoke('editor.notSupportLog', '');

    
    context.invoke('viewer.getEditableContent');
    context.invoke('viewer.updateCount');
    context.invoke('viewer.getRange');
    context.invoke('viewer.getSelection');
    context.invoke('viewer.createPlaceholder', 'id');
    context.invoke('viewer.updateTable', 'id', 2, 3);
    
    viewer.focusedElement = scTable;
    viewer.activeCell = document.createElement('th');
    viewer.activeCell.setAttribute('row-index', 0);
    viewer.activeCell.setAttribute('col-index', 0);
    
    context.invoke('viewer.deleteTable', E_OPERATORS['delete-column']);
    context.invoke('viewer.deleteTable', E_OPERATORS['delete-row']);
    context.invoke('viewer.fetchLatestTableInfo');
    context.invoke('viewer.indexedConf', conf);
    context.invoke('viewer.deleteData', 0, conf, [{}]);
    context.invoke('viewer.shiftData', 1, conf, [{}]);
    context.invoke('viewer.finalizeTableMetadata', scTable);
    context.invoke('viewer.insertToTable', E_OPERATORS['insert-column-left']);
    context.invoke('viewer.insertToTable', E_OPERATORS['insert-column-right']);
    context.invoke('viewer.insertToTable', E_OPERATORS['insert-row-above']);
    context.invoke('viewer.insertToTable', E_OPERATORS['insert-row-below']);
    context.invoke('viewer.iterateTable', scTable, {
      rowCb() {},
      cellCb() {},
      headerRowCb() {},
      headerCellCb() {},
    });
    

    expect(context.invoke('clipboard.removeStyle', doc)).to.equal(undefined);
  });
});
