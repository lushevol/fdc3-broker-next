/**
 * ToolkitBridge provides a bridge between the chat-protocol runtime
 * and the application-layer toolkit for unified frontend tool execution.
 *
 * @example
 * ```typescript
 * const bridge: ToolkitBridge = {
 *   executeTool: async (toolName, input) => {
 *     const tool = toolkit[toolName];
 *     return tool.execute(input);
 *   },
 *   hasFrontendTool: (toolName) => toolkit[toolName]?.type === 'frontend',
 * };
 * ```
 */
export interface ToolkitBridge {
  /**
   * Execute a frontend tool by name with the given input.
   * This delegates to the toolkit's execute function.
   *
   * @param toolName - The name of the tool to execute
   * @param input - The input parameters for the tool
   * @returns The tool execution result as a Record
   * @throws Error if the tool is not found or execution fails
   */
  executeTool(toolName: string, input: unknown): Promise<Record<string, unknown>>;

  /**
   * Check if a tool exists in the toolkit and is a frontend tool.
   * Used to determine if a tool call should be handled by the bridge.
   *
   * @param toolName - The name of the tool to check
   * @returns True if the tool exists and is a frontend tool
   */
  hasFrontendTool(toolName: string): boolean;
}

/**
 * Helper type guard to check if a value is a ToolkitBridge.
 */
export function isToolkitBridge(value: unknown): value is ToolkitBridge {
  return (
    typeof value === 'object' &&
    value !== null &&
    'executeTool' in value &&
    typeof (value as ToolkitBridge).executeTool === 'function' &&
    'hasFrontendTool' in value &&
    typeof (value as ToolkitBridge).hasFrontendTool === 'function'
  );
}
