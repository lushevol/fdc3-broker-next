import React from 'react';
import { JsonToolCard, type ToolRenderProps } from '../../compositor';

export function Fdc3ExecutionResultTool({ result }: ToolRenderProps) {
  return (
    <JsonToolCard
      toolName="execute_fdc3_action"
      title="FDC3 Result"
      result={result}
      emptyMessage="No result was returned from the target tile."
    />
  );
}
