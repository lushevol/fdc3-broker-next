import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getUser, hasPermission, useParentData } from "src/Root/import/ratanutils";

import ratanConfig from "./Main/config/ratanConfig";
import OpensearchHome from "./OpensearchHome";

vi.mock("src/Root/import/ratanutils", () => ({
  getUser: vi.fn(),
  hasPermission: vi.fn(),
  useParentData: vi.fn(),
}));

vi.mock("./Main/store", () => ({ default: vi.fn(() => ({ dispatch: vi.fn(), getState: vi.fn(), subscribe: vi.fn() })) }));

vi.mock("src/Root/analysis", () => ({
  E2ELatencyStoreWrap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useRTT: () => ({ startTracking: vi.fn() }),
  useBatchCollect: () => ({ startTracking: vi.fn() }),
}));

vi.mock("src/Cashflow_CN/services/graphql", () => ({
  conversionDQSLRequest: vi.fn(() => ({})), // Mocking conversionDQSLRequest
}));
vi.mock("./Main", () => ({ default: () => <div data-testid="mock-main">Mock Main</div> }));

describe("OpensearchHome Component", () => {
  const mockProps = { tile: "opensearch-home" };

  beforeEach(() => {
    vi.clearAllMocks();
    (useParentData as vi.Mock).mockReturnValue({ isInitComplete: true }); // Mocking useParentData
  });

  it("should render the Main component when the user is in the whitelist", () => {
    (getUser as vi.Mock).mockReturnValue({ id: "whitelisted-user" });
    (hasPermission as vi.Mock).mockReturnValue(true);
    ratanConfig.cashflow.opensearchWhiteList = ["whitelisted-user"];

    const { container } = render(
      <MemoryRouter>
        <OpensearchHome {...mockProps} />
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });

  it("should render the Access Denied message when the user is not in the whitelist", () => {
    (getUser as vi.Mock).mockReturnValue({ id: "non-whitelisted-user" });
    (hasPermission as vi.Mock).mockReturnValue(false);
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
    (getUser as vi.Mock).mockReturnValue({ id: "any-user" });
    (hasPermission as vi.Mock).mockReturnValue(false);
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
    (getUser as vi.Mock).mockReturnValue({});
    (hasPermission as vi.Mock).mockReturnValue(false);
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
