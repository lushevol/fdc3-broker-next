import { collectData } from "./base";
import { TraceTypes } from "./type";
import { featureScopedEnabled } from "../FeatureFlag/controller";

vi.mock("../FeatureFlag/controller", () => {
    return {
        featureScopedEnabled: vi.fn(() => true),
    }
});

describe('analysis base', () => {
    it("collectData v2", () => {
        vi.mocked(featureScopedEnabled).mockImplementation(vi.fn(() => true));
        const res = collectData({
            name: "test name",
            type: TraceTypes.PERF,
            datas: [
                {
                    tag: "test datas name",
                    value: "test datas value",
                }
            ]
        });

        expect(res).toBeUndefined();
    });
    it("collectData v1", () => {
        vi.mocked(featureScopedEnabled).mockImplementation(vi.fn(() => false));
        const res = collectData({
            name: "test name",
            type: TraceTypes.PERF,
            datas: [
                {
                    tag: "test datas name",
                    value: "test datas value",
                }
            ]
        });

        expect(res).toBeDefined();
    });
});