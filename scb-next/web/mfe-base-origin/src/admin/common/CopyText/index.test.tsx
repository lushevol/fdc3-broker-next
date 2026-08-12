import { render, screen } from "@testing-library/react";
import CopyText from ".";


describe("Admin Module CopyText component", () => {
  it("should be in the document", () => {
    const onClickCopy = vi.fn();
    render(<CopyText
      dataTestid="button"
      value="test"
      onClickCopy={onClickCopy}
    />);
    expect(screen).toBeDefined();
    const Button = screen.getByTestId("button");
    expect(Button).toBeInTheDocument();
    Button.click();
    expect(onClickCopy).toBeCalled();
  });
});
