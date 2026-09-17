import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import { Button, Select, RatanDesignProvider } from "../src";
import { createRatanTheme } from "../src/theme";
import { newStyleTokens, legacyTokens } from "../src/tokens";

function Appearance() {
  const theme = useTheme();
  return (
    <output aria-label="Appearance">
      {theme.palette.mode}/{theme.ratan.designGeneration}
    </output>
  );
}

describe("explicit standalone appearance", () => {
  it.each(["legacy", "webkit"] as const)(
    "updates %s appearance without host side effects",
    (designGeneration) => {
      const { rerender } = render(
        <RatanDesignProvider
          designGeneration={designGeneration}
          className="consumer-root"
        >
          <Button>Action</Button>
        </RatanDesignProvider>
      );
      const root = screen.getByRole("button").closest(".ratan-design-root");
      expect(root).toHaveClass("consumer-root");
      expect(root).toHaveAttribute("data-generation", designGeneration);
      rerender(
        <RatanDesignProvider mode="dark" designGeneration={designGeneration}>
          <Button>Action</Button>
          <Appearance />
        </RatanDesignProvider>
      );
      expect(root).toHaveAttribute("data-mode", "dark");
      expect(screen.getByLabelText("Appearance")).toHaveTextContent(
        `dark/${designGeneration}`
      );
    }
  );

  it("exports canonical semantic references and legacy tokens without a provider", () => {
    expect(newStyleTokens).toHaveProperty("color");
    expect(JSON.stringify(newStyleTokens)).toContain("var(--sc-");
    expect(legacyTokens.color).toHaveProperty("blue");
  });
  it("defaults to legacy/light and retains the compact brand typography", () => {
    const theme = createRatanTheme();
    expect(theme.palette.mode).toBe("light");
    expect(theme.ratan.designGeneration).toBe("legacy");
    expect(theme.typography.fontFamily).toBe('"Poppins", Helvetica');
    expect(theme.components?.MuiButton?.defaultProps?.size).toBe("small");
    expect(theme.palette.primary.main).toBe("#2C3F5E");
    expect(createRatanTheme({ mode: "dark" }).palette.primary.main).toBe(
      "#2f82ff"
    );
  });

  it("keeps two differently themed roots independent without mutating the host", () => {
    const classes = document.documentElement.className;
    const bodyStyle = document.body.style.cssText;
    render(
      <>
        <RatanDesignProvider mode="dark" designGeneration="webkit">
          <Button>Dark action</Button>
        </RatanDesignProvider>
        <RatanDesignProvider>
          <Button>Light action</Button>
        </RatanDesignProvider>
      </>
    );
    expect(
      screen
        .getByRole("button", { name: "Dark action" })
        .closest(".ratan-design-root")
    ).toHaveAttribute("data-mode", "dark");
    expect(
      screen
        .getByRole("button", { name: "Light action" })
        .closest(".ratan-design-root")
    ).toHaveAttribute("data-mode", "light");
    expect(document.documentElement.className).toBe(classes);
    expect(document.body.style.cssText).toBe(bodyStyle);
  });

  it("renders selector overlays under their owning themed root", () => {
    render(
      <RatanDesignProvider mode="dark" designGeneration="webkit">
        <Select label="Currency" variant="outlined" value="USD">
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="SGD">SGD</MenuItem>
        </Select>
      </RatanDesignProvider>
    );
    const root = screen
      .getByRole("combobox", { name: "Currency" })
      .closest(".ratan-design-root")!;
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Currency" }));
    expect(within(root as HTMLElement).getByRole("listbox")).toBeVisible();
  });
});
