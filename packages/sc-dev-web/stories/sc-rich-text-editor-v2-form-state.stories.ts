import { ScRichTextEditorV2 } from '@scdevkit/webkit-rte/dist/elements/sc-rich-text-editor-v2.js';
import { EditorManager } from 'hugerte';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FormArgTypes } from './utils/FormArg.js';

const toolbar = [
  'undo',
  'redo',
  'separate',
  'fontstyle',
];

export default {
  title: 'Components/Text Editor V2/Form State',
  component: 'sc-rich-text-editor-v2',
  parameters: {
    docs: {
      description: {
        component: `
          States based on Form Input Base applicable for the Text Editor V2
        `,
      },
    },
  },
  tags: ['autodocs'],

};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  toolbar?: string[];
  'show-count': boolean;
  shortcut: boolean;
  'max-length': number;
  'disable-spellcheck': boolean;
  revisions: ScRichTextEditorV2['revisions'];
  'ext-config'?: EditorManager['defaultOptions'];
  placeholder?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-rich-text-editor-v2
      .toolbar=${props.toolbar as any}
      value=${props.value}
      ?error=${props.error}
      error-message=${ifDefined(props['error-message'])}
      ?success=${props.success}
      success-message=${ifDefined(props['success-message'])}  
      ?readonly=${props['readonly']}
      max-length=${props['max-length']}
      label=${ifDefined(props['label'])} 
      tooltip=${ifDefined(props['tooltip'])}
      hint=${ifDefined(props['hint'])}
      placeholder=${props.placeholder}
    >
    </sc-rich-text-editor-v2>
  `;
};

export const Default = Template.bind({});
Default.args = {
    toolbar,
};


export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  error: true,
  'error-message': 'Test Error Message 123',
};

export const Success = Template.bind({});
Success.args = {
  ...Default.args,
  success: true,
  'success-message': 'Test Success Message 123',
};

export const Placeholder = Template.bind({});
Placeholder.args = {
  ...Default.args,
  placeholder: 'Test Placeholder 123',
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  ...Default.args,
  tooltip: 'Test Tooltip 123',
};
export const Label = Template.bind({});
Label.args = {
  ...Default.args,
  label: 'Test Label 123',
};

export const Hint = Template.bind({});
Hint.args = {
  ...Default.args,
  hint: 'Test Hint 123',
};
