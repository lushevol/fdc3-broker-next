import reducer, { setSearchQuery } from "./search.slice";

describe("search.slice", () => {
  it("should return the initial state", () => {
    const initialState = reducer(undefined, { type: "@@INIT" });
    expect(initialState.searchQuery).toEqual({});
  });

  it("should handle setSearchQuery", () => {
    const prevState = { searchQuery: {} };
    const newQuery = { key1: "value1", key2: 123 };
    const state = reducer(prevState, setSearchQuery(newQuery));
    expect(state.searchQuery).toEqual(newQuery);
  });

  it("should overwrite searchQuery when setSearchQuery is called again", () => {
    const prevState = { searchQuery: { key1: "value1" } };
    const newQuery = { key2: "value2" };
    const state = reducer(prevState, setSearchQuery(newQuery));
    expect(state.searchQuery).toEqual(newQuery);
  });
});