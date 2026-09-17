import React from "react";
import { styled, ThemeProvider } from "@mui/material/styles";
import { createRatanTheme, type RatanThemeOptions } from "./theme/index.js";
export const OverlayContainerContext = /*#__PURE__*/ React.createContext<HTMLElement | null | undefined>(undefined);
const Root = /*#__PURE__*/ styled("div")(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.fontSize,
  colorScheme: theme.palette.mode,
}));

export interface RatanDesignProviderProps extends Omit<
  RatanThemeOptions,
  "container"
> {
  children?: React.ReactNode;
  className?: string;
}

export function RatanDesignProvider({
  mode = "light",
  designGeneration = "legacy",
  className,
  children,
}: RatanDesignProviderProps) {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const theme = React.useMemo(
    () =>
      createRatanTheme({
        mode,
        designGeneration,
        container: root ?? undefined,
      }),
    [mode, designGeneration, root]
  );
  return (
    <OverlayContainerContext.Provider value={root}>
    <ThemeProvider theme={theme}>
      <Root
        ref={setRoot}
        className={["ratan-design-root", className].filter(Boolean).join(" ")}
        data-mode={mode}
        data-generation={designGeneration}
      >
        {children}
      </Root>
    </ThemeProvider>
    </OverlayContainerContext.Provider>
  );
}
