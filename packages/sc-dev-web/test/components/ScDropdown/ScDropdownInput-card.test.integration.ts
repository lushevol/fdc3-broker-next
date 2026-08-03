import {
  aTimeout,
  defineCE,
  fixture,
  fixtureCleanup,
  html,
  unsafeStatic,
} from '@open-wc/testing';
import '../../../elements/sc-dropdown-input.js';
import ScElement from '../../../src/shared/sc-element.js';
import { query } from 'lit/decorators.js';
import { clickOnElement } from '../../shared/simulation.js';
import { visualDiff } from '../../shared/visualDiff.js';
import { setViewport } from '@web/test-runner-commands';
import '../../../elements/sc-card.js';
import { ScDropdownMultiSelect } from '../../../src/components/ScDropdown/ScDropdownMultiSelect.js';
import { ScDropdownInput } from '../../../src/components/ScDropdown/ScDropdownInput.js';
import { ScCard } from '../../../src/components/ScCard/ScCard.js';

class DropdownModal extends ScElement {
  @query('sc-dropdown-input') dropdown: ScDropdownInput;
  @query('sc-card') card: ScCard;

  render() {
    return html`
      <sc-card
        text-align="left"
        vertical-align="middle"
        icon-size="md"
        icon-vertical-align="middle"
      >
        <div slot="title">title</div>
        <div slot="sub-title">sub title</div>
        <div slot="body">
          <sc-dropdown-input
            label="Dropdown"
            label-size="xs"
            placeholder="Please select"
            border-type="box"
          >
            <sc-dropdown-option value="english">item 1</sc-dropdown-option>
            <sc-dropdown-option value="mandarin">item 2</sc-dropdown-option>
            <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
            <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
            <sc-dropdown-option value="french">French</sc-dropdown-option>
          </sc-dropdown-input>
        </div>
        <div slot="footer">footer</div>
      </sc-card>
    `;
  }
}

class MultiDropdownModal extends ScElement {
  @query('sc-dropdown-multi-select') dropdown: ScDropdownMultiSelect;
  @query('sc-card') card: ScCard;

  render() {
    return html`
      <sc-card
        text-align="left"
        vertical-align="middle"
        icon-size="md"
        icon-vertical-align="middle"
      >
        <div slot="title">title</div>
        <div slot="sub-title">sub title</div>
        <div slot="body">
          <sc-dropdown-multi-select
            label="Dropdown"
            label-size="xs"
            placeholder="Please select"
            border-type="box"
          >
            <sc-dropdown-option value="english">item 1</sc-dropdown-option>
            <sc-dropdown-option value="mandarin">item 2</sc-dropdown-option>
            <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
            <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
            <sc-dropdown-option value="french">French</sc-dropdown-option>
          </sc-dropdown-multi-select>
        </div>
        <div slot="footer">footer</div>
      </sc-card>
    `;
  }
}

const DropdownModalEl = defineCE(DropdownModal);
const dropdownTag = unsafeStatic(DropdownModalEl);
const MultiDropdownModalEl = defineCE(MultiDropdownModal);
const multiDropdownTag = unsafeStatic(MultiDropdownModalEl);

describe('integration testing - dropdown card', () => {
  let visualElement: HTMLDivElement;
  let testEl: DropdownModal;

  afterEach(async () => {
    fixtureCleanup();
  });

  beforeEach(async () => {
    visualElement = document.createElement('div');
    visualElement.style.setProperty('height', '700px');
    setViewport({ width: 1080, height: 800 });

    testEl = await fixture<DropdownModal>(
      html`<${dropdownTag}></${dropdownTag}>`,
      {
        parentNode: visualElement,
      }
    );

    await testEl.updateComplete;

    await clickOnElement(testEl.dropdown.input);
    await aTimeout(70);
  });

  it('single dropdown without hoist', async () => {
    await visualDiff(
      visualElement,
      'dropdown-card-single-dropdown-without-hoist'
    );
  });

  it('single dropdown with hoist', async () => {
    testEl.dropdown.toggleAttribute('hoist');
    await testEl.updateComplete;
    await aTimeout(1);

    await visualDiff(visualElement, 'dropdown-card-single-dropdown-with-hoist');
  });

  it('single dropdown with selected', async () => {
    testEl.dropdown.toggleAttribute('hoist');
    await testEl.updateComplete;
    await aTimeout(1);

    // select one
    await clickOnElement(
      testEl.dropdown.scrollElement.querySelectorAll('sl-menu-item')[0]
    );
    await aTimeout(70);

    await visualDiff(
      visualElement,
      'dropdown-card-single-dropdown-with-selected'
    );
  });
});

// multiple area
describe('integration testing - multiple dropdown card', () => {
  let visualElement: HTMLDivElement;
  let testEl: MultiDropdownModal;

  afterEach(async () => {
    fixtureCleanup();
  });

  beforeEach(async () => {
    visualElement = document.createElement('div');
    visualElement.style.setProperty('height', '700px');
    setViewport({ width: 1080, height: 800 });
    testEl = await fixture<MultiDropdownModal>(
      html`<${multiDropdownTag}></${multiDropdownTag}>`,
      {
        parentNode: visualElement,
      }
    );

    await testEl.updateComplete;

    await clickOnElement(testEl.dropdown.input);
    await aTimeout(70);
  });

  it('multiple dropdown without hoist', async () => {
    await visualDiff(
      visualElement,
      'dropdown-card-multiple-dropdown-without-hoist'
    );
  });

  it('multiple dropdown with hoist', async () => {
    testEl.dropdown.toggleAttribute('hoist');
    await testEl.updateComplete;
    await aTimeout(1);

    await visualDiff(
      visualElement,
      'dropdown-card-multiple-dropdown-with-hoist'
    );
  });

  it('multiple dropdown with selected', async () => {
    testEl.dropdown.toggleAttribute('hoist');
    await testEl.updateComplete;
    await aTimeout(1);

    // select one
    await clickOnElement(
      testEl.dropdown.scrollElement.querySelectorAll('.list-item')[0]
    );
    await aTimeout(70);

    await visualDiff(
      visualElement,
      'dropdown-card-multiple-dropdown-with-selected'
    );
  });
});
