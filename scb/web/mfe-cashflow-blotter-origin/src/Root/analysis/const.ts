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
export const RTT_MUTATION_BULK_EXCEPTION =
  "Mutation Bulk Multiple Exception Fixing";
export const RTT_MUTATION_SUPPRESSION = "Mutation CASHFLOW/SWIFT Suppression";
export const RTT_MUTATION_MANUAL_FAIL = "Mutation Manual Fail";
export const RTT_QUERY_NETTING_PREVIEW = "Query Netting Preview";
export const RTT_MUTATION_NETTING = "Mutation Netting";
export const RTT_QUERY_SPLITTING_PREVIEW = "Query Splitting Preview";
export const RTT_MUTATION_SPLITTING = "Mutation Splitting";
export const RTT_MUTATION_HOLD = "Mutation Hold";
export const RTT_MUTATION_UNHOLD = "Mutation UnHold";
export const RTT_QUERY_SWIFT_MESSAGE_FROM_DA = "Query Swift Message From DA";
export const RTT_QUERY_SWIFT_MESSAGE_FROM_FMSRE =
  "Query Swift Message From FMSRE";
export const RTT_QUERY_ACCOUNTING_DETAILS = "Query Accounting Details";
export const RTT_MUTATION_ACCOUNTING_REPUBLISH =
  "Mutation Accounting Republish";
export const RTT_QUERY_ALL_EXCEPTION_CODES = "Query All Exception Codes";
export const RTT_QUERY_DATA_IN_QUICK_SEARCH = "Quick Search Cashflow Data";
export const RTT_MUTATION_LIFECYCLE_ACTION = "Mutation Life Cycle Action";

export const ADVANCED_SEARCH_FIELDS = "Advanced Search Fields";
export const CUSTOM_VIEW_FIELDS = "Custom View Fields";
export const QUICK_FILTER_FIELDS = "Quick Filter Fields";
export const QUICK_SEARCH_FIELDS = "Quick Search Fields";

export const EXCEPTION_FIXING_ACTION = "Multi Exception Fix M/C";
export const EXCEPTION_FIXING_VALIDATION_FAILED =
  "Multi Exception Fix Valication Failed";
export const DUAL_BLIND_VALID_SUCCESS = "Dual Blind Validation Success";
export const DUAL_BLIND_VALID_FAILED = "Dual Blind Validation Failed";

export const READ_FIELDS_FROM_CACHE = "Read Fields From Cache";
export const READ_FIELDS_WITHOUT_CACHE = "Read Fields Without Cache";

export const CASHFLOW_DETAILS_TABS_CLICK = "Cashflow Details Tabs Click";
export const BULK_FIX_EXCEPTION_CASHFLOW_COUNT =
  "Bulk Fix Exception Cashflow Count";

// full track
// cashflow blotter
const ContainerTileCashflowBlotter = "/cashflow_blotter_cn/cashflow_cn";
export const CASHFLOW_DETAILS_DIALOG_TAB =
  ContainerTileCashflowBlotter + "/cashflow_detail/cashflow_detail_tab";
export const CASHFLOW_DETAILS_DIALOG =
  ContainerTileCashflowBlotter + "/cashflow_detail/cashflow_detail_dialog";
export const ACCOUNTING_DETAILS_REPUBLISH_BTN =
  ContainerTileCashflowBlotter +
  "/cashflow_detail/accounting_detail/republish_btn";
export const CASHFLOW_DETAILS_COUNTERPARTY_ICON =
  ContainerTileCashflowBlotter + "/cashflow_detail/counterparty_btn";
export const MULTI_EXCEPTION_REJECT_BTN =
  ContainerTileCashflowBlotter + "/cashflow_detail/muti_exception/reject_btn";
export const MULTI_EXCEPTION_REJECT_MULTI_BTN =
  ContainerTileCashflowBlotter +
  "/cashflow_detail/muti_exception/reject_multi_btn";
export const MULTI_EXCEPTION_SUBMIT_BTN =
  ContainerTileCashflowBlotter + "/cashflow_detail/muti_exception/submit_btn";
export const MULTI_EXCEPTION_APPROVE_BTN =
  ContainerTileCashflowBlotter + "/cashflow_detail/muti_exception/approve_btn";
export const get_MULTI_EXCEPTION_NOSTRO_FORM_ACTION = (a: string) =>
  `${ContainerTileCashflowBlotter}/cashflow_detail/muti_exception/nostro_form/${a}_btn`;
