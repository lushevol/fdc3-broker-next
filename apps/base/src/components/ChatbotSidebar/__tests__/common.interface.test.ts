import type { SSEEventType } from '../common/interface';

describe('common chatbot interface types', () => {
  it('includes conversation_id in the shared SSE event contract', () => {
    const eventType: SSEEventType = 'conversation_id';

    expect(eventType).toBe('conversation_id');
  });

  it('includes governed execution events in the shared SSE contract', () => {
    const planEventType: SSEEventType = 'execution_plan';
    const stepEventType: SSEEventType = 'execution_step';

    expect(planEventType).toBe('execution_plan');
    expect(stepEventType).toBe('execution_step');
  });
});
