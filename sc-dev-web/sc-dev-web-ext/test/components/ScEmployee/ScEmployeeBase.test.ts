import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScEmployeeBase } from '../../../src/components/ScEmployee/ScEmployeeBase.js';
import '../../../elements/sc-employee.js';
import '@scdevkit/webkit/elements/sc-tooltip.js';

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

if (!Element.prototype.animate) {
  Element.prototype.animate = () => ({
    finished: Promise.resolve({} as Animation),
    cancel: () => {},
    play: () => {},
    pause: () => {},
    reverse: () => {},
    commitStyles: () => {},
    updatePlaybackRate: () => {},
    persist: () => {},
    currentTime: 0,
    effect: null,
    id: '',
    oncancel: null,
    onfinish: null,
    onremove: null,
    playbackRate: 1,
    startTime: null,
    timeline: null,
    pending: false,
    playState: 'idle',
    replaceState: 'active',
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as Animation);
}

describe('ScEmployeeBase', () => {
  it('renders default employee base', async () => {
    class EmployeeTooltipTest extends ScEmployeeBase {
      render() {
        return html`
          <sc-tooltip placement="bottom" content-max-width="400px" mode="light" hoist>
            1234
            <div slot="content" class="tooltip-container">
              Test
            </div>     
          </sc-tooltip>
        `;
      }
    }
    window.customElements.define('sc-employee-base', EmployeeTooltipTest);
    const el = await fixture<ScEmployeeBase>(html`<sc-employee-base id='1626487'></sc-employee-base>`);
    expect(el.id).to.equal('1626487');
    const tooltip = el.shadowRoot?.querySelector('sc-tooltip');
    expect(tooltip).to.exist;

    let closeCalled = 0;
    const originalClose = el.closeTooltip;
    el.closeTooltip = () => {
      closeCalled += 1;
      return originalClose.call(el);
    };
    el.onBodyClick({ composedPath: () => [] } as unknown as MouseEvent);
    expect(closeCalled).to.equal(1);
  });

  it('closes multiple tooltips in the same employee instance on employee click', async () => {
    class EmployeeTooltipSelfTest extends ScEmployeeBase {
      render() {
        return html`<div>self</div>`;
      }
    }

    window.customElements.define('sc-employee-tooltip-self-test', EmployeeTooltipSelfTest);
    const el = await fixture<ScEmployeeBase>(html`<sc-employee-tooltip-self-test></sc-employee-tooltip-self-test>`);

    let closeCalled = 0;
    const originalClose = el.closeTooltip;
    el.closeTooltip = () => {
      closeCalled += 1;
      return originalClose.call(el);
    };

    el.onBodyClick({ composedPath: () => [el] } as unknown as MouseEvent);

    expect(closeCalled).to.equal(1);
  });

  it('closes other employee tooltip when clicking another employee instance', async () => {
    class EmployeeTooltipGroupTest extends ScEmployeeBase {
      render() {
        return html`
          <sc-tooltip placement="bottom" content-max-width="400px" mode="light" hoist>
            1234
            <div slot="content" class="tooltip-container">
              Test
            </div>
          </sc-tooltip>
        `;
      }
    }

    window.customElements.define('sc-employee-tooltip-group-test', EmployeeTooltipGroupTest);

    const first = await fixture<ScEmployeeBase>(html`<sc-employee-tooltip-group-test></sc-employee-tooltip-group-test>`);
    const second = await fixture<ScEmployeeBase>(html`<sc-employee-tooltip-group-test></sc-employee-tooltip-group-test>`);

    const firstTooltip = first.shadowRoot?.querySelector('sc-tooltip');
    const secondTooltip = second.shadowRoot?.querySelector('sc-tooltip');

    expect(firstTooltip).to.exist;
    expect(secondTooltip).to.exist;

    if (firstTooltip && secondTooltip) {
      let firstClosed = 0;
      let secondClosed = 0;
      const firstOriginalClose = first.closeTooltip;
      const secondOriginalClose = second.closeTooltip;

      first.closeTooltip = () => {
        firstClosed += 1;
        return firstOriginalClose.call(first);
      };

      second.closeTooltip = () => {
        secondClosed += 1;
        return secondOriginalClose.call(second);
      };

      const clickEvent = {
        composedPath: () => [second],
      } as unknown as MouseEvent;

      first.onBodyClick(clickEvent);
      second.onBodyClick(clickEvent);

      expect(firstClosed).to.equal(1);
      expect(secondClosed).to.equal(1);
    }
  });

  it('does not close tooltip when clicking inside tooltip content', async () => {
    class EmployeeTooltipContentTest extends ScEmployeeBase {
      render() {
        return html`<div>tooltip-content</div>`;
      }
    }

    window.customElements.define('sc-employee-tooltip-content-test', EmployeeTooltipContentTest);
    const el = await fixture<ScEmployeeBase>(html`<sc-employee-tooltip-content-test></sc-employee-tooltip-content-test>`);

    let closeCalled = 0;
    const originalClose = el.closeTooltip;
    el.closeTooltip = () => {
      closeCalled += 1;
      return originalClose.call(el);
    };

    el.onBodyClick({ composedPath: () => [{ classList: { contains: (cls: string) => cls === 'tooltip-container' } }, el] } as unknown as MouseEvent);
    expect(closeCalled).to.equal(0);
  });

  it('renders pin icon as pin--line when suggestedPinned is false', async () => {
    class EmployeePinTest extends ScEmployeeBase {
      render() {
        const mockData = {
          name: 'Test User',
          email: 'test@example.com',
          id: '123456',
          phone: '1234567890',
          location: 'Test City',
          department: 'Test Dept',
          businessTitle: 'Test Title',
        };
        return this.renderDetails({
          mode: 'compact',
          data: mockData,
          hideActions: true,
          noTooltip: false,
          type: 'input',
          stopEvent: true,
          suggestedPeople: true,
          suggestedId: 'suggestion-123',
          suggestedPinned: false,
        });
      }
    }
    window.customElements.define('sc-employee-pin-test', EmployeePinTest);
    const el = await fixture<ScEmployeeBase>(html`<sc-employee-pin-test></sc-employee-pin-test>`);
    await el.updateComplete;
    
    const pinButton = el.shadowRoot?.querySelector('sc-icon-button[title="Pin"]');
    expect(pinButton).to.exist;
    expect(pinButton?.getAttribute('name')).to.equal('pin--line');
  });

  it('renders pin icon as pin--fill when suggestedPinned is true', async () => {
    class EmployeePinnedTest extends ScEmployeeBase {
      render() {
        const mockData = {
          name: 'Test User',
          email: 'test@example.com',
          id: '123456',
          phone: '1234567890',
          location: 'Test City',
          department: 'Test Dept',
          businessTitle: 'Test Title',
        };
        return this.renderDetails({
          mode: 'compact',
          data: mockData,
          hideActions: true,
          noTooltip: false,
          type: 'input',
          stopEvent: true,
          suggestedPeople: true,
          suggestedId: 'suggestion-456',
          suggestedPinned: true,
        });
      }
    }
    window.customElements.define('sc-employee-pinned-test', EmployeePinnedTest);
    const el = await fixture<ScEmployeeBase>(html`<sc-employee-pinned-test></sc-employee-pinned-test>`);
    await el.updateComplete;
    
    const pinButton = el.shadowRoot?.querySelector('sc-icon-button[title="Pin"]');
    expect(pinButton).to.exist;
    expect(pinButton?.getAttribute('name')).to.equal('pin--fill');
  });

  it('renders trash and pin buttons for suggested people', async () => {
    class EmployeeSuggestedActionsTest extends ScEmployeeBase {
      render() {
        const mockData = {
          name: 'Test User',
          email: 'test@example.com',
          id: '123456',
          phone: '1234567890',
          location: 'Test City',
          department: 'Test Dept',
          businessTitle: 'Test Title',
        };
        return this.renderDetails({
          mode: 'compact',
          data: mockData,
          hideActions: true,
          noTooltip: false,
          type: 'input',
          stopEvent: true,
          suggestedPeople: true,
          suggestedId: 'suggestion-789',
          suggestedPinned: false,
        });
      }
    }
    window.customElements.define('sc-employee-suggested-actions-test', EmployeeSuggestedActionsTest);
    const el = await fixture<ScEmployeeBase>(html`<sc-employee-suggested-actions-test></sc-employee-suggested-actions-test>`);
    await el.updateComplete;
    
    const trashButton = el.shadowRoot?.querySelector('sc-icon-button[title="Delete"]');
    const pinButton = el.shadowRoot?.querySelector('sc-icon-button[title="Pin"]');
    
    expect(trashButton).to.exist;
    expect(trashButton?.getAttribute('name')).to.equal('trash--line');
    expect(trashButton?.getAttribute('state')).to.equal('error');
    
    expect(pinButton).to.exist;
    expect(pinButton?.getAttribute('name')).to.equal('pin--line');
    expect(pinButton?.getAttribute('state')).to.equal('default');
  });

  it('does not render action buttons when suggestedPeople is false', async () => {
    class EmployeeNoActionsTest extends ScEmployeeBase {
      render() {
        const mockData = {
          name: 'Test User',
          email: 'test@example.com',
          id: '123456',
          phone: '1234567890',
          location: 'Test City',
          department: 'Test Dept',
          businessTitle: 'Test Title',
        };
        return this.renderDetails({
          mode: 'compact',
          data: mockData,
          hideActions: true,
          noTooltip: false,
          type: 'input',
          stopEvent: true,
          suggestedPeople: false,
        });
      }
    }
    window.customElements.define('sc-employee-no-actions-test', EmployeeNoActionsTest);
    const el = await fixture<ScEmployeeBase>(html`<sc-employee-no-actions-test></sc-employee-no-actions-test>`);
    await el.updateComplete;
    
    const suggestedActions = el.shadowRoot?.querySelector('.suggested-actions');
    expect(suggestedActions).to.not.exist;
  });
});