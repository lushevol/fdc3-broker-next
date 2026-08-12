import { actionConfirmation, flattenKeys,getDiff } from "./index";

describe("actionConfirmation", () => {
    it("should call modal.confirm with correct params and return confirmed value", async () => {
        const mockConfirm = vi.fn().mockResolvedValue(true);
        const mockModal = { confirm: mockConfirm };

        const result = await actionConfirmation(mockModal as any, "delete");
        expect(mockConfirm).toHaveBeenCalledWith({
            title: "Warning",
            content: "Are you sure to delete this rule ?",
            okText: "Confirm",
            cancelText: "Dismiss",
            getContainer: false,
            centered: true,
            width: 450,
        });
        expect(result).toBe(true);
    });

    it("should return false when modal.confirm resolves to false", async () => {
        const mockConfirm = vi.fn().mockResolvedValue(false);
        const mockModal = { confirm: mockConfirm };

        const result = await actionConfirmation(mockModal as any, "update");
        expect(result).toBe(false);
    });

        it("getDiff", () => {
        const res = getDiff({ a: 1 }, { a: 2 });
        expect(res).toStrictEqual({ a: 2 });
        const res2 = getDiff({ b: 1 }, { b: 1 });
        expect(res2).toStrictEqual({});
        const obj1 = { a: 1, b: { c: 2, d: { e: 3 } } };
        const obj2 = { a: 2, b: { c: 2, d: { e: 4 } } };
        const res3 = getDiff(obj1, obj2);
        expect(res3).toStrictEqual({ a: 2, b: { d: { e: 4 } } });
    });
    it("flattenKeys ", () => {
        const res = flattenKeys({ a: 1, b: { c: 2, d: { e: 3 } } });
        expect(res).toStrictEqual(["a", "b.c", "b.d.e"]);
    });
});