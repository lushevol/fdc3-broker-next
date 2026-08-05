import { property } from 'lit/decorators.js';
import { Chart, RadarController, LineElement, PointElement, RadialLinearScale } from 'chart.js';
import { ScBaseChart } from './common/ScBaseChart.js';
import { replaceDataColors } from '../shared/util.js';

export class ScRadarChart extends ScBaseChart {
  constructor() {
    super();

    Chart.register(RadarController, LineElement, PointElement, RadialLinearScale);
  }

  @property({ type: String, attribute: false }) type = 'radar';

  getData() {
    const data = JSON.parse(JSON.stringify(this.data));
    // override backgroundColor in data if has colors
    if (this.colors.length > 0 && data.datasets.length > 0) {
      data.datasets.forEach((dataset: any, index: number) => {
        dataset.backgroundColor = this.colors[index] || dataset.backgroundColor;
      });
    }
    return replaceDataColors(data);
  }

  getOptions: any = () => {
    const options = {
      ...this.options,
      elements: {
        line: {
          borderWidth: 3,
        },
      },
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
