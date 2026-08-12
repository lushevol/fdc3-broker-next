import { fn, renderHook } from "@Test/test-utils";

import { useVersionGuard } from "./index";

vi.mock("../common/utils/featureFlagController", () => {
    return {
        featureScopedEnabled: () => true,
    }
});

vi.mock("../../../package.json", () => {
    return {
        __esModule: true,
        version: "version1",
    }
}, {
    virtual: true
});

describe('useVersionGuard', () => {
    it("useVersionGuard", () => {
        const mockVersionContent = fn(() => Promise.resolve({ version: "version1" }));
        vi.spyOn(window, "fetch").mockImplementation(() => {
            return Promise.resolve({
              ok: true,
              json: mockVersionContent,
            }) as unknown as Promise<Response>;
        });
        renderHook(() => useVersionGuard());
    });
});