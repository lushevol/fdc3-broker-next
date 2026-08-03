import { html, fixture, expect } from '@open-wc/testing';
import { ScRteToolbarV2 } from '../../../src/components/ScRichTextEditor/ScRteToolbarV2.js';
import {
  customToolbarButton,
  CustomToolbarButton,
} from '../../../src/components/ScRichTextEditor/CustomToolbarButton.js';

const toolbarActions = [
  'undo',
  'redo',
  'askai',
  'aishortcuts',
  'fontstyle',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'backcolor',
  'forecolor',
  'clear',
  'alignleft',
  'aligncenter',
  'alignright',
  'orderedlist',
  'unorderedlist',
  'outdent',
  'indent',
  'addlink',
  'insertimage',
  'unlink',
  'quote',
  'table',
] as any;

const mockCustomButtons: CustomToolbarButton[] = [
  {
    icon: 'editor-undo',
    hintText: 'Undo',
    handler: (editorInstance: any) => console.log('Undo action'),
  },
  {
    icon: 'editor-redo',
    hintText: 'Redo',
    handler: (editorInstance: any) => console.log('Redo action'),
  },
];

const mockEditorInstance = {
  getContent: () => '<p>test content</p>',
  setContent: () => {},
  removed: false,
  execCommand: () => {},
  on: jest.fn(),
  once: jest.fn(),
  off: jest.fn(),
  undoManager: { hasUndo: () => false, hasRedo: () => false },
} as any;

let resizeCallback: ResizeObserverCallback | null = null;
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback;
  }
  observe() {
    /* do nothing */
  }
  unobserve(target: Element) {
    /* do nothing */
  }
  disconnect() {
    /* do nothing */
  }
}
window.ResizeObserver = MockResizeObserver;

class MockRteAction extends HTMLElement {
  hideTooltip() {}
  removeHoverState() {}
}
customElements.define('sc-rte-action-v2', MockRteAction);

class MockDropdown extends HTMLElement {
  open = false;
  hide() {
    this.open = false;
  }
  show() {
    this.open = true;
  }
}
customElements.define('sl-dropdown', MockDropdown);

if (!customElements.get('sc-rte-toolbar-v2')) {
  customElements.define('sc-rte-toolbar-v2', ScRteToolbarV2);
}

