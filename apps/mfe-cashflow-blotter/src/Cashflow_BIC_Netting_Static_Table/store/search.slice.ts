import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type QueryType = Record<string, PrimitiveValue>;

type SearchState = {
  searchQuery: QueryType;
};

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchQuery: {},
  } as SearchState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<QueryType>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = searchSlice.actions;

export default searchSlice.reducer;
