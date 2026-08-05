import { LitElement, PropertyValues, html, nothing, render } from 'lit';
import * as pdfJS from 'pdfjs-dist';
import * as pdfjsViewer from 'pdfjs-dist/legacy/web/pdf_viewer.mjs';
import type {
  RenderParameters,
  TextItem,
  TextMarkedContent,
} from 'pdfjs-dist/types/src/display/api.js';

import type { AnnotationLayerParameters } from 'pdfjs-dist/types/src/display/annotation_layer.js';
import ScPDFPageStyle from './ScPDFPage.style.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { watch } from '../utils/watch.js';
import { styleMap } from 'lit/directives/style-map.js';
import { TPdfContext } from '../utils/pdf.type.js';
import type { ScScriber } from './ScScriber.js';
import { ETools } from './ScScriber.toolbar.util.js';
import ScElement from '../utils/ScElement.js';
import { debounce } from '../utils/debounce.js';


const { RenderingStates } = pdfjsViewer;

export type TRenderCompleteArgs = {
  pageNumber: number;
  thumbnailUrl?: string;
};

@customElement('sc-pdf-page')
export class ScPDFPage extends ScElement {
  static debug = false;
  static styles = [ScPDFPageStyle];
  @property({ type: Number, reflect: true }) pageNumber: number;
  @property({ type: Number }) containerWidth: number;
  @property({ type: Object }) pdfContext: TPdfContext;
  @property({ type: Object }) renderComplete: (
    args: TRenderCompleteArgs
  ) => void = () => {};
  @property({ type: Number, reflect: true }) rotation = 0;
  @property({ type: Number, reflect: true }) scale = 1;
  @property({ type: Object }) pdfPage: pdfJS.PDFPageProxy;

  @query('.container') container: HTMLDivElement;
  @query('.text-layer') textLayer: HTMLDivElement;
  @query('.annotation-layer') annotationLayer: HTMLDivElement;
  @query('sc-scriber') scriber: ScScriber;

  previousPdf?: pdfJS.PDFDocumentProxy;
  scaleRatio = 1;
  startTime = 0;

  @state() pageView?: pdfjsViewer.PDFPageView;
  isSleeping = true;
  width = 0;
  height = 0;
  
  _xdirty = false;
  _drawStart = 0;
  _drawCancelled = false;

  /** The actual rendered scale, including pixel conversions */
  get offsetScale() {
    return this.pageView?.viewport.scale ?? this.scale;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.pdfPage.cleanup();
  }

  private _initPageView = async () => {
    if (this.pageView) return;
    const defaultViewport = this.pdfPage.getViewport({ scale: 1 });

    const pageView = (this.pageView = new pdfjsViewer.PDFPageView({
      container: this.container,
      id: this.pageNumber,
      scale: defaultViewport.scale,
      defaultViewport,
      eventBus: new pdfjsViewer.EventBus(),
      layerProperties: {
        linkService: this.pdfContext.linkService,
        annotationStorage: this.pdfContext.pdf.annotationStorage,
      },
      enableDetailCanvas: true,
      enableOptimizedPartialRendering: true,
    }));
    if (pageView.pdfPage !== this.pdfPage) {
      this.pdfPage.cleanup();
      pageView.setPdfPage(this.pdfPage);
    }
    const { scale, rotation } = this;
    pageView.update({ scale, rotation });

    this.resize();
    await queueTask(this, this._draw);
    this.scriber.active = true;
  };
  private _draw = async () => {
    ScPDFPage.debug && (this._drawStart = performance.now());
    if (this.pageView?.renderingState === RenderingStates.INITIAL) {
      Object.assign(this.pageView?.draw, { pageNumber: this.pageNumber });
      await this.pageView?.draw();
    }
    if (this.pageView?.renderingState !== RenderingStates.FINISHED) {
      ScPDFPage.debug && console.log('cancelled page ', this.pageNumber, `${performance.now() - this._drawStart  }ms`);
      return;
    }
    ScPDFPage.debug && console.log('done page ', this.pageNumber, `${performance.now() - this._drawStart  }ms`);
    if (this.scriber.dirty) {
      this.scriber.isSleeping = false;
      this.scriber.sync();
    }
    this.emit('sc-page-drawn', {
      detail: { pageNumber: this.pageNumber },
    });
  };

  async wakeup() {
    ScPDFPage.debug && console.log('wakeup page', this.pageNumber);
    if (!this.isSleeping) return;
    this.isSleeping = false;
    // this.container.style.visibility = 'visible';

    if (!this.pageView) {
      await this._initPageView();
    } else {
      await this._transform();
    }
  }
  async sleep() {
    ScPDFPage.debug &&
      console.log('sleep page ', this.pageNumber, this.isSleeping);
    if (this.isSleeping) return;
    this.isSleeping = true;
    this.scriber.isSleeping = false;
    // this.container.style.visibility = 'hidden';

    if (this.pageView?.renderingState === RenderingStates.FINISHED) {
      ScPDFPage.debug && this._drawStart && 
        console.log('done page', this.pageNumber, `${performance.now() - this._drawStart}ms`);
      return;
    }
    if (dequeueTask(this)) {
      ScPDFPage.debug && console.log('unstack page', this.pageNumber);
      return;
    }
    if (this.pageView?.renderingState === RenderingStates.RUNNING) {
      this.pageView.reset({
        keepAnnotationLayer: true,
        keepTextLayer: true,
        keepCanvasWrapper: true,
        preserveDetailViewState: true,
      });
      this._drawCancelled = true;
      ScPDFPage.debug && this._drawStart && 
        console.log('cancel page', this.pageNumber, `${performance.now() - this._drawStart}ms`);
    } else {
      ScPDFPage.debug && console.log('waiting page', this.pageNumber, this.pageView?.renderingState);
    }
  }