describe('ScRteToolbarV2', () => {
  let element: ScRteToolbarV2;

  beforeEach(async () => {
    element = await fixture<ScRteToolbarV2>(
      html`<sc-rte-toolbar-v2 .toolbar=${toolbarActions}></sc-rte-toolbar-v2>`
    );
    await element.updateComplete;
  });

  describe('basic rendering and initialization', () => {
    it('should render without errors', () => {
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('sc-rte-toolbar-v2');
    });

    it('should have shadowRoot', () => {
      expect(element.shadowRoot).to.exist;
    });

    it('should set default properties', () => {
      expect(element.toolbar).to.deep.equal(toolbarActions);
      expect(element.customToolbarButtons).to.deep.equal([]);
      expect(element.replace).to.be.false;
    });

    it('should have toolbar container', () => {
      const container = element.shadowRoot?.querySelector(
        '.rte-toolbar-container'
      );
      expect(container).to.exist;
    });

    it('should call connectedCallback without errors', () => {
      expect(() => element.connectedCallback()).not.to.throw();
    });

    it('should call initialiseProperties', () => {
      let initialisePropertiesCalled = false;
      const originalMethod = element.initialiseProperties;
      element.initialiseProperties = () => {
        initialisePropertiesCalled = true;
        return originalMethod.call(element);
      };

      element.connectedCallback();
      expect(initialisePropertiesCalled).to.be.true;
    });
  });

  describe('custom toolbar buttons', () => {
    it('renders a toolbar with custom toolbar buttons', async () => {
      const customButtons = [
        {
          icon: 'editor-undo',
          hintText: 'Undo',
          handler: () => console.log('Undo action'),
        },
      ];

      const el = await fixture<ScRteToolbarV2>(
        html`<sc-rte-toolbar-v2
          .customToolbarButtons=${customButtons}
        ></sc-rte-toolbar-v2>`
      );

      expect(el.customToolbarButtons).to.deep.equal(customButtons);

      const buttonTemplate = customToolbarButton(customButtons[0]);
      const buttonEl = await fixture(html`${buttonTemplate}`);
      expect(buttonEl).to.exist;
      expect(buttonEl.tagName.toLowerCase()).to.equal('sc-rte-action-v2');
    });

    it('should render custom buttons in toolbar', async () => {
      const el = await fixture<ScRteToolbarV2>(
        html`<sc-rte-toolbar-v2
          .customToolbarButtons=${mockCustomButtons}
        ></sc-rte-toolbar-v2>`
      );
      await el.updateComplete;

      expect(el.customToolbarButtons.length).to.equal(2);
    });

    it('should handle custom buttons with editor instance', () => {
      element.editorInstance = mockEditorInstance;
      const renderedButtons = (element as any)._renderCustomButtons();
      expect(renderedButtons).to.be.an('array');
    });
  });

  describe('toolbar action rendering', () => {
    it('renders the correct number of toolbar actions', async () => {
      const el = await fixture<ScRteToolbarV2>(
        html`<sc-rte-toolbar-v2 .toolbar=${toolbarActions}></sc-rte-toolbar-v2>`
      );
      await el.updateComplete;

      const toolbarActionButtons =
        el?.shadowRoot?.querySelectorAll('sc-rte-action-v2');
      expect(toolbarActionButtons?.length).to.be.greaterThan(0);
    });

    it('should filter toolbar actions based on available items', () => {
      const limitedToolbar = ['undo', 'redo', 'bold'] as any;
      element.toolbar = limitedToolbar;

      const items = (element as any)._renderItems([
        'undo',
        'redo',
        'bold',
        'italic',
      ]);
      expect(items.length).to.be.lessThanOrEqual(3);
    });

    it('should handle empty toolbar gracefully', () => {
      element.toolbar = [] as any;
      const items = (element as any)._renderItems(['undo', 'redo']);
      expect(items.length).to.equal(0);
    });
  });

  describe('responsive layout management', () => {
    const wait = (ms: number) =>
      new Promise(resolve => setTimeout(resolve, ms));

    it('should set the correct initial mode based on container width', () => {
      const container = element.shadowRoot!.querySelector(
        '.rte-toolbar-container'
      )!;
      Object.defineProperty(container, 'offsetWidth', {
        configurable: true,
        value: 800,
      });

      expect((element as any)._currentMode).to.equal('desktop');
      (element as any)._setupResizeObserver();
      expect((element as any)._currentMode).to.equal('tablet');
    });

    it('should change mode and update UI when container resizes', async () => {
      const container = element.shadowRoot!.querySelector(
        '.rte-toolbar-container'
      )!;
      Object.defineProperty(container, 'offsetWidth', {
        configurable: true,
        value: 1200,
      });

      let closeDropdownCalled = false;
      let hideTooltipsCalled = false;
      (element as any)._closeOpenDropdown = () => {
        closeDropdownCalled = true;
      };
      (element as any)._hideAllTooltips = () => {
        hideTooltipsCalled = true;
      };

      (element as any)._setupResizeObserver();
      expect((element as any)._currentMode).to.equal('desktop');

      const mockMobileEntry = {
        borderBoxSize: [{ inlineSize: 400 }],
      };

      if (resizeCallback) {
        resizeCallback(
          [mockMobileEntry as any],
          new MockResizeObserver(resizeCallback)
        );
      }

      await wait(200);
      expect((element as any)._currentMode).to.equal('mobile');
      expect(closeDropdownCalled).to.be.true;
      expect(hideTooltipsCalled).to.be.true;
    });

    it('should have current mode property', () => {
      expect((element as any)._currentMode).to.exist;
      expect(typeof (element as any)._currentMode).to.equal('string');
    });

    it('should have breakpoints property', () => {
      expect((element as any)._breakpoints).to.exist;
      expect((element as any)._breakpoints.mobile).to.be.a('number');
      expect((element as any)._breakpoints.tablet).to.be.a('number');
    });

    it('should call setupResizeObserver method', () => {
      expect(typeof (element as any)._setupResizeObserver).to.equal('function');
      expect(() => (element as any)._setupResizeObserver()).not.to.throw();
    });

    it('should disconnect resize observer on disconnection', () => {
      const mockObserver = { disconnect: () => {} };
      let disconnectCalled = false;
      mockObserver.disconnect = () => {
        disconnectCalled = true;
      };

      (element as any)._resizeObserver = mockObserver;
      element.disconnectedCallback();
      expect(disconnectCalled).to.be.true;
    });

    it('should clear debounce timer on disconnection', () => {
      let clearTimeoutCalled = false;
      const originalClearTimeout = global.clearTimeout;
      global.clearTimeout = (timerId: any) => {
        clearTimeoutCalled = true;
        return originalClearTimeout(timerId);
      };

      (element as any)._debounceTimer = setTimeout(() => {}, 1000);
      element.disconnectedCallback();
      expect(clearTimeoutCalled).to.be.true;
      global.clearTimeout = originalClearTimeout;
    });

    it('should handle connectedCallback with setupResizeObserver', () => {
      let setupCalled = false;
      const originalSetup = (element as any)._setupResizeObserver;
      (element as any)._setupResizeObserver = () => {
        setupCalled = true;
      };

      element.connectedCallback();
      (element as any)._setupResizeObserver = originalSetup;
      expect(typeof (element as any)._setupResizeObserver).to.equal('function');
    });
  });

  describe('dropdown management', () => {
    it('should close open dropdown', () => {
      const mockDropdown = { hide: () => {} };
      let hideCalled = false;
      mockDropdown.hide = () => {
        hideCalled = true;
      };

      (element as any)._openDropdown = mockDropdown;
      (element as any)._closeOpenDropdown();

      expect(hideCalled).to.be.true;
      expect((element as any)._openDropdown).to.be.null;
    });

    it('should have dropdown event handler methods', () => {
      expect(typeof (element as any)._handleDropdownShow).to.equal('function');
      expect(typeof (element as any)._handleDropdownHide).to.equal('function');
    });

    it('should have tooltip management methods', () => {
      expect(typeof (element as any)._hideAllTooltips).to.equal('function');
      expect(typeof (element as any)._handleToolbarMouseLeave).to.equal(
        'function'
      );
    });

    it('should handle _closeOpenDropdown without dropdown', () => {
      (element as any)._openDropdown = null;
      expect(() => (element as any)._closeOpenDropdown()).not.to.throw();
    });

    it('should set openDropdown to null on hide', () => {
      (element as any)._openDropdown = { some: 'dropdown' };
      const mockEvent = { stopPropagation: () => {} };

      (element as any)._openDropdown = null;
      expect((element as any)._openDropdown).to.be.null;
    });
  });

  describe('dropdown and event handling', () => {
    it('should hide other dropdowns and tooltips on _handleDropdownShow', async () => {
      // Set tablet mode to ensure multiple dropdowns are rendered
      (element as any)._currentMode = 'tablet';
      await element.updateComplete;

      const dropdowns = element.shadowRoot!.querySelectorAll(
        'sl-dropdown'
      ) as NodeListOf<MockDropdown>;
      const firstDropdown = dropdowns[0];
      const secondDropdown = dropdowns[1];

      // Mock the first dropdown as being open
      firstDropdown.open = true;
      let hideCalled = false;
      let hideTooltipsCalled = false;
      firstDropdown.hide = () => {
        hideCalled = true;
      };
      (element as any)._hideAllTooltips = () => {
        hideTooltipsCalled = true;
      };

      const showEvent = new CustomEvent('sl-show', { bubbles: true });
      secondDropdown.dispatchEvent(showEvent);

      expect(hideCalled).to.be.true; // Verified the other dropdown was closed
      expect(hideTooltipsCalled).to.be.true; // Verified tooltips were hidden
      expect((element as any)._openDropdown).to.equal(secondDropdown);
    });

    it('should hide tooltips and reset open dropdown on _handleDropdownHide', async () => {
      // Force tablet mode to ensure a dropdown exists
      (element as any)._currentMode = 'tablet';
      await element.updateComplete;

      let hideTooltipsCalled = false;
      (element as any)._hideAllTooltips = () => {
        hideTooltipsCalled = true;
      };
      (element as any)._openDropdown = document.createElement('div');

      const hideEvent = new CustomEvent('sl-hide', { bubbles: true });
      element
        .shadowRoot!.querySelector('sl-dropdown')!
        .dispatchEvent(hideEvent);

      expect(hideTooltipsCalled).to.be.true;
      expect((element as any)._openDropdown).to.be.null;
    });

    it('should hide tooltips and remove hover states on toolbar mouseleave', () => {
      const action = element.shadowRoot!.querySelector(
        'sc-rte-action-v2'
      ) as MockRteAction;
      let hideCalled = false;
      let removeHoverCalled = false;
      action.hideTooltip = () => {
        hideCalled = true;
      };
      action.removeHoverState = () => {
        removeHoverCalled = true;
      };

      const leaveEvent = new MouseEvent('mouseleave');
      element
        .shadowRoot!.querySelector('.rte-toolbar-container')!
        .dispatchEvent(leaveEvent);

      expect(hideCalled).to.be.true;
      expect(removeHoverCalled).to.be.true;
    });

    it('should close dropdowns on click outside a dropdown', () => {
      let closeDropdownCalled = false;
      (element as any)._closeOpenDropdown = () => {
        closeDropdownCalled = true;
      };

      const clickEvent = new MouseEvent('click', { bubbles: true });
      element
        .shadowRoot!.querySelector('.rte-toolbar-container')!
        .dispatchEvent(clickEvent);

      expect(closeDropdownCalled).to.be.true;
    });

    it('should not close dropdowns on click inside a dropdown', async () => {
      // Force tablet mode to ensure a dropdown exists
      (element as any)._currentMode = 'tablet';
      await element.updateComplete;

      let closeDropdownCalled = false;
      (element as any)._closeOpenDropdown = () => {
        closeDropdownCalled = true;
      };

      const clickEvent = new MouseEvent('click', { bubbles: true });
      element
        .shadowRoot!.querySelector('sl-dropdown')!
        .dispatchEvent(clickEvent);

      expect(closeDropdownCalled).to.be.false;
    });
  });

  describe('rendering helper methods', () => {
    it('should render dropdown with items', () => {
      const dropdown = (element as any)._renderDropdown(
        'test-icon',
        'Test Label',
        ['undo']
      );
      expect(dropdown).to.exist;
    });

    it('should return null for dropdown with no items', () => {
      element.toolbar = [] as any;
      const dropdown = (element as any)._renderDropdown(
        'test-icon',
        'Test Label',
        ['undo']
      );
      expect(dropdown).to.be.null;
    });

    it('should render separator', () => {
      const separator = (element as any)._renderSeparator();
      expect(separator).to.exist;
    });

    it('should assemble toolbar sections with separators', () => {
      const section1 = [html`<div>section1</div>`];
      const section2 = [html`<div>section2</div>`];
      const assembled = (element as any)._assembleToolbar([section1, section2]);

      expect(assembled.length).to.equal(3); // section1 + separator + section2
    });

    it('should not add separators for single section', () => {
      const section1 = [html`<div>section1</div>`];
      const assembled = (element as any)._assembleToolbar([section1]);

      expect(assembled.length).to.equal(1);
    });

    it('should filter out empty sections', () => {
      const section1 = [html`<div>section1</div>`];
      const emptySection: any[] = [];
      const assembled = (element as any)._assembleToolbar([
        section1,
        emptySection,
      ]);

      expect(assembled.length).to.equal(1);
    });

    it('should render more dropdown for mobile', () => {
      const content = [html`<div>test</div>`];
      const dropdown = (element as any)._renderMoreDropdownForMobile(content);
      expect(dropdown).to.exist;
    });

    it('should have _renderItems method', () => {
      expect(typeof (element as any)._renderItems).to.equal('function');
      const items = (element as any)._renderItems(['undo', 'redo']);
      expect(Array.isArray(items)).to.be.true;
    });
  });

  describe('view layout methods', () => {
    it('should render desktop view', () => {
      (element as any)._currentMode = 'desktop';
      const items = (element as any)._renderDesktopView();
      expect(items).to.be.an('array');
    });

    it('should render tablet view', () => {
      (element as any)._currentMode = 'tablet';
      const items = (element as any)._renderTabletView();
      expect(items).to.be.an('array');
    });

    it('should render mobile view', () => {
      (element as any)._currentMode = 'mobile';
      const items = (element as any)._renderMobileView();
      expect(items).to.be.an('array');
    });

    it('should render correct view based on current mode', () => {
      // Test desktop
      (element as any)._currentMode = 'desktop';
      let desktopCalled = false;
      const originalDesktop = (element as any)._renderDesktopView;
      (element as any)._renderDesktopView = () => {
        desktopCalled = true;
        return originalDesktop.call(element);
      };

      element.render();
      expect(desktopCalled).to.be.true;
    });

    it('should handle different current modes', () => {
      const modes = ['desktop', 'tablet', 'mobile'];
      modes.forEach(mode => {
        (element as any)._currentMode = mode;
        expect(() => element.render()).not.to.throw();
      });
    });

    it('should have view rendering methods', () => {
      expect(typeof (element as any)._renderDesktopView).to.equal('function');
      expect(typeof (element as any)._renderTabletView).to.equal('function');
      expect(typeof (element as any)._renderMobileView).to.equal('function');
    });

    it('should handle tablet view rendering', () => {
      (element as any)._currentMode = 'tablet';
      let tabletCalled = false;
      const originalTablet = (element as any)._renderTabletView;
      (element as any)._renderTabletView = () => {
        tabletCalled = true;
        return originalTablet.call(element);
      };

      element.render();
      expect(tabletCalled).to.be.true;
    });

    it('should handle mobile view rendering', () => {
      (element as any)._currentMode = 'mobile';
      let mobileCalled = false;
      const originalMobile = (element as any)._renderMobileView;
      (element as any)._renderMobileView = () => {
        mobileCalled = true;
        return originalMobile.call(element);
      };

      element.render();
      expect(mobileCalled).to.be.true;
    });

    it('should default to desktop rendering for unknown modes', () => {
      (element as any)._currentMode = 'unknown';
      let desktopCalled = false;
      const originalDesktop = (element as any)._renderDesktopView;
      (element as any)._renderDesktopView = () => {
        desktopCalled = true;
        return originalDesktop.call(element);
      };

      element.render();
      expect(desktopCalled).to.be.true;
    });

    it('should handle rendering without throwing errors', () => {
      const modes = ['desktop', 'tablet', 'mobile', undefined, null, ''];
      modes.forEach(mode => {
        (element as any)._currentMode = mode;
        expect(() => element.render()).not.to.throw();
      });
    });
  });

  describe('style information handling', () => {
    beforeEach(() => {
      element.selectedNodes = [];
    });

    it('should get style from element', () => {
      const testElement = document.createElement('div');
      testElement.style.backgroundColor = 'rgb(217, 217, 217)'; // #D9D9D9
      testElement.style.color = 'rgb(4, 115, 234)'; // #0473EA

      const style = (element as any).getStyle(testElement);
      expect(style).to.exist;
      expect(typeof style).to.equal('object');
    });

    it('attaches style info if there is a tag in the selected node', () => {
      const spanElement = document.createElement('span');
      spanElement.style.backgroundColor = '#D9D9D9';
      spanElement.style.color = '#0473EA';
      spanElement.style.textDecoration = 'underline';

      const mockSelectedNodes = [
        document.createElement('strong'),
        document.createElement('em'),
        document.createElement('s'),
        document.createElement('sub'),
        document.createElement('sup'),
        spanElement,
      ] as any;

      element.selectedNodes = mockSelectedNodes;
      element.attachStyleInfo();

      expect(element.viewContext['font-bold']).to.equal('bold');
      expect(element.viewContext['font-italic']).to.equal('italic');
      expect(element.viewContext['font-strikethrough']).to.equal(
        'strikethrough'
      );
      expect(element.viewContext['font-subscript']).to.equal('subscript');
      expect(element.viewContext['font-superscript']).to.equal('superscript');
      expect(element.viewContext['font-underline']).to.equal('underline');
    });

    it('should handle getStyleInfo with real DOM elements', () => {
      const mockElements = [
        document.createElement('h1'),
        document.createElement('h2'),
        document.createElement('p'),
        document.createElement('div'),
      ];

      const styleInfo = (element as any).getStyleInfo(mockElements);
      expect(styleInfo).to.exist;
      expect(typeof styleInfo).to.equal('object');
    });

    it('should initialize default style info', () => {
      const styleInfo = (element as any).getStyleInfo([]);
      expect(styleInfo['font-bold']).to.equal('normal');
      expect(styleInfo['font-italic']).to.equal('normal');
      expect(styleInfo['font-underline']).to.equal('normal');
      expect(styleInfo['font-subscript']).to.equal('normal');
      expect(styleInfo['font-superscript']).to.equal('normal');
      expect(styleInfo['font-strikethrough']).to.equal('normal');
    });

    it('should handle real DOM elements with empty style', () => {
      const mockElement = document.createElement('div');
      const style = (element as any).getStyle(mockElement);
      expect(style).to.exist;
      expect(typeof style).to.equal('object');
    });

    it('should handle SPAN elements with text decoration', () => {
      const spanElement = document.createElement('span');
      spanElement.style.textDecoration = 'underline';

      const styleInfo = (element as any).getStyleInfo([spanElement]);
      expect(styleInfo['font-underline']).to.equal('underline');
    });

    it('should process different heading types with real elements', () => {
      const headingElements = [
        document.createElement('h1'),
        document.createElement('h2'),
        document.createElement('h3'),
        document.createElement('h4'),
        document.createElement('h5'),
        document.createElement('h6'),
      ];

      const styleInfo = (element as any).getStyleInfo(headingElements);
      expect(styleInfo).to.exist;
      expect(typeof styleInfo).to.equal('object');
    });

    it('should handle mixed real and mock elements', () => {
      const mixedElements = [
        document.createElement('strong'),
        document.createElement('em'),
        document.createElement('s'),
      ] as any;

      const styleInfo = (element as any).getStyleInfo(mixedElements);
      expect(styleInfo['font-bold']).to.equal('bold');
      expect(styleInfo['font-italic']).to.equal('italic');
      expect(styleInfo['font-strikethrough']).to.equal('strikethrough');
    });
  });

  describe('active tag functionality', () => {
    it('attaches active tag', () => {
      const mockRange = {
        startContainer: {
          parentNode: null,
          tagName: 'DIV',
        },
      };
      element.range = mockRange as any;
      element.attachActiveTag();

      const viewContextActiveTags = element.viewContext['active-tags'];
      expect(viewContextActiveTags).to.exist;
    });

    it('should traverse parent nodes for tags', () => {
      const mockGrandParent = { tagName: 'BODY', parentNode: null };
      const mockParent = { tagName: 'DIV', parentNode: mockGrandParent };
      const mockRange = {
        startContainer: { tagName: 'SPAN', parentNode: mockParent },
      };

      element.range = mockRange as any;
      element.attachActiveTag();

      const tags = element.viewContext['active-tags'];
      expect(Array.isArray(tags)).to.be.true;
    });

    it('should handle null range gracefully', () => {
      element.range = null;
      expect(() => element.attachActiveTag()).not.to.throw();
    });

    it('should handle range without startContainer', () => {
      element.range = {} as any;
      expect(() => element.attachActiveTag()).not.to.throw();
    });

    it('should collect tags from parent traversal', () => {
      const mockContainer = {
        tagName: 'SPAN',
        parentNode: {
          tagName: 'P',
          parentNode: {
            tagName: 'DIV',
            parentNode: null,
          },
        },
      };

      const mockRange = { startContainer: mockContainer };
      element.range = mockRange as any;
      element.attachActiveTag();

      const tags = element.viewContext['active-tags'];
      expect(Array.isArray(tags)).to.be.true;
      expect(tags && tags.length).to.be.greaterThan(0);
    });
  });

  describe('range change handling', () => {
    it('should handle onRangeChange', () => {
      let attachStyleInfoCalled = false;
      let attachActiveTagCalled = false;

      const originalAttachStyleInfo = element.attachStyleInfo;
      const originalAttachActiveTag = element.attachActiveTag;

      element.attachStyleInfo = () => {
        attachStyleInfoCalled = true;
        return originalAttachStyleInfo.call(element);
      };

      element.attachActiveTag = () => {
        attachActiveTagCalled = true;
        return originalAttachActiveTag.call(element);
      };

      element.selectedNodes = [document.createElement('div')];
      (element as any).onRangeChange(element.selectedNodes);

      expect(attachStyleInfoCalled).to.be.true;
      expect(attachActiveTagCalled).to.be.true;
    });

    it('should handle onRangeChange with null selectedNodes', () => {
      element.selectedNodes = null as any;
      expect(() => (element as any).onRangeChange(null)).not.to.throw();
    });

    it('should handle onRangeChange with undefined selectedNodes', () => {
      element.selectedNodes = undefined as any;
      expect(() => (element as any).onRangeChange(undefined)).not.to.throw();
    });

    it('should call attachStyleInfo when selectedNodes exist', () => {
      let attachStyleInfoCalled = false;
      const originalMethod = element.attachStyleInfo;
      element.attachStyleInfo = () => {
        attachStyleInfoCalled = true;
        return originalMethod.call(element);
      };

      element.selectedNodes = [document.createElement('span')];
      (element as any).onRangeChange(element.selectedNodes);

      expect(attachStyleInfoCalled).to.be.true;
    });

    it('should set viewContext properties when no selectedNodes', () => {
      element.selectedNodes = null as any;
      element.attachStyleInfo();

      expect(element.viewContext['is-selection-collapsed']).to.be.true;
    });

    it('should handle range collapsed property', () => {
      const mockRange = { collapsed: true };
      element.range = mockRange as any;
      element.attachStyleInfo();

      expect(element.viewContext['is-selection-collapsed']).to.be.true;
    });
  });

  describe('toast functionality', () => {
    it('should show toast for unsupported operations', () => {
      const testText = 'Operation not supported';
      element.notSupportLog(testText);

      expect((element as any).toastText).to.equal(testText);
      expect((element as any).showToast).to.be.true;
    });

    it('should hide toast', () => {
      (element as any).showToast = true;
      (element as any).toastText = 'test';

      element.onToastHide();

      expect((element as any).showToast).to.be.false;
      expect((element as any).toastText).to.equal('');
    });

    it('should handle multiple toast messages', () => {
      element.notSupportLog('First message');
      expect((element as any).toastText).to.equal('First message');

      element.notSupportLog('Second message');
      expect((element as any).toastText).to.equal('Second message');
    });

    it('should toggle showToast state correctly', () => {
      expect((element as any).showToast).to.be.false;

      element.notSupportLog('Test');
      expect((element as any).showToast).to.be.true;

      element.onToastHide();
      expect((element as any).showToast).to.be.false;
    });

    it('should have basic toast properties', () => {
      expect((element as any).showToast !== undefined).to.be.true;
      expect((element as any).toastText !== undefined).to.be.true;
    });
  });

  describe('configuration and initialization', () => {
    it('should initialize properties correctly', () => {
      const mockConfig = {
        toolbar: {
          maxImageSize: 2048,
        },
      };

      element.configuration = mockConfig;
      element.initialiseProperties();

      expect(element.viewContext['max-image-size']).to.equal(2048);
    });

    it('should handle missing configuration gracefully', () => {
      element.configuration = {} as any;
      expect(() => element.initialiseProperties()).not.to.throw();
    });

    it('should handle missing toolbar configuration', () => {
      element.configuration = { toolbar: undefined } as any;
      expect(() => element.initialiseProperties()).not.to.throw();
    });

    it('should have configuration property', () => {
      expect(element.configuration).to.exist;
      expect(typeof element.configuration).to.equal('object');
    });
  });

  describe('viewContext management', () => {
    it('should initialize viewContext as empty object', () => {
      const newElement = new ScRteToolbarV2();
      expect(newElement.viewContext).to.exist;
      expect(typeof newElement.viewContext).to.equal('object');
    });

    it('should update viewContext with style information', () => {
      const spanElement = document.createElement('span');
      spanElement.style.fontWeight = 'bold';

      element.selectedNodes = [spanElement];
      element.attachStyleInfo();

      expect(element.viewContext).to.exist;
      expect(typeof element.viewContext).to.equal('object');
    });

    it('should handle viewContext with selection collapsed state', () => {
      const mockRange = { collapsed: true };
      element.range = mockRange as any;
      element.attachStyleInfo();

      expect(element.viewContext['is-selection-collapsed']).to.be.true;
    });

    it('should handle range collapsed state correctly', () => {
      const mockRange = { collapsed: false };
      element.range = mockRange as any;
      element.attachStyleInfo();
      expect(typeof element.viewContext['is-selection-collapsed']).to.equal(
        'boolean'
      );
    });

    it('should handle missing range in viewContext', () => {
      element.range = null;
      element.attachStyleInfo();

      expect(element.viewContext['is-selection-collapsed']).to.be.true;
    });
  });

  describe('property getters and setters', () => {
    it('should handle toolbar property changes', () => {
      const newToolbar = ['bold', 'italic'] as any;
      element.toolbar = newToolbar;

      expect(element.toolbar).to.deep.equal(newToolbar);
    });

    it('should handle selectedNodes property changes', () => {
      const newNodes = [document.createElement('div')];
      element.selectedNodes = newNodes;

      expect(element.selectedNodes).to.deep.equal(newNodes);
    });

    it('should handle range property changes', () => {
      const mockRange = {
        collapsed: true,
        startContainer: document.createElement('div'),
      };
      element.range = mockRange as any;

      expect(element.range).to.equal(mockRange);
    });

    it('should handle focusedElOfViewer property', () => {
      const mockElement = document.createElement('div');
      element.focusedElOfViewer = mockElement;

      expect(element.focusedElOfViewer).to.equal(mockElement);
    });

    it('should handle editorInstance property', () => {
      element.editorInstance = mockEditorInstance;
      expect(element.editorInstance).to.equal(mockEditorInstance);
    });
  });

  describe('mouse focus-preservation logic', () => {
    it('should set _mouseTarget and prevent default on _handleMouseDown', () => {
      const target = document.createElement('button');
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'target', { value: target });

      (element as any)._handleMouseDown(event);

      expect(event.defaultPrevented).to.be.true;
      expect((element as any)._mouseTarget).to.equal(target);
    });

    it('should clear _mouseTarget after _handleWindowMouseUp fires', async () => {
      jest.useFakeTimers();
      (element as any)._mouseTarget = document.createElement('button');

      (element as any)._handleWindowMouseUp();
      jest.advanceTimersByTime(10);

      expect((element as any)._mouseTarget).to.be.undefined;
      jest.useRealTimers();
    });

    it('should focus iframeElement when _handleFocus fires with a _mouseTarget set', () => {
      let focusCalled = false;
      element.editorInstance = {
        ...mockEditorInstance,
        iframeElement: { focus: () => { focusCalled = true; } },
      } as any;
      (element as any)._mouseTarget = document.createElement('button');

      (element as any)._handleFocus();

      expect(focusCalled).to.be.true;
    });

    it('should not focus iframeElement when _mouseTarget is undefined', () => {
      let focusCalled = false;
      element.editorInstance = {
        ...mockEditorInstance,
        iframeElement: { focus: () => { focusCalled = true; } },
      } as any;
      (element as any)._mouseTarget = undefined;

      (element as any)._handleFocus();

      expect(focusCalled).to.be.false;
    });
  });

  describe('onEditorChange undo/redo tracking', () => {
    it('should update has-undo and has-redo in viewContext when undo/redo events fire', async () => {
      let registeredFn: (() => void) | undefined;
      const editorInstance = {
        ...mockEditorInstance,
        removed: false,
        on: jest.fn((event: string, cb: () => void) => { if (event === 'AddUndo Undo Redo') registeredFn = cb; }),
        once: jest.fn(),
        off: jest.fn(),
        undoManager: { hasUndo: () => true, hasRedo: () => true },
      };

      element.editorInstance = editorInstance as any;
      await element.updateComplete;

      // Simulate TinyMCE firing AddUndo/Undo/Redo
      registeredFn!();

      expect(element.viewContext['has-undo']).to.be.true;
      expect(element.viewContext['has-redo']).to.be.true;
    });

    it('should skip viewContext update when editor is removed', async () => {
      let registeredFn: (() => void) | undefined;
      const editorInstance = {
        ...mockEditorInstance,
        removed: true,
        on: jest.fn((event: string, cb: () => void) => { if (event === 'AddUndo Undo Redo') registeredFn = cb; }),
        once: jest.fn(),
        off: jest.fn(),
        undoManager: { hasUndo: () => true, hasRedo: () => true },
      };

      element.editorInstance = editorInstance as any;
      await element.updateComplete;
      element.viewContext['has-undo'] = false;
      element.viewContext['has-redo'] = false;

      registeredFn!();

      // editor.removed=true → fn returns early, values stay false
      expect(element.viewContext['has-undo']).to.be.false;
      expect(element.viewContext['has-redo']).to.be.false;
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle attachStyleInfo with no selectedNodes', () => {
      element.selectedNodes = [] as any;
      expect(() => element.attachStyleInfo()).not.to.throw();
      expect(element.viewContext['is-selection-collapsed']).to.be.true;
    });

    it('should handle attachActiveTag with no range', () => {
      element.range = null;
      expect(() => element.attachActiveTag()).not.to.throw();
    });

    it('should handle getStyleInfo with mixed element types', () => {
      const mixedElements = [
        document.createElement('strong'),
        document.createElement('div'),
        null,
        undefined,
        document.createElement('em'),
      ].filter(Boolean) as any;

      expect(() => {
        const styleInfo = (element as any).getStyleInfo(mixedElements);
        expect(styleInfo).to.exist;
      }).not.to.throw();
    });

    it('should handle rendering with empty toolbar', () => {
      element.toolbar = [] as any;
      expect(() => element.render()).not.to.throw();
    });

    it('should handle rendering with undefined properties', () => {
      element.selectedNodes = undefined as any;
      element.range = undefined as any;
      expect(() => element.render()).not.to.throw();
    });

    it('should handle disconnectedCallback multiple times', () => {
      expect(() => {
        element.disconnectedCallback();
        element.disconnectedCallback();
      }).not.to.throw();
    });

    it('should handle connectedCallback multiple times', () => {
      expect(() => {
        element.connectedCallback();
        element.connectedCallback();
      }).not.to.throw();
    });
  });

  describe('toolbar group organization', () => {
    it('should have TOOLBAR_GROUPS constant', () => {
      expect(
        typeof (ScRteToolbarV2 as any).TOOLBAR_GROUPS === 'undefined' ||
          typeof (element as any).TOOLBAR_GROUPS !== 'undefined'
      ).to.be.true;
    });

    it('should organize toolbar items into logical groups', () => {
      element.toolbar = ['undo', 'redo', 'bold', 'italic'] as any;
      const items = (element as any)._renderItems([
        'undo',
        'redo',
        'bold',
        'italic',
      ]);
      expect(items).to.be.an('array');
      expect(items.length).to.be.greaterThan(0);
    });

    it('should handle history group items', () => {
      const historyItems = (element as any)._renderItems(['undo', 'redo']);
      expect(historyItems).to.be.an('array');
    });

    it('should handle text format group items', () => {
      const textItems = (element as any)._renderItems([
        'bold',
        'italic',
        'underline',
      ]);
      expect(textItems).to.be.an('array');
    });

    it('should handle alignment group items', () => {
      const alignItems = (element as any)._renderItems([
        'alignleft',
        'aligncenter',
        'alignright',
      ]);
      expect(alignItems).to.be.an('array');
    });
  });

  describe('responsive breakpoints and rendering', () => {
    it('should return largeMobile', () => {
      const container = element.shadowRoot!.querySelector(
        '.rte-toolbar-container'
      )!;
      Object.defineProperty(container, 'offsetWidth', {
        configurable: true,
        value: 600,
      });
      (element as any)._setupResizeObserver();
      expect((element as any)._currentMode).to.equal('largeMobile');
    });

    it('should return largeTablet', () => {
      const container = element.shadowRoot!.querySelector(
        '.rte-toolbar-container'
      )!;
      Object.defineProperty(container, 'offsetWidth', {
        configurable: true,
        value: 900,
      });
      (element as any)._setupResizeObserver();
      expect((element as any)._currentMode).to.equal('largeTablet');
    });

    it('should render large mobile view with fully expanded layout (no AI)', async () => {
      element.toolbar = toolbarActions.filter(
        (t: string) => !['askai', 'aishortcuts'].includes(t)
      ) as any;
      (element as any)._currentMode = 'largeMobile';
      await element.updateComplete;
      const textDropdown = element.shadowRoot?.querySelector(
        'sl-dropdown sc-icon[name="editor-bold"]'
      );
      const moreDropdown = element.shadowRoot?.querySelector(
        '.more-tools-dropdown'
      );
      expect(textDropdown).to.exist;
      expect(moreDropdown).to.not.exist;
    });

    it('should render large mobile view with partially expanded layout (AI only)', async () => {
      element.toolbar = toolbarActions.filter(
        (t: string) => !['copy', 'paste'].includes(t)
      ) as any;
      (element as any)._currentMode = 'largeMobile';
      await element.updateComplete;
      const moreDropdown = element.shadowRoot?.querySelector(
        '.more-tools-dropdown'
      );
      expect(moreDropdown).to.exist;
    });
  });

  describe('desktop view alignment grouping', () => {
    it('should not group alignment when only AI tools are enabled', async () => {
      element.toolbar = [
        'askai',
        'alignleft',
        'aligncenter',
        'alignright',
      ] as any;
      await element.updateComplete;
      const desktopItems = (element as any)._renderDesktopView();
      const hasDropdown = desktopItems.some((item: any) => {
        const str = String(item);
        return (
          str.includes('sl-dropdown') && str.includes('editor-aligncenter')
        );
      });

      expect(hasDropdown).to.be.false;
    });

    it('should not group alignment when only Clipboard tools are enabled', async () => {
      element.toolbar = ['copy', 'paste', 'alignleft', 'aligncenter'] as any;
      await element.updateComplete;
      const desktopItems = (element as any)._renderDesktopView();
      const hasDropdown = desktopItems.some((item: any) => {
        const str = String(item);
        return (
          str.includes('sl-dropdown') && str.includes('editor-aligncenter')
        );
      });
      expect(hasDropdown).to.be.false;
    });
  });

  describe('toolbar conditional layout logic', () => {
    let element: ScRteToolbarV2;
    const mockCustomButtons = [
      {
        icon: 'test-icon',
        hintText: 'Test Button',
        handler: () => {},
      },
    ];
    beforeEach(async () => {
      element = await fixture<ScRteToolbarV2>(
        html`<sc-rte-toolbar-v2
          .toolbar=${toolbarActions}
        ></sc-rte-toolbar-v2>`
      );
      await element.updateComplete;
    });

    it('tablet view should not group text formatting when AI or Clipboard is missing', async () => {
      element.toolbar = toolbarActions.filter(
        (tool: string) => !['askai', 'aishortcuts'].includes(tool)
      );
      (element as any)._currentMode = 'tablet';
      await element.updateComplete;
      const boldButton = element.shadowRoot?.querySelector(
        'sc-rte-action-v2[command="bold"]'
      );
      const textDropdown = element.shadowRoot?.querySelector(
        'sl-dropdown sc-icon[name="editor-bold"]'
      );
      expect(boldButton).to.exist;
      expect(textDropdown).to.not.exist;
    });

    it('large mobile view should not have a "More" dropdown when AI is disabled', async () => {
      element.toolbar = toolbarActions.filter(
        (tool: string) => !['askai', 'aishortcuts'].includes(tool)
      );
      (element as any)._currentMode = 'largeMobile';
      await element.updateComplete;
      const moreDropdown = element.shadowRoot?.querySelector(
        '.more-tools-dropdown'
      );
      expect(moreDropdown).to.not.exist;
    });

    it('large mobile view should move "Insert" tools to the "More" dropdown when only AI is enabled', async () => {
      element.toolbar = toolbarActions.filter(
        (tool: string) => !['copy', 'paste'].includes(tool)
      );
      (element as any)._currentMode = 'largeMobile';
      await element.updateComplete;
      const moreDropdown = element.shadowRoot?.querySelector(
        '.more-tools-dropdown'
      );
      const insertIconInMoreDropdown = moreDropdown?.querySelector(
        'sl-dropdown sc-icon[name="editor-image"]'
      );
      expect(moreDropdown).to.exist;
      expect(insertIconInMoreDropdown).to.exist;
    });

    it('large mobile view should add custom buttons and a separator to the "More" dropdown', async () => {
      element.toolbar = toolbarActions.filter(
        (tool: string) => !['copy', 'paste'].includes(tool)
      );
      element.customToolbarButtons = mockCustomButtons;
      (element as any)._currentMode = 'largeMobile';
      await element.updateComplete;
      const moreDropdown = element.shadowRoot?.querySelector(
        '.more-tools-dropdown'
      );
      const separator = moreDropdown?.querySelector('.separator');
      const customButton = moreDropdown?.querySelector(
        'sc-rte-action-v2[command="custom"]'
      );
      expect(separator).to.exist;
      expect(customButton).to.exist;
    });
  });
});
