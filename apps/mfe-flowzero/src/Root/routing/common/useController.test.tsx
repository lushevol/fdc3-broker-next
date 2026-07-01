import React from "react";
import { render } from "@testing-library/react";
import useController from "./useController";

const mockNavigate = jest.fn();

jest.mock("../../import", () => ({
  ReactRouterDom: {
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/flowzero/workflow-management" }),
  },
}));

const TestComponent = () => {
  useController({
    module: "/flowzero",
    tile: "/workflow-management",
  } as any);
  return <div>Flowzero route controller</div>;
};

describe("Flowzero route controller", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("navigates to a generated workflow route from the chatbot card event", () => {
    render(<TestComponent />);

    const route =
      "/flowzero/workflow-management/NewWorkflow/?workflowDetail=%7B%22id%22%3A%22wf-123%22%7D&from=detail";

    window.dispatchEvent(new CustomEvent("flowzero:navigate", { detail: { route } }));

    expect(mockNavigate).toHaveBeenCalledWith(route);
  });
});