export const get_MULTI_EXCEPTION_VOSTRO_FORM_ACTION = (a: string) =>
  `${ContainerTileCashflowBlotter}/cashflow_detail/muti_exception/vostro_form/${a}_btn`;
export const CASHFLOW_DETAILS_BOOKING_ENTITY_BTN =
  ContainerTileCashflowBlotter + "/cashflow_detail/booking_entity_btn";
export const CASHFLOW_DETAILS_OPEN_TRADE_DETAIL_BTN =
  ContainerTileCashflowBlotter + "/cashflow_detail/open_trade_detail_btn";
export const CASHFLOW_DETAILS_NOTIFICATION_REFRESH_BTN =
  ContainerTileCashflowBlotter + "/cashflow_detail/notification_refresh_btn";
export const NOTIFICATION_RECONNECT_BTN =
  ContainerTileCashflowBlotter + "/notification_reconnect_btn";
export const CASHFLOW_BLOTTER_EXPORT_FILE_BTN =
  ContainerTileCashflowBlotter + "/blotter/export_file_btn";
export const CASHFLOW_BLOTTER_EXPORT_FILE_CONFIRM_BTN =
  ContainerTileCashflowBlotter + "/blotter/export_file_confirm_btn";
export const CASHFLOW_BLOTTER_UPLOAD_BTN =
  ContainerTileCashflowBlotter + "/blotter/upload_btn";
export const CASHFLOW_BLOTTER_AUTO_LOAD_NEXT_BTN =
  ContainerTileCashflowBlotter + "/blotter/auto_load_next_btn";
export const CASHFLOW_BLOTTER_CLEAR_AGGRID_FILTER_BTN =
  ContainerTileCashflowBlotter + "/blotter/clear_all_aggrid_filter_btn";
export const CASHFLOW_BLOTTER_RESIZE_BTN =
  ContainerTileCashflowBlotter + "/blotter/resize_btn";
export const CASHFLOW_BLOTTER_NETTING_DIALOG_CLOSE_BTN =
  ContainerTileCashflowBlotter + "/netting_cashflow_dialog/close_btn";
export const CASHFLOW_BLOTTER_NET_WITH_AFFIRM_BTN =
  ContainerTileCashflowBlotter + "/netting_cashflow_dialog/net_with_affirm_btn";
export const CASHFLOW_BLOTTER_NETTING_DIALOG_NET_SUBMIT_BTN =
  ContainerTileCashflowBlotter + "/netting_cashflow_dialog/net_submit_btn";
export const CASHFLOW_BLOTTER_SPLITTING_DIALOG_NET_SUBMIT_BTN =
  ContainerTileCashflowBlotter + "/netting_cashflow_dialog/split_submit_btn";

export const PRESET_QUERY_COUNT_VD_TODAY_PO =
  ContainerTileCashflowBlotter +
  "/preset_query_count/value_today_pending_operator";
export const PRESET_QUERY_COUNT_VD_TODAY_PV =
  ContainerTileCashflowBlotter +
  "/preset_query_count/value_today_pending_verification";
export const PRESET_QUERY_COUNT_VD_TMR_PO =
  ContainerTileCashflowBlotter +
  "/preset_query_count/value_tmr_pending_operator";
export const PRESET_QUERY_COUNT_VD_TMR_PV =
  ContainerTileCashflowBlotter +
  "/preset_query_count/value_tmr_pending_verification";
export const BULK_FIX_SUBMIT_BTN =
  ContainerTileCashflowBlotter + "/bulk_fix_exceptions/submit_btn";
export const BULK_FIX_APPROVE_BTN =
  ContainerTileCashflowBlotter + "/bulk_fix_exceptions/approve_btn";
export const BULK_FIX_REJECT_BTN =
  ContainerTileCashflowBlotter + "/bulk_fix_exceptions/reject_btn";
export const CASHFLOW_BLOTTER_QUICK_FILTER_CLEAR_ALL_BTN =
  ContainerTileCashflowBlotter + "/quick_filter/clear_all_btn";
export const CASHFLOW_BLOTTER_QUICK_SEARCH_CLEAR_BTN =
  ContainerTileCashflowBlotter + "/quick_search/clear_btn";
export const CASHFLOW_BLOTTER_QUICK_SEARCH_SEARCH_BTN =
  ContainerTileCashflowBlotter + "/quick_search/search_btn";
export const CASHFLOW_BLOTTER_HIDE_SEARCH_BAR_BTN =
  ContainerTileCashflowBlotter + "/hide_search_bar_btn";
