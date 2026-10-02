import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { styled, ThemeProvider, type CSSObject } from "../src/theme";
import { Config, getPortalTheme } from "../src/portal-theme";

const Row = styled("div")(({ theme }) =>
  theme.components?.MuiDataGrid?.styleOverrides?.row as CSSObject,
);
const Cell = styled("div")(({ theme }) =>
  theme.components?.MuiDataGrid?.styleOverrides?.cell as CSSObject,
);

function cssColor(value: string) {
  const probe = document.createElement("div");
  probe.style.backgroundColor = value;
  document.body.appendChild(probe);
  const color = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return color;
}

describe("portal grid presentation", () => {
  it.each([
    ["dark", false],
    ["light", false],
    ["dark", true],
    ["light", true],
  ] as const)("keeps %s WebKit=%s row colors and cell edges without Emotion warnings", (mode, webkit) => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const props = getPortalTheme(mode, webkit);
      const { config } = Config(props);
      render(
        <ThemeProvider theme={config}>
          <div>
            <Row data-testid="odd">
              <Cell data-testid="first">First</Cell>
              <Cell data-testid="middle">Middle</Cell>
              <Cell data-testid="last">Last</Cell>
            </Row>
            <Row data-testid="even" />
            <Row data-testid="selected" className="Mui-selected" />
          </div>
        </ThemeProvider>,
      );
      expect(getComputedStyle(screen.getByTestId("odd")).backgroundColor).toBe(cssColor(props.backgroundColorOddRow));
      expect(getComputedStyle(screen.getByTestId("even")).backgroundColor).toBe(cssColor(props.backgroundColorEvenRow));
      expect(getComputedStyle(screen.getByTestId("selected")).backgroundColor).toBe(cssColor(props.backgroundColorSelectedRow));
      expect(getComputedStyle(screen.getByTestId("first")).borderLeftWidth).toBe("1px");
      expect(getComputedStyle(screen.getByTestId("first")).borderTopLeftRadius).toBe("5px");
      expect(getComputedStyle(screen.getByTestId("middle")).borderTopLeftRadius).toBe("");
      expect(getComputedStyle(screen.getByTestId("last")).borderRightWidth).toBe("1px");
      expect(getComputedStyle(screen.getByTestId("last")).borderTopRightRadius).toBe("5px");
      expect(errors.mock.calls).toEqual([]);
    } finally {
      errors.mockRestore();
    }
  });
});
