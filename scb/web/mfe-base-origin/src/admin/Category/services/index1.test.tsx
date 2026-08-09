import { render, screen } from "@testing-library/react";
import React from "react";
import useServices from "./useServices";
import Provider from "../../../hooks/provider";
import ThemeProvider from "../../../theme";
afterAll(() => {
  jest.clearAllMocks();
});

jest.mock('../../../hooks/service', () => {
  return {
    putService: async () => { return Promise.reject({}) },
    postService: async () => { return Promise.reject({}) },
    getService: async () => { return Promise.reject({}) },
  }
});

const Comp = () => {
  const { 
    getCategory,
    updateCategory,
    verifyCategory,
    createCategory,
    deactivateCategory,
    getCategoryAudit, } = useServices();
  React.useEffect(() => {
    getCategory("123");
    updateCategory("123", { x: "x", c: "c" });
    verifyCategory("123", { x: "x", c: "c" });
    createCategory("123", { x: "x", c: "c" });
    deactivateCategory("123", { x: "x", c: "c" });
    getCategoryAudit("123", { x: "x", c: "c" });
  }, [])
  return (<div />);
};

describe("Category useServices component", () => {
  it("should be in the document", () => {
    render(<Provider>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});
