import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../elements/sc-doc-viewer.js';
import '../elements/sc-pdf-viewer.js';
import { ScDocViewer } from '../src/components/ScDocViewer.js';
import { ScFileTool } from '../src/components/ScFileTool.js';
import { ScPDFViewer } from '../src/components/ScPDFViewer.js';
import { ScPDFPage } from '../src/components/ScPDFPage.js';
import * as path from 'path';
import * as fs from 'fs';

import { extractMsg } from '../src/utils/msg/utils';
import { MessageHandler } from '../src/utils/msg/MessageHandler.js';
import LinkService from '../src/utils/link.js';
import { docxTypes } from '../src/utils/filetypes.js';
const datasource = [
  {
    history: [
      {
        ctx: {},
        type: 'Pen',
        data: {
          color: '#000000',
          size: 1,
          points: [
            {
              x: 516.5,
              y: 209,
            },
          ],
        },
        id: 'mjavsv4m-7t48zdg231q',
      },
      {
        ctx: {},
        type: 'Text',
        data: {
          color: '#000000',
          size: 16,
          content: 'sub title',
          x: 758.5,
          y: 178,
        },
        id: 'mjavswj5-wofwkehb83k',
      },
    ],
    textHistory: [
      {
        ctx: {},
        x: 758.5,
        y: 178,
        content: 'sub title',
        color: '#000000',
        size: 16,
        width: 59.391937255859375,
        height: 16,
        id: 'mjavswj5-wofwkehb83k',
      },
    ],
  },
];

function getFileType(filePath: string) {
  let type = '';
  switch (path.extname(filePath).slice(1)) {
    case 'docx':
      type =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      break;
    case 'msg':
      type = 'msg';
      break;
    case 'pdf':
      type = 'application/pdf';
      break;
    case 'png':
      type = 'image/png';
      break;
    case 'pptx':
      type =
        'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      break;
    case 'xlsx':
      type =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
  }
  return type;
}

function getFile(filePath: string) {
  const targetPath = path.resolve(__dirname, filePath);
  const docx = fs.readFileSync(targetPath);
  const blob = new Blob([docx], { type: getFileType(targetPath) });

  return new File([blob], path.basename(targetPath), {
    type: getFileType(targetPath),
  });
}
jest.mock('exceljs', () => {
  class MockCell {
    value: any;
    font: any;
    alignment: any;
    fill: any;
    constructor(value: any) {
      this.value = value;
      this.font = undefined;
      this.alignment = undefined;
      this.fill = undefined;
    }
  }
  class MockWorksheet {
    name: string;
    rowCount = 1;
    actualColumnCount = 1;
    _rows = [1];
    _merges = undefined;
    getCell(r: number, c: number) {
      return new MockCell(`R${r}C${c}`);
    }
  }
  class MockWorkbook {
    worksheets: any[];
    constructor() {
      this.worksheets = [new MockWorksheet(), new MockWorksheet()];
      this.worksheets[0].name = 'Sheet1';
      this.worksheets[1].name = 'Sheet2';
    }
    async xlsx() { return this; }
    async load() { return this; }
  }
  class ExcelJS {
    static Workbook = MockWorkbook;
    worksheets: any[];
    constructor() {
      this.worksheets = [new MockWorksheet(), new MockWorksheet()];
      this.worksheets[0].name = 'Sheet1';
      this.worksheets[1].name = 'Sheet2';
    }
    async xlsx() { return this; }
    async load() { return this; }
  }
  return {
    __esModule: true,
    default: ExcelJS,
    Workbook: MockWorkbook,
  };
});

jest.mock('../src/utils/worker.ts', () => {
  return {
    setWorker() {},
  };
});

