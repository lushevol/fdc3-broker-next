import { html } from 'lit';
import { expect, fixture, oneEvent } from '@open-wc/testing';
import { ScChat } from '../../../src/components/ScChat/ScChat.js';
import '../../../elements/sc-chat.js';

describe('ScChat header actions', () => {
  const localData = [{ user: 'bot', text: 'hello', id: 'seed-1' }];

  it('renders Start new chat as the first header action', async () => {
    const settings = {
      model: 'SB_SUPPORT',
      headerActions: [{ id: 'history', icon: 'history' }],
    };

    const el = await fixture<ScChat>(html`
      <sc-chat .settings=${settings} .data=${localData} ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    const actionsContainer = el.shadowRoot?.querySelector('.chat-header-actions') as HTMLElement;
    expect(actionsContainer).to.exist;

    const firstAction = actionsContainer.firstElementChild as HTMLElement;
    expect(firstAction).to.exist;
    expect(firstAction.tagName.toLowerCase()).to.equal('sc-button');
    expect(firstAction.textContent).to.include('Start new chat');
  });

  it('emits sc-action with header-action detail for header action without handler', async () => {
    const settings = {
      model: 'SB_SUPPORT',
      headerActions: [
        {
          id: 'history',
          icon: 'history',
          eventName: 'open-history',
          eventDetail: { source: 'header' },
        },
      ],
    };

    const el = await fixture<ScChat>(html`
      <sc-chat .settings=${settings} .data=${localData} ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    const actionEventPromise = oneEvent(el, 'sc-action');
    const iconAction = el.shadowRoot?.querySelector('.chat-header-action-icon') as HTMLElement;
    expect(iconAction).to.exist;

    iconAction.click();

    const event = (await actionEventPromise) as CustomEvent;
    expect(event.detail.type).to.equal('header-action');
    expect(event.detail.eventName).to.equal('open-history');
    expect(event.detail.action.id).to.equal('history');
    expect(event.detail.action.eventDetail).to.deep.equal({ source: 'header' });
  });

  it('runs header action handler when handler is provided', async () => {
    let calledPayload: any = null;

    const settings = {
      model: 'SB_SUPPORT',
      headerActions: [
        {
          id: 'copy-link',
          label: 'Copy link',
          icon: 'link',
          handler: (payload: any) => {
            calledPayload = payload;
          },
        },
      ],
    };

    const el = await fixture<ScChat>(html`
      <sc-chat .settings=${settings} .data=${localData} ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    const buttons = Array.from(el.shadowRoot?.querySelectorAll('.chat-header-actions sc-button') || []);
    const copyLinkAction = buttons.find(button =>
      (button as HTMLElement).textContent?.includes('Copy link')
    ) as HTMLElement;

    expect(copyLinkAction).to.exist;

    copyLinkAction.click();

    expect(calledPayload).to.exist;
    expect(calledPayload.action.id).to.equal('copy-link');
    expect(calledPayload.component).to.equal(el);
  });

  it('does not emit header action event when action is disabled', async () => {
    const settings = {
      model: 'SB_SUPPORT',
      headerActions: [
        {
          id: 'disabled-action',
          icon: 'history',
          disabled: true,
          eventName: 'disabled-clicked',
        },
      ],
    };

    const el = await fixture<ScChat>(html`
      <sc-chat .settings=${settings} .data=${localData} ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    let actionEventCount = 0;
    el.addEventListener('sc-action', () => {
      actionEventCount += 1;
    });

    const iconAction = el.shadowRoot?.querySelector('.chat-header-action-icon') as HTMLElement;
    expect(iconAction).to.exist;

    iconAction.click();

    expect(actionEventCount).to.equal(0);
  });
});

describe('ScChat core behavior', () => {
  it('reuses the standard chat shell with runtime defaults when runtimeChat is omitted', async () => {
    const settings = {
      agUiApiName: 'agent-api',
      agUiResource: 'runtime-run',
      inputPlaceholder: 'Ask the runtime agent',
    };

    const el = await fixture<ScChat>(html`
      <sc-chat .settings=${settings} .metadata=${{ tenant: 'acme' }}></sc-chat>
    `);

    await el.updateComplete;

    const chatBox = el.shadowRoot?.querySelector('sc-chat-box') as HTMLElement;
    const chatInput = el.shadowRoot?.querySelector('sc-chat-input') as HTMLElement;
    const sourceDropdown = el.shadowRoot?.querySelector('.sources');

    expect(chatBox).to.exist;
    expect(chatInput).to.exist;
    expect(sourceDropdown).to.equal(null);
    expect((el as any).uiStatus).to.equal('idle');
    expect((el as any).chatConversations).to.deep.equal([
      {
        user: 'bot',
        text: 'Hello, I\'m ready to assist you. Ask me anything.',
        id: 'start',
      },
    ]);
  });

  it('sends trimmed input and emits message-send and sc-post when api is disabled', async () => {
    const settings = { model: 'SB_SUPPORT' };
    const el = await fixture<ScChat>(html`
      <sc-chat .settings=${settings} ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    const actionEvents: CustomEvent[] = [];
    const postEvents: CustomEvent[] = [];

    el.addEventListener('sc-action', event => {
      actionEvents.push(event as CustomEvent);
    });
    el.addEventListener('sc-post', event => {
      postEvents.push(event as CustomEvent);
    });

    (el as any).inputText = '  Need assistance  ';
    (el as any).onSend();

    await el.updateComplete;

    const lastConversation = (el as any).chatConversations[(el as any).chatConversations.length - 1];
    expect(lastConversation.user).to.equal('user');
    expect(lastConversation.text).to.equal('Need assistance');

    expect((el as any).uiStatus).to.equal('success');
    expect((el as any).processing).to.equal(false);
    expect((el as any).inputText).to.equal('');

    const sendEvent = actionEvents.find(event => event.detail.type === 'message-send');
    expect(sendEvent).to.exist;
    expect(sendEvent?.detail.protocol).to.equal('ag-ui');
    expect(sendEvent?.detail.content).to.equal('Need assistance');

    expect(postEvents.length).to.equal(1);
    const postDetail = postEvents[0].detail as any;
    expect(postDetail.protocol).to.equal('ag-ui');
    expect(postDetail.runAgentInput).to.exist;
    const runAgentMessages = postDetail.runAgentInput.messages || [];
    expect(runAgentMessages.some((message: any) => message.role === 'user' && message.content === 'Need assistance')).to.equal(true);
  });

  it('uses legacy-graphql protocol in emitted events when configured', async () => {
    const settings = {
      model: 'SB_SUPPORT',
      apiProtocol: 'legacy-graphql',
    };

    const el = await fixture<ScChat>(html`
      <sc-chat .settings=${settings} ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    const actionEvents: CustomEvent[] = [];
    const postEvents: CustomEvent[] = [];

    el.addEventListener('sc-action', event => {
      actionEvents.push(event as CustomEvent);
    });
    el.addEventListener('sc-post', event => {
      postEvents.push(event as CustomEvent);
    });

    (el as any).inputText = 'protocol check';
    (el as any).onSend();

    await el.updateComplete;

    const sendEvent = actionEvents.find(event => event.detail.type === 'message-send');
    expect(sendEvent).to.exist;
    expect(sendEvent?.detail.protocol).to.equal('legacy-graphql');
    expect(postEvents.length).to.equal(1);
    const postDetail = postEvents[0].detail as any;
    expect(postDetail.protocol).to.equal('legacy-graphql');
  });

  it('resets conversation and updates selected source on source change', async () => {
    const el = await fixture<ScChat>(html`
      <sc-chat .data=${[{ user: 'bot', text: 'Existing response', id: 'old-1' }]} ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    (el as any).chatConversations = [
      { user: 'bot', text: 'Old 1', id: 'old-1' },
      { user: 'user', text: 'Old 2', id: 'old-2' },
    ];
    const oldConversationId = (el as any).conversationId;

    (el as any).onSourceChange({ detail: { value: 'YODA' } });

    expect((el as any).selectedSource).to.equal('YODA');
    expect((el as any).chatConversations.length).to.equal(1);
    expect((el as any).chatConversations[0].id).to.equal('start');
    expect((el as any).conversationId).to.not.equal(oldConversationId);
  });

  it('marks chat as cancelled and appends cancellation response with retry action', async () => {
    const el = await fixture<ScChat>(html`
      <sc-chat ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });

    const cancelEvents: CustomEvent[] = [];
    el.addEventListener('sc-cancel', event => {
      cancelEvents.push(event as CustomEvent);
    });

    (el as any).processing = true;
    (el as any)._lastSubmittedText = 'previous prompt';
    (el as any).chatConversations = [{ user: 'bot', text: 'Please hold', id: 'placeholder-1' }];
    (el as any).onCancel();

    await el.updateComplete;

    expect((el as any).uiStatus).to.equal('cancelled');
    expect((el as any).processing).to.equal(false);
    expect(cancelEvents.length).to.equal(1);
    const cancelDetail = cancelEvents[0].detail as any;
    expect(cancelDetail.protocol).to.equal('ag-ui');

    const lastConversation = (el as any).chatConversations[(el as any).chatConversations.length - 1];
    expect(lastConversation.text).to.equal('Generation cancelled by user.');
    expect(Array.isArray(lastConversation.actions)).to.equal(true);
    expect(lastConversation.actions.length).to.equal(1);

    rafSpy.mockRestore();
  });

  it('emits sc-cancel when cancel is triggered from chat input', async () => {
    const el = await fixture<ScChat>(html`
      <sc-chat ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    const cancelEvents: CustomEvent[] = [];
    el.addEventListener('sc-cancel', event => {
      cancelEvents.push(event as CustomEvent);
    });

    (el as any).processing = true;
    (el as any).selectedSource = 'YODA';
    (el as any).chatConversations = [{ user: 'bot', text: 'Please hold', id: 'placeholder-1' }];

    const inputEl = el.shadowRoot?.querySelector('sc-chat-input') as HTMLElement;
    expect(inputEl).to.exist;

    inputEl.dispatchEvent(new CustomEvent('cancel'));
    await el.updateComplete;

    expect(cancelEvents.length).to.equal(1);
    const cancelDetail = cancelEvents[0].detail as any;
    expect(cancelDetail.protocol).to.equal('ag-ui');
    expect(cancelDetail.model).to.equal('YODA');
  });

  it('auto-sends configured initial input text during initialization', async () => {
    const el = await fixture<ScChat>(html`
      <sc-chat ?disable-api=${true}></sc-chat>
    `);

    el.settings = {
      model: 'SB_SUPPORT',
      initialInputText: 'Bootstrapped question',
    };
    await (el as any).initializeChat();
    await el.updateComplete;

    const lastConversation = (el as any).chatConversations[(el as any).chatConversations.length - 1];
    expect(lastConversation.user).to.equal('user');
    expect(lastConversation.text).to.equal('Bootstrapped question');
    expect((el as any).uiStatus).to.equal('success');
  });

  it('maps data entries without ids to generated data-* ids', async () => {
    const el = await fixture<ScChat>(html`
      <sc-chat ?disable-api=${true}></sc-chat>
    `);

    await el.updateComplete;

    el.data = [{ user: 'bot', text: 'No id message' } as any];
    await el.updateComplete;

    expect((el as any).chatConversations.length).to.equal(1);
    expect((el as any).chatConversations[0].id).to.equal('data-0');
    expect((el as any).chatConversations[0].text).to.equal('No id message');
  });
});

describe('ScChat internal methods', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('initializeChat loads models, filters sources, and picks first source when model is not configured', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    jest.spyOn(el as any, 'setupAiModels').mockResolvedValue({
      aiModels: [
        { id: 'YODA', name: 'Yoda' },
        { id: 'XBK', name: 'XBK' },
      ],
      aiModelMap: {
        YODA: { id: 'YODA' },
        XBK: { id: 'XBK' },
      },
    });

    el.disableApi = false;
    el.settings = {
      sources: [{ id: 'yoda' }],
    };

    await (el as any).initializeChat();

    expect((el as any).sources).to.deep.equal([{ id: 'YODA', name: 'Yoda' }]);
    expect((el as any).selectedSource).to.equal('YODA');
    expect((el as any).sourceMap.YODA.id).to.equal('YODA');
    expect((el as any).conversationId).to.be.a('string');
  });

  it('setupAiModels returns adapter result and falls back to empty result on errors', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    jest.spyOn(el as any, 'getChatAdapter').mockReturnValue({
      setupAiModels: async () => ({
        aiModels: [{ id: 'M1', name: 'Model 1' }],
        aiModelMap: { M1: { id: 'M1', name: 'Model 1' } },
      }),
    });

    let result = await (el as any).setupAiModels();
    expect(result.aiModels.length).to.equal(1);
    expect(result.aiModelMap.M1.name).to.equal('Model 1');

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(el as any, 'getChatAdapter').mockReturnValue({
      setupAiModels: async () => {
        throw new Error('setup failed');
      },
    });

    result = await (el as any).setupAiModels();
    expect(result.aiModels).to.deep.equal([]);
    expect(result.aiModelMap).to.deep.equal({});
    expect(warnSpy.mock.calls.length).to.equal(1);
  });

  it('getApiProtocol/getChatAdapter/getAdapterSettings/getAdapterClients return expected values', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    (el as any)._restClient = { request: jest.fn() };
    (el as any)._graphQLClient = { query: jest.fn() };

    el.metadata = { tenant: 'acme' };
    el.settings = {
      apiProtocol: 'legacy-graphql',
      agUiEndpoint: '/ag-ui-x',
      agUiApiName: 'api-x',
      agUiResource: 'resource-x',
      legacyApiName: 'legacy-api-x',
      legacyResource: 'legacy-resource-x',
    };

    expect((el as any).getApiProtocol()).to.equal('legacy-graphql');
    expect((el as any).getChatAdapter().protocol).to.equal('legacy-graphql');

    const settings = (el as any).getAdapterSettings();
    expect(settings.agUiEndpoint).to.equal('/ag-ui-x');
    expect(settings.legacyApiName).to.equal('legacy-api-x');
    expect(settings.metadata.tenant).to.equal('acme');

    const clients = (el as any).getAdapterClients();
    expect(clients.restClient).to.equal((el as any)._restClient);
    expect(clients.graphQLClient).to.equal((el as any)._graphQLClient);
  });

  it('getRetryActions and retryLastMessage handle guard and success paths', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    (el as any)._lastSubmittedText = '';
    expect((el as any).getRetryActions()).to.deep.equal([]);

    (el as any)._lastSubmittedText = 'retry this';
    const actions = (el as any).getRetryActions();
    expect(actions.length).to.equal(1);
    expect(actions[0].title).to.equal('Retry');

    const emitSpy = jest.spyOn(el as any, 'emit');
    const sendSpy = jest.spyOn(el as any, 'onSend').mockImplementation(() => undefined);

    (el as any).processing = true;
    (el as any).retryLastMessage();
    expect(emitSpy.mock.calls.length).to.equal(0);

    (el as any).processing = false;
    (el as any).conversationId = 'conv-r1';
    (el as any).selectedSource = 'YODA';
    (el as any).retryLastMessage();

    expect(emitSpy.mock.calls.length).to.equal(1);
    expect(emitSpy.mock.calls[0][0]).to.equal('sc-action');
    expect((emitSpy.mock.calls[0][1] as any).detail.type).to.equal('retry');
    expect((el as any).inputText).to.equal('retry this');
    expect(sendSpy.mock.calls.length).to.equal(1);
  });

  it('appendOrReplaceLastBotMessage appends for non-placeholder and replaces placeholder', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);
    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });

    const scrollSpy = jest.spyOn(el as any, 'scrollContent').mockImplementation(() => undefined);

    (el as any).chatConversations = [{ user: 'user', text: 'u1', id: 'u-1' }];
    (el as any).appendOrReplaceLastBotMessage('bot append');

    expect((el as any).chatConversations.length).to.equal(2);
    expect((el as any).chatConversations[1].text).to.equal('bot append');

    (el as any).chatConversations = [{ user: 'bot', text: 'old', id: 'placeholder-1' }];
    (el as any).appendOrReplaceLastBotMessage('bot replace');

    expect((el as any).chatConversations.length).to.equal(1);
    expect((el as any).chatConversations[0].text).to.equal('bot replace');
    expect(scrollSpy.mock.calls.length).to.equal(2);

    rafSpy.mockRestore();
  });

  it('does not expose getStatusLabel/renderStatus helpers in current implementation', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    expect((el as any).getStatusLabel).to.equal(undefined);
    expect((el as any).renderStatus).to.equal(undefined);
  });

  it('handleStreamError emits error event and cleans up', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const appendSpy = jest.spyOn(el as any, 'appendOrReplaceLastBotMessage').mockImplementation(() => undefined);
    const cleanSpy = jest.spyOn(el as any, 'cleanPreviousCall').mockImplementation(() => undefined);
    const emitSpy = jest.spyOn(el as any, 'emit');

    (el as any)._runStartAt = Date.now() - 100;
    (el as any).conversationId = 'conv-e1';
    (el as any).selectedSource = 'YODA';

    (el as any).handleStreamError({ error: { message: 'boom error' } });

    expect((el as any).uiStatus).to.equal('error');
    expect(typeof (el as any)._runStartAt).to.equal('number');
    expect(emitSpy.mock.calls.length).to.equal(1);
    expect(emitSpy.mock.calls[0][0]).to.equal('sc-submit-error');
    expect((emitSpy.mock.calls[0][1] as any).detail.error.error.message).to.equal('boom error');
    expect(appendSpy.mock.calls.length).to.equal(0);
    expect(cleanSpy.mock.calls.length).to.equal(0);
  });

  it('handleStreamData handles both replace and append branches and emits sc-change', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);
    const emitSpy = jest.spyOn(el as any, 'emit');

    (el as any).chatConversations = [{ user: 'bot', text: '...', id: 'placeholder-1' }];
    (el as any).handleStreamData('delta-a');

    expect((el as any).chatConversations.length).to.equal(1);
    expect((el as any).chatConversations[0].text).to.equal('...delta-a');

    (el as any).chatConversations = [{ user: 'user', text: 'u', id: 'u-1' }];
    (el as any).handleStreamData('delta-b');

    expect((el as any).chatConversations.length).to.equal(2);
    expect((el as any).chatConversations[1].user).to.equal('bot');
    expect(emitSpy.mock.calls.length).to.be.greaterThan(0);
  });

  it('handleCompletedData emits success event and schedules scroll', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);
    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });

    const finishSpy = jest.spyOn(el as any, 'finishWaiting').mockImplementation(() => undefined);
    const scrollSpy = jest.spyOn(el as any, 'scrollContent').mockImplementation(() => undefined);
    const emitSpy = jest.spyOn(el as any, 'emit');

    (el as any)._runStartAt = Date.now() - 50;
    (el as any).conversationId = 'conv-c1';
    (el as any).selectedSource = 'XBK';

    (el as any).handleCompletedData();

    expect((el as any).uiStatus).to.equal('success');
    expect(typeof (el as any)._runStartAt).to.equal('number');
    expect(emitSpy.mock.calls.length).to.equal(1);
    expect(emitSpy.mock.calls[0][0]).to.equal('sc-submit-success');
    expect(finishSpy.mock.calls.length).to.equal(1);
    expect(scrollSpy.mock.calls.length).to.equal(0);

    rafSpy.mockRestore();
  });

  it('cleanPreviousCall handles abort and abort exceptions', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);
    const finishSpy = jest.spyOn(el as any, 'finishWaiting').mockImplementation(() => undefined);

    const abortSpy = jest.fn();
    (el as any)._queryClient = { abort: abortSpy };
    (el as any).cleanPreviousCall();
    expect(finishSpy.mock.calls.length).to.equal(1);
    expect(abortSpy.mock.calls.length).to.equal(1);

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    (el as any)._queryClient = {
      abort: () => {
        throw new Error('abort failed');
      },
    };
    (el as any).cleanPreviousCall();
    expect(warnSpy.mock.calls.length).to.equal(1);

    // Avoid warning during fixture cleanup (disconnectedCallback -> cleanPreviousCall)
    (el as any)._queryClient = null;
  });

  it('waiting and waitingLonger update placeholder conversations', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);
    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });
    const scrollSpy = jest.spyOn(el as any, 'scrollContent').mockImplementation(() => undefined);

    (el as any).chatConversations = [];
    (el as any).waiting();
    expect((el as any).chatConversations.length).to.equal(1);
    expect((el as any).chatConversations[0].id.startsWith('placeholder-')).to.equal(true);

    (el as any).waitingLonger();
    expect((el as any).chatConversations.length).to.equal(1);
    expect((el as any).chatConversations[0].text).to.equal('This one\'s taking a little longer. Hang tight...');
    expect(scrollSpy.mock.calls.length).to.equal(2);

    rafSpy.mockRestore();
  });

  it('stopWaiting emits timeout error and finishWaiting clears timer/input state', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);
    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });

    const cleanSpy = jest.spyOn(el as any, 'cleanPreviousCall').mockImplementation(() => undefined);
    const emitSpy = jest.spyOn(el as any, 'emit');

    (el as any)._runStartAt = Date.now() - 40;
    (el as any)._lastSubmittedText = 'retry-timeout';
    (el as any).chatConversations = [{ user: 'bot', text: '...', id: 'placeholder-1' }];

    (el as any).stopWaiting();

    expect((el as any).uiStatus).to.equal('error');
    expect(emitSpy.mock.calls.length).to.equal(1);
    expect(emitSpy.mock.calls[0][0]).to.equal('sc-submit-error');
    expect((emitSpy.mock.calls[0][1] as any).detail.message).to.equal('Request timeout');
    expect(cleanSpy.mock.calls.length).to.equal(1);

    jest.useFakeTimers();
    (el as any).processing = true;
    (el as any).inputText = 'abc';
    (el as any)._queryTimer = setTimeout(() => undefined, 2000);
    (el as any).finishWaiting();

    expect((el as any).processing).to.equal(false);
    expect((el as any).inputText).to.equal('');
    expect((el as any)._queryTimer).to.equal(null);

    rafSpy.mockRestore();
  });

  it('processInput forwards adapter callbacks and supports toolset/category mapping', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    (el as any).selectedSource = 'MODEL_Z';
    (el as any).conversationId = 'conv-p1';
    (el as any).metadata = { tenant: 'acme', toolsetId: 'toolset-meta', categoryId: 'cat-meta' };
    (el as any).sourceMap = {
      MODEL_Z: {
        toolsets: [{ id: 'toolset-1', categories: [{ id: 'cat-1' }] }],
      },
    };

    const callbackSpies = {
      onData: jest.fn(),
      onComplete: jest.fn(),
      onError: jest.fn(),
    };

    const streamChatMock = jest.fn(async (_clients, request, adapterCallbacks) => {
      expect(request.toolsetId).to.equal('toolset-meta');
      expect(request.categoryId).to.equal('cat-meta');
      adapterCallbacks.onSend({ abort: jest.fn() });
      adapterCallbacks.onData('delta');
      adapterCallbacks.onComplete();
      adapterCallbacks.onError('stream-error');
    });

    jest.spyOn(el as any, 'getChatAdapter').mockReturnValue({
      streamChat: streamChatMock,
    });

    await (el as any).processInput('prompt', callbackSpies);

    expect((el as any).processing).to.equal(false);
    expect((el as any)._queryClient).to.exist;
    expect(callbackSpies.onData.mock.calls.length).to.equal(1);
    expect(callbackSpies.onData.mock.calls[0][0]).to.equal('delta');
    expect(callbackSpies.onComplete.mock.calls.length).to.equal(1);
    expect(callbackSpies.onError.mock.calls.length).to.equal(1);
    expect(callbackSpies.onError.mock.calls[0][0]).to.equal('stream-error');
  });

  it('processInput error path calls onError callback or rethrows when absent', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const expectedError = new Error('stream failed');
    jest.spyOn(el as any, 'getChatAdapter').mockReturnValue({
      streamChat: async () => {
        throw expectedError;
      },
    });

    const onError = jest.fn();
    let thrownWithOnError: any = null;
    try {
      await (el as any).processInput('x', { onData: jest.fn(), onError });
    } catch (error) {
      thrownWithOnError = error;
    }
    expect(thrownWithOnError).to.equal(expectedError);
    expect(onError.mock.calls.length).to.equal(0);

    let thrown: any = null;
    try {
      await (el as any).processInput('x', { onData: jest.fn() });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).to.equal(expectedError);
  });

  it('onSend runtime path with API enabled triggers run-start, waiting, processInput and timeout scheduling', async () => {
    jest.useFakeTimers();
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    el.disableApi = false;
    (el as any).inputText = 'ask runtime';
    (el as any).selectedSource = 'YODA';

    const waitingSpy = jest.spyOn(el as any, 'waiting').mockImplementation(() => undefined);
    const processSpy = jest.spyOn(el as any, 'processInput').mockResolvedValue(undefined);
    const waitingLongerSpy = jest.spyOn(el as any, 'waitingLonger').mockImplementation(() => undefined);
    const stopWaitingSpy = jest.spyOn(el as any, 'stopWaiting').mockImplementation(() => undefined);

    const actionEvents: CustomEvent[] = [];
    el.addEventListener('sc-action', event => {
      actionEvents.push(event as CustomEvent);
    });

    (el as any).onSend();

    expect(waitingSpy.mock.calls.length).to.equal(1);
    expect(processSpy.mock.calls.length).to.equal(1);
    expect(actionEvents.some(event => event.detail.type === 'run-start')).to.equal(true);

    jest.advanceTimersByTime(10000);
    expect(waitingLongerSpy.mock.calls.length).to.equal(1);

    jest.advanceTimersByTime(5 * 60000 - 10000);
    expect(stopWaitingSpy.mock.calls.length).to.equal(1);
  });

  it('onSend ignores empty input and onCancel returns when not processing', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const emitSpy = jest.spyOn(el as any, 'emit');

    (el as any).inputText = '   ';
    (el as any).onSend();
    expect(emitSpy.mock.calls.length).to.equal(0);

    (el as any).processing = false;
    (el as any).onCancel();
    expect(emitSpy.mock.calls.length).to.equal(0);
  });

  it('onCancel notifies backend cancel API through restClient when configured', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const requestMock = jest.fn().mockResolvedValue({});
    (el as any)._restClient = { request: requestMock };
    (el as any).settings = {
      cancelApiName: 'chat-api',
      cancelResource: 'chat/cancel',
    };
    (el as any).processing = true;
    (el as any).conversationId = 'conv-cancel-rest';
    (el as any).selectedSource = 'YODA';
    (el as any)._lastRunId = 'run-cancel-rest';

    jest.spyOn(el as any, 'appendOrReplaceLastBotMessage').mockImplementation(() => undefined);
    jest.spyOn(el as any, 'cleanPreviousCall').mockImplementation(() => undefined);

    (el as any).onCancel();
    await Promise.resolve();

    expect(requestMock.mock.calls.length).to.equal(1);
    expect(requestMock.mock.calls[0][0]).to.equal('chat-api');
    expect(requestMock.mock.calls[0][1]).to.equal('chat/cancel');
    expect(requestMock.mock.calls[0][2]).to.equal('POST');

    const payload = JSON.parse(requestMock.mock.calls[0][3]);
    expect(payload.protocol).to.equal('ag-ui');
    expect(payload.conversationId).to.equal('conv-cancel-rest');
    expect(payload.runId).to.equal('run-cancel-rest');
    expect(payload.model).to.equal('YODA');
    expect(payload.reason).to.equal('user-cancelled');
  });

  it('onCancel skips backend cancel when restClient cancel config is incomplete', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const requestMock = jest.fn().mockResolvedValue({});
    (el as any)._restClient = { request: requestMock };

    (el as any).settings = {
      cancelApiName: 'chat-api',
    };
    (el as any).processing = true;
    (el as any).conversationId = 'conv-cancel-skip';
    (el as any).selectedSource = 'XBK';
    (el as any)._lastRunId = 'run-cancel-skip';

    jest.spyOn(el as any, 'appendOrReplaceLastBotMessage').mockImplementation(() => undefined);
    jest.spyOn(el as any, 'cleanPreviousCall').mockImplementation(() => undefined);

    (el as any).onCancel();
    await Promise.resolve();

    expect(requestMock.mock.calls.length).to.equal(0);
  });

  it('scrollContent scrolls chat container and renderChatSources returns dropdown template', async () => {
    jest.useFakeTimers();
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const scrollEl = el.shadowRoot?.querySelector('.chat-content') as HTMLElement;
    const scrollToSpy = jest.fn();
    (scrollEl as any).scrollTo = scrollToSpy;

    (el as any).scrollContent(0);
    jest.runAllTimers();

    expect(scrollToSpy.mock.calls.length).to.be.greaterThan(0);

    (el as any).sources = [{ id: 'YODA', name: 'Yoda' }];
    (el as any).selectedSource = 'YODA';
    const sourcesTemplate = (el as any).renderChatSources();

    expect(sourcesTemplate).to.exist;
    expect((sourcesTemplate as any).strings.join('')).to.include('sc-dropdown-input');
  });

  it('covers runtime header/message conversion helpers', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    expect((el as any)._runtimeHeadersToRecord()).to.deep.equal({});
    expect((el as any)._runtimeHeadersToRecord({ a: '1' })).to.deep.equal({ a: '1' });
    expect((el as any)._runtimeHeadersToRecord([['x', '2']])).to.deep.equal({ x: '2' });
    expect((el as any)._runtimeHeadersToRecord(new Headers({ y: '3' }))).to.deep.equal({ y: '3' });

    (el as any)._runtimeMessages = [
      { id: 'u1', role: 'user', content: 'hello' },
      { id: 'a1', role: 'assistant', content: 'world' },
      { id: 's1', role: 'system', content: 'meta' },
      { id: 't1', role: 'tool', content: 'tool output' },
      { id: 'r1', role: 'reasoning', content: 'reasoning trace' },
    ];

    const requestMessages = (el as any)._runtimeToRequestMessages();
    expect(requestMessages.map((message: any) => message.role)).to.deep.equal(['user', 'assistant', 'system']);

    const conversations = (el as any)._runtimeToConversations();
    expect(conversations.length).to.equal(5);
    expect(conversations[0]).to.deep.include({ user: 'user', text: 'hello' });
    expect(conversations[1]).to.deep.include({ user: 'bot', text: 'world' });
    expect(conversations[2].text).to.equal('System: meta');
    expect(conversations[3].text).to.equal('Tool: tool output');
    expect(conversations[4].text).to.equal('Reasoning: reasoning trace');
  });

  it('normalizes outgoing body and incoming event payload', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const originalResponse = (globalThis as any).Response;
    class MockResponse {
      body: any;
      status: number;
      statusText: string;
      headers: any;

      constructor(body: any, init: any = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.statusText = init.statusText || 'OK';
        this.headers = init.headers || { get: () => '' };
      }

      async text() {
        if (typeof this.body === 'string') {
          return this.body;
        }

        if (!this.body?.getReader) {
          return '';
        }

        const reader = this.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let output = '';

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) {
            break;
          }
          output += decoder.decode(chunk.value, { stream: true });
        }

        output += decoder.decode();
        return output;
      }
    }
    (globalThis as any).Response = MockResponse;

    try {

    (el as any)._lastRunId = 'run-123';
    (el as any)._runtimeMessages = [{ id: 'u1', role: 'user', content: 'Hi' }];

    const normalizedBody = (el as any)._normalizeOutgoingBody(
      JSON.stringify({
        threadId: 'thread-1',
        resume: [{ interruptId: 'i1', status: 'resolved' }],
        forwardedProps: { locale: 'en-US' },
      })
    );
    const payload = JSON.parse(normalizedBody);

    expect(payload.version).to.equal('1.0');
    expect(payload.conversationId).to.equal('thread-1');
    expect(payload.parentRunId).to.equal('run-123');
    expect(payload.metadata).to.deep.equal({ locale: 'en-US' });
    expect(payload.state).to.deep.equal({});
    expect(payload.messages.length).to.equal(1);
    expect(payload.messages[0].content).to.equal('Hi');

    expect((el as any)._normalizeOutgoingBody(7)).to.equal('7');
    expect((el as any)._normalizeOutgoingBody('not-json')).to.equal('not-json');

    const untouchedPayload = (el as any)._normalizeIncomingEventPayload({ type: 'RUN_STARTED', foo: 1 });
    expect(untouchedPayload).to.deep.equal({ type: 'RUN_STARTED', foo: 1 });

    const normalizedPayload = (el as any)._normalizeIncomingEventPayload({
      type: 'RUN_FINISHED',
      outcome: { type: 'success', interrupts: [{ id: 'i1' }], result: 'ok' },
    });
    expect((normalizedPayload as any).outcome.interrupts).to.equal(undefined);
    expect((normalizedPayload as any).outcome.result).to.equal('ok');

    const nonSseResponse = {
      headers: { get: (name: string) => (name === 'content-type' ? 'application/json' : '') },
      body: null,
      status: 202,
      statusText: 'Accepted',
    };
    expect(await (el as any)._normalizeIncomingResponse(nonSseResponse)).to.equal(nonSseResponse);

    } finally {
      (globalThis as any).Response = originalResponse;
    }
  });

  it('handles runtime state/message helpers and interrupt mappings', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const scrollSpy = jest.spyOn(el as any, 'scrollContent').mockImplementation(() => undefined);

    const abortRun = jest.fn();
    const abortQuery = jest.fn();
    (el as any)._runtimeAgent = { abortRun };
    (el as any)._queryClient = { abort: abortQuery };
    (el as any)._lastRunId = 'run-old';
    (el as any).processing = true;

    (el as any)._runtimeResetAgentState();
    expect(abortRun.mock.calls.length).to.equal(1);
    expect(abortQuery.mock.calls.length).to.equal(1);
    expect((el as any)._runtimeAgent).to.equal(null);
    expect((el as any)._queryClient).to.equal(null);
    expect((el as any)._lastRunId).to.equal('');
    expect((el as any).processing).to.equal(false);

    expect((el as any)._extractTextContent('abc')).to.equal('abc');
    expect(
      (el as any)._extractTextContent(['x', { text: 'y' }, { type: 'image' }, {}, null])
    ).to.equal('xy[image]');

    (el as any)._runtimeSyncMessagesFromSnapshot([
      { id: 'm1', role: 'activity', content: { a: 1 } },
      { id: 'm2', role: 'assistant', content: '' },
      { id: 'm3', role: 'user', content: [{ text: 'hi' }] },
      { id: 'm4', role: 'user', content: '' },
    ]);
    expect((el as any)._runtimeMessages.length).to.equal(3);
    expect((el as any)._runtimeMessages[0].content).to.include('"a": 1');

    (el as any)._runtimeMessages = [{ id: 'assistant-1', role: 'assistant', content: 'A' }];
    (el as any)._runtimeAppendAssistantDelta('B', 'assistant-1');
    expect((el as any)._runtimeMessages[0].content).to.equal('AB');

    (el as any)._runtimeAppendAssistantDelta('C', 'assistant-2');
    expect((el as any)._runtimeMessages.length).to.equal(2);
    expect((el as any)._runtimeMessages[1]).to.deep.include({ id: 'assistant-2', content: 'C' });

    (el as any)._runtimePushRawEvent({ seq: 0 });
    for (let i = 1; i <= 55; i += 1) {
      (el as any)._runtimePushRawEvent({ seq: i });
    }
    expect((el as any)._runtimeRawEvents.length).to.equal(50);
    expect((el as any)._runtimeRawEvents[0]).to.deep.equal({ seq: 55 });

    (el as any)._runtimeInterruptValues = { ticket: 'INC-1', summary: 'old summary' };
    (el as any)._runtimeSetPendingInterrupts([
      {
        id: 'interrupt-1',
        message: 'Need fields',
        responseSchema: {
          properties: {
            ticket: { description: 'Ticket number' },
            summary: { description: 'Issue summary' },
          },
        },
      },
    ]);
    expect((el as any)._runtimePendingInterrupts.length).to.equal(1);
    expect((el as any)._runtimePendingInterruptWidget.interruptId).to.equal('interrupt-1');
    expect((el as any)._runtimeInterruptValues).to.deep.equal({ ticket: 'INC-1', summary: 'old summary' });

    expect((el as any)._runtimeBuildInterruptUserMessage()).to.equal(
      'Shared additional details:\n- ticket: INC-1\n- summary: old summary'
    );

    expect((el as any)._runtimeBuildResumeEntries('resolved')).to.deep.equal([
      {
        interruptId: 'interrupt-1',
        status: 'resolved',
        payload: { ticket: 'INC-1', summary: 'old summary' },
      },
    ]);

    expect((el as any)._runtimeBuildResumeEntries('cancelled')).to.deep.equal([
      {
        interruptId: 'interrupt-1',
        status: 'cancelled',
      },
    ]);

    (el as any)._runtimeSetPendingInterrupts([]);
    expect((el as any)._runtimePendingInterruptWidget).to.equal(null);
    expect((el as any)._runtimeInterruptValues).to.deep.equal({});
    expect((el as any)._runtimeBuildInterruptUserMessage()).to.equal('Shared additional details.');

    expect(scrollSpy.mock.calls.length).to.be.greaterThan(0);
  });

  it('maps runtime labels and interrupt field input updates', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    (el as any)._user = { firstName: 'Ada', lastName: 'Lovelace', name: 'A. Lovelace' };
    expect((el as any)._runtimeGetUserLabel()).to.equal('Ada Lovelace');
    expect((el as any)._runtimeGetMessageLabel('assistant')).to.equal('Agent');
    expect((el as any)._runtimeGetMessageLabel('tool')).to.equal('Tool');
    expect((el as any)._runtimeGetMessageLabel('activity')).to.equal('Activity');
    expect((el as any)._runtimeGetMessageLabel('reasoning')).to.equal('Reasoning');
    expect((el as any)._runtimeGetMessageLabel('developer')).to.equal('Developer');
    expect((el as any)._runtimeGetMessageLabel('system')).to.equal('System');
    expect((el as any)._runtimeGetMessageLabel('user')).to.equal('Ada Lovelace');

    (el as any)._user = { name: 'Only Name' };
    expect((el as any)._runtimeGetUserLabel()).to.equal('Only Name');

    (el as any)._user = {};
    expect((el as any)._runtimeGetUserLabel()).to.equal('You');

    (el as any)._runtimeInterruptValues = { key: 'old' };
    (el as any)._runtimeOnInterruptFieldInput('key', {
      detail: { value: 'new' },
    });
    expect((el as any)._runtimeInterruptValues).to.deep.equal({ key: 'new' });
  });

  it('subscriber callbacks update runtime state across run lifecycle', async () => {
    const el = await fixture<ScChat>(html`<sc-chat ?disable-api=${true}></sc-chat>`);

    const requestUpdateSpy = jest.spyOn(el as any, 'requestUpdate').mockImplementation(() => undefined);
    const pushRawSpy = jest.spyOn(el as any, '_runtimePushRawEvent');
    const syncSnapshotSpy = jest.spyOn(el as any, '_runtimeSyncMessagesFromSnapshot');
    const setInterruptsSpy = jest.spyOn(el as any, '_runtimeSetPendingInterrupts');
    const appendDeltaSpy = jest.spyOn(el as any, '_runtimeAppendAssistantDelta');
    const appendMessageSpy = jest.spyOn(el as any, '_runtimeAppendMessage');

    (el as any).conversationId = 'conv-existing';
    (el as any)._lastRunId = 'run-existing';
    (el as any)._runtimeAgent = { threadId: '', abortRun: jest.fn() };

    const subscriber = (el as any)._runtimeCreateSubscriber();

    subscriber.onEvent?.({ event: { type: 'RAW' } } as any);
    expect(pushRawSpy.mock.calls.length).to.equal(1);

    subscriber.onRunStartedEvent?.({ event: { threadId: 'conv-new', runId: 'run-new' } } as any);
    expect((el as any).conversationId).to.equal('conv-new');
    expect((el as any)._lastRunId).to.equal('run-new');
    expect((el as any).uiStatus).to.equal('streaming');
    expect((el as any)._runtimeAgent.threadId).to.equal('conv-new');

    subscriber.onMessagesSnapshotEvent?.({ event: { messages: [{ id: 'm1', role: 'assistant', content: 'x' }] } } as any);
    expect(syncSnapshotSpy.mock.calls.length).to.equal(1);

    subscriber.onStateSnapshotEvent?.({
      event: {
        snapshot: {
          threadId: 'conv-snap',
          runId: 'run-snap',
          pendingInterrupts: [{ id: 'i1' }],
        },
      },
    } as any);
    expect((el as any).conversationId).to.equal('conv-snap');
    expect((el as any)._lastRunId).to.equal('run-snap');
    expect((el as any).uiStatus).to.equal('interrupted');
    expect(setInterruptsSpy.mock.calls.length).to.be.greaterThan(0);

    subscriber.onTextMessageStartEvent?.({ event: { messageId: 'msg-1' } } as any);
    subscriber.onTextMessageContentEvent?.({ event: { messageId: 'msg-1', delta: 'hello' } } as any);
    expect(appendDeltaSpy.mock.calls.length).to.equal(2);

    (el as any)._runtimePendingInterrupts = [];
    subscriber.onTextMessageEndEvent?.();
    expect((el as any).uiStatus).to.equal('completed');

    subscriber.onCustomEvent?.({
      event: {
        name: 'orchestrator.interrupt.widget',
        value: {
          interruptId: 'i2',
          props: {
            fields: [{ fieldName: 'foo' }, { fieldName: 'bar' }],
          },
        },
      },
    } as any);
    expect((el as any).uiStatus).to.equal('interrupted');
    expect((el as any)._runtimeInterruptValues).to.deep.equal({ foo: '', bar: '' });

    subscriber.onRunFinishedEvent?.({
      event: { threadId: 'conv-finish', runId: 'run-finish' },
      outcome: 'interrupt',
      interrupts: [{ id: 'i9' }],
    } as any);
    expect((el as any).conversationId).to.equal('conv-finish');
    expect((el as any)._lastRunId).to.equal('run-finish');
    expect((el as any).uiStatus).to.equal('interrupted');

    (el as any).uiStatus = 'streaming';
    subscriber.onRunFinishedEvent?.({
      event: { threadId: 'conv-done', runId: 'run-done' },
      outcome: 'success',
    } as any);
    expect((el as any).uiStatus).to.equal('completed');

    (el as any).uiStatus = 'cancelled';
    subscriber.onRunFinishedEvent?.({
      event: { threadId: 'conv-cancelled', runId: 'run-cancelled' },
      outcome: 'success',
    } as any);
    expect((el as any).uiStatus).to.equal('cancelled');

    subscriber.onRunErrorEvent?.({ event: { message: 'broken' } } as any);
    expect((el as any).uiStatus).to.equal('error');
    expect(appendMessageSpy.mock.calls.length).to.equal(1);
    expect((appendMessageSpy.mock.calls[0][0] as any).content).to.equal('broken');

    (el as any)._runtimeAgent = null;
    expect(requestUpdateSpy.mock.calls.length).to.be.greaterThan(0);
  });
});
