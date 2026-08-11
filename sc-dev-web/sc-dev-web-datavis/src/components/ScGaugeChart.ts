import { property } from 'lit/decorators.js';
// @ts-ignore
import BasicDefinitions from '@scdevkit/webkit/styles/ScBasicDefinitions.js';
import { Chart, DoughnutController, ArcElement } from 'chart.js';
import { ScBaseChart } from './common/ScBaseChart.js';
import '../plugins/LabelPlugin.js';
import { getCssVariable } from '../plugins/PalettePlugin.js';

const valueColorMapping = [
  BasicDefinitions.colorMapping['--sc-color-green-250'],
  BasicDefinitions.colorMapping['--sc-color-green-500'],
  BasicDefinitions.colorMapping['--sc-color-amber-500'],
  BasicDefinitions.colorMapping['--sc-color-amber-600'],
  BasicDefinitions.colorMapping['--sc-color-red-500'],
  BasicDefinitions.colorMapping['--sc-color-red-500'],
];

export class ScGaugeChart extends ScBaseChart {
  constructor() {
    super();

    Chart.register(DoughnutController, ArcElement);
  }

  @property({ type: String, attribute: false }) type = 'doughnut';

  @property({ type: Number }) min = 0;

  @property({ type: Number }) max = 100;

  @property({ type: Number }) value: number;

  @property({ type: Number, attribute: 'value-size' }) valueSize = 24;

  @property({ type: Number, attribute: 'label-size' }) labelSize = 14;

  @property({ type: String, attribute: 'custom-color' }) customColor = '';

  @property({ type: String, attribute: 'value-color' }) valueColor = '--sc-color-grey-650';

  @property({ type: String, attribute: 'label-color' }) labelColor = '--sc-color-grey-650';

  @property({ type: Boolean }) donut = false;

  getData() {
    const { value, min, max, customColor } = this;

    return {
      datasets: [{
        data: [value - min, max - value],
        backgroundColor: [
          customColor && customColor.trim() !== '' && customColor.startsWith('--sc-color-')
            ? getCssVariable(customColor) 
            : valueColorMapping[Math.floor((value - min) / (max - min) * 5)],
          BasicDefinitions.colorMapping['--sc-color-grey-100'],
        ],
      }],
    };
  }

  getOptions: any = () => {
    const valueColor = BasicDefinitions.colorMapping[this.valueColor];
    const labelColor = BasicDefinitions.colorMapping[this.labelColor];
    const donutOptions = this.donut ? {
      cutout: '90%',
    } : {
      circumference: 180,
      rotation: -90,
      cutout: '90%',
    };
    const labels = [
      {
        text: this.value,
        color: valueColor,
        font: {
          size: this.valueSize,
          weight: 600,
        },
      },
      {
        text: this.min,
        position: 'left',
        color: labelColor,
        font: {
          size: this.labelSize,
        },
      },
      {
        text: this.max,
        position: 'right',
        color: labelColor,
        font: {
          size: this.labelSize,
        },
      },
    ];

    const options = {
      ...this.options,
      ...donutOptions,
      layout: {
        padding: this.margin,
      },
      events: [],
      plugins: {
        title: this.chartTitle,
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        gaugelabel: {
          donut: this.donut,
          labels: this.donut ? labels.slice(0, 1) : labels,
        },
        datalabels: {
          display: false,
          ...this.dataLabels,
        },
      },
    };
    return options;
  };
}
