import { act,renderHook } from "@testing-library/react";
import { useSelector } from "react-redux";

import { useGridFilterChanged } from "./useGridFilterChanged";

vi.mock("react-redux", () => ({
    useSelector: vi.fn(),
}));

describe("useGridFilterChanged", () => {
    let mockApi: any;
    let mockState: any;

    beforeEach(() => {
        mockApi = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            getDisplayedRowCount: vi.fn(),
        };

        mockState = {
            groupBlotter: {
                blotterGridEvent: { api: mockApi },
                blotterPagination: { totalHits: 100 },
            },
        };

        (useSelector as vi.Mock).mockImplementation((selector) => selector(mockState));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("should return the initial displayRowsCount", () => {
        mockApi.getDisplayedRowCount.mockReturnValue(10);

        const { result } = renderHook(() => useGridFilterChanged());

        expect(result.current.displayRowsCount).toBe(10);
        expect(mockApi.getDisplayedRowCount).toHaveBeenCalledTimes(1);
    });

    it("should update displayRowsCount when filterChanged event is triggered", () => {
        mockApi.getDisplayedRowCount.mockReturnValueOnce(10).mockReturnValueOnce(20);

        const { result } = renderHook(() => useGridFilterChanged());

        expect(result.current.displayRowsCount).toBe(10);

        act(() => {
            const filterChangedCallback = mockApi.addEventListener.mock.calls[0][1];
            filterChangedCallback(); // Simulate filterChanged event
        });

        expect(result.current.displayRowsCount).toBe(20);
        expect(mockApi.getDisplayedRowCount).toHaveBeenCalledTimes(2);
    });

    it("should clean up event listener on unmount", () => {
        const { unmount } = renderHook(() => useGridFilterChanged());

        unmount();

        expect(mockApi.removeEventListener).toHaveBeenCalledWith(
            "filterChanged",
            expect.any(Function)
        );
    });

    it("should handle missing api gracefully", () => {
        mockState.groupBlotter.blotterGridEvent.api = null;

        const { result } = renderHook(() => useGridFilterChanged());

        expect(result.current.displayRowsCount).toBe(0);
        expect(mockApi.addEventListener).not.toHaveBeenCalled();
        expect(mockApi.removeEventListener).not.toHaveBeenCalled();
    });

    it("should handle missing totalHits gracefully", () => {
        mockState.groupBlotter.blotterPagination.totalHits = undefined;

        const { result } = renderHook(() => useGridFilterChanged());

        expect(result.current.displayRowsCount).toBe(0);
    });

    it("should handle api.getDisplayedRowCount returning undefined", () => {
        mockApi.getDisplayedRowCount.mockReturnValue(undefined);

        const { result } = renderHook(() => useGridFilterChanged());

        expect(result.current.displayRowsCount).toBe(0);
    });
});