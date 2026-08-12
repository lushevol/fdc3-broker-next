import { render, screen } from "@testing-library/react";
import App from "./App";
import { TILE_MENU, CONTAINER_MENU } from "./Root/routing/common/interface";

describe("App component", () => {
  it("should be in the document", () => {
    render(
      <App module="" tile="" />
    );
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(
      <App module={CONTAINER_MENU.TRADE_BLOTTER} tile={TILE_MENU.TRADE} />
    );
    expect(screen).toBeDefined();
  });
});
