export interface AiModelCategory {
  id: string;
  name: string;
}

export interface AiModelToolset {
  id: string;
  name: string;
  description?: string;
  greeting?: string;
  categories?: AiModelCategory[];
  modelId?: string;
}

export interface AiModel {
  id: string;
  name: string;
  description?: string;
  configuration?: {
    isConversationHistorySupported?: boolean;
    isDocumentUploadSupported?: boolean;
    isImageUploadSupported?: boolean;
    showInAIAssistant?: boolean;
  };
  toolsets?: AiModelToolset[];
}

export interface SetupAiModelsResult {
  aiModels: AiModel[];
  aiModelMap: Record<string, AiModel>;
}

export interface AdapterClients {
  restClient?: {
    request: (
      name: string,
      resource: string,
      method?: string,
      body?: string,
      headers?: Record<string, string>,
      options?: Record<string, unknown>,
      others?: { onSend?: (client: any) => void }
    ) => Promise<any>;
  };
  graphQLClient?: {
    query: (query: string) => Promise<{ json: () => Promise<any> }>;
  };
}

export interface AdapterSettings {
  apiProtocol?: ChatProtocol;
  agUiEndpoint?: string;
  agUiApiName?: string;
  agUiResource?: string;
  metadata?: Record<string, any>;
  legacyApiName?: string;
  legacyResource?: string;
}

export interface StreamRequest {
  content: string;
  model: string;
  conversationId: string;
  toolsetId?: string;
  categoryId?: string;
}

export interface StreamCallbacks {
  onData: (data: string) => void;
  onDataError?: (error: any) => void;
  onComplete?: () => void;
  onError?: (error: any) => void;
  onSend?: (client: any) => void;
  onRunStarted?: (meta: { conversationId?: string; runId?: string }) => void;
  onInterrupt?: (interrupts: any[]) => void;
  onInterruptWidget?: (widget: any) => void;
}

export interface ChatApiAdapter {
  protocol: ChatProtocol;
  setupAiModels: (clients: AdapterClients, settings?: AdapterSettings) => Promise<SetupAiModelsResult>;
  streamChat: (
    clients: AdapterClients,
    input: StreamRequest,
    callbacks: StreamCallbacks,
    settings?: AdapterSettings
  ) => Promise<void>;
}

export type ChatProtocol = 'ag-ui' | 'legacy-graphql';
