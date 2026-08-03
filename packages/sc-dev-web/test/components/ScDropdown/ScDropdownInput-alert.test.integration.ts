import {
  aTimeout,
  defineCE,
  fixture,
  fixtureCleanup,
  html,
  oneEvent,
  unsafeStatic,
} from '@open-wc/testing';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-alert.js';
import ScElement from '../../../src/shared/sc-element.js';
import { query } from 'lit/decorators.js';
import { clickOnElement } from '../../shared/simulation.js';
import { visualDiff } from '../../shared/visualDiff.js';
import { setViewport } from '@web/test-runner-commands';
import { ScDropdownMultiSelect } from '../../../src/components/ScDropdown/ScDropdownMultiSelect.js';
import { ScDropdownInput } from '../../../src/components/ScDropdown/ScDropdownInput.js';
import { ScAlert } from '../../../src/components/ScAlert/ScAlert.js';

class DropdownModal extends ScElement {
  @query('sc-dropdown-input') dropdown: ScDropdownInput;
  @query('sc-alert') alert: ScAlert;

  get slAlert() {
    return this.alert.shadowRoot?.querySelector('sl-alert') as HTMLElement;
  }
  get slDetails() {
    return this.slAlert.querySelector('sl-details') as HTMLElement;
  }

  render() {
    return html`
      <sc-alert type="info" mode="default" title="This is an alert.">
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
      </sc-alert>
    `;
  }
}

class MultiDropdownModal extends ScElement {
  @query('sc-dropdown-multi-select') dropdown: ScDropdownMultiSelect;
  @query('sc-alert') alert: ScAlert;

  get slAlert() {
    return this.alert.shadowRoot?.querySelector('sl-alert') as HTMLElement;
  }
  get slDetails() {
    return this.slAlert.querySelector('sl-details') as HTMLElement;
  }

  render() {
    return html`
      <sc-alert type="info" mode="default" title="This is an alert.">
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
      </sc-alert>
    `;
  }
}

const DropdownModalEl = defineCE(DropdownModal);
const dropdownTag = unsafeStatic(DropdownModalEl);
const MultiDropdownModalEl = defineCE(MultiDropdownModal);
const multiDropdownTag = unsafeStatic(MultiDropdownModalEl);

describe('integration testing - dropdown alert', () => {
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

    const afterShowDetail = oneEvent(testEl.slDetails, 'sl-after-show');

    testEl.slDetails.toggleAttribute('open');
    await afterShowDetail;
    await aTimeout(1);

    await clickOnElement(testEl.dropdown.input);
    await aTimeout(70);
  });

  it('single dropdown without hoist', async () => {
    await visualDiff(
      visualElement,
      'dropdown-alert-single-dropdown-without-hoist'
    );
  });

  it('single dropdown with hoist', async () => {
    testEl.dropdown.toggleAttribute('hoist');
    await testEl.updateComplete;
    await aTimeout(1);

    await visualDiff(
      visualElement,
      'dropdown-alert-single-dropdown-with-hoist'
    );
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
      'dropdown-alert-single-dropdown-with-selected'
    );
  });
});

// multiple area
describe('integration testing - multiple dropdown alert', () => {
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

    const afterShowDetail = oneEvent(testEl.slDetails, 'sl-after-show');

    testEl.slDetails.toggleAttribute('open');
    await afterShowDetail;
    await aTimeout(1);

    await clickOnElement(testEl.dropdown.input);
    await aTimeout(70);
  });

  it('multiple dropdown without hoist', async () => {
    await visualDiff(
      visualElement,
      'dropdown-alert-multiple-dropdown-without-hoist'
    );
  });

  it('multiple dropdown with hoist', async () => {
    testEl.dropdown.toggleAttribute('hoist');
    await testEl.updateComplete;
    await aTimeout(1);

    await visualDiff(
      visualElement,
      'dropdown-alert-multiple-dropdown-with-hoist'
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
      'dropdown-alert-multiple-dropdown-with-selected'
    );
  });
});
