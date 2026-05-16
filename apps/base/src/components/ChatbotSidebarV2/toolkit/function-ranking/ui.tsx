import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'chat-protocol-ui';
import {
  asString,
  LoadingToolCard,
  JsonToolCard,
  formatWindowLabel,
  normalizeFunctionUsageRanking,
  type ToolRenderProps,
} from '../compositor';

export function FunctionUsageRankingTool({ args, result }: ToolRenderProps) {
  if (result === undefined) {
    return (
      <LoadingToolCard
        toolName="most_used_functions_by_application"
        message={`Ranking functions for ${String(args.application ?? 'the selected application')}...`}
      />
    );
  }

  const ranking = normalizeFunctionUsageRanking(args, result);
  if (!ranking) {
    return (
      <JsonToolCard
        toolName="most_used_functions_by_application"
        title={`Function ranking: ${String(args.application ?? 'unknown')}`}
        result={result}
        emptyMessage="No ranked functions were returned."
      />
    );
  }

  return (
    <div
      data-testid="function-usage-ranking-table"
      className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_20px_48px_-32px_rgba(15,23,42,0.28)]"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-base font-semibold tracking-[-0.02em] text-slate-900">
            Most used functions
          </div>
          <div className="mt-1 text-sm text-slate-500">{ranking.application}</div>
        </div>
        <div className="text-right text-xs text-slate-500">
          {formatWindowLabel(ranking.startTime, ranking.endTime)}
        </div>
      </div>

      <div className="mt-4 rounded-[20px] border border-slate-200 bg-white p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Rank</TableHead>
              <TableHead>Function Path</TableHead>
              <TableHead className="w-24 text-right">Usage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranking.functions.map((entry, index) => (
              <TableRow key={`${entry.functionPath}-${index}`}>
                <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                <TableCell className="max-w-0 whitespace-normal break-all font-mono text-xs text-slate-900">
                  {entry.functionPath}
                </TableCell>
                <TableCell className="text-right font-semibold text-slate-900">
                  {entry.count.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
