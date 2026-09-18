import getDarkTheme from "./portal-theme/dark.js";
import getLightTheme from "./portal-theme/light.js";
export type {} from "@mui/x-data-grid/themeAugmentation";

export { Config } from "./portal-theme/Config.js";
export { default as portalTokens, loginPage } from "./portal-theme/common.js";
export type { LoginPageTokens } from "./portal-theme/common.js";
export { getDarkTheme, getLightTheme };
export { default as scrollDark } from "./portal-theme/scroll.dark.js";
export { default as scrollLight } from "./portal-theme/scroll.light.js";
export { default as normalize } from "./portal-theme/normalize.js";

export function getPortalTheme(theme: string | undefined, newStyles = false, isNewLayout = false):
  ReturnType<typeof getDarkTheme> | ReturnType<typeof getLightTheme> {
  return theme === "dark" || theme === "gold"
    ? getDarkTheme(isNewLayout, newStyles)
    : getLightTheme(isNewLayout, newStyles);
}
