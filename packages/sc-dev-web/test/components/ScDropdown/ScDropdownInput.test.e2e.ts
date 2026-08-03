/* eslint-disable indent */
import { aTimeout, expect, fixture, fixtureCleanup, html, oneEvent } from '@open-wc/testing';
import {
  ScDropdownInput,
  TData,
} from '../../../src/components/ScDropdown/ScDropdownInput.js';
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

describe('dropdown e2e testing', () => {
  let testEl: ScDropdownInput;
  let visualElement: HTMLDivElement;

  let slDropdown: SlDropdown;
  let slPopup: SlPopup | null | undefined;
  let popupEl: HTMLElement | null | undefined;
  let trigger: ScTextInput;
  let button: HTMLButtonElement;
  const onSelectSpy = sinon.spy();
  const onClearSpy = sinon.spy();
  const onInputSpy = sinon.spy();
  const getClickableItems = () => {
    return slDropdown
      .querySelector('sl-menu')
      ?.querySelectorAll('sl-menu-item') as NodeListOf<Element>;
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
    button = testEl.parentElement?.querySelector('button') as HTMLButtonElement;
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
            <sc-dropdown-input
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
            </sc-dropdown-input>
          </div>
        `,
        {
          parentNode: visualElement,
        }
      );
      testEl = dom.querySelector('sc-dropdown-input') as ScDropdownInput;
      await queryEls();
    });

    it('click trigger', async () => {
      expect(
        testEl.scrollElement.querySelectorAll('sl-menu-item').length
      ).to.equal(menuItemLength);

      // current will convert dom to data, so original dom wont remove.
      expect(
        testEl.scrollElement.querySelectorAll('sl-menu-item').length
      ).to.equal(testEl.querySelectorAll('sc-dropdown-option').length);

      expect(popupEl?.classList.contains('popup--active')).to.equal(false);

      await clickOnTriggerOfDropdown(testEl);

      expect(popupEl?.classList.contains('popup--active')).to.equal(true);
    });

    it('clear by click clear icon', async () => {
      // select one
      expect(popupEl?.classList.contains('popup--active')).to.equal(false);
      await clickOnTriggerOfDropdown(testEl);
      expect(popupEl?.classList.contains('popup--active')).to.equal(true);
      const selectPromise = oneEvent(testEl, 'sc-select');
      await clickOnElement(getClickableItems()[0]);
      const { detail } = await selectPromise;
      await aTimeout(70);
      expect(trigger.value).to.equal('option 0');
      expect(onSelectSpy.callCount).to.equal(1);
      expect(detail.value).to.equal('0');

      // click on clear
      await moveMouseOnElement(trigger, 'right', -30);
      const clearEl = trigger.shadowRoot?.querySelector(
        '.clear'
      ) as HTMLElement;
      await moveMouseOnElement(clearEl);
      await clickOnElement(clearEl);
      expect(onClearSpy.callCount).to.equal(1);
      expect(onSelectSpy.callCount).to.equal(2);
      expect(trigger.value).to.equal('');

    });
    it('clear by set empty value', async () => {
      // select one
      expect(popupEl?.classList.contains('popup--active')).to.equal(false);
      await clickOnTriggerOfDropdown(testEl);
      expect(popupEl?.classList.contains('popup--active')).to.equal(true);
      const selectPromise = oneEvent(testEl, 'sc-select');
      await clickOnElement(getClickableItems()[0]);
      const { detail } = await selectPromise;
      await aTimeout(70);
      expect(trigger.value).to.equal('option 0');
      expect(onSelectSpy.callCount).to.equal(1);
      expect(detail.value).to.equal('0');

      
      // clear by set .value
      await clickOnElement(button);
      await aTimeout(70);
      await clickOnTriggerOfDropdown(testEl);
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(70);
      expect(trigger.value).to.equal('option 0');
      expect(onSelectSpy.callCount).to.equal(2);
      testEl.value = '';
      await testEl.updateComplete;
      expect(trigger.value).to.equal('');
      expect(onClearSpy.callCount).to.equal(0);
      expect(onSelectSpy.callCount).to.equal(2);


    });
    it('clear by delete input text', async () => {
      // select one
      expect(popupEl?.classList.contains('popup--active')).to.equal(false);
      await clickOnTriggerOfDropdown(testEl);
      expect(popupEl?.classList.contains('popup--active')).to.equal(true);
      const selectPromise = oneEvent(testEl, 'sc-select');
      await clickOnElement(getClickableItems()[0]);
      const { detail } = await selectPromise;
      await aTimeout(70);
      expect(trigger.value).to.equal('option 0');
      expect(onSelectSpy.callCount).to.equal(1);
      expect(detail.value).to.equal('0');

      
      // clear by delete input text
      await clickOnElement(button);
      await aTimeout(70);
      await clickOnTriggerOfDropdown(testEl);
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(70);
      expect(trigger.value).to.equal('option 0');
      expect(onSelectSpy.callCount).to.equal(2);

      await clickOnTriggerOfDropdown(testEl);
      await runDelete(10);
      expect(trigger.value).to.equal('');
      expect(onClearSpy.callCount).to.equal(0);
      expect(onSelectSpy.callCount).to.equal(3);


    });

    it('manually html - should keep events from slot', async () => {
      fixtureCleanup();
      const onClickSpy = sinon.spy();
      testEl = await fixture<ScDropdownInput>(html`
        <sc-dropdown-input>
          <sc-dropdown-option value="english">item 1</sc-dropdown-option>
          <sc-dropdown-option class="option2" value="mandarin">
            <span>Mandarin</span>
            <sc-link @click=${() => onClickSpy()}>View more</sc-link>
          </sc-dropdown-option>
        </sc-dropdown-input>
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
      expect(trigger.value).to.equal('');
      await clickOnTriggerOfDropdown(testEl);
      await sendKeys({ type: text });
      expect(onInputSpy.callCount).to.equal(text.length);
      expect(trigger.value).to.equal(text);
      await sendMouse({
        type: 'click',
        position: [0, 0],
      });
      expect(trigger.value).to.equal('');
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
      expect(trigger.value).to.equal('option 11');
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
            <sc-dropdown-input
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
            </sc-dropdown-input>
          </div>
        `,
        {
          parentNode: visualElement,
        }
      );
      testEl = dom.querySelector('sc-dropdown-input') as ScDropdownInput;
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
      expect(trigger.value).not.to.equal('');
      expect(onSelectSpy.callCount).to.equal(1);

      // empty data
      await clickOnElement(button);
      await aTimeout(70);
      testEl.data = [];
      trigger.value = '';
      await testEl.updateComplete;
      expect(trigger.value).to.equal('');
      expect(getClickableItems().length).to.equal(0);

      // add physical element
      testEl.appendChild(generateOptionDom('test1'));
      testEl.appendChild(generateOptionDom('test2'));
      await aTimeout(70);
      expect(getClickableItems().length).to.equal(2);

      // select physical one
      await clickOnTriggerOfDropdown(testEl);
      await clickOnElement(getClickableItems()[1]);
      await aTimeout(70);
      expect(trigger.value).to.equal('test2');
      expect(onSelectSpy.callCount).to.equal(2);

    });

    it('hierachical', async () => {
      setViewport({ width: 1920, height: 2000 });
      testEl.data = [pieceOfData(false, 2, 2), pieceOfData(true, 2, 2)];
      let previousSelectedLabel = trigger.value;
      await clickOnTriggerOfDropdown(testEl);
      await clickOnElement(getClickableItems()[0]);
      await aTimeout(100);
      await clickOnElement(getClickableItems()[1]);
      await aTimeout(100);
      await clickOnElement(getClickableItems()[2]);
      await aTimeout(100);
      expect(previousSelectedLabel).not.to.equal(trigger.value);
      expect(getClickableItems().length).to.equal(6);
      previousSelectedLabel = trigger.value;
    });
  });
});
