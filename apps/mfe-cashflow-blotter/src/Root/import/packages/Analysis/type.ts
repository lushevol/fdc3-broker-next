export type IterableCollectNext = (nextPoint: string) => {
  next: IterableCollectNext;
  complete: () => void;
  abort: () => void;
};

export type AnalysisType = {
  trackPerformance: () => [
    string,
    () => {
      duration: number;
    }
  ];
  usePageView: () => void;
  useDisplayResolution: () => void;
  useTimeCost: (props?: { name?: string; subType?: string }) => {
    startTracking: (props1?: { name?: string }) => {
      completeTracking: (props2?: { name?: string }) => void;
      abortTracking: () => void;
    };
  };
  useRTT: () => {
    startTracking: (props1?: { name?: string }) => {
      completeTracking: (props2?: { name?: string }) => void;
      abortTracking: () => void;
    };
  };
  useIterableCollect: () => {
    startTracking: (name: string) => IterableCollectNext;
  };
  useBatchCollect: () => {
    startTracking: (name: string) => (path: string[]) => void;
  };
  useBatchCollectWithCount: () => {
    startTracking: (name: string) => (path: string[]) => void;
  };
  useE2Elatency: (name: string) => {
    initTrackingPoints: (flag?: boolean) => void;
    addTrackingPoint: (tag: string) => void;
    completeTracking: () => void;
    abortTracking: () => void;
  };
  E2ELatencyStoreWrap: ({ children }) => JSX.Element;
};

export type AnalysisV2Type = {
  getWrappedAxiosService: (path: string) => any;
  getWrappedGraphQLQuery: (
    path: string
  ) => (
    url: string,
    query: any,
    setErrorField?: boolean,
    headers?: {}
  ) => Promise<any>;
  emit: (predefinedEvent: IPredefinedEvent, payloads?: MonitorPayload[]) => any;
};

export type MonitorPayload = {
  tag: string;
  value: string;
};

export interface IPredefinedEvent {
  name: string;
  type: MonitorEventType;
  subType?: MonitorEventSubType;
  item?: {
    name: string;
    type: string;
    subType?: string;
    path: string;
  };
}

export enum MonitorEventType {
  PAGE_VIEW = "PageView",
  ELEMENT_VIEW = "ElementView",
  EVENT = "Event",
  PERF = "Perf",
  RESOURCE = "Resource",
  ACTION = "Action",
  FETCH = "Fetch",
  CODE_ERROR = "CodeError",
  CONSOLE = "Console",
  CUSTOMER = "Customer",
}

export enum MonitorEventSubType {
  Start = "Start",
  End = "End",
  Click = "Click",
  DoubleClick = "DoubleClick",
  DisplayResolution = "DisplayResolution",
  RTT = "RTT",
  E2E_Latency = "E2E_Latency",
}
