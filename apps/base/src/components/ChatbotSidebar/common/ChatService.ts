import axios, { AxiosInstance, AxiosError } from 'axios';
import { ChatMessage } from './interface';

export interface ChatServiceConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ChatService {
  private client: AxiosInstance;

  constructor(config: ChatServiceConfig) {
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout ?? 30000,
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
      (error) => Promise.reject(error),
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
      },
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
   * Confirm a tool execution
   */
  async confirmToolCall(
    conversationId: string,
    toolCallId: string,
    confirmed: boolean,
  ): Promise<void> {
    await this.client.post(`/${conversationId}/tools/${toolCallId}/confirm`, {
      confirmed,
    });
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await this.client.get<{ messages: ChatMessage[] }>(
      `/${conversationId}/history`,
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
    const parsed = retryAfter == null ? null : Number.parseInt(String(retryAfter), 10);
    this.retryAfter = parsed !== null && Number.isFinite(parsed) ? parsed : null;
  }
}

/**
 * Compatibility shim for legacy callers that still import a service factory.
 * This no longer caches a singleton or owns transport state.
 */
export const getChatService = (config?: ChatServiceConfig): ChatService => {
  if (!config) {
    throw new Error('ChatService config is required.');
  }
  return new ChatService(config);
};

/**
 * Compatibility shim for legacy callers that still initialize a service factory.
 * This no longer caches a singleton or owns transport state.
 */
export const initializeChatService = (config: ChatServiceConfig): ChatService => {
  return new ChatService(config);
};

export default ChatService;
