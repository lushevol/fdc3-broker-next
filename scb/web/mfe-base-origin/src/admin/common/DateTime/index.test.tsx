import { render, screen } from "@testing-library/react";
import DateTime from ".";
import Provider from "../../../hooks/provider";
import ThemeProvider from "../../../theme";


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

describe("Admin Module Status component", () => {
  it("should be in the document", () => {
    render(
      <Provider data={{ ...providerData }}>
        <ThemeProvider>
          <>
            <DateTime value="" />
            <DateTime value="2024-12-11T17:27:50.652+00:00" />
          </>
        </ThemeProvider>
      </Provider>
    );
    expect(screen).toBeDefined();
  });
});
