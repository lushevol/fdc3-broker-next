import { act, renderHook } from "@Test/test-utils";

import { useExtraForm } from "./useExtraForm";

afterAll(() => {
  vi.clearAllMocks();
});

const mockFormPayload = {
  comment: "test comment",
};

describe("useExtraForm - initial state", () => {
  it("should expose extraFormRef", () => {
    const { result } = renderHook(() => useExtraForm());
    expect(result.current.extraFormRef).toBeDefined();
  });

  it("should initialize extraFormRef.current as null", () => {
    const { result } = renderHook(() => useExtraForm());
    expect(result.current.extraFormRef.current).toBeNull();
  });

  it("should expose submitExtraForm as function", () => {
    const { result } = renderHook(() => useExtraForm());
    expect(typeof result.current.submitExtraForm).toBe("function");
  });
});

describe("useExtraForm - submitExtraForm", () => {
  it("should return undefined when extraFormRef.current is null", async () => {
    const { result } = renderHook(() => useExtraForm());

    let response: any;
    await act(async () => {
      response = await result.current.submitExtraForm();
    });

    expect(response).toBeUndefined();
  });

  it("should call extraFormRef.current.submit when ref is attached", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(mockFormPayload);
    const { result } = renderHook(() => useExtraForm());

    Object.defineProperty(result.current.extraFormRef, "current", {
      value: { submit: mockSubmit },
      writable: true,
    });

    let response: any;
    await act(async () => {
      response = await result.current.submitExtraForm();
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(response).toEqual(mockFormPayload);
  });

  it("should return form data when extraFormRef.current.submit resolves", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(mockFormPayload);
    const { result } = renderHook(() => useExtraForm());

    Object.defineProperty(result.current.extraFormRef, "current", {
      value: { submit: mockSubmit },
      writable: true,
    });

    let response: any;
    await act(async () => {
      response = await result.current.submitExtraForm();
    });

    expect(response).toEqual(mockFormPayload);
    expect(response.comment).toBe("test comment");
  });

  it("should return undefined when extraFormRef.current.submit resolves undefined", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useExtraForm());

    Object.defineProperty(result.current.extraFormRef, "current", {
      value: { submit: mockSubmit },
      writable: true,
    });

    let response: any;
    await act(async () => {
      response = await result.current.submitExtraForm();
    });

    expect(response).toBeUndefined();
  });

  it("should keep extraFormRef referentially stable across renders", () => {
    const { result, rerender } = renderHook(() => useExtraForm());
    const firstRef = result.current.extraFormRef;
    rerender();
    expect(result.current.extraFormRef).toBe(firstRef);
  });
});
