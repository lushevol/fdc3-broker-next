import { fixture, expect } from '@open-wc/testing';
import { html, nothing, render } from 'lit';

import type { ScFileTool } from '../src/components/ScFileTool.js';
// eslint-disable-next-line no-duplicate-imports
import '../src/components/ScFileTool.js';

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

describe('test scriber com', () => {
  it('color scriber', async () => {
    const restoreResizeObserver = setupResizeObserverMock();
    const el = await fixture<ScFileTool>(
      html`<sc-file-tool
        .dimension=${{ width: 20, height: 20 }}
        .activeFileType=${'image/png'}
        ?isScriberToolActive=${true}
        .activeFileType=${''}
      ></sc-file-tool>`
    );
      await el.updateComplete;
      el.reset();
      el.toggleState('isSheetOpen');
      await el.setTotalPage(3);
      el.emitStateChange('currentPage');

      const emitSpy = jest.spyOn(el, 'emit');

      const host = document.createElement('div');
      document.body.appendChild(host);
      render(html`${el.render()}`, host);

      const fullscreen = host.querySelector('sc-file-tool-icon[label="Fullscreen"]') as HTMLElement;
      const download = host.querySelector('sc-file-tool-icon[label="Download"]') as HTMLElement;
      fullscreen?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      download?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

      el.setPage(10, { emit: true });
      el.setPage(-1);
      el.setZoom(9);
      el.setRotation(999);
      el.updateCurrentPageViaToc(1);
      el.setPageDebounced(2);
      el.setPageDebounced.flush();
      el.setZoomDebounced(120);
      el.setZoomDebounced.flush();

    expect(el.activeFileType).to.equal('image/png');
    expect(el.currentPage).to.equal(2);
    expect(el.zoomRatio).to.equal(120);
    expect(el.rotation).to.equal(279);
    expect(el.totalPage).to.equal(3);
    expect(el.initialZoom).to.equal('auto');
    expect(
      emitSpy.mock.calls.some(args => args[0] === 'sc-file-tool-fullscreen')
    ).to.equal(true);
    expect(
      emitSpy.mock.calls.some(args => args[0] === 'sc-file-tool-download')
    ).to.equal(true);

      host.remove();
      restoreResizeObserver();
  });

  it('renders TOC side-sheet and emits sheet/page events', async () => {
      const restoreResizeObserver = setupResizeObserverMock();
    const el = await fixture<ScFileTool>(
      html`<sc-file-tool
        .activeFileType=${'application/pdf'}
        .pageInfo=${new Map([
          [3, 'p3'],
          [1, 'p1'],
          [2, 'p2'],
        ])}
      ></sc-file-tool>`
    );

    await el.updateComplete;

    const emitted: Array<{ name: string; value: any }> = [];
    el.addEventListener('sc-file-tool-state-change', (e: Event) => {
      const { detail } = e as CustomEvent;
      emitted.push(detail);
    });

    expect(el.render()).to.not.equal(undefined);
    const sideSheetTemplate = el.renderSheetOfTOC();
    expect(sideSheetTemplate).to.not.equal(undefined);

    el.toggleState('isSheetOpen');
    expect(el.isSheetOpen).to.equal(true);
    (el.emitStateChange as any).flush?.();
    expect(
      emitted.some(item => item.name === 'isSheetOpen' && item.value === true)
    ).to.equal(true);

    el.updateCurrentPageViaToc(2);
    (el.emitStateChange as any).flush?.();
    expect(
      emitted.some(item => item.name === 'currentPage' && item.value === 2)
    ).to.equal(true);

    el.reset();
    expect(el.currentPage).to.equal(1);
    expect(el.isSheetOpen).to.equal(false);
    restoreResizeObserver();
  });

  it('handles side-sheet guard branches and TOC click handlers', async () => {
    const restoreResizeObserver = setupResizeObserverMock();
    const el = await fixture<ScFileTool>(
      html`<sc-file-tool></sc-file-tool>`
    );
    await el.updateComplete;

    // No active file type -> TOC and side sheet should short-circuit.
    expect(el.render()).to.not.equal(undefined);
    expect(el.renderSheetOfTOC()).to.equal(nothing);
    expect(el.renderDocTitle()).to.equal(nothing);

    // Unsupported file type -> still short-circuit.
    el.activeFileType = 'text/plain';
    await el.updateComplete;
    expect(el.render()).to.not.equal(undefined);
    expect(el.renderSheetOfTOC()).to.equal(nothing);

    // Supported file type -> click TOC icon and side-sheet thumbnail image.
    el.activeFileType = 'application/pdf';
    await el.updateComplete;

    const host = document.createElement('div');
    document.body.appendChild(host);
    render(html`${el.render()}`, host);

    const events: Array<{ name: string; value: any }> = [];
    el.addEventListener('sc-file-tool-state-change', (e: Event) => {
      events.push((e as CustomEvent).detail);
    });

    const menu = host.querySelector('sc-file-tool-icon[label="Contents"]') as HTMLElement;
    expect(menu).to.exist;
    menu?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    (el.emitStateChange as any).flush?.();

    const firstItem = host.querySelector(
      '.img-navigations .img-wrapper[data-page="1"]'
    ) as HTMLElement;
    expect(firstItem).to.exist;
    firstItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    (el.emitStateChange as any).flush?.();

    expect(events.some(e => e.name === 'isSheetOpen')).to.equal(true);
    expect(events.some(e => e.name === 'currentPage')).to.equal(true);

    host.remove();
    restoreResizeObserver();
  });

  it('covers tool controls, page indicators, and toc observer flows', async () => {
    const restoreResizeObserver = setupResizeObserverMock();
    const originalIO = (globalThis as any).IntersectionObserver;
    const callbacks: Array<(entries: any[]) => void> = [];
    (globalThis as any).IntersectionObserver = class {
      cb: (entries: any[]) => void;
      observe = jest.fn();
      disconnect = jest.fn();
      unobserve = jest.fn();
      constructor(cb: (entries: any[]) => void) {
        this.cb = cb;
        callbacks.push(cb);
      }
    } as any;

    try {
      const el = await fixture<ScFileTool>(
        html`<sc-file-tool .activeFileType=${'application/pdf'}></sc-file-tool>`
      );
      await el.updateComplete;

      const emitted: Array<{ name: string; value: any }> = [];
      el.addEventListener('sc-file-tool-state-change', (e: Event) => {
        emitted.push((e as CustomEvent).detail);
      });

      el.setZoom(123, { asDefault: 'width' });
      expect(el.defaultFullWidthZoom).to.equal(123);

      const d1 = document.createElement('div');
      const d2 = document.createElement('div');
      Object.defineProperty(el, 'tocThumbnails', {
        value: [d1, d2],
        configurable: true,
      });
      await el.setTotalPage(2);

      const host = document.createElement('div');
      document.body.appendChild(host);
      render(html`${el.render()}`, host);

      const zoomOut = host.querySelector('sc-file-tool-icon[label="Zoom out"]') as HTMLElement;
      const zoomIn = host.querySelector('sc-file-tool-icon[label="Zoom in"]') as HTMLElement;
      zoomOut?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      zoomIn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const zoomInput = host.querySelector('.zoom-input') as any;
      zoomInput.matches = () => true;
      zoomInput.dispatchEvent(
        new CustomEvent('sc-input', { detail: { value: '145' }, bubbles: true })
      );
      el.setZoomDebounced.flush();
      zoomInput.value = '145';
      zoomInput.dispatchEvent(new CustomEvent('sc-blur', { bubbles: true }));
      zoomInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
      expect(el.zoomRatio).to.equal(145);

      const prev = host.querySelector('sc-file-tool-icon[label="Previous Page"]') as HTMLElement;
      const next = host.querySelector('sc-file-tool-icon[label="Next Page"]') as HTMLElement;
      prev?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      next?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      const pageInput = host.querySelector('.page-input') as any;
      pageInput.matches = () => true;
      pageInput.dispatchEvent(
        new CustomEvent('sc-input', { detail: { value: '2' }, bubbles: true })
      );
      el.setPageDebounced.flush();
      pageInput.value = '2';
      pageInput.dispatchEvent(new CustomEvent('sc-blur', { bubbles: true }));
      pageInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
      expect(el.currentPage).to.equal(2);

      const rotateSvg = host.querySelector('svg') as unknown as HTMLElement;
      rotateSvg?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      (el.emitStateChange as any).flush?.();

      const tocEvents: Array<any> = [];
      el.addEventListener('sc-toc-thumbnail-request', (e: Event) => {
        tocEvents.push((e as CustomEvent).detail);
      });

      const targetWide = document.createElement('div');
      targetWide.dataset.page = '2';
      callbacks[0]?.([{ isIntersecting: true, target: targetWide }]);
      expect(tocEvents.length).to.be.greaterThan(0);

      const sourceWide = document.createElement('canvas');
      sourceWide.width = 200;
      sourceWide.height = 100;
      tocEvents[0].provide(sourceWide);

      const targetTall = document.createElement('div');
      targetTall.dataset.page = '1';
      callbacks[0]?.([{ isIntersecting: true, target: targetTall }]);
      const sourceTall = document.createElement('canvas');
      sourceTall.width = 100;
      sourceTall.height = 200;
      tocEvents[1].provide(sourceTall);

      expect(el.zoomRatio).to.equal(145);

      host.remove();
      restoreResizeObserver();
    } finally {
      (globalThis as any).IntersectionObserver = originalIO;
    }
  });

  it('covers reset blur action and enter selection range paths', async () => {
    const restoreResizeObserver = setupResizeObserverMock();
    const originalRaf = globalThis.requestAnimationFrame;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    }) as typeof requestAnimationFrame;

    try {
      const el = await fixture<ScFileTool>(
        html`<sc-file-tool
          .activeFileType=${'application/pdf'}
          .config=${{ blurAction: 'reset', strictLimits: false }}
        ></sc-file-tool>`
      );

      await el.setTotalPage(4);
      await el.updateComplete;

      const host = document.createElement('div');
      document.body.appendChild(host);
      render(html`${el.render()}`, host);

      const zoomInput = host.querySelector('.zoom-input') as any;
      const pageInput = host.querySelector('.page-input') as any;
      expect(zoomInput).to.exist;
      expect(pageInput).to.exist;

      zoomInput.value = '177';
      pageInput.value = '3';

      zoomInput.dispatchEvent(new CustomEvent('sc-blur', { bubbles: true }));
      pageInput.dispatchEvent(new CustomEvent('sc-blur', { bubbles: true }));
      expect(zoomInput.value).to.equal(`${el.zoomRatio}`);
      expect(pageInput.value).to.equal(`${el.currentPage}`);

      const zoomSelect = jest.fn();
      const pageSelect = jest.fn();
      zoomInput.value = '180';
      zoomInput.formControl = { setSelectionRange: zoomSelect };
      pageInput.value = '4';
      pageInput.formControl = { setSelectionRange: pageSelect };

      zoomInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
      pageInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );

      expect(zoomSelect.mock.calls.length).to.be.greaterThan(0);
      expect(pageSelect.mock.calls.length).to.be.greaterThan(0);

      host.remove();
      restoreResizeObserver();
    } finally {
      globalThis.requestAnimationFrame = originalRaf;
    }
  });
});
