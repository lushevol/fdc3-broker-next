import { asRecord, asNumber, asString, summarizeTrend } from './ui-helpers';

export type UsageTrendPoint = {
  timestamp: string;
  uv: number;
};

export type UsageStatisticsViewModel = {
  appLabel: string;
  startTime?: string;
  endTime?: string;
  uv?: number;
  trendPoints: UsageTrendPoint[];
  bucket?: string;
  supportsTrend: boolean;
};

export type UserOperationRank = {
  userId: string;
  count: number;
};

export type UserOperationRankingViewModel = {
  application: string;
  startTime?: string;
  endTime?: string;
  users: UserOperationRank[];
};

export type FunctionUsageRank = {
  functionPath: string;
  count: number;
};

export type FunctionUsageRankingViewModel = {
  application: string;
  startTime?: string;
  endTime?: string;
  functions: FunctionUsageRank[];
};

export function normalizeTrendPoints(resultRecord: Record<string, unknown>): UsageTrendPoint[] {
  const trendPoints = Array.isArray(resultRecord.trendPoints) ? resultRecord.trendPoints : [];
  if (trendPoints.length > 0) {
    return trendPoints
      .map((point) => asRecord(point))
      .filter((point): point is Record<string, unknown> => Boolean(point))
      .map((point) => ({
        timestamp: asString(point.timestamp) ?? '',
        uv: asNumber(point.uv) ?? 0,
      }))
      .filter((point) => point.timestamp);
  }

  const points = Array.isArray(resultRecord.points) ? resultRecord.points : [];
  return points
    .map((point) => asRecord(point))
    .filter((point): point is Record<string, unknown> => Boolean(point))
    .map((point) => ({
      timestamp:
        asString(point.timestamp) ??
        asString(point.startTime) ??
        asString(point.bucketStartTime) ??
        '',
      uv: asNumber(point.uv) ?? 0,
    }))
    .filter((point) => point.timestamp)
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
}

export function normalizeUsageStatistics(
  args: Record<string, unknown>,
  result: unknown,
): UsageStatisticsViewModel | undefined {
  const resultRecord = asRecord(result);
  if (!resultRecord) {
    return undefined;
  }

  const bucket =
    asString(resultRecord.bucket) ??
    asString(args.bucket) ??
    (normalizeTrendPoints(resultRecord).length > 1 ? 'HOUR' : undefined);
  const trendPoints = normalizeTrendPoints(resultRecord);
  const supportsTrend =
    Array.isArray(resultRecord.trendPoints) || Array.isArray(resultRecord.points);

  const uv = asNumber(resultRecord.uv) ?? summarizeTrend(trendPoints);
  const appLabel =
    asString(resultRecord.application) ?? asString(args.application) ?? 'Unknown application';

  return {
    appLabel,
    startTime: asString(resultRecord.startTime) ?? asString(args.startTime),
    endTime: asString(resultRecord.endTime) ?? asString(args.endTime),
    uv,
    trendPoints,
    bucket,
    supportsTrend,
  };
}

export function normalizeUserOperationRanking(
  args: Record<string, unknown>,
  result: unknown,
): UserOperationRankingViewModel | undefined {
  const resultRecord = asRecord(result);
  if (!resultRecord || !Array.isArray(resultRecord.users)) {
    return undefined;
  }

  const users = resultRecord.users
    .map((entry) => asRecord(entry))
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    .map((entry) => ({
      userId: asString(entry.userId) ?? '',
      count: asNumber(entry.count) ?? 0,
    }))
    .filter((entry) => entry.userId.length > 0);

  return {
    application:
      asString(resultRecord.application) ?? asString(args.application) ?? 'Unknown application',
    startTime: asString(resultRecord.startTime) ?? asString(args.startTime),
    endTime: asString(resultRecord.endTime) ?? asString(args.endTime),
    users,
  };
}

export function normalizeFunctionUsageRanking(
  args: Record<string, unknown>,
  result: unknown,
): FunctionUsageRankingViewModel | undefined {
  const resultRecord = asRecord(result);
  if (!resultRecord || !Array.isArray(resultRecord.functions)) {
    return undefined;
  }

  const functions = resultRecord.functions
    .map((entry) => asRecord(entry))
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    .map((entry) => ({
      functionPath: asString(entry.functionPath) ?? '',
      count: asNumber(entry.count) ?? 0,
    }))
    .filter((entry) => entry.functionPath.length > 0);

  return {
    application:
      asString(resultRecord.application) ?? asString(args.application) ?? 'Unknown application',
    startTime: asString(resultRecord.startTime) ?? asString(args.startTime),
    endTime: asString(resultRecord.endTime) ?? asString(args.endTime),
    functions,
  };
}
