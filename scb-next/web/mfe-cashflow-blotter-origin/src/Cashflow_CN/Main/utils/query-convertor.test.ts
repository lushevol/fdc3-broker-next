import { RuleGroupType, RuleType } from "react-querybuilder";
import * as dashboardUtils from "src/Cashflow_Dashboard/Main/common/utils";

import {
combineRuleGroups,
convertRule2FilterArg,
convertRuleGroup2LogicFilters,
convertRuleGroup2RatanUltraQueryFilters,
filterInvalidRules,
filterOutDuplicateFieldsQuery,
transformAllVariableDates,
transformVariableDate,
} from "./query-convertor";

describe("query-convertor", () => {
    describe("convertRule2FilterArg", () => {
        it("should convert a rule to a FilterArg", () => {
            const rule: RuleType = {
                field: "field1",
                operator: "=",
                value: "value1",
            };
            const result = convertRule2FilterArg(rule);
            expect(result).toEqual({
                field: "field1",
                operator: "EQ",
                values: "value1",
            });
        });
    });

    describe("convertRuleGroup2RatanUltraQueryFilters", () => {
        it("should convert a rule group to RatanUltraQuery filters", () => {
            const ruleGroup: RuleGroupType = {
                combinator: "and",
                rules: [
                    {
                        field: "field1",
                        operator: "=",
                        value: "value1",
                    },
                ],
            };
            const result = convertRuleGroup2RatanUltraQueryFilters(ruleGroup);
            expect(result).toEqual({
                and: [
                    {
                        filters: [{
                            field: "field1",
                            operator: "EQ",
                            values: "value1",
                        }],
                    }
                ]
            });
        });

        it("should handle nested rule groups", () => {
            const ruleGroup: RuleGroupType = {
                combinator: "or",
                rules: [
                    {
                        combinator: "and",
                        rules: [
                            {
                                field: "field1",
                                operator: "=",
                                value: "value1",
                            },
                        ],
                    },
                ],
            };
            const result = convertRuleGroup2RatanUltraQueryFilters(ruleGroup);
            expect(result).toEqual({
                or: [
                    {
                        and: [{
                            filters: [
                                {
                                    field: "field1",
                                    operator: "EQ",
                                    values: "value1",
                                },
                            ],
                        }],
                    }
                ],
            });
        });
        
        it("should handle multiple nested rule groups", () => {
            const ruleGroup: RuleGroupType = {
                combinator: "or",
                rules: [
                    {
                        combinator: "and",
                        rules: [
                            {
                                field: "field1",
                                operator: "=",
                                value: "value1",
                            },
                            {
                                field: "field2",
                                operator: "=",
                                value: "value2",
                            },
                        ],
                    },
                    {
                        combinator: "or",
                        rules: [
                            {
                                combinator: "and",
                                rules: [
                                    {
                                        field: "field1",
                                        operator: "=",
                                        value: "value1",
                                    },
                                    {
                                        field: "field2",
                                        operator: "=",
                                        value: "value2",
                                    },
                                ],
                            },
                            {
                                combinator: "and",
                                rules: [
                                    {
                                        field: "field1",
                                        operator: "=",
                                        value: "value1",
                                    },
                                    {
                                        field: "field2",
                                        operator: "=",
                                        value: "value2",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            const result = convertRuleGroup2RatanUltraQueryFilters(ruleGroup);
            expect(result).toEqual({
                or: [
                    {
                        and: [{
                            filters: [
                                {
                                    field: "field1",
                                    operator: "EQ",
                                    values: "value1",
                                },
                                {
                                    field: "field2",
                                    operator: "EQ",
                                    values: "value2",
                                },
                            ],
                        }],
                    },
                    {
                        or: [
                            {
                                and: [{
                                    filters: [
                                        {
                                            field: "field1",
                                            operator: "EQ",
                                            values: "value1",
                                        },
                                        {
                                            field: "field2",
                                            operator: "EQ",
                                            values: "value2",
                                        },
                                    ],
                                }],
                            },
                            {
                                and: [{
                                    filters: [
                                        {
                                            field: "field1",
                                            operator: "EQ",
                                            values: "value1",
                                        },
                                        {
                                            field: "field2",
                                            operator: "EQ",
                                            values: "value2",
                                        },
                                    ],
                                }],
                            }
                        ]
                    }
                ],
            });
        });
    });

    describe("convertRuleGroup2LogicFilters", () => {
        it("should convert a rule group to LogicFilter", () => {
            const ruleGroup: RuleGroupType = {
                combinator: "and",
                rules: [
                    {
                        field: "field1",
                        operator: "=",
                        value: "value1",
                    },
                ],
            };
            const result = convertRuleGroup2LogicFilters(ruleGroup);
            expect(result).toEqual({
                and: [{
                    filters: [
                        {
                            field: "field1",
                            operator: "EQ",
                            values: "value1",
                        },
                    ],
                }]
            });
        });

        it("should handle an empty rule group", () => {
            const input: RuleGroupType = { combinator: "and", rules: [] };
            const result = convertRuleGroup2LogicFilters(input);
            expect(result).toEqual({ and: [] });
        });
      
        it("should handle a single rule", () => {
            const input: RuleGroupType = {
              combinator: "and",
              rules: [{ field: "age", operator: ">", value: 30 } as RuleType],
            };
            const result = convertRuleGroup2LogicFilters(input);
            expect(result).toEqual({
              and: [{ filters: [{ field: "age", operator: "GT", values: 30 }] }],
            });
        });
      
        it("should handle multiple rules with 'and' combinator", () => {
            const input: RuleGroupType = {
              combinator: "and",
              rules: [
                { field: "age", operator: ">", value: 30 } as RuleType,
                { field: "name", operator: "=", value: "John" } as RuleType,
              ],
            };
            const result = convertRuleGroup2LogicFilters(input);
            expect(result).toEqual({
              and: [
                {
                  filters: [
                    { field: "age", operator: "GT", values: 30 },
                    { field: "name", operator: "EQ", values: "John" },
                  ],
                },
              ],
            });
        });
      
        it("should handle multiple rules with 'or' combinator", () => {
            const input: RuleGroupType = {
              combinator: "or",
              rules: [
                { field: "age", operator: ">", value: 30 } as RuleType,
                { field: "name", operator: "=", value: "John" } as RuleType,
              ],
            };
            const result = convertRuleGroup2LogicFilters(input);
            expect(result).toEqual({
              or: [
                {
                  filters: [
                    { field: "age", operator: "GT", values: 30 },
                    { field: "name", operator: "EQ", values: "John" },
                  ],
                },
              ],
            });
        });
      
        it("should handle nested rule groups with 'and' and 'or' combinators", () => {
            const input: RuleGroupType = {
              combinator: "and",
              rules: [
                {
                  combinator: "or",
                  rules: [
                    { field: "age", operator: ">", value: 30 } as RuleType,
                    { field: "name", operator: "=", value: "John" } as RuleType,
                  ],
                } as RuleGroupType,
                { field: "status", operator: "=", value: "active" } as RuleType,
              ],
            };
            const result = convertRuleGroup2LogicFilters(input);
            expect(result).toEqual({
              and: [
                {
                  or: [
                    {
                      filters: [
                        { field: "age", operator: "GT", values: 30 },
                        { field: "name", operator: "EQ", values: "John" },
                      ],
                    },
                  ],
                },
                {
                  filters: [{ field: "status", operator: "EQ", values: "active" }],
                },
              ],
            });
        });
      
        it("should handle deeply nested rule groups", () => {
            const input: RuleGroupType = {
              combinator: "and",
              rules: [
                {
                  combinator: "and",
                  rules: [
                    {
                      combinator: "or",
                      rules: [
                        { field: "age", operator: ">", value: 30 } as RuleType,
                        { field: "name", operator: "=", value: "John" } as RuleType,
                      ],
                    } as RuleGroupType,
                    { field: "status", operator: "=", value: "active" } as RuleType,
                  ],
                } as RuleGroupType,
              ],
            };
            const result = convertRuleGroup2LogicFilters(input);
            expect(result).toEqual({
              and: [
                {
                  and: [
                    {
                      or: [
                        {
                          filters: [
                            { field: "age", operator: "GT", values: 30 },
                            { field: "name", operator: "EQ", values: "John" },
                          ],
                        },
                      ],
                    },
                    {
                      filters: [{ field: "status", operator: "EQ", values: "active" }],
                    },
                  ],
                },
              ],
            });
        });
    });

    describe("combineRuleGroups", () => {
        it("should combine two rule groups with 'and' combinator", () => {
            const ruleGroup1: RuleGroupType = {
                combinator: "and",
                rules: [
                    {
                        field: "field1",
                        operator: "=",
                        value: "value1",
                    },
                ],
            };
            const ruleGroup2: RuleGroupType = {
                combinator: "and",
                rules: [
                    {
                        field: "field2",
                        operator: "!=",
                        value: "value2",
                    },
                ],
            };
            const result = combineRuleGroups(ruleGroup1, ruleGroup2);
            expect(result).toEqual({
                combinator: "and",
                rules: [
                    {
                        field: "field1",
                        operator: "=",
                        value: "value1",
                    },
                    {
                        field: "field2",
                        operator: "!=",
                        value: "value2",
                    },
                ],
            });
        });

        it("should return the non-empty rule group if one is empty", () => {
            const ruleGroup1: RuleGroupType = { combinator: "and", rules: [] };
            const ruleGroup2: RuleGroupType = {
                combinator: "and",
                rules: [
                    {
                        field: "field2",
                        operator: "!=",
                        value: "value2",
                    },
                ],
            };
            const result = combineRuleGroups(ruleGroup1, ruleGroup2);
            expect(result).toEqual(ruleGroup2);
        });

        describe("filterInvalidRules", () => {
            it("should filter out invalid rules from a rule group", () => {
            const ruleGroup = {
                combinator: "and",
                rules: [
                {
                    field: "field1",
                    operator: "=",
                    value: "value1",
                },
                {
                    field: "~",
                    operator: "=",
                    value: "value2",
                },
                {
                    field: "field3",
                    operator: undefined,
                    value: "value3",
                },
                ],
            } as RuleGroupType;
            const result = filterInvalidRules(ruleGroup);
            expect(result).toEqual({
                combinator: "and",
                rules: [
                {
                    field: "field1",
                    operator: "=",
                    value: "value1",
                },
                ],
            });
            });

            it("should recursively filter invalid rules from nested rule groups", () => {
            const ruleGroup = {
                combinator: "and",
                rules: [
                {
                    combinator: "or",
                    rules: [
                    {
                        field: "field1",
                        operator: "=",
                        value: "value1",
                    },
                    {
                        field: "~",
                        operator: "=",
                        value: "value2",
                    },
                    ],
                },
                {
                    field: "field3",
                    operator: undefined,
                    value: "value3",
                },
                ],
            } as RuleGroupType;
            const result = filterInvalidRules(ruleGroup);
            expect(result).toEqual({
                combinator: "and",
                rules: [
                {
                    combinator: "or",
                    rules: [
                    {
                        field: "field1",
                        operator: "=",
                        value: "value1",
                    },
                    ],
                },
                ],
            });
            });

            it("should return an empty rule group if all rules are invalid", () => {
            const ruleGroup = {
                combinator: "and",
                rules: [
                {
                    field: "~",
                    operator: "=",
                    value: "value1",
                },
                {
                    field: "field2",
                    operator: undefined,
                    value: "value2",
                },
                ],
            } as RuleGroupType;
            const result = filterInvalidRules(ruleGroup);
            expect(result).toEqual({
                combinator: "and",
                rules: [],
            });
            });

            it("should handle deeply nested rule groups with invalid rules", () => {
                const ruleGroup = {
                    combinator: "and",
                    rules: [
                        {
                            combinator: "or",
                            rules: [
                                {
                                    combinator: "and",
                                    rules: [
                                        {
                                            field: "field1",
                                            operator: "=",
                                            value: "value1",
                                        },
                                        {
                                            field: "~",
                                            operator: "=",
                                            value: "value2",
                                        },
                                    ],
                                },
                                {
                                    field: "field3",
                                    operator: undefined,
                                    value: "value3",
                                },
                            ],
                        },
                        {
                            field: "~",
                            operator: "=",
                            value: "value4",
                        },
                    ],
                } as RuleGroupType;
                const result = filterInvalidRules(ruleGroup);
                expect(result).toEqual({
                    combinator: "and",
                    rules: [
                        {
                            combinator: "or",
                            rules: [
                                {
                                    combinator: "and",
                                    rules: [
                                        {
                                            field: "field1",
                                            operator: "=",
                                            value: "value1",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
            });
        });
    });
});
describe("combineRuleGroups", () => {
  it("should combine two 'and' level 1 rule groups", () => {
    const rule1: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const rule2: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    });
  });

  it("should handle an empty rule group", () => {
    const rule1: RuleGroupType = {
      combinator: "and",
      rules: [],
    };
    const rule2: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual(rule2);
  });

  it("should handle a rule group with no rules", () => {
    const rule1: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const rule2: RuleGroupType = {
      combinator: "and",
      rules: [],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual(rule1);
  });

  it("should combine a rule group with 'and' combinator and a rule", () => {
    const rule1: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const rule2: RuleGroupType = {
        combinator: "and",
        rules: [
            {
              field: "field2",
              operator: "=",
              value: "value2",
            },
          ],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    });
  });

  it("should combine a rule group with 'and' combinator and a rule group with 'and' combinator", () => {
    const rule1: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const rule2: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    });
  });

  it("should combine a rule group with 'and' combinator and a rule group with 'or' combinator", () => {
    const rule1: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const rule2: RuleGroupType = {
      combinator: "or",
      rules: [
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
        {
          combinator: "or",
          rules: [
            {
              field: "field2",
              operator: "=",
              value: "value2",
            },
          ],
        },
      ],
    });
  });

  it("should combine a rule group with 'or' combinator and a rule group with 'and' combinator", () => {
    const rule1: RuleGroupType = {
      combinator: "or",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const rule2: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
            field: "field2",
            operator: "=",
            value: "value2",
        },
        {
          combinator: "or",
          rules: [
            {
              field: "field1",
              operator: "=",
              value: "value1",
            },
          ],
        },
      ],
    });
  });

  it("should combine two rule groups with 'or' combinator", () => {
    const rule1: RuleGroupType = {
      combinator: "or",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
      ],
    };
    const rule2: RuleGroupType = {
      combinator: "or",
      rules: [
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
          combinator: "or",
          rules: [
            {
              field: "field1",
              operator: "=",
              value: "value1",
            },
          ],
        },
        {
          combinator: "or",
          rules: [
            {
              field: "field2",
              operator: "=",
              value: "value2",
            },
          ],
        },
      ],
    });
  });
  it("should return only rule without combinator", () => {
    const rule1: RuleGroupType = {
      combinator: "and",
      rules: [],
    };
    const rule2: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    };
    const rule3: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field4",
          operator: "=",
          value: "value4",
        },
      ],
    };
    const rule4: RuleGroupType = {
      combinator: "and",
      rules: [],
    };
    const result = combineRuleGroups(rule1, rule2);
    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    });
    const result2 = combineRuleGroups(rule3, rule4);
    expect(result2).toEqual({
      combinator: "and",
      rules: [
        {
          field: "field4",
          operator: "=",
          value: "value4",
        },
      ],
    });
  });
});describe("filterOutDuplicateFieldsQuery", () => {
  it("should filter out duplicate fields", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
        {
          field: "field1",
          operator: "=",
          value: "value3",
        },
      ],
    };

    const result = filterOutDuplicateFieldsQuery(filters);

    expect(result).toEqual({
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    });
  });

  it("should not filter out any fields if there are no duplicates", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          field: "field1",
          operator: "=",
          value: "value1",
        },
        {
          field: "field2",
          operator: "=",
          value: "value2",
        },
      ],
    };

    const result = filterOutDuplicateFieldsQuery(filters);

    expect(result).toEqual(filters);
  });

  it("should handle an group type rule group", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [],
    };

    const result = filterOutDuplicateFieldsQuery(filters);

    expect(result).toEqual(filters);
  });
  it("should handle an empty rule group", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          combinator: "and",
          rules: [
            {
              field: "field",
              operator: "=",
              value: "value",
            },
          ],
        }
      ],
    };

    const result = filterOutDuplicateFieldsQuery(filters);

    expect(result).toEqual(filters);
  });
});

