let _authToken = '';

const resolveEndpoint = (apiName: string, resource: string) => {
  if (!resource) {
    return '/';
  }

  if (/^https?:\/\//.test(resource) || resource.startsWith('/')) {
    return resource;
  }

  if (apiName === 'ag-ui-api') {
    const normalized = resource.replace(/^\/+/, '');
    return `/ag-ui/${normalized}`;
  }

  const normalized = resource.replace(/^\/+/, '');
  return `/${normalized}`;
};

const createMockAgUiResponse = (body?: string, signal?: AbortSignal) => {
  let payload: Record<string, any> = {};

  if (typeof body === 'string' && body.trim()) {
    try {
      payload = JSON.parse(body);
    } catch (_error) {
      payload = {};
    }
  }

  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  const latestUserMessage = [...messages].reverse().find((item: Record<string, any>) => item?.role === 'user');
  const userText = typeof latestUserMessage?.content === 'string' ? latestUserMessage.content : '';
  const resumeEntries = Array.isArray(payload?.resume) ? payload.resume : [];
  const isResumeRequest = resumeEntries.length > 0;
  const threadId =
    (typeof payload?.conversationId === 'string' && payload.conversationId) ||
    (typeof payload?.threadId === 'string' && payload.threadId) ||
    'mock-thread';
  const runId =
    (typeof payload?.runId === 'string' && payload.runId) ||
    `mock-run-${Date.now()}`;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('sc-demo-mock-chat', {
        detail: {
          ...payload,
          mockMode: isResumeRequest ? 'runtime-resume' : 'runtime-prompt',
        },
      })
    );
  }

  const shouldInterrupt = !isResumeRequest && /interrupt|otp|approve|confirm/i.test(userText);
  const shouldError = /error|fail/i.test(userText);
  const mockInterrupt = {
    id: 'interrupt-kyc-1',
    message: 'Before continuing, please provide verification details.',
    responseSchema: {
      properties: {
        otpCode: {
          description: 'Enter the OTP code',
        },
        approvalNote: {
          description: 'Reason for approval',
        },
      },
    },
  };

  const interruptWidget = {
    interruptId: 'interrupt-kyc-1',
    message: 'Verification required to continue this request.',
    props: {
      fields: [
        {
          fieldName: 'otpCode',
          label: 'OTP code',
          placeholder: 'e.g. 123456',
          required: true,
        },
        {
          fieldName: 'approvalNote',
          label: 'Approval note',
          placeholder: 'e.g. Confirmed with customer over voice call',
          required: true,
        },
      ],
    },
  };

  const chunks = shouldError
    ? [
        { type: 'RUN_STARTED', threadId, runId },
        { type: 'RUN_ERROR', threadId, runId, message: 'Mock backend error: downstream failed.' },
      ]
    : shouldInterrupt
      ? [
          { type: 'RUN_STARTED', threadId, runId },
          { type: 'TEXT_MESSAGE_START', messageId: `assistant-${runId}`, role: 'assistant' },
          {
            type: 'TEXT_MESSAGE_CONTENT',
            messageId: `assistant-${runId}`,
            delta: 'I can help with that. I need verification before I proceed.',
          },
          { type: 'TEXT_MESSAGE_END', messageId: `assistant-${runId}` },
          {
            type: 'STATE_SNAPSHOT',
            threadId,
            runId,
            snapshot: {
              threadId,
              runId,
              pendingInterrupts: [mockInterrupt],
            },
          },
          {
            type: 'CUSTOM',
            name: 'orchestrator.interrupt.widget',
            value: interruptWidget,
          },
          {
            type: 'RUN_FINISHED',
            threadId,
            runId,
            outcome: {
              type: 'interrupt',
              interrupts: [mockInterrupt],
            },
          },
        ]
      : isResumeRequest
        ? [
            { type: 'RUN_STARTED', threadId, runId },
            { type: 'TEXT_MESSAGE_START', messageId: `assistant-${runId}`, role: 'assistant' },
            {
              type: 'TEXT_MESSAGE_CONTENT',
              messageId: `assistant-${runId}`,
              delta: 'Thanks, verification details received. ',
            },
            {
              type: 'TEXT_MESSAGE_CONTENT',
              messageId: `assistant-${runId}`,
              delta: 'Your request has been resumed successfully.',
            },
            { type: 'TEXT_MESSAGE_END', messageId: `assistant-${runId}` },
            {
              type: 'RUN_FINISHED',
              threadId,
              runId,
              outcome: { type: 'success', interrupts: null },
            },
          ]
        : [
            { type: 'RUN_STARTED', threadId, runId },
            { type: 'TEXT_MESSAGE_START', messageId: `assistant-${runId}`, role: 'assistant' },
            { type: 'TEXT_MESSAGE_CONTENT', messageId: `assistant-${runId}`, delta: 'Mock response: ' },
            { type: 'TEXT_MESSAGE_CONTENT', messageId: `assistant-${runId}`, delta: userText || 'empty input' },
            { type: 'TEXT_MESSAGE_END', messageId: `assistant-${runId}` },
            {
              type: 'RUN_FINISHED',
              threadId,
              runId,
              outcome: { type: 'success', interrupts: null },
            },
          ];

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let index = 0;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const abortHandler = () => {
        if (timer) {
          clearTimeout(timer);
        }
        controller.error(new DOMException('Aborted', 'AbortError'));
      };

      if (signal?.aborted) {
        abortHandler();
        return;
      }

      signal?.addEventListener('abort', abortHandler, { once: true });

      const pump = () => {
        if (index >= chunks.length) {
          controller.close();
          return;
        }

        const chunk = `data: ${JSON.stringify(chunks[index])}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        index += 1;
        timer = setTimeout(pump, 320);
      };

      timer = setTimeout(pump, 220);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
};

const createMockCancelResponse = (body?: string) => {
  let payload: Record<string, any> = {};

  if (typeof body === 'string' && body.trim()) {
    try {
      payload = JSON.parse(body);
    } catch (_error) {
      payload = {};
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sc-demo-mock-cancel', { detail: payload }));
  }

  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Mock cancel request accepted.',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const restClient = {
  setAuthToken: (authToken: string) => {
    _authToken = authToken;
  },
  request: async (
    name: string,
    resource: string,
    method = 'GET',
    body?: string,
    headers: Record<string, string> = {},
    _options: Record<string, unknown> = {},
    others: { onSend?: (client: any) => void } = {}
  ) => {
    const controller = new AbortController();
    others?.onSend?.({
      abort: () => controller.abort(),
    });

    const endpoint = resolveEndpoint(name, resource);

    if (endpoint.startsWith('/mock-ag-ui/')) {
      if (endpoint.includes('/cancel')) {
        return createMockCancelResponse(body);
      }
      return createMockAgUiResponse(body, controller.signal);
    }

    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    if (_authToken) {
      requestHeaders.Authorization = `Bearer ${_authToken}`;
    }

    return fetch(endpoint, {
      method,
      headers: requestHeaders,
      body,
      signal: controller.signal,
    });
  },
};
