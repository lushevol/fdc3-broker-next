import { render, screen } from "@testing-library/react";
import Snackbar from ".";
import { PREFIX } from "./common/style";

describe("Snackbar component", () => {
  it("should be in the document", () => {
    render(<Snackbar
      open={true}
      message="Snackbars inform users of a process that an app has performed or will perform."
    />);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/Snackbars inform users of a process that an app has performed or will perform/i)).toBeInTheDocument();
  });
});
