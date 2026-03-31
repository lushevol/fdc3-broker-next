import { startFetchSSE } from '../adapters/fetchSSE';

describe('fetchSSE', () => {
  it('preserves leading spaces that belong to streamed message chunks', async () => {
    const encoder = new TextEncoder();
    const onEvent = jest.fn();
    const onConnectionError = jest.fn();
    const reader = {
      read: jest
        .fn()
        .mockResolvedValueOnce({
          value: encoder.encode('event:message\ndata:  from\n\n'),
          done: false,
        })
        .mockResolvedValueOnce({
          value: undefined,
          done: true,
        }),
    };
    const fetchImpl = jest.fn<typeof fetch>().mockResolvedValue(
      {
        ok: true,
        body: {
          getReader: () => reader,
        },
      } as Response,
    );

    const request = startFetchSSE({
      url: '/api/chat/stream',
      body: { message: 'hello' },
      handlers: {
        onEvent,
        onConnectionError,
      },
      fetchImpl,
    });

    await request.completed;

    expect(onEvent).toHaveBeenCalledWith('message', ' from');
  });
});
