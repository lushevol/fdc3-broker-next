import {
  ActiveElement,
  Chart,
  ChartDataset,
  ChartEvent,
  Element,
  LinearScale,
  Point,
  PointElement,
  ScriptableContext,
  UpdateMode,
} from 'chart.js';
import {
  EdgeLine,
  ForceDirectedGraphChart,
  ForceDirectedGraphController,
  ITreeSimNode,
} from 'chartjs-chart-graph';
import 'hammerjs/hammer.js';
import { css, LitElement, PropertyValues } from 'lit';
import { html, nothing } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { colorWithOpacity } from '../../shared/color.js';
import { deepMerge } from '../../shared/object.js';
import { INTERNAL_EVENTS } from '../../shared/sc-custom-events.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { debounce, throttle } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import { defaultFullConfig } from './utils/config.js';
import {
  Actions,
  PanValue,
  RelationshipConfig,
  RelationshipFullConfig,
  RelLink,
  RelLinkData,
  RelLinkSymbol,
  RelNode,
  RelNodeData,
  RelNodeSymbol,
} from './utils/types.js';

// import zoomPlugin from 'chartjs-plugin-zoom';
/// note: work around until hammerjs becomes ESM or is fixed by chartjs-plugin-zoom
import type { } from 'chartjs-plugin-zoom';
const importing = (async () => {
  // eslint-disable-next-line import/extensions
  const helpers = await import('chart.js/helpers');
  Object.assign(Chart, { Chart, helpers });
  (window as any).Chart = ((globalThis ?? (global || self)) as any).Chart = Chart;
  const zoom = await import('chartjs-plugin-zoom/dist/chartjs-plugin-zoom.js');
  Chart.register(
    ForceDirectedGraphController,
    EdgeLine,
    LinearScale,
    PointElement
  );
  if (!Chart.registry.plugins.get('zoom')) { 
    try {
      Chart.register({ ...zoom });
    } catch (e) {
      console.warn(
        'chartjs-plugin-zoom was not loaded/registered, pls contact https://go/chat/servicebench',
        zoom, e
      );
    }
  }
})();


