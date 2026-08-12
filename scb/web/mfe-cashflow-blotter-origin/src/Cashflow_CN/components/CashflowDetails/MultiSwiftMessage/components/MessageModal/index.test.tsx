import { render } from "@Test/test-utils";

import MessageModal, { codeBlockComponent } from "./index";

describe("MessageModal", () => {
  it("should render the MessageModal component with the provided message", () => {
    const message = "<xml>message</xml>";
    const { container } = render(<MessageModal message={message} />);
    expect(container).toContainHTML("message");
  });

  it("should render the code block with provided data", () => {
    const data = "const message = 'Hello, World!';";
    const { getByText } = render(codeBlockComponent(data));
    expect(getByText(data)).toBeInTheDocument();
  });
});