import { ConfigProvider } from "antd";
import { ContainerProvider } from "Import/index";
import { FC, PropsWithChildren } from "react";

import { getCustomThemeStyle } from "./MfeCustomThemeStyle";

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
    <ConfigProvider>
      <style>{getCustomThemeStyle(ContainerStore.theme ?? "light")}</style>
      {children}
    </ConfigProvider>
  );
};

export default MfeThemeProvider;
