import { describe, expect, it } from '@jest/globals';
import { createToolkitBridge, ToolkitBridgeError } from './toolkitBridge';

describe('createToolkitBridge', () => {
  const mockToolkit = {
    test_tool: {
      type: 'frontend',
      execute: async () => ({ result: 'done' }),
    },
    human_tool: {
      type: 'human',
      execute: async () => ({}),
    },
  };

  it('executes a frontend tool successfully', async () => {
    const bridge = createToolkitBridge(mockToolkit);
    const result = await bridge.executeTool('test_tool', { input: 'data' });
    expect(result).toEqual({ result: 'done' });
  });

  it('throws on unknown tool', async () => {
    const bridge = createToolkitBridge(mockToolkit);
    await expect(bridge.executeTool('unknown', {})).rejects.toThrow(ToolkitBridgeError);
    await expect(bridge.executeTool('unknown', {})).rejects.toThrow('"unknown" not found');
  });

  it('throws on non-frontend tool', async () => {
    const bridge = createToolkitBridge(mockToolkit);
    await expect(bridge.executeTool('human_tool', {})).rejects.toThrow(
      'is not a frontend tool',
    );
  });

  it('checks hasFrontendTool correctly', () => {
    const bridge = createToolkitBridge(mockToolkit);
    expect(bridge.hasFrontendTool('test_tool')).toBe(true);
    expect(bridge.hasFrontendTool('human_tool')).toBe(false);
    expect(bridge.hasFrontendTool('unknown')).toBe(false);
  });

  it('throws on invalid toolkit input', () => {
    expect(() => createToolkitBridge(null as unknown as Record<string, unknown>)).toThrow(
      ToolkitBridgeError,
    );
    expect(() => createToolkitBridge({})).toThrow(ToolkitBridgeError);
  });
});
