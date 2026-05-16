import React from 'react';
import {
  Avatar,
  AvatarFallback,
} from 'chat-protocol-ui';
import {
  asString,
  LoadingToolCard,
  JsonToolCard,
  formatWindowLabel,
  initialsForUser,
  normalizeUserOperationRanking,
  type ToolRenderProps,
} from '../compositor';

export function HighestOperationUsersTool({ args, result }: ToolRenderProps) {
  if (result === undefined) {
    return (
      <LoadingToolCard
        toolName="highest_operation_users_by_application"
        message={`Ranking users for ${String(args.application ?? 'the selected application')}...`}
      />
    );
  }

  const ranking = normalizeUserOperationRanking(args, result);
  if (!ranking) {
    return (
      <JsonToolCard
        toolName="highest_operation_users_by_application"
        title={`User ranking: ${String(args.application ?? 'unknown')}`}
        result={result}
        emptyMessage="No ranked users were returned."
      />
    );
  }

  const peakCount = Math.max(...ranking.users.map((user) => user.count), 1);

  return (
    <div
      data-testid="user-operation-ranking-card"
      className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_20px_48px_-32px_rgba(15,23,42,0.28)]"
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-base font-semibold tracking-[-0.02em] text-slate-900">
            Highest operation users
          </div>
          <div className="mt-1 text-sm text-slate-500">{ranking.application}</div>
        </div>
        <div className="text-right text-xs text-slate-500">
          {formatWindowLabel(ranking.startTime, ranking.endTime)}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {ranking.users.map((user, index) => {
          const widthPercent = Math.max((user.count / peakCount) * 100, 12);
          return (
            <div key={`${user.userId}-${index}`} className="grid grid-cols-[auto,1fr,auto] items-center gap-3">
              <Avatar size="lg" className="border border-slate-200 bg-slate-100">
                <AvatarFallback className="bg-slate-200 font-semibold text-slate-700">
                  {initialsForUser(user.userId)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-medium text-slate-900">{user.userId}</div>
                  <div className="shrink-0 text-xs text-slate-500">#{index + 1}</div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e_0%,#14b8a6_100%)]"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
              <div className="min-w-[4.5rem] text-right text-sm font-semibold text-slate-900">
                {user.count.toLocaleString()} ops
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
