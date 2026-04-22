/**
 * Application-layer ToolkitBridge implementation.
 *
 * This bridge connects the chat-protocol runtime to the app's assistant-ui toolkit,
 * allowing the protocol to execute frontend tools through the toolkit's execute functions.
 *
 * @example
 * ```typescript
 * import { createToolkitBridge } from '@/lib/toolkitBridge';
 * import { toolkit } from '@/components/toolkit/tools';
 *
 * const toolkitBridge = createToolkitBridge(toolkit);
 *
 * <ChatProtocolProvider
 *   toolkitBridge={toolkitBridge}
 * >
 * ```
 */

import type { ToolkitBridge } from 'chat-protocol-runtime';

/**
 * Error thrown when a tool is not found or cannot be executed.
 */
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

/**
 * Creates a ToolkitBridge that wraps an assistant-ui toolkit.
 *
 * @param toolkit - The assistant-ui toolkit containing frontend tool definitions
 * @returns A ToolkitBridge implementation
 * @throws ToolkitBridgeError if toolkit is invalid
 */
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

/**
 * Creates a ToolkitBridge with logging for debugging purposes.
 *
 * @param toolkit - The assistant-ui toolkit
 * @param options - Logging options
 * @returns A ToolkitBridge with logging
 */
export function createLoggingToolkitBridge(
  toolkit: Record<string, unknown>,
  options: {
    logPrefix?: string;
    logInput?: boolean;
    logOutput?: boolean;
    logErrors?: boolean;
  } = {},
): ToolkitBridge & { getExecutionLog(): string[] } {
  const {
    logPrefix = '[ToolkitBridge]',
    logInput = true,
    logOutput = true,
    logErrors = true,
  } = options;

  const executionLog: string[] = [];

  const log = (message: string) => {
    const entry = `${logPrefix} ${message}`;
    executionLog.push(entry);
    // eslint-disable-next-line no-console
    console.log(entry);
  };

  const baseBridge = createToolkitBridge(toolkit);

  return {
    executeTool: async (toolName: string, input: unknown) => {
      const startTime = Date.now();

      if (logInput) {
        log(`Executing tool "${toolName}" with input: ${JSON.stringify(input)}`);
      }

      try {
        const result = await baseBridge.executeTool(toolName, input);
        const duration = Date.now() - startTime;

        if (logOutput) {
          log(
            `Tool "${toolName}" completed in ${duration}ms with result: ${JSON.stringify(result)}`,
          );
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        if (logErrors) {
          log(
            `Tool "${toolName}" failed after ${duration}ms: ${error instanceof Error ? error.message : String(error)}`,
          );
        }

        throw error;
      }
    },

    hasFrontendTool: baseBridge.hasFrontendTool,

    getExecutionLog: () => [...executionLog],
  };
}