export class ScRelationshipDiagram extends ScExtElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
    canvas {
      width: 100%;
      height: 100%;

      &.animating {
        cursor: progress;
      }
    }

    .top-slots,
    .bottom-slots {
      position: absolute;
      left: 1rem;
      right: 1rem;
      display: flex;
      align-items: start;
      justify-content: space-between;
      pointer-events: none;

      .left {
        display: flex;
        gap: 1rem;
        justify-content: start;
      }
      .right {
        display: flex;
        gap: 1rem;
        justify-content: end;
      }
    }
    .top-slots {
      top: 1rem;
    }
    .bottom-slots {
      bottom: 1rem;
      align-items: end;
    }
    ::slotted(*) {
      pointer-events: auto;
    }
    ::slotted(.fullscreen-only) {
      display: none;
    }

    :host(:fullscreen) {
      ::slotted(*) {
        display: none;
      }
      ::slotted(.fullscreen-only) {
        display: block;
      }
    }
  `;

  @property({ type: Object }) data = {
    nodes: <RelNodeData[]>[],
    links: <RelLinkData[]>[],
  };
  @property({ type: String }) size: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'md';
  @property({ type: Boolean, attribute: 'auto-size' }) autoSize = false;
  @property({ type: Boolean }) selectable = false;
  @property({ type: Boolean }) hoverable = false;
  @property({ type: Boolean }) zoomable = false;
  @property({ type: Object }) config: RelationshipConfig = {};
  @property({ type: Boolean }) highlight = false;
  @property({ type: Array, attribute: 'select-ids' }) selectIds?: string[];

  @query('canvas') canvas: HTMLCanvasElement;

  chart?: Chart<'forceDirectedGraph', RelNode[], string>;

  protected $byId: Record<string, RelNode | RelLink> = {};
  protected $config: RelationshipFullConfig = defaultFullConfig;

  private _nodes: RelNode[] = [];
  private _links: RelLink[] = [];

  $computedStyles: CSSStyleDeclaration;
  #nodeHandler = this.#createProxyHandler<RelNode>('node');
  #linkHandler = this.#createProxyHandler<RelLink>('link');

  _selection: Record<string, RelNode | RelLink> = Object.create(null);
  #hovered?: RelNode | RelLink;
  $bounds = {
    x: { min: -1, max: 1, minRange: 1 },
    y: { min: -1, max: 1, minRange: 1 },
  };
  #wasPanning = false;

  /** chart zoom level */
  $zoomScale = 1;
  /** offset scaling to offset bounds */
  readonly $offsetScale = 0.8;
  /** simulation scaling */
  $simScale = 1;

  @state() _icons = new Set<string>();
  @state() _animating = false;

  $cache: Record<string, Record<string, unknown>> = Object.create(null);

  get nodes(): RelNode[] {
    return [...this._nodes];
  }
  get links(): RelLink[] {
    return [...this._links];
  }
  get resolvedConfig(): Readonly<RelationshipFullConfig> {
    return this.$config;
  }

  private _setCache<T>(id: string, prop: string, value: T): T {
    return ((this.$cache[id] ??= Object.create(null))[prop] = value);
  }
  private _getCache<T>(id: string, prop: string): T | undefined {
    return this.$cache[id]?.[prop] as T;
  }
  private _hasCache(id: string, prop: string): boolean {
    return id in this.$cache && prop in this.$cache[id];
  }
  clearCache() {
    this.$cache = Object.create(null);
  }

  #createProxyHandler<T extends RelNode | RelLink>(
    type: T extends RelNode ? 'node' : 'link'
  ): ProxyHandler<T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const loc: ScRelationshipDiagram = this;

    return <ProxyHandler<T>>{
      get(item, prop: keyof T & string, receiver) {
        if (loc._hasCache(item.id, prop))
          return loc._getCache<any>(item.id, prop);

        const config = loc.$config[type];
        let value: unknown;

        // resolved style prop
        if (typeof prop === 'string' && prop.startsWith('$$')) {
          // ensure order here matches fullKey first as it is compared with .startsWith
          const keys = <(keyof RelationshipFullConfig['node' | 'link'])[]>[
            'color',
            'size',
            'shape',
            'borderColor',
            'borderWidth',
            'fontFamily',
            'fontSize',
            'fontColor',
            'maxChar',
            'placeholder',
            'image',
            'icon',
            'showText',
            'width',
            'line',
            'head',
            'tail',
            'rescaleText',
            'rescale',
          ];
          const fullKey = prop.slice(2) as (typeof keys)[number];
          let key: (typeof keys)[number] | undefined,
            state: Actions | undefined;
          // exact match, no suffix
          if (keys.includes(fullKey)) {
            key = fullKey;
          } else {
            key = keys.find(k => fullKey.startsWith(k));
            if (key) {
              const suffix = fullKey.slice(key.length).toLowerCase();
              if (suffix === 'hover' || suffix === 'selected') {
                state = suffix;
              } else {
                key = undefined;
              }
            }
          }

          if (key) {
            const sufxState = state
              ? state.charAt(0).toUpperCase() + state.slice(1)
              : '';
            const baseProp = (key + sufxState) as keyof typeof item & string;
            const typeState = item.type ? item.type + sufxState : '';
            value =
              item[baseProp] ||
              (item.type &&
                (config[key]?.custom?.[typeState] ||
                  config[key]?.custom?.[item.type])) ||
              config[key]?.[state ?? 'default'] ||
              config[key]?.default;

            if (key.toLowerCase().endsWith('color')) {
              value =
                fromCssVar(loc.$computedStyles, value) ||
                {
                  color: '#666666',
                  borderColor: 'transparent',
                  fontColor: '#595959',
                }[key as string] ||
                'transparent';
            } else if (key === 'fontSize') {
              value = `${quickRemPx(
                (value as string) ?? loc.$config.fontSize ?? '',
                parseFloat(
                  loc.$computedStyles.getPropertyValue('font-size') || '16'
                )
              )}px`;
            }

            return loc._setCache(item.id, prop, value);
          }
        }

        if (prop === '$source' && RelLinkSymbol in item)
          return loc.$byId[item.source];
        if (prop === '$target' && RelLinkSymbol in item)
          return loc.$byId[item.target];
        if (prop === 'toString') value = () => item.id;

        if (value !== undefined) return loc._setCache(item.id, prop, value);

        return Reflect.get(item, prop, receiver);
      },
    };
  }

  @watch('data')
  async whenDataChanged() {
    await importing;
    await this.updateComplete;

    this.$byId = {};
    this._createNodes(this.data.nodes);
    this._createLinks(this.data.links);

    if (this.chart) {
      const chart = this.chart;
      chart.data.labels?.splice(
        0,
        chart.data.labels.length,
        ...this._nodes.map(node => node.id)
      );
      const dataset = chart.data.datasets[0];
      dataset.data.splice(0, dataset.data.length, ...this._nodes);
      dataset.edges?.splice(0, dataset.edges.length, ...this._links);

      (chart.options.simulation ??= {}).initialIterations = this.$config.animate
        ? 80
        : 300;

      chart.update();
      this.emit('sc-change');
      this.$throttledComputeSimScale.clear();
    }
  }

  @watch(['config', 'size'])
  async whenConfigChanged() {
    await importing;
    await this.updateComplete;
    // clear cache for new config
    this.clearCache();
    // redraw chart
    this._initializeChart();
    this.resetZoom(1.0);
  }

  @watch('selectIds')
  async whenSelectIdsChanged() {
    await importing;
    await this.updateComplete;
    if (this.selectIds?.length) {
      this.select(this.selectIds);
    } else if (this.hasSelection()) {
      this.deselect();
    }
  }

  @watch(['selectable', 'zoomable', 'rescale'], { waitUntilFirstUpdate: true })
  async whenOptionsChanged() {
    await importing;
    await this.updateComplete;

    if (this.chart) {
      const plugins = (this.chart.options.plugins ??= {});
      const zoom = plugins.zoom ??= {};
      zoom.pan = { enabled: this.zoomable };
      zoom.zoom = {
        mode: this.zoomable ? 'xy' : undefined,
        wheel: { enabled: this.zoomable },
        pinch: { enabled: this.zoomable },
      };

      this.chart.options.onHover = this.hoverable
        ? this.handleHover.bind(this)
        : undefined;
      this.chart.options.onClick = this.selectable
        ? this.handleClick.bind(this)
        : undefined;

      if (!this.zoomable)
        this.resetZoom(undefined, undefined, 'none');
      else
        this.chart.update('none');
    }
  }

  private _createNodes(nodes: RelNodeData[]) {
    this._nodes = nodes.map((n, i) => {
      return (this.$byId[n.id] = new Proxy(
        { ...n, $index: i, [RelNodeSymbol]: true } as RelNode,
        this.#nodeHandler
      ));
    });
  }
  private _createLinks(links: RelLinkData[]) {
    this._links = links.map((l, i) => {
      const id = l.id ?? `${l.source}:::${l.target}`;
      return (this.$byId[id] = new Proxy(
        { ...l, id, $index: i, [RelLinkSymbol]: true } as RelLink,
        this.#linkHandler
      ));
    });
  }

  get selection(): Array<RelNode | RelLink> {
    return Object.values(this._selection);
  }
  hasSelection(): boolean {
    return Object.keys(this._selection).length > 0;
  }
  isSelected(id: string): boolean {
    return id in this._selection;
  }
  /** Replaces selection or adds if append is true */
  select(ids: string[], append = false) {
    const prev = this.selection;
    if (!append) this._selection = Object.create(null);
    ids.forEach(id => {
      const item = this.$byId[id];
      if (item) {
        this._selection[id] = item;
      }
    });

    if (prev.join('|') !== this.selection.join('|')) {
      this.chart?.update('active');
      this.emit('sc-select', { detail: { selection: this.selection } });
    }
  }
  /** Not passing arg will deselect all */
  deselect(ids?: string[]) {
    const prev = this.selection;
    if (!ids) this._selection = Object.create(null);
    ids?.forEach(id => {
      const item = this.$byId[id];
      item && delete this._selection[id];
    });
    if (prev.join('|') !== this.selection.join('|')) {
      this.chart?.update('active');
      this.emit('sc-select', { detail: { selection: this.selection } });
    }
  }

  centerSelected() {
    const selected = this.selection;
    if (!this.chart || !selected.length) return;

    const dataset = this.chart.getDatasetMeta(0);
    const data = dataset.data;
    const width = this.chart.scales.x.width,
      height = this.chart.scales.y.height;

    if (selected.length === 1 && RelNodeSymbol in selected[0]) {
      const pt = data[selected[0].$index];
      const amount = {
        x: width / 2 - pt.x,
        y: height / 2 - pt.y,
      };
      this.chart.pan(amount, undefined, 'zoom');
    } else {
      const topLeft = { x: Infinity, y: Infinity };
      const bottomRight = { x: -Infinity, y: -Infinity };

      const nodes = this.selection
        .map(item => {
          if (RelNodeSymbol in item) {
            return item as RelNode;
          } else if (RelLinkSymbol in item) {
            return [item.$source, item.$target];
          }
          return null;
        })
        .flat()
        .filter(v => !!v) as RelNode[];
      if (!nodes.length) return;

      nodes.forEach(node => {
        const pt = data[node.$index];
        topLeft.x = Math.min(topLeft.x, pt.x);
        topLeft.y = Math.min(topLeft.y, pt.y);
        bottomRight.x = Math.max(bottomRight.x, pt.x);
        bottomRight.y = Math.max(bottomRight.y, pt.y);
      });

      let dx = bottomRight.x - topLeft.x,
        dy = bottomRight.y - topLeft.y;
      const vx = (dx / 0.8 - dx) / 2,
        vy = (dy / 0.8 - dy) / 2;

      // outside of zoom range, zoom out
      if (
        bottomRight.x - topLeft.x > width ||
        bottomRight.y - topLeft.y > height
      ) {
        topLeft.x -= vx;
        topLeft.y -= vy;
        bottomRight.x += vx;
        bottomRight.y += vy;

        const targetRatio = this.canvas.width / this.canvas.height;
        dx = bottomRight.x - topLeft.x;
        dy = bottomRight.y - topLeft.y;
        const ratio = dx / dy;

        if (ratio > targetRatio) {
          // wider, add height
          const extra = (dx / targetRatio - dy) / 2;
          topLeft.y -= extra;
          bottomRight.y += extra;
        } else if (ratio < targetRatio) {
          // taller, add width
          const extra = (dy * targetRatio - dx) / 2;
          topLeft.x -= extra;
          bottomRight.x += extra;
        }

        this.chart.zoomRect(topLeft, bottomRight, 'zoom');
      } else {
        const amount = {
          x: width / 2 - ((bottomRight.x - topLeft.x) / 2 + topLeft.x),
          y: height / 2 - ((bottomRight.y - topLeft.y) / 2 + topLeft.y),
        };
        this.chart.pan(amount, undefined, 'zoom');
      }
    }
  }

  get isAnimating() {
    return this._animating;
  }

  get hovered(): RelNode | RelLink | undefined {
    return this.#hovered;
  }
  hover(itemOrId?: RelNode | RelLink | string, rect?: DOMRect): void {
    const item = typeof itemOrId === 'string' ? this.$byId[itemOrId] : itemOrId;
    if (this.#hovered !== item) {
      this.#hovered = item;
      this.emit('sc-hover', { detail: { hover: this.#hovered, rect } });
    }
  }

  get scaleOffset(): number {
    return this.$offsetScale;
  }
  /** Visual zoom scale value. Displayed on minimap after x100 */
  get zoomLevel(): number {
    return (this.$zoomScale / this.$offsetScale) * this.$simScale;
  }

  setZoomLevel(value: number, center?: Point, mode?: UpdateMode): void {
    if (!this.chart) return;
    const s =
      1 /
      ((Math.max(
        Math.min(value, this.$config.zoom.max),
        this.$config.zoom.min * Math.min(this.$simScale, 1)
      ) *
        this.$offsetScale) /
        this.$simScale);

    const { x, y } = this.chart.scales;
    const p0 = {
        x: x.getPixelForValue(-s + (center?.x ?? 0)),
        y: y.getPixelForValue(-s + (center?.y ?? 0)),
      },
      p1 = {
        x: x.getPixelForValue(s + (center?.x ?? 0)),
        y: y.getPixelForValue(s + (center?.y ?? 0)),
      };
    this.chart.zoomRect(p0, p1, mode ?? 'zoom');
  }

  resetZoom(value?: number, center?: Point, mode?: UpdateMode): void {
    const chart = this.chart;
    if (!chart) return;
    chart.resetZoom('none');

    const s = 1 / (this.$zoomScale = this.$offsetScale);
    const x0 = -s,
      x1 = s,
      y0 = -s,
      y1 = s;

    const low = (this.$config.zoom.min ?? 1) / Math.max(this.$simScale, 1),
      high = (this.$config.zoom.max ?? 1) / this.$simScale;
    const dx = x1 - x0,
      dy = y1 - y0;

    this.$bounds = {
      x: {
        minRange: dx / high,
        min: x0 - (dx / low - dx) / 2,
        max: x1 + (dx / low - dx) / 2,
      },
      y: {
        minRange: dy / high,
        min: y0 - (dy / low - dy) / 2,
        max: y1 + (dy / low - dy) / 2,
      },
    };
    ((chart.options.plugins ??= {}).zoom ??= {}).limits = this.$bounds;

    if (value !== undefined) {
      this.setZoomLevel(value, center, mode);
    } else {
      const { x, y } = chart.scales;
      const s = Math.max(this.$simScale, 1);
      const p0 = {
        x: x.getPixelForValue(x0 * s),
        y: y.getPixelForValue(y0 * s),
      };
      const p1 = {
        x: x.getPixelForValue(x1 * s),
        y: y.getPixelForValue(y1 * s),
      };
      chart.zoomRect(p0, p1, mode ?? 'zoom');
    }
    this.handleZoomed();
  }

  /** Checks is both axis have the same zoom value */
  isZoomed(value = 1.0): boolean {
    if (this.chart) {
      const { x, y } = this.chart.scales,
        scale = 2 / this.$offsetScale;
      const res =
        (x.max - x.min) / scale === value && (y.max - y.min) / scale === value;
      return res;
    }
    return false;
  }

  _getChartScale(): number {
    if (this.chart) {
      const { x, y } = this.chart.scales;
      return Math.min(1 / ((x.max - x.min) / 2), 1 / ((y.max - y.min) / 2));
    }
    return 1;
  }

  handleZoomed(): void {
    if (this.chart) {
      const pan = this.$getNormalizedPan();
      this.emit('sc-pan', { detail: pan });
      this.emit('sc-zoom', { detail: { ...pan, zoom: this.zoomLevel } });
    }
  }
  handlePanned(): void {
    if (this.chart) {
      const detail = this.$getNormalizedPan();
      this.emit('sc-pan', { detail });
    }
  }
  protected $getNormalizedPan(): PanValue | undefined {
    if (this.chart) {
      const { x, y } = this.chart.scales;

      const dx = this.$bounds.x.max - this.$bounds.x.min,
        dy = this.$bounds.y.max - this.$bounds.y.min,
        ax = Math.abs(this.$bounds.x.min),
        ay = Math.abs(this.$bounds.y.min);

      const r = {
        left: (x.min + ax) / dx,
        top: (-y.max + ay) / dy,
        right: (x.max + ax) / dx,
        bottom: (-y.min + ay) / dy,
      };
      return { ...r, width: r.right - r.left, height: r.bottom - r.top };
    }
  }

  handleClick(event: ChartEvent, elements: ActiveElement[]): void {
    if (this.#wasPanning || !this.selectable) {
      this.#wasPanning = false;
      return;
    }
    const me = event.native as MouseEvent;

    if (elements.length) {
      const first = elements[0];
      const item =
        this.chart?.data.datasets[first.datasetIndex].data[first.index];
      if (item) {
        if (this.isSelected(item.id)) {
          if (this.selection.length > 1 && !me.ctrlKey) {
            this.select([item.id]);
          } else {
            this.deselect([item.id]);
          }
        } else {
          this.select([item.id], me.ctrlKey);
        }
      }
    } else {
      const x = event.x ?? NaN;
      const y = event.y ?? NaN;
      const link =
        !isNaN(x) &&
        !isNaN(y) &&
        this.getIntersectingLink(x, y, this.$config.linkSelectThreshold);
      if (link) {
        if (!this.isSelected(link.id)) {
          this.select([link.id], me.ctrlKey);
        }
      } else if (this.hasSelection() && !me.ctrlKey) {
        this.deselect();
      }
    }
  }
  handleHover(event: ChartEvent, elements: ActiveElement[]): void {
    if (!this.hoverable) return;
    if (elements.length) {
      const first = elements[0];
      const node =
        this.chart?.data.datasets[first.datasetIndex].data[first.index];
      const radius = this.$rescale(
        (node?.$$sizeHover ?? 48) / 2,
        node?.$$rescale
      );
      const rect = new DOMRect(
        first.element.x - radius,
        first.element.y - radius,
        radius * 2,
        radius * 2
      );
      this.hover(node, rect);
    } else {
      this.hover();
    }
  }

  getIntersectingLink(
    x: number,
    y: number,
    threshold = 10
  ): RelLink | undefined {
    const meta = this.chart?.getDatasetMeta(0);
    if (!meta) return;

    return this._links.find(link => {
      const { $source, $target } = link;
      if (!$source || !$target) return false;
      const source = meta.data[$source.$index],
        target = meta.data[$target.$index];
      if (!source || !target) return false;

      const dist = (function distToSegment(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        px: number,
        py: number
      ) {
        // distance from point to the segment
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (dx === 0 && dy === 0) {
          // It's a point, not a segment.
          return Math.hypot(px - x1, py - y1);
        }
        // project point onto the segment, compute parameterized position t
        const t = Math.max(
          0,
          Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy))
        );
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;
        return Math.hypot(px - projX, py - projY);
      })(source.x, source.y, target.x, target.y, x, y);

      // less than threshold
      return dist <= threshold;
    });
  }

  protected $rescale(n: number, rescale = 0): number {
    const scale = this.$zoomScale / this.$offsetScale * this.$simScale;
    if (rescale || scale < 1) {
      return n * (scale > 1 ? Math.pow(scale, rescale || 1) : scale);
    }
    return n * Math.min(scale, 1);
  }

  $computeSimScale() {
    if (!this.chart) return;

    const meta = this.chart.getDatasetMeta(0);
    const minmax = (meta._parsed as ITreeSimNode[]).reduce(
      (acc, item) => {
        const s = item._sim;
        if (!s || s.x === undefined || s.y === undefined) return acc;
        if (s.x < acc.x0) acc.x0 = s.x;
        else if (s.x > acc.x1) acc.x1 = s.x;
        if (s.y < acc.y0) acc.y0 = s.y;
        else if (s.y > acc.y1) acc.y1 = s.y;
        return acc;
      },
      {
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
      }
    );
    if (
      (minmax.x0 === 0 && minmax.x1 === 0) ||
      (minmax.y0 === 0 && minmax.y1 === 0)
    ) {
      // If all min/max values are 0, we can use a default scale
      // this.$simScale = 1;
      return;
    }

    const width =
      (this.$config.node.size.default / 5 / (minmax.x1 - minmax.x0)) *
      this.clientWidth;
    const height =
      (this.$config.node.size.default / 5 / (minmax.y1 - minmax.y0)) *
      this.clientHeight;
    const size = Math.min(width, height);
    const zoom = this.zoomLevel;
    const bounds = this.chart.getZoomedScaleBounds();

    const center = {
      x: bounds.x ? (bounds.x.min + bounds.x.max) / 2 : 0,
      y: bounds.y ? (bounds.y.min + bounds.y.max) / 2 : 0,
    };

    this.$simScale = size / this.$config.node.size.default;
    if (this.zoomable) {
      this.resetZoom(zoom, center, 'none');
    } else {
      this.resetZoom();
    }
  }
  $throttledComputeSimScale = throttle(this.$computeSimScale, this, 25);

  protected $resolveConfig() {
    this.$computedStyles = getComputedStyle(this.canvas);

    const fontFamily =
      this.$computedStyles.getPropertyValue('--sc-font-family') ??
      `${defaultFullConfig.fontFamily}, ${this.$computedStyles.getPropertyValue(
        'font-family'
      )}`;

    const styleCfg: RelationshipConfig = {
      fontFamily,
      node: {
        fontFamily: { default: fontFamily },
        size: {
          default: {
            sm: 24,
            md: 32,
            lg: 48,
            xl: 60,
            xxl: 100,
          }[this.size],
        },
      },
      link: {
        fontFamily: { default: fontFamily },
      },
    };

    this.$config = deepMerge<RelationshipFullConfig>(
      {},
      defaultFullConfig,
      styleCfg,
      {
        ...this.config,
        color: fromCssVar(
          this.$computedStyles,
          this.config.color ?? defaultFullConfig.color
        ),
        fontSize: `${quickRemPx(
          this.config.fontSize ?? defaultFullConfig.fontSize ?? '',
          parseInt(this.$computedStyles.getPropertyValue('font-size'))
        )}px`,
        node: Object.fromEntries(
          Object.entries(this.config.node ?? {}).map(([key, value]) => [
            key,
            'default' in value ? value : { default: value },
          ])
        ),
        link: Object.fromEntries(
          Object.entries(this.config.link ?? {}).map(([key, value]) => [
            key,
            'default' in value ? value : { default: value },
          ])
        ),
      }
    );

    if (this.$config.node.icon) {
      const { default: def, hover, selected, custom } = this.$config.node.icon;
      const icons = [def, hover, selected, Object.values(custom ?? {})].filter(
        v => !!v
      ) as string[];
      this._icons = new Set(icons);
    }
  }

  private _initializeChart(): void {
    this.$resolveConfig();

    type SCtx = ScriptableContext<'graph'>;

    const dataset: ChartDataset<'forceDirectedGraph', RelNode[]> = {
      data: [...this._nodes],
      edges: [...this._links],
      // node
      pointStyle: ({ dataIndex }: SCtx) =>
        this._nodes[dataIndex]?.shape ?? 'circle',
      pointBackgroundColor: 'transparent',
      pointRadius: ({ dataIndex }: SCtx) => {
        const node = this._nodes[dataIndex];
        return this.$rescale((node?.$$size ?? 1) / 2, node?.$$rescale);
      },
      pointBorderWidth: 0,
      pointHoverRadius: ({ dataIndex }: SCtx) => {
        const node = this._nodes[dataIndex];
        return this.$rescale((node?.$$sizeHover ?? 1) / 2, node?.$$rescale);
      },
      pointHoverBackgroundColor: 'transparent',
      pointHoverBorderWidth: 0,
    };

    // missing/incomplete types from graph
    const linkDataOpts = {
      edgeLineBorderWidth: 0,
      edgeLineBorderColor: 'transparent',
    };

    if (this.chart) this.chart.destroy();

    this.chart = new ForceDirectedGraphChart<RelNode[], string>(this.canvas, {
      data: {
        labels: this._nodes.map(node => node.id),
        datasets: [{ ...dataset, ...linkDataOpts }],
      },
      plugins: [
        // ChartDataLabels.default,
        {
          id: 'sc_relationship',
          beforeDraw: chart => {
            const ctrl = chart.getDatasetMeta(0).controller as any;
            const on = ctrl._simulation?.on;
            if (on instanceof Function) {
              if (!on('tick.rel')) {
                on('tick.rel', () => {
                  this.$throttledComputeSimScale();
                  this.addEventListener(
                    'sc-rel-update',
                    () => this.emit('sc-rel-animating'),
                    { once: true }
                  );
                });
              }
              if (!on('end.rel'))
                on('end.rel', () =>
                  this.addEventListener(
                    INTERNAL_EVENTS['sc-rel-render'],
                    () => {
                      this._animating = false;
                      this.emit('sc-rel-animated');
                    },
                    { once: true }
                  )
                );
            }
          },
          beforeDestroy: chart => {
            const ctrl = chart.getDatasetMeta(0).controller as any;
            const on = ctrl._simulation?.on;
            if (on instanceof Function) on('.rel', null);
          },
          afterDraw: () => {
            this.#drawLayers();
            this.internalEmit(INTERNAL_EVENTS['sc-rel-draw']);
          },
          afterRender: () => {
            this.internalEmit(INTERNAL_EVENTS['sc-rel-render']);
          },
          afterUpdate: () => {
            this.emit('sc-rel-update');
          },
          resize: debounce(() => this.emit('sc-resize'), 25),
        },
      ],
      options: {
        maintainAspectRatio: false,
        responsive: true,
        // resizeDelay: 50,
        layout: {
          padding: 0,
          autoPadding: false,
        },
        interaction: {
          mode: 'nearest',
          intersect: true,
          axis: 'xy',
        },
        onHover: this.hoverable ? this.handleHover.bind(this) : undefined,
        onClick: this.selectable ? this.handleClick.bind(this) : undefined,

        plugins: {
          zoom: {
            pan: {
              enabled: this.zoomable,
              onPan: () => this.handlePanned(),
              onPanComplete: () => (this.#wasPanning = true),
            },
            zoom: {
              mode: this.zoomable ? 'xy' : undefined,
              scaleMode: 'xy',
              wheel: {
                enabled: this.zoomable,
                speed: this.$config.zoom.speed || 0.125,
              },
              pinch: {
                enabled: this.zoomable,
              },
              onZoom: ({ chart }) => {
                this.$zoomScale = this._getChartScale();
                chart.update('zoom');
                this.handleZoomed();
              },
            },
            limits: {
              // will be populated from resetZoom
            },
          },
        },
        simulation: {
          // max iteration, 300 disables simulation
          initialIterations: 300,
          forces: {
            collide: {
              radius:
                (orFn(this.$config.sim?.collideRadius) ??
                  this.$config.node.size.default / 2) /
                5 /
                this.$offsetScale,
            },
            link: {
              distance:
                ((orFn(this.$config.sim?.linkDistance) ??
                  4 + this.$config.node.size.default / 50) *
                  5) /
                this.$offsetScale,
            },
          },
        },
      },
    });
  }

  #drawShape(
    ctx: CanvasRenderingContext2D,
    shape: string,
    pt: Element,
    size: number
  ) {
    const radius = size / 2;
    switch (shape) {
      case 'rect':
        ctx.rect(pt.x - radius, pt.y - radius, size, size);
        break;
      case 'rectRounded':
        ctx.roundRect?.(pt.x - radius, pt.y - radius, size, size, radius / 5);
        break;
      case 'triangle':
        ctx.moveTo(pt.x, pt.y - radius);
        ctx.lineTo(pt.x - radius, pt.y + radius);
        ctx.lineTo(pt.x + radius, pt.y + radius);
        break;
      case 'star':
        const spikes = 5;
        const oRadius = radius;
        const iRadius = radius / 2;
        for (let i = 0; i < spikes; i++) {
          const angle = (i / spikes) * Math.PI * 2;
          const x = Math.cos(angle) * oRadius;
          const y = Math.sin(angle) * oRadius;
          ctx.lineTo(pt.x + x, pt.y + y);
          ctx.lineTo(
            pt.x + Math.cos(angle + Math.PI / spikes) * iRadius,
            pt.y + Math.sin(angle + Math.PI / spikes) * iRadius
          );
        }
        break;
      case 'circle':
      default:
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2, true);
        break;
    }
  }

  #drawLink(ctx: CanvasRenderingContext2D, edge: EdgeLine, link: RelLink) {
    const suffix =
      this.hovered === link
        ? 'Hover'
        : this.isSelected(link.id)
        ? 'Selected'
        : '';
    const dx = edge.source.x - edge.target.x,
      dy = edge.source.y - edge.target.y;
    const target = this.$byId[link.target] as RelNode,
      source = this.$byId[link.source] as RelNode;
    const targetRadius = this.$rescale(
        target[`$$size${suffix}`] / 2,
        target[`$$rescale${suffix}`]
      ),
      sourceRadius = this.$rescale(
        source[`$$size${suffix}`] / 2,
        source[`$$rescale${suffix}`]
      );
    const angle = Math.atan2(dy, dx);
    // ensure not upside down
    const upsideAngle =
      angle > Math.PI / 2 || angle < -Math.PI / 2 ? angle + Math.PI : angle;

    const lineWidth = this.$rescale(
        link[`$$width${suffix}`],
        link[`$$rescale${suffix}`]
      ),
      lineColor = link[`$$color${suffix}`];

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(edge.source.x, edge.source.y);
    ctx.lineTo(edge.target.x, edge.target.y);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    ctx.restore();

    const showText = link.$$showText;
    if (link.relationship && showText !== false) {
      const label =
        link.relationship.length > (link.$$maxChar || Number.MAX_VALUE)
          ? `${link.relationship.slice(0, link.$$maxChar)}…`
          : link.relationship;
      const fontSize = this.$rescale(
          parseFloat(link[`$$fontSize${suffix}`]),
          link[`$$rescaleText${suffix}`]
        ),
        fontFamily = link[`$$fontFamily${suffix}`];

      ctx.save();
      ctx.translate(edge.source.x - dx / 2, edge.source.y - dy / 2);
      ctx.rotate(upsideAngle);
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = link[`$$fontColor${suffix}`];
      ctx.strokeStyle = this.$config.color ?? '#ffffff';
      ctx.lineWidth = fontSize / 3;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      let show = showText === true;
      if (!show) {
        const { width } = ctx.measureText(label);
        const distance =
          Math.sqrt(dx * dx + dy * dy) - sourceRadius - targetRadius;
        const list = Array.isArray(showText) ? showText : [showText];
        for (const val of list)
          if (typeof val === 'string') {
            if (val === 'selected') {
              show ||= this.isSelected(link.id);
            } else if (/^\d+(\.\d+)?%$/.test(val)) {
              show ||= this.zoomLevel * 100 > (parseFloat(val) || 100);
            } else if (/^x\d(\.\d+)?/.test(val)) {
              show ||= distance >= width * (parseFloat(val.slice(1)) || 1);
            }
          } else if (typeof val === 'number') {
            show ||= distance >= val;
          }
      }
      if (show) {
        ctx.strokeText(label, 0, 0);
        ctx.fillText(label, 0, 0);
      }
      ctx.restore();
    }

    const head = link[`$$head${suffix}`],
      tail = link[`$$tail${suffix}`];
    const arrowSize =
      head !== 'none' || tail !== 'none'
        ? this.$rescale(link[`$$size${suffix}`], link[`$$rescale${suffix}`]) +
          lineWidth
        : 0;

    if (arrowSize && head === 'arrow') {
      const r = targetRadius;
      ctx.save();
      ctx.translate(
        edge.target.x + Math.cos(angle) * r,
        edge.target.y + Math.sin(angle) * r
      );
      ctx.rotate(angle - Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = ctx.fillStyle = lineColor;
      ctx.lineTo(-arrowSize / 2, arrowSize);
      ctx.lineTo(arrowSize / 2, arrowSize);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
    if (arrowSize && tail === 'arrow') {
      const r = sourceRadius;
      ctx.save();
      ctx.translate(
        edge.source.x - Math.cos(angle) * r,
        edge.source.y - Math.sin(angle) * r
      );
      ctx.rotate(angle + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = ctx.fillStyle = lineColor;
      ctx.lineTo(-arrowSize / 2, arrowSize);
      ctx.lineTo(arrowSize / 2, arrowSize);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  }
  #drawNames(ctx: CanvasRenderingContext2D, pt: Element, node: RelNode) {
    if (!node.name) return;
    const suffix =
      this.hovered === node
        ? 'Hover'
        : this.isSelected(node.id)
        ? 'Selected'
        : '';
    const size = this.$rescale(
        node[`$$size${suffix}`],
        node[`$$rescale${suffix}`]
      ),
      fontColor = node[`$$fontColor${suffix}`],
      fontSize = this.$rescale(
        parseFloat(node[`$$fontSize${suffix}`]),
        node[`$$rescaleText${suffix}`]
      ),
      fontFamily = node[`$$fontFamily${suffix}`],
      offset = size / 2 + fontSize / 2;
    const name =
      node.name.length > (node.$$maxChar || Number.MAX_VALUE)
        ? `${node.name.slice(0, node.$$maxChar)}…`
        : node.name;

    ctx.save();
    ctx.translate(pt.x, pt.y + offset);
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillStyle = fontColor;
    ctx.lineWidth = fontSize / 3;
    ctx.strokeStyle = this.$config.color ?? '#ffffff';
    ctx.strokeText(name, 0, 0);
    ctx.fillText(name, 0, 0);
    ctx.restore();
  }
  #drawNodes(ctx: CanvasRenderingContext2D, pt: Element, node: RelNode) {
    const suffix =
      this.hovered === node
        ? 'Hover'
        : this.isSelected(node.id)
        ? 'Selected'
        : '';
    const shape = node.$$shape,
      rescale = node[`$$rescale${suffix}`],
      size = this.$rescale(node[`$$size${suffix}`], rescale),
      color = node[`$$color${suffix}`],
      borderWidth = this.$rescale(node[`$$borderWidth${suffix}`], rescale),
      borderColor = node[`$$borderColor${suffix}`];
    const radius = size / 2;

    const once = { once: true },
      hasError = { hasError: true };

    // base shape
    ctx.save();
    ctx.beginPath();
    this.#drawShape(ctx, shape, pt, size);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.clip();

    // avatar
    if (!node.$image) {
      const prepImage = (value: string | HTMLImageElement | undefined) => {
        let img: HTMLImageElement | undefined;
        if (typeof value === 'string') {
          img = document.createElement('img');
          img.src = value;
        } else if (value instanceof HTMLImageElement) {
          img = value;
        }
        if (img) {
          img.addEventListener(
            'load',
            () => this.requestUpdate('$image', node.id),
            once
          );
          img.addEventListener(
            'error',
            () => Object.assign(img as object, hasError),
            once
          );
          return img;
        }
        return undefined;
      };
      if (node.image || node.imageUrl) {
        node.$image = prepImage(node.image ?? node.imageUrl);
      } else {
        this.$config
          .nodeImageGetter?.(node)
          .then(res => (node.$image = node.image = prepImage(res)));
      }
    }

    let img =
      node.$image?.complete && !('hasError' in node.$image)
        ? node.$image
        : undefined;
    const placeholder = node.$$placeholder;
    if (!img && placeholder?.startsWith('initial')) {
      const initials = placeholder.endsWith('s')
        ? node.name
            .split(/[^a-z]+/i)
            .slice(0, 2)
            .map(word => word[0])
            .join('')
            .toUpperCase()
        : node.name.charAt(0).toUpperCase();
      ctx.translate(pt.x, pt.y + 1);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${size * 0.4}px ${node.$$fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 0, 0, size);
    } else if (!img && placeholder === 'icon') {
      const icon = node.$$icon;
      if (icon) {
        // global cache, no id
        img = this._getCache('', icon);
        if (!img) {
          const el = this.shadowRoot?.querySelector<LitElement>(
            `sc-icon[name="${icon}"]`
          );
          if (el && 'svg' in el && !!el.svg) {
            const svg = el.svg as SVGImageElement;
            svg.style.color = this.config.color ?? 'white';
            const data = new XMLSerializer().serializeToString(svg);
            img = document.createElement('img');
            img.src = `data:image/svg+xml;base64,${btoa(data)}`;
            img.addEventListener(
              'load',
              () => {
                this.requestUpdate('$image', node.id);
              },
              once
            );
            // global cache, no id
            this._setCache('', icon, img);
          } else {
            el?.addEventListener(
              'sc-load',
              () => this.requestUpdate('$image', node.id),
              once
            );
          }
        }
      }
    } else if (placeholder === 'image') {
      if (!node.$image) {
        img = node.$$image;
      } else if (node.$image.complete === false) {
        node.$image.addEventListener(
          'error',
          // use resolved default image
          () => (node.$image = node.$$image),
          once
        );
        img = node.$$image;
      }
    }
    if (img?.complete) {
      const isIcon =
        node.$$placeholder === 'icon' &&
        img !== node.image &&
        (!node.imageUrl || !img.src.endsWith(node.imageUrl));
      const scale = isIcon ? 0.7 : 1;
      try {
        ctx.translate(pt.x - radius * scale, pt.y - radius * scale);
        ctx.drawImage(
          img,
          0,
          0,
          img.naturalWidth,
          img.naturalHeight,
          0,
          0,
          size * scale,
          size * scale
        );
      } catch (error) {
        img.dispatchEvent(new ErrorEvent('error', { error }));
      }
    }
    ctx.restore();

    // border
    if (borderWidth) {
      ctx.save();
      ctx.beginPath();
      this.#drawShape(ctx, shape, pt, size - borderWidth);
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
      ctx.closePath();
      ctx.clip();
      ctx.restore();
    }
    ctx.strokeStyle = ctx.fillStyle = 'transparent';
  }

  #drawLayers(): void {
    if (!this.chart) return;
    const ctx = this.chart.ctx;
    if (!ctx) return;
    const meta = this.chart.getDatasetMeta(0);

    ctx.save();
    ctx.fillStyle = this.$config.color ?? '#ffffff';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();

    // draw link labels & arrows // mising edge type
    if ('edges' in meta && Array.isArray(meta.edges)) {
      (meta.edges as EdgeLine[]).forEach((edge, idx) =>
        this.#drawLink(ctx, edge, this._links[idx])
      );
    }

    // draw names
    meta.data.forEach((pt, idx) => this.#drawNames(ctx, pt, this._nodes[idx]));

    // avatars/placeholder
    meta.data.forEach((pt, idx) => this.#drawNodes(ctx, pt, this._nodes[idx]));

    // highlights
    if (this.highlight && this.hasSelection()) {
      const color = this.$config.color ?? '#ffffff';

      ctx.save();
      // ctx.globalCompositeOperation = 'soft-light';
      // ctx.fillStyle = color;
      ctx.fillStyle = colorWithOpacity(color, 0.6);
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();

      const links = this.selection.filter(
        item => RelLinkSymbol in item
      ) as RelLink[];
      const edges =
        'edges' in meta ? (meta.edges as unknown as EdgeLine[]) : null;
      if (edges)
        links.forEach((link, idx) => this.#drawLink(ctx, edges[idx], link));

      const nodes = this.selection
        .map(item =>
          RelLinkSymbol in item ? [item.$source, item.$target] : item
        )
        .flat()
        .filter(v => !!v) as RelNode[];
      nodes.forEach((node, idx) => this.#drawNames(ctx, meta.data[idx], node));
      nodes.forEach((node, idx) => this.#drawNodes(ctx, meta.data[idx], node));
    }
  }

  updated(changes: PropertyValues) {
    if (changes.has('$image')) {
      this.chart?.render();
      this.addEventListener(
        INTERNAL_EVENTS['sc-rel-render'],
        () => this.emit('sc-rel-draw'),
        { once: true }
      );
    }
  }

  protected render() {
    return html`
      <canvas
        class=${classMap({
          animating: this._animating,
        })}
        @dblclick=${this.zoomable ? () => this.resetZoom() : nothing}
        @contextmenu=${(e: Event) => e.preventDefault()}
      ></canvas>
      <div class="top-slots">
        <slot class="left" name="top-left"></slot>
        <slot class="right" name="top-right"></slot>
      </div>
      <div class="bottom-slots">
        <slot class="left" name="bottom-left"></slot>
        <slot class="right" name="bottom-right"></slot>
      </div>
      <div style="display: none">
        ${repeat(
          this._icons,
          icon => html`<sc-icon key=${icon} name="${icon}"></sc-icon>`
        )}
      </div>
    `;
  }
}

function fromCssVar<R, V = R>(
  styles: CSSStyleDeclaration,
  v: R | V
): R | undefined {
  return (
    (typeof v === 'string' &&
      /^\-\-sc\-(color|relationship)\-.*/.test(v) &&
      (styles.getPropertyValue(v) as R)) ||
    undefined
  );
}

function quickRemPx(v: string, base: number): number {
  if (v.endsWith('px')) return parseFloat(v);
  if (v.endsWith('rem')) return parseFloat(v) * base;
  return base;
}


function orFn<T>(fn: T | (() => T)): T {
  return fn instanceof Function ? fn() : fn;
}