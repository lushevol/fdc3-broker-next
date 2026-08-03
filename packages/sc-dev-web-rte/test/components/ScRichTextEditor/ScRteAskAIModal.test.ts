import { html } from 'lit';
import { fixture, expect, aTimeout } from '@open-wc/testing';
import { ScRteAskAIModal } from '../../../src/components/ScRichTextEditor/ScRteAskAIModal.js';
import { ScRichTextEditorV2 } from '../../../src/components/ScRichTextEditor/ScRichTextEditorV2.js';
import '../../../elements/sc-rich-text-editor-v2.js';
import { messagesRequestTemplateData } from '../../../src/components/ScRichTextEditor/utils.js';
import { expect as gExpect } from '@jest/globals';

jest.mock('marked', () => {
  return {
    __esModule: true,
    marked: {
      Renderer: class {
        constructor() {}
      },
      setOptions: jest.fn((options: any) => {}),
      parse: jest.fn((content: string) => `${content}`),
    },
  };
});

const mockEditorInstance = {
  value: 'test value 123 123',
  dom: {
    create() {
      return 'test node';
    },
    insertAfter() {},
  },
  selection: {
    getNode() {
      return '<p>test</p>';
    },
    isCollapsed() {
      return false;
    },
    getContent() {
      return 'test';
    },
  },
  focus() {},
  setContent(value: string) {
    this.value = value;
  },
  getBody() {
    return html`<body>111</body>`;
  },
  getContent () {
    return this.value;
  },
  execCommand: () => {},
  mode: {
    set: (sampleString: string) => {  },
  },
} as any;

describe('ScRteAskAIModal', () => {
  let mockRequestAnimationFrame: any;
  const rte = new ScRichTextEditorV2();
  rte.editorInstance = mockEditorInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestAnimationFrame = jest.spyOn(window,'requestAnimationFrame');
    mockRequestAnimationFrame.mockImplementation(():any=>{});
    Object.defineProperty(window, 'scrollTo', {
      value: jest.fn(),
      writable: true,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      value: jest.fn(),
      writable: true,
    });
  });
  it('renders ask AI modal with api request', async () => {
    const el = await fixture<ScRteAskAIModal>(html`<sc-rte-ask-ai-modal
      .editor=${rte.editorInstance}
    ></sc-rte-ask-ai-modal>`, {
      scopedElements: { 'sc-rte-ask-ai-modal': ScRteAskAIModal },
    });
    expect(el).to.be.instanceOf(ScRteAskAIModal);
    await el.updateComplete;
    const inputBar = el.shadowRoot?.querySelector('sc-rte-ask-input-bar') as HTMLElement;
    expect(inputBar).to.exist;
    inputBar.dispatchEvent(new CustomEvent('sc-input', {
      bubbles: true,
      detail: {
        value: 'test1',
      },
    }));
    el.inputText = 'test';
    inputBar.dispatchEvent(new CustomEvent('sc-rte-ask-send', {
      bubbles: true,
    }));
    el.selectAllContent();
    const msgs = Array.from(new Set(messagesRequestTemplateData)) || [];
    el.generateRequest(msgs);
    el.content = 'test';
    await el.updateComplete;
    aTimeout(50);
    const buttonTryAgain = el.shadowRoot?.querySelector('sc-button[id="try-again"]') as HTMLElement;
    expect(buttonTryAgain).to.exist;
    buttonTryAgain.click();
    const close = el.shadowRoot?.querySelector('sc-icon[name="cross"]') as HTMLElement;
    expect(close).to.exist;
    close?.click();
  });
  it('renders ask AI modal', async () => {
    const el = await fixture<ScRteAskAIModal>(html`<sc-rte-ask-ai-modal
    .editor=${rte.editorInstance}
    ></sc-rte-ask-ai-modal>`, {
      scopedElements: { 'sc-rte-ask-ai-modal': ScRteAskAIModal },
    });
    expect(el).to.be.instanceOf(ScRteAskAIModal);
    el.content = '## I\'m a title\nSome description.\n\n### I\'m a subtitle\nSome text... **bolder** text. [Service Bench](https://servicebench-sit.global.standardchartered.com/)\n\n### Some code\n```javascript\nconsole.log(\'Hello, world!\');\n```\n\n### Image\n![img](https://p9-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/ebb79d86beda4db6a728c8cdbc551679~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgQ29kZVNoZWVw:q75.awebp?rk3s=f64ab15b&x-expires=1749142599&x-signature=fsyZhfLAP0tlHTFlSALWJ83ch%2F8%3D)\n';
    el.showLoading = false;
    await el.updateComplete;
    el.scroll();
    const inputBar = el.shadowRoot?.querySelector('sc-rte-ask-input-bar') as HTMLElement;
    expect(inputBar).to.exist;
    inputBar.dispatchEvent(new CustomEvent('sc-input', {
      bubbles: true,
      detail: {
        value: 'test1',
      },
    }));
    el.inputText = 'test';
    inputBar.dispatchEvent(new CustomEvent('sc-rte-ask-send', {
      bubbles: true,
    }));
    el.selectAllContent();
    el.content = 'test';
    await el.updateComplete;
    aTimeout(50);
    const buttonTryAgain = el.shadowRoot?.querySelector('sc-button[id="try-again"]') as HTMLElement;
    expect(buttonTryAgain).to.exist;
    buttonTryAgain.click();
    const close = el.shadowRoot?.querySelector('sc-icon[name="cross"]') as HTMLElement;
    expect(close).to.exist;
    close?.click();
  });
  it('buttonInsertBelow', async () => {
    const el = await fixture<ScRteAskAIModal>(html`<sc-rte-ask-ai-modal
    .editor=${rte.editorInstance}
    ></sc-rte-ask-ai-modal>`, {
      scopedElements: { 'sc-rte-ask-ai-modal': ScRteAskAIModal },
    });
    expect(el).to.be.instanceOf(ScRteAskAIModal);
    el.content = 'test content';
    await el.updateComplete;
    const buttonInsertBelow = el.shadowRoot?.querySelector('sc-button[id="insert-below"]') as HTMLElement;
    expect(buttonInsertBelow).to.exist;
    buttonInsertBelow.click();
  });

  it('buttonReplace', async () => {
    const el = await fixture<ScRteAskAIModal>(html`<sc-rte-ask-ai-modal
    .editor=${rte.editorInstance}
    ></sc-rte-ask-ai-modal>`, {
      scopedElements: { 'sc-rte-ask-ai-modal': ScRteAskAIModal },
    });
    expect(el).to.be.instanceOf(ScRteAskAIModal);
    el.content = 'test content';
    await el.updateComplete;
    const buttonReplace = el.shadowRoot?.querySelector('sc-button[id="replace"]') as HTMLElement;
    expect(buttonReplace).to.exist;
    buttonReplace.click();
  });
  it('renders ask AI inline modal', async () => {
    const el = await fixture<ScRteAskAIModal>(html`<sc-rte-ask-ai-modal
    ai-request-type="inline"
    prompt="hello world"
    .editor=${rte.editorInstance}
    ></sc-rte-ask-ai-modal>`, {
      scopedElements: { 'sc-rte-ask-ai-modal': ScRteAskAIModal },
    });
    el.content = 'test content';
    expect(el).to.be.instanceOf(ScRteAskAIModal);
  });
});

