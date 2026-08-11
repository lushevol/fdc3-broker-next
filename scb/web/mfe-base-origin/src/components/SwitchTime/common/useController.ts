import React, { useEffect } from "react";
import { useContext } from "../../../hooks/provider";
import useDispatcher from "../../../hooks/dispathcer";
import useAnalytics from "../../../analytics";
import { AnalyticsData } from "../../../analytics/model";
const analyticsData: AnalyticsData = { container: "Base", tile: "home" };
const useController = () => {
  const [store] = useContext();
  const { SwitchEvent } = useAnalytics();
  const { dispacthTimeType } = useDispatcher();
  const [time, setTime] = React.useState(new Date());

  const toggleTimeType = () => {
    const timezone = store.timeType?.toUpperCase() === "UTC" ? "local" : "utc";
    dispacthTimeType(timezone);
    SwitchEvent("click", {
      name: "toggle time",
      value: timezone,
      ...analyticsData,
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const sliceTime = (input: number) => ("0" + input).slice(-2);

  const getTime = () => {
    if (store.timeType?.toUpperCase() === "UTC") {
      return `${sliceTime(time.getUTCHours())}:${sliceTime(
        time.getUTCMinutes()
      )} UTC`;
    } else {
      return `${sliceTime(time.getHours())}:${sliceTime(
        time.getMinutes()
      )} Local`;
    }
  };
  return {
    store,
    toggleTimeType,
    getTime,
  };
};

export default useController;
