import { truncate } from "fs/promises";
import { RuleGroupType } from "react-querybuilder";

import { canProceedAdvancedSearchFilter, canProceedQuickSearchFilter, collectAllFieldRules, mandatoryAdvancedFilterFields } from "./filterGuard";

describe("collectAllFieldRules", () => {
  it("should collect rules at root level", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
        { field: "Entity.Booking_Entity_SCI_FMID", operator: "IN", value: ["A", "B"] },
      ],
    };
    const result = collectAllFieldRules(group);
    expect(result).toEqual([
      { field: "Cashflow.Payment_Date", operator: "EQ" },
      { field: "Entity.Booking_Entity_SCI_FMID", operator: "IN" },
    ]);
  });
  it("should collect rules from nested groups", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          combinator: "or",
          rules: [
            { field: "Cashflow.Cashflow_State", operator: "IN", value: ["ACTIVE"] },
            {
              combinator: "and",
              rules: [
                { field: "Entity.Booking_Entity_SCI_FMID", operator: "EQ", value: "A" },
              ],
            },
          ],
        },
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
      ],
    };
    const result = collectAllFieldRules(group);
    expect(result).toEqual([
      { field: "Cashflow.Cashflow_State", operator: "IN" },
      { field: "Entity.Booking_Entity_SCI_FMID", operator: "EQ" },
      { field: "Cashflow.Payment_Date", operator: "EQ" },
    ]);
  });
  it("should return empty array for empty rules", () => {
    const group: RuleGroupType = { combinator: "and", rules: [] };
    expect(collectAllFieldRules(group)).toEqual([]);
  });

  it("should return empty array for undefined group", () => {
    expect(collectAllFieldRules(undefined as any)).toEqual([]);
  });

  it("should ignore rules without field", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { operator: "EQ", value: "2024-01-01" } as any,
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
      ],
    };
    const result = collectAllFieldRules(group);
    expect(result).toEqual([
      { field: "Cashflow.Payment_Date", operator: "EQ" },
    ]);
  });
});


describe("canProceedQuickSearchFilter", () => {
  it("should pass if filter contains Cashflow.Cashflow_Id", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Cashflow_Id", operator: "EQ", value: "123" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({ valid: true });
  });

  it("should pass if filter contains Trade_Id", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Trade_Id", operator: "EQ", value: "T123" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({ valid: true });
  });

  it("should pass if filter contains BCS_Parent_Trade_Id", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "BCS_Parent_Trade_Id", operator: "EQ", value: "T123" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({ valid: true });
  });

  it("should fail if filter is null", () => {
    const group: RuleGroupType = { combinator: "and", rules: [] };

    expect(canProceedQuickSearchFilter(group)).toEqual({
      valid: false,
      message: "Please fill in the filter.",
    });
  });

  it("should fail if filter does not have Value Date", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Entity.Booking_Entity_SCI_FMID", operator: "EQ", value: "A" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({ valid: false, message: "Value Date is missing." });
  });

  it("should fail if both Booking Entity and Counterparty Code are present", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
        { field: "Entity.Booking_Entity_SCI_FMID", operator: "EQ", value: "A" },
        { field: "Entity.Counterparty_SCI_FMCODE", operator: "EQ", value: "B" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({
      valid: true,
    });
  });

    it("should fail if both Booking Entity and Counterparty FMID are present", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
        { field: "Entity.Booking_Entity_SCI_FMID", operator: "EQ", value: "A" },
        { field: "Entity.Counterparty_SCI_FMID", operator: "EQ", value: "B" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({
      valid: true,
    });
  });

  it("should fail if neither Booking Entity nor Counterparty Code is present", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({
      valid: false,
      message: "Booking Entity or Counterparty Code is missing.",
    });
  });

  it("should pass if only Booking Entity and Value Date are present", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
        { field: "Entity.Booking_Entity_SCI_FMID", operator: "EQ", value: "A" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({ valid: true });
  });

  it("should pass if only Counterparty Code and Value Date are present", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "EQ", value: "2024-01-01" },
        { field: "Entity.Counterparty_SCI_FMCODE", operator: "EQ", value: "B" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({ valid: true });
  });

    it("should pass if only Counterparty Code and Value Date are present with allowed operator", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "LTE", value: "2024-01-01" },
        { field: "Entity.Counterparty_SCI_FMCODE", operator: "EQ", value: "B" },
      ],
    };
    expect(
      canProceedQuickSearchFilter(group)
    ).toEqual({ valid: true });
  });
});

describe("canProceedAdvancedSearchFilter", () => {
  it("should fail and return missing fields if mandatory fields are missing", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
      ],
    };
    expect(canProceedAdvancedSearchFilter(group, mandatoryAdvancedFilterFields)).toEqual({
      valid: false,
      missingFields: [
        { field: "Cashflow.Cashflow_State", label: "Cashflow State", operator: ["=", "in"] },
        { field: "Entity.Booking_Entity_SCI_FMID", label: "Booking Entity", operator: ["=", "in"] },
      ],
      invalidOperatorFields: undefined
    });
  });
  it("should fail and return invalidOperatorFields if input operator is invalid", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "!=", value: "2024-01-01" },
      ],
    };
    expect(canProceedAdvancedSearchFilter(group, mandatoryAdvancedFilterFields)).toEqual({
      valid: false,
      missingFields: [
        { field: "Cashflow.Cashflow_State", label: "Cashflow State", operator: ["=", "in"] },
        { field: "Entity.Booking_Entity_SCI_FMID", label: "Booking Entity", operator: ["=", "in"] },

      ],
      invalidOperatorFields: [
        { field: "Cashflow.Payment_Date", label: "Payment Date", operator: ["=", "in", "between", "<=", ">="] },
      ]
    });
  });
  it("should valid true by pass with field contains _id", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "!=", value: "2024-01-01" },
        { field: "Cashflow.Cashflow_Id", operator: "!=", value: "" },
      ],
    };
    expect(canProceedAdvancedSearchFilter(group, mandatoryAdvancedFilterFields)).toEqual({
      valid: true
    });
  });

  it("should pass if all mandatory fields are present", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
        { field: "Entity.Booking_Entity_SCI_FMID", operator: "=", value: "A" },
        { field: "Cashflow.Cashflow_State", operator: "=", value: "ACTIVE" },
      ],
    };
    expect(canProceedAdvancedSearchFilter(group, mandatoryAdvancedFilterFields)).toEqual({ valid: true });
  });

  it("should work with nested groups", () => {
    const group: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          combinator: "and",
          rules: [
            { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
            { field: "Entity.Booking_Entity_SCI_FMID", operator: "=", value: "A" },
          ],
        },
        { field: "Cashflow.Cashflow_State", operator: "=", value: "ACTIVE" },
      ],
    };
    expect(canProceedAdvancedSearchFilter(group, mandatoryAdvancedFilterFields)).toEqual({ valid: true });
  });
});