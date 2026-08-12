import { RootState } from "./interface";

export const BLOTTER_PAGE_SIZE = 1000;

// preload state object key must be same as reducer
const initState: RootState = {
  blotterGridEvent: {
    api: undefined,
  }, // Data grid ready event of cashflow page
  blotterDatas: [],
  blotterQueryStatus: new Promise(() => {}),
  blotterQueryId: 0,
  blotterPagination: {
    lastPage: false,
    totalHits: 0,
    pageNo: 0,
    pageSize: BLOTTER_PAGE_SIZE,
  },

  // quick search
  quickSearch: {},

  // fmId to country code mapping
  fmIdDetailMapping: {},
  isLoadingNextPage: false,
};
export default initState;
