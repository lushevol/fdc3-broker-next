import type { SSEEventType } from '../common/interface';

describe('common chatbot interface types', () => {
  it('includes conversation_id in the shared SSE event contract', () => {
    const eventType: SSEEventType = 'conversation_id';

    expect(eventType).toBe('conversation_id');
  });
});
