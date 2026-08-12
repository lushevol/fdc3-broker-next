import reducer, { searchSlice,setSearchQuery } from "./search.slice";

describe("searchSlice", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, { type: undefined })).toEqual({ searchQuery: {} });
  });

  it("should handle setSearchQuery", () => {
    const initialState = { searchQuery: {} };
    const payload = { foo: "bar", num: 123 };
    const action = setSearchQuery(payload);
    const state = reducer(initialState, action);
    expect(state.searchQuery).toEqual(payload);
  });

  it("should have correct slice name", () => {
    expect(searchSlice.name).toBe("search");
      });
});