import dayjs from "dayjs";
import { RuleGroupType, RuleType } from "react-querybuilder";

import {
  addVDtoQuery,
  checkShouldAddVD,
  getAllFieldsInRuleGroup,
  isQueryContainsId,
  isQueryContainsVD,
  isQueryVDRangeThan1Month,
  newQueryOnlyMissingVDCompareWithPrev,
} from "./query-checker";

type QueryType = RuleGroupType<RuleType<string, string, any, string>, string>;

describe("query-checker utils", () => {
  describe("isQueryContainsVD", () => {
    it("returns false if query is undefined", () => {
      expect(isQueryContainsVD(undefined as any)).toBe(false);
    });
    it("returns false if query.rules is undefined", () => {
      expect(isQueryContainsVD({} as any)).toBe(false);
    });
    it("returns true if query contains Cashflow.Payment_Date", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
        ],
      };
      expect(isQueryContainsVD(query)).toBe(true);
    });
    it("returns false if query does not contain Cashflow.Payment_Date", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          { field: "Other_Field", operator: "=", value: "test" },
        ],
      };
      expect(isQueryContainsVD(query)).toBe(false);
    });
    it("returns true for nested group", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            combinator: "and",
            rules: [
              { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
            ],
          },
        ],
      };
      expect(isQueryContainsVD(query)).toBe(true);
    });
  });

  describe("isQueryContainsId", () => {
    it("returns false if query is undefined", () => {
      expect(isQueryContainsId(undefined as any)).toBe(false);
    });
    it("returns false if query.rules is undefined", () => {
      expect(isQueryContainsId({} as any)).toBe(false);
    });
    it("returns true if query contains field ending with _id", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          { field: "user_id", operator: "=", value: 1 },
        ],
      };
      expect(isQueryContainsId(query)).toBe(true);
    });
    it("returns false if query does not contain field ending with _id", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          { field: "username", operator: "=", value: "abc" },
        ],
      };
      expect(isQueryContainsId(query)).toBe(false);
    });
    it("returns true for nested group containing _id", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            combinator: "and",
            rules: [
              { field: "something_id", operator: "=", value: 2 },
            ],
          },
        ],
      };
      expect(isQueryContainsId(query)).toBe(true);
    });
    it("is case-insensitive for _id", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          { field: "SOMETHING_ID", operator: "=", value: 2 },
        ],
      };
      expect(isQueryContainsId(query)).toBe(true);
    });
  });

  describe("isQueryVDRangeThan1Month", () => {
    it("returns false if query is undefined", () => {
      expect(isQueryVDRangeThan1Month(undefined as any)).toBe(false);
    });
    it("returns false if query.rules is undefined", () => {
      expect(isQueryVDRangeThan1Month({} as any)).toBe(false);
    });
    it("returns true if VD range is more than 1 month", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            field: "Cashflow.Payment_Date",
            operator: "between",
            value: [
              dayjs("2024-01-01").format("YYYY-MM-DD"),
              dayjs("2024-02-15").format("YYYY-MM-DD"),
            ],
          },
        ],
      };
      expect(isQueryVDRangeThan1Month(query)).toBe(true);
    });
    it("returns false if VD range is less than or equal to 1 month", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            field: "Cashflow.Payment_Date",
            operator: "between",
            value: [
              dayjs("2024-01-01").format("YYYY-MM-DD"),
              dayjs("2024-01-31").format("YYYY-MM-DD"),
            ],
          },
        ],
      };
      expect(isQueryVDRangeThan1Month(query)).toBe(false);
    });
    it("returns false if not between operator", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            field: "Cashflow.Payment_Date",
            operator: "=",
            value: dayjs("2024-01-01").format("YYYY-MM-DD"),
          },
        ],
      };
      expect(isQueryVDRangeThan1Month(query)).toBe(false);
    });
    it("returns false if value is not array", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            field: "Cashflow.Payment_Date",
            operator: "between",
            value: "2024-01-01",
          },
        ],
      };
      expect(isQueryVDRangeThan1Month(query)).toBe(false);
    });
    it("returns false if value array length is not 2", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            field: "Cashflow.Payment_Date",
            operator: "between",
            value: ["2024-01-01"],
          },
        ],
      };
      expect(isQueryVDRangeThan1Month(query)).toBe(false);
    });
    it("returns false if not Cashflow.Payment_Date", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [
          {
            field: "Other_Field",
            operator: "between",
            value: [
              dayjs("2024-01-01").format("YYYY-MM-DD"),
              dayjs("2024-02-15").format("YYYY-MM-DD"),
            ],
          },
        ],
      };
      expect(isQueryVDRangeThan1Month(query)).toBe(false);
    });
    it("returns true if VD range is more than 1 month in nested group", () => {
      const query: QueryType = {
      combinator: "and",
      rules: [
        {
        combinator: "and",
        rules: [
          {
          field: "Cashflow.Payment_Date",
          operator: "between",
          value: [
            dayjs("2024-01-01").format("YYYY-MM-DD"),
            dayjs("2024-02-15").format("YYYY-MM-DD"),
          ],
          },
        ],
        },
      ],
      };
      expect(isQueryVDRangeThan1Month(query)).toBe(true);
    });
  });

  describe("newQueryOnlyMissingVDCompareWithPrev", () => {
    it("returns true if new query is prev query minus VD", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
          { field: "A", operator: "=", value: 1 },
        ],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [
          { field: "A", operator: "=", value: 1 },
        ],
      };
      expect(newQueryOnlyMissingVDCompareWithPrev(prev, next)).toBe(true);
    });
    it("returns false if new query has extra field", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
        ],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [
          { field: "A", operator: "=", value: 1 },
          { field: "B", operator: "=", value: 2 },
        ],
      };
      expect(newQueryOnlyMissingVDCompareWithPrev(prev, next)).toBe(false);
    });
    it("returns true if both queries have same fields except VD", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
          { field: "A", operator: "=", value: 1 },
          { field: "B", operator: "=", value: 2 },
        ],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [
          { field: "A", operator: "=", value: 1 },
          { field: "B", operator: "=", value: 2 },
        ],
      };
      expect(newQueryOnlyMissingVDCompareWithPrev(prev, next)).toBe(true);
    });
    it("returns true if new query is empty", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
        ],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [],
      };
      expect(newQueryOnlyMissingVDCompareWithPrev(prev, next)).toBe(true);
    });
  });

  describe("checkShouldAddVD", () => {
    it("returns false if newFilters is empty", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [{ field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" }],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [],
      };
      expect(checkShouldAddVD(next, prev)).toBe(false);
    });
    it("returns false if newFilters contains VD", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [{ field: "A", operator: "=", value: 1 }],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [{ field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" }],
      };
      expect(checkShouldAddVD(next, prev)).toBe(false);
    });
    it("returns false if newQueryOnlyMissingVDCompareWithPrev is true", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
          { field: "A", operator: "=", value: 1 },
        ],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [{ field: "A", operator: "=", value: 1 }],
      };
      expect(checkShouldAddVD(next, prev)).toBe(false);
    });
    it("returns false if newQueryContainsId is true", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [{ field: "A", operator: "=", value: 1 }],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [{ field: "user_id", operator: "=", value: 1 }],
      };
      expect(checkShouldAddVD(next, prev)).toBe(false);
    });
    it("returns true if all conditions are met", () => {
      const prev: QueryType = {
        combinator: "and",
        rules: [{ field: "A", operator: "=", value: 1 }],
      };
      const next: QueryType = {
        combinator: "and",
        rules: [{ field: "B", operator: "=", value: 2 }],
      };
      expect(checkShouldAddVD(next, prev)).toBe(true);
    });
  });

  describe("addVDtoQuery", () => {
    it("adds VD to query", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [{ field: "A", operator: "=", value: 1 }],
      };
      const result = addVDtoQuery(query);
      expect(result.rules.some(r => !("rules" in r) && r.field === "Cashflow.Payment_Date")).toBe(true);
    });
    it("does not mutate original query", () => {
      const query: QueryType = {
        combinator: "and",
        rules: [{ field: "A", operator: "=", value: 1 }],
      };
      const original = JSON.stringify(query);
      addVDtoQuery(query);
      expect(JSON.stringify(query)).toBe(original);
    });
  });


