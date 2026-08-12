// ItemsUtils.test.ts
import { getIsRequired, copyConfig, getRules } from "./ItemsUtils";

describe("ItemsUtils", () => {
  describe("getIsRequired", () => {
    it("should return the boolean value directly", () => {
      expect(getIsRequired(true)).toBe(true);
      expect(getIsRequired(false)).toBe(false);
    });

    it("should return true only if all sub-values are true", () => {
      const isRequired = {
        key1: { subKey1: true, subKey2: true },
        key2: { subKey1: true, subKey2: true },
      };
      expect(getIsRequired(isRequired)).toBe(true);

      const isRequiredFalse = {
        key1: { subKey1: true, subKey2: false },
        key2: { subKey1: true, subKey2: false },
      };
      expect(getIsRequired(isRequiredFalse)).toBe(false);
    });
  });

  describe("copyConfig", () => {
    it("should return a deep copy of the config array", () => {
      const config = [{ field: 'Field 1', label: "Item 1" }, { field: 'Field 2', label: "Item 2" }];
      const copiedConfig = copyConfig(config);
      expect(copiedConfig).toEqual(config);
      expect(copiedConfig[0]).not.toBe(config[0]);
    });
  });

  describe("getRules", () => {
    it("should filter rules based on isRequiredObj", () => {
      const rules = [
        { ruleId: 1, name: "rule1" },
        { ruleId: 2, name: "rule2" },
      ];
      const isRequiredObj = {
        1: { subKey1: true, subKey2: true },
        2: { subKey1: false, subKey2: true },
      };
      const filteredRules = getRules(rules, isRequiredObj);
      expect(filteredRules).toEqual([{ ruleId: 1, name: "rule1" }]);
    });
  });
});
