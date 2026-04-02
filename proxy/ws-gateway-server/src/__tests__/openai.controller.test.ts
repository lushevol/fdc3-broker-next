import { ServiceUnavailableException } from '@nestjs/common';
import { OpenAIController } from '../controllers/openai.controller';

describe('OpenAIController', () => {
  test('does not create pending task when no client socket is available', async () => {
    const gateway = {
      selectNextClientSocketId: jest.fn(() => null),
      emitTaskToClient: jest.fn(),
      requestModelsFromAll: jest.fn(),
    };

    const taskService = {
      createPendingTask: jest.fn(),
    };

    const adapter = {
      toProxyTaskFromOpenAIChat: jest.fn(() => ({ taskId: 't1', responseMode: 'sync' })),
      toOpenAIChatResponse: jest.fn(),
      toProxyTaskFromOpenAIEmbeddings: jest.fn(),
      toOpenAIEmbeddingResponse: jest.fn(),
      toOpenAIModelsResponse: jest.fn(),
      toOpenAISseFrame: jest.fn(),
      openAIDoneFrame: jest.fn(),
      toOpenAIErrorSseFrame: jest.fn(),
    };

    const modelsAggregation = {
      waitForResponses: jest.fn(),
    };

    const controller = new OpenAIController(
      gateway as any,
      taskService as any,
      adapter as any,
      modelsAggregation as any,
    );

    await expect(
      controller.createChatCompletion({ model: 'gpt-4o-mini', messages: [], stream: false }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(taskService.createPendingTask).not.toHaveBeenCalled();
  });

  test('flushes stream headers before dispatching stream task when supported', async () => {
    const gateway = {
      selectNextClientSocketId: jest.fn(() => 'socket-1'),
      emitTaskToClient: jest.fn(),
      requestModelsFromAll: jest.fn(),
    };

    const taskService = {
      createPendingTask: jest.fn(() => ({
        onChunk: jest.fn(() => () => undefined),
        waitForResult: jest.fn(async () => ({
          taskId: 't1',
          result: { content: '' },
        })),
      })),
    };

    const adapter = {
      toProxyTaskFromOpenAIChat: jest.fn(() => ({ taskId: 't1', responseMode: 'stream' })),
      toOpenAIChatResponse: jest.fn(),
      toProxyTaskFromOpenAIEmbeddings: jest.fn(),
      toOpenAIEmbeddingResponse: jest.fn(),
      toOpenAIModelsResponse: jest.fn(),
      toOpenAISseFrame: jest.fn(),
      openAIDoneFrame: jest.fn(() => 'data: [DONE]\\n\\n'),
      toOpenAIErrorSseFrame: jest.fn(),
    };

    const modelsAggregation = {
      waitForResponses: jest.fn(),
    };

    const controller = new OpenAIController(
      gateway as any,
      taskService as any,
      adapter as any,
      modelsAggregation as any,
    );

    const callOrder: string[] = [];
    const res = {
      setHeader: jest.fn(),
      flushHeaders: jest.fn(() => {
        callOrder.push('flushHeaders');
      }),
      write: jest.fn(),
      end: jest.fn(),
    };
    gateway.emitTaskToClient.mockImplementation(() => {
      callOrder.push('emitTaskToClient');
    });

    await expect(
      controller.createChatCompletion(
        { model: 'gpt-4o-mini', messages: [], stream: true },
        res as any,
      ),
    ).resolves.toBeUndefined();

    expect(res.flushHeaders).toHaveBeenCalledTimes(1);
    expect(callOrder).toEqual(['flushHeaders', 'emitTaskToClient']);
  });

  test('keeps route handler context when chat completion handler is invoked detached', async () => {
    const gateway = {
      selectNextClientSocketId: jest.fn(() => null),
      emitTaskToClient: jest.fn(),
      requestModelsFromAll: jest.fn(),
    };

    const taskService = {
      createPendingTask: jest.fn(),
    };

    const adapter = {
      toProxyTaskFromOpenAIChat: jest.fn(() => ({ taskId: 't1', responseMode: 'sync' })),
      toOpenAIChatResponse: jest.fn(),
      toProxyTaskFromOpenAIEmbeddings: jest.fn(),
      toOpenAIEmbeddingResponse: jest.fn(),
      toOpenAIModelsResponse: jest.fn(),
      toOpenAISseFrame: jest.fn(),
      openAIDoneFrame: jest.fn(),
      toOpenAIErrorSseFrame: jest.fn(),
    };

    const modelsAggregation = {
      waitForResponses: jest.fn(),
    };

    const controller = new OpenAIController(
      gateway as any,
      taskService as any,
      adapter as any,
      modelsAggregation as any,
    );

    const detachedHandler = controller.createChatCompletion;

    await expect(
      detachedHandler({ model: 'gpt-4o-mini', messages: [], stream: false }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);

    expect(adapter.toProxyTaskFromOpenAIChat).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ model: 'gpt-4o-mini', stream: false }),
    );
  });
});
