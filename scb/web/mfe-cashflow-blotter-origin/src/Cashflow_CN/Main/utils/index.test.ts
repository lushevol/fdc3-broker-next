import { emptyOrNilOptional,flattenKeys, formatterBooleanValue, generateRandomString,getDiff, label2id, nettingSuccessUpdateCashflowByNettingId, transformVagueBoolean } from "./index";

describe("utils", () => {
    it("nettingSuccessUpdateCashflowByNettingId", async () => {
        const mockDispatch = jest.fn();
        const res = await nettingSuccessUpdateCashflowByNettingId([], { dispatch: mockDispatch });
        expect(res).not.toBeNull();
    });
    it("formatterBooleanValue", () => {
        const res = formatterBooleanValue("true");
        expect(res).toBe("Yes");
        const res2 = formatterBooleanValue("false");
        expect(res2).toBe("No");
        const res3 = formatterBooleanValue("other");
        expect(res3).toBe("other");
    });
    it("label2id", () => {
        const res = label2id("Test.Label", "prefix");
        expect(res).toBe("prefix-test_label");
        const res2 = label2id("Test.Label");
        expect(res2).toBe("test_label");
    });
    it("transformVagueBoolean", () => {
        const res = transformVagueBoolean("true");
        expect(res).toBe(true);
        const res2 = transformVagueBoolean("false");
        expect(res2).toBe(false);
        const res3 = transformVagueBoolean(true);
        expect(res3).toBe(true);
        const res4 = transformVagueBoolean(0);
        expect(res4).toBe(false);
        const res5 = transformVagueBoolean("1");
        expect(res5).toBe(true);
        const res6 = transformVagueBoolean("0");
        expect(res6).toBe(false);
        const res7 = transformVagueBoolean(123);
        expect(res7).toBe(true);
    });
    it("getDiff", () => {
        const res = getDiff({a:1}, {a:2});
        expect(res).toStrictEqual({a:2});
        const res2 = getDiff({b:1}, {b:1});
        expect(res2).toStrictEqual({});
        const obj1 = { a: 1, b: { c: 2, d: { e: 3 } } };
        const obj2 = { a: 2, b: { c: 2, d: { e: 4 } } };
        const res3 = getDiff(obj1, obj2);
        expect(res3).toStrictEqual({ a: 2, b: { d: { e: 4 } } });
    });
    it("flattenKeys ", () => {
        const res = flattenKeys ({ a: 1, b: { c: 2, d: { e: 3 } } });
        expect(res).toStrictEqual(["a", "b.c", "b.d.e"]);
    });
    it("generateRandomString", () => {
        const res = generateRandomString();
        expect(res.length).toBeGreaterThan(6);
    });
    it("emptyOrNilOptional", () => {
        const res1 = emptyOrNilOptional("", "default");
        expect(res1).toBe("default");
      
        const res2 = emptyOrNilOptional(null, "default");
        expect(res2).toBe("default");
      
        const res3 = emptyOrNilOptional(undefined, "default");
        expect(res3).toBe("default");
      
        const res4 = emptyOrNilOptional("value", "default");
        expect(res4).toBe("value");
      
        const res5 = emptyOrNilOptional(0, "default");
        expect(res5).toBe(0);
      
        const res6 = emptyOrNilOptional(false, "default");
        expect(res6).toBe(false);
      });
})