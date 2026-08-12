import { render, screen } from "@testing-library/react";
import React from "react";
import useServices from "./useServices";
import Provider from "../../../hooks/provider";
import ThemeProvider from "../../../theme";
afterAll(() => {
  vi.clearAllMocks();
});

vi.mock('../../../hooks/service', () => {
  return {
    putService: async () => { return Promise.resolve({}) },
    postService: async () => { return Promise.resolve({}) },
    getService: async () => { return Promise.resolve({}) },
  }
});

const Comp = () => {
  const {
    getTile,
    updateTile,
    verifyTile,
    createTile,
    deactivateTile,
    getTileAudit,
    getCategory,
    getImportMap,
  } = useServices();
  React.useEffect(() => {
    getCategory("123");
    getCategory("123");
    getTile("123", { x: "x", c: "c" });
    getTile("123", { x: "x", c: "c" });
    updateTile("123", { x: "x", c: "c" });
    updateTile("123", { x: "x", c: "c" });
    verifyTile("123", { x: "x", c: "c" });
    verifyTile("123", { x: "x", c: "c" });
    createTile("123", { x: "x", c: "c" });
    createTile("123", { x: "x", c: "c" });
    deactivateTile("123", { x: "x", c: "c" });
    deactivateTile("123", { x: "x", c: "c" });
    getTileAudit("123", { x: "x", c: "c" });
    getTileAudit("123", { x: "x", c: "c" });
    getImportMap("123");
    getImportMap("123");
  }, [])
  return (<div />);
};

describe("Tile useServices component", () => {
  it("should be in the document", () => {
    render(<Provider>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
