import { MonitorEventType } from "../Event/type";
import { emit } from "../Sensor";
import { Station } from "./index";

vi.mock("../../../FeatureFlag/controller", () => {
    return {
        featureScopedEnabled: vi.fn(() => false),
    }
});

it("Station", () => {
    const station = new Station();
    emit(
      {
        name: "test_name",
        type: MonitorEventType.PAGE_VIEW
      },
      []
    );

    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    station.process({
        type: "visibilitychange",
        bubbles: false,
        cancelBubble: false,
        cancelable: false,
        composed: false,
        currentTarget: null,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        returnValue: false,
        srcElement: null,
        target: null,
        timeStamp: 0,
        composedPath: function (): EventTarget[] {
            throw new Error("Function not implemented.");
        },
        initEvent: function (type: string, bubbles?: boolean | undefined, cancelable?: boolean | undefined): void {
            throw new Error("Function not implemented.");
        },
        preventDefault: function (): void {
            throw new Error("Function not implemented.");
        },
        stopImmediatePropagation: function (): void {
            throw new Error("Function not implemented.");
        },
        stopPropagation: function (): void {
            throw new Error("Function not implemented.");
        },
        NONE: 0,
        CAPTURING_PHASE: 1,
        AT_TARGET: 2,
        BUBBLING_PHASE: 3
    });
    station.abortSend();
    station.destory();
});