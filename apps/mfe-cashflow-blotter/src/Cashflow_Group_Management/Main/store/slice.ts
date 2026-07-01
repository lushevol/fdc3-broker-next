import { createSlice } from "@reduxjs/toolkit";
import { AgEvent } from "ag-grid-community";
import type { Dayjs } from "dayjs";
import { DateFormat } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";
import { queryCounterPartyDetailsList } from "src/Cashflow_CN/services";

import { queryGroupMessages } from "../../services/graphql";
import { BlotterDataType, FmIdDetailMappingType, RootState } from "./interface";
import initState, { BLOTTER_PAGE_SIZE } from "./state";

type TriggerSearchType = "initial" | "next";

export const triggerSearch =
  (type: TriggerSearchType) =>
  async (
    dispatch,
    getState: () => { groupBlotter: RootState }
  ): Promise<BlotterDataType[]> => {
    const {
      groupBlotter: {
        quickSearch,
        blotterDatas,
        blotterPagination,
        fmIdDetailMapping,
        blotterQueryId,
        blotterGridEvent: { api },
      },
    } = getState();
    if (type === "next" && blotterPagination.lastPage) return [];
    api?.setGridOption("loading", true);
    api?.dispatchEvent({
      type: "gridFetchingData",
      isGridFetchingData: true,
    } as AgEvent);

    if (type === "next") {
      dispatch(setIsLoadingNextPage(true));
    }

    if (type === "initial") {
      api?.setGridOption("rowData", []);
      api?.dispatchEvent({
        type: "gridFetchedAllData",
        isGridFetchedAll: false,
      } as AgEvent);
    }

    const quickSearchCopy = { ...quickSearch };
    if (quickSearchCopy.Major_Version) {
      quickSearchCopy.Major_Version = Number(quickSearchCopy.Major_Version);
    }
    if (quickSearchCopy.Value_Date) {
      quickSearchCopy.Value_Date = (
        quickSearchCopy.Value_Date as unknown as Dayjs
      )?.format(DateFormat);
    }

    const params = {
      filter: quickSearchCopy,
      pagination: {
        pageNo: type === "initial" ? 0 : blotterPagination.pageNo + 1,
        pageSize: blotterPagination.pageSize || BLOTTER_PAGE_SIZE,
      },
    };
    const queryId = blotterQueryId + 1;
    dispatch(setBlotterQueryId(queryId));
    try {
      const resp = await queryGroupMessages(params);
      const {
        groupBlotter: { blotterQueryId },
      } = getState();
      if (blotterQueryId !== queryId) {
        // if query id is not the same, means this query is outdated, return empty
        return [];
      }
      const {
        groupMessages: { pageInfo, results },
      } = resp ?? {};
      dispatch(setBlotterPagination(pageInfo));
      api?.dispatchEvent({
        type: "gridFetchedAllData",
        isGridFetchedAll: pageInfo.lastPage,
      } as AgEvent);
      let finalBlotterDatas: BlotterDataType[] = [];
      if (type === "initial") {
        finalBlotterDatas = loadCountryCodeToRows(results, fmIdDetailMapping);
      } else if (type === "next") {
        const existingIds = new Set(blotterDatas.map((i) => i.Id));
        const newAddedResults = results.filter((i) => !existingIds.has(i.Id));
        finalBlotterDatas = loadCountryCodeToRows(
          [...blotterDatas, ...newAddedResults],
          fmIdDetailMapping
        );
      }

      dispatch(setIsLoadingNextPage(false));
      dispatch(setBlotterDatas(finalBlotterDatas));
      api?.setGridOption("rowData", finalBlotterDatas);
      const allFmIds = Array.from(
        new Set([
          ...finalBlotterDatas.map((i) => i.Counterparty_Fm_Id),
          ...finalBlotterDatas.map((i) => i.Booking_Entity_Id),
        ])
      );
      const mappedFmIds = Object.keys(fmIdDetailMapping);
      const notMappedFmIds = allFmIds.filter((id) => !mappedFmIds.includes(id));
      if (notMappedFmIds.length > 0) {
        const fmInfos = await queryCounterPartyDetailsList(notMappedFmIds);
        const newFmIdDetailMapping = fmInfos.reduce<FmIdDetailMappingType>(
          (res, cur) => {
            if (cur.fmAccount?.fmId) {
              res[cur.fmAccount.fmId] = {
                countryCode:
                  cur.legalEntity?.legalEntityOrgDetails?.at(0)
                    ?.domicileCountry ?? "",
                fmCode: cur.fmAccount.fmCode ?? "",
                bookingEntityFmCode: cur.fmAccount.fmCode ?? "",
              };
            }
            return res;
          },
          { ...fmIdDetailMapping }
        );
        dispatch(setFmIdDetailMapping(newFmIdDetailMapping));
        const finalBlotterDatasWithCountryCode = loadCountryCodeToRows(
          finalBlotterDatas,
          newFmIdDetailMapping
        );
        dispatch(setBlotterDatas([...finalBlotterDatasWithCountryCode]));
        api?.setGridOption("rowData", [...finalBlotterDatasWithCountryCode]);
      }
      return finalBlotterDatas;
    } catch (error) {
      return blotterDatas;
    } finally {
      const {
        groupBlotter: { blotterQueryId },
      } = getState();
      if (blotterQueryId === queryId) {
        api?.setGridOption("loading", false);
        api?.dispatchEvent({
          type: "gridFetchingData",
          isGridFetchingData: false,
        } as AgEvent);
        dispatch(setIsLoadingNextPage(false));
      }
    }
  };

