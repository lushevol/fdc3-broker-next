import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/extensions
import '@scdevkit/webkit-datavis/elements';

export default {
  title: 'Data Visualisation/Gauge Chart',
  component: 'sc-gauge-chart',
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
    min: {
      control: 'number',
      description: 'Sets chart min value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
    },
    max: {
      control: 'number',
      description: 'Sets chart max value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 100 },
        category: 'Attributes',
      },
    },
    value: {
      control: 'number',
      description: 'Sets chart value',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'value-size': {
      control: 'number',
      description: 'Sets font size of chart value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 24 },
        category: 'Attributes',
      },
    },
    'label-size': {
      control: 'number',
      description: 'Sets font size of chart label',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 14 },
        category: 'Attributes',
      },
    },
    'custom-color': {
      control: 'text',
      description: `Sets color of gauge chart. 
      For all colors, please refer <a href=\'index.html?path=/story/colors--all\'>here</a>`,
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'value-color': {
      control: 'text',
      description: `Sets font color of value. 
      For all colors, please refer <a href=\'index.html?path=/story/colors--all\'>here</a>`,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '--sc-color-grey-600' },
        category: 'Attributes',
      },
    },
    'label-color': {
      control: 'text',
      description: `Sets font color of label. 
      For all colors, please refer <a href=\'index.html?path=/story/colors--all\'>here</a>`,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '--sc-color-grey-600' },
        category: 'Attributes',
      },
    },
    donut: {
      control: 'boolean',
      description: 'Sets if show donut chart',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
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
    margin: {
      control: 'object',
      description: 'Sets the chart margin',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
  },
  args: {
    width: 400,
    height: 400,
    min: 0,
    max: 100,
    value: 20,
    'value-size': 24,
    'label-size': 14,
    'custom-color': '',
    'value-color': '--sc-color-grey-600',
    'label-color': '--sc-color-grey-600',
    donut: false,
    'chart-title': {},
    margin: {},
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  width: number;
  height: number;
  min: number;
  max: number;
  value: number;
  'value-size': number;
  'label-size': number;
  'custom-color': string;
  'value-color': string;
  'label-color': string
  donut: boolean;
  'chart-title': object;
  margin: object;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div>
    <sc-gauge-chart
      .width=${props.width}
      .height=${props.height}
      .min=${props.min}
      .max=${props.max}
      .value=${props.value}
      value-size=${props['value-size']}
      label-size=${props['label-size']}
      custom-color=${props['custom-color']}
      value-color=${props['value-color']}
      label-color=${props['label-color']}
      .donut=${props.donut}
      chart-title=${JSON.stringify(props['chart-title'])}
      .margin=${props.margin}
    >
    </sc-gauge-chart>
  </div>
  <script type="module">
    /*
      To use the data visualisation, please follow the steps below:
      1. run npm install @scdevkit/webkit-datavis@latest
      2. import '@scdevkit/webkit-datavis/elements' in the entry html file or js file
    */

    // if no width and height attribute, will display chart based on container size
    const width = 400;
    const height = 400;

    const min = 0;
    const max = 100;
    const value = 20;
    const valueSize = 32;
    const labelSize = 16;
    const valueColor = '--sc-color-green';
    const labelColor = '--sc-color-blue';
    const donut = false;

    // if no this attribute, not display title by default
    const title = {
      display: true,
      text: 'Doughnut Chart',
      font: {
        size: 16,
      },
    };

    // set chart margin value
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    /**
    * <sc-gauge-chart
    * .width=\${width}
    * .height=\${height}
    * min=\${min}
    * max=\${max}
    * value=\${value}
    * value-size=\${valueSize}
    * label-size=\${labelSize}
    * custom-color=\${customColor}
    * value-color=\${valueColor}
    * label-color=\${labelColor}
    * ?donut=\${donut}
    * chart-title=\${JSON.stringify(title)}
    * .margin=\${margin}
    * >
    * </sc-gauge-chart>
    */
  </script>
`;

export const Default = Template.bind({});
Default.args = {
  min: 0,
  max: 100,
  value: 20,
};

export const ChartWithCustomizedStyle = Template.bind({});
ChartWithCustomizedStyle.args = {
  min: 0,
  max: 100,
  value: 20,
  'value-size': 32,
  'custom-color': '--sc-color-green-500',
  'label-size': 12,
  'label-color': '--sc-color-blue-darker',
};

export const ChartWithDonut = Template.bind({});
ChartWithDonut.args = {
  min: 0,
  max: 100,
  value: 20,
  donut: true,
};
