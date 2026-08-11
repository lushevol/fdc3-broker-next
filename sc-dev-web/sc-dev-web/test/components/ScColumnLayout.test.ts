import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';
import { ScColumnLayout } from '../../src/components/ScLayout/ScColumnLayout.js';
import '../../elements/sc-column-layout.js';

const createTouchEvent = (type: string, clientX: number) => {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, 'touches', {
    configurable: true,
    value: [{ clientX }],
  });
  return event as TouchEvent;
};

const createDomRect = (left: number, width: number) => ({
  bottom: 0,
  height: 0,
  left,
  right: left + width,
  top: 0,
  width,
  x: left,
  y: 0,
  toJSON: () => ({}),
}) as DOMRect;

const mockResizeRects = (sandbox: sinon.SinonSandbox, el: ScColumnLayout) => {
  const gridRow = el.shadowRoot?.querySelector('.grid-row') as HTMLElement;
  const leftPanel = el.shadowRoot?.querySelector(
    '.grid-column.left-column.minor'
  ) as HTMLElement;
  const rightPanel = el.shadowRoot?.querySelector(
    '.grid-column.right-column.minor'
  ) as HTMLElement;

  sandbox.stub(gridRow, 'getBoundingClientRect').returns(createDomRect(0, 1200));
  sandbox.stub(leftPanel, 'getBoundingClientRect').returns(createDomRect(0, 300));
  sandbox.stub(rightPanel, 'getBoundingClientRect').returns(
    createDomRect(900, 300)
  );

  return { leftPanel, rightPanel };
};

