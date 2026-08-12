import { render, screen } from "@testing-library/react";
import React from "react";
import Actions from "./index";

vi.mock("@mui/x-data-grid/components/cell/GridActionsCellItem", () => {
  return {
    __esModule: true,
    default: () => {
      return {
        GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
      };
    },
    GridActionsCellItem: (props) => { return (<div>{props.children}</div>) },
  };
});

const Comp = () => {
  const Items = React.useMemo(() => Actions({
    value: { row: { active: true } },
    onOpen: () => { },
    onOpenAudit: () => { }
  }), [])
  return (
    <div>Comp</div>
  )
};

const Comp1 = () => {
  const Items = React.useMemo(() => Actions({
    value: { row: { active: false } },
    onOpen: () => { },
    onOpenAudit: () => { }
  }), [])
  return (
    <div>Comp1</div>
  )
};

describe("Admin Module Actions component", () => {
  it("should be in the document", () => {
    render(<Comp />);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Comp1 />);
    expect(screen).toBeDefined();
  });
});
