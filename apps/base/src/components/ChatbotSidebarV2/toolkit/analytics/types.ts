export type AnalyticsArgs = {
  application?: string;
  startTime?: string;
  endTime?: string;
  bucket?: string;
};

export type AnalyticsResult = Record<string, unknown>;
