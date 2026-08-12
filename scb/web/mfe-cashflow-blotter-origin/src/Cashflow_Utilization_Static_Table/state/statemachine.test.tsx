import { guards } from "./statemachine";
import { StateContext } from "./types";

describe("statemachine", () => {
  it("guards should works", () => {
    const mockContext: StateContext = {
      userId: "123456",
      userRole: "Maker",
      makerId: "123456",
    };
    expect(guards.isMaker({ context: mockContext })).toBe(true);
    expect(guards.isChecker({ context: mockContext })).toBe(false);

    const mockContext2: StateContext = {
      userId: "123456",
      userRole: "Checker",
      makerId: "123456",
    };
    expect(guards.isMaker({ context: mockContext2 })).toBe(false);
    expect(guards.isChecker({ context: mockContext2 })).toBe(false);

    const mockContext2_2: StateContext = {
      userId: "123456",
      userRole: "Checker",
      makerId: "123456",
    };
    expect(guards.isMaker({ context: mockContext2_2 })).toBe(false);
    expect(guards.isChecker({ context: mockContext2_2 })).toBe(false);

    const mockContext3: StateContext = {
      userId: "123456",
      userRole: "Maker_Checker",
      makerId: "123456",
    };
    expect(guards.isMaker({ context: mockContext3 })).toBe(true);
    expect(guards.isChecker({ context: mockContext3 })).toBe(false);

    const mockContext4: StateContext = {
      userId: "123456",
      userRole: "Maker_Checker",
      makerId: "654321",
    };
    expect(guards.isMaker({ context: mockContext4 })).toBe(true);
    expect(guards.isChecker({ context: mockContext4 })).toBe(true);

    const mockContext5: StateContext = {
      userId: "123456",
      userRole: "Visitor",
      makerId: "123456",
    };
    expect(guards.isMaker({ context: mockContext5 })).toBe(false);
    expect(guards.isChecker({ context: mockContext5 })).toBe(false);
  });
});
