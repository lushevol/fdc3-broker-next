import getDarkTheme from "./dark";
import getLightTheme from "./light";

export enum THEME {
  DARK = "dark",
  LIGHT = "light",
  GOLD = "gold",
}

export const getTheme = (theme: string | undefined, newStyles = false) => {
  // when we change to new design, we need to delete the import and isNewLayout variable
  // And need revert the import from getDarkTheme to dark, getLightTheme to light, revert the function call to dark or light virable
  const params = new URLSearchParams(window.location.search);
  const isNewLayout = params.get("new-layout") === "true";
  switch (theme) {
    case THEME.DARK:
      return getDarkTheme(isNewLayout, newStyles);
    case THEME.LIGHT:
      return getLightTheme(isNewLayout, newStyles);
    case THEME.GOLD:
      return getDarkTheme(isNewLayout, newStyles);
    default:
      return getLightTheme(isNewLayout, newStyles);
  }
};
