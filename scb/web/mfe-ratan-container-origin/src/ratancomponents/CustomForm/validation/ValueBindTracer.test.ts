import { isRegExp, string2RegExp } from "./ValueBindTracer";

describe("test regexp expressions", () => {
    it("isRegExp should work as expected", () => {
        expect(isRegExp("/abc/")).toBe(true);
        expect(isRegExp("abc")).toBe(false);
        expect(isRegExp("/abc")).toBe(false);
        expect(isRegExp("/abc/ig")).toBe(true);
        expect(isRegExp("/^(.+)$/")).toBe(true);
    });
    it("string2RegExp should work as expected", () => {
        expect(string2RegExp("/abc|def/i").test("ABC")).toBe(true);
    });
})