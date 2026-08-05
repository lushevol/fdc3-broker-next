import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';

import '../elements/sc-pdf-viewer.js';
import { ScPDFPage } from '../src/components/ScPDFPage.js';
import LinkService from '../src/utils/link.js';

if (!(globalThis as any).IntersectionObserver) {
  class MockIntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}

if (!customElements.get('sc-scriber')) {
  class MockScScriber extends HTMLElement {
    addSvgLayer() {}
    refreshCanvas() {}
    resize() {}
  }
  customElements.define('sc-scriber', MockScScriber);
}

jest.mock('../src/utils/worker.ts', () => {
  return {
    setWorker() {},
  };
});

jest.mock('pdfjs-dist', () => {
  const makeViewport = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) => ({
    width: 800 * scale,
    height: 1120 * scale,
    rotation,
    scale,
    clone: ({ scale: newScale = scale, rotation: newRotation = rotation }: { scale?: number; rotation?: number } = {}) =>
      makeViewport({ scale: newScale, rotation: newRotation }),
  });

  const createMockPdfPage = (pageNumber = 1) => ({
    pageNumber,
    cleanup: jest.fn(),
    render: () => ({ promise: Promise.resolve() }),
    getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) =>
      makeViewport({ scale, rotation }),
  });

  return {
    AnnotationMode: { ENABLE: 1 },
    PixelsPerInch: { PDF_TO_CSS_UNITS: 1 },
    getDocument: () => ({
      promise: Promise.resolve({
        numPages: 2,
        annotationStorage: {},
        getPage: async (pageNumber: number) => createMockPdfPage(pageNumber),
      }),
    }),
  };
});

jest.mock('pdfjs-dist/legacy/web/pdf_viewer.mjs', () => {
  class EventBus {}
  class PDFPageView {
    pdfPage: any;
    viewport: { width: number; height: number };
    scale: number;
    rotation = 0;
    renderingState: any;
    reset = jest.fn();

    constructor(options: any) {
      this.scale = options.scale;
      this.viewport = options.defaultViewport;
      this.pdfPage = undefined;
      this.renderingState = 0;
    }

    setPdfPage(pdfPage: any) {
      this.pdfPage = pdfPage;
      this.viewport = pdfPage.getViewport({ scale: this.scale, rotation: 0 });
    }

    update({ scale, rotation }: { scale: number; rotation: number }) {
      this.scale = scale;
      this.rotation = rotation;
      if (this.pdfPage) {
        this.viewport = this.pdfPage.getViewport({ scale, rotation });
      }
    }

    draw() {
      this.renderingState = 3;
      return Promise.resolve();
    }
  }

  return {
    __esModule: true,
    EventBus,
    PDFPageView,
    RenderingStates: {
      INITIAL: 0,
      RUNNING: 1,
      PAUSED: 2,
      FINISHED: 3,
    },
  };
});

