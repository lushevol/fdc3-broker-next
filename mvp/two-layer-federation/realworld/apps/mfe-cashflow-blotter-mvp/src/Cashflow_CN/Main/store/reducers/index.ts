import { combineReducers } from "redux";
import { graphqlApi } from "src/Root/rtk-query/baseGraphQLApi";

import * as BulkSubmitReducers from "./bulkSubmitReducers";
import * as CashflowReducers from "./cashflowReducers";
import { handleCashflowSearchBar } from "./searchBarReducer";
import {
  netWorkflow,
  settlementMethodUpdateWorkflow,
  splittingValidation,
  splittingWorkflow,
  unNetWorkflow,
  viewCashflowDetailsWorkflow,
  viewTradeDetailsWorkflow,
} from "./workflowReducer";

// preload state object key must be same as reducer
const reducer = combineReducers({
  ...CashflowReducers,
  ...BulkSubmitReducers,

  showCashflowSearchBar: handleCashflowSearchBar,

  netWorkflow,
  unNetWorkflow,
  splittingWorkflow,
  splittingValidation,
  viewCashflowDetailsWorkflow,
  viewTradeDetailsWorkflow,
  settlementMethodUpdateWorkflow,
  [graphqlApi.reducerPath]: graphqlApi.reducer,
});

export default reducer;
