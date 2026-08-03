import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScSearchField } from '../../src/components/ScSearchField/ScSearchField.js';
import '../../elements/sc-search-field.js';
import { COMPACT_SIZE } from '../../src/shared/util.js';

describe('ScSearchField', () => {
  it('renders default search field', async () => {
    const el = await fixture<ScSearchField>(html` <sc-search-field /> `);

    expect(el.emptyText).to.equal('No data found');
    expect(el.placeholder).to.equal('');
    expect(el.showSuggestion).to.equal(false);
    expect(el.threshold).to.equal(3);
  });

  it('renders search field with suggestions', async () => {
    const el = await fixture<ScSearchField>(html`
      <sc-search-field show-suggestion />
    `);
    expect(el.showSuggestion).to.equal(true);
  });

  it('call updateSuggestion function', async () => {
    const el = await fixture<ScSearchField>(html`
      <sc-search-field show-suggestion />
    `);
    const list = [
      {
        value: 'option1',
        displayValue: 'option1',
      },
      {
        value: 'option2',
        text: () => 'option2',
      },
    ];
    el.updateSuggestion(list);
    el.value = 'option1';
    expect(el.querySelectorAll('sc-dropdown-option').length).to.equal(2);
  });

  it('call handleInput function', async () => {
    const searchField = new ScSearchField();
    searchField.handleInput(
      new CustomEvent('sc-input', {
        detail: {
          value: '1234',
        },
      })
    );
    expect(searchField.value).to.equal('1234');
  });

  it('call handleKeydown function', () => {
    const searchField = new ScSearchField();
    searchField.handleKeydown(
      new KeyboardEvent('keydown', {
        code: 'Enter',
      })
    );
    expect(searchField.value).to.equal('');
  });

  it('validates JSON strings using isValidJSON', () => {
    const searchField = new ScSearchField();

    // Valid JSON string
    const validJson = '{"value": "Test"}';
    expect(searchField.isValidJSON(validJson)).to.be.true;

    // Empty string
    const emptyString = '';
    expect(searchField.isValidJSON(emptyString)).to.be.false;

    // Non-JSON string
    const nonJsonString = 'Hello, World!';
    expect(searchField.isValidJSON(nonJsonString)).to.be.false;
  });

  it('handles menu item selection correctly', async () => {
    const searchField = new ScSearchField();

    // Mock a menu item selection event with valid JSON
    const valueAndDisplayValueEvent = new CustomEvent('sl-select', {
      detail: {
        item: {
          value: JSON.stringify({ displayValue: 'Option 1', value: 'option1' }),
        },
      },
    });

    searchField.handleMenuItemSelect(valueAndDisplayValueEvent);
    expect(searchField.value).to.equal('option1');
  });
  
  it('support clearable attribute', async () => {
    const el = await fixture<ScSearchField>(
      html`<sc-search-field clearable=""></sc-search-field>`
    );
    expect(el.clearable).to.equal(true);
  });

  it('support different sizes', async () => {
    const el = await fixture<ScSearchField>(
      html`<sc-search-field></sc-search-field>`
    );
    expect(el.size).to.equal(COMPACT_SIZE.lg);
    expect(el.getCurrentIconSize()).to.equal('md');

    el.size = COMPACT_SIZE.md;
    expect(el.getCurrentIconSize()).to.equal('sm');
    
    el.size = COMPACT_SIZE.sm;
    expect(el.getCurrentIconSize()).to.equal('xxs');
  });
});
