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
    getImportMap,
    updateImportMap,
    verifyImportMap,
    createImportMap,
    deactivateImportMap,
    getImportMapAudit, 
  } = useServices();
  React.useEffect(() => {
    getImportMap("123");
    getImportMap("123");
    updateImportMap("123", { x: "x", c: "c" });
    updateImportMap("123", { x: "x", c: "c" });
    verifyImportMap("123", { x: "x", c: "c" });
    verifyImportMap("123", { x: "x", c: "c" });
    createImportMap("123", { x: "x", c: "c" });
    createImportMap("123", { x: "x", c: "c" });
    deactivateImportMap("123", { x: "x", c: "c" });
    deactivateImportMap("123", { x: "x", c: "c" });
    getImportMapAudit("123", { x: "x", c: "c" });
    getImportMapAudit("123", { x: "x", c: "c" });
  }, [])
  return (<div />);
};

describe("ImportMap useServices component", () => {
  it("should be in the document", () => {
    render(<Provider>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
