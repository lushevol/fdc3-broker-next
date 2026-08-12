import { plattenStr } from "./utils";

export const BLOTTER_RENDERING_LATENCY = "Blotter Rendering Latency";
export const DETAILS_RENDERING_LATENCY = "Details Rendering Latency";

export const USELESS_INIT_POINT = "0";
export const BLOTTER_RENDERING_LATENCY_STAGES = {
  RENDER_PAGE_FRAME: "Render Page Frame",
  RENDER_BLOTTER_FRAME: "Render Cashflow Blotter Frame",
  RENDER_BLOTTER_DATA: "Render Cashflow Blotter Client Data",
};

export const DETAIL_RENDERING_LATENCY_STAGES = {
  RENDER_DETAIL_FRAME: "Render Cashflow Detail Frame",
  RENDER_DETAIL_DATA: "Render Cashflow Detail Client Data",
};

export const RTT_QUERY_BLOTTER_DATA = "Query Cashflow Blotter Client Data";
export const RTT_QUERY_DETAIL_GRAPHQL = "Query Cashflow Details GraphQL";
export const RTT_QUERY_CP_IN_DETAIL = "Query CounterParty In Cashflow Detail";
export const RTT_QUERY_COUNTRY_IN_DETAIL =
  "Query Country Info In Cashflow Detail";
export const RTT_MUTATION_EXCEPTION = "Mutation Multiple Exception Fixing";
export const RTT_QUERY_DATA_IN_QUICK_SEARCH = "Quick Search Cashflow Data";
export const RTT_MUTATION_LIFECYCLE_ACTION = "Mutation Life Cycle Action";

export const ADVANCED_SEARCH_FIELDS = "Advanced Search Fields";
export const CUSTOM_VIEW_FIELDS = "Custom View Fields";
export const QUICK_FILTER_FIELDS = "Quick Filter Fields";
export const QUICK_SEARCH_FIELDS = "Quick Search Fields";

export const EXCEPTION_FIXING_ACTION = "Multi Exception Fix M/C";
export const DUAL_BLIND_VALID_SUCCESS = "Dual Blind Validation Success";
export const DUAL_BLIND_VALID_FAILED = "Dual Blind Validation Failed";

// advanced search
export const get_ADVANCED_SEARCH_ENTRY_SELECTOR_OPTION = (option: string) =>
  `/advanced_search/entry_selector/${plattenStr(option)}`;
export const ADVANCED_SEARCH_ENTRY_CLEAR_BTN =
  "/advanced_search/entry_selector/clear_btn";
export const ADVANCED_SEARCH_ENTRY_SETTING_BTN =
  "/advanced_search/entry_selector/setting_btn";
export const ADVANCED_SEARCH_PREVIEW_DIALOG_SEARCH_BTN =
  "/advanced_search/preview_dialog/search_btn";
export const ADVANCED_SEARCH_PREVIEW_DIALOG_SAVE_CREATE_BTN =
  "/advanced_search/preview_dialog/save_or_create_btn";
export const ADVANCED_SEARCH_PREVIEW_DIALOG_DELETE_BTN =
  "/advanced_search/preview_dialog/delete_btn";
