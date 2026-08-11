import { ScaleRange } from 'chartjs-plugin-zoom';
import { css, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { debounce, throttle } from '../../shared/util.js';
import { ScRelationshipDiagram } from './ScRelationshipDiagram.js';
import { PanValue, ZoomValue } from './utils/types.js';

export class ScRelationshipMiniMap extends ScExtElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: stretch;
      gap: 0.125rem;
      padding: 0.375rem;
      background-color: var(--sc-color-white, #ffffff);
      border: 1px solid var(--sc-color-grey-150);
      border-radius: 0.375rem;
    }

    .container {
      position: relative;
      background-repeat: no-repeat no-repeat;
      background-size: cover;
      background-position: top right;
      overflow: hidden;
      transition: ease-in-out 250ms;
      transition-property: width, opacity;
      touch-action: none;

      .target {
        background-color: transparent;
        border: 1px solid black;
        position: absolute;
        box-sizing: border-box;
      }

      &.hide {
        width: 0 !important;
        opacity: 0;
      }
    }
    .controls {
      display: flex;
      flex-direction: column;
      justify-content: end;
      gap: 0.125rem;
      font-size: 0.75rem;
      text-align: center;
    }

    :host(.fullscreen) {
      .container {
        display: none;
      }
      .controls :not(.fullscreen-compat) {
        display: none;
      }
    }
  `;

  @query('.container') private _container: HTMLDivElement;
  @query('.target') private _target: HTMLDivElement;

  @state() $diagram?: ScRelationshipDiagram;
  @state() imgSrc?: string;
  @state() visible = true;

  #zoomValue = 1;
  _mouseOff?: { x: number; y: number; left: number; top: number; id?: number };
  
  handleChange = () => {
    this._container.style.backgroundImage =
      this.$diagram?.resolvedConfig.color ?? 'none';
    this.handleResize();
  };
  handleRedraw = () => {
    requestAnimationFrame(() => {
      const chart = this.$diagram?.chart;
      if (!chart) return;

      let bounds: Record<'x' | 'y', { min: number; max: number }> | undefined;
      if (!this.$diagram?.isZoomed(1)) {
        bounds = chart.getZoomedScaleBounds() as typeof bounds;
        this.$diagram?.resetZoom();
      }

      this._container.style.backgroundImage = `url(${chart.canvas.toDataURL()})`;
      if (bounds) {
        chart.zoomScale('x', bounds['x'], 'zoom');
        chart.zoomScale('y', bounds['y'], 'zoom');
      }
    });
  };
  handleThrottledRedraw = throttle(this.handleRedraw, this, 1000);
  handleDebouncedRedraw = debounce(this.handleRedraw, 1000);

  handleZoomChange = (e: Event) => {
    const el = this.shadowRoot?.querySelector<HTMLElement>('.zoom-value');
    this.#zoomValue = (e as CustomEvent<ZoomValue>).detail.zoom;
    if (el) el.textContent = `${Math.round(this.#zoomValue * 100)}%`;
    this.handlePanChange(e);
  };
  handlePanChange = (e: Event) => {
    if (this._mouseOff) return;
    const { left, top, width, height } = (e as CustomEvent<PanValue>).detail;
    this._target.style.left = `${Math.round(left * 100)}%`;
    this._target.style.top = `${Math.round(top * 100)}%`;
    this._target.style.width = `${Math.round(width * 100)}%`;
    this._target.style.height = `${Math.round(height * 100)}%`;
  };
  handleResize = () => {
    if (this.visible) {
      const ratio =
        (this.parentElement?.clientWidth ?? 1) /
          (this.parentElement?.clientHeight ?? 1) || 1;
      this._container.style.width = `${this._container.clientHeight * ratio}px`;
    }
  };

  handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    if (delta) {
      const speed = this.$diagram?.resolvedConfig.zoom.speed || 0.125;
      const value = delta > 0 ? 2 - 1 / (1 - speed) : 1 + speed;
      this.$diagram?.chart?.zoom(value, 'zoom');
      this.handlePointerDown(e);
      this.handlePointerUp(e);
    }
  };
  handlePointerDown = (e: MouseEvent | PointerEvent) => {
    e.preventDefault();
    if (this._mouseOff) return;
    const pointerId = 'pointerId' in e ? e.pointerId : undefined;
    if (e.target !== this._target) {
      this._mouseOff = {
        x: e.clientX,
        y: e.clientY,
        left: e.offsetX - this._target.offsetWidth / 2,
        top: e.offsetY - this._target.offsetHeight / 2,
        id: pointerId,
      };
      this.handlePointerMove(e);
    } else {
      this._mouseOff = {
        x: e.clientX,
        y: e.clientY,
        left: this._target.offsetLeft,
        top: this._target.offsetTop,
        id: pointerId,
      };
    }
    window.addEventListener('pointerup', this.handlePointerUp, { once: true });
    this._container.addEventListener('pointermove', this.handlePointerMove);
  };
  handlePointerMove = (e: MouseEvent | PointerEvent) => {
    e.preventDefault();
    const pointerId = 'pointerId' in e ? e.pointerId : undefined;
    if (this._mouseOff && this._mouseOff.id === pointerId) {
      const minZoom = this.$diagram?.resolvedConfig.zoom.min ?? 1.0;
      const { clientWidth: w, clientHeight: h } = this._container,
        { offsetWidth: tw, offsetHeight: th } = this._target,
        offW = (w / minZoom - w) / 2,
        offH = (h / minZoom - h) / 2;
      const { x, y, left, top } = this._mouseOff;
      const nx = Math.min(w + offW - tw, Math.max(left + e.clientX - x, -offW));
      const ny = Math.min(h + offH - th, Math.max(top + e.clientY - y, -offH));
      this._target.style.left = `${nx}px`;
      this._target.style.top = `${ny}px`;

      const scaleOffset = this.$diagram?.scaleOffset ?? 1;
      const xrange = {
        min: ((nx / w) * 2 - 1) / scaleOffset,
        max: (((nx + tw) / w) * 2 - 1) / scaleOffset,
      };
      const yrange = {
        min: ((((ny + th) / h) * 2 - 1) / scaleOffset) * -1,
        max: (((ny / h) * 2 - 1) / scaleOffset) * -1,
      };
      this.$panMove(xrange, yrange);
    }
  };
  handlePointerUp = (e: MouseEvent | PointerEvent) => {
    e.preventDefault();
    this._mouseOff = undefined;
    window.removeEventListener('pointerup', this.handlePointerUp);
    this._container.removeEventListener('pointermove', this.handlePointerMove);
  };
  protected $panMove = throttle(
    (xrange: ScaleRange, yrange: ScaleRange) => {
      const chart = this.$diagram?.chart;
      if (!chart) return;
      const { x, y } = chart.scales;
      const p0 = {
          x: x.getPixelForValue(xrange.min),
          y: y.getPixelForValue(yrange.min),
        },
        p1 = {
          x: x.getPixelForValue(xrange.max),
          y: y.getPixelForValue(yrange.max),
        };
      this.$diagram?.chart?.zoomRect(p0, p1, 'zoom');
    },
    this,
    20
  );

  hide() {
    this._container.classList.add('hide');
    this.visible = false;
    this.emit('sc-collapse');
  }
  show() {
    this._container.classList.remove('hide');
    this.visible = true;
    this.handleResize();
    this.emit('sc-expand');
  }

  zoomIn() {
    this.$diagram?.chart?.zoom(
      1 + this.$diagram.resolvedConfig.zoom.speed * 2,
      'zoom'
    );
  }
  zoomOut() {
    this.$diagram?.chart?.zoom(
      2 - 1 / (1 - this.$diagram.resolvedConfig.zoom.speed * 2),
      'zoom'
    );
  }
  zoomReset() {
    this.$diagram?.resetZoom();
  }

  toggleFullscreen() {
    const el = this.$diagram;

    if (!document.fullscreenElement && document.fullscreenEnabled) {
      // Request fullscreen for the canvas element (or document.documentElement for the whole page)
      el?.requestFullscreen?.().catch(e =>
        console.error('Error enabling fullscreen', e)
      );
    } else {
      // Exit fullscreen mode
      document.exitFullscreen?.();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.parentElement?.tagName === 'SC-RELATIONSHIP-DIAGRAM') {
      const el = (this.$diagram = this.parentElement as ScRelationshipDiagram);
      el.addEventListener('sc-change', this.handleChange);
      el.addEventListener('sc-rel-animated', this.handleRedraw);
      el.addEventListener('sc-rel-animating', this.handleThrottledRedraw);
      el.addEventListener('sc-rel-draw', this.handleDebouncedRedraw);
      el.addEventListener('sc-zoom', this.handleZoomChange);
      el.addEventListener('sc-pan', this.handlePanChange);
      el.addEventListener('sc-resize', this.handleResize);
    }
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    const el = this.$diagram;
    if (el) {
      el.removeEventListener('sc-change', this.handleChange);
      el.removeEventListener('sc-rel-animated', this.handleRedraw);
      el.removeEventListener('sc-rel-animating', this.handleThrottledRedraw);
      el.removeEventListener('sc-rel-draw', this.handleDebouncedRedraw);
      el.removeEventListener('sc-zoom', this.handleZoomChange);
      el.removeEventListener('sc-pan', this.handlePanChange);
      el.removeEventListener('sc-resize', this.handleResize);
      this.$diagram = undefined;
    }
  }

  #renderIcon(icon: string, label: string, onClick: () => void) {
    return html`<sc-tooltip
      content="${label}"
      trigger="hover"
      placement="left"
      hover-show-delay="2500"
      hover-hide-delay="0"
    >
      <sc-icon-button
        type="text"
        size="sm"
        name="${icon}"
        class="fullscreen-compat"
        @click="${onClick}"
      ></sc-icon-button>
    </sc-tooltip>`;
  }

  protected render() {
    return html`
      <div
        class="container"
        @wheel=${this.handleWheel}
        @pointerdown=${this.handlePointerDown}
      >
        <div class="target"></div>
      </div>
      <div class="controls">
        ${this.visible
          ? this.#renderIcon('page-collapsed-left--line', 'Collapse', this.hide)
          : this.#renderIcon('page-collapse-left--line', 'Expand', this.show)}
        ${this.#renderIcon('slideshow', 'Present', this.toggleFullscreen)}
        ${this.#renderIcon('zoom-in--line', 'Zoom in', this.zoomIn)}
        ${this.#renderIcon('zoom-out--line', 'Zoom out', this.zoomOut)}
        ${this.#renderIcon('page-zoom-out--line', 'Reset zoom', this.zoomReset)}

        <div class="zoom-value">100%</div>
      </div>
    `;
  }
}