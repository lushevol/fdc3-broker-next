import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import '@scdevkit/webkit-datavis/elements';

const LineData = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ],
  datasets: [
    {
      label: ()=> html`<sc-link>Data1</sc-link>`,
      data: [55, 59, 80, 45, 37, 60],
    },
    {
      label: 'Data2',
      data: [71, 56, 32, 41, 65, 52],
    },
  ],
};

const LineTensionData = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ],
  datasets: [
    {
      label: 'Data1',
      data: [55, 59, 80, 45, 37, 60],
      tension: 0.4,
    },
    {
      label: 'Data2',
      data: [71, 56, 32, 41, 65, 52],
      tension: 0.4,
    },
  ],
};

const LinePointData = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ],
  datasets: [
    {
      label: 'Data1',
      data: [55, 59, 80, 45, 37, 60],
      pointStyle: 'rect',
    },
    {
      label: 'Data2',
      data: [71, 56, 32, 41, 65, 52],
      pointStyle: false,
    },
  ],
};

const LineTimeData = {
  datasets: [
    {
      label: 'Data1',
      data: [
        {
          x: '2024-06-24',
          y: 55,
        },
        {
          x: '2024-06-25',
          y: 59,
        },
        {
          x: '2024-06-26',
          y: 80,
        },
        {
          x: '2024-06-27',
          y: 45,
        },
        {
          x: '2024-06-28',
          y: 37,
        },
      ],
    },
    {
      label: 'Data2',
      data: [
        {
          x: '2024-06-24',
          y: 71,
        },
        {
          x: '2024-06-25',
          y: 56,
        },
        {
          x: '2024-06-26',
          y: 32,
        },
        {
          x: '2024-06-27',
          y: 41,
        },
        {
          x: '2024-06-28',
          y: 65,
        },
      ],
    },
  ],
};

