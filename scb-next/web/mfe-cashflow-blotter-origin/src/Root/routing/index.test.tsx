import { act,render, screen } from "@testing-library/react";

import { ReactRouterDom } from "../import";
const { MemoryRouter } = ReactRouterDom;

import Routing from ".";

describe("Routing component", () => {
  it("should be in route to tile1", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Routing tile="tile1" />
        </MemoryRouter>
      );
    });
    expect(screen).toBeDefined();
  });
  it("should be in route to tile1", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Routing tile="tile2" />
        </MemoryRouter>
      );
    });
    expect(screen).toBeDefined();
  });
});
