import {
  aTimeout,
  defineCE,
  expect,
  fixture,
  fixtureCleanup,
  html,
  unsafeStatic,
  waitUntil,
} from '@open-wc/testing';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-accordion.js';
import ScElement from '../../../src/shared/sc-element.js';
import { property, query, state } from 'lit/decorators.js';
import { clickOnElement, clickOnTriggerOfDropdown } from '../../shared/simulation.js';
import { ScDropdownInput } from '../../../src/components/ScDropdown/ScDropdownInput.js';
import { ScDropdownMultiSelect } from '../../../src/components/ScDropdown/ScDropdownMultiSelect.js';
import sinon from 'sinon';
import { visualDiff } from '../../shared/visualDiff.js';
import { ScAccordion } from '../../../src/components/ScAccordion/ScAccordion.js';
import { setViewport } from '@web/test-runner-commands';

class DropdownModal extends ScElement {
  @state() open = false;
  @property() hoist = false;
  @query('sc-dropdown-input') dropdown: ScDropdownInput;
  @query('sc-accordion') accordion: ScAccordion;

  onShowCb = sinon.spy();
  onHideCb = sinon.spy();

  toggleAccordion() {
    this.open = !this.open;
  }

  render() {
    return html`
      <sc-accordion
        @sc-show=${() => this.onShowCb()}
        @sc-hide=${() => this.onHideCb()}
        ?open=${this.open}
        summary-line="0"
        icon-position="right"
      >
        <div slot="summary">here is title</div>

        <sc-dropdown-input
          ?hoist=${this.hoist}
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
      </sc-accordion>
    `;
  }
}

class MultiDropdownModal extends ScElement {
  @state() open = false;
  @property() hoist = false;
  @query('sc-dropdown-multi-select') dropdown: ScDropdownMultiSelect;
  @query('sc-accordion') accordion: ScAccordion;

  onShowCb = sinon.spy();
  onHideCb = sinon.spy();

  toggleAccordion() {
    this.open = !this.open;
  }

  render() {
    return html`
      <sc-accordion
        @sc-show=${() => this.onShowCb()}
        @sc-hide=${() => this.onHideCb()}
        ?open=${this.open}
        summary-line="0"
        icon-position="right"
      >
        <div slot="summary">here is title</div>

        <sc-dropdown-multi-select
          ?hoist=${this.hoist}
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
      </sc-accordion>
    `;
  }
}

const DropdownModalEl = defineCE(DropdownModal);
const dropdownTag = unsafeStatic(DropdownModalEl);
const MultiDropdownModalEl = defineCE(MultiDropdownModal);
const multiDropdownTag = unsafeStatic(MultiDropdownModalEl);

