import { collectData } from "./base";
import { TraceTypes } from "./type";
import { featureScopedEnabled } from "../FeatureFlag/controller";

jest.mock("../FeatureFlag/controller", () => {
    return {
        featureScopedEnabled: jest.fn(() => true),
    }
});

describe('analysis base', () => {
    it("collectData v2", () => {
        jest.mocked(featureScopedEnabled).mockImplementation(jest.fn(() => true));
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
        jest.mocked(featureScopedEnabled).mockImplementation(jest.fn(() => false));
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