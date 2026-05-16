import React from 'react';
import { JsonToolCard, type ToolRenderProps } from '../compositor/ui-helpers';

export function ProfileLookupTool({ args, result }: ToolRenderProps) {
  return (
    <JsonToolCard
      toolName="profile_lookup"
      title={`Profile: ${String(args.userId ?? 'unknown')}`}
      result={result}
      emptyMessage="No profile details were returned."
    />
  );
}
