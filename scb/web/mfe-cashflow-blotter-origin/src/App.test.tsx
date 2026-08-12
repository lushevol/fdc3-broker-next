import { act,render, screen } from "@testing-library/react";

import { ReactRouterDom } from "./Root/import";
const { MemoryRouter } = ReactRouterDom;

import App from "./App";

describe("App component", () => {
  it("should be in the document", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <App tile="" />
        </MemoryRouter>
      );
    });
    expect(screen).toBeDefined();
  });
});
