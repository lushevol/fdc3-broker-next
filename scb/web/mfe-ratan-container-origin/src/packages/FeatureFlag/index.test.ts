import { featureScopedEnabledFactor } from "./index";

jest.mock("../../ratanutils/authenticator", () => {
  return {
    getUser: () => ({
      id: "1234567",
      entitlements: ["TEST_TILE:Test_Entitlement_Code"],
    }),
  }
});

describe("pilot feature flag controller", () => {
  it("users", () => {
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: false,
        sit: false,
        "pre-prod": false,
        prod: {
          users: ["1234567"],
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        },
      },
    })("TEST_FEATURE")).toBe(true);
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: false,
        sit: false,
        "pre-prod": false,
        prod: {
          users: [],
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        }
      },
    })("TEST_FEATURE")).toBe(true);
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: false,
        sit: false,
        "pre-prod": false,
        prod: {
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        }
      },
    })("TEST_FEATURE")).toBe(true);
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: false,
        sit: false,
        "pre-prod": false,
        prod: {
          users: ["112233"],
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        }
      },
    })("TEST_FEATURE")).toBe(false);
  });
  it("entitlements", () => {
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: false,
        sit: false,
        "pre-prod": false,
        prod: {
          users: ["1234567"],
          entitlements: []
        }
      },
    })("TEST_FEATURE")).toBe(true);
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: false,
        sit: false,
        "pre-prod": false,
        prod: {
          entitlements: ["TEST:another_entitlement_test"]
        }
      },
    })("TEST_FEATURE")).toBe(false);
  });
  it("envs", () => {
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: false,
        sit: false,
        "pre-prod": {
          users: ["1234567"],
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        },
        prod: false,
      },
    })("TEST_FEATURE")).toBe(false);
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: false,
        dev: {
          users: ["1234567"],
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        },
        uat: {
          users: ["1234567"],
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        },
        sit: {
          users: ["112233"],
          entitlements: ["TEST:another_entitlement_test"]
        },
        "pre-prod": false,
        prod: {
          users: ["1234567"],
          entitlements: ["TEST_TILE:Test_Entitlement_Code"]
        },
      },
    })("TEST_FEATURE")).toBe(true);
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: true,
        "pre-prod": true,
        "sit": {
          users: ["112233"],
          entitlements: ["TEST:another_entitlement_test"]
        },
        prod: true,
      },
    })("TEST_FEATURE")).toBe(true);
    expect(featureScopedEnabledFactor({
      TEST_FEATURE: {
        local: true,
        dev: true,
        uat: true,
        "pre-prod": true,
        "sit": {
          users: ["112233"],
          entitlements: ["TEST:another_entitlement_test"]
        },
        prod: true,
      },
    })("New_Swift_Api" as any)).toBe(false);
  });
});