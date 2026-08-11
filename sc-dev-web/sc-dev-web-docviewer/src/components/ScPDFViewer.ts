import { consume } from '@lit/context';
import { html, nothing } from 'lit';
import { property, queryAll, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { repeat } from 'lit/directives/repeat.js';
import * as pdfJS from 'pdfjs-dist';

import '../../elements/sc-pdf-viewer.js';
import ScElement from '../utils/ScElement.js';
import { findAncestor } from '../utils/ancestor.js';
import { debounce } from '../utils/debounce.js';
import LinkService from '../utils/link.js';
import { TPdfContext } from '../utils/pdf.type.js';
import { watch } from '../utils/watch.js';
import { setWorker } from '../utils/worker.js';
import { ScPDFPage } from './ScPDFPage.js';
import ScPDFViewerStyle from './ScPDFViewer.style.js';
import { fileToolContext, ScFileTool, ToolState } from './contexts/file-tool-context.js';

setWorker(pdfJS.GlobalWorkerOptions);
type TViewmode = 'single' | 'all';

const styleTag = document.createElement('style');
styleTag.type = 'text/css';
styleTag.innerHTML = `
  .hiddenCanvasElement {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    display: none;
  }
  `;

document.head.appendChild(styleTag);

const linkService = new LinkService();
export class ScPDFViewer extends ScElement {
  static styles = [ScPDFViewerStyle];

  @property({ type: Object }) file: File;
  @property({ type: Number }) containerWidth = 0;
  @property({ type: Number }) rotation = 0;
  @property({ type: Number }) scale = 1;
  @property({ type: Object }) renderCompleteCb: (
    pageInfo: Map<number, string | undefined>
  ) => void = () => {};
  @state() pdfContext?: TPdfContext;
  @state() viewmode: TViewmode = 'all';

  @consume({ context: fileToolContext, subscribe: true })
  @state()
  fileTool?: ScFileTool;

  @queryAll('sc-pdf-page') pages: NodeListOf<ScPDFPage>;

  _lastFile: File | null = null;
  _renderObserver: IntersectionObserver;
  _pageObserver: IntersectionObserver;
  _scrollParent: Element | null = null;
  _pagesInView: Set<number> = new Set();

  get scrollParent() {
    if (this._scrollParent) return this._scrollParent;
    this._scrollParent = findAncestor(this, el => {
      const { overflow } = getComputedStyle(el);
      return overflow.includes('auto') || overflow.includes('scroll');
    });
    return this._scrollParent;
  }

  @watch(['file'])
  handleFileChange() {
    if (this._lastFile === this.file) return;
    this._pagesInView.clear();
    this._lastFile = this.file;
    this._loadPdf();
  }
  async _loadPdf() {
    this.pdfContext = undefined;

    const arrayBuffer = await this.file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const loadingTask = pdfJS.getDocument({ data: uint8Array });

    const pdfDocProxy = await loadingTask.promise;
    linkService.setDocument(pdfDocProxy);
    linkService.setExternalLinkTarget('_blank');
    linkService.setExternalLinkRel('noopener noreferrer');

    const pages = <pdfJS.PDFPageProxy[]>[];

    await Promise.all(
      Array.from({ length: pdfDocProxy.numPages }, async (_, i) => {
        const pageNum = i + 1;
        pages[i] = await pdfDocProxy.getPage(pageNum);
      })
    );

    this.pdfContext = {
      pdf: pdfDocProxy,
      linkService,
      pages,
    };
    this._renderObserver.disconnect();

    await this.updateComplete;

    this.emit('sc-pdf-loaded', {
      detail: {
        pageCount: pdfDocProxy.numPages,
        pdfContext: this.pdfContext,
      },
      bubbles: true,
      composed: true,
    });
    this.pages.forEach(page => {
      this._renderObserver.observe(page);
      this._pageObserver.observe(page);
    });

    this._initialZoom();
    this.scrollToPage(this.fileTool?.currentPage ?? 1);
  }

  private _initialZoom() {
    if (!this.pdfContext || !this.fileTool) return;
    if (this.fileTool.initialZoom === 'auto') {
      if (this.scrollParent) {
        const scale = (this.scrollParent.clientWidth - 10) / this.clientWidth;
        const zoom = Math.min(Math.floor(scale * 100) - 1, 100);
        this.fileTool.setZoom(zoom, { asDefault: 'width' });
        this.scale = zoom / 100;
      }
    }
  }

  @watch(['scale', 'rotation'])
  handleTransform() {
    this.addEventListener('sc-page-drawn', () => {
      this.emit('sc-transform-complete');
    }, { once: true });
  }
  // @ts-ignore // type not resolving properly with args
  @watch('scale')
  async handleScaleChange(oldValue: number) {
    // maintain relative page when scaling
    const { scrollParent } = this;
    const pageNum = this.fileTool?.currentPage ?? 1;
    const { top, left } = this._getPagePos(pageNum);
    const halfHeight = (scrollParent?.clientHeight ?? 0) / 2,
      halfWidth = (scrollParent?.clientWidth ?? 0) / 2;
    const dTop = (scrollParent?.scrollTop ?? 0) - top + halfHeight,
      dLeft = (scrollParent?.scrollLeft ?? 0) - left + halfWidth;

    await this.updateComplete;
    const lastPage =
      typeof this.pages?.item === 'function'
        ? this.pages.item(this.pages.length - 1)
        : this.pages?.[this.pages.length - 1];
    await lastPage?.updateComplete;
    requestAnimationFrame(() => {
      if (!scrollParent) return;

      const rootMargin = `-${Math.min(40, 40 * this.scale)}% 0px -${Math.min(40, 40 * this.scale)}% 0px`;
      if (this._pageObserver?.rootMargin !== rootMargin) {
        this._pageObserver?.disconnect();
        this._pageObserver = new IntersectionObserver(this.handlePageIntersection, {
          root: scrollParent,
          threshold: [0, 1],
          rootMargin,
        });
        this.pages.forEach(page => this._pageObserver.observe(page));
      }

      const { top, left } = this._getPagePos(pageNum),
        delta = this.scale / oldValue;
      scrollParent.scrollTop = top + (dTop * delta) - halfHeight;
      scrollParent.scrollLeft = left + (dLeft * delta) - halfWidth;
    });
  }

  // @ts-ignore // type not resolving properly with args
  @watch('fileTool')
  handleToolInit(old?: ScFileTool) {
    if (old) {
      old.removeEventListener(
        'sc-file-tool-state-change',
        this.handleToolStateChange
      );
      old.removeEventListener(
        'sc-toc-thumbnail-request',
        this.handleThumbnailRequest
      );
    }
    this._initialZoom();
    this.fileTool?.addEventListener(
      'sc-file-tool-state-change',
      this.handleToolStateChange
    );
    this.fileTool?.addEventListener(
      'sc-toc-thumbnail-request',
      this.handleThumbnailRequest
    );
  }

  handleToolStateChange = (e: Event) => {
    const { name, value } = (
      e as CustomEvent<{
        name: keyof ToolState;
        value: any;
      }>
    ).detail;
    switch (name) {
      case 'currentPage':
        this.scrollToPage(value);
        break;
      case 'zoomRatio':
        this.scale = value / 100;
        break;
      case 'rotation':
        if (this.fileTool?.resConfig.rotateScope === 'page') {
          const page = this.pages.item(this.fileTool.currentPage - 1);
          if (page)
            page.rotation =
              (page.rotation + (value - this.rotation) + 360) % 360;
        } else {
          this.pages.forEach(page => (page.rotation = value));
        }
        this.rotation = value;
        break;
      default:
        break;
    }
  };

  handleThumbnailRequest = async (e: Event) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    const { detail } = e as CustomEvent<{
      pageNumber: number;
      provide: (canvas: HTMLCanvasElement) => void;
    }>;

    await this.updateComplete;

    const page = this.shadowRoot?.querySelector<ScPDFPage>(
      `sc-pdf-page[data-page="${detail.pageNumber}"]`
    );
    page?.getThumbnail().then(detail.provide);
  };


  scrollToPage(value: number): void {
    const { scrollParent } = this;
    if (scrollParent) {
      const { top, left } = this._getPagePos(value);
      scrollParent.scrollTop = top;
      scrollParent.scrollLeft = left;
    }
  }
  private _getPagePos(pageNum: number): { top: number; left: number } {
    const el = this.shadowRoot?.querySelector<HTMLElement>(
      `sc-pdf-page[data-page="${pageNum}"]`
    );
    if (!el) return { top: 0, left: 0 };

    const { marginTop, marginLeft } = getComputedStyle(el);
    const top = el.offsetTop - parseInt(marginTop),
      left = el.offsetLeft - parseInt(marginLeft);
    return { top, left };
  }

  getPageInfo() {
    return Array.from(this.pages).map(pdfPage => {
      return {
        page: pdfPage,
        scriber: pdfPage.scriber,
      };
    });
  }

  handlePageDrawn = debounce(() => {
    this.emit('sc-page-drawn');
  }, 100);

  handlePageIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const page = entry.target;
      if (!(page instanceof ScPDFPage)) return;
      if (entry.isIntersecting) {
        this._pagesInView.add(page.pageNumber);
      } else {
        this._pagesInView.delete(page.pageNumber);
      }
    });
    if (this._pagesInView.size) {
      const pageNumber = Math.min(...this._pagesInView);
      this.fileTool?.setPage(pageNumber, { emit: false });
      this.emit('sc-page-visible', {
        detail: { pageNumber },
        bubbles: true,
        composed: true,
      });
    }
  };


  connectedCallback(): void {
    super.connectedCallback();

    this._renderObserver = new IntersectionObserver(
      entries => {
        const dedupedEntries = Array.from(
          entries
            .reduce((map, entry) => {
              const prev = map.get(entry.target);
              if (!prev || entry.time > prev.time)
                map.set(entry.target, entry);
              return map;
            }, new Map<Element, IntersectionObserverEntry>())
            .values()
        );

        const [mustWake, mustSleep] = dedupedEntries.reduce(
          (ar, e) => {
            const list = ar[e.isIntersecting ? 0 : 1];
            const page = e.target as ScPDFPage;
            // insert sort by page difference from current page
            const cur = this.fileTool?.currentPage ?? 1;
            const index = list.findIndex(
              p => Math.abs(p.pageNumber - cur) >= Math.abs(page.pageNumber - cur)
            );
            if (index === -1) list.push(page);
            else list.splice(index, 0, page);
            return ar;
          },
          <ScPDFPage[][]>[[], []]
        );
        mustSleep.forEach(el => el.sleep());
        mustWake.forEach(el => el.wakeup());
      },
      { root: this.scrollParent, threshold: 0, rootMargin: '80% 0px 150%' }
    );

    this._pageObserver = new IntersectionObserver(
      this.handlePageIntersection,
      {
        root: this.scrollParent,
        threshold: 0,
        rootMargin: '-40% 0px',
      }
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._renderObserver?.disconnect();
    this._pageObserver?.disconnect();
    this._scrollParent = null;

    this.fileTool?.removeEventListener(
      'sc-file-tool-state-change',
      this.handleToolStateChange
    );
    this.fileTool?.removeEventListener(
      'sc-toc-thumbnail-request',
      this.handleThumbnailRequest
    );
    this.fileTool = undefined;
  }

  render() {
    if (!this.pdfContext) return nothing;
    const { pages } = this.pdfContext;

    return guard([this.pdfContext, this.scale], () =>
      repeat(
        pages,
        (_, index) => `page${index + 1}`,
        page => html`
          <sc-pdf-page
            .pdfPage=${page}
            .pdfContext=${this.pdfContext}
            .pageNumber=${page.pageNumber}
            .scale=${this.scale}
            data-page=${page.pageNumber}
            @sc-page-drawn=${this.handlePageDrawn as EventListener}
          ></sc-pdf-page>
        `
      )
    );
  }
}
