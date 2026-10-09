import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App component", () => {
  it("should be in the document", async () => {
    await render(<App />);;
    expect(screen).toBeDefined();
  });
});
