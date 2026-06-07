import "./Root/polyfill/requestIdleCallback";
import Root from "./App";
import { getUser } from "./ratanutils/authenticator";

// common
export * as RatanProvider from "./Root/hooks/provider";
export * as RatanDispatcher from "./Root/hooks/dispatcher";
// utils
export * as ratanConfig from "./ratanstatic";
export * as RatanutilsInit from "./ratanutils/init";
export * as RatanutilsDB from "./ratanutils/holidayDB";
export * as RatanutilsAuthenticator from "./ratanutils/authenticator";
export * as RatanutilsUtils from "./ratanutils/utils";
export * as RatanutilsComponentEnabling from "./ratanutils/componentEnabling";
export * as RatanutilsHttpApi from "./ratanutils/http/api";
export * as RatanutilsHttpGraphql from "./ratanutils/http/graphql";
export * as RatanutilsInfiniteScrollData from "./ratanutils/infiniteScrollData";
export * as RatanutilsLogger from "./ratanutils/logger";
export * as RatanutilsConversion from "./ratanutils/conversion";
export * as RatanutilsFilteringData from "./ratanutils/filteringData";
export * as RatanutilsEventBus from "./ratanutils/eventBus";
export * as RatanutilsSetDefaultFilter from "./ratanutils/setDefaultFilter";

// components
export * as RatancomponentsVersion from "./ratancomponents/Version";
export * as RatancomponentsFilterTags from "./ratancomponents/FilterTags";
export * as RatancomponentsUpdateAffirmationStatus from "./ratancomponents/UpdateAffirmationStatus";
export * as RatancomponentsDataGrid from "./ratancomponents/DataGrid";
export * as RatancomponentsTooltipCell from "./ratancomponents/DataGrid/TooltipCell";
export * as RatancomponentsCommentCell from "./ratancomponents/DataGrid/CommentCell";
export * as RatancomponentsTextCommentCell from "./ratancomponents/DataGrid/TextCommentCell";
export * as RatancomponentsTime from "./ratancomponents/SwitchTime/Time";
export * as RatancomponentsFilterSelector from "./ratancomponents/FilterSelector";
export * as RatancomponentsViewSelector from "./ratancomponents/ViewSelector";
export * as RatancomponentsViewSelectorUseViewName from "./ratancomponents/ViewSelector/useViewName";
export * as RatancomponentsFieldLabel from "./ratancomponents/FieldLabel";
export * as RatancomponentsCustomForm from "./ratancomponents/CustomForm";
export * as RatancomponentsCustomFormFormItem from "./ratancomponents/CustomForm/FormItemComponents";
export * as RatancomponentsLoading from "./ratancomponents/Loading";
export * as RatancomponentsDialog from "./ratancomponents/Dialog";
export * as RatancomponentsMuiDialog from "./ratancomponents/Dialog/indexMui";
export * as RatancomponentsMuiDialogV1 from "./ratancomponents/Dialog/indexMuiV1";
export * as RatancomponentsMuiDialogV2 from "./ratancomponents/Dialog/indexMuiV2";
export * as RatancomponentsPortal from "./ratancomponents/Portal";
export * as RatancomponentsPortalCreatePortal from "./ratancomponents/Portal/rtCreatePortal";
export * as RatancomponentQuickSearchComponentsItemsComponent from "./ratancomponents/QuickSearchComponents/ItemsComponent";
export * as RatancomponentQuickSearchComponentsItemsFun from "./ratancomponents/QuickSearchComponents/itemsFun";
export * as RatanComponentHandleHoliday from "./ratancomponents/HandleHoliday";
export * as RatanComponentPopoverDetails from "./ratancomponents/Popover/PopoverDetails";
export * as RatanComponentPopover from "./ratancomponents/Popover";
export * as RatanComponentSwiftMessageDialog from "./ratandialog/components/SwiftMessageDialog";
export * as RatanComponentHistoryDetailsDialog from "./ratandialog/HistoryDetailsDialog";
export * as RatanComponentHistoryStatusChangeCell from "./ratandialog/HistoryDetailsPopOver/StatusChangeCell";
export * as RatanComponentHistoryValueChangeCell from "./ratandialog/HistoryDetailsPopOver/ValueChangeCell";
export * as RatanComponentCounterpartyDetailsV2 from "./ratandialog/components/CounterpartyDetails-v2";
export * as RatanComponentCustomRow from "./ratancomponents/CustomRow";
export const getRole = { getRole: getUser };
export * as RatanComponentAdvancedSearch from "./ratancomponents/RatanFilterBuilder/AdvancedSearch/export";
export * as RatanComponentAdvancedSearchMainPanel from "./ratancomponents/RatanFilterBuilder/AdvancedSearch/exportMainPanel";
export * as RatanComponentRatanQueryBuilder from "./ratancomponents/RatanFilterBuilder/ReactQueryBuilder/export";
export * as RatanComponentRatanFilterBuilderUtils from "./ratancomponents/RatanFilterBuilder/RatanOne/export";

// dialog
export * as RatandialogCommonCommentAction from "./ratandialog/CommonCommentAction";
export * as RatancomponentEntityDetails from "./ratandialog/components/EntityDetails/EntityDetails";
export * as RatancomponentShowTimeCompare from "./ratandialog/components/ShowTimeCompare";
export * as RatancomponentCommentsCell from "./ratandialog/HistoryDetailsPopOver/CommentsCell";
export * as RatancommponentCommentsChangeCell from "./ratandialog/HistoryDetailsPopOver/CommentsChangeCell";

export * as RatanexceptionFieldsConfig from "./ratanutils/config/ratanexception/fieldsConfig";
export * as RatanTradesFieldsConfig from "./ratanutils/config/ratantrades/fieldsConfig";
export * as RatanCashflowFieldsConfig from "./ratanutils/config/ratancashflow/fieldsConfig";

export * as RatanLazyAndtdCheckbox from "./LazyAntd/Checkbox";
export * as RatanLazyAndtdDatePicker from "./LazyAntd/DatePicker";
export * as RatanLazyAndtdInput from "./LazyAntd/Input";
export * as RatanLazyAndtdInputNumber from "./LazyAntd/InputNumber";
export * as RatanLazyAndtdRangePicker from "./LazyAntd/RangePicker";
export * as RatanLazyAndtdSelect from "./LazyAntd/Select";
export * as RatanLazyAndtdTheme from "./LazyAntd/Theme";
export * as RatanLazyAndtdTimePicker from "./LazyAntd/TimePicker";

// packages
export * as Amounty from "./packages/Amounty";
export * as Analysis from "./packages/Analysis";
export * as AnalysisV2 from "./packages/Analysis/v2/export";
export * as FeatureFlag from "./packages/FeatureFlag";

export default Root;
