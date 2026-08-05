import { html, TemplateResult } from 'lit';
// @ts-ignore
import { MainIconLibrary } from '@scdevkit/icons/libraries/MainIconLibrary.js';
// eslint-disable-next-line import/extensions
import '@scdevkit/form/elements';
// @ts-ignore
window.MainIconLibrary = MainIconLibrary;

export default {
  title: 'Form/Form Editor',
  component: 'sc-form-editor',
  parameters: {
    docs: {
      description: {
        component:
          `Form editor is used to design a form with many components and layouts.
          To learn more, please go
          <sc-link href='/form-designer/editor' target='_blank'>Form Designer</sc-link>`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'form-updated': {
      description: `Emitted when add new components or edit the form, 
        can get the form definition from the event.detail.definition.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  definition: object;
  data: object;
  readonly: boolean;
}

const Template: Story<ArgTypes> = () =>
  html`
    <sc-icon-provider id='sc-icon-provider'>
      <sc-form-editor></sc-form-editor>
    </sc-icon-provider>
    <script type="module">
      // import { CountryIconLibrary, MainIconLibrary } from '@scdevkit/icons';
      document.getElementById('sc-icon-provider').iconLibraries = [
        window.MainIconLibrary
      ];
    </script>
  `;

export const Default = Template.bind({});
Default.args = {};