describe('integration testing - dropdown accordion', () => {
  let visualElement: HTMLDivElement;

  afterEach(async () => {
    fixtureCleanup();
  });

  beforeEach(async () => {
    visualElement = document.createElement('div');
    visualElement.style.setProperty('height', '700px');
    setViewport({ width: 1080, height: 800 });
  });

  it('single dropdown without hoist', async () => {
    const testEl = await fixture<DropdownModal>(
      html`
      <${dropdownTag}></${dropdownTag}>
      `,
      {
        parentNode: visualElement,
      }
    );
    const watiForOpen = waitUntil(
      () => testEl.onShowCb.called,
      'open modal show be called'
    );
    testEl.toggleAccordion();
    await watiForOpen;
    await aTimeout(200);

    await clickOnTriggerOfDropdown(testEl.dropdown);

    expect(testEl.onShowCb.callCount).to.equal(1);
    await visualDiff(
      visualElement,
      'dropdown-accordion-single-dropdown-without-hoist'
    );
  });

  it('single dropdown with hoist', async () => {
    const testEl = await fixture<DropdownModal>(
      html`
      <${dropdownTag} .hoist=${true}></${dropdownTag}>
      `,
      {
        parentNode: visualElement,
      }
    );
    const watiForOpen = waitUntil(
      () => testEl.onShowCb.called,
      'open modal show be called'
    );
    testEl.toggleAccordion();
    await watiForOpen;
    await aTimeout(200);
    await clickOnTriggerOfDropdown(testEl.dropdown);
    expect(testEl.onShowCb.callCount).to.equal(1);

    await visualDiff(
      visualElement,
      'dropdown-accordion-single-dropdown-with-hoist'
    );
  });

  it('single dropdown with selected', async () => {
    const testEl = await fixture<DropdownModal>(
      html`
      <${dropdownTag} .hoist=${true}></${dropdownTag}>
      `,
      {
        parentNode: visualElement,
      }
    );
    const watiForOpen = waitUntil(
      () => testEl.onShowCb.called,
      'open modal show be called'
    );
    testEl.toggleAccordion();
    await watiForOpen;
    await aTimeout(200);
    await clickOnTriggerOfDropdown(testEl.dropdown);
    expect(testEl.onShowCb.callCount).to.equal(1);
    // select one
    await clickOnElement(
      testEl.dropdown.scrollElement.querySelectorAll('sl-menu-item')[0]
    );
    await aTimeout(70);

    await visualDiff(
      visualElement,
      'dropdown-accordion-single-dropdown-with-selected'
    );
  });
});

// multiple area
describe('integration testing - multiple dropdown accordion', () => {
  let visualElement: HTMLDivElement;

  afterEach(async () => {
    fixtureCleanup();
  });

  beforeEach(async () => {
    visualElement = document.createElement('div');
    visualElement.style.setProperty('height', '700px');
    setViewport({ width: 1080, height: 800 });
  });

  it('multiple dropdown without hoist', async () => {
    const testEl = await fixture<DropdownModal>(
      html`
      <${multiDropdownTag}></${multiDropdownTag}>
      `,
      {
        parentNode: visualElement,
      }
    );
    const watiForOpen = waitUntil(
      () => testEl.onShowCb.called,
      'open modal show be called'
    );
    testEl.toggleAccordion();
    await watiForOpen;
    await aTimeout(200);

    await clickOnTriggerOfDropdown(testEl.dropdown);

    expect(testEl.onShowCb.callCount).to.equal(1);
    await visualDiff(
      visualElement,
      'dropdown-accordion-multiple-dropdown-without-hoist'
    );
  });

  it('multiple dropdown with hoist', async () => {
    const testEl = await fixture<DropdownModal>(
      html`
      <${multiDropdownTag} .hoist=${true}></${multiDropdownTag}>
      `,
      {
        parentNode: visualElement,
      }
    );
    const watiForOpen = waitUntil(
      () => testEl.onShowCb.called,
      'open modal show be called'
    );
    testEl.toggleAccordion();
    await watiForOpen;
    await aTimeout(200);
    await clickOnTriggerOfDropdown(testEl.dropdown);
    expect(testEl.onShowCb.callCount).to.equal(1);

    await visualDiff(
      visualElement,
      'dropdown-accordion-multiple-dropdown-with-hoist'
    );
  });

  it('multiple dropdown with selected', async () => {
    const testEl = await fixture<DropdownModal>(
      html`
      <${multiDropdownTag} .hoist=${true}></${multiDropdownTag}>
      `,
      {
        parentNode: visualElement,
      }
    );
    const watiForOpen = waitUntil(
      () => testEl.onShowCb.called,
      'open modal show be called'
    );
    testEl.toggleAccordion();
    await watiForOpen;
    await aTimeout(200);
    await clickOnTriggerOfDropdown(testEl.dropdown);
    expect(testEl.onShowCb.callCount).to.equal(1);
    // select one
    await clickOnElement(
      testEl.dropdown.scrollElement.querySelectorAll('.list-item')[0]
    );
    await aTimeout(70);

    await visualDiff(
      visualElement,
      'dropdown-accordion-multiple-dropdown-with-selected'
    );
  });
});