export const CASHFLOW_BLOTTER_SHOW_SEARCH_BAR_BTN =
  ContainerTileCashflowBlotter + "/show_search_bar_btn";
export const get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_SUBMIT_BTN = (a: string) =>
  ContainerTileCashflowBlotter + `/blotter_menu_action/${a}/submit_btn`;
export const get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_REJECT_BTN = (a: string) =>
  ContainerTileCashflowBlotter + `/blotter_menu_action/${a}/reject_btn`;
export const get_CASHFLOW_BLOTTER_MENU_ACTION_DIALOG_ALL_CF_IDS_BTN = (
  a: string
) =>
  ContainerTileCashflowBlotter +
  `/blotter_menu_action/${plattenStr(a)}/all_cashflow_ids_btn`;
export const get_CASHFLOW_BLOTTER_QUICK_FILTER_OPTION_BTN = (
  label: string,
  option: string
) =>
  ContainerTileCashflowBlotter +
  `/quick_filter/${plattenStr(label)}/${plattenStr(option)}`;
export const SETTLEMENT_METHOD_UPDATE_SUBMIT_BTN =
  ContainerTileCashflowBlotter + "/settlement_method_update/submit_btn";

// dashboard
const ContainerTileDashboard = "/cashflow_blotter_cn/cashflow_cn_dashboard";
export const DASHBOARD_PENDING_VOLUME_GT2VD_BTN =
  ContainerTileDashboard + "/pending_volume/gt2vd_btn";
export const DASHBOARD_PENDING_VOLUME_VD2_BTN =
  ContainerTileDashboard + "/pending_volume/vd2_btn";
export const DASHBOARD_PENDING_VOLUME_VD1_BTN =
  ContainerTileDashboard + "/pending_volume/vd1_btn";
export const DASHBOARD_PENDING_VOLUME_VD_TODAY_BTN =
  ContainerTileDashboard + "/pending_volume/vdtoday_btn";
export const DASHBOARD_QUICK_SEARCH_CLEAR_BTN =
  ContainerTileDashboard + "/quick_search/clear_btn";
export const DASHBOARD_QUICK_SEARCH_SEARCH_BTN =
  ContainerTileDashboard + "/quick_search/search_btn";
export const get_DASHBOARD_STATUS_INDICATOR = (a: string) =>
  `${ContainerTileDashboard}/status_indicator/${a}`;

// group blotter
const ContainerTileGroupBlotter =
  "/cashflow_blotter_cn/cashflow_group_management";
export const GROUP_BLOTTER_EXPORT_FILE_BTN =
  ContainerTileGroupBlotter + "/blotter/export_file_btn";
export const GROUP_BLOTTER_EXPORT_FILE_CONFIRM_BTN =
  ContainerTileGroupBlotter + "/blotter/export_file_confirm_btn";
export const GROUP_BLOTTER_RESIZE_BTN =
  ContainerTileGroupBlotter + "/blotter/resize_btn";
export const GROUP_BLOTTER_QUICK_SEARCH_CLEAR_BTN =
  ContainerTileGroupBlotter + "/quick_search/clear_btn";
export const GROUP_BLOTTER_QUICK_SEARCH_SEARCH_BTN =
  ContainerTileGroupBlotter + "/quick_search/search_btn";

// bic netting static blotter
const ContainerTileBicNettingStaticBlotter =
  "/cashflow_blotter_cn/cashflow_bic_netting_static_table";
export const BIC_NETTING_STATIC_BLOTTER_EXPORT_FILE_BTN =
  ContainerTileBicNettingStaticBlotter + "/blotter/export_file_btn";
export const BIC_NETTING_STATIC_BLOTTER_EXPORT_FILE_CONFIRM_BTN =
  ContainerTileBicNettingStaticBlotter + "/blotter/export_file_confirm_btn";
export const BIC_NETTING_STATIC_BLOTTER_AUDIT_BTN =
  ContainerTileBicNettingStaticBlotter + "/blotter/audit_btn";
export const BIC_NETTING_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN =
  ContainerTileBicNettingStaticBlotter + "/quick_search/clear_btn";
export const BIC_NETTING_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN =
  ContainerTileBicNettingStaticBlotter + "/quick_search/search_btn";
export const get_BIC_NETTING_STATIC_BLOTTER_AUDIT_BTN = (a: string) =>
  ContainerTileBicNettingStaticBlotter + "/static_detail/" + a;
export const BIC_NETTING_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB =
  ContainerTileBicNettingStaticBlotter + "/static_detail/rule_detail_tab";
