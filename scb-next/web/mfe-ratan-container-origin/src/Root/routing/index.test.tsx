import { render, screen, act } from "@testing-library/react";
import { ReactRouterDom } from "../import";
import MfeThemeProvider from "../component/MfeThemeProvider";
const { MemoryRouter } = ReactRouterDom;

import Routing from ".";
import { TILE_MENU, CONTAINER_MENU } from "./common/interface";

describe("Routing component", () => {
  it("should be in route to TRADE_BLOTTER", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.TRADE_BLOTTER} tile={TILE_MENU.TRADE} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to CASHFLOW_CN", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.CASHFLOW_BLOTTER} tile={TILE_MENU.CASHFLOW_CN} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to CASHFLOW_CN", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.CASHFLOW_BLOTTER} tile={TILE_MENU.CASHFLOW_BAU} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to SETTLEMENT_EXCEPTIONS", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.EXCEPTIONS_BLOTTER} tile={TILE_MENU.SETTLEMENT_EXCEPTIONS} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to VALIDATION_EXCEPTIONS", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.EXCEPTIONS_BLOTTER} tile={TILE_MENU.VALIDATION_EXCEPTIONS} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });

  it("should be in route to NEW_NSTP_RULES", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.RULES_BLOTTER} tile={TILE_MENU.NEW_NSTP_RULES} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to NEW_NETTING_RULES", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.RULES_BLOTTER} tile={TILE_MENU.NEW_NETTING_RULES} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to SETTLEMENT_NSTP_RULES", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.RULES_BLOTTER} tile={TILE_MENU.SETTLEMENT_NSTP_RULES} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to SUPPRESSION_RULES", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.RULES_BLOTTER} tile={TILE_MENU.SUPPRESSION_RULES} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to NETTING_RULES", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.RULES_BLOTTER} tile={TILE_MENU.NETTING_RULES} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to AUTHORIZATION_LIMITS", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module={CONTAINER_MENU.AUTHORIZATION_LIMITS_CONTAINER} tile={TILE_MENU.AUTHORIZATION_LIMITS} />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to no where", () => {
    render(
      <MfeThemeProvider>
        <MemoryRouter>
          <Routing module="" tile="" />
        </MemoryRouter>
      </MfeThemeProvider>
    );
    expect(screen).toBeDefined();
  });
});
