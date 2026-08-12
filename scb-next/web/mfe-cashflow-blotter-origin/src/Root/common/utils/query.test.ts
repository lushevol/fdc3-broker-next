import { legacyFilters2Query } from "./query";

describe('query', () => {
    it("legacyFilters2Query", () => {
        const res = legacyFilters2Query([{
            field: "test",
            operator: "EQ",
            values: "123",
        }]);
        expect(res).toStrictEqual({
            combinator: "and",
            rules: [
                {
                    field: "test",
                    operator: "=",
                    value: "123",
                }
            ]
        });
    });
});