describe('ScRteAskAIModal callStreamAPI', () => {
  let el: ScRteAskAIModal;
  let mockRestClient: any;
  let mockSelectAllContent: jest.SpyInstance;
  let mockClearData: jest.SpyInstance;
  const rte = new ScRichTextEditorV2();
  rte.editorInstance = mockEditorInstance;
  beforeEach(async () => {
    (global as any).TextDecoder = jest.fn().mockImplementation(() => ({
      decode: jest.fn().mockReturnValue('data:{"id":"test","choices":[{"delta":{"content":"test"}}]}\n'),
    }));
    el = await fixture<ScRteAskAIModal>(html`<sc-rte-ask-ai-modal .editor=${rte.editorInstance}></sc-rte-ask-ai-modal>`, {
      scopedElements: { 'sc-rte-ask-ai-modal': ScRteAskAIModal },
    });
    mockRestClient = {
      request: jest.fn(),
    };
    (el as any)._restClient = mockRestClient;
    mockSelectAllContent = jest.spyOn(el, 'selectAllContent').mockImplementation(() => {});
    mockClearData = jest.spyOn(el, 'clearData').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not call API if inputText is empty', async () => {
    el.inputText = '';
    await el.callStreamAPI();
    gExpect(mockRestClient.request).not.toHaveBeenCalled();
  });

  it('should call API with correct parameters if inputText is set', async () => {
    el.inputText = 'test question';
    el.showLoading = true;
    await el.updateComplete;
    mockRestClient.request.mockResolvedValue({
      ok: false,
      body: {},
    });
    await el.callStreamAPI();
    let count = 0;
    mockRestClient.request.mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: () => {
            if (count > 2) {
              return Promise.resolve({ done: true, value: 'data:{"id":"STOP-test"}}' });
            }
            count++;
            return Promise.resolve({ done: false, value: 'data:{"id":"test","choices":[{"delta":{"content":"test"}}]}\n' });
          },
        }),
      },
    });
    await el.callStreamAPI();
    gExpect(mockRestClient.request).toHaveBeenCalled();
    gExpect(mockClearData).toHaveBeenCalled();
  });

  it('should call selectAllContent if no selectedContent', async () => {
    el.inputText = 'test';
    el.editor = {
      selection: {
        getContent: () => '',
      },
      getContent: () => 'editor content',
      focus: () => {},
      execCommand: () => {},
    } as any;
    mockRestClient.request.mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: () => Promise.resolve({ done: true, value: null }),
        }),
      },
    });
    await el.callStreamAPI();
    gExpect(mockSelectAllContent).toHaveBeenCalled();
  });

  it('should set showLoading and typing to false if response not ok', async () => {
    el.inputText = 'test';
    mockRestClient.request.mockResolvedValue({
      ok: false,
      status: 500,
    });
    await el.callStreamAPI();
    gExpect(el.showLoading).toBe(false);
    gExpect(el.typing).toBe(false);
  });

  it('should set showLoading and typing to false if exception thrown', async () => {
    el.inputText = 'test';
    mockRestClient.request.mockRejectedValue(new Error('fail'));
    await el.callStreamAPI();
    gExpect(el.showLoading).toBe(false);
    gExpect(el.typing).toBe(false);
  });
});