export default {
  title: 'Data Visualisation/Line Chart',
  component: 'sc-line-chart',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '',
      },
    },
  },
  argTypes: {
    data: {
      control: 'object',
      description: 'Sets the chart data',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    width: {
      control: 'number',
      description: 'Sets chart width',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    height: {
      control: 'number',
      description: 'Sets chart height',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'chart-title': {
      control: 'object',
      description: 'Sets the chart title',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    palette: {
      control: 'inline-radio',
      description: 'Sets the color palette for the chart',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
        defaultValue: { summary: 'default' },
      },
      options: ['default', 'risk', 'accessible', 'custom'],
    },
    'custom-colors': {
      control: 'array',
      description: 
        'Sets the custom colors for the chart.\n\n' +
        'Eg. ["--sc-color-blue-400", "--sc-color-olive-500", "--sc-color-orange-400"].\n\n' +
        'Hex/rgb are **not** supported. ' +
        'See [figma](https://www.figma.com/design/QlWDegEER5VGZocSZXXS1b/SC-Global-Design-System--GDS--Components?node-id=379-3719)',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
      if: { arg: 'palette', eq: 'custom' },
    },
    'hide-legend': {
      control: 'boolean',
      description: 'Sets if hide legend on chart.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    legend: {
      control: 'object',
      description: 'Sets the chart legend',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    interaction: {
      control: 'object',
      description: 'Sets the chart interaction',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    tooltip: {
      control: 'object',
      description: 'Sets the chart tooltip',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    'x-axis': {
      control: 'object',
      description: 'Sets the x Axis',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    'y-axis': {
      control: 'object',
      description: 'Sets the x Axis',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    'horizontal-grid-lines': {
      control: 'object',
      description: 'Sets the horizontal grid lines',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    'vertical-grid-lines': {
      control: 'object',
      description: 'Sets the vertical grid lines',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    margin: {
      control: 'object',
      description: 'Sets the chart margin',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    'hide-legend-on-hint': {
      control: 'boolean',
      description: 'Sets if hide legend on tooltip.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
  },
  args: {
    data: LineData,
    width: 600,
    height: 300,
    'chart-title': {},
    palette: 'default',
    'custom-colors': ['--sc-color-blue-400', '--sc-color-olive-500', '--sc-color-orange-400'],
    'hide-legend': false,
    legend: {
      position: 'top',
    },
    interaction: {},
    tooltip: {},
    'x-axis': {},
    'y-axis': {
      min: 20,
      max: 100,
    },
    'horizontal-grid-lines': {},
    'vertical-grid-lines': {
      display: false,
    },
    margin: {},
    'hide-legend-on-hint': false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  data: object;
  width: number;
  height: number;
  'chart-title': object;
  palette: string;
  'custom-colors': string[];
  'hide-legend': boolean;
  legend: object;
  interaction: object;
  tooltip: object;
  'x-axis': object;
  'y-axis': object;
  margin: object;
  'horizontal-grid-lines': object;
  'vertical-grid-lines': object;
  'hide-legend-on-hint': boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div>
    <sc-line-chart
      .data=${props.data}
      .width=${props.width}
      .height=${props.height}
      chart-title=${JSON.stringify(props['chart-title'])}
      palette=${props.palette}
      custom-colors=${JSON.stringify(props['custom-colors'])}
      .legend=${props.legend}
      .interaction=${props.interaction}
      .tooltip=${props.tooltip}
      x-axis=${JSON.stringify(props['x-axis'])}
      y-axis=${JSON.stringify(props['y-axis'])}
      .margin=${props.margin}
      ?hide-legend=${props['hide-legend']}
      horizontal-grid-lines=${JSON.stringify(props['horizontal-grid-lines'])}
      vertical-grid-lines=${JSON.stringify(props['vertical-grid-lines'])}
      ?hide-legend-on-hint=${props['hide-legend-on-hint']}
    >
    </sc-line-chart>
  </div>
  <script type="module">
    /*
      To use the data visualisation, please follow the steps below:
      1. run npm install @scdevkit/webkit-datavis@latest
      2. import '@scdevkit/webkit-datavis/elements' in the entry html file or js file
    */

    const data = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
      ],
      datasets: [
        {
          label: 'Data1',
          data: [55, 59, 80, 45, 37, 60],
        },
        {
          label: 'Data2',
          data: [71, 56, 32, 41, 65, 52],
        },
      ],
    };

    // if no width and height attribute, will display chart based on container size
    const width = 600;
    const height = 300;

    // if no this attribute, not display title by default
    const title = {
      display: true,
      text: 'Line Chart',
      font: {
        size: 16,
      },
    };

    // if no this attribute, will display legend on the top as default
    const legend = {
      position: 'top',
    };

    // if no this attribute, default mode is nearest
    const interaction = {
      mode: 'index',
    };

    /*
      if no this attribute, will display default tooltip
      supported pointStyle values: 'circle', 'cross', 'crossRot', 'dash',
      'line', 'rect', 'rectRounded', 'rectRot', 'star', 'triangle', false
    */
    const tooltip = {
      titleAlign: 'left',
      titleMarginBottom: 8,
      padding: 8,
      bodySpacing: 4,
      interaction: {
        mode: 'index',
      },
      callbacks: {
        labelPointStyle: () => {
          return {
            pointStyle: 'triangle',
          };
        },
        footer: (tooltipItems) => {
          let sum = 0;

          tooltipItems.forEach((tooltipItem) => {
            sum += tooltipItem.parsed.y;
          });
          return 'Sum: ' + sum;
        },
      },
    };

    // if no this attribute, will display default xAxis
    const xAxis = {
      ticks: {
        display: false,
      },
    };
    // if no this attribute, will display default yAxis
    const yAxis = {
      min: 20,
      max: 100,
    };

    // set chart margin value
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  
    // set the horizontal grid lines
    const horizontalGridLines = {
      display: true,
    };

    // set the vertical grid lines
    const verticalGridLines = {
      display: false,
    };

    // if no this attribute, default value is false
    const hideLegend = false;

    // if no this attribute, default value is false
    const hideLegendOnHint = true;

    /**
    * <sc-line-chart
    * .data=\${data}
    * .width=\${width}
    * .height=\${height}
    * chart-title=\${JSON.stringify(title)}
    * .legend=\${legend}
    * .interaction=\${interaction}
    * .tooltip=\${tooltip}
    * x-axis=\${JSON.stringify(xAxis)}
    * y-axis=\${JSON.stringify(yAxis)}
    * .margin=\${margin}
    * ?hide-legend=\${hideLegend}
    * horizontal-grid-lines=\${JSON.stringify(horizontalGridLines)}
    * vertical-grid-lines=\${JSON.stringify(verticalGridLines)}
    * ?hide-legend-on-hint=\${hideLegendOnHint}
    * >
    * </sc-line-chart>
    */
  </script>
`;

export const Default = Template.bind({});
Default.args = {
  data: LineData,
};

export const ChartWithTension = Template.bind({});
ChartWithTension.args = {
  data: LineTensionData,
};

export const ChartWithPointStyle = Template.bind({});
ChartWithPointStyle.args = {
  data: LinePointData,
};

export const ChartWithTitle = Template.bind({});
ChartWithTitle.args = {
  data: LineData,
  'chart-title': {
    display: true,
    text: 'Line Chart',
    font: {
      size: 16,
    },
  },
};

export const ChartWithCustomizedTooltip = Template.bind({});
ChartWithCustomizedTooltip.args = {
  data: LineData,
  tooltip: {
    titleAlign: 'left',
    titleMarginBottom: 8,
    padding: 8,
    bodySpacing: 4,
    interaction: {
      mode: 'index',
    },
    callbacks: {
      labelPointStyle: () => {
        return {
          pointStyle: 'triangle',
        };
      },
      footer: (tooltipItems: any) => {
        let sum = 0;
      
        tooltipItems.forEach((tooltipItem: any) => {
          sum += tooltipItem.parsed.y;
        });
        return `Sum: ${  sum}`;
      },
    },
  },
};

export const ChartWithTimeAxis = Template.bind({});
ChartWithTimeAxis.args = {
  data: LineTimeData,
  'x-axis': {
    type: 'time',
    time: {
      unit: 'day',
      tooltipFormat: 'MMM DD',
    },
  },
};
