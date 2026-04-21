import type { ToolkitBridge } from 'chat-protocol-runtime';

export class ToolkitBridgeError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ToolkitBridgeError';
  }
}

export function createToolkitBridge(toolkit: Record<string, unknown>): ToolkitBridge {
  if (!toolkit || typeof toolkit !== 'object') {
    throw new ToolkitBridgeError('Invalid toolkit: expected object', 'unknown');
  }

  const entries = Object.entries(toolkit);
  if (entries.length === 0) {
    throw new ToolkitBridgeError('Invalid toolkit: empty object', 'unknown');
  }

  return {
    executeTool: async (toolName: string, input: unknown): Promise<Record<string, unknown>> => {
      const tool = toolkit[toolName];

      if (!tool) {
        throw new ToolkitBridgeError(`Tool "${toolName}" not found in toolkit`, toolName);
      }

      if (typeof tool !== 'object' || tool === null) {
        throw new ToolkitBridgeError(`Tool "${toolName}" is not a valid tool object`, toolName);
      }

      const toolRecord = tool as Record<string, unknown>;

      if (toolRecord.type !== 'frontend') {
        throw new ToolkitBridgeError(
          `Tool "${toolName}" is not a frontend tool (type: ${String(toolRecord.type)})`,
          toolName,
        );
      }

      if (typeof toolRecord.execute !== 'function') {
        throw new ToolkitBridgeError(
          `Tool "${toolName}" does not have an execute function`,
          toolName,
        );
      }

      try {
        const result = await (toolRecord.execute as (input: unknown) => Promise<unknown>)(input);
        return result as Record<string, unknown>;
      } catch (error) {
        throw new ToolkitBridgeError(
          `Tool "${toolName}" execution failed: ${error instanceof Error ? error.message : String(error)}`,
          toolName,
          error instanceof Error ? error : undefined,
        );
      }
    },

    hasFrontendTool: (toolName: string): boolean => {
      const tool = toolkit[toolName];
      if (typeof tool !== 'object' || tool === null) {
        return false;
      }
      const toolRecord = tool as Record<string, unknown>;
      return toolRecord.type === 'frontend' && typeof toolRecord.execute === 'function';
    },
  };
}
