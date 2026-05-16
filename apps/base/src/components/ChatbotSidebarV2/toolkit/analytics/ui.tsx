import React from 'react';
import {
  asString,
  LoadingToolCard,
  JsonToolCard,
  normalizeUsageStatistics,
  UsageStatisticsCard,
  type ToolRenderProps,
} from '../compositor';

export function AnalyticsTool({ args, result }: ToolRenderProps) {
  if (result === undefined) {
    return (
      <LoadingToolCard
        toolName="analytics"
        message={`Looking up analytics for ${String(args.application ?? 'the selected application')}...`}
      />
    );
  }

  const usage = normalizeUsageStatistics(args, result);
  if (!usage) {
    return (
      <JsonToolCard
        toolName="analytics"
        title={`Analytics: ${String(args.application ?? 'unknown')}`}
        result={result}
        emptyMessage="No analytics data was returned."
      />
    );
  }

  return <UsageStatisticsCard usage={usage} />;
}
