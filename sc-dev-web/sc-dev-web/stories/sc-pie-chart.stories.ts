import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import '@scdevkit/webkit-datavis/elements';

const PieData = {
  labels: [
    'App1',
    'App2',
    'App3',
    'App4',
    'App5',
  ],
  datasets: [{
    label: 'App Dataset',
    data: [90, 70, 50, 20, 10],
    hoverOffset: 4,
  }],
};

export default {
  title: 'Data Visualisation/Pie Chart',
  component: 'sc-pie-chart',
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
    tooltip: {
      control: 'object',
      description: 'Sets the chart tooltip',
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
    data: PieData,
    width: 400,
    height: 400,
    'chart-title': {},
    palette: 'default',
    'custom-colors': ['--sc-color-blue-400', '--sc-color-olive-500', '--sc-color-orange-400'],
    'hide-legend': false,
    legend: {
      position: 'top',
    },
    tooltip: {},
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
  tooltip: object;
  margin: object;
  'hide-legend-on-hint': boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div>
    <sc-pie-chart
      .data=${props.data}
      .width=${props.width}
      .height=${props.height}
      chart-title=${JSON.stringify(props['chart-title'])}
      palette=${props.palette}
      custom-colors=${JSON.stringify(props['custom-colors'])}
      .legend=${props.legend}
      .tooltip=${props.tooltip}
      .margin=${props.margin}
      ?hide-legend=${props['hide-legend']}
      ?hide-legend-on-hint=${props['hide-legend-on-hint']}
    >
    </sc-pie-chart>
  </div>
  <script type="module">
    /*
      To use the data visualisation, please follow the steps below:
      1. run npm install @scdevkit/webkit-datavis@latest
      2. import '@scdevkit/webkit-datavis/elements' in the entry html file or js file
    */

    const data = {
      labels: [
        'App1',
        'App2',
        'App3',
        'App4',
        'App5',
      ],
      datasets: [{
        label: 'App Dataset',
        data: [90, 70, 50, 20, 10],
        hoverOffset: 4,
      }],
    };

    // if no width and height attribute, will display chart based on container size
    const width = 400;
    const height = 400;

    // if no this attribute, not display title by default
    const title = {
      display: true,
      text: 'Pie Chart',
      font: {
        size: 16,
      },
    };

    // if no this attribute, will display legend on the top as default
    const legend = {
      position: 'top',
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

    // set chart margin value
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // if no this attribute, default value is false
    const hideLegend = false;

    // if no this attribute, default value is false
    const hideLegendOnHint = true;
    /**
    * <sc-pie-chart
    * .data=\${data}
    * .width=\${width}
    * .height=\${height}
    * chart-title=\${JSON.stringify(title)}
    * .legend=\${legend}
    * .tooltip=\${tooltip}
    * .margin=\${margin}
    * ?hide-legend=\${hideLegend}
    * ?hide-legend-on-hint=\${hideLegendOnHint}
    * >
    * </sc-pie-chart>
    */
  </script>
`;

export const Default = Template.bind({});
Default.args = {
  data: PieData,
};

export const ChartWithoutLegend = Template.bind({});
ChartWithoutLegend.args = {
  data: PieData,
  'hide-legend': true,
};

export const ChartWithoutLegendOnHint = Template.bind({});
ChartWithoutLegendOnHint.args = {
  data: PieData,
  'hide-legend-on-hint': true,
};
