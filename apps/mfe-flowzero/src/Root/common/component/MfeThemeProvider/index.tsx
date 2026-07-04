import { ConfigProvider } from "antd";
import { ContainerProvider } from "Import/index";
import { FC, PropsWithChildren } from "react";

import { getCustomThemeStyle } from "./MfeCustomThemeStyle";

const FLOWZERO_APP_SCOPE_CLASS = "flowzero-app";
const FLOWZERO_PORTAL_SCOPE_CLASS = "flowzero-portal";

function getFlowzeroPopupContainer(triggerNode?: HTMLElement) {
  return (
    triggerNode?.closest(`.${FLOWZERO_APP_SCOPE_CLASS}`) ??
    document.querySelector<HTMLElement>(`.${FLOWZERO_APP_SCOPE_CLASS}`) ??
    document.body
  );
}

const MfeThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ContainerStore] = ContainerProvider.useContext();

  if (typeof window !== "undefined") {
    if (ContainerStore.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <ConfigProvider
      getPopupContainer={getFlowzeroPopupContainer}
      modal={{ className: FLOWZERO_PORTAL_SCOPE_CLASS }}
    >
      <style>{getCustomThemeStyle(ContainerStore.theme ?? "light")}</style>
      {children}
    </ConfigProvider>
  );
};

export default MfeThemeProvider;