export const BIC_NETTING_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB =
  ContainerTileBicNettingStaticBlotter + "/static_detail/rule_history_tab";

const ContainerTileAuthorizationLimits =
  "/cashflow_blotter_cn/cashflow_authorization_limits";
export const AUTHORIZATION_LIMITS_BLOTTER_DETAILS_DIALOG =
  ContainerTileAuthorizationLimits + "/details_dialog";
export const AUTHORIZATION_LIMITS_BLOTTER_DETAILS_DIALOG_SUBMIT_BUTTON =
  ContainerTileAuthorizationLimits + "/details_dialog/submit_btn";
export const AUTHORIZATION_LIMITS_BLOTTER_VERIFY_BTN =
  ContainerTileAuthorizationLimits + "/blotter/verify_btn";
export const AUTHORIZATION_LIMITS_BLOTTER_EDIT_BTN =
  ContainerTileAuthorizationLimits + "/blotter/edit_btn";
export const AUTHORIZATION_LIMITS_BLOTTER_DELETE_BTN =
  ContainerTileAuthorizationLimits + "/blotter/delete_btn";
export const AUTHORIZATION_LIMITS_BLOTTER_VERIFY_MODIFICATION_BTN =
  ContainerTileAuthorizationLimits + "/blotter/verify_modification_btn";
export const AUTHORIZATION_LIMITS_BLOTTER_VERIFY_DELETION_BTN =
  ContainerTileAuthorizationLimits + "/blotter/verify_deletion_btn";
export const AUTHORIZATION_LIMITS_BLOTTER_CREATE_BTN =
  ContainerTileAuthorizationLimits + "/blotter/create_btn";

//split blotter
const ContainerTileAutoSplitStaticBlotter =
  "/cashflow_blotter_cn/cashflow_auto_split_static_table";
export const AUTO_SPLIT_STATIC_BLOTTER_EXPORT_FILE_BTN =
  ContainerTileAutoSplitStaticBlotter + "/blotter/export_file_btn";
export const AUTO_SPLIT_STATIC_BLOTTER_EXPORT_FILE_CONFIRM_BTN =
  ContainerTileAutoSplitStaticBlotter + "/blotter/export_file_confirm_btn";
export const AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN =
  ContainerTileAutoSplitStaticBlotter + "/blotter/audit_btn";
export const AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN =
  ContainerTileAutoSplitStaticBlotter + "/quick_search/clear_btn";
export const AUTO_SPLIT_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN =
  ContainerTileAutoSplitStaticBlotter + "/quick_search/search_btn";
export const get_AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN = (a: string) =>
  ContainerTileAutoSplitStaticBlotter + "/static_detail/" + a;
export const AUTO_SPLIT_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB =
  ContainerTileAutoSplitStaticBlotter + "/static_detail/rule_detail_tab";
export const AUTO_SPLIT_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB =
  ContainerTileAutoSplitStaticBlotter + "/static_detail/rule_history_tab";

// Utilization static blotter
const ContainerTileUtilizationStaticBlotter =
  "/cashflow_blotter_cn/cashflow_utilization_static_table";
export const UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_BTN =
  ContainerTileUtilizationStaticBlotter + "/blotter/export_file_btn";
export const UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_CONFIRM_BTN =
  ContainerTileUtilizationStaticBlotter + "/blotter/export_file_confirm_btn";
export const UTILIZATION_STATIC_BLOTTER_AUDIT_BTN =
  ContainerTileUtilizationStaticBlotter + "/blotter/audit_btn";
export const UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_CLEAR_BTN =
  ContainerTileUtilizationStaticBlotter + "/quick_search/clear_btn";
export const UTILIZATION_STATIC_BLOTTER_QUICK_SEARCH_SEARCH_BTN =
  ContainerTileUtilizationStaticBlotter + "/quick_search/search_btn";
export const get_UTILIZATION_STATIC_BLOTTER_AUDIT_BTN = (a: string) =>
  ContainerTileUtilizationStaticBlotter + "/static_detail/" + a;
export const UTILIZATION_STATIC_BLOTTER_STATIC_DETAIL_RULE_DETAIL_TAB =
  ContainerTileUtilizationStaticBlotter + "/static_detail/rule_detail_tab";
export const UTILIZATION_STATIC_BLOTTER_STATIC_DETAIL_RULE_HISTORY_TAB =
  ContainerTileUtilizationStaticBlotter + "/static_detail/rule_history_tab";
