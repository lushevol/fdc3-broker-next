import React from "react";
import { useContext } from "../../../hooks/provider";
import { ActionType } from "../../../hooks/reducer/util/ActionType";
import useDispatcher from "../../../hooks/dispathcer";
import { getLocalStorage } from "../../../utils/common";
import useAnalytics from "../../../analytics";
import { AnalyticsData } from "../../../analytics/model";
const analyticsData: AnalyticsData = { container: "Base", tile: "home" };
const useController = () => {
  const [store] = useContext();
  const { SwitchEvent } = useAnalytics();
  const { dispacthTheme } = useDispatcher();
  const setRootTheme = (theme: "light" | "dark") => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  };

  const toggleColorMode = () => {
    const mode = store.theme === "light" ? "dark" : "light";
    setRootTheme(mode);
    dispacthTheme(mode);
    getLocalStorage().setItem(ActionType.SET_THEME, mode);
    getLocalStorage().setItem("theme", mode);
    SwitchEvent("click", {
      name: "toggle theme",
      value: mode,
      ...analyticsData,
    });
  };
  return {
    store,
    toggleColorMode,
  };
};

export default useController;
