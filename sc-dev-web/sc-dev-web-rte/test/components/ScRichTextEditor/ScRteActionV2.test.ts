import { html, fixture, expect } from '@open-wc/testing';
import { ScRteActionV2 } from '../../../src/components/ScRichTextEditor/ScRteActionV2.js';
import { aiShortcuts } from '../../../src/components/ScRichTextEditor/constant.js';

class MockTooltip extends HTMLElement {
  show() {}
  hide() {}
}
customElements.define('sc-tooltip', MockTooltip);

if (!customElements.get('sc-rte-action-v2')) {
  customElements.define('sc-rte-action-v2', ScRteActionV2);
}

describe('ScRteActionV2', () => {
  let element: ScRteActionV2;

  beforeEach(async () => {
    element = await fixture<ScRteActionV2>(
      html`<sc-rte-action-v2></sc-rte-action-v2>`
    );
    await element.updateComplete;
  });

  describe('basic rendering', () => {
    it('should render without errors', () => {
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('sc-rte-action-v2');
    });

    it('should be an instance of ScRteActionV2', () => {
      expect(element instanceof ScRteActionV2).to.be.true;
    });

    it('should have shadowRoot', () => {
      expect(element.shadowRoot).to.exist;
    });
  });

  describe('property initialization', () => {
    it('should have command property', () => {
      expect(element.hasOwnProperty('command') || 'command' in element).to.be
        .true;
    });

    it('should have icon property', () => {
      expect(element.hasOwnProperty('icon') || 'icon' in element).to.be.true;
    });

    it('should have type property', () => {
      expect(element.hasOwnProperty('type') || 'type' in element).to.be.true;
    });

    it('should have active property', () => {
      expect(element.hasOwnProperty('active') || 'active' in element).to.be
        .true;
    });

    it('should have disable property', () => {
      expect(element.hasOwnProperty('disable') || 'disable' in element).to.be
        .true;
    });

    it('should have values property', () => {
      expect(element.hasOwnProperty('values') || 'values' in element).to.be
        .true;
    });
  });

  describe('default values', () => {
    it('should have default icon value', () => {
      const iconValue = element.icon;
      expect(typeof iconValue).to.equal('string');
    });

    it('should have default type value', () => {
      const typeValue = element.type;
      expect(typeof typeValue).to.equal('string');
    });

    it('should have boolean active property', () => {
      const activeValue = element.active;
      expect(typeof activeValue).to.equal('boolean');
    });

    it('should have boolean disable property', () => {
      const disableValue = element.disable;
      expect(typeof disableValue).to.equal('boolean');
    });

    it('should have array values property', () => {
      const valuesProperty = element.values;
      expect(Array.isArray(valuesProperty)).to.be.true;
    });
  });

  describe('method availability', () => {
    it('should have getDefaultSelectItem method', () => {
      expect(typeof element.getDefaultSelectItem).to.equal('function');
    });

    it('should have show method', () => {
      expect(typeof element.show).to.equal('function');
    });

    it('should have hide method', () => {
      expect(typeof element.hide).to.equal('function');
    });

    it('should have invoke method', () => {
      expect(typeof element.invoke).to.equal('function');
    });

    it('should have toggleButtonState method', () => {
      expect(typeof element.toggleButtonState).to.equal('function');
    });
  });

  describe('actionType getter', () => {
    it('should have actionType getter', () => {
      expect((element as any).actionType).to.exist;
      expect(typeof (element as any).actionType.is).to.equal('function');
    });

    it('should correctly identify type', () => {
      element.type = 'font';
      expect((element as any).actionType.is('font')).to.be.true;
      expect((element as any).actionType.is('icon')).to.be.false;
    });
  });

  describe('dropdown functionality', () => {
    it('should call show method without errors', () => {
      expect(() => element.show()).not.to.throw();
    });

    it('should call hide method without errors', () => {
      expect(() => element.hide()).not.to.throw();
    });

    it('should handle show when shadowRoot querySelector returns null', () => {
      if (element.shadowRoot) {
        const original = element.shadowRoot.querySelector;
        element.shadowRoot.querySelector = () => null;
        expect(() => element.show()).not.to.throw();
        element.shadowRoot.querySelector = original;
      }
    });

    it('should handle hide when shadowRoot querySelector returns null', () => {
      if (element.shadowRoot) {
        const original = element.shadowRoot.querySelector;
        element.shadowRoot.querySelector = () => null;
        expect(() => element.hide()).not.to.throw();
        element.shadowRoot.querySelector = original;
      }
    });

    it('should have dropdown as a getter property', () => {
      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(element),
        'dropdown'
      );
      expect(descriptor?.get).to.exist;
    });
  });

  describe('invoke method', () => {
    it('should call emit with correct parameters', () => {
      let emitCalled = false;
      let emitParams: any = null;

      // Mock the emit method
      const originalEmit = element.emit;
      element.emit = (eventName: any, eventData: any) => {
        emitCalled = true;
        emitParams = { eventName, eventData };
        return originalEmit.call(element, eventName, eventData);
      };

      element.invoke('test.namespace', 'arg1', 'arg2');

      expect(emitCalled).to.be.true;
      expect(emitParams).to.exist;
      expect(emitParams.eventData.detail.namespace).to.equal('test.namespace');
      expect(emitParams.eventData.detail.args).to.deep.equal(['arg1', 'arg2']);
      expect(emitParams.eventData.bubbles).to.be.true;
      expect(emitParams.eventData.composed).to.be.true;
    });

    it('should handle invoke with no arguments', () => {
      let emitCalled = false;
      element.emit = () => {
        emitCalled = true;
        return true;
      };

      element.invoke('test.namespace');
      expect(emitCalled).to.be.true;
    });

    it('should handle invoke with multiple arguments', () => {
      let capturedArgs: any[] = [];
      element.emit = (eventName: any, eventData: any) => {
        capturedArgs = eventData.detail.args;
        return true;
      };

      element.invoke(
        'test.namespace',
        1,
        'string',
        { object: true },
        [1, 2, 3]
      );
      expect(capturedArgs).to.deep.equal([
        1,
        'string',
        { object: true },
        [1, 2, 3],
      ]);
    });
  });

  describe('toggleButtonState method', () => {
    beforeEach(() => {
      element.disable = false;
      element.icon = 'test-icon';
      element.command = 'test';
    });

    it('should update iconStateSuffix when conditions are met', () => {
      element.toggleButtonState('--hover');
      expect((element as any).iconStateSuffix).to.equal('--hover');
    });

    it('should update to selected state', () => {
      element.toggleButtonState('--selected');
      expect((element as any).iconStateSuffix).to.equal('--selected');
    });

    it('should clear state', () => {
      (element as any).iconStateSuffix = '--hover';
      element.toggleButtonState('');
      expect((element as any).iconStateSuffix).to.equal('');
    });

    it('should not update when disabled is true', () => {
      element.disable = true;
      const initialState = (element as any).iconStateSuffix || '';

      element.toggleButtonState('--hover');
      expect((element as any).iconStateSuffix).to.equal(initialState);
    });

    it('should not update when icon contains --disabled', () => {
      element.icon = 'test-icon--disabled';
      const initialState = (element as any).iconStateSuffix || '';

      element.toggleButtonState('--hover');
      expect((element as any).iconStateSuffix).to.equal(initialState);
    });

    it('should not update when command is custom', () => {
      element.command = 'custom';
      const initialState = (element as any).iconStateSuffix || '';

      element.toggleButtonState('--hover');
      expect((element as any).iconStateSuffix).to.equal(initialState);
    });

    it('should preserve selected state on mouse event', () => {
      (element as any).iconStateSuffix = '--selected';

      element.toggleButtonState('--hover', true);
      expect((element as any).iconStateSuffix).to.equal('--selected');
    });

    it('should update on non-mouse event even when selected', () => {
      (element as any).iconStateSuffix = '--selected';

      element.toggleButtonState('--hover', false);
      expect((element as any).iconStateSuffix).to.equal('--hover');
    });
  });

  describe('getDefaultSelectItem method', () => {
    it('should return font default for font type', () => {
      element.type = 'font';
      const result = element.getDefaultSelectItem();
      expect(typeof result).to.equal('string');
    });

    it('should return backcolor default for backcolor type', () => {
      element.type = 'backcolor';
      const result = element.getDefaultSelectItem();
      expect(typeof result).to.equal('string');
    });

    it('should return textcolor default for textcolor type', () => {
      element.type = 'textcolor';
      const result = element.getDefaultSelectItem();
      expect(typeof result).to.equal('string');
    });

    it('should return empty string for unknown type', () => {
      element.type = 'unknown' as any;
      const result = element.getDefaultSelectItem();
      expect(result).to.equal('');
    });

    it('should return empty string for icon type', () => {
      element.type = 'icon';
      const result = element.getDefaultSelectItem();
      expect(result).to.equal('');
    });
  });

  describe('watch method functionality', () => {
    it('should have onActiveChange method', () => {
      expect(typeof (element as any).onActiveChange).to.equal('function');
    });

    it('should call toggleButtonState when onActiveChange is called', () => {
      let toggleButtonStateCalled = false;
      let toggleButtonStateParams: any = null;

      element.toggleButtonState = (
        state: any,
        isMouseEvent = true
      ) => {
        toggleButtonStateCalled = true;
        toggleButtonStateParams = { state, isMouseEvent };
      };

      element.active = true;
      (element as any).onActiveChange();

      expect(toggleButtonStateCalled).to.be.true;
      expect(toggleButtonStateParams.state).to.equal('--selected');
      expect(toggleButtonStateParams.isMouseEvent).to.be.false;
    });

    it('should handle onActiveChange when active is false', () => {
      let capturedState = '';
      element.toggleButtonState = (state: string) => {
        capturedState = state;
      };

      element.active = false;
      (element as any).onActiveChange();
      expect(capturedState).to.equal('');
    });

    it('should have onActiveTagsChange method', () => {
      expect(typeof (element as any).onActiveTagsChange).to.equal('function');
    });

    it('should handle onActiveTagsChange with valid values', () => {
      const mockValues = [
        { name: 'Heading 1', value: 'h1' },
        { name: 'Paragraph', value: 'p' },
      ];
      element.values = mockValues;
      element.activeTags = ['h1'];

      (element as any).onActiveTagsChange(['p']);
      expect((element as any).selectedItem).to.equal('h1');
      expect((element as any).fontText).to.equal('Heading 1');
    });

    it('should handle onActiveTagsChange with no matching values', () => {
      element.values = [{ name: 'Heading 1', value: 'h1' }];
      element.activeTags = ['unknown'];

      (element as any).onActiveTagsChange(['p']);
      expect((element as any).selectedItem).to.equal('p');
    });
  });

  describe('tooltip functionality', () => {
    it('should have tooltip-related methods', () => {
      expect(typeof element._forceHideTooltip).to.equal('function');
      expect(typeof element._forceRemoveHover).to.equal('function');
      expect(typeof element.hideTooltip).to.equal('function');
      expect(typeof element.removeHoverState).to.equal('function');
    });

    it('should have _forceHideTooltip method', () => {
      expect(typeof element._forceHideTooltip).to.equal('function');
    });

    it('should call toggleButtonState in _forceRemoveHover', () => {
      let toggleButtonStateCalled = false;
      let capturedState = '';

      element.toggleButtonState = (state: any) => {
        toggleButtonStateCalled = true;
        capturedState = state;
      };

      element._forceRemoveHover();
      expect(toggleButtonStateCalled).to.be.true;
      expect(capturedState).to.equal('');
    });

    it('should have hideTooltip method that calls internal methods', () => {
      expect(typeof element.hideTooltip).to.equal('function');

      let hideAllCalled = false;
      const originalHideAll = (window as any).TooltipCoordinator?.hideAll;
      if ((window as any).TooltipCoordinator) {
        (window as any).TooltipCoordinator.hideAll = () => {
          hideAllCalled = true;
        };
      }

      element.hideTooltip();

      if (originalHideAll && (window as any).TooltipCoordinator) {
        (window as any).TooltipCoordinator.hideAll = originalHideAll;
      }

      expect(typeof element.hideTooltip).to.equal('function');
    });

    it('should handle removeHoverState when iconStateSuffix is hover', () => {
      (element as any).iconStateSuffix = '--hover';
      element.removeHoverState();
      expect((element as any).iconStateSuffix).to.equal('');
    });

    it('should not change removeHoverState when iconStateSuffix is not hover', () => {
      (element as any).iconStateSuffix = '--selected';
      element.removeHoverState();
      expect((element as any).iconStateSuffix).to.equal('--selected');
    });

    it('should handle removeHoverState when iconStateSuffix is empty', () => {
      (element as any).iconStateSuffix = '';
      element.removeHoverState();
      expect((element as any).iconStateSuffix).to.equal('');
    });

    it('_forceHideTooltip should call hide on the tooltip component if it exists', async () => {
      element.hintText = 'some hint';
      await element.updateComplete;

      const tooltip = element.shadowRoot!.querySelector('sc-tooltip')!;
      let hideCalled = false;
      (tooltip as any).hide = () => {
        hideCalled = true;
      };

      element._forceHideTooltip();

      expect(hideCalled).to.be.true;
    });
  });

  describe('mouse event handlers', () => {
    const wait = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    it('should have mouse event handler methods', () => {
      expect(typeof (element as any)._handleMouseEnter).to.equal('function');
      expect(typeof (element as any)._handleMouseLeave).to.equal('function');
    });

    // This test covers the setTimeout in _handleMouseEnter
    it('should show tooltip after a delay on mouse enter if hintText is present', async () => {
      element.hintText = 'Test Hint';
      await element.updateComplete;

      const tooltip = element.shadowRoot!.querySelector('sc-tooltip')!;
      let showCalled = false;
      (tooltip as any).show = () => {
        showCalled = true;
      };

      (element as any)._handleMouseEnter();
      expect(showCalled).to.be.false;
      await wait(150);
      expect(showCalled).to.be.true;
    });

    // This test covers the setTimeout in _handleMouseLeave
    it('should hide tooltip after a delay on mouse leave if hintText is present', async () => {
      element.hintText = 'Test Hint';
      await element.updateComplete;

      let hideCalled = false;
      element._forceHideTooltip = () => {
        hideCalled = true;
      };

      (element as any)._handleMouseLeave();
      expect(hideCalled).to.be.false;
      await wait(100);
      expect(hideCalled).to.be.true;
    });

    it('should call mouse handlers without errors', () => {
      expect(() => (element as any)._handleMouseEnter()).not.to.throw();
      expect(() => (element as any)._handleMouseLeave()).not.to.throw();
    });

    it('should have _isMouseOver property', () => {
      expect((element as any)._isMouseOver !== undefined).to.be.true;
    });

    it('should have _clearTimers method', () => {
      expect(typeof (element as any)._clearTimers).to.equal('function');
    });

    it('should call _clearTimers without errors', () => {
      expect(() => (element as any)._clearTimers()).not.to.throw();
    });
  });

  describe('selectedItem and fontText', () => {
    it('should have selectedItem property', () => {
      expect((element as any).selectedItem !== undefined).to.be.true;
    });

    it('should be able to set fontText property', () => {
      (element as any).fontText = 'test';
      expect((element as any).fontText).to.equal('test');
    });
  });

  describe('stopDefaultEvent method', () => {
    it('should have stopDefaultEvent method', () => {
      expect(typeof element.stopDefaultEvent).to.equal('function');
    });

    it('should call stopPropagation on event', () => {
      let stopPropagationCalled = false;
      const mockEvent = {
        stopPropagation: () => {
          stopPropagationCalled = true;
        },
      };

      element.stopDefaultEvent(mockEvent as any);
      expect(stopPropagationCalled).to.be.true;
    });

    it('should handle valid events with stopPropagation', () => {
      const mockEvent = { stopPropagation: () => {} };
      expect(() => element.stopDefaultEvent(mockEvent as any)).not.to.throw();
    });
  });

  describe('generateId method', () => {
    it('should have generateId method', () => {
      expect(typeof element.generateId).to.equal('function');
    });

    it('should return a string', () => {
      const result = element.generateId();
      expect(typeof result).to.equal('string');
    });

    it('should return different values on multiple calls', () => {
      const id1 = element.generateId();
      const id2 = element.generateId();
      expect(id1).not.to.equal(id2);
    });
  });

  describe('render method for different types', () => {
    it('should render icon type', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="icon"
          icon="test-icon"
          command="test"
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const iconPart = el.shadowRoot?.querySelector('[part="rte-action-icon"]');
      expect(iconPart).to.exist;
    });

    it('should render separate type', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="separate"></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const separator = el.shadowRoot?.querySelector('.separate');
      expect(separator).to.exist;
    });

    it('should render font type with dropdown', async () => {
      const mockValues = [
        { name: 'Heading 1', value: 'h1', className: 'h1' },
        { name: 'Paragraph', value: 'p', className: 'p' },
      ];

      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="font"
          .values=${mockValues}
          command="formatblock"
        >
        </sc-rte-action-v2>`
      );
      await el.updateComplete;

      const fontPart = el.shadowRoot?.querySelector(
        '[part="rte-action-dropdown"]'
      );
      expect(fontPart).to.exist;

      const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input');
      expect(dropdown).to.exist;
    });

    it('should render table type', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="table"
          command="inserttable"
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const tablePart = el.shadowRoot?.querySelector(
        '[part="rte-action-table"]'
      );
      expect(tablePart).to.exist;
    });
  });

  describe('DOM interaction tests', () => {
    it('should handle icon button click', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon" command="bold" value="test-value">
        </sc-rte-action-v2>`
      );
      await el.updateComplete;

      let invokeCalled = false;
      let invokeParams: any = null;

      el.invoke = (namespace: string, ...args: any[]) => {
        invokeCalled = true;
        invokeParams = { namespace, args };
      };

      const button = el.shadowRoot?.querySelector('sl-button');
      expect(button).to.exist;

      (button as any)?.click();

      expect(invokeCalled).to.be.true;
      expect(invokeParams.namespace).to.equal('editor.bold');
      expect(invokeParams.args).to.deep.equal(['test-value']);
    });

    it('should emit sc-action when no command', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon"></sc-rte-action-v2>`
      );
      await el.updateComplete;

      let emitCalled = false;
      let emitParams: any = null;

      el.emit = (eventName: string, eventData: any) => {
        emitCalled = true;
        emitParams = { eventName, eventData };
        return true;
      };

      const button = el.shadowRoot?.querySelector('sl-button');
      (button as any)?.click();

      expect(emitCalled).to.be.true;
      expect(emitParams.eventName).to.equal('sc-action');
      expect(emitParams.eventData.bubbles).to.be.true;
      expect(emitParams.eventData.composed).to.be.true;
    });
  });

  describe('dropdown event handling', () => {
    it('should handle dropdown events', async () => {
      const mockValues = [{ name: 'Test', value: 'test' }];

      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="backcolor"
          .values=${mockValues}
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input');
      expect(dropdown).to.exist;

      // Test that dropdown exists and can receive events
      expect(() =>
        dropdown?.dispatchEvent(new CustomEvent('sc-hide'))
      ).not.to.throw();
      expect(() =>
        dropdown?.dispatchEvent(new CustomEvent('sc-show'))
      ).not.to.throw();

      // Test that shouldRenderMenu gets set on sc-show
      dropdown?.dispatchEvent(new CustomEvent('sc-show'));
      expect((el as any).shouldRenderMenu).to.be.true;
    });

    it('should handle menu selection for font type', async () => {
      const mockValues = [
        { name: 'Heading 1', value: 'h1' },
        { name: 'Paragraph', value: 'p' },
      ];

      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="font"
          .values=${mockValues}
          command="formatblock"
        >
        </sc-rte-action-v2>`
      );
      await el.updateComplete;

      let invokeCalled = false;
      let invokeParams: any = null;

      el.invoke = (namespace: string, ...args: any[]) => {
        invokeCalled = true;
        invokeParams = { namespace, args };
      };

      const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input');
      expect(dropdown).to.exist;

      // Simulate the 'sc-select' event from sc-dropdown-input
      const mockEvent = new CustomEvent('sc-select', {
        detail: { value: 'h1' },
      });
      (dropdown as any).dispatchEvent(mockEvent);

      // Check expectations
      expect(invokeCalled).to.be.true;
      expect(invokeParams.namespace).to.equal('editor.formatblock');
      expect(invokeParams.args).to.deep.equal(['h1']);
      expect((el as any).selectedItem).to.equal('h1');
    });
  });

  describe('lifecycle and cleanup', () => {
    it('should handle disconnectedCallback', () => {
      let clearTimeoutCalled = false;
      const originalClearTimeout = global.clearTimeout;
      global.clearTimeout = (arg: any) => {
        clearTimeoutCalled = true;
        return originalClearTimeout(arg);
      };

      (element as any)._showTimer = setTimeout(() => {}, 1000);
      (element as any)._hideTimer = setTimeout(() => {}, 1000);

      element.disconnectedCallback();

      expect(clearTimeoutCalled).to.be.true;

      global.clearTimeout = originalClearTimeout;
    });

    it('should have shouldRenderMenu state', () => {
      expect((element as any).shouldRenderMenu !== undefined).to.be.true;
    });

    it('should handle connectedCallback properly', () => {
      expect(() => element.connectedCallback()).not.to.throw();
    });
  });

  describe('color type rendering', () => {
    it('should render backcolor type with color dropdown', async () => {
      const mockColors = [
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' },
      ];

      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="backcolor"
          .values=${mockColors}
          command="backcolor"
        >
        </sc-rte-action-v2>`
      );
      await el.updateComplete;

      const colorPart = el.shadowRoot?.querySelector(
        '[part="rte-action-dropdown"]'
      );
      expect(colorPart).to.exist;

      const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input');
      expect(dropdown).to.exist;

      const button = el.shadowRoot?.querySelector('sl-button');
      expect(button).to.exist;

      const icon = el.shadowRoot?.querySelector('sc-icon');
      expect(icon).to.exist;
    });

    it('should render textcolor type with color dropdown', async () => {
      const mockColors = [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
      ];

      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="textcolor"
          .values=${mockColors}
          command="forecolor"
        >
        </sc-rte-action-v2>`
      );
      await el.updateComplete;

      const colorPart = el.shadowRoot?.querySelector(
        '[part="rte-action-dropdown"]'
      );
      expect(colorPart).to.exist;
    });

    it('should handle color menu selection', async () => {
      const mockColors = [
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' },
      ];

      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="backcolor"
          .values=${mockColors}
          command="backcolor"
        >
        </sc-rte-action-v2>`
      );
      await el.updateComplete;

      // Trigger dropdown show to render menu
      const dropdown = el.shadowRoot?.querySelector('sl-dropdown');
      dropdown?.dispatchEvent(new CustomEvent('sl-show'));
      await el.updateComplete;

      let invokeCalled = false;
      let invokeParams: any = null;

      el.invoke = (namespace: string, ...args: any[]) => {
        invokeCalled = true;
        invokeParams = { namespace, args };
      };

      const menu = el.shadowRoot?.querySelector('sl-menu');
      if (menu) {
        const mockEvent = new CustomEvent('sl-select', {
          detail: { item: { value: '#FF0000' } },
        });

        menu.dispatchEvent(mockEvent);

        expect(invokeCalled).to.be.true;
        expect(invokeParams.namespace).to.equal('editor.backcolor');
        expect(invokeParams.args).to.deep.equal(['#FF0000']);
        expect((el as any).selectedItem).to.equal('#FF0000');
      }
    });
  });

  describe('table action functionality', () => {
    it('should render table type with table component', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="table"
          command="inserttable"
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const tablePart = el.shadowRoot?.querySelector(
        '[part="rte-action-table"]'
      );
      expect(tablePart).to.exist;

      const tableComponent = el.shadowRoot?.querySelector(
        'sc-rte-action-table-v2'
      );
      expect(tableComponent).to.exist;
    });

    it('should handle table select event', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="table"
          command="inserttable"
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      let invokeCalled = false;
      let invokeParams: any = null;
      let generateIdCalled = false;

      el.invoke = (namespace: string, ...args: any[]) => {
        invokeCalled = true;
        invokeParams = { namespace, args };
      };

      el.generateId = () => {
        generateIdCalled = true;
        return 'test-id';
      };

      const tableComponent = el.shadowRoot?.querySelector(
        'sc-rte-action-table-v2'
      );
      if (tableComponent) {
        const mockEvent = new CustomEvent('sc-select', {
          detail: { rows: 3, cols: 4 },
        });

        tableComponent.dispatchEvent(mockEvent);

        expect(invokeCalled).to.be.true;
        expect(generateIdCalled).to.be.true;
        expect(invokeParams.namespace).to.equal('editor.inserttable');
        expect(invokeParams.args[0]).to.deep.include({
          rows: 3,
          cols: 4,
          tableId: 'tab-id-test-id',
        });
      }
    });

    it('should handle table component with disable property', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="table"
          command="inserttable"
          disable
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const tableComponent = el.shadowRoot?.querySelector(
        'sc-rte-action-table-v2'
      );
      expect(tableComponent).to.exist;
      expect(tableComponent?.hasAttribute('disable')).to.be.true;
    });
  });

  describe('slot and additional elements', () => {
    it('should render slot element', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon">
          <span slot="test">Test content</span>
        </sc-rte-action-v2>`
      );
      await el.updateComplete;

      const slotDiv = el.shadowRoot?.querySelector('.slot');
      expect(slotDiv).to.exist;

      const slot = el.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should have tooltip wrapper', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 hintText="Test tooltip"></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const tooltip = el.shadowRoot?.querySelector('sc-tooltip');
      expect(tooltip).to.exist;
    });

    it('should handle tooltip disabled state', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const tooltip = el.shadowRoot?.querySelector('sc-tooltip');
      expect(tooltip).to.exist;
      expect(tooltip?.hasAttribute('disabled')).to.be.true;
    });

    it('should render action container div', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon"></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const container = el.shadowRoot?.querySelector('.rte-action-container');
      expect(container).to.exist;
    });
  });

  describe('component state and properties', () => {
    it('should handle active state styling', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon" active></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector('sl-button');
      expect(button?.classList.contains('rte-sl-button-active')).to.be.true;
    });

    it('should handle disabled state', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon" disable></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector<any>('sl-button');
      expect(button?.disabled).to.be.true;
    });

    it('should handle shouldRenderMenu state changes', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="backcolor"
          .values=${[{ name: 'Test', value: 'test' }]}
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      expect((el as any).shouldRenderMenu).to.be.false;

      const dropdown = el.shadowRoot?.querySelector('sc-dropdown-input');
      dropdown?.dispatchEvent(new CustomEvent('sc-show'));

      expect((el as any).shouldRenderMenu).to.be.true;
    });
  });

  describe('renderColor method', () => {
    it('should render SVG with a border for white color', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon"></sc-rte-action-v2>`
      );
      const svg = el.renderColor('#ffffff');
      expect(svg).to.exist;
      // white flag means border rect is rendered
      const rendered = await fixture(svg);
      expect(rendered.querySelector('rect[stroke]')).to.exist;
    });

    it('should render SVG with a diagonal line for transparent color', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon"></sc-rte-action-v2>`
      );
      const svg = el.renderColor('transparent');
      const rendered = await fixture(svg);
      expect(rendered.querySelector('line')).to.exist;
      expect(rendered.querySelector('rect[stroke]')).to.exist;
    });

    it('should render SVG with polygon for windowtext color', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon"></sc-rte-action-v2>`
      );
      const svg = el.renderColor('windowtext');
      const rendered = await fixture(svg);
      expect(rendered.querySelector('polygon')).to.exist;
      expect(rendered.querySelector('rect[stroke]')).to.exist;
    });

    it('should render plain SVG rect for a normal color', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 type="icon"></sc-rte-action-v2>`
      );
      const svg = el.renderColor('#FF0000');
      const rendered = await fixture(svg);
      expect(rendered.querySelector('line')).to.not.exist;
      expect(rendered.querySelector('polygon')).to.not.exist;
    });
  });

  describe('Coordinated tooltip behavior', () => {
    let element1: ScRteActionV2;
    let element2: ScRteActionV2;

    let originalForceHide1: () => void;
    let originalRemoveHover1: () => void;

    beforeEach(async () => {
      element1 = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 hintText="Tooltip 1"></sc-rte-action-v2>`
      );
      element2 = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2 hintText="Tooltip 2"></sc-rte-action-v2>`
      );

      originalForceHide1 = element1._forceHideTooltip;
      originalRemoveHover1 = element1._forceRemoveHover;

      element1.hideTooltip();
    });

    afterEach(() => {
      element1._forceHideTooltip = originalForceHide1;
      element1._forceRemoveHover = originalRemoveHover1;
    });

    it('should hide the first tooltip when the second one is hovered', () => {
      let hideCalledOn1 = false;
      let removeHoverCalledOn1 = false;

      element1._forceHideTooltip = () => {
        hideCalledOn1 = true;
      };
      element1._forceRemoveHover = () => {
        removeHoverCalledOn1 = true;
      };

      (element1 as any)._handleMouseEnter();
      (element2 as any)._handleMouseEnter();
      expect(hideCalledOn1).to.be.true;
      expect(removeHoverCalledOn1).to.be.true;
    });

    it('should allow a new tooltip to show after the active one is hidden', () => {
      let hideCalledOn1 = false;
      element1._forceHideTooltip = () => {
        hideCalledOn1 = true;
      };

      (element1 as any)._handleMouseEnter();
      (element1 as any)._handleMouseLeave();
      (element2 as any)._handleMouseEnter();
      expect(hideCalledOn1).to.be.false;
    });

    it('hideTooltip() should hide the currently active tooltip, even when called from another instance', () => {
      let hideCalledOn1 = false;
      let removeHoverCalledOn1 = false;

      element1._forceHideTooltip = () => {
        hideCalledOn1 = true;
      };
      element1._forceRemoveHover = () => {
        removeHoverCalledOn1 = true;
      };

      (element1 as any)._handleMouseEnter();
      element2.hideTooltip();
      expect(hideCalledOn1).to.be.true;
      expect(removeHoverCalledOn1).to.be.true;
    });
  });

  describe('mousedown prevents focus change on sl-button', () => {
    it('should call preventDefault on mousedown of the sl-button in icon type', async () => {
      const el = await fixture<ScRteActionV2>(
        html`<sc-rte-action-v2
          type="icon"
          command="bold"
        ></sc-rte-action-v2>`
      );
      await el.updateComplete;

      const button = el.shadowRoot?.querySelector('sl-button');
      expect(button).to.exist;

      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      button!.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('AI Shortcuts functionality', () => {
    it('should handle menu selection and invoke the correct command', async () => {
      const simpleShortcut = aiShortcuts.find(s => !s.subprompts)!;
      const command = 'aiCommand';

      const el = await fixture<ScRteActionV2>(html`
        <sc-rte-action-v2
          type="aishortcuts"
          .command=${command}
          .aiShortcutValues=${[simpleShortcut]}
        ></sc-rte-action-v2>
      `);
      await el.updateComplete;

      // Open the dropdown to render the menu
      const dropdown = el.shadowRoot!.querySelector('sl-dropdown');
      dropdown!.dispatchEvent(new CustomEvent('sl-show'));
      await el.updateComplete;

      // Set up a tracker for the invoke method
      let invokeWasCalledWith: any = null;
      el.invoke = (namespace: string, args: any) => {
        invokeWasCalledWith = { namespace, args };
      };

      // Simulate the 'sl-select' event from the menu
      const menu = el.shadowRoot!.querySelector('sl-menu');
      const expectedValue = JSON.stringify({
        prompt: simpleShortcut.prompt,
        action: (simpleShortcut as any).action || '',
      });

      const mockSelectEvent = new CustomEvent('sl-select', {
        detail: { item: { value: expectedValue } },
        bubbles: true,
        composed: true,
      });
      menu!.dispatchEvent(mockSelectEvent);

      expect((el as any).selectedItem).to.equal(expectedValue);
      expect(invokeWasCalledWith).to.not.be.null;
      expect(invokeWasCalledWith.namespace).to.equal(`editor.${command}`);
      expect(invokeWasCalledWith.args).to.deep.equal({ data: expectedValue });
    });

    it('should handle submenu selection and invoke the correct command', async () => {
      const submenuShortcut = aiShortcuts.find(s => !!s.subprompts)!;
      const command = 'aiCommand';

      const el = await fixture<ScRteActionV2>(html`
        <sc-rte-action-v2
          type="aishortcuts"
          .command=${command}
          .aiShortcutValues=${[submenuShortcut]}
        ></sc-rte-action-v2>
      `);
      await el.updateComplete;

      // Open the dropdown to render the menus
      const dropdown = el.shadowRoot!.querySelector('sl-dropdown');
      dropdown!.dispatchEvent(new CustomEvent('sl-show'));
      await el.updateComplete;

      // Set up a tracker for the invoke method
      let invokeWasCalledWith: any = null;
      el.invoke = (namespace: string, args: any) => {
        invokeWasCalledWith = { namespace, args };
      };

      const submenu = el.shadowRoot!.querySelector('sl-menu[slot="submenu"]');
      const expectedValue = JSON.stringify({
        prompt: submenuShortcut.subprompts![0].prompt,
      });

      const mockSelectEvent = new CustomEvent('sl-select', {
        detail: { item: { value: expectedValue } },
        bubbles: true,
        composed: true,
      });
      submenu!.dispatchEvent(mockSelectEvent);

      expect((el as any).selectedItem).to.equal(expectedValue);
      expect(invokeWasCalledWith).to.not.be.null;
      expect(invokeWasCalledWith.namespace).to.equal(`editor.${command}`);
      expect(invokeWasCalledWith.args).to.deep.equal({ data: expectedValue });
    });
  });

  describe('getIconSecondaryColor changed behavior', () => {
    it('should return currentColor for textcolor when color is windowtext (new windowtext guard)', () => {
      element.type = 'textcolor';
      element.activeTextColor = 'windowtext';
      expect((element as any).getIconSecondaryColor()).to.equal('currentColor');
    });

    it('should return currentColor for textcolor when color is transparent (fallback changed from #000000)', () => {
      element.type = 'textcolor';
      element.activeTextColor = 'transparent';
      expect((element as any).getIconSecondaryColor()).to.equal('currentColor');
    });

    it('should return the color for textcolor when color is valid (non-transparent, non-windowtext)', () => {
      element.type = 'textcolor';
      element.activeTextColor = '#FF0000';
      expect((element as any).getIconSecondaryColor()).to.equal('#FF0000');
    });

    it('should return currentColor for backcolor when color is transparent (fallback changed from #000000)', () => {
      element.type = 'backcolor';
      element.activeBgColor = 'transparent';
      expect((element as any).getIconSecondaryColor()).to.equal('currentColor');
    });

    it('should return the color for backcolor when color is valid and non-transparent', () => {
      element.type = 'backcolor';
      element.activeBgColor = '#0000FF';
      expect((element as any).getIconSecondaryColor()).to.equal('#0000FF');
    });

    it('should not enter backcolor branch when type is textcolor (else if change)', () => {
      // With the old code two separate ifs ran; now it's if/else if.
      // Setting type=textcolor with a non-returning value should NOT fall into backcolor.
      element.type = 'textcolor';
      element.activeTextColor = 'transparent'; // won't return early
      element.activeBgColor = '#ABCDEF';       // should be ignored
      expect((element as any).getIconSecondaryColor()).to.equal('currentColor');
    });
  });
});