jest.mock('highlightjs-line-numbers.js', () => {
  return {
    __esModule: true,
    default() {},
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
    render: () => ({
      promise: Promise.resolve(),
    }),
    getAnnotations: async () => [],
    getTextContent: async () => ({
      items: [],
      styles: {},
    }),
    streamTextContent: () => ({
      getAll: () => Promise.resolve([]),
    }),
    getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) =>
      makeViewport({ scale, rotation }),
  });

  const createMockPdfDoc = (numPages = 2) => ({
    numPages,
    annotationStorage: {},
    getPage: async (pageNumber: number) => createMockPdfPage(pageNumber),
  });

  const result = {
    getDocument: () => {},
    AnnotationMode: { ENABLE: 1 },
    PixelsPerInch: { PDF_TO_CSS_UNITS: 1 },
    TextLayer: class {
      render() {
        return Promise.resolve();
      }
    },
    AnnotationLayer: class {
      render() {
        return Promise.resolve();
      }
    },
  };
  result.getDocument = () => {
    return {
      promise: Promise.resolve(createMockPdfDoc()),
    };
  };
  return result;
});

jest.mock('pdfjs-dist/legacy/web/pdf_viewer.mjs', () => {
  class EventBus {}
  class PDFPageView {
    container: HTMLElement;
    pdfPage: any;
    viewport: { width: number; height: number };
    scale: number;
    rotation = 0;
    renderingState: any;

    constructor(options: any) {
      this.container = options.container;
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

if (!(globalThis as any).IntersectionObserver) {
  class MockIntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}


describe('test doc viewer', () => {
  it('renders test component', async () => {
    const el = await fixture<ScDocViewer>(
      html`<sc-doc-viewer style="width:100px;height:100px"></sc-doc-viewer>`
    );

    await el.updateComplete;

    const msg = getFile('./assets/msg.msg');
    const pageChangeSpy = jest.fn();
    el.addEventListener('sc-page-change', pageChangeSpy as EventListener);
    el.initBaseLayout();
    [el.activeFileType] = docxTypes;
    await el.previewFile(el.file = getFile('./assets/docx.docx'));

    jest.spyOn(await el.viewerBox, 'getBoundingClientRect').mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    } as DOMRect);
    jest.spyOn(el.viewerRoot, 'getBoundingClientRect').mockReturnValue({
      width: 400,
      height: 300,
      top: 0,
      left: 0,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    } as DOMRect);
    el.previousRenderFile = null;
    await el.afterRender();

    // Exercise the new docxTypes branch in applyZoom (lines 895-899)
    await el.applyZoom(110);
    el.initBaseLayout();
    await el.previewFile(msg);
    el.initBaseLayout();
    await el.previewFile(getFile('./assets/pdf.pdf'));
    el.fileTool.totalPage = 7;
    el.getScribbleDataSource();
    const renderedPdfViewer = el.shadowRoot?.querySelector('sc-pdf-viewer');
    renderedPdfViewer?.getPageInfo();
    renderedPdfViewer?.dispatchEvent(
      new CustomEvent('sc-page-visible', {
        detail: { pageNumber: 2 },
        bubbles: true,
        composed: true,
      })
    );
    el.updateDimensionOfPdf();
    el.handleScriberToolbarChange(
      new CustomEvent('', {
        detail: {
          type: 'tool-change',
          info: {
            value: '',
          },
        },
      })
    );
    el.handleScriberToolbarChange(
      new CustomEvent('', {
        detail: {
          type: 'tool-style-change',
          info: {
            value: '',
          },
        },
      })
    );
    // Mock getPageInfo to return a page entry so that lines 816-819 (if pages[index] body) are exercised.
    // The scriber mock must be fully functional because setScribbleDataSource (started earlier without
    // await) may also call getPageInfo after this spy is installed.
    const mockCanvas = document.createElement('canvas');
    const mockCtx = mockCanvas.getContext('2d') as CanvasRenderingContext2D;
    const mockScriber = {
      getCtxFor: () => mockCtx,
      ctx: mockCtx,
      history: [],
      textHistory: [],
      refreshCanvas: jest.fn(),
      updateScaleDimension: jest.fn(),
      setTool: jest.fn(),
      setToolStyle: jest.fn(),
    } as any;
    const pdfViewerEl = el.shadowRoot?.querySelector('sc-pdf-viewer') as ScPDFViewer;
    if (pdfViewerEl) {
      jest.spyOn(pdfViewerEl, 'getPageInfo').mockReturnValue([
        { page: { offsetScale: 1.5, offsetTop: 50 } as any, scriber: mockScriber },
      ]);
    }
    await el.setScribbleDataSource(datasource as any);
    await el.handleScriberToolbarChange(
      new CustomEvent('', {
        detail: {
          type: 'jump-highlight',
          info: {
            value: { page: 0, x: 100, y: 100 },
          },
        },
      })
    );
    el.initBaseLayout();
    await el.previewFile(getFile('./assets/pptx.pptx'));
    el.initBaseLayout();
    await el.previewFile(getFile('./assets/png.png'));

    expect(
      pageChangeSpy.mock.calls.some(
        (args: any[]) =>
          args[0].detail.page === 2 && args[0].detail.pageSize === 7
      )
    ).to.equal(true);

    el.handleFileToolStateChange(
      new CustomEvent('', {
        detail: {
          name: 'rotation',
          value: 80,
        },
      })
    );
    el.handleFileToolStateChange(
      new CustomEvent('', {
        detail: {
          name: 'zoomRatio',
          value: 110,
        },
      })
    );
    el.applyRotation(90);
    el.applyZoom(110);
    el.toggleFullscreen();
    el.toggleFullscreen();
    el.handleFullscreen();
    el.file = msg;
    el.handleDownload();
    el.getScribbleDataSource();
    el.handleHistoryChange();
    const wheelEvent = {
      ctrlKey: true,
      preventDefault() {},
      deltaY: -1,
    } as any as WheelEvent;
    el.handleWheel(wheelEvent);
    const wheelEvent2 = {
      ctrlKey: true,
      preventDefault() {},
      deltaY: 1,
    } as any as WheelEvent;
    el.handleWheel(wheelEvent2);
    el.initBaseLayout();
    el.renderFallback(el.viewerContainer, '');
    // await el.previewFile(getFile('./assets/xlsx.xlsx'));

    el.handleFileChange();
    el.handleMouseEnter();
    el.handleMouseLeaev();

    const tool = el.shadowRoot?.querySelector('sc-file-tool') as ScFileTool;
    const setPageSpy = jest.spyOn(tool, 'setPage');
    el.file = getFile('./assets/pdf.pdf');
    el.activeFileType = 'application/pdf';
    el.pageNumber = 2;
    el.loadingFile = true;
    el.previousRenderFile = null;
    await el.handlePageChangeByProp();
    el.dispatchEvent(new CustomEvent('sc-render-complete'));
    expect(setPageSpy.mock.calls.some(args => args[0] === 2)).to.equal(false);

    setPageSpy.mockClear();
    el.loadingFile = false;
    el.previousRenderFile = el.file;
    await el.handlePageChangeByProp();
    expect(setPageSpy.mock.calls.some(args => args[0] === 2)).to.equal(true);

    el.activeFileType = 'application/pdf';
    el.loadingFile = false;
    const pdfViewer = { rotation: 0 };
    Object.defineProperty(el, 'pdfViewer', {
      value: Promise.resolve(pdfViewer),
      configurable: true,
    });
    await el.applyRotation(90);

    expect(pdfViewer.rotation).to.equal(90);
    expect(el.loadingFile).to.equal(false);

    el.firstUpdated();

    const msgInfo = extractMsg(await msg.arrayBuffer());
    const messageHandler = new MessageHandler();

    const message = messageHandler.addMessage(msgInfo, 'file.name');

    const content = el.showMessage(message);

    expect(typeof content).to.equal('string');
  });
  it('renders pdf viewer', async () => {
    const el = await fixture<ScPDFViewer>(
      html`<sc-pdf-viewer .containerWidth=${1000}></sc-pdf-viewer>`
    );

    await el.updateComplete;

    const makeViewport = ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = {}) => ({
      width: 800 * scale,
      height: 1120 * scale,
      rotation,
      scale,
      clone: ({ scale: newScale = scale, rotation: newRotation = rotation }: { scale?: number; rotation?: number } = {}) =>
        makeViewport({ scale: newScale, rotation: newRotation }),
    });
    const mkPage = (pageNumber: number) => ({
      pageNumber,
      cleanup: jest.fn(),
      render: () => ({ promise: Promise.resolve() }),
      getViewport: ({ scale = 1, rotation = 0 }: { scale?: number; rotation?: number } = { scale: 1, rotation: 0 }) =>
        makeViewport({ scale, rotation }),
    });
    el.pdfContext = {
      pages: [mkPage(1), mkPage(2)],
      pdf: { annotationStorage: {} } as any,
      linkService: new LinkService(),
    } as any;
    await el.updateComplete;

    const fileTool = {
      currentPage: 2,
      initialZoom: 'auto',
      resConfig: { rotateScope: 'all' },
      setZoom: jest.fn(),
      setPage: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any;
    Object.defineProperty(el, 'clientWidth', { value: 500, configurable: true });
    (el as any)._scrollParent = { clientWidth: 1008, scrollTop: 0, scrollLeft: 0 };
    el.fileTool = fileTool;
    el.handleToolInit();

    const scrollSpy = jest.spyOn(el, 'scrollToPage').mockImplementation(() => {});
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'currentPage', value: 3 },
      }) as Event
    );
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'zoomRatio', value: 125 },
      }) as Event
    );
    el.handleToolStateChange(
      new CustomEvent('sc-file-tool-state-change', {
        detail: { name: 'rotation', value: 90 },
      }) as Event
    );
    el.handlePageDrawn.flush();

    expect(el.viewmode).to.equal('all');
    expect(el.pdfContext?.pages.length).to.equal(2);
    expect(fileTool.setZoom.mock.calls.length).to.be.greaterThan(0);
    expect(scrollSpy.mock.calls.some(args => args[0] === 3)).to.equal(true);
    expect(el.scale).to.equal(1.25);
    expect(el.rotation).to.equal(90);
    expect(el.getPageInfo().length).to.equal(2);
  });
  it('renders link service', async () => {
    const linkService = new LinkService();

    linkService.setViewer({
      scrollPageIntoView() {},
    } as any);
    linkService.setExternalLinkRel('noreferrer');
    linkService.setHistory();
    linkService.pagesCount;
    linkService.page = 1;
    linkService.rotation = 1;
    linkService.rotation;
    linkService.goToDestination('');
    linkService.goToDestination([1]);
    linkService.goToDestination(Promise.resolve([1]));
    linkService.goToDestination(Promise.resolve([]));
    linkService.navigateTo([1]);
    linkService.goToXY();
    linkService.goToPage(1);
    linkService.addLinkAttributes(document.createElement('a'), '', true);
    linkService.getDestinationHash();
    linkService.getAnchorUrl();
    linkService.setHash();
    linkService.executeNamedAction();
    linkService.cachePageRef();
    linkService.isPageVisible();
    linkService.isPageCached();
    linkService.executeSetOCGState();

    expect(linkService.page).to.equal(1);
  });
  it('renders pdf page', async () => {
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
      pdf: new PDFDocumentProxy(
        { numPages: 1 },
        {
          getPage() {
            return pdfPage;
          },
          annotationStorage: {},
          canvasFactory: {},
          filterFactory: {},
        }
      ),
      linkService: new LinkService(),
      pages: [pdfPage],
    } as import('../src/utils/pdf.type').TPdfContext;

    const el = await fixture<ScPDFPage>(
      html`
        <sc-pdf-page
          .pdfContext=${pdfContext}
          .pageNumber=${1}
          .pdfPage=${pdfPage}
        ></sc-pdf-page>
      `
    );

    await el.updateComplete;

    const emitSpy = jest.spyOn(el, 'emit');
    await el.wakeup();
    el.handleTransform();
    await el.sleep();
    el.resize();
    el.disconnectedCallback();

    expect(el.pageNumber).to.equal(1);
    expect(el.pageView).to.exist;
    expect(el.pageView?.renderingState).to.equal(3);
    expect(el.width).to.equal(800);
    expect(el.height).to.equal(1120);
    expect(el.isSleeping).to.equal(true);
    expect(pdfPage.cleanup.mock.calls.length).to.be.greaterThan(0);
  });
});

