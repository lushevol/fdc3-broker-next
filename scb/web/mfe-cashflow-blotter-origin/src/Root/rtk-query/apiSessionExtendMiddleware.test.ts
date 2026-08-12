import { configureStore, createSlice } from "@reduxjs/toolkit";

import { ExtendTokenService } from "../import";
import { apiSessionExtendMiddleware } from "./apiSessionExtendMiddleware";

jest.mock("../import", () => ({
    ExtendTokenService: jest.fn(),
}));

describe("apiSessionExtendMiddleware", () => {
    let store: ReturnType<typeof configureStore>;

    beforeEach(() => {
        const testSlice = createSlice({
            name: "test",
            initialState: {},
            reducers: {},
        });

        store = configureStore({
            reducer: {
                test: testSlice.reducer,
            },
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware<any>().concat(apiSessionExtendMiddleware.middleware),
        }) as unknown as ReturnType<typeof configureStore>;
    });

    it("should call ExtendTokenService when graphqlApi/executeQuery/fulfilled action is dispatched", () => {
        store.dispatch({ type: "graphqlApi/executeQuery/fulfilled" });
        expect(ExtendTokenService).toHaveBeenCalled();
    });
});