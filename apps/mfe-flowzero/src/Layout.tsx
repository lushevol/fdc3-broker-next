import { css, styled } from "@mui/material/styles";

import SiderMenu from "./components/SiderMenu";
import workflowBg from "./images/workflowBg.png";
import workflowBgDark from "./images/workflowBgDark.png";

const StyledLayout = styled("section")(
  css`
    display: flex;
    height: 100%;
    .main-body {
      flex: 1;
    }
  `
);

import { useEffect, useState } from "react";
export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const COLLAPSED_WIDTH = 56;
  const EXPANDED_WIDTH = 232;

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <StyledLayout className="flowzero-app">
      <SiderMenu onCollapse={setCollapsed} />
      <div
        className="max-h-full flex-1 flex flex-col bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `url(${isDark ? workflowBgDark : workflowBg})`,
          maxWidth: `calc(100% - ${
            collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
          }px)`,
        }}
      >
        {children}
      </div>
    </StyledLayout>
  );
}