describe("transformVariableDate", () => {
  let spyGetDateByWorkdayOffset: vi.SpyInstance;

  beforeAll(() => {
    // Mock system time to always return originalDate for deterministic tests
    vi.useFakeTimers().setSystemTime(new Date("2023-01-01T00:00:00.000Z"));
    // Mock getDateByWorkdayOffset
    spyGetDateByWorkdayOffset = vi.spyOn(dashboardUtils, "getDateByWorkdayOffset");
  });

  afterAll(() => {
    vi.useRealTimers();
    spyGetDateByWorkdayOffset.mockRestore();
  });

  it("should convert $CURRENT_DATE to today's date in YYYY-MM-DD format", () => {
    const rule = { field: "date", operator: "=", value: "$CURRENT_DATE" };
    const result = transformVariableDate(rule);
    expect(result.value).toBe("2023-01-01");
    expect(result).not.toBe(rule); // should return a new object
  });

  it("should convert businessDay(n) to getDateByWorkdayOffset(n)", () => {
    spyGetDateByWorkdayOffset.mockReturnValue("2023-01-10");
    const rule = { field: "date", operator: "=", value: "businessDay(5)" };
    const result = transformVariableDate(rule);
    expect(spyGetDateByWorkdayOffset).toHaveBeenCalledWith(5);
    expect(result.value).toBe("2023-01-10");
  });

  it("should convert businessDay(-3) to getDateByWorkdayOffset(-3)", () => {
    spyGetDateByWorkdayOffset.mockReturnValue("2022-12-29");
    const rule = { field: "date", operator: "=", value: "businessDay(-3)" };
    const result = transformVariableDate(rule);
    expect(spyGetDateByWorkdayOffset).toHaveBeenCalledWith(-3);
    expect(result.value).toBe("2022-12-29");
  });

  it("should convert calendarDay(n) to dayjs().add(n, 'day').format('YYYY-MM-DD')", () => {
    const rule = { field: "date", operator: "=", value: "calendarDay(2)" };
    const result = transformVariableDate(rule);
    expect(result.value).toBe("2023-01-03");
  });

  it("should convert calendarDay(-2) to dayjs().add(-2, 'day').format('YYYY-MM-DD')", () => {
    const rule = { field: "date", operator: "=", value: "calendarDay(-2)" };
    const result = transformVariableDate(rule);
    expect(result.value).toBe("2022-12-30");
  });

  it("should return the rule unchanged if value does not match any pattern", () => {
    const rule = { field: "date", operator: "=", value: "2022-12-31" };
    const result = transformVariableDate(rule);
    expect(result).toBe(rule);
  });

  it("should handle edge case: businessDay with invalid number", () => {
    const rule = { field: "date", operator: "=", value: "businessDay(x)" };
    spyGetDateByWorkdayOffset.mockReturnValue(undefined);
    const result = transformVariableDate(rule);
    expect(result.value).toBeUndefined();
  });

  it("should handle edge case: calendarDay with invalid number", () => {
    const rule = { field: "date", operator: "=", value: "calendarDay(x)" };
    const result = transformVariableDate(rule);
    expect(result.value).toBe("Invalid Date");
  });

  it("should not throw if value is not a string", () => {
    const rule = { field: "date", operator: "=", value: 12345 };
    expect(() => transformVariableDate(rule)).not.toThrow();
    expect(transformVariableDate(rule)).toBe(rule);
  });
});
describe("transformAllVariableDates", () => {
  const mockDayjsFormat = (fmt: string) => "2023-01-01";
  const mockDayjsAdd = (days: number, unit: string) => ({
    format: (fmt: string) => `2023-01-0${days + 1}`,
  });
  const mockDayjs = () => ({
    format: mockDayjsFormat,
    add: mockDayjsAdd,
  });
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(new Date("2023-01-01T00:00:00.000Z"));
    vi.doMock("dayjs", () => mockDayjs);
  });

  afterAll(() => {
    vi.useRealTimers();
    vi.resetModules();
    vi.dontMock("dayjs");
  });

  it("should transform $CURRENT_DATE in all rules", () => {
    const group = {
      combinator: "and",
      rules: [
        { field: "date", operator: "=", value: "$CURRENT_DATE" },
        { field: "other", operator: "=", value: "foo" },
      ],
    };
    const result = transformAllVariableDates(group as any);
    expect(result.rules[0].value).toBe("2023-01-01");
    expect(result.rules[1].value).toBe("foo");
  });

  it("should transform businessDay(n) in all rules", () => {
    const group = {
      combinator: "and",
      rules: [
        { field: "date", operator: "=", value: "businessDay(2)" },
        { field: "other", operator: "=", value: "bar" },
      ],
    };
    const result = transformAllVariableDates(group as any);
    expect(result.rules[0].value).toBe("2023-01-03");
    expect(result.rules[1].value).toBe("bar");
  });

  it("should transform calendarDay(n) in all rules", () => {
    const group = {
      combinator: "and",
      rules: [
        { field: "date", operator: "=", value: "calendarDay(3)" },
        { field: "other", operator: "=", value: "baz" },
      ],
    };
    const result = transformAllVariableDates(group as any);
    expect(result.rules[0].value).toBe("2023-01-04");
    expect(result.rules[1].value).toBe("baz");
  });

  it("should handle nested rule groups", () => {
    const group = {
      combinator: "and",
      rules: [
        {
          combinator: "or",
          rules: [
            { field: "date", operator: "=", value: "$CURRENT_DATE" },
            { field: "date2", operator: "=", value: "businessDay(1)" },
          ],
        },
        { field: "other", operator: "=", value: "foo" },
      ],
    };
    const result = transformAllVariableDates(group as any);
    const nested = result.rules[0].rules;
    expect(nested[0].value).toBe("2023-01-01");
    expect(nested[1].value).toBe("2023-01-02");
    expect(result.rules[1].value).toBe("foo");
  });

  it("should not transform rules with non-variable values", () => {
    const group = {
      combinator: "and",
      rules: [
        { field: "date", operator: "=", value: "2022-12-31" },
        { field: "other", operator: "=", value: "plain" },
      ],
    };
    const result = transformAllVariableDates(group as any);
    expect(result.rules[0].value).toBe("2022-12-31");
    expect(result.rules[1].value).toBe("plain");
  });

  it("should handle empty rule group", () => {
    const group = {
      combinator: "and",
      rules: [],
    };
    const result = transformAllVariableDates(group as any);
    expect(result.rules).toEqual([]);
  });

  it("should handle invalid/edge cases gracefully", () => {
    const group = {
      combinator: "and",
      rules: [
        { field: "date", operator: "=", value: "" },
        { field: "date2", operator: "=", value: "calendarDay()" },
        { field: "date3", operator: "=", value: "businessDay()" },
        { field: "date4", operator: "=", value: "calendarDay(x)" },
        { field: "date5", operator: "=", value: "businessDay(x)" },
      ],
    };
    const result = transformAllVariableDates(group as any);
    expect(result.rules[0].value).toBe("");
    expect(result.rules[1].value).toBe("Invalid Date");
    expect(result.rules[2].value).toBe("2023-01-01");
    expect(result.rules[3].value).toBe("Invalid Date");
    expect(result.rules[4].value).toBe("2023-01-01");
  });
});
