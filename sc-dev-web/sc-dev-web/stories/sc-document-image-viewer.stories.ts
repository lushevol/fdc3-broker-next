import { html, TemplateResult } from 'lit';
import {
  SwooshExtractionProps,
  DocumentProps,
} from '../src/components/ScDocumentImageViewer/ScDocumentImageViewer.js';

const data = {
  name: 'test.pdf',
  pages: [
    'images/img_doc_pg1.png',
    'images/img_doc_pg2.png',
  ],
};

const selections = [
  {
    name: 'Test Entity1',
    value: 'communicates',
    confidence: 90.0,
    pageNo: 1,
    xmin: 465,
    xmax: 714,
    ymin: 972,
    ymax: 1001,
  },
  {
    name: 'Test Entity2',
    value: 'add-on',
    confidence: 70.0,
    pageNo: 1,
    xmin: 1794,
    xmax: 1921,
    ymin: 592,
    ymax: 627,
  },
  {
    name: 'Test Entity3',
    value: 'DocuShare',
    confidence: 70.0,
    pageNo: 1,
    xmin: 1543,
    xmax: 1734,
    ymin: 361,
    ymax: 392,
  },

];

export default {
  title: 'Viewer/Document Image Viewer',
  component: 'sc-document-image-viewer',
  parameters: {
    docs: {
      description: {
        component: 'Document Image Viewer.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {},
    selections: [],
  },
  args: {
    data,
    selections,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  data: DocumentProps,
  selections?: SwooshExtractionProps[],

}

const Template: Story<ArgTypes> = ({

}: ArgTypes) =>
  html`
    <sc-document-image-viewer
      .data= ${data}
      .selections=${selections}
    >
    </sc-document-image-viewer> 
  `;

export const Default = Template.bind({});
Default.args = {
};


