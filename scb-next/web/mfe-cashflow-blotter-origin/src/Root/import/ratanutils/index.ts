//@ts-ignore
import * as RatanContainer from "@fm/ratan_container";
export const { logInit, logger } = RatanContainer.RatanutilsLogger;
export const { useParentData, getBusinessFieldsFromCache, getParent } =
  RatanContainer.RatanutilsInit;
export const { hasPermission, getUser } =
  RatanContainer.RatanutilsAuthenticator;
export const { getEnable } = RatanContainer.RatanutilsComponentEnabling;
export const { Version } = RatanContainer.RatanutilsComponentEnabling;
export const {
  conversionGroup,
  conversionCascaderOptions,
  conversionViewOptions,
  conversionColDef,
  sortBusinessFields,
  getRealIdOfTrade,
  getRealIdOfParentTrade,
  conversionDQSLRequest,
  getDisplayFields,
} = RatanContainer.RatanutilsConversion;
export const { queryGraphql, gql, queryTradeVersionsData, judgeDefaultFilter } =
  RatanContainer.RatanutilsHttpGraphql;
export const { handleMultiFieldsQuery } =
  RatanContainer.RatanutilsSetDefaultFilter;
export const { filtering } = RatanContainer.RatanutilsFilteringData;
export const {
  isEmpty,
  getTimeDiff,
  changeKeyToLabel,
  priceCellFormatterWithComma,
  formatePrice,
  isNumber,
  deepClone,
  formatMultiInputValue,
  getRangepickerValue,
  getOperator,
  displayCountDownTime,
  styleForCountDownTime,
  customColumSort,
  removeSpacesFromStrings,
  randomString,
  judgeCashflowProduct,
  getTradeStatusArray,
} = RatanContainer.RatanutilsUtils;
export const { holidayDB } = RatanContainer.RatanutilsDB;
export const {
  swiftMessageDetails,
  getFilterList,
  getFilterDetails,
  postSaveFilter,
  putUpdateFilter,
  deleteFilter,
} = RatanContainer.RatanutilsHttpApi;
export const { onGridBodyScroll } = RatanContainer.RatanutilsInfiniteScrollData;
export const { eventBus, eventTypes } = RatanContainer.RatanutilsEventBus;
export const { Num, num } = RatanContainer.Amounty;
export default RatanContainer;
