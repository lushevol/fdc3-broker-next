import type { SSEEventType } from './types';

type FetchSSEHandlers = {
  onEvent: (eventType: SSEEventType, data: string) => void;
  onConnectionError: () => void;
};

type FetchSSEOptions = {
  url: string;
  body: Record<string, unknown>;
  signal?: AbortSignal;
  headers?: HeadersInit;
  handlers: FetchSSEHandlers;
  fetchImpl?: typeof fetch;
};

const SSE_RESPONSE_HEADERS = {
  Accept: 'text/event-stream',
  'Content-Type': 'application/json',
} as const;

function decodeSSEDataLine(line: string): string {
  const rawValue = line.slice('data:'.length);
  return rawValue.startsWith(' ') ? rawValue.slice(1) : rawValue;
}

function parseSSEChunk(
  rawChunk: string,
  onEvent: (eventType: SSEEventType, data: string) => void,
): void {
  const lines = rawChunk.split(/\r?\n/);
  let eventType: SSEEventType = 'message';
  const dataLines: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith('event:')) {
      const candidate = line.slice('event:'.length).trim() as SSEEventType;
      eventType = candidate;
      return;
    }

    if (line.startsWith('data:')) {
      dataLines.push(decodeSSEDataLine(line));
    }
  });

  onEvent(eventType, dataLines.join('\n'));
}

export function startFetchSSE({
  url,
  body,
  signal,
  headers,
  handlers,
  fetchImpl = fetch,
}: FetchSSEOptions): { close: () => void; completed: Promise<void> } {
  const abortController = new AbortController();
  const decoder = new TextDecoder();

  const onAbort = () => {
    abortController.abort();
  };

  signal?.addEventListener('abort', onAbort, { once: true });

  const completed = (async () => {
    try {
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          ...SSE_RESPONSE_HEADERS,
          ...headers,
        },
        body: JSON.stringify(body),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        handlers.onConnectionError();
        return;
      }

      const reader = response.body.getReader();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() ?? '';

        frames.forEach((frame) => {
          if (frame.trim().length > 0) {
            parseSSEChunk(frame, handlers.onEvent);
          }
        });
      }

      const trailing = buffer.trim();
      if (trailing.length > 0) {
        parseSSEChunk(trailing, handlers.onEvent);
      }

      if (!abortController.signal.aborted) {
        handlers.onConnectionError();
      }
    } catch (error) {
      if (!abortController.signal.aborted) {
        handlers.onConnectionError();
      }
    } finally {
      signal?.removeEventListener('abort', onAbort);
    }
  })();

  return {
    close: () => {
      abortController.abort();
    },
    completed,
  };
}
