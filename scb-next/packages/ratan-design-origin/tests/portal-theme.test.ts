import { describe, expect, it } from "vitest";
import { Config, getPortalTheme, getDarkTheme, getLightTheme, loginPage } from "../src/portal-theme";

describe("opt-in legacy portal theme", () => {
  it("retains the existing typography, controls, extensions and grid overrides", () => {
    const props = getPortalTheme("dark");
    const { config } = Config(props);
    expect(config.typography).toMatchObject({ fontFamily: '\"Poppins\", Helvetica', fontSize: 12 });
    expect(config.shape.borderRadius).toBe(5);
    expect(config.components?.MuiButton?.defaultProps?.size).toBe("small");
    expect(config.theme.LoginPage.contentWidth).toBe("306px");
    expect(config.customColor.blue).toBe("#2f82ff");
    expect(config.components?.MuiDataGrid?.styleOverrides?.root).toMatchObject({ borderWidth: 0 });
    expect(props.MuiCssBaseline.styleOverrides.body.overflow).toBe("hidden");
  });
  it.each(["dark", "light", "gold", undefined, "unknown"])(
    "keeps explicit mode/layout/design choices for %s without browser state",
    (mode) => {
      for (const newStyles of [false, true]) {
        for (const newLayout of [false, true]) {
          const props = getPortalTheme(mode, newStyles, newLayout);
          const dark = mode === "dark" || mode === "gold";
          expect(props.palette.mode).toBe(dark ? "dark" : "light");
          expect(props.NewTileComponent.boxShadow === "none").toBe(newLayout);
          expect(props.MuiAppBar.styleOverrides.root.backgroundImage).toEqual(
            newLayout ? (dark ? undefined : "unset")
              : expect.stringContaining("linear-gradient"),
          );
          const { config } = Config(props);
          expect(config.palette.mode).toBe(dark ? "dark" : "light");
          expect(config.theme.LoginPage.contentWidth).toBe(loginPage.contentWidth);
          expect(props.MuiCssBaseline.styleOverrides.html[":root"].styles).toContain(
            newStyles ? "var(--sc-" : "--theme-color-",
          );
        }
      }
    },
  );
  it("keeps direct factories and historical default flags", () => {
    expect(getDarkTheme().palette).toEqual(getPortalTheme("dark").palette);
    expect(getLightTheme().palette).toEqual(getPortalTheme(undefined).palette);
    expect(getDarkTheme().NewTileComponent.boxShadow).not.toBe("none");
    expect(getLightTheme().NewTileComponent.boxShadow).not.toBe("none");
  });
});
