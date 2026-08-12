//@ts-ignore
import * as RatanContainer from "@fm/ratan_container";
export const { Version } = RatanContainer.RatancomponentsVersion;
export const { FilterTags } = RatanContainer.RatancomponentsFilterTags;
export const { TooltipCell } = RatanContainer.RatancomponentsTooltipCell;
export const { CommentCell: DataGridCommentCell } =
  RatanContainer.RatancomponentsCommentCell;
export const { UpdateAffirmationStatus } =
  RatanContainer.RatancomponentsUpdateAffirmationStatus;
export const { DataGrid, classes: DataGridClasses } =
  RatanContainer.RatancomponentsDataGrid;
export const { FilterSelector } = RatanContainer.RatancomponentsFilterSelector;
export const { ViewSelector } = RatanContainer.RatancomponentsViewSelector;
export const { FieldLabel, DynamickFieldLabel } =
  RatanContainer.RatancomponentsFieldLabel;
export const { Dialog } = RatanContainer.RatancomponentsDialog;
export const { MuiDialog } = RatanContainer.RatancomponentsMuiDialogV1;
export const { MuiPortalDialog } = RatanContainer.RatancomponentsMuiDialogV2;
export const useViewName =
  RatanContainer.RatancomponentsViewSelectorUseViewName.default;
export const { Loading } = RatanContainer.RatancomponentsLoading;
export const { CustomForm } = RatanContainer.RatancomponentsCustomForm;
export const { CustomFormGroup } =
  RatanContainer.RatancomponentsCustomFormGroup;
export const {
  default: ItemsComponent,
  QuickSearchInput,
  QuickSearchDynamickSelect,
  QuickSearchPicker,
  QuickSearchSelect,
  QuickSearchManyInOne,
} = RatanContainer.RatancomponentQuickSearchComponentsItemsComponent;
export const { debounceGetDynamicList, getDynamicListForPortfolio } =
  RatanContainer.RatancomponentQuickSearchComponentsItemsFun;
export const { default: rtCreatePortal } =
  RatanContainer.RatancomponentsPortalCreatePortal;
export const { HandleHoliday } = RatanContainer.RatanComponentHandleHoliday;
export const { PopoverDetails } = RatanContainer.RatanComponentPopoverDetails;
export const { SwiftMessageDialog } =
  RatanContainer.RatanComponentSwiftMessageDialog;
export const { default: HistoryDetailsDialog } =
  RatanContainer.RatanComponentHistoryDetailsDialog;
export const { ShowTimeCompare } = RatanContainer.RatancomponentShowTimeCompare;
export const { CounterpartyDetailsV2 } =
  RatanContainer.RatanComponentCounterpartyDetailsV2;
export const useRatanContext = RatanContainer.RatanProvider.useContext;
export const { default: useRatanDispatcher } = RatanContainer.RatanDispatcher;
export const { handleReviewStatus, formatBuySell, PRODUCT_DESCRIPTION_FIELDS } =
  RatanContainer.RatanTradesFieldsConfig;
export const { EntityDetails } = RatanContainer.RatancomponentEntityDetails;
export const { default: AdvancedSearch, generateTemplateFilterRecord } =
  RatanContainer.RatanComponentAdvancedSearch;
export const {
  default: QueryBuilder,
  hydrate,
  dehydrate,
  initialQuery,
  ratanRawField2RQBField,
  defaultOperators,
  defaultRuleProcessorSQL,
  formatQuery,
  transformQuery,
  isNumberString,
  isVariable = (a) => false,
  jsonParse,
  TransformQueryOptions,
  RuleProcessor,
  RatanRawFieldConfig,
  isVariableHandlingEnabled = (a, b) => false,
} = RatanContainer.RatanComponentRatanQueryBuilder;
export const {
  RatanFieldConfig,
  parseValueList,
  ratanFieldConfigPreprocessing,
} = RatanContainer.RatanComponentRatanFilterBuilderUtils;
export const { SimpleAmount } = RatanContainer.Amounty;

export default RatanContainer;
