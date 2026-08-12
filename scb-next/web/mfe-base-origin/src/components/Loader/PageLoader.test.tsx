import { render, screen } from "@testing-library/react";
import React from "react";
import PageLoader from "./PageLoader";
import { PREFIX } from "./common/style";

describe("Loader component", () => {
  it("should be in the document", () => {
    render(
      <PageLoader
        text="Loading 123"
        size="20px"
      />
    );
    const id = screen.getByTestId(`${PREFIX}_Page`);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/loading 123/i)).toBeInTheDocument();
  });
});
