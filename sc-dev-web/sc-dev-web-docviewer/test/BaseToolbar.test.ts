import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { BaseToolbar } from '../src/components/BaseToolbar.js';
// eslint-disable-next-line no-duplicate-imports
import '../src/components/BaseToolbar.js';

const setupResizeObserverMock = () => {
  const original = globalThis.ResizeObserver;
  class MockResizeObserver {
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
  }
  (globalThis as any).ResizeObserver = MockResizeObserver;
  return () => {
    (globalThis as any).ResizeObserver = original;
  };
};

@customElement('test-base-toolbar')
class TestBaseToolbar extends BaseToolbar {}

@customElement('test-base-toolbar-with-surface')
class TestBaseToolbarWithSurface extends BaseToolbar {
  render() {
    return html`
      <div class="main-toolbar toolbar">
        <div class="set left-set">
          <button class="tool">A</button>
          <button class="tool">B</button>
          <button class="tool">C</button>
        </div>
        <div class="set center-set">
          <button class="tool">D</button>
        </div>
        <div class="set right-set">
          <button class="tool">E</button>
        </div>
      </div>
      ${this.renderMoreTool()}
    `;
  }
}

describe('base toolbar', () => {
  it('moves overflowing tools into the more menu and restores them', async () => {
    const restoreResizeObserver = setupResizeObserverMock();
    const el = await fixture<TestBaseToolbarWithSurface>(html`
      <test-base-toolbar-with-surface></test-base-toolbar-with-surface>
    `);

    await el.updateComplete;
    (el as any).requestUpdate();
    await el.updateComplete;

    const toolbar = el.shadowRoot?.querySelector('.main-toolbar') as HTMLElement;
    const moreTool = el.shadowRoot?.querySelector('.more-tool') as HTMLElement;
    const moreToolbar = el.shadowRoot?.querySelector('.more-toolbar') as HTMLElement;
    const tools = el.shadowRoot?.querySelectorAll('.tool:not(.lock)') as NodeListOf<HTMLElement>;

    expect(toolbar).to.exist;
    expect(moreTool).to.exist;
    expect(moreToolbar).to.exist;

    if (!toolbar || !moreTool || !moreToolbar) {
      restoreResizeObserver();
      return;
    }

    Object.defineProperty(toolbar, 'clientWidth', { value: 80, configurable: true });
    Object.defineProperty(toolbar, 'scrollWidth', { value: 200, configurable: true });
    Object.defineProperty(moreTool, 'offsetWidth', { value: 20, configurable: true });

    [...tools].forEach((tool, index) => {
      Object.defineProperty(tool, 'offsetWidth', { value: 30, configurable: true });
      Object.defineProperty(tool, 'offsetLeft', { value: index * 30, configurable: true });
      tool.style.marginRight = '0px';
    });

    (el as any).handleResize();
    expect(toolbar.classList.contains('truncated')).to.equal(true);
    expect(moreToolbar.childElementCount).to.be.greaterThan(0);

    Object.defineProperty(toolbar, 'clientWidth', { value: 240, configurable: true });
    Object.defineProperty(toolbar, 'scrollWidth', { value: 240, configurable: true });
    (el as any).handleResize();

    expect(toolbar.classList.contains('truncated')).to.equal(false);
    restoreResizeObserver();
  });

  it('renders the more tool trigger', async () => {
    const restoreResizeObserver = setupResizeObserverMock();
    const el = await fixture<TestBaseToolbarWithSurface>(html`
      <test-base-toolbar-with-surface></test-base-toolbar-with-surface>
    `);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('sc-file-tool-icon[label="More"]')).to.exist;
    restoreResizeObserver();
  });
});