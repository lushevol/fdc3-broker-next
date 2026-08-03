import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import '@scdevkit/webkit-datavis/elements';

const AreaData = {
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
      pointStyle: false,
      tension: 0.4,
    },
    {
      label: 'Data2',
      data: [71, 56, 32, 41, 65, 52],
      pointStyle: false,
      tension: 0.4,
    },
  ],
};

const AreaPointData = {
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

const AreaNoTensionData = {
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

export default {
  title: 'Data Visualisation/Area Chart',
  component: 'sc-area-chart',
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
    fill: {
      control: 'text',
      description: 'Set the chart fill.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'origin' },
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
    data: AreaData,
    fill: 'origin',
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
    'horizontal-grid-lines': {
      display: false,
    },
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
  fill: any;
  width: number;
  height: number;
  'chart-title': object;
  palette: string;
  'custom-colors': string[];
  'hide-legend': boolean;
  legend: object;
  interaction: object,
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
    <sc-area-chart
      .data=${props.data}
      .fill=${props.fill}
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
    </sc-area-chart>
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
          pointStyle: false,
          tension: 0.4,  // no tension if don't set this attribute
        },
        {
          label: 'Data2',
          data: [71, 56, 32, 41, 65, 52],
          pointStyle: false,
          tension: 0.4,
        },
      ],
    };

    // area fill attribute, can be origin, start, end
    const fill = 'origin';

    // if no width and height attribute, will display chart based on container size
    const width = 600;
    const height = 300;

    // if no this attribute, not display title by default
    const title = {
      display: true,
      text: 'Area Chart',
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
      callbacks: {
        labelPointStyle: () => {
          return {
            pointStyle: 'triangle',
          };
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
    * <sc-area-chart
    * .data=\${data}
    * .fill=\${fill}
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
    * </sc-area-chart>
    */
  </script>
`;

export const Default = Template.bind({});
Default.args = {
  data: AreaData,
};

export const ChartWithPoint = Template.bind({});
ChartWithPoint.args = {
  data: AreaPointData,
};

export const ChartWithNoTension = Template.bind({});
ChartWithNoTension.args = {
  data: AreaNoTensionData,
};

export const ChartWithNoTooltip = Template.bind({});
ChartWithNoTooltip.args = {
  data: AreaNoTensionData,
  tooltip: {
    enabled: false,
  },
};

export const ChartWithTitleAndLegendAtBottom = Template.bind({});
ChartWithTitleAndLegendAtBottom.args = {
  data: AreaData,
  legend: {
    position: 'bottom',
  },
  'chart-title': {
    display: true,
    text: 'Area Chart',
    font: {
      size: 18,
    },
  },
};
