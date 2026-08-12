import { isOpneSearchQuery,SettlementCashflowDataUltraQueryDocument } from "./ultra-cashflow-query.generated";

describe("SettlementCashflowDataUltraQueryDocument", () => {
  it("should generate the correct query for opensearch=false", () => {
    const fields = ["fieldA", "fieldB"];
    const query = SettlementCashflowDataUltraQueryDocument({
      fields,
      opensearch: false,
    });

    expect(query).toContain("SettlementCashflowDataUltraQuery");
    expect(query).toContain("cashflowUltraQuery");
  });

  it("should generate the correct query for opensearch=true", () => {
    const fields = ["fieldX", "fieldY"];
    const query = SettlementCashflowDataUltraQueryDocument({
      fields,
      opensearch: true,
    });

    expect(query).toContain("SettlementCashflowUltraQueryByOpensearch");
    expect(query).toContain("cashflowUltraQueryByOpensearch");
  });
});

describe("isOpneSearchQuery", () => {
    it("should return true when param is true", () => {
        const res = {
            "cashflowUltraQueryByOpensearch": {
                "totalResult": 0,
                "pageIndex": 0,
                "itemsPerPage": 1000,
                "lastPage": true,
                "results": []
            }
        }
      const result = isOpneSearchQuery(res, true);
      expect(result).toBe(true);
    });
  
    it("should return false when param is false", () => {
      const result = isOpneSearchQuery({}, false);
      expect(result).toBe(false);
    });
});