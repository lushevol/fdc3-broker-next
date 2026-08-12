import { antdSelectSearchFilterOption } from "./utils";

describe("antdSelectSearchFilterOption", () => {
    it("should return true if input matches option label", () => {
        const result = antdSelectSearchFilterOption("test", {
            label: "Test Label",
            value: "test-value",
        });
        expect(result).toBe(true);
    });

    it("should return true if input matches option value", () => {
        const result = antdSelectSearchFilterOption("value", {
            label: "Test Label",
            value: "test-value",
        });
        expect(result).toBe(true);
    });

    it("should return false if input does not match label or value", () => {
        const result = antdSelectSearchFilterOption("nomatch", {
            label: "Test Label",
            value: "test-value",
        });
        expect(result).toBe(false);
    });

    it("should handle undefined option gracefully", () => {
        const result = antdSelectSearchFilterOption("test", undefined);
        expect(result).toBe(false);
    });
});