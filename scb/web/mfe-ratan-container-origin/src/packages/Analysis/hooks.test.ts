import { renderHook } from "@testing-library/react";
import { trackPerformance, usePageView, useBatchCollect, useDisplayResolution, useE2Elatency, useIterableCollect, useTimeCost, useRTT, useBatchCollectWithCount } from "./hooks";
import { E2ELatencyStoreWrap } from "./context";

beforeEach(() => {
  window.performance.mark = jest.fn();
  window.performance.clearMarks = jest.fn();
  window.performance.measure = jest.fn(() => ({
    duration: 0,
    detail: null,
    entryType: "",
    name: "",
    startTime: 0,
    toJSON: jest.fn(),
  }));
  window.performance.clearMeasures = jest.fn();
  window.performance.now = jest.fn(() => Math.random() * 100);
});

describe('useAnalysis', () => {
  it("trackPerformance", () => {
    const [id, done] = trackPerformance();
    expect(typeof id).toBe("string");
    const { duration } = done();
    expect(typeof duration).toBe("number");
  });
  it("useRTT", () => {
    const { result } = renderHook(() => useRTT());
    const { startTracking } = result.current;
    const { completeTracking } = startTracking();
    expect(completeTracking({ name: "test" })).toBeUndefined();
  });
  it("useTimeCost", () => {
    const { result } = renderHook(() => useTimeCost());
    const { startTracking } = result.current;
    const { completeTracking } = startTracking();
    expect(completeTracking({ name: "test" })).toBeUndefined();
  });
  it("useDisplayResolution", () => {
    const { result } = renderHook(() => useDisplayResolution());
    expect(result.current).toBeUndefined();
  });
  it("usePageView", () => {
    const { result } = renderHook(() => usePageView());
    expect(result.current).toBeUndefined();
  });
  it("useIterableCollect", () => {
    const { result } = renderHook(() => useIterableCollect());
    const { startTracking } = result.current;
    const next = startTracking("test name");
    const { complete } = next("test action");
    expect(complete()).toBeUndefined();
  });
  it("useBatchCollect", () => {
    const { result } = renderHook(() => useBatchCollect());
    const { startTracking } = result.current;
    const complete = startTracking("test name");
    expect(complete(["test action 1", "test action 2"])).toBeUndefined();
  });
  it("useBatchCollectWithCount", () => {
    const { result } = renderHook(() => useBatchCollectWithCount());
    const { startTracking } = result.current;
    const complete = startTracking("test name");
    expect(complete(["test action 1", "test action 2"])).toBeUndefined();
  });
  it("useE2Elatency", () => {
    const { result } = renderHook(() => useE2Elatency("test"), { wrapper: E2ELatencyStoreWrap });
    const { initTrackingPoints, addTrackingPoint, completeTracking, abortTracking } = result.current;
    expect(initTrackingPoints(true)).toBeUndefined();
    expect(addTrackingPoint("test tag")).toBeUndefined();
    expect(completeTracking()).toBeUndefined();
    expect(abortTracking()).toBeUndefined();
  });
});