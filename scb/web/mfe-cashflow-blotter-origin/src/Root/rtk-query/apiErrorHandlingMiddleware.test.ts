import { AnyAction } from "@reduxjs/toolkit";

import { CommonUtil } from "../import";
import { logger } from "../import/ratanutils";
import { apiErrorHandlingMiddleware } from "./apiErrorHandlingMiddleware";

jest.mock("../import", () => ({
    CommonUtil: {
        showErrorMsg: jest.fn(),
    },
}));

jest.mock("../import/ratanutils", () => ({
    logger: {
        error: jest.fn(),
    },
}));

describe("apiErrorHandlingMiddleware", () => {
    const next = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call showErrorMsg and logger.error when action type is 'graphqlApi/executeQuery/rejected'", async () => {
        const action: AnyAction = {
            type: "graphqlApi/executeQuery/rejected",
            payload: { stack: "Test error message" },
        };

        const middlewareAPI = {
            getState: jest.fn(),
            dispatch: jest.fn(),
        };

        await apiErrorHandlingMiddleware.middleware(middlewareAPI)(next)(action);

        expect(CommonUtil.showErrorMsg).toHaveBeenCalledWith("Test error message");
        expect(logger.error).toHaveBeenCalledWith("Test error message");
        expect(next).toHaveBeenCalledWith(action);
    });

    it("should not call showErrorMsg or logger.error for other action types", async () => {
        const action: AnyAction = {
            type: "someOtherAction",
            payload: { stack: "Test error message" },
        };

        const middlewareAPI = {
            getState: jest.fn(),
            dispatch: jest.fn(),
        };

        await apiErrorHandlingMiddleware.middleware(middlewareAPI)(next)(action);

        expect(CommonUtil.showErrorMsg).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(action);
    });
});