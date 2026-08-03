import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Chart, Legend, Title, SubTitle, Tooltip, Filler } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// @ts-ignore
import BasicDefinitions from '@scdevkit/webkit/styles/ScBasicDefinitions.js';
import { replaceTooltipColors, propertyConverter } from '../../shared/util.js';
import '../../plugins/PalettePlugin.js';

export class ScBaseChart extends LitElement {
  constructor() {
    super();

    Chart.register(Legend, Title, SubTitle, Tooltip, Filler, ChartDataLabels);
    Chart.defaults.font.family = BasicDefinitions.fontFamily;
  }

  @state() private chart: any;

  @property() type = '';

  @property({ type: Object, converter: propertyConverter }) data = {};

  @property({ type: Array, converter: propertyConverter }) colors: string[] = [];

  @property({ type: Number }) width: number;

  @property({ type: Number }) height: number;

  @property({ type: Object, attribute: 'chart-title', converter: propertyConverter }) chartTitle = {};

  @property({ type: Object, converter: propertyConverter }) legend = {};

  @property({ type: Object, converter: propertyConverter }) tooltip = {};

  @property({ type: Object, converter: propertyConverter }) interaction = {};

  @property({ type: Object, attribute: 'data-labels', converter: propertyConverter }) dataLabels: any = {};

  @property({ type: Object, attribute: 'horizontal-grid-lines', converter: propertyConverter }) horizontalGridLines = {};

  @property({ type: Object, attribute: 'vertical-grid-lines', converter: propertyConverter }) verticalGridLines = {};

  @property({ type: Object, attribute: 'x-axis', converter: propertyConverter }) xAxis = {};

  @property({ type: Object, attribute: 'y-axis', converter: propertyConverter }) yAxis = {};

  @property({ type: Boolean }) horizontal = false;

  @property({ type: Boolean, attribute: false }) stacked = false;

  @property({ type: Object, converter: propertyConverter }) margin = {};

  @property({ type: Boolean, attribute: 'hide-legend' }) hideLegend = false;

  @property({ type: Boolean, attribute: 'hide-legend-on-hint' }) hideLegendOnHint = false;

  @property({ type: Object, converter: propertyConverter }) options: any = {};
  
  @property({ type: String }) palette = 'default';

  @property({ type: Array, attribute: 'custom-colors' }) customColors: string[];

  connectedCallback() {
    super.connectedCallback();

    // After the first update
    this.updateComplete.then(() => {
      window.addEventListener('resize', this.handleResize);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('resize', this.handleResize);
  }

  protected shouldUpdate(): boolean {
    return !!this.type;
  }

  updated() {
    this.showChart();
  }

  getTooltipOptions: any = () => {
    // @ts-ignore
    const tooltipCallbacks = this.tooltip?.callbacks;
    return {
      enabled: true,
      usePointStyle: this.hideLegendOnHint || !!tooltipCallbacks?.labelPointStyle,
      ...replaceTooltipColors(this.tooltip),
      callbacks: {
        ...tooltipCallbacks,
        labelPointStyle: !this.hideLegendOnHint ? tooltipCallbacks?.labelPointStyle :
          (() => {
            return {
              pointStyle: false,
            };
          }),
      },
    };
  };

  getOptions: any = () => {
    const options = {
      ...this.options,
      indexAxis: this.horizontal ? 'y' : 'x',
      layout: {
        padding: this.margin,
      },
      interaction: this.interaction,
      plugins: {
        palette: {
          forceOverride: true,
          theme: this.palette,
          customColors: this.customColors,  
        },
        title: this.chartTitle,
        legend: {
          ...this.legend,
          display: !this.hideLegend,
        },
        tooltip: this.getTooltipOptions(),
        datalabels: {
          display: false,
          ...this.dataLabels,
        },
      },
      scales: {
        ...(this.options.scales || {}),
        x: {
          grid: this.verticalGridLines,
          ...this.xAxis,
          stacked: this.stacked,
        },
        y: {
          grid: this.horizontalGridLines,
          ...this.yAxis,
          stacked: this.stacked,
        },
      },
    };
    return options;
  };

  getData() {
    return this.data;
  }

  private handleResize = () => {
    if (this.chart) {
      this.chart.resize();
      this.chart.update();
    }
  };

  showChart() {
    const data  = this.getData() || {};
    const options = this.getOptions() || {};

    if (!this.chart) {
      // @ts-ignore
      const canvas = this.shadowRoot.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        // @ts-ignore
        this.chart = new Chart(ctx, {
          type: this.type,
          data,
          options,
        });
      }
    } else {
      this.chart.type = this.type;
      this.chart.data = data;
      this.chart.options = options;
      this.chart.update();
    }
  }

  render() {
    const width = this.width ? `${this.width}px` : '100%';
    const height = this.height ? `${this.height}px` : '100%';
    return html`
      <div style="width: ${width}; height: ${height}">
        <canvas></canvas>
      </div>
    `;
  }
}
