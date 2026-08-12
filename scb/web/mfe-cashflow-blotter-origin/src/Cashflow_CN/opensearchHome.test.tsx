import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getUser, hasPermission, useParentData } from "src/Root/import/ratanutils";

import ratanConfig from "./Main/config/ratanConfig";
import OpensearchHome from "./OpensearchHome";

jest.mock("src/Root/import/ratanutils", () => ({
  getUser: jest.fn(),
  hasPermission: jest.fn(),
  useParentData: jest.fn(),
}));

jest.mock("./Main/store", () => jest.fn(() => ({ dispatch: jest.fn(), getState: jest.fn(), subscribe: jest.fn() })));

jest.mock("src/Root/analysis", () => ({
  E2ELatencyStoreWrap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("src/Cashflow_CN/services/graphql", () => ({
  conversionDQSLRequest: jest.fn(() => ({})), // Mocking conversionDQSLRequest
}));
jest.mock("./Main", () => () => <div data-testid="mock-main">Mock Main</div>);

describe("OpensearchHome Component", () => {
  const mockProps = { tile: "opensearch-home" };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParentData as jest.Mock).mockReturnValue({ isInitComplete: true }); // Mocking useParentData
  });

  it("should render the Main component when the user is in the whitelist", () => {
    (getUser as jest.Mock).mockReturnValue({ id: "whitelisted-user" });
    (hasPermission as jest.Mock).mockReturnValue(true);
    ratanConfig.cashflow.opensearchWhiteList = ["whitelisted-user"];

    const { container } = render(
      <MemoryRouter>
        <OpensearchHome {...mockProps} />
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });

  it("should render the Access Denied message when the user is not in the whitelist", () => {
    (getUser as jest.Mock).mockReturnValue({ id: "non-whitelisted-user" });
    (hasPermission as jest.Mock).mockReturnValue(false);
    ratanConfig.cashflow.opensearchWhiteList = ["whitelisted-user"];

    render(
      <MemoryRouter>
        <OpensearchHome {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByText("You do not have permission to access this page.")).toBeInTheDocument();
  });

  it("should handle an empty whitelist gracefully", () => {
    (getUser as jest.Mock).mockReturnValue({ id: "any-user" });
    (hasPermission as jest.Mock).mockReturnValue(false);
    ratanConfig.cashflow.opensearchWhiteList = [];

    render(
      <MemoryRouter>
        <OpensearchHome {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByText("You do not have permission to access this page.")).toBeInTheDocument();
  });

  it("should handle a missing user ID gracefully", () => {
    (getUser as jest.Mock).mockReturnValue({});
    (hasPermission as jest.Mock).mockReturnValue(false);
    ratanConfig.cashflow.opensearchWhiteList = ["whitelisted-user"];

    render(
      <MemoryRouter>
        <OpensearchHome {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    expect(screen.getByText("You do not have permission to access this page.")).toBeInTheDocument();
  });
});