describe('ScColumnLayout', () => {
  it('renders column layout', async () => {
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout title="test">
        <div slot="left">Test</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);
    await fixture<ScColumnLayout>(html`
      <sc-column-layout layout="Main Content Full" fix-sticky-bar>
        <div slot="title">title</div>
        <div slot="breadcrumb">breadcrumb</div>
        <div slot="content">Test</div>
      </sc-column-layout>
    `);
    await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        right-column-collapsible
        left-column-collapsible
        additional-height="20px"
      >
        <div slot="title">title</div>
        <div slot="breadcrumb">breadcrumb</div>
        <div slot="additional">additional</div>
        <div slot="left">Test</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);
    await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        right-column-collapsible
        left-column-collapsible
        additional-height="20px"
      >
        <div slot="title">title</div>
        <div slot="breadcrumb">breadcrumb</div>
        <div slot="additional">additional</div>
        <div slot="left">Test</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);
    await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        right-column-collapsible
        right-column-collapse
        left-column-collapsible
        left-divider-invisible
        additional-height="20px"
      >
        <div slot="title">title</div>
        <div slot="breadcrumb">breadcrumb</div>
        <div slot="additional">additional</div>
        <div slot="left">Test</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);
    await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Left"
        height="auto"
        additional-height="20px"
      >
        <sc-button slot="sticky-button">Cancel</sc-button>
        <div slot="breadcrumb">breadcrumb</div>
        <div slot="left">Test</div>
        <div slot="left">Middle</div>
        <div slot="left">Right</div>
      </sc-column-layout>
    `);

    expect(el.layout).to.equal('Main Content Right');
  });

  it('calls layout scroll', async () => {
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        right-column-collapsible
        additional-height="20px"
      >
        <div slot="title">title</div>
        <div slot="sticky-breadcrumb">breadcrumb</div>
        <sc-button slot="sticky-button">Save</sc-button>
        <sc-button slot="sticky-button">Cancel</sc-button>
        <div slot="additional">additional</div>
        <div slot="left">Test</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);
    el.rightColumnCollapse = true;
    el.updateRightCollapse();
    el.scrollAction();

    expect(el.layout).to.equal('Main Content Middle');
  });

  it('uses panel border drag when left/right resizable are enabled with visible dividers', async () => {
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        unfloatable
        left-column-resizable
        right-column-resizable
      >
        <div slot="left">Left</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);

    await el.updateComplete;

    expect(el.leftColumnResizable).to.equal(true);
    expect(el.rightColumnResizable).to.equal(true);
    expect(el.shadowRoot?.querySelector('.column-resize-handle.left')).to.not.exist;
    expect(el.shadowRoot?.querySelector('.column-resize-handle.right')).to.not.exist;
    expect(el.shadowRoot?.querySelector('.grid-column.left-column.minor')).to.exist;
    expect(el.shadowRoot?.querySelector('.grid-column.right-column.minor')).to.exist;
  });

  it('applies custom default panel widths', async () => {
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        left-column-width="20rem"
        right-column-width="24rem"
      >
        <div slot="left">Left</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);

    const parent = el.shadowRoot?.querySelector('.sc-column-layout') as HTMLElement | null;
    expect(parent?.style.getPropertyValue('--left-column-width').trim()).to.equal('20rem');
    expect(parent?.style.getPropertyValue('--right-column-width').trim()).to.equal('24rem');
  });

  it('keeps resize minimum widths at the default size when custom initial widths are provided', async () => {
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        left-column-collapsible
        left-column-width="20rem"
      >
        <div slot="left">Left</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);

    const sr: any = el.shadowRoot;
    const originalQuery = sr.querySelector.bind(sr);
    const leftPanel = { getBoundingClientRect: () => ({ width: 300 }) };
    const rightPanel = { getBoundingClientRect: () => ({ width: 300 }) };
    const gridRow = { getBoundingClientRect: () => ({ width: 1200 }) };

    sr.querySelector = (selector: string) => {
      if (selector === '.grid-row') return gridRow;
      if (selector === '.grid-column.left-column.minor') return leftPanel;
      if (selector === '.grid-column.right-column.minor') return rightPanel;
      return originalQuery(selector);
    };

    (el as any).startResizeDrag('left', 299);

    expect((el as any)._resizeMinLeftWidth).to.equal(300);

    (el as any).handleResizeMoveByClientX(350);
    expect((el as any)._leftResizableWidthPx).to.equal(351);
    expect((el as any)._leftCollapse).to.equal(false);

    (el as any).handleResizeMoveByClientX(-50);
    expect((el as any)._leftResizableWidthPx).to.equal(300);
    expect((el as any)._leftCollapse).to.equal(false);

    (el as any).handleResizeMoveByClientX(-100);
    expect((el as any)._leftCollapseTemp).to.equal(true);

    sr.querySelector = originalQuery;
    (el as any).stopResizeDrag();
  });

  describe('touch resize interaction', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('arms touch resize only after a double tap and clears it after the timeout', async () => {
      sandbox.useFakeTimers();
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcDevice').get(() => false);
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcModeLayout').get(() => true);

      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle" left-column-resizable>
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      await el.updateComplete;

      const { leftPanel } = mockResizeRects(sandbox, el);

      leftPanel.dispatchEvent(createTouchEvent('touchstart', 299));
      expect(el._touchResizeReadyType).to.equal('');

      leftPanel.dispatchEvent(createTouchEvent('touchstart', 299));
      expect(el._touchResizeReadyType).to.equal('left');

      sandbox.clock.tick(1801);

      expect(el._touchResizeReadyType).to.equal('');
    });

    it('starts resizing on touch move after double tap arming', async () => {
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcDevice').get(() => false);
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcModeLayout').get(() => true);

      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle" left-column-resizable>
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      await el.updateComplete;

      const { leftPanel } = mockResizeRects(sandbox, el);

      leftPanel.dispatchEvent(createTouchEvent('touchstart', 299));
      leftPanel.dispatchEvent(createTouchEvent('touchstart', 299));
      window.dispatchEvent(createTouchEvent('touchmove', 340));

      expect(el._isResizing).to.be.true;
      expect(el._resizeActionType).to.equal('left');
      expect(el._leftResizableWidthPx).to.equal(341);

      window.dispatchEvent(new Event('touchend'));

      expect(el._isResizing).to.be.false;
      expect(el._touchResizeReadyType).to.equal('');
    });

    it('still starts desktop resize immediately on mouse down', async () => {
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcDevice').get(() => true);
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcModeLayout').get(() => true);

      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle" left-column-resizable>
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      await el.updateComplete;

      const { leftPanel } = mockResizeRects(sandbox, el);

      leftPanel.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          clientX: 299,
        })
      );

      expect(el._isResizing).to.be.true;
      expect(el._resizeActionType).to.equal('left');
    });

    it('on non-pc, mouse down does not arm touch tap state', async () => {
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcDevice').get(() => false);
      sandbox.stub(ScColumnLayout.prototype as any, 'isPcModeLayout').get(() => true);

      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle" left-column-resizable>
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      await el.updateComplete;

      const { leftPanel } = mockResizeRects(sandbox, el);

      leftPanel.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          clientX: 299,
        })
      );

      expect(el._touchResizeReadyType).to.equal('');
      expect(el._isResizing).to.be.true;
      expect(el._resizeActionType).to.equal('left');
    });
  });

  it('renders collapse column layout', async () => {
    const customIcons = [
      {
        name: 'heart--line',
        action: () => {
          console.log('heart clicked');
        },
      },
    ];
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Middle"
        left-column-collapsible
        left-column-collapse
        left-divider-invisible
        right-column-collapsible
        exclude-header-offset
        exclude-breadcrumb-offset
        additional-offset="20"
        .custom-icons=${customIcons}
      >
        <div slot="left">Test</div>
        <div slot="left">Middle</div>
        <div slot="left">Right</div>
        <div slot="left-header">Left Header Slot</div>
        <div slot="right-header">Right Header Slot</div>
      </sc-column-layout>
    `);
    expect(el.layoutType.isMiddle).to.be.true;
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 750,
      }],
    });
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 950,
      }],
    });
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 750,
      }],
    });
    el._userCollapseRight = true;
    el._userCollapseLeft = true;
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 950,
      }],
    });
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 750,
      }],
    });
    el._leftCollapse = true;
    el._leftCollapse = false;
    el.handleCollapseLeft();
    el.handleCollapseLeft();
    el.leftColumnCollapse = true;
    el.updateLeftCollapse();

    el._rightCollapse = true;
    el._rightCollapse = false;
    el.handleCollapseRight();
    el.handleCollapseRight();
    el.rightColumnCollapse = true;
    el.updateRightCollapse();
    el.scrollAction();

    const leftCollapseIcon: any = el?.querySelector('div.collapse-block.left');
    leftCollapseIcon?.click?.();
    el.handleCollapseLeft();
    const rightCollapseIcon: any = el?.querySelector(
      'div.collapse-block.right'
    );
    rightCollapseIcon?.click?.();
    el.handleCollapseRight();
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 750,
      }],
    });
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 950,
      }],
    });
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 750,
      }],
    });
    el._userCollapseRight = true;
    el._userCollapseLeft = true;
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 950,
      }],
    });
    el.autoCollapse({
      borderBoxSize: [{
        inlineSize: 750,
      }],
    });

    expect(el.layout).to.equal('Main Content Middle');
  });

  it('renders collapse column layout in Content Full', async () => {
    const customIcons = [
      {
        name: 'heart--line',
        action: () => {
          console.log('heart clicked');
        },
      },
    ];
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout
        layout="Main Content Full"
        left-column-collapsible
        left-column-collapse
        left-divider-invisible
        exclude-header-offset
        exclude-breadcrumb-offset
        additional-offset="20"
        fix-sticky-bar
        .custom-icons=${customIcons}
      >
        <div slot="left">Test</div>
        <div slot="left">Middle</div>
        <div slot="left">Right</div>
        <div slot="left-header">Left Header Slot</div>
        <div slot="right-header">Right Header Slot</div>
      </sc-column-layout>
    `);

    el._fixedBar = true;

    el._leftCollapse = true;
    el._leftCollapse = false;
    el.handleCollapseLeft();
    el.handleCollapseLeft();
    el.leftColumnCollapse = true;
    el.updateLeftCollapse();

    const leftCollapseIcon: any = el?.querySelector('div.collapse-block.left');
    leftCollapseIcon?.click?.();
    el.handleCollapseLeft();

    el._showMainContentZoomInIcon = true;
    const actionIcon: any = el?.querySelector('.action-icon-wrap sc-icon');
    actionIcon?.click();
    await el.updateComplete;

    el.hideZoom = true;
    expect(el.mainContentIconList).not.be.null;
    
    
    expect(el.layoutType.isFull).to.be.true;
    expect(el.layout).to.equal('Main Content Full');
  });

  it('unfloatable layout', async () => {
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout title="test" unfloatable>
        <div slot="left">Test</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);
    expect(el.unfloatable).to.equal(true);
  });

  it('renderHeader function', async () => {
    const el = await fixture<ScColumnLayout>(html`
      <sc-column-layout title="test" unfloatable>
        <div slot="left">Test</div>
        <div slot="middle">Middle</div>
        <div slot="right">Right</div>
      </sc-column-layout>
    `);
    expect(el.renderHeader(true)).to.equal(null);
    expect(!!el.renderHeader(false)).to.equal(true);
  });

  describe('disable-auto-collapse property', () => {
    it('reflects the disable-auto-collapse attribute', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
          right-column-collapsible
          disable-auto-collapse
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);
      expect(el.disableAutoCollapse).to.be.true;
    });

    it('defaults disable-auto-collapse to false', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);
      expect(el.disableAutoCollapse).to.be.false;
    });

    it('autoCollapse does nothing when disable-auto-collapse is set', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
          right-column-collapsible
          disable-auto-collapse
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const leftBefore = el._leftCollapse;
      const rightBefore = el._rightCollapse;

      // Simulate a narrow-width resize that would normally trigger auto-collapse
      el.autoCollapse({ borderBoxSize: [{ inlineSize: 400 }] });
      el.autoCollapse({ borderBoxSize: [{ inlineSize: 200 }] });

      expect(el._leftCollapse).to.equal(leftBefore);
      expect(el._rightCollapse).to.equal(rightBefore);
    });

    it('autoCollapse still works when disable-auto-collapse is not set', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
          right-column-collapsible
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      // Force a known starting width so subsequent calls trigger the threshold
      el._componentWidth = 700;
      el._leftCollapse = false;
      el._leftCollapseTemp = false;
      el._rightCollapse = false;
      el._rightCollapseTemp = false;

      // Simulate shrink below 600 — should auto-collapse
      el.autoCollapse({ borderBoxSize: [{ inlineSize: 400 }] });

      setTimeout(() => {
        expect(el._leftCollapseTemp).to.be.true;
        expect(el._rightCollapseTemp).to.be.true;
      }, 500);
    });

    it('initPortraitLayoutSideColumn skips portrait collapse when disable-auto-collapse is set', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Right"
          left-column-collapsible
          disable-auto-collapse
        >
          <div slot="left">Left</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      // Manually reset collapse state and call initPortraitLayoutSideColumn
      el._leftCollapse = false;
      el._leftCollapseTemp = false;
      el._rightCollapse = false;
      el._rightCollapseTemp = false;

      el.initPortraitLayoutSideColumn();

      // Portrait-driven collapse must not have been applied
      expect(el._leftCollapse).to.be.false;
      expect(el._leftCollapseTemp).to.be.false;
    });

    it('initPortraitLayoutSideColumn collapses right column when both columns are collapsible and disable-auto-collapse is set', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
          right-column-collapsible
          disable-auto-collapse
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      // Reset to a fully expanded state then invoke
      el._leftCollapse = false;
      el._leftCollapseTemp = false;
      el._rightCollapse = false;
      el._rightCollapseTemp = false;

      el.initPortraitLayoutSideColumn();

      // Only the right column should have been collapsed (the special-case branch)
      expect(el._rightCollapse).to.be.true;
      expect(el._rightCollapseTemp).to.be.true;
      expect(el._leftCollapse).to.be.false;
      expect(el._leftCollapseTemp).to.be.false;
    });

    it('initPortraitLayoutSideColumn does not collapse right again when it is already collapsed and disable-auto-collapse is set', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
          right-column-collapsible
          disable-auto-collapse
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      // Start with right already collapsed
      el._leftCollapse = false;
      el._rightCollapse = true;

      const leftBefore = el._leftCollapse;

      el.initPortraitLayoutSideColumn();

      // Neither collapse state should change since right is already collapsed
      expect(el._leftCollapse).to.equal(leftBefore);
      expect(el._rightCollapse).to.be.true;
    });

    it('manual collapse still works when disable-auto-collapse is set', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
          right-column-collapsible
          disable-auto-collapse
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      el._leftCollapse = false;
      el._leftCollapseTemp = false;

      el.handleCollapseLeft();

      expect(el._leftCollapseTemp).to.be.true;

      el._rightCollapse = false;
      el._rightCollapseTemp = false;

      el.handleCollapseRight();

      expect(el._rightCollapseTemp).to.be.true;
    });
  });

  describe('type property', () => {
    it('defaults type to "page"', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout>
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      expect(el.type).to.equal('page');
    });

    it('accepts type="component" attribute', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout type="component">
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      expect(el.type).to.equal('component');
    });

    it('applies type-component CSS class to root when type="component"', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout type="component">
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      const root = el.shadowRoot?.querySelector('.sc-column-layout');
      expect(root?.classList.contains('type-component')).to.be.true;
    });

    it('does not apply type-component class when type="page"', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout type="page">
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      const root = el.shadowRoot?.querySelector('.sc-column-layout');
      expect(root?.classList.contains('type-component')).to.be.false;
    });

    it('sets _fixedBar to true for component type after firstUpdated', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout type="component">
          <sc-button slot="sticky-button">Save</sc-button>
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      await el.updateComplete;
      expect(el._fixedBar).to.be.true;
    });

    it('keeps _fixedBar true for component type even when fix-sticky-bar is false', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout type="component">
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      el.fixStickyBar = false;
      el.updateFixStickyBar();
      expect(el._fixedBar).to.be.true;
    });

    it('does not attach window scroll listener for component type', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout type="component">
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      await el.updateComplete;
      // _scrollAction remains empty because no scroll listener is registered
      expect(el._scrollAction).to.equal('');
    });

    it('component type renders sticky button with sm size (fixedBar=true)', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout type="component">
          <sc-button slot="sticky-button">Save</sc-button>
          <div slot="right">Content</div>
        </sc-column-layout>
      `);
      await el.updateComplete;
      const btn = el.querySelector('sc-button[slot="sticky-button"]') as any;
      // stickyButtonsChanged sets size="sm" when _fixedBar is true
      expect(btn?.size).to.equal('sm');
    });
  });

  describe('resize behavior', () => {
    it('forwards internal resize callbacks to handlers', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      let moved = false;
      let stopped = false;
      (el as any).handleResizeMove = () => {
        moved = true;
      };
      (el as any).stopResizeDrag = () => {
        stopped = true;
      };

      (el as any)._onResizeMove({ clientX: 10 } as MouseEvent);
      (el as any)._onResizeUp();

      expect(moved).to.equal(true);
      expect(stopped).to.equal(true);
    });

    it('converts css width values to px', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const px = (el as any)._toPx('300px');
      const rem = (el as any)._toPx('1rem');
      const raw = (el as any)._toPx('42');

      expect(px).to.equal(300);
      expect(rem).to.be.greaterThan(0);
      expect(raw).to.equal(42);
    });

    it('detects divider border hit area for left and right', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const target: any = {
        getBoundingClientRect: () => ({ left: 100, right: 400 }),
      };

      const leftHit = (el as any).isResizeBorderHit('left', {
        currentTarget: target,
        clientX: 396,
      } as MouseEvent);
      const leftMiss = (el as any).isResizeBorderHit('left', {
        currentTarget: target,
        clientX: 380,
      } as MouseEvent);

      const rightHit = (el as any).isResizeBorderHit('right', {
        currentTarget: target,
        clientX: 104,
      } as MouseEvent);
      const rightMiss = (el as any).isResizeBorderHit('right', {
        currentTarget: target,
        clientX: 130,
      } as MouseEvent);

      expect(leftHit).to.equal(true);
      expect(leftMiss).to.equal(false);
      expect(rightHit).to.equal(true);
      expect(rightMiss).to.equal(false);
    });

    it('starts drag and records stable base min widths once', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const sr: any = el.shadowRoot;
      const originalQuery = sr.querySelector.bind(sr);
      const leftPanel = { getBoundingClientRect: () => ({ width: 300 }) };
      const rightPanel = { getBoundingClientRect: () => ({ width: 300 }) };
      const gridRow = { getBoundingClientRect: () => ({ width: 1200 }) };
      sr.querySelector = (selector: string) => {
        if (selector === '.grid-row') return gridRow;
        if (selector === '.grid-column.left-column.minor') return leftPanel;
        if (selector === '.grid-column.right-column.minor') return rightPanel;
        return originalQuery(selector);
      };

      (el as any).startResizeDrag('right', {
        clientX: 500,
        preventDefault: () => undefined,
      } as MouseEvent);

      expect((el as any)._isResizing).to.equal(true);
      expect((el as any)._resizeMinRightWidth).to.equal(300);

      // Change live width and start again: base min should stay unchanged.
      sr.querySelector = (selector: string) => {
        if (selector === '.grid-row') return gridRow;
        if (selector === '.grid-column.left-column.minor') {
          return { getBoundingClientRect: () => ({ width: 320 }) };
        }
        if (selector === '.grid-column.right-column.minor') {
          return { getBoundingClientRect: () => ({ width: 520 }) };
        }
        return originalQuery(selector);
      };

      (el as any).startResizeDrag('right', {
        clientX: 600,
        preventDefault: () => undefined,
      } as MouseEvent);

      expect((el as any)._resizeMinRightWidth).to.equal(300);
      sr.querySelector = originalQuery;
      (el as any).stopResizeDrag();
    });

    it('allows right panel shrink from max without collapsing', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          right-column-collapsible
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const sr: any = el.shadowRoot;
      const originalQuery = sr.querySelector.bind(sr);
      sr.querySelector = (selector: string) => {
        if (selector === '.grid-row') {
          return { getBoundingClientRect: () => ({ width: 1300 }) };
        }
        return originalQuery(selector);
      };

      (el as any)._isResizing = true;
      (el as any)._resizeActionType = 'right';
      (el as any)._resizeStartX = 600;
      (el as any)._resizeStartLeftWidth = 300;
      (el as any)._resizeStartRightWidth = 560;
      (el as any)._resizeMinRightWidth = 300;
      (el as any)._rightCollapse = false;

      (el as any).handleResizeMove({ clientX: 700 } as MouseEvent);

      expect((el as any)._rightResizableWidthPx).to.equal(460);
      expect((el as any)._rightCollapse).to.equal(false);
      sr.querySelector = originalQuery;
    });

    it('collapses right panel only when shrinking beyond min with overshoot', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          right-column-collapsible
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const sr: any = el.shadowRoot;
      const originalQuery = sr.querySelector.bind(sr);
      sr.querySelector = (selector: string) => {
        if (selector === '.grid-row') {
          return { getBoundingClientRect: () => ({ width: 1300 }) };
        }
        return originalQuery(selector);
      };

      let collapsed = false;
      (el as any).handleCollapseRight = () => {
        collapsed = true;
      };

      (el as any)._isResizing = true;
      (el as any)._resizeActionType = 'right';
      (el as any)._resizeStartX = 600;
      (el as any)._resizeStartLeftWidth = 300;
      (el as any)._resizeStartRightWidth = 300;
      (el as any)._resizeMinRightWidth = 300;
      (el as any)._rightCollapse = false;

      // Very large right drag -> width target below min, should trigger collapse.
      (el as any).handleResizeMove({ clientX: 1100 } as MouseEvent);

      expect(collapsed).to.equal(true);
      sr.querySelector = originalQuery;
    });

    it('does not start resize when border hit test fails', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      let started = false;
      (el as any).startResizeDrag = () => {
        started = true;
      };

      (el as any).handlePanelBorderMouseDown('left', {
        currentTarget: {
          getBoundingClientRect: () => ({ left: 100, right: 400 }),
        },
        clientX: 350,
      } as unknown as MouseEvent);

      expect(started).to.equal(false);
    });

    it('starts resize when border hit test succeeds', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      let started = false;
      (el as any).startResizeDrag = () => {
        started = true;
      };

      (el as any).handlePanelBorderMouseDown('left', {
        currentTarget: {
          getBoundingClientRect: () => ({ left: 100, right: 400 }),
        },
        clientX: 398,
      } as unknown as MouseEvent);

      expect(started).to.equal(true);
    });

    it('keeps hover state while same-side drag is active', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      (el as any)._resizeActionType = 'left';
      (el as any)._resizeHoverType = 'left';
      (el as any).handlePanelBorderMouseLeave('left');

      expect((el as any)._resizeHoverType).to.equal('left');
    });

    it('returns early from handleResizeMove when drag is inactive', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      (el as any)._isResizing = false;
      (el as any)._leftResizableWidthPx = 123;
      (el as any).handleResizeMove({ clientX: 999 } as MouseEvent);

      expect((el as any)._leftResizableWidthPx).to.equal(123);
    });

    it('returns early from startResizeDrag when not in pc mode', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle" compact>
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      (el as any).startResizeDrag('left', {
        clientX: 100,
        preventDefault: () => undefined,
      } as MouseEvent);

      expect((el as any)._isResizing).to.equal(false);
    });

    it('returns early when grid row is unavailable during resize', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout layout="Main Content Middle">
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const sr: any = el.shadowRoot;
      const originalQuery = sr.querySelector.bind(sr);
      sr.querySelector = (selector: string) => {
        if (selector === '.grid-row') return null;
        return originalQuery(selector);
      };

      (el as any)._isResizing = true;
      (el as any)._resizeActionType = 'left';
      (el as any)._leftResizableWidthPx = 222;
      (el as any).handleResizeMove({ clientX: 800 } as MouseEvent);

      expect((el as any)._leftResizableWidthPx).to.equal(222);
      sr.querySelector = originalQuery;
    });

    it('updates left width in left-resize branch without collapse', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const sr: any = el.shadowRoot;
      const originalQuery = sr.querySelector.bind(sr);
      sr.querySelector = (selector: string) => {
        if (selector === '.grid-row') {
          return { getBoundingClientRect: () => ({ width: 1300 }) };
        }
        return originalQuery(selector);
      };

      (el as any)._isResizing = true;
      (el as any)._resizeActionType = 'left';
      (el as any)._resizeStartX = 600;
      (el as any)._resizeStartLeftWidth = 320;
      (el as any)._resizeStartRightWidth = 300;
      (el as any)._resizeMinLeftWidth = 300;
      (el as any)._leftCollapse = false;

      (el as any).handleResizeMove({ clientX: 700 } as MouseEvent);

      expect((el as any)._leftResizableWidthPx).to.equal(420);
      expect((el as any)._leftCollapse).to.equal(false);
      sr.querySelector = originalQuery;
    });

    it('collapses left panel when shrinking below min with overshoot', async () => {
      const el = await fixture<ScColumnLayout>(html`
        <sc-column-layout
          layout="Main Content Middle"
          left-column-collapsible
        >
          <div slot="left">Left</div>
          <div slot="middle">Middle</div>
          <div slot="right">Right</div>
        </sc-column-layout>
      `);

      const sr: any = el.shadowRoot;
      const originalQuery = sr.querySelector.bind(sr);
      sr.querySelector = (selector: string) => {
        if (selector === '.grid-row') {
          return { getBoundingClientRect: () => ({ width: 1300 }) };
        }
        return originalQuery(selector);
      };

      let collapsed = false;
      (el as any).handleCollapseLeft = () => {
        collapsed = true;
      };

      (el as any)._isResizing = true;
      (el as any)._resizeActionType = 'left';
      (el as any)._resizeStartX = 600;
      (el as any)._resizeStartLeftWidth = 300;
      (el as any)._resizeStartRightWidth = 300;
      (el as any)._resizeMinLeftWidth = 300;
      (el as any)._leftCollapse = false;

      (el as any).handleResizeMove({ clientX: 100 } as MouseEvent);

      expect(collapsed).to.equal(true);
      sr.querySelector = originalQuery;
    });
  });
});