export const groupBlotterSlice = createSlice({
  name: "groupBlotter",
  initialState: initState,
  reducers: {
    // payload: GridReadyEvent
    setBlotterGridEvent: (state, { payload }) => {
      state.blotterGridEvent = payload;
    },
    // payload: SearchCriteria
    setQuickSearchCriteria: (state, { payload }) => {
      state.quickSearch = payload;
    },
    setBlotterDatas: (state, { payload }) => {
      state.blotterDatas = payload;
    },
    setBlotterPagination: (state, { payload }) => {
      state.blotterPagination = payload;
    },
    setFmIdDetailMapping: (state, { payload }) => {
      state.fmIdDetailMapping = payload;
    },
    updateBlotterDatas: (state, { payload }) => {
      const datas = payload as BlotterDataType[];
      if (Array.isArray(datas) && datas.length) {
        const {
          blotterGridEvent: { api },
          fmIdDetailMapping,
        } = state;
        const datasWithNewColumns = loadCountryCodeToRows(
          datas,
          fmIdDetailMapping
        );
        const dataIds = datasWithNewColumns.map((i) => i.Id);
        state.blotterDatas = state.blotterDatas.map((i) => {
          const index = dataIds.findIndex((id) => id === i.Id);
          if (index > -1) {
            return datasWithNewColumns[index];
          }
          return i;
        });
        api?.applyTransaction({
          update: datasWithNewColumns,
        });
      }
    },
    setBlotterQueryId: (state, { payload }) => {
      state.blotterQueryId = payload;
    },
    setIsLoadingNextPage: (state, { payload }) => {
      state.isLoadingNextPage = payload;
    },
    setGroupBlotterPageSize: (state, { payload }) => {
      state.blotterPagination.pageSize = payload;
    },
  },
});

export const {
  setBlotterGridEvent,
  setQuickSearchCriteria,
  setBlotterDatas,
  setBlotterPagination,
  setFmIdDetailMapping,
  updateBlotterDatas,
  setBlotterQueryId,
  setIsLoadingNextPage,
  setGroupBlotterPageSize,
} = groupBlotterSlice.actions;

export default groupBlotterSlice.reducer;

const loadCountryCodeToRows = (
  rows: BlotterDataType[],
  fmIdDetailMapping: FmIdDetailMappingType
): BlotterDataType[] => {
  return rows.map((i) => {
    const { countryCode, fmCode } =
      fmIdDetailMapping[i.Counterparty_Fm_Id] ?? {};
    const { bookingEntityFmCode } =
      fmIdDetailMapping[i.Booking_Entity_Id] ?? {};

    return {
      ...i,
      Client_Domicile_Country: i.Client_Domicile_Country ?? countryCode,
      Counterparty_Fm_Code: i.Counterparty_Fm_Code ?? fmCode,
      Booking_Entity_Fm_Code: i.Booking_Entity_Fm_Code ?? bookingEntityFmCode,
    };
  });
};
