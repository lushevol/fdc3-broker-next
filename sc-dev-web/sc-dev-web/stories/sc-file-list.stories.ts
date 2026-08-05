import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/File/File List',
  component: 'sc-file-list',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'File list shows file item in either horizontal or vertical manner.',
      },
    },
  },
  argTypes: {
    direction: {
      type: '"horizontal" | "vertical"',
      description: 'The direction of the file list.',
      options: ['horizontal', 'vertical'],
      control: 'inline-radio',
      table: { 
        defaultValue: { summary: 'vertical' },
        category: 'Attributes',
      },
    },
    'sc-select-items': {
      description: 'Emitted when select the file name. Get details of all the files listed by looping through the array from event.detail.value.currentFiles.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-remove-items': {
      description: 'Emitted when click on the delete icon. Get details of the remaining files listed by looping through the array from event.detail.value.currentFiles and get details of the removed files by looping through the array from event.detail.value.removedItems.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-cancel-items': {
      description: 'Emitted when click on the cancel icon only in uploading status. Get details of all the files listed by looping through the array from event.detail.value.currentFiles.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-loaded-items': {
      description: 'Emitted when the status change. Get details of all the files listed by looping through the array from event.detail.value.currentFiles.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    direction: 'vertical',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  direction?: 'horizontal' | 'vertical';
}

const DefaultTemplate: Story<ArgTypes> = ({
  direction = 'vertical',
}: ArgTypes) => html`
  <div style="width:${direction === 'vertical' ? '50%' : '100%'}">
    <sc-file-list
      direction=${direction}
    >
      <sc-file-item name="Config & Cluster information.docx" size="4000" width="auto"></sc-file-item>
      <sc-file-item name="Create your first Pods.docx" size="300" width="auto"></sc-file-item>
      <sc-file-item name="Creating Deployments.docx" size="20000000" width="auto"></sc-file-item>
    </sc-file-list>
  </div>
`;

export const Default = DefaultTemplate.bind({});
Default.args = {
  direction: 'vertical',
};

export const Horizontal = DefaultTemplate.bind({});
Horizontal.args = {
  direction: 'horizontal',
};
