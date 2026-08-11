import { html, TemplateResult } from 'lit';

const DUMMY_TEXT = Array.from(
  { length: 20 },
  () =>
    html`<p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco commodo consequat
    </p>`
);


export default {
  title: 'Components/ScrollToTop',
  component: 'sc-scroll-to-top',
  parameters: {
    docs: {
      description: {
        component:
          'Scroll To Top has a button to scroll the element window to the top',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'help-text': {
      control: 'text',
      description: 'Help text that will appear as tooltip.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'ref-element-id': {
      control: 'text',
      description: 'Element Id of the element if the scroll to top button'
      + 'is added to element other than window element.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'scroll-duration': {
      control: 'number',
      description: 'Scroll duration in milliseconds.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    }, 
    'scroll-threshold': {
      control: 'number',
      description: 'The scrolling threshold after which the scroll to top button should appear.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
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
  'help-text'?: string;
  'ref-element-id'?: string;
  'scroll-duration'?: number;
  'scroll-threshold'?: number;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    ${props['ref-element-id']
    ? html`
        <div class='scrollableDiv' id='scrolled-div' style='height:500px; 
        overflow-y: auto; border:1px padding: 10px; position: relative;'>
          ${DUMMY_TEXT}
        </div> `
    : html` ${DUMMY_TEXT} `}
    <sc-scroll-to-top
      help-text=${props['help-text']}
      ref-element-id=${props['ref-element-id']}
      scroll-duration=${props['scroll-duration']}
      scroll-threshold=${props['scroll-threshold']}
    ></sc-scroll-to-top>
  `;
};

export const Default = Template.bind({});
Default.args = {
  'help-text': 'Go to top',
  'ref-element-id': undefined,
};

const InsideDivElementTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <div class='scrollableDiv' id='inside-scrolled-div' 
  style= 'height:500px; overflow-y: auto; border:1px padding: 10px; position: relative;'>
    ${DUMMY_TEXT}
  </div>
  <sc-scroll-to-top
    scroll-threshold='200'
    ref-element-id='inside-scrolled-div'
    help-text=${props['help-text']}
    scroll-duration=${props['scroll-duration']}
    scroll-threshold=${props['scroll-threshold']}
  ></sc-scroll-to-top>
`;

export const InsideDivElement = InsideDivElementTemplate.bind({});
InsideDivElement.args = {
  'help-text': 'Go to top',
  'ref-element-id': 'scrollable-div',
  'scroll-duration': 500,
  'scroll-threshold': 400,
};

const SecondElement: Story<ArgTypes> = (props: ArgTypes) => html`
  ${DUMMY_TEXT}
  <sc-scroll-to-top
    help-text=${props['help-text']}
    ref-element-id=${props['ref-element-id']}
    scroll-duration=${props['scroll-duration']}
    scroll-threshold=${props['scroll-threshold']}
  ></sc-scroll-to-top>
`;

export const WithThreshold = SecondElement.bind({});
WithThreshold.args = {
  'help-text': 'Go to top',
  'ref-element-id': undefined,
  'scroll-duration': 200,
  'scroll-threshold': 380,
};

export const WithscrollDuration = SecondElement.bind({});
WithscrollDuration.args = {
  'help-text': 'Go to top',
  'ref-element-id': undefined,
  'scroll-duration': 2000,
  'scroll-threshold': 380,
};