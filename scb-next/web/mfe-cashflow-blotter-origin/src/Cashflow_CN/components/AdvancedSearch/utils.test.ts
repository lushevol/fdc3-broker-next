import { hydrate } from "src/Root/import/ratancomponents";
import { isEmpty } from "src/Root/import/ratanutils";

import { FilterRecord } from "./types";
import { validateAdvancedFilter } from "./utils";

const mockHydrate = hydrate as vi.Mock;

describe("validateAdvancedFilter", () => {
  it("should return valid true if all mandatory fields are present and operators are valid", () => {
    const filterRecord: FilterRecord = {
      body: JSON.stringify({
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
          { field: "Entity.Booking_Entity_SCI_FMID", operator: "=", value: "A" },
          { field: "Cashflow.Cashflow_State", operator: "=", value: "ACTIVE" },
        ],
        combinator: "and",
      }),
    } as any;
    mockHydrate.mockReturnValueOnce(JSON.parse(filterRecord.body));
    expect(validateAdvancedFilter(filterRecord)).toEqual({ valid: true });
  });

  it("should return valid false and warningMsg if mandatory fields are missing", () => {
    const filterRecord: FilterRecord = {
      body: JSON.stringify({
        rules: [
          { field: "Cashflow.Payment_Date", operator: "=", value: "2024-01-01" },
        ],
        combinator: "and",
      }),
    } as any;
    mockHydrate.mockReturnValueOnce(JSON.parse(filterRecord.body));
    const result = validateAdvancedFilter(filterRecord);
    expect(result.valid).toBe(false);
    expect(result.warningMsg).toMatch(/Please fill in: Cashflow State, Booking Entity./);
  });

  it("should return valid false and warningMsg if operator is invalid", () => {

    const filterRecord: FilterRecord = {
      body: JSON.stringify({
        rules: [
          { field: "Cashflow.Payment_Date", operator: "LIKE", value: "2024-01-01" },
          { field: "Entity.Booking_Entity_SCI_FMID", operator: "=", value: "A" },
          { field: "Cashflow.Cashflow_State", operator: "=", value: "ACTIVE" },
        ],
        combinator: "and",
      }),
    } as any;
    mockHydrate.mockReturnValueOnce(JSON.parse(filterRecord.body));
    const result = validateAdvancedFilter(filterRecord);
    expect(result.valid).toBe(false);
    expect(result.warningMsg).toMatch(/Operator for "Payment Date" is invalid/);
  });
  it("should return valid true when param is null", () => {
    vi.spyOn(require("src/Root/import/ratanutils"), "isEmpty").mockReturnValue(true);
    const result = validateAdvancedFilter(null);
    expect(result.valid).toBe(true);
  })
});