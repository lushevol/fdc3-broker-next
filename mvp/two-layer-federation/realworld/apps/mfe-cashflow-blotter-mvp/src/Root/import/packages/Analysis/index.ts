//@ts-ignore
import * as RatanContainer from "@fm/ratan_container";

import { AnalysisType, AnalysisV2Type } from "./type";

export const {
  useTimeCost,
  useRTT,
  useDisplayResolution,
  useIterableCollect,
  useBatchCollect,
  useBatchCollectWithCount,
  useE2Elatency,
  E2ELatencyStoreWrap,
  usePageView,
} = RatanContainer.Analysis as AnalysisType;

export const { getWrappedAxiosService, getWrappedGraphQLQuery, emit } =
  (RatanContainer.AnalysisV2 as AnalysisV2Type) ?? {};