describe("getAllFieldsInRuleGroup", () => {
  it("returns empty array if ruleGroup is undefined", () => {
    expect(getAllFieldsInRuleGroup(undefined as any)).toEqual([]);
  });

  it("returns empty array if ruleGroup.rules is undefined", () => {
    expect(getAllFieldsInRuleGroup({} as any)).toEqual([]);
  });

  it("returns fields for flat rule group", () => {
    const query: QueryType = {
      combinator: "and",
      rules: [
        { field: "A", operator: "=", value: 1 },
        { field: "B", operator: "=", value: 2 },
      ],
    };
    expect(getAllFieldsInRuleGroup(query)).toEqual(["A", "B"]);
  });

  it("returns sorted fields for flat rule group", () => {
    const query: QueryType = {
      combinator: "and",
      rules: [
        { field: "B", operator: "=", value: 2 },
        { field: "A", operator: "=", value: 1 },
      ],
    };
    expect(getAllFieldsInRuleGroup(query)).toEqual(["A", "B"]);
  });

  it("returns fields for nested rule group", () => {
    const query: QueryType = {
      combinator: "and",
      rules: [
        { field: "A", operator: "=", value: 1 },
        {
          combinator: "and",
          rules: [
            { field: "B", operator: "=", value: 2 },
            { field: "C", operator: "=", value: 3 },
          ],
        },
      ],
    };
    expect(getAllFieldsInRuleGroup(query)).toEqual(["A", "B", "C"]);
  });

  it("returns fields for deeply nested rule group", () => {
    const query: QueryType = {
      combinator: "and",
      rules: [
        {
          combinator: "and",
          rules: [
            {
              combinator: "and",
              rules: [
                { field: "D", operator: "=", value: 4 },
              ],
            },
            { field: "B", operator: "=", value: 2 },
          ],
        },
        { field: "A", operator: "=", value: 1 },
      ],
    };
    expect(getAllFieldsInRuleGroup(query)).toEqual(["A", "B", "D"]);
  });

  it("returns empty array for rule group with only nested empty groups", () => {
    const query: QueryType = {
      combinator: "and",
      rules: [
        {
          combinator: "and",
          rules: [],
        },
      ],
    };
    expect(getAllFieldsInRuleGroup(query)).toEqual([]);
  });

  it("returns fields with duplicates if present", () => {
    const query: QueryType = {
      combinator: "and",
      rules: [
        { field: "A", operator: "=", value: 1 },
        { field: "A", operator: "=", value: 2 },
      ],
    };
    expect(getAllFieldsInRuleGroup(query)).toEqual(["A", "A"]);
  });

  it("returns fields for mixed nested and flat rules", () => {
    const query: QueryType = {
      combinator: "and",
      rules: [
        { field: "X", operator: "=", value: 1 },
        {
          combinator: "and",
          rules: [
            { field: "Y", operator: "=", value: 2 },
            {
              combinator: "and",
              rules: [
                { field: "Z", operator: "=", value: 3 },
              ],
            },
          ],
        },
      ],
    };
    expect(getAllFieldsInRuleGroup(query)).toEqual(["X", "Y", "Z"]);
  });
});
});