class PDFDocumentProxy {
  _pdfInfo;
  _transport;
  constructor(pdfInfo: any, transport: any) {
    this._pdfInfo = pdfInfo;
    this._transport = transport;
  }
  get annotationStorage() {
    return this._transport.annotationStorage;
  }
  get canvasFactory() {
    return this._transport.canvasFactory;
  }
  get filterFactory() {
    return this._transport.filterFactory;
  }
  get numPages() {
    return this._pdfInfo.numPages;
  }
  get fingerprints() {
    return this._pdfInfo.fingerprints;
  }
  get isPureXfa() {
    return true;
  }
  get allXfaHtml() {
    return this._transport._htmlForXfa;
  }
  getPage(pageNumber: any) {
    return this._transport.getPage(pageNumber);
  }
  getPageIndex(ref: any) {
    return this._transport.getPageIndex(ref);
  }
  getDestinations() {
    return this._transport.getDestinations();
  }
  getDestination(id: any) {
    return this._transport.getDestination(id);
  }
  getPageLabels() {
    return this._transport.getPageLabels();
  }
  getPageLayout() {
    return this._transport.getPageLayout();
  }
  getPageMode() {
    return this._transport.getPageMode();
  }
  getViewerPreferences() {
    return this._transport.getViewerPreferences();
  }
  getOpenAction() {
    return this._transport.getOpenAction();
  }
  getAttachments() {
    return this._transport.getAttachments();
  }
  getAnnotationsByType(types: any, pageIndexesToSkip: any) {
    return this._transport.getAnnotationsByType(types, pageIndexesToSkip);
  }
  getJSActions() {
    return this._transport.getDocJSActions();
  }
  getOutline() {
    return this._transport.getOutline();
  }
  getOptionalContentConfig({ intent = 'display' } = {}) {
    const { renderingIntent } = this._transport.getRenderingIntent(intent);
    return this._transport.getOptionalContentConfig(renderingIntent);
  }
  getPermissions() {
    return this._transport.getPermissions();
  }
  getMetadata() {
    return this._transport.getMetadata();
  }
  getMarkInfo() {
    return this._transport.getMarkInfo();
  }
  getData() {
    return this._transport.getData();
  }
  saveDocument() {
    return this._transport.saveDocument();
  }
  getDownloadInfo() {
    return this._transport.downloadInfoCapability.promise;
  }
  cleanup(keepLoadedFonts = false) {
    return this._transport.startCleanup(keepLoadedFonts || this.isPureXfa);
  }
  destroy() {
    return this.loadingTask.destroy();
  }
  cachedPageNumber(ref: any) {
    return this._transport.cachedPageNumber(ref);
  }
  get loadingParams() {
    return this._transport.loadingParams;
  }
  get loadingTask() {
    return this._transport.loadingTask;
  }
  getFieldObjects() {
    return this._transport.getFieldObjects();
  }
  hasJSActions() {
    return this._transport.hasJSActions();
  }
  getCalculationOrderIds() {
    return this._transport.getCalculationOrderIds();
  }
}
