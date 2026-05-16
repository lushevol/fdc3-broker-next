import React from 'react';
import { JsonToolCard, type ToolRenderProps } from '../../compositor';

export function Fdc3WorkflowTranscriptTool({ result }: ToolRenderProps) {
  return (
    <JsonToolCard
      toolName="execute_fdc3_workflow"
      title="FDC3 Workflow Result"
      result={result}
      emptyMessage="No workflow transcript was returned."
    />
  );
}
