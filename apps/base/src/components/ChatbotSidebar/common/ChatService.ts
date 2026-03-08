import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  SSEEvent,
  ToolCall,
  ToolResult,
} from './interface';

export interface ChatServiceConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ChatService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(config: ChatServiceConfig) {
    this.baseUrl = config.baseUrl;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get auth token from storage or context
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          this.handleUnauthorized();
        } else if (error.response?.status === 429) {
          // Handle rate limiting
          const retryAfter = error.response.headers['retry-after'];
          return Promise.reject(new RateLimitError(retryAfter));
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Get token from localStorage or sessionStorage
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  private handleUnauthorized(): void {
    // Clear token and optionally redirect to login
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    // Emit event or call callback
    window.dispatchEvent(new CustomEvent('chatbot:unauthorized'));
  }

  /**
   * Send a chat message and get a response
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await this.client.post<ChatResponse>('/chat', request);
    return response.data;
  }

  /**
   * Create an SSE connection for streaming responses
   */
  createStreamConnection(
    message: string,
    conversationId: string | null,
    onEvent: (event: SSEEvent) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): () => void {
    const params = new URLSearchParams({
      message,
      ...(conversationId && { conversationId }),
    });

    const url = `${this.baseUrl}/chat/stream?${params.toString()}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onEvent(data);
      } catch (e) {
        console.error('Failed to parse SSE event:', e);
      }
    };

    eventSource.onerror = (event) => {
      console.error('SSE error:', event);
      onError(new Error('Connection lost'));
      eventSource.close();
    };

    // Handle custom event types
    eventSource.addEventListener('done', () => {
      onComplete();
      eventSource.close();
    });

    eventSource.addEventListener('error', (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data);
        onError(new Error(data.message || 'Unknown error'));
      } catch {
        onError(new Error('Stream error'));
      }
      eventSource.close();
    });

    // Return cleanup function
    return () => {
      eventSource.close();
    };
  }

  /**
   * Confirm a tool execution
   */
  async confirmToolCall(
    conversationId: string,
    toolCallId: string,
    confirmed: boolean
  ): Promise<void> {
    await this.client.post(`/chat/${conversationId}/tools/${toolCallId}/confirm`, {
      confirmed,
    });
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await this.client.get<{ messages: ChatMessage[] }>(
      `/chat/${conversationId}/history`
    );
    return response.data.messages;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

/**
 * Custom error for rate limiting
 */
export class RateLimitError extends Error {
  public retryAfter: number | null;

  constructor(retryAfter: string | number | null) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter ? parseInt(String(retryAfter), 10) : null;
  }
}

// Default instance
let defaultChatService: ChatService | null = null;

export const getChatService = (config?: ChatServiceConfig): ChatService => {
  if (!defaultChatService && config) {
    defaultChatService = new ChatService(config);
  }
  if (!defaultChatService) {
    throw new Error('ChatService not initialized. Call getChatService with config first.');
  }
  return defaultChatService;
};

export const initializeChatService = (config: ChatServiceConfig): ChatService => {
  defaultChatService = new ChatService(config);
  return defaultChatService;
};

export default ChatService;