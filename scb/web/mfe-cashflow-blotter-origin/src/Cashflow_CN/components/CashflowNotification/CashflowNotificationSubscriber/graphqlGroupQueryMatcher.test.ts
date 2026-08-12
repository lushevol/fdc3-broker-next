import { RuleGroupType } from "react-querybuilder";

import { matchQueries } from "./graphqlGroupQueryMatcher";

describe("matchQueries", () => {
  const sampleData = [
    { id: 1, name: "John", age: 30, date: "2023-06-15" },
    { id: 2, name: "Jane", age: 25, date: "2023-06-14" },
    { id: 3, name: "Doe", age: 35, date: "2023-06-16" },
  ];

  it("should filter data correctly with 'and' combinator and matching rules", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [
        { field: "age", operator: "GTE", value: 30 },
        { field: "date", operator: "ONORLATER", value: "2023-06-15" },
      ],
    };

    const [filtered, dropped] = matchQueries(sampleData, filters);
    expect(filtered).toEqual([
      { id: 1, name: "John", age: 30, date: "2023-06-15" },
      { id: 3, name: "Doe", age: 35, date: "2023-06-16" },
    ]);
    expect(dropped).toEqual([
      { id: 2, name: "Jane", age: 25, date: "2023-06-14" },
    ]);
  });

  it("should filter data correctly with 'or' combinator and matching rules", () => {
    const filters: RuleGroupType = {
      combinator: "or",
      rules: [
        { field: "age", operator: "LTE", value: 25 },
        { field: "date", operator: "ONORLATER", value: "2023-06-16" },
      ],
    };

    const [filtered, dropped] = matchQueries(sampleData, filters);
    expect(filtered).toEqual([
      { id: 2, name: "Jane", age: 25, date: "2023-06-14" },
      { id: 3, name: "Doe", age: 35, date: "2023-06-16" },
    ]);
    expect(dropped).toEqual([{ id: 1, name: "John", age: 30, date: "2023-06-15" }]);
  });

  it("should return all data as filtered when no rules are provided", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [],
    };

    const [filtered, dropped] = matchQueries(sampleData, filters);
    expect(filtered).toEqual(sampleData);
    expect(dropped).toEqual([]);
  });

  it("should handle nested rule groups correctly", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [
        {
          combinator: "or",
          rules: [
            { field: "age", operator: "EQ", value: 30 },
            { field: "name", operator: "EQ", value: "Jane" },
          ],
        },
        { field: "date", operator: "ONORLATER", value: "2023-06-15" },
      ],
    };

    const [filtered, dropped] = matchQueries(sampleData, filters);
    expect(filtered).toEqual([{ id: 1, name: "John", age: 30, date: "2023-06-15" }]);
    expect(dropped).toEqual([
      { id: 2, name: "Jane", age: 25, date: "2023-06-14" },
      { id: 3, name: "Doe", age: 35, date: "2023-06-16" },
    ]);
  });

  it("should handle invalid data gracefully", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [{ field: "nonexistent", operator: "EQ", value: "test" }],
    };

    const [filtered, dropped] = matchQueries(sampleData, filters);
    expect(filtered).toEqual([]);
    expect(dropped).toEqual(sampleData);
  });

  it("should handle empty data array", () => {
    const filters: RuleGroupType = {
      combinator: "and",
      rules: [{ field: "age", operator: "GTE", value: 30 }],
    };

    const [filtered, dropped] = matchQueries([], filters);
    expect(filtered).toEqual([]);
    expect(dropped).toEqual([]);
  });
});