describe('sc-pdf-viewer and sc-pdf-page (no scribble)', () => {
  it('loads pdf pages and reacts to file-tool state changes', async () => {
    const el = (await fixture(html`<sc-pdf-viewer></sc-pdf-viewer>`)) as any;
    await el.updateComplete;

    const makeViewport = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) => ({
      width: 800 * scale,
      height: 1120 * scale,
      rotation,
      scale,
      clone: ({ scale: newScale = scale, rotation: newRotation = rotation }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale: newScale, rotation: newRotation }),
    });
    const pageFactory = (pageNumber: number) => ({
      pageNumber,
      cleanup: jest.fn(),
      render: () => ({ promise: Promise.resolve() }),
      getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale, rotation }),
    });
    el.pdfContext = {
      pages: [pageFactory(1), pageFactory(2)],
      pdf: { annotationStorage: {} },
      linkService: new LinkService(),
    };
    await el.updateComplete;

    const fileTool = {
      currentPage: 1,
      initialZoom: 'auto',
      resConfig: { rotateScope: 'all' },
      setZoom: jest.fn(),
      setPage: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any;

    Object.defineProperty(el, 'clientWidth', {
      value: 500,
      configurable: true,
    });
    (el as any)._scrollParent = {
      clientWidth: 1008,
      scrollTop: 0,
      scrollLeft: 0,
    };
    el.fileTool = fileTool;
    el.handleToolInit();
    Object.defineProperty(el, 'sideSheet', {
      value: { open: false },
      configurable: true,
    });

    const scrollSpy = jest
      .spyOn(el, 'scrollToPage')
      .mockImplementation(() => undefined);

    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'currentPage', value: 2 },
      }) as Event
    );
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'zoomRatio', value: 130 },
      }) as Event
    );
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'rotation', value: 90 },
      }) as Event
    );

    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'isSheetOpen', value: true },
      }) as Event
    );

    expect(el.pdfContext?.pages.length).to.equal(2);
    expect(el.getPageInfo().length).to.equal(2);
    expect(scrollSpy.mock.calls.some(args => args[0] === 2)).to.equal(true);
    expect(fileTool.setZoom.mock.calls.length).to.be.greaterThan(0);
    expect(el.scale).to.equal(1.3);
    expect(el.rotation).to.equal(90);
    // isSheetOpen is owned by file-tool; pdf-viewer ignores this state change.
    expect(el.sideSheet.open).to.equal(false);

    expect(el.renderRoot.querySelectorAll('sc-pdf-page').length).to.equal(2);

    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'isSheetOpen', value: false },
      }) as Event
    );
    expect(el.sideSheet.open).to.equal(false);

    el.disconnectedCallback();
  });

  it('handles tool state and side-sheet without async pdf load', async () => {
    const el = (await fixture(html`<sc-pdf-viewer></sc-pdf-viewer>`)) as any;
    await el.updateComplete;

    const makeViewport = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) => ({
      width: 800 * scale,
      height: 1120 * scale,
      rotation,
      scale,
      clone: ({ scale: newScale = scale, rotation: newRotation = rotation }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale: newScale, rotation: newRotation }),
    });
    const page1 = {
      pageNumber: 1,
      cleanup: jest.fn(),
      render: () => ({ promise: Promise.resolve() }),
      getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale, rotation }),
    };
    const page2 = {
      ...page1,
      pageNumber: 2,
    };

    el.pdfContext = {
      pages: [page1, page2],
      pdf: { annotationStorage: {} },
      linkService: new LinkService(),
    };
    await el.updateComplete;

    Object.defineProperty(el, 'sideSheet', {
      value: { open: false },
      configurable: true,
    });
    const scrollSpy = jest
      .spyOn(el, 'scrollToPage')
      .mockImplementation(() => undefined);

    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'currentPage', value: 4 },
      }) as Event
    );
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'zoomRatio', value: 140 },
      }) as Event
    );
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'rotation', value: 180 },
      }) as Event
    );
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'isSheetOpen', value: true },
      }) as Event
    );

    expect(scrollSpy.mock.calls.some(args => args[0] === 4)).to.equal(true);
    expect(el.scale).to.equal(1.4);
    expect(el.rotation).to.equal(180);
    expect(el.sideSheet.open).to.equal(false);

    expect(el.renderRoot.querySelectorAll('sc-pdf-page').length).to.equal(2);

    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'isSheetOpen', value: false },
      }) as Event
    );
    expect(el.sideSheet.open).to.equal(false);

    el.disconnectedCallback();
  });

  it('applies rotation to current page when rotate scope is page', async () => {
    const el = (await fixture(html`<sc-pdf-viewer></sc-pdf-viewer>`)) as any;
    await el.updateComplete;

    const currentPage = { rotation: 30 } as any;
    const nextPage = { rotation: 10 } as any;
    Object.defineProperty(el, 'pages', {
      value: {
        item: (index: number) => [currentPage, nextPage][index],
        forEach: (cb: (page: any) => void) => [currentPage, nextPage].forEach(cb),
      },
      configurable: true,
    });

    el.rotation = 90;
    el.fileTool = {
      currentPage: 1,
      resConfig: { rotateScope: 'page' },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any;

    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'rotation', value: 180 },
      }) as Event
    );

    expect(currentPage.rotation).to.equal(120);
    expect(nextPage.rotation).to.equal(10);
    expect(el.rotation).to.equal(180);
  });

  it('wakes, transforms, sleeps, and cleans up pdf page', async () => {
    const makeViewport = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) => ({
      width: 800 * scale,
      height: 1120 * scale,
      rotation,
      scale,
      clone: ({ scale: newScale = scale, rotation: newRotation = rotation }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale: newScale, rotation: newRotation }),
    });
    const pdfPage = {
      pageNumber: 1,
      cleanup: jest.fn(),
      render: () => ({ promise: Promise.resolve() }),
      getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale, rotation }),
    } as any;

    const pdfContext = {
      pdf: {
        annotationStorage: {},
      },
      linkService: new LinkService(),
      pages: [pdfPage],
    } as any;

    const el = await fixture<ScPDFPage>(
      html`
        <sc-pdf-page
          .pageNumber=${1}
          .pdfPage=${pdfPage}
          .pdfContext=${pdfContext}
        ></sc-pdf-page>
      `
    );

    await el.updateComplete;

    const emitSpy = jest.spyOn(el, 'emit');
    await el.wakeup();
    const showTextLayer = jest.fn();
    const annotationDiv = { hidden: true };
    (el.pageView as any).textLayer = { show: showTextLayer };
    (el.pageView as any).annotationLayer = { div: annotationDiv };

    el.handleTransform();
    await el.sleep();
    el.resize();
    el.disconnectedCallback();

    expect(el.pageView).to.exist;
    expect((el as any).isSleeping).to.equal(true);
    expect(el.width).to.equal(800);
    expect(el.height).to.equal(1120);
    expect(showTextLayer.mock.calls.length).to.equal(2);
    expect(annotationDiv.hidden).to.equal(false);
    expect(
      emitSpy.mock.calls.some(
        args =>
          args[0] === 'sc-page-drawn' &&
          args[1]?.detail?.pageNumber === 1
      )
    ).to.equal(true);
    expect(pdfPage.cleanup.mock.calls.length).to.be.greaterThan(0);
  });

  it('covers thumbnail, queued redraw, and sleep branches in pdf page', async () => {
    const makeViewport = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) => ({
      width: (rotation === 90 ? 1200 : 800) * scale,
      height: (rotation === 90 ? 600 : 1120) * scale,
      rotation,
      scale,
      clone: ({ scale: newScale = scale, rotation: newRotation = rotation }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale: newScale, rotation: newRotation }),
    });
    const pdfPage = {
      pageNumber: 1,
      cleanup: jest.fn(),
      render: () => ({ promise: Promise.resolve() }),
      getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale, rotation }),
    } as any;

    const el = await fixture<ScPDFPage>(
      html`
        <sc-pdf-page
          .pageNumber=${1}
          .pdfPage=${pdfPage}
          .pdfContext=${{ pdf: { annotationStorage: {} }, linkService: new LinkService(), pages: [pdfPage] } as any}
        ></sc-pdf-page>
      `
    );
    await el.updateComplete;

    const originalCreateElement = document.createElement.bind(document);
    const mockCanvas = originalCreateElement('canvas');
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(((tag: string) => {
        if (tag === 'canvas') return mockCanvas;
        return originalCreateElement(tag);
      }) as any);

    await el.wakeup();

    expect(el.offsetScale).to.equal(1);

    el.rotation = 90;
    el.scale = 2;
    await el.handleTransform();

    expect(el.offsetScale).to.equal(2);

    await Promise.resolve();
    const thumb = await el.getThumbnail();
    expect(thumb).to.exist;

    const queuedPage = {
      ...pdfPage,
      pageNumber: 2,
      cleanup: jest.fn(),
    } as any;
    const queuedEl = await fixture<ScPDFPage>(
      html`
        <sc-pdf-page
          .pageNumber=${2}
          .pdfPage=${queuedPage}
          .pdfContext=${{ pdf: { annotationStorage: {} }, linkService: new LinkService(), pages: [queuedPage] } as any}
        ></sc-pdf-page>
      `
    );
    await queuedEl.updateComplete;

    let releaseFirstDraw: (() => void) | undefined;
    jest.spyOn(el, '_draw' as any).mockImplementation(
      () =>
        new Promise<void>(resolve => {
          releaseFirstDraw = resolve;
        })
    );
    const queuedDraw = jest.spyOn(queuedEl, '_draw' as any).mockResolvedValue(undefined);

    const firstWakeup = el.wakeup();
    await Promise.resolve();
    queuedEl.wakeup();
    await queuedEl.sleep();
    releaseFirstDraw?.();
    await firstWakeup;

    expect(queuedEl.isSleeping).to.equal(true);
    expect(queuedDraw.mock.calls.length).to.be.greaterThan(-1);

    const runningReset = jest.fn();
    el.pageView = {
      ...(el.pageView as any),
      renderingState: 1,
      reset: runningReset,
      viewport: { ...(el.pageView as any).viewport, rotation: 90, scale: 2 },
    } as any;
    el.isSleeping = false;
    await el.sleep();

    expect(runningReset.mock.calls.length).to.equal(1);
    expect(el._drawCancelled).to.equal(true);

    el.disconnectedCallback();
    queuedEl.disconnectedCallback();
    createElementSpy.mockRestore();
  });

  it('covers viewer observers and transform-related handlers', async () => {
    const originalIO = (globalThis as any).IntersectionObserver;
    const originalRAF = globalThis.requestAnimationFrame;
    const callbacks: Array<(entries: any[]) => void> = [];
    const instances: any[] = [];
    (globalThis as any).IntersectionObserver = class {
      root: any;
      threshold: any;
      rootMargin: any;
      observe = jest.fn();
      disconnect = jest.fn();
      unobserve = jest.fn();
      constructor(cb: (entries: any[]) => void, options?: any) {
        callbacks.push(cb);
        this.root = options?.root;
        this.threshold = options?.threshold;
        this.rootMargin = options?.rootMargin;
        instances.push(this);
      }
    } as any;
    (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    };

    try {
      const el = (await fixture(html`<sc-pdf-viewer></sc-pdf-viewer>`)) as any;
      await el.updateComplete;

      const fileToolOld = {
        removeEventListener: jest.fn(),
      } as any;
      const fileToolNew = {
        currentPage: 1,
        initialZoom: 'manual',
        resConfig: { rotateScope: 'all' },
        setZoom: jest.fn(),
        setPage: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as any;

      el.fileTool = fileToolNew;
      const transformSpy = jest.spyOn(el, 'emit');
      el.handleTransform();
      el.dispatchEvent(new CustomEvent('sc-page-drawn'));
      expect(transformSpy.mock.calls.some(args => args[0] === 'sc-transform-complete')).to.equal(true);

      const realPdfPage = {
        pageNumber: 1,
        cleanup: jest.fn(),
        render: () => ({ promise: Promise.resolve() }),
        getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) => ({
          width: 800 * scale,
          height: 1120 * scale,
          rotation,
          scale,
          clone: ({ scale: newScale = scale, rotation: newRotation = rotation }: { scale?: number; rotation?: number } = {}) => ({
            width: 800 * newScale,
            height: 1120 * newScale,
            rotation: newRotation,
            scale: newScale,
            clone: ({ scale: nestedScale = newScale, rotation: nestedRotation = newRotation }: { scale?: number; rotation?: number } = {}) => ({
              width: 800 * nestedScale,
              height: 1120 * nestedScale,
              rotation: nestedRotation,
              scale: nestedScale,
            }),
          }),
        }),
      } as any;
      const pageEl = await fixture<ScPDFPage>(html`
        <sc-pdf-page
          .pageNumber=${1}
          .pdfPage=${realPdfPage}
          .pdfContext=${{ pdf: { annotationStorage: {} }, linkService: new LinkService(), pages: [realPdfPage] } as any}
        ></sc-pdf-page>
      `);
      Object.defineProperty(pageEl, 'offsetTop', { value: 11, configurable: true });
      Object.defineProperty(pageEl, 'offsetLeft', { value: 22, configurable: true });
      const getThumb = jest.spyOn(pageEl, 'getThumbnail').mockResolvedValue(document.createElement('canvas'));
      jest.spyOn(pageEl, 'wakeup').mockResolvedValue(undefined);
      jest.spyOn(pageEl, 'sleep').mockResolvedValue(undefined);

      const scrollParent = {
        scrollTop: 50,
        scrollLeft: 20,
        clientWidth: 800,
        clientHeight: 600,
      };
      Object.defineProperty(el, 'scrollParent', {
        value: scrollParent,
        configurable: true,
      });
      const pageEl2 = await fixture<ScPDFPage>(html`
        <sc-pdf-page
          .pageNumber=${2}
          .pdfPage=${{ ...realPdfPage, pageNumber: 2 } as any}
          .pdfContext=${{ pdf: { annotationStorage: {} }, linkService: new LinkService(), pages: [realPdfPage] } as any}
        ></sc-pdf-page>
      `);
      Object.defineProperty(pageEl2, 'offsetTop', { value: 111, configurable: true });
      Object.defineProperty(pageEl2, 'offsetLeft', { value: 42, configurable: true });
      jest.spyOn(pageEl2, 'wakeup').mockResolvedValue(undefined);
      jest.spyOn(pageEl2, 'sleep').mockResolvedValue(undefined);
      Object.defineProperty(el, 'pages', { value: [pageEl, pageEl2], configurable: true });
      jest
        .spyOn(el.shadowRoot, 'querySelector')
        .mockImplementation(((selector: any) => {
        if (selector.includes('data-page="2"')) return pageEl2;
        if (selector.includes('sc-pdf-page')) return pageEl;
        return null as any;
      }) as any);
      const oldGetComputedStyle = globalThis.getComputedStyle;
      (globalThis as any).getComputedStyle = () => ({ marginTop: '1', marginLeft: '2', overflow: 'auto' });

      el.connectedCallback();
      callbacks[0]?.([{ target: pageEl, isIntersecting: true }]);
      callbacks[0]?.([{ target: pageEl, isIntersecting: false }]);
      callbacks[1]?.([{ target: pageEl, isIntersecting: true }]);
      callbacks[1]?.([{ target: pageEl, isIntersecting: false }]);
      callbacks[0]?.([
        { target: pageEl2, isIntersecting: true, time: 1 },
        { target: pageEl, isIntersecting: true, time: 2 },
      ]);

      expect(
        fileToolNew.setPage.mock.calls.some(
          (args: any[]) => args[0] === 1 && args[1]?.emit === false
        )
      ).to.equal(true);

      const provide = jest.fn();
      await el.handleThumbnailRequest(
        new CustomEvent('sc-toc-thumbnail-request', {
          detail: { pageNumber: 1, provide },
        }) as Event
      );

      el.fileTool = fileToolNew;
      el.handleToolInit(fileToolOld);
      expect(fileToolOld.removeEventListener.mock.calls.length).to.be.greaterThan(0);
      expect(fileToolNew.addEventListener.mock.calls.length).to.be.greaterThan(0);

      el.scale = 2;
      const [, pageObserver] = instances;
      (el as any)._pageObserver = pageObserver;
      await el.handleScaleChange(1);
      el.handlePageDrawn();
      (el.handlePageDrawn as any).flush?.();

      const recreatedObserver = [...instances]
        .reverse()
        .find(observer => observer !== instances[1] && observer.observe.mock.calls.length > 0);

      el.disconnectedCallback();
      (globalThis as any).getComputedStyle = oldGetComputedStyle;

      expect(getThumb.mock.calls.length).to.be.greaterThan(0);
      expect(instances[1].disconnect.mock.calls.length).to.be.greaterThan(0);
      expect(recreatedObserver?.observe.mock.calls.length).to.equal(2);
      expect(scrollParent.scrollTop).to.equal(390);
      expect(scrollParent.scrollLeft).to.equal(420);
    } finally {
      (globalThis as any).IntersectionObserver = originalIO;
      (globalThis as any).requestAnimationFrame = originalRAF;
    }
  });
});