  async getThumbnail() {
    let viewport = this.pdfPage.getViewport({ scale: 1, rotation: this.rotation });
    // fit to 91x128 with aspect ratio.
    viewport = viewport.clone({
      scale: Math.min(91 / viewport.width, 128 / viewport.height),
    });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await this.pdfPage.render({
      canvas,
      viewport,
      intent: 'print',
      annotationMode: pdfJS.AnnotationMode.DISABLE,
    }).promise;
    return canvas;
  }

  // @ts-ignore
  @watch('scale')
  handleScaleChange(oldValue: number) {
    this._xdirty ||= this.scale / oldValue > 1.25;
  }
  // @ts-ignore
  @watch('rotation')
  handleRotationChange(oldValue: number) {
    this._xdirty ||= this.rotation !== oldValue;
  }
  @watch(['scale', 'rotation'])
  async handleTransform() {
    const { scale, rotation } = this;
    this.pageView?.update({ scale, rotation });
    
    this.hasUpdated || (await this.updateComplete);
    this.resize();

    !this.hasUpdated && (await this.updateComplete);
    await this._transform();
  }
  private async _transform() {
    // only redraw when scale is significantly greater or forced
    if (this._xdirty && this.pageView && !this.isSleeping) {
      const { scale, rotation } = this;
      this.pageView.update({ scale, rotation });
      await queueTask(this, this._draw);
      this._xdirty = false;
    }
  }

  resize() {
    const baseViewport = (
      this.pageView?.viewport ?? this.pdfPage.getViewport()
    ).clone({ scale: 1, rotation: 0 });
    const viewport = baseViewport.clone({
      scale: this.scale * pdfJS.PixelsPerInch.PDF_TO_CSS_UNITS,
      rotation: this.rotation,
    });
    
    this.width = Math.floor(viewport.width);
    this.height = Math.floor(viewport.height);
    this.container.style.width = `${this.width}px`;
    this.container.style.height = `${this.height}px`;

    if (this.scriber) {
      this.scriber.scale = viewport.scale;
      this.scriber.rotation = viewport.rotation;
      this.scriber.resize(
        baseViewport.width * viewport.scale,
        baseViewport.height * viewport.scale
      );
    }

    if (this.pageView) {
      this.pageView.textLayer?.show();
      if (this.pageView.annotationLayer?.div)
        this.pageView.annotationLayer.div.hidden = false;
    }
  }

  protected firstUpdated(): void {
    this.resize();
  }

  renderScriber() {
    return html`
      <div
        class="scriber-layer highlights"
        ${ref(async el => {
          await this.updateComplete;
          return (
            el &&
            this.scriber.addSvgLayer(ETools.highlightRect, el as HTMLElement)
          );
        })}
      ></div>
      <sc-scriber ?isSleeping=${this.isSleeping}></sc-scriber>
    `;
  }

  render() {
    return html`
      <div
        class="container pdfViewer"
        style=${styleMap({
          // visibility: this.isSleeping ? 'hidden' : 'visible',
          width: `${this.width}px`,
          height: `${this.height}px`,
        })}
      >
        ${this.renderScriber()}
      </div>
    `;
  }
}
const isBrowser: boolean = typeof window !== 'undefined';
function getDevicePixelRatio(): number {
  return (isBrowser && window.devicePixelRatio) || 1;
}


const queue = <ScPDFPage[]>[];
const fnMap = new WeakMap<ScPDFPage,(() => Promise<any>)>();

function queueTask<T>(page: ScPDFPage, fn: () => Promise<T>): Promise<T> {
  // already queued
  if (queue.includes(page)) return Promise.resolve<T>(undefined as any);
  // has other queued task
  if (queue.length > 0) {
    const p = new Promise<T>(function (res, rej) {
      fnMap.set(page, () => fn().then(res).catch(rej));
      queue.push(page);
    });
    return p;
  }
  
  const next = () => {
    requestIdleCallback(() => {
      const p = queue.shift();
      p && fnMap.delete(p);
      if (queue.length > 0) {
        fnMap.get(queue[0])?.().finally(() => next());
      }
    }, { timeout: 100 });
  };
  queue.push(page);
  return fn().finally(() => next());
}
function dequeueTask(page: ScPDFPage): boolean {
  const index = queue.indexOf(page);
  // index=0 means the task is running, cannot remove
  if (index > 0) {
    queue.splice(index, 1);
    return true;
  }
  return false;
}