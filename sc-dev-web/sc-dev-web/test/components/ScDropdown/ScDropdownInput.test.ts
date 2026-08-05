import { html, render } from 'lit';
import { fixture, expect, nextFrame, waitUntil } from '@open-wc/testing';
import { ScDropdownInput, TDropdown } from '../../../src/components/ScDropdown/ScDropdownInput.js';
import '../../../elements/sc-dropdown-input.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import { hierarchyData, customData, customDataWithDisplayValue } from './testData.js';
import sinon from 'sinon';
import { mockMatchMedia } from '../../shared/mediaQuery.js';
import { mockAnimation } from '../../shared/animation.js';

mockAnimation();
window.customElements.define('sl-menu-item', SlMenuItem);

function updateDataFn(element: ScDropdownInput) {
  const d = [];
  for (let i = 0; i < 100; i++) {
    const option = `${i}created option - XXXX`;
    d.push({
      label: () => html`<sc-dropdown-option style="" value='${option}'>
          ${option}
          
        <sc-button no-pill @click=${() => console.log('test', i)}>555555</sc-button>
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

describe('ScDropdownInput', () => {
  beforeEach(()=>{
    mockAnimation();
  });

  it('renders default search field', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);

    expect(el.emptyText).to.equal('No data found');
    expect(el.placeholder).to.equal('Please select');
    expect(el.threshold).to.equal(3);
    expect(el.error).to.equal(false);
    expect(el.success).to.equal(false);
    expect(el.readonly).to.equal(false);
    expect(el.required).to.equal(false);
    expect(el.label).to.equal('Select from dropdown');
    expect(el.helpText).to.equal('');
    expect(el.errorMessage).to.equal('');
    expect(el.successMessage).to.equal('');
    expect(el.displayRawValue).to.equal(false);
    expect(el.originalOptions.length).to.equal(2);
  });

  it('renders search field with suggestions', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input
        error
        error-message="Error Message"
      >
        <div slot='label'>this is label</div>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <div slot="empty-text">No data, please try another value</div>
      </sc-dropdown-input>
    `);
    expect(el.error).to.equal(true);
    expect(el.errorMessage).to.equal('Error Message');
  });

  it('renders with menu on left', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input
        float="left"
      >
      </sc-dropdown-input>
    `);
    const slDropdown = el.shadowRoot!.querySelector('sl-dropdown');
    expect(slDropdown?.getAttribute('placement')).to.equal('bottom-start');
  });

  it('renders with menu on center', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input
        float="center"
      >
      </sc-dropdown-input>
    `);
    const slDropdown = el.shadowRoot!.querySelector('sl-dropdown');
    expect(slDropdown?.getAttribute('placement')).to.equal('bottom');
  });

  it('renders with menu on right', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input
        float="right"
      >
      </sc-dropdown-input>
    `);
    const slDropdown = el.shadowRoot!.querySelector('sl-dropdown');
    expect(slDropdown?.getAttribute('placement')).to.equal('bottom-end');
  });

  it('call updateOptions function', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input tooltip='tooltip'>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
        <div slot="empty-text">No data, please try another value</div>
      </sc-dropdown-input>
    `);
    expect(el.querySelectorAll('sc-dropdown-option').length).to.equal(2);
  });

  it('call handleTextInput function', async () => {
    const dropdownInput = new ScDropdownInput();
    dropdownInput.handleTextInput(
      new CustomEvent('sc-input', {
        detail: {
          value: '123',
        },
      })
    );
    expect(dropdownInput.searchValue).to.equal('123');
    dropdownInput.handleFocus(
      new CustomEvent('sc-focus', {
        detail: {
          value: '123',
        },
      })
    );
  });


  it('set default value', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);
    expect(el.value).to.equal('1');
  });

  it('render disabled dropdown', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1" disabled>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);
    expect(el.value).to.equal('1');
  });

  it('call handleMenuItemSelect', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);
    const event = new CustomEvent<{ item: any }>('select', {
      detail: {
        item: {
          value: '2',
        },
      },
    });
    el.handleMenuItemSelect(event);
    expect(el.value).to.equal('2');
  });

  it('call updateListItem', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);
    expect(el.originalOptions.length).to.equal(2);
  });

  it('virtual dropdown', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
      </sc-dropdown-input>
    `);
    updateDataFn(el);

    await el.updateComplete;
    el.show();
    await nextFrame();
    // make the virtualizer render
    const scrollable = el.menu.querySelector('.scrollable-content');
    Object.defineProperty(scrollable, 'offsetHeight', { value: 1 });
    Object.defineProperty(scrollable, 'offsetWidth', { value: 1 });
    await nextFrame();

    expect(el.originalOptions.length).to.equal(0);
  });
  
  it('call updateElement', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);
    el.initializeVirtualizer();
    const div = document.createElement('div');
    render(html`
      <sl-menu-item class='dropdown-item' style="opacity: 0;"></sl-menu-item>
    `, div);
    el.updateElement(div, 1);
    el.handleBlur();

    expect(el.originalOptions.length).to.equal(2);
  });
  it('method test', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
      </sc-dropdown-input>
    `);

    el.data = hierarchyData;
    expect(el.isHierarchical).to.equal(true);
    el.isParent(hierarchyData[0] as TDropdown);
    el.searchValue = 'label-1-1';
    el.show();
    el.reset();
    el.setDropdownStatus(new Event('test-event'));
    el.updateActivePath('0');
    el.updateActivePath('0-0');
    el.updateActivePath('0-0');
    el.clickCb(new Event('test-event'));
    el.removeSelectedWhenClear();
    el.handleClear();
    el.value = hierarchyData[0].value;
    el.inputValue = hierarchyData[1].value;
    el.resetInput();

    const expandedEl = document.createElement('div');
    expandedEl.dataset.path = '0';
    el.updateExpandedBehaviour(expandedEl);

    expect(el.originalOptions.length).to.equal(0);
  });

  it('keydown', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
      </sc-dropdown-input>
    `);
    const result = el._onKeydown(new KeyboardEvent('keydown', {
      key: ' ',
    }));
    expect(result).to.equal(' ');
    const result2 = el._onKeydown(new KeyboardEvent('keydown', {
      key: 'enter',
    }));
    expect(result2).to.equal(undefined);
  });

  it('uses IntersectionObserver in updated() to observe sl-menu visibility', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);

    const menu = el.menu;
    expect(menu).to.exist;

    const originalIO = globalThis.IntersectionObserver;
    const observeSpy = sinon.spy();
    const disconnectSpy = sinon.spy();
    let callback: IntersectionObserverCallback | undefined;

    class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        callback = cb;
        expect(options?.threshold).to.deep.equal([0, 0.01]);
      }

      observe = observeSpy;
      disconnect = disconnectSpy;
      unobserve = () => undefined;
      takeRecords = () => [];
      root = null;
      rootMargin = '';
      thresholds = [0, 0.01];
    }

    // @ts-ignore override browser API for deterministic observer assertions
    globalThis.IntersectionObserver = MockIntersectionObserver;

    try {
      el.initializeVirtualizerState = true;
      el.updated();

      expect(observeSpy.calledOnce).to.equal(true);
      expect(observeSpy.firstCall.args[0]).to.equal(menu);

      callback?.([
        {
          isIntersecting: true,
          intersectionRatio: 1,
        } as IntersectionObserverEntry,
      ], {} as IntersectionObserver);

      expect(el.initializeVirtualizerState).to.equal(false);
      expect(disconnectSpy.calledOnce).to.equal(true);
    } finally {
      globalThis.IntersectionObserver = originalIO;
    }
  });

  it('lookup', async () => {
    const dropdownData = [{
      value: '1',
      label: '1',
    }, {
      value: '2',
      label: '2',
    }, {
      value: '3',
      label: '3',
    }];
    const dataLookup = (value: string) => {
      return new Promise(resolve => {
        const _dropdownData = dropdownData.map(d => ({
          value: d.value + value,
          label: d.label + value,
        }));
        resolve(_dropdownData);
      });
    };
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input .data=${dropdownData} label="Select from dropdown" value="1" .dataLookup=${dataLookup}>
      </sc-dropdown-input>
    `);

    await el.triggerLookup('234');
    expect(el.data.length).to.equal(3);
  });

  it('test render customer label', async () => {

    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown" value="1">
        <div slot="prefix">x</div>
      </sc-dropdown-input>
    `);

    el.data = hierarchyData;
    el.isParent(hierarchyData[0] as TDropdown);
    el.searchValue = 'label-1-1';
    el.show();
    el.reset();
    el.setDropdownStatus(new Event('test-event'));
    el.updateActivePath('0');
    el.updateActivePath('0-0');
    el.updateActivePath('0-0');
    el.clickCb(new Event('test-event'));
    el.removeSelectedWhenClear();
    el.handleClear();
    el.value = hierarchyData[0].value;
    el.inputValue = hierarchyData[1].displayValue;
  });

  it('should render disable option as disabled', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input>
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option disabled="true" value="2">Option2</sc-dropdown-option>
        <sc-dropdown-option disabled="true" value="3">Option3</sc-dropdown-option>
      </sc-dropdown-input>
    `);

    const items = el.shadowRoot?.querySelectorAll('.list-item');
    items?.forEach(item => {
      const checkbox = item.querySelector('sc-checkbox');
      if (checkbox && ['2', '3'].includes(checkbox.value)) {
        expect(item).to.have.attribute('disabled', 'true');
      }
    });
  });

  it('should not render hidden children in dropdownOptionsWithIndex', async () => {
    const dataWithHiddenChild = [
      {
        label: 'Parent',
        value: 'parent',
        displayValue: 'Parent',
        children: [
          { label: 'Child 1', value: 'child1', displayValue: 'Child 1' },
          { label: 'Hidden Child', value: 'hiddenChild', displayValue: 'Hidden Child', hideOption: true },
        ],
      },
    ];
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input .data=${dataWithHiddenChild} label="Test hideOption"></sc-dropdown-input>
    `);
    el.onDataChange(undefined, dataWithHiddenChild);
    el.updateIndexDropdownOptions(el.immutableDropdownOptions);
  
    const allValues = Array.from(el.immutableDropdownOptions.values()).map(opt => opt.value);
    expect(allValues).to.include('parent');
    expect(allValues).to.include('child1');
    expect(allValues).to.not.include('hiddenChild');
  
    el.updateActivePath('0');
    el.updateIndexDropdownOptions(el.immutableDropdownOptions);
  
    const renderedValues = Array.from(el.dropdownOptionsWithIndex.values())
      .filter(opt => !opt.hideOption)
      .map(opt => opt.value);
    expect(renderedValues).to.include('parent');
    expect(renderedValues).to.include('child1');
    expect(renderedValues).to.not.include('hiddenChild');
  });

  it('should not render hidden options in normal items', async () => {
    const dataWithHidden = [
      { label: 'Visible Option', value: 'visible', displayValue: 'Visible Option' },
      { label: 'Hidden Option', value: 'hidden', displayValue: 'Hidden Option', hideOption: true },
    ];
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input .data=${dataWithHidden} label="Test hideOption"></sc-dropdown-input>
    `);
    el.onDataChange(undefined, dataWithHidden);
    el.updateIndexDropdownOptions(el.immutableDropdownOptions);

    const fragment = el.renderNormalItems();
    const items = fragment.querySelectorAll('.dropdown-item');
    expect(items.length).to.equal(1);
    expect(items[0].getAttribute('value')).to.equal('visible');
  });

  it('should highlight parent items when child value is selected in hierarchical dropdown', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input .data=${hierarchyData}>
      </sc-dropdown-input>
    `);
    await el.updateComplete;
    
    // Open the dropdown to render menu items
    el.show();
    await el.updateComplete;

    // Set a child value
    el.value = 'value-1-1';
    await el.updateComplete;
    await nextFrame();
    await waitUntil(() => el.immutableDropdownOptions.size > 0, 'Dropdown options should be initialized');

    if (el.immutableDropdownOptions.size > 0) {
      const list = Array.from(el.immutableDropdownOptions);
      const parentItem = list.find(item => item.value === 'value-1');
      const childItem = list.find(item => item.value === 'value-1-1');
      
      // Both parent and child should have 'selected' class
      expect(parentItem?.checked).to.be.true;
      expect(childItem?.checked).to.be.true;
    }
  });

  it('test open attribute', async () => {
    const data = [{
      label: 'Option1',
      value: 'option1',
    }, {
      label: 'Option2',
      value: 'option2',
    }];
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input .data=${data} label="Test hideOption"></sc-dropdown-input>
    `);
    el.data = data;
    el.open = true;
    await el.updateComplete;
    expect(el.dropdown.open).to.equal(true);
    el.open = false;
    await el.updateComplete;
    expect(el.dropdown.open).to.equal(false);
  });
  it('should emit current selected displayValue in sc-select event', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown">
        <sc-dropdown-option value="1">Option1</sc-dropdown-option>
        <sc-dropdown-option value="2">Option2</sc-dropdown-option>
      </sc-dropdown-input>
    `);

    const spy = sinon.spy();
    el.addEventListener('sc-select', evt => {
      spy((evt as CustomEvent).detail);
    });

    // Use real SlMenuItem instances
    const menuItem1 = new SlMenuItem();
    menuItem1.value = '1';
    const menuItem2 = new SlMenuItem();
    menuItem2.value = '2';

    // Select the first option
    el.handleMenuItemSelect(new CustomEvent('select', {
      detail: { item: menuItem1 },
    }));
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0].displayValue).to.equal('Option1');

    // Select the second option
    el.handleMenuItemSelect(new CustomEvent('select', {
      detail: { item: menuItem2 },
    }));
    expect(spy.calledTwice).to.be.true;
    expect(spy.secondCall.args[0].displayValue).to.equal('Option2');
  });
});

describe('mobile responsive', () => {
  beforeAll(() => mockMatchMedia());
  afterAll(() => mockMatchMedia.stopMocking());

  it('renders in mobile', async () => {
    const el = await fixture<ScDropdownInput>(
      html`<sc-dropdown-input .data=${customData} label="Test hideOption"></sc-dropdown-input>`
    );
    await el.updateComplete;

    expect(el.isMobile).to.equal(false);
    expect(el.isTablet).to.equal(false);
    expect(el.isDesktop).to.equal(false);

    mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
    el.requestUpdate();
    await el.updateComplete;

    expect(el.isMobile).to.equal(true);
    expect(el.isTablet).to.equal(false);
    expect(el.isDesktop).to.equal(false);
    expect(el.shadowRoot?.querySelector('sc-bottom-sheet')).to.exist;
    // disconnect coverage
    el.remove();
  });
});

describe('ScDropdownInput mobile virtual', () => {
  beforeAll(() => mockMatchMedia());
  afterAll(() => mockMatchMedia.stopMocking());

  it('renders virtual items in bottom sheet on first open', async () => {
    const el = await fixture<ScDropdownInput>(html`
      <sc-dropdown-input label="Select from dropdown"></sc-dropdown-input>
    `);

    updateDataFn(el);
    await el.updateComplete;

    mockMatchMedia.toggle(el.mediaQuery.mobileLg.media);
    el.requestUpdate();
    await el.updateComplete;

    const scrollable = el.shadowRoot?.querySelector('.scrollable-content') as HTMLElement;
    const scrollElement = el.shadowRoot?.querySelector('.scroll-element') as HTMLElement;

    Object.defineProperty(scrollable, 'offsetHeight', { value: 200, configurable: true });
    Object.defineProperty(scrollElement, 'offsetHeight', { value: 200, configurable: true });

    await el.showBottomSheet();

    await waitUntil(
      () => (scrollElement?.children.length ?? 0) > 0,
      'Expected virtual items to be created in the mobile bottom sheet'
    );
  });
});
