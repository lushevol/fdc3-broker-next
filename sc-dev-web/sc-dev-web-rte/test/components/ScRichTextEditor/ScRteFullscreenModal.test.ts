/* eslint-disable no-duplicate-imports */
import { html, fixture, aTimeout } from '@open-wc/testing';
import { ScRteFullscreenModal } from '../../../src/components/ScRichTextEditor/ScRteFullscreenModal.js';
import { editorCommands } from '../../../src/components/ScRichTextEditor/utils.js';
import { INTERNAL_EVENTS } from '../../../src/shared/sc-custom-events.js';
import '../../../elements/sc-rich-text-editor-v2.js';

// Mock the 'bold' command handler to verify it gets called
jest.mock('../../../src/components/ScRichTextEditor/utils.js', () => ({
  ...jest.requireActual('../../../src/components/ScRichTextEditor/utils.js'),
  editorCommands: {
    ...jest.requireActual('../../../src/components/ScRichTextEditor/utils.js')
      .editorCommands,
    bold: {
      ...jest.requireActual('../../../src/components/ScRichTextEditor/utils.js')
        .editorCommands.bold,
      handler: jest.fn(),
    },
  },
}));

describe('ScRteFullscreenModal', () => {
  const mockEditorInstance = {
    getContent: () => '<p>Updated Content</p>',
    destroy: jest.fn(),
    removed: false,
    on: jest.fn(),
    once: jest.fn(),
    off: jest.fn(),
    selection: {
      select: jest.fn(),
      collapse: jest.fn(),
      getBookmark: jest.fn(),
      moveToBookmark: jest.fn(),
    },
    getBody: jest.fn(() => document.createElement('div')),
    focus: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with a unique editor ID when open', async () => {
    const el = await fixture<ScRteFullscreenModal>(
      html`<sc-rte-fullscreen-modal
        .open=${true}
        label="Test Editor"
      ></sc-rte-fullscreen-modal>`
    );
    await aTimeout(10);

    const modal = el.shadowRoot?.querySelector('sc-modal');
    expect(modal).toBeTruthy();
    expect((modal as any).open).toBe(true);
    expect(modal?.querySelector('[slot="header"]')?.textContent).toBe(
      'Test Editor'
    );

    const editorId = (el as any)._fullscreenEditorId;
    expect(typeof editorId).toBe('string');
    expect(editorId).not.toBe('');

    const editorContainer = el.shadowRoot?.querySelector(`#${editorId}`);
    expect(editorContainer).toBeTruthy();
  });

  it('does not render the modal content when closed', async () => {
    const el = await fixture<ScRteFullscreenModal>(
      html`<sc-rte-fullscreen-modal .open=${false}></sc-rte-fullscreen-modal>`
    );
    await el.updateComplete;

    const modal = el.shadowRoot?.querySelector('sc-modal');
    // Cast to `any` and use .toBe(false)
    expect((modal as any).open).toBe(false);
  });

  it('initializes the TinyMCE editor when the modal is opened', async () => {
    const el = await fixture<ScRteFullscreenModal>(
      html`<sc-rte-fullscreen-modal></sc-rte-fullscreen-modal>`
    );
    const initSpy = jest
      .spyOn(el as any, 'initTinyMCE')
      .mockImplementation(() => {});

    el.open = true;
    await el.updateComplete;
    await aTimeout(10);

    expect(initSpy).toHaveBeenCalled();
    initSpy.mockRestore();
  });

  it('emits "sc-action" with editor content and destroys editor on close', async () => {
    const el = await fixture<ScRteFullscreenModal>(
      html`<sc-rte-fullscreen-modal .open=${true}></sc-rte-fullscreen-modal>`
    );

    (el as any).editorInstance = mockEditorInstance;

    const actionHandler = jest.fn();
    el.addEventListener('sc-action', actionHandler);

    const modal = el.shadowRoot?.querySelector('sc-modal');
    modal?.dispatchEvent(new CustomEvent('sc-hide'));

    expect(actionHandler).toHaveBeenCalled();
    const event = actionHandler.mock.calls[0][0] as CustomEvent;
    // Use .toEqual() for objects/values
    expect(event.detail.content).toEqual('<p>Updated Content</p>');

    await aTimeout(10);

    expect(mockEditorInstance.destroy).toHaveBeenCalled();
  });

  it('handles toolbar actions by calling the correct command handler', async () => {
    const el = await fixture<ScRteFullscreenModal>(
      html`<sc-rte-fullscreen-modal .open=${true}></sc-rte-fullscreen-modal>`
    );

    (el as any).editorInstance = mockEditorInstance;

    const toolbar = el.shadowRoot?.querySelector('sc-rte-toolbar-v2');
    expect(toolbar).toBeTruthy();

    const contextTriggerEvent = INTERNAL_EVENTS['sc-context-trigger'];

    toolbar?.dispatchEvent(
      new CustomEvent(contextTriggerEvent, {
        detail: {
          namespace: 'editor.bold',
          args: ['some-arg'],
        },
      })
    );

    expect(editorCommands.bold.handler).toHaveBeenCalledWith(
      mockEditorInstance,
      ['some-arg']
    );
  });
});
