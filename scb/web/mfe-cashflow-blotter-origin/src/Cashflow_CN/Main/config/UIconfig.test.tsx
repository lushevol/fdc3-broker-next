import { getDateHorizon } from "./UIconfig";

describe("getDateHorizon", () => {
  it("should return an array of two dates when offset is a positive number", () => {
    const offset = 3;
    const result = getDateHorizon(offset);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result?.length).toBe(2);
    expect(result?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result?.[1]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should return a single date when offset is 'today'", () => {
    const offset = "today";
    const result = getDateHorizon(offset);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should return a single date when offset is 'tomorrow'", () => {
    const offset = "tomorrow";
    const result = getDateHorizon(offset);

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("should return null when offset is not a number or a valid string", () => {
    const offset = "invalid";
    const result = getDateHorizon(offset);

    expect(result).toBeNull();
  });
});