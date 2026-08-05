import { property } from 'lit/decorators.js';
import { Chart, DoughnutController, ArcElement } from 'chart.js';
import { ScBaseChart } from './common/ScBaseChart.js';
import { replaceDataColors } from '../shared/util.js';

export class ScDoughnutChart extends ScBaseChart {
  constructor() {
    super();

    Chart.register(DoughnutController, ArcElement);
  }

  @property({ type: String, attribute: false }) type = 'doughnut';

  getData() {
    const data = JSON.parse(JSON.stringify(this.data));
    // override backgroundColor in data if has colors
    if (this.colors.length > 0 && data.datasets.length > 0) {
      data.datasets.forEach((dataset: any) => {
        const bgColors = dataset.backgroundColor;
        if (Array.isArray(bgColors)) {
          bgColors.forEach((color: string, index: number) => {
            bgColors[index] = this.colors[index] || color;
          });
        } else {
          dataset.backgroundColor = this.colors.slice(0, this.colors.length) || bgColors;
        }
      });
    }
    return replaceDataColors(data);
  }

  getOptions: any = () => {
    const options = {
      ...this.options,
      layout: {
        padding: this.margin,
      },
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
    };
    return options;
  };
}
