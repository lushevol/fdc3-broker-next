import { RatanAnalysis2SingleUIBffAnalyze } from "./convertor";
import { TraceTypes } from "./type";
import { ItemType } from "./v2/Item/type";

describe('analysis convertor', () => {
    it("RatanAnalysis2SingleUIBffAnalyze should be work", () => {
        const convertedData = RatanAnalysis2SingleUIBffAnalyze({
            name: "test name",
            type: TraceTypes.PERF,
            datas: [
                {
                    tag: "test datas name",
                    value: "test datas value",
                }
            ],
            traceId: "123-456",
            container: "test_container",
            tile: "test_tile",
            createdAt: "2019-03-06T08:00:00+08:00",
            userName: "test_name",
            userRatanProfile: "test_profile",
            userUID: "test_uid",
            userTimezoneOffset: "-8",
            itemType: ItemType.Block,
            itemPath: "test_path",
        });

        expect(convertedData).toStrictEqual({
            event: TraceTypes.PERF,
            key: "123-456",
            container: "test_container",
            tile: "test_tile",
            name: "test name",
            value: "2019-03-06T08:00:00+08:00",
            attribute1: "test datas name",
            attribute2: "test datas value",
            attribute12: undefined,
            attribute13: undefined,
            attribute14: "Perf",
            attribute15: "Block",
            attribute16: "test_path",
            attribute17: "-8",
            attribute18: "test_profile",
            attribute19: "test_uid",
            attribute20: "test_name",
        });
    });
});