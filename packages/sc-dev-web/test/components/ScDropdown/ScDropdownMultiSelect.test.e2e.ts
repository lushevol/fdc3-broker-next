/* eslint-disable indent */
import { aTimeout, expect, fixture, fixtureCleanup, html, oneEvent } from '@open-wc/testing';
import {
  TData,
} from '../../../src/components/ScDropdown/ScDropdownInput.js';
import {
  ScDropdownMultiSelect,
} from '../../../src/components/ScDropdown/ScDropdownMultiSelect.js';
import '../../../elements/sc-dropdown-input.js';
import { generateOptionDom, pieceOfData, pieceOfHtml } from './utils.js';
import {
  clickOnElement,
  clickOnTriggerOfDropdown,
  moveMouseOnElement,
  runDelete,
} from '../../shared/simulation.js';
import SlDropdown from '@shoelace-style/shoelace/dist/components/dropdown/dropdown.component.js';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.component.js';
import { ScTextInput } from '../../../src/components/ScFormInput/ScTextInput.js';
import {
  sendKeys,
  sendMouse,
  setViewport,
} from '@web/test-runner-commands';
import sinon from 'sinon';
import { ScCheckbox } from '../../../elements/sc-checkbox.js';

describe('dropdown e2e testing', () => {
  let testEl: ScDropdownMultiSelect;
  let visualElement: HTMLDivElement;

  let slDropdown: SlDropdown;
  let slPopup: SlPopup | null | undefined;
  let popupEl: HTMLElement | null | undefined;
  let trigger: ScTextInput;
  const onSelectSpy = sinon.spy();
  const onClearSpy = sinon.spy();
  const onInputSpy = sinon.spy();
  const getClickableItems = () => {
    return slDropdown
      .querySelector('sl-menu')
      ?.querySelectorAll('.list-item') as NodeListOf<Element>;
  };

  afterEach(async () => {
    onSelectSpy.resetHistory();
    onClearSpy.resetHistory();
    onInputSpy.resetHistory();
    fixtureCleanup();
  });

  const queryEls = async () => {
    await testEl.updateComplete;
    slDropdown = testEl.dropdown;
    slPopup = slDropdown.shadowRoot?.querySelector('sl-popup');
    popupEl = slPopup?.shadowRoot?.querySelector('.popup');
    trigger = testEl.input;
  };

  describe('html', () => {
    const menuItemLength = 20;
    beforeEach(async () => {
      visualElement = document.createElement('div');
      visualElement.style.setProperty('height', '500px');

      const dom = await fixture<HTMLElement>(
        html`
          <div>
            <button>i am a button</button>
            <sc-dropdown-multi-select
              clearable
              @sc-select=${() => {
                onSelectSpy();
              }}
              @sc-clear=${() => {
                onClearSpy();
              }}
              @sc-input=${() => {
                onInputSpy();
              }}
            >
              ${pieceOfHtml(menuItemLength)}
            </sc-dropdown-multi-select>
          </div>
        `,
        {
          parentNode: visualElement,
        }
      );
      testEl = dom.querySelector('sc-dropdown-multi-select') as ScDropdownMultiSelect;
      await queryEls();
    });

    it('click trigger', async () => {
      expect(
        testEl.scrollElement.querySelectorAll('.list-item').length
      ).to.equal(menuItemLength);

      // current will convert dom to data, so original dom wont remove.
      expect(
        testEl.scrollElement.querySelectorAll('.list-item').length
      ).to.equal(testEl.querySelectorAll('sc-dropdown-option').length);

      expect(popupEl?.classList.contains('popup--active')).to.equal(false);

      await clickOnTriggerOfDropdown(testEl);

      expect(popupEl?.classList.contains('popup--active')).to.equal(true);
    });

    it('select one dropdown item', async () => {
      // select one
      expect(popupEl?.classList.contains('popup--active')).to.equal(false);
      await clickOnTriggerOfDropdown(testEl);
      expect(popupEl?.classList.contains('popup--active')).to.equal(true);
      const selectPromise = oneEvent(testEl, 'sc-select');
      await clickOnElement(getClickableItems()[0]);
      const { detail } = await selectPromise;
      await aTimeout(70);
      expect(trigger.value).to.equal(detail.value.length);
      expect(onSelectSpy.callCount).to.equal(1);
      expect(detail.value.join()).to.equal('0');

      

      // click on clear
      await moveMouseOnElement(trigger, 'right', -30);
      const clearEl = trigger.shadowRoot?.querySelector(
        '.clear'
      ) as HTMLElement;
      await moveMouseOnElement(clearEl);
      await clickOnElement(clearEl);
      
      expect(onClearSpy.callCount).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(2);
      expect(trigger.value).to.equal(0);
      

      // clear by set .value
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(70);
      
      expect(trigger.value).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(3);
      testEl.value = [];
      await testEl.updateComplete;
      await aTimeout(70);
      // expect(trigger.value).to.equal(0);
      expect(onClearSpy.callCount).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(3);

    });

    it('manually html - should keep events from slot', async () => {
      const onClickSpy = sinon.spy();
      
      fixtureCleanup();
      testEl = await fixture<ScDropdownMultiSelect>(html`
        <sc-dropdown-multi-select>
          <sc-dropdown-option value="english">item 1</sc-dropdown-option>
          <sc-dropdown-option class="option2" value="mandarin">
            <span>Mandarin</span>
            <sc-link @click=${() => onClickSpy()}>View more</sc-link>
          </sc-dropdown-option>
        </sc-dropdown-multi-select>
      `);

      await queryEls();

      await clickOnTriggerOfDropdown(testEl);

      const dropdownOption = getClickableItems()[1];
      const link = dropdownOption.querySelector('sc-link') as HTMLElement;
      await clickOnElement(link);

      // do not keep event from slot by default, will update in the future.
      expect(onClickSpy.callCount).to.equal(0);
    });

    it('focus + type + unfocus', async () => {
      const text = 'abcdef';
      const optionInput = await testEl.shadowRoot?.querySelector('.option-input')  as HTMLInputElement;
      expect(optionInput.value).to.equal('');
      await clickOnTriggerOfDropdown(testEl);
      await sendKeys({ type: text });
      expect(onInputSpy.callCount).to.equal(text.length);
      expect(optionInput.value).to.equal(text);
      await sendMouse({
        type: 'click',
        position: [0, 0],
      });
      expect(optionInput.value).to.equal('');
    });

    it('search', async () => {
      let text = 'option 0';
      await clickOnTriggerOfDropdown(testEl);
      await sendKeys({ type: text });
      expect(getClickableItems().length).to.equal(1);

      await runDelete(1);
      text = '1';
      await sendKeys({ type: text });
      expect(getClickableItems().length).to.equal(11);


      await clickOnElement(getClickableItems()[2]);
      expect(testEl._value[0]).to.equal('11');
      expect(onSelectSpy.callCount).to.equal(1);
    });
  });

  describe('data', () => {
    let data: TData[];
    beforeEach(async () => {
      visualElement = document.createElement('div');
      visualElement.style.setProperty('height', '500px');

      const dom = await fixture<HTMLElement>(
        html`
          <div>
            <button>i am a button</button>
            <sc-dropdown-multi-select
              clearable
              @sc-select=${() => {
                onSelectSpy();
              }}
              @sc-clear=${() => {
                onClearSpy();
              }}
              @sc-input=${() => {
                onInputSpy();
              }}
            >
            </sc-dropdown-multi-select>
          </div>
        `,
        {
          parentNode: visualElement,
        }
      );
      testEl = dom.querySelector('sc-dropdown-multi-select') as ScDropdownMultiSelect;
      data = [pieceOfData(), pieceOfData(true)];
      testEl.data = data;
      await queryEls();
    });
    it('is virtual', async () => {
      expect(testEl.scrollElement.classList.contains('virtual-list')).to.equal(
        true
      );

      // select one
      await clickOnTriggerOfDropdown(testEl);
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(70);
      expect(testEl._value.length).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(1);

      // empty data
      testEl.data = [];
      testEl.clear();
      trigger.value = '';
      await testEl.updateComplete;
      expect(testEl._value.length).to.equal(0);
      expect(onSelectSpy.callCount).to.equal(2);
      expect(getClickableItems().length).to.equal(0);

      // add physical element
      testEl.appendChild(generateOptionDom('test1'));
      testEl.appendChild(generateOptionDom('test2'));
      await aTimeout(70);
      expect(getClickableItems().length).to.equal(2);

      // select physical one
      await clickOnElement(getClickableItems()[1]);
      await aTimeout(70);
      expect(testEl._value.length).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(3);

    });

    it('hierachical', async () => {
      setViewport({ width: 1920, height: 2000 });
      testEl.data = [pieceOfData(false, 2, 2), pieceOfData(true, 2, 2)];
      await clickOnTriggerOfDropdown(testEl);
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(70);
      await clickOnElement(getClickableItems()[1]);
      await aTimeout(70);
      await clickOnElement(getClickableItems()[2]);
      await aTimeout(70);
      expect(testEl._value.length).to.equal(1);
      expect(getClickableItems().length).to.equal(6);

      // select all option of second item
      const scCheckbox = getClickableItems()[1].querySelector('sc-checkbox') as ScCheckbox;
      const slCheckbox = scCheckbox.shadowRoot?.querySelector('sl-checkbox');
      const checkboxOfSecondOption = slCheckbox?.shadowRoot?.querySelector('.checkbox__input') as HTMLElement;
      await clickOnElement(checkboxOfSecondOption);
      
      expect(getClickableItems().length).to.equal(6);
      expect(testEl._value.length).to.equal(3);
      expect(onSelectSpy.callCount).to.equal(2);
    });
    it('get deleted items', async () => {
        
      await clickOnTriggerOfDropdown(testEl);
      let selectPromise = oneEvent(testEl, 'sc-select');
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(70);
      const { detail } = await selectPromise;
      const previousVal = detail.value[0];
      selectPromise = oneEvent(testEl, 'sc-select');
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(70);
      const { detail: detail2 } = await selectPromise;
      expect(previousVal).to.equal(detail2.deletedValues[0]);
    });

  });
});
