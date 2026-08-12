import { hasPermission } from "src/Root/import/ratanutils";

import { checkUserRole, getUserRole } from "./permission";
jest.mock("src/Root/import/ratanutils", () => ({
  hasPermission: jest.fn(),
}));

describe("permission.ts", () => {
  describe("checkUserRole", () => {
    it("should return 'Maker_Checker' when both permissions are true", () => {
      const result = checkUserRole(true, true);
      expect(result).toBe("Maker_Checker");
    });

    it("should return 'Maker' when only hasMakePermission is true", () => {
      const result = checkUserRole(true, false);
      expect(result).toBe("Maker");
    });

    it("should return 'Checker' when only hasCheckPermission is true", () => {
      const result = checkUserRole(false, true);
      expect(result).toBe("Checker");
    });

    it("should return 'Visitor' when both permissions are false", () => {
      const result = checkUserRole(false, false);
      expect(result).toBe("Visitor");
    });
  });
});