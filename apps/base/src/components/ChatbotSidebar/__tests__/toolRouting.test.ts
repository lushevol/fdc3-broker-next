import {
  executeAssistantTool,
  resolveAssistantToolInvocation,
  type AssistantRegisteredToolkit,
} from '../tools/toolRouting';

describe('toolRouting', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.restoreAllMocks();
  });

  it('prefers the highest-priority matching tool', () => {
    const toolkit: AssistantRegisteredToolkit = {
      lower_priority_tool: {
        type: 'frontend',
        description: 'Lower priority match',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ lower: true }),
        matchPriority: 10,
        matchPrompt: (input: string) => (input.includes('shared prompt') ? {} : null),
      },
      higher_priority_tool: {
        type: 'frontend',
        description: 'Higher priority match',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ higher: true }),
        matchPriority: 100,
        matchPrompt: (input: string) => (input.includes('shared prompt') ? {} : null),
      },
    };

    expect(resolveAssistantToolInvocation('shared prompt', toolkit)).toMatchObject({
      toolName: 'higher_priority_tool',
      args: {},
    });
  });

  it('keeps declaration order when priorities are equal', () => {
    const toolkit: AssistantRegisteredToolkit = {
      first_tool: {
        type: 'frontend',
        description: 'First match',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ first: true }),
        matchPrompt: (input: string) => (input.includes('same priority') ? {} : null),
      },
      second_tool: {
        type: 'frontend',
        description: 'Second match',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ second: true }),
        matchPrompt: (input: string) => (input.includes('same priority') ? {} : null),
      },
    };

    expect(resolveAssistantToolInvocation('same priority', toolkit)).toMatchObject({
      toolName: 'first_tool',
      args: {},
    });
  });

  it('prefers the higher-confidence match when priorities are equal', () => {
    const toolkit: AssistantRegisteredToolkit = {
      lower_confidence_tool: {
        type: 'frontend',
        description: 'Lower confidence match',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ lower: true }),
        matchPriority: 50,
        matchPrompt: (input: string) =>
          input.includes('confidence match')
            ? {
                args: { source: 'lower' },
                confidence: 0.3,
              }
            : null,
      },
      higher_confidence_tool: {
        type: 'frontend',
        description: 'Higher confidence match',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ higher: true }),
        matchPriority: 50,
        matchPrompt: (input: string) =>
          input.includes('confidence match')
            ? {
                args: { source: 'higher' },
                confidence: 0.9,
              }
            : null,
      },
    };

    expect(resolveAssistantToolInvocation('confidence match', toolkit)).toMatchObject({
      toolName: 'higher_confidence_tool',
      args: { source: 'higher' },
    });
  });

  it('executes the resolved tool using the shared executor', async () => {
    const execute = jest.fn(async () => ({ ok: true }));
    const toolkit: AssistantRegisteredToolkit = {
      routed_tool: {
        type: 'frontend',
        description: 'Routed tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute,
        matchPriority: 50,
        matchPrompt: (input: string) => (input.includes('route me') ? { source: 'test' } : null),
      },
    };

    const invocation = resolveAssistantToolInvocation('please route me', toolkit);

    expect(invocation).toMatchObject({
      toolName: 'routed_tool',
      args: { source: 'test' },
    });

    await expect(
      executeAssistantTool(
        toolkit,
        invocation as { toolName: string; args: Record<string, unknown> },
      ),
    ).resolves.toMatchObject({ ok: true });
    expect(execute).toHaveBeenCalledWith({ source: 'test' }, expect.any(Object));
  });

  it('logs the winning match in development', () => {
    process.env.NODE_ENV = 'development';
    const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const toolkit: AssistantRegisteredToolkit = {
      dev_logged_tool: {
        type: 'frontend',
        description: 'Dev logged tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
        matchPriority: 20,
        matchPrompt: (input: string) =>
          input.includes('debug route')
            ? {
                args: { source: 'debug' },
                confidence: 0.75,
              }
            : null,
      },
    };

    expect(resolveAssistantToolInvocation('please debug route this', toolkit)).toMatchObject({
      toolName: 'dev_logged_tool',
      args: { source: 'debug' },
    });

    expect(consoleDebugSpy).toHaveBeenCalledWith(
      '[assistant-tools] resolved prompt match',
      expect.objectContaining({
        toolName: 'dev_logged_tool',
        priority: 20,
        confidence: 0.75,
        input: 'please debug route this',
      }),
    );
  });

  it('does not log matches in production', () => {
    process.env.NODE_ENV = 'production';
    const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const toolkit: AssistantRegisteredToolkit = {
      silent_tool: {
        type: 'frontend',
        description: 'Silent tool',
        parameters: {
          type: 'object',
          properties: {},
        },
        execute: async () => ({ ok: true }),
        matchPrompt: (input: string) => (input.includes('silent route') ? {} : null),
      },
    };

    expect(resolveAssistantToolInvocation('silent route', toolkit)).toMatchObject({
      toolName: 'silent_tool',
      args: {},
    });

    expect(consoleDebugSpy).not.toHaveBeenCalled();
  });
});
