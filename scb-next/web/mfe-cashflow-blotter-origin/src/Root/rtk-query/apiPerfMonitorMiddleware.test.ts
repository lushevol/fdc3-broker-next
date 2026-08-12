import { AnyAction } from "@reduxjs/toolkit";

import { emit, MonitorEventSubType, MonitorEventType } from "../analysis";
import { apiPerfMonitorMiddleware } from "./apiPerfMonitorMiddleware";

vi.mock("../analysis", () => ({
    emit: vi.fn(),
    MonitorEventType: { PERF: "PERF" },
    MonitorEventSubType: { RTT: "RTT" },
}));

describe("apiPerfMonitorMiddleware", () => {
    let next: vi.Mock;
    let store: { dispatch: vi.Mock; getState: vi.Mock };

    beforeEach(() => {
        next = vi.fn();
        store = { dispatch: vi.fn(), getState: vi.fn() };
        vi.clearAllMocks();
    });

    it("should store the requestId and timestamp on pending action", async () => {
        const action: AnyAction = {
            type: "graphqlApi/executeQuery/pending",
            meta: { requestId: "123", startedTimeStamp: 1000 },
        };

        apiPerfMonitorMiddleware.middleware(store)(next)(action);

        expect(next).toHaveBeenCalledWith(action);
    });

    it("should emit performance data on fulfilled action", async () => {
        const pendingAction: AnyAction = {
            type: "graphqlApi/executeQuery/pending",
            meta: { requestId: "123", startedTimeStamp: 1000 },
        };

        const fulfilledAction: AnyAction = {
            type: "graphqlApi/executeQuery/fulfilled",
            meta: {
                requestId: "123",
                arg: { endpointName: "testEndpoint", originalArgs: { key: "value" } },
                fulfilledTimeStamp: 2000,
            },
        };

        apiPerfMonitorMiddleware.middleware(store)(next)(pendingAction);
        apiPerfMonitorMiddleware.middleware(store)(next)(fulfilledAction);

        expect(emit).toHaveBeenCalledWith(
            {
                name: "testEndpoint",
                type: MonitorEventType.PERF,
                subType: MonitorEventSubType.RTT,
            },
            [
                { tag: "Response Time (ms)", value: "1000" },
                { tag: "API Type", value: "graphql" },
                { tag: "Payload", value: JSON.stringify({ key: "value" }) },
            ]
        );
    });

    it("should not emit if requestId is not found", async () => {
        const fulfilledAction: AnyAction = {
            type: "graphqlApi/executeQuery/fulfilled",
            meta: {
                requestId: "unknown",
                arg: { endpointName: "testEndpoint", originalArgs: { key: "value" } },
                fulfilledTimeStamp: 2000,
            },
        };

        apiPerfMonitorMiddleware.middleware(store)(next)(fulfilledAction);

        expect(emit).not.toHaveBeenCalled();
    });
});