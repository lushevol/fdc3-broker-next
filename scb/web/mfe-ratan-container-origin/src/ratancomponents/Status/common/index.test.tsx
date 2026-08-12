import { render, screen } from "@testing-library/react";
import React from "react";
import Root from "..";
import { PREFIX } from "./style";
import useController from "./useController";

const Comp = () => {
  const {
    handleCloseStatusMenu,
  } = useController();
  React.useEffect(()=>{
    handleCloseStatusMenu();
  },[])
  return (<Root />);
};

describe("Status component", () => {
  it("should be in the document", () => {
    render(<Comp />);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
  });
});
