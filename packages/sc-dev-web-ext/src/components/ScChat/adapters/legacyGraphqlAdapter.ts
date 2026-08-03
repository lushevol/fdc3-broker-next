import {
  AdapterClients,
  AdapterSettings,
  ChatApiAdapter,
  SetupAiModelsResult,
  StreamCallbacks,
  StreamRequest,
} from './types.js';

const LEGACY_NAMESPACE = '_55313_195_ask_sb_plugin_exp_api';
const LEGACY_API_NAME = '55313-195-ask-sb-plugin-ask-sb-plugin-exp-api';
const LEGACY_RESOURCE = 'sse';

const emptyResult: SetupAiModelsResult = {
  aiModels: [],
  aiModelMap: {},
};

const toResult = (aiModels: any[]): SetupAiModelsResult => {
  const aiModelMap: Record<string, any> = {};
  aiModels.forEach(model => {
    aiModelMap[model.id] = model;
  });
  return {
    aiModels,
    aiModelMap,
  };
};

const setupAiModels = async (clients: AdapterClients): Promise<SetupAiModelsResult> => {
  const graphQLClient = clients.graphQLClient;
  if (!graphQLClient?.query) {
    return emptyResult;
  }

  const response = await graphQLClient.query(`query {
    asksb: ${LEGACY_NAMESPACE} {
      ai_models: get_ai_models  {
        id
        name
        description
        configuration {
          isConversationHistorySupported
          isDocumentUploadSupported
          isImageUploadSupported
          showInAIAssistant
        }
        toolsets {
          id
          name
          description
          greeting
          categories {
            id
            name
          }
          modelId
        }
      }
    }
  }`);

  const { data } = await response.json();
  const aiModels = data?.asksb?.ai_models || [];
  return toResult(aiModels);
};

const streamChat = async (
  clients: AdapterClients,
  input: StreamRequest,
  callbacks: StreamCallbacks,
  settings?: AdapterSettings
) => {
  const restClient = clients.restClient;
  if (!restClient?.request) {
    throw new Error('REST client is required for legacy GraphQL streaming');
  }

  const requestBody = JSON.stringify({
    query: `subscription ($content: String!) {
      output: get_chunk_completions (
        messages: [{ role: "user", content: $content }],
        model: "${input.model}",
        conversationId: "${input.conversationId}",
        isSample: false,
        toolsetId: "${input.toolsetId || ''}",
        categoryId: "${input.categoryId || ''}"
      ) { id choices { delta { content } } } }`,
    variables: {
      content: input.content,
    },
  });

  const response: Response = await restClient.request(
    settings?.legacyApiName || LEGACY_API_NAME,
    settings?.legacyResource || LEGACY_RESOURCE,
    'POST',
    requestBody,
    {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    {},
    { onSend: callbacks.onSend }
  );

  const streamingResponse = response;
  if (!streamingResponse.ok) {
    throw new Error(`HTTP error! status: ${streamingResponse.status}`);
  }

  if (!streamingResponse.body) {
    throw new Error('Legacy GraphQL response body is empty');
  }

  const reader = streamingResponse.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split(/\r?\n/);

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) {
        return;
      }

      try {
        const dataChunk = JSON.parse(trimmed.substring('data:'.length));
        const choice = dataChunk?.output?.choices?.[0];
        const content = choice?.delta?.content;
        const outputId = dataChunk?.output?.id;

        if (content) {
          callbacks.onData(content);
          return;
        }

        if (typeof outputId === 'string' && outputId.startsWith('STOP-')) {
          callbacks.onComplete?.();
          return;
        }

        callbacks.onDataError?.({ data: line, error: 'Not a data chunk' });
      } catch (error) {
        callbacks.onDataError?.({ data: line, error });
      }
    });
  }

  callbacks.onComplete?.();
};

export const legacyGraphqlAdapter: ChatApiAdapter = {
  protocol: 'legacy-graphql',
  setupAiModels: async (clients: AdapterClients) => {
    try {
      return await setupAiModels(clients);
    } catch (error) {
      console.warn('Error loading legacy GraphQL model config:', error);
      return emptyResult;
    }
  },
  streamChat: async (
    clients: AdapterClients,
    input: StreamRequest,
    callbacks: StreamCallbacks,
    settings?: AdapterSettings
  ) => {
    try {
      await streamChat(clients, input, callbacks, settings);
    } catch (error) {
      callbacks.onError?.(error);
    }
  },
};
