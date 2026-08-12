import { featureScopedEnabledFactor } from "./featureFlagController";

describe("pilot feature flag controller", () => {
  it("users", () => {
    const featureFlagEnabled = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: true,
        dev: true,
        uat: false,
        uat2: false,
        eks: false,
        sit: false,
        "pre-prod": false,
        prod: {
          users: ["123456"],
          entitlements: ["TEST:entitlement_test"]
        },
      },
    });
    expect(featureFlagEnabled("TEST_FEATURE_FLAG")).toBe(true);
    expect(featureFlagEnabled("TEST_FEATURE_FLAG")).toBe(true);

    const featureFlagEnabled2 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: {
          users: [],
          entitlements: ["TEST:entitlement_test"]
        },
        dev: true,
        uat: false,
        uat2: false,
        eks: false,
        sit: false,
        "pre-prod": false,
        prod: true,
      },
    });
    expect(featureFlagEnabled2("TEST_FEATURE_FLAG")).toBe(true);
    expect(featureFlagEnabled2("TEST_FEATURE_FLAG")).toBe(true);

    const featureFlagEnabled3 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: {
          entitlements: ["TEST:entitlement_test"]
        },
        dev: true,
        uat: false,
        uat2: false,
        eks: false,
        sit: false,
        "pre-prod": false,
        prod: true,
      },
    });
    expect(featureFlagEnabled3("TEST_FEATURE_FLAG")).toBe(true);
    expect(featureFlagEnabled3("TEST_FEATURE_FLAG")).toBe(true);

    const featureFlagEnabled4 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: {
          users: ["112233"],
          entitlements: ["TEST:entitlement_test"]
        },
        dev: true,
        uat: false,
        uat2: false,
        eks: false,
        sit: false,
        "pre-prod": false,
        prod: true,
      },
    });
    expect(featureFlagEnabled4("TEST_FEATURE_FLAG")).toBe(false);
    expect(featureFlagEnabled4("TEST_FEATURE_FLAG")).toBe(false);
  });
  it("entitlements", () => {
    const featureFlagEnabled5 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: {
          users: ["123456"],
          entitlements: []
        },
        dev: true,
        uat: false,
        uat2: false,
        eks: false,
        sit: false,
        "pre-prod": false,
        prod: true,
      },
    });
    expect(featureFlagEnabled5("TEST_FEATURE_FLAG")).toBe(true);
    expect(featureFlagEnabled5("TEST_FEATURE_FLAG")).toBe(true);

    const featureFlagEnabled6 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: {
          entitlements: ["TEST:another_entitlement_test"]
        },
        dev: true,
        uat: false,
        uat2: false,
        eks: false,
        sit: false,
        "pre-prod": false,
        prod: true,
      },
    });
    expect(featureFlagEnabled6("TEST_FEATURE_FLAG")).toBe(false);
    expect(featureFlagEnabled6("TEST_FEATURE_FLAG")).toBe(false);
  });
  it("envs", () => {
    const featureFlagEnabled6 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: false,
        dev: true,
        uat: false,
        uat2: false,
        eks: false,
        sit: false,
        "pre-prod": {
          users: ["123456"],
          entitlements: ["TEST:entitlement_test"]
        },
        prod: true,
      },
    });
    expect(featureFlagEnabled6("TEST_FEATURE_FLAG")).toBe(false);
    expect(featureFlagEnabled6("TEST_FEATURE_FLAG")).toBe(false);

    const featureFlagEnabled7 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: {
          users: ["123456"],
          entitlements: ["TEST:entitlement_test"]
        },
        dev: {
          users: ["123456"],
          entitlements: ["TEST:entitlement_test"]
        },
        uat: {
          users: ["123456"],
          entitlements: ["TEST:entitlement_test"]
        },
        uat2: false,
        eks: false,
        sit: {
          users: ["112233"],
          entitlements: ["TEST:another_entitlement_test"]
        },
        "pre-prod": false,
        prod: false,
      },
    });
    expect(featureFlagEnabled7("TEST_FEATURE_FLAG")).toBe(true);
    expect(featureFlagEnabled7("TEST_FEATURE_FLAG")).toBe(true);

    const featureFlagEnabled8 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: true,
        dev: true,
        uat: true,
        uat2: false,
        eks: false,
        "pre-prod": true,
        "sit": {
          users: ["112233"],
          entitlements: ["TEST:another_entitlement_test"]
        },
        prod: true,
      },
    });
    expect(featureFlagEnabled8("TEST_FEATURE_FLAG")).toBe(true);
    expect(featureFlagEnabled8("TEST_FEATURE_FLAG")).toBe(true);

    const featureFlagEnabled9 = featureScopedEnabledFactor({
      TEST_FEATURE_FLAG: {
        local: true,
        dev: true,
        uat: true,
        uat2: false,
        eks: false,
        "pre-prod": true,
        "sit": {
          users: ["112233"],
          entitlements: ["TEST:another_entitlement_test"]
        },
        prod: true,
      },
    });
    expect(featureFlagEnabled9("ANOTHER_FEATURE_FLAG" as any)).toBe(false);
    expect(featureFlagEnabled9("ANOTHER_FEATURE_FLAG" as any)).toBe(false);
  });
});