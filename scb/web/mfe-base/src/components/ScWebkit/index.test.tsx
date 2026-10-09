import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import { Wrapper, clearEventHandlers, setAttribute, setEvent } from "../../utils/ReactWrapper"

describe("ScWebkit component", () => {
  it("should be in the document", async () => {
    await import("./sc-button")
    const onClick1 = jest.fn();
    const onClick2 = jest.fn();
    render(<>
      <Root component="sc-button" data-testid="sc-button1" onClick={onClick1}>SC Button1</Root>
      <Root component="sc-button" data-testid="sc-button2" onClick={onClick2}>SC Button2</Root>
    </>);
    expect(screen.getByText(/SC Button1/i)).toBeInTheDocument();
    expect(screen.getByText(/SC Button2/i)).toBeInTheDocument();
    const Button1 = screen.getByTestId("sc-button1");
    expect(Button1).toBeInTheDocument();
    Button1.click();
    expect(onClick1).toBeCalled();
    const Button2 = screen.getByTestId("sc-button2");
    expect(Button2).toBeInTheDocument();
    Button2.click();
    expect(onClick2).toBeCalled();
  });
  it("should be in the document", () => {
    const onClick = jest.fn();
    render(<Root component="sc-icon-card" data-testid="sc-icon-card" onClick={onClick}>SC Button</Root>);
    expect(screen.getByText(/SC Button/i)).toBeInTheDocument();
    const Button = screen.getByTestId("sc-icon-card");
    expect(Button).toBeInTheDocument();
    Button.click();
    expect(onClick).toBeCalled();
  });
  it("should be in the document", () => {
    render(<Root component="sc-button" disabled={false} data-testid="sc-button1" style={{ display: "block" }}>SC Button</Root>);
    expect(screen.getByText(/SC Button/i)).toBeInTheDocument();
    const Button = screen.getByTestId("sc-button1");
    expect(Button).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(<Root component="sc-button" data-testid="sc-button2" click={() => { }}>SC Button</Root>);
    expect(screen.getByText(/SC Button/i)).toBeInTheDocument();
    const Button = screen.getByTestId("sc-button2");
    expect(Button).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(<Root component="sc-button" disabled={false} data-testid="sc-button3" className="test" on-click={() => { }}>SC Button</Root>);
    expect(screen.getByText(/SC Button/i)).toBeInTheDocument();
    clearEventHandlers({
      current: {
        removeEventListener: (_event, _handler) => { }
      }
    }, [[{}, {}]])
    setAttribute(undefined, "", "");
    setEvent(undefined, [], "", "");
    Wrapper({ innerRef: () => { } })
    const Button = screen.getByTestId("sc-button3");
    expect(Button).toBeInTheDocument();
  });
});
