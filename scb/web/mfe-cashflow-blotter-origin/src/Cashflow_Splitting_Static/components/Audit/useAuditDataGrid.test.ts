import { act, renderHook } from "@testing-library/react";
import { useLazyQueryStaticRuleAuditListQuery } from "src/Cashflow_Splitting_Static/services/api";
import {
    useAppDispatch,
    useAppSelector,
} from "src/Cashflow_Splitting_Static/store";

import { useAuditDataGrid } from "./useAuditDataGrid";

jest.mock("src/Cashflow_Splitting_Static/store", () => ({
    useAppDispatch: jest.fn(),
    useAppSelector: jest.fn(),
}));
jest.mock("src/Cashflow_Splitting_Static/store/pagination.slice", () => ({
    setAuditTablePageNo: jest.fn(),
    setAuditTablePageSize: jest.fn(),
}));
jest.mock("src/Cashflow_Splitting_Static/services/api", () => ({
    useLazyQueryStaticRuleAuditListQuery: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockAuditTablePagination = { pageSize: 20, pageNo: 1 };
const mockQueryAuditList = jest.fn();


describe("useAuditDataGrid", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(useAppDispatch).mockReturnValue(mockDispatch);
        jest.mocked(useAppSelector).mockReturnValue(mockAuditTablePagination);
        jest.mocked(useLazyQueryStaticRuleAuditListQuery).mockReturnValue([
            mockQueryAuditList,
            {},
            {
                lastArg: {
                    page: 0,
                    size: 0,
                    ruleUniqueId: undefined
                }
            }
        ]);
    });

    it("should return correct default values", () => {
        const { result } = renderHook(() => useAuditDataGrid("test-id"));
        expect(result.current.gridOptions.suppressRowClickSelection).toBe(true);
        expect(typeof result.current.onPaginationChange).toBe("function");
        expect(result.current.auditTablePagination).toEqual(mockAuditTablePagination);
        expect(result.current.serverSideDatasource).toBeDefined();
    });

    it("should call dispatch on onPaginationChange", () => {
        const { result } = renderHook(() => useAuditDataGrid());
        const mockApi = {
            paginationGetPageSize: jest.fn().mockReturnValue(50),
            paginationGetCurrentPage: jest.fn().mockReturnValue(2),
        };
        const mockEvent = { api: mockApi };
        act(() => {
            result.current.onPaginationChange(mockEvent as any);
        });
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
    it("should call success on getRows with data", async () => {
        const { result } = renderHook(() => useAuditDataGrid("entity-id"));
        mockQueryAuditList.mockResolvedValue({
            data: { results: [{ id: 1 }], totalHits: 10 },
        });
        const success = jest.fn();
        const fail = jest.fn();
        const params = {
            api: {
                paginationGetCurrentPage: jest.fn().mockReturnValue(3),
                paginationGetPageSize: jest.fn().mockReturnValue(100)
            },
            success,
            fail,
        };
        await act(async () => {
            await result.current.serverSideDatasource.getRows(params as any);
        });
        expect(success).toHaveBeenCalledWith({
            rowData: [{ id: 1 }],
            rowCount: 10,
        });
        expect(fail).not.toHaveBeenCalled();
    });
    it("should call fail on getRows when query fails", async () => {
        const { result } = renderHook(() => useAuditDataGrid("entity-id"));
        mockQueryAuditList.mockRejectedValue(new Error("fail"));
        const success = jest.fn();
        const fail = jest.fn();
        const params = {
            api: { paginationGetCurrentPage: jest.fn().mockReturnValue(3), paginationGetPageSize: jest.fn().mockReturnValue(100) },
            success,
            fail,
        };
        await act(async () => {
            await result.current.serverSideDatasource.getRows(params as any);
        });
        expect(fail).toHaveBeenCalled();
        expect(success).not.toHaveBeenCalled();
    });
    it("should handle getRows with undefined data", async () => {
        const { result } = renderHook(() => useAuditDataGrid("entity-id"));
        mockQueryAuditList.mockResolvedValue({});
        const success = jest.fn();
        const fail = jest.fn();
        const params = {
            api: { paginationGetCurrentPage: jest.fn().mockReturnValue(3), paginationGetPageSize: jest.fn().mockReturnValue(100) },
            success,
            fail,
        };
        await act(async () => {
            await result.current.serverSideDatasource.getRows(params as any);
        });
        expect(success).toHaveBeenCalledWith({
            rowData: [],
            rowCount: 0,
        });
    });
    it("should update paginationPageSizeSelector when size changes", () => {
        // mock selector with different size
        jest.mocked(require("src/Cashflow_Splitting_Static/store").useAppSelector).mockImplementation(
            fn => fn({ auditTablePagination: { size: 100 } })
        );
        const { result } = renderHook(() => useAuditDataGrid("test-id"));
        expect(result.current.paginationPageSizeSelector).toEqual([100]);
    });
});