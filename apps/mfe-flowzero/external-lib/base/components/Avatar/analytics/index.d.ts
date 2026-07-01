import {
  AnalyticsButtonOrTabOrSwitchEventType,
  AnalyticsData,
  AnalyticsDropDownEventType,
  AnalyticsTileOrModalEventType,
} from "./model";
declare const useAnalytics: () => {
  TileEvent: (
    event: AnalyticsTileOrModalEventType,
    analyticsData: AnalyticsData
  ) => void;
  ModalEvent: (
    event: AnalyticsTileOrModalEventType,
    analyticsData: AnalyticsData
  ) => void;
  TabEvent: (
    event: AnalyticsButtonOrTabOrSwitchEventType,
    analyticsData: AnalyticsData
  ) => void;
  ButtonEvent: (
    event: AnalyticsButtonOrTabOrSwitchEventType,
    analyticsData: AnalyticsData
  ) => void;
  DropDownEvent: (
    event: AnalyticsDropDownEventType,
    analyticsData: AnalyticsData
  ) => void;
  SwitchEvent: (
    event: AnalyticsButtonOrTabOrSwitchEventType,
    analyticsData: AnalyticsData
  ) => void;
};
export default useAnalytics;
