import { render, screen, act } from "@testing-library/react";
import Index from "./";
import Provider from "../hooks/provider";
import ThemeProvider from "../theme";

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

const providerData = {
  user: { id: "123" }, token: "123", theme: "light", entitlementsToken: "123", entities: [{
    "id": 276822,
    "name": "FMO PORTAL ADMIN",
    "applicationName": "RATAN",
    "roleId": 276825,
    "roleName": "SUPER_USER",
    "subjects": [
      {
        "longName": "/category",
        "name": "category",
        "id": 276832,
        "actions": [
          {
            "name": "READ-WRITE",
            "id": 276824,
            "entitlementId": 276871
          }
        ]
      },
      {
        "longName": "/importmap",
        "name": "importmap",
        "id": 276831,
        "actions": [
          {
            "name": "READ-WRITE",
            "id": 276824,
            "entitlementId": 276872
          }
        ]
      },
      {
        "longName": "/tile",
        "name": "tile",
        "id": 276833,
        "actions": [
          {
            "name": "READ-WRITE",
            "id": 276824,
            "entitlementId": 276873
          }
        ]
      }
    ]
  }]
}

describe("Admin Module Routing component", () => {
  it("should be in route to importmap", async () => {
    await render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <Index module="/importmap" tile="/importmap" panelId="1" tabId="1" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to category", async () => {
    await render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <Index module="/category" tile="/category" panelId="2" tabId="2" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to tile", async () => {
    await render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <Index module="/tile" tile="/tile" panelId="3" tabId="3" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to importmap", async () => {
    await render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <Index module="/importmap" tile="/importmap" panelId="1" tabId="1" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
  });
  it("should be in route to tile", async () => {
    await render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <Index module="" tile="" panelId="4" tabId="4" />
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
  });
});
