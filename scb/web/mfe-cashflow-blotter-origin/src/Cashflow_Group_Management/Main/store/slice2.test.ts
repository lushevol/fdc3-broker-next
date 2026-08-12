import dayjs from "dayjs";
import { queryCounterPartyDetailsList } from "src/Cashflow_CN/services";

import { queryGroupMessages } from "../../services/graphql";
import { triggerSearch } from "./slice";

jest.mock("../../services/graphql", () => ({
  queryGroupMessages: jest.fn(),
}));

jest.mock("src/Cashflow_CN/services", () => ({
  queryCounterPartyDetailsList: jest.fn(),
}));

describe("triggerSearch", () => {
  const mockDispatch = jest.fn();
  const mockGetState = jest.fn();
  const mockApi = {
    setGridOption: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch initial data and update state on success", async () => {
    const mockResponse = {
      groupMessages: {
        pageInfo: { lastPage: false },
        results: [{ Id: "1", Counterparty_Fm_Id: "fm1", Booking_Entity_Id: "be1" }],
      },
    };
    const mockFmDetails = [
      {
        fmAccount: { fmId: "fm1", fmCode: "FM1" },
        legalEntity: { legalEntityOrgDetails: [{ domicileCountry: "US" }] },
      },
      {},
      {
        fmAccount: { fmId: "fm2" },
      }
    ];

    (queryGroupMessages as jest.Mock).mockResolvedValue(mockResponse);
    (queryCounterPartyDetailsList as jest.Mock).mockResolvedValue(mockFmDetails);

    mockGetState.mockReturnValueOnce({
      groupBlotter: {
        quickSearch: {
          Major_Version: "1",
          Value_Date: dayjs("2025-04-20"),
        },
        blotterDatas: [],
        blotterPagination: { pageNo: 0, lastPage: false },
        fmIdDetailMapping: {},
        blotterGridEvent: { api: mockApi },
        blotterQueryId: 0,
      },
    }).mockReturnValue({
      groupBlotter: {
        blotterQueryId: 1,
      }
    });

    const result = await triggerSearch("initial")(mockDispatch, mockGetState);

    expect(mockApi.setGridOption).toHaveBeenCalledWith("loading", true);
    expect(mockApi.dispatchEvent).toHaveBeenCalledWith({
      type: "gridFetchingData",
      isGridFetchingData: true,
    });
    expect(queryGroupMessages).toHaveBeenCalledWith({
      filter: {
        Major_Version: 1,
        Value_Date: "2025-04-20",
      },
      pagination: { pageNo: 0, pageSize: 1000 },
    });
    expect(queryCounterPartyDetailsList).toHaveBeenCalledWith(["fm1", "be1"]);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "groupBlotter/setBlotterPagination",
      payload: { lastPage: false },
    });
    expect(result).toEqual([
      {
        Id: "1",
        Counterparty_Fm_Id: "fm1",
        Booking_Entity_Id: "be1",
        Client_Domicile_Country: undefined,
        Counterparty_Fm_Code: undefined,
        Booking_Entity_Fm_Code: undefined,
      },
    ]);
  });

  it("should return existing data on failure", async () => {
    (queryGroupMessages as jest.Mock).mockRejectedValue(new Error("Network error"));

    mockGetState.mockReturnValue({
      groupBlotter: {
        quickSearch: {},
        blotterDatas: [{ Id: "1" }],
        blotterPagination: { pageNo: 0, lastPage: false },
        fmIdDetailMapping: {},
        blotterGridEvent: { api: mockApi },
      },
    });

    const result = await triggerSearch("initial")(mockDispatch, mockGetState);

    expect(mockApi.setGridOption).toHaveBeenCalledWith("loading", true);
    expect(mockApi.dispatchEvent).toHaveBeenCalledWith({
      type: "gridFetchingData",
      isGridFetchingData: true,
    });
    expect(queryGroupMessages).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: "groupBlotter/setBlotterDatas",
    });
    expect(result).toEqual([{ Id: "1" }]);
  });

  it("should handle 'next' type and append new data", async () => {
    const mockResponse = {
      groupMessages: {
        pageInfo: { lastPage: true },
        results: [{ Id: "2", Counterparty_Fm_Id: "fm2", Booking_Entity_Id: "be2" }],
      },
    };

    (queryGroupMessages as jest.Mock).mockResolvedValue(mockResponse);

    mockGetState.mockReturnValueOnce({
      groupBlotter: {
        quickSearch: {},
        blotterDatas: [{ Id: "1" }],
        blotterPagination: { pageNo: 0, lastPage: false },
        fmIdDetailMapping: {},
        blotterGridEvent: { api: mockApi },
        blotterQueryId: 0,
      },
    }).mockReturnValue({
      groupBlotter: {
        blotterQueryId: 1,
      }
    });

    const result = await triggerSearch("next")(mockDispatch, mockGetState);

    expect(queryGroupMessages).toHaveBeenCalledWith({
      filter: {},
      pagination: { pageNo: 1, pageSize: 1000 },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "groupBlotter/setBlotterQueryId",
      payload: 1,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "groupBlotter/setBlotterPagination",
      payload: { lastPage: true },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "groupBlotter/setBlotterDatas",
      payload: [
        { Id: "1" },
        { Id: "2", Counterparty_Fm_Id: "fm2", Booking_Entity_Id: "be2" },
      ],
    });
    expect(result).toEqual([
      { Id: "1" },
      { Id: "2", Counterparty_Fm_Id: "fm2", Booking_Entity_Id: "be2" },
    ]);
  });

  it("should return empty array if 'next' type and lastPage is true", async () => {
    mockGetState.mockReturnValue({
      groupBlotter: {
        quickSearch: {},
        blotterDatas: [{ Id: "1" }],
        blotterPagination: { pageNo: 0, lastPage: true },
        fmIdDetailMapping: {},
        blotterGridEvent: { api: mockApi },
      },
    });

    const result = await triggerSearch("next")(mockDispatch, mockGetState);

    expect(mockApi.setGridOption).not.toHaveBeenCalled();
    expect(queryGroupMessages).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
  
  it("should handle if resp is null", async () => {
    (queryGroupMessages as jest.Mock).mockResolvedValue(null);

    mockGetState.mockReturnValue({
      groupBlotter: {
        quickSearch: {},
        blotterDatas: [{ Id: "1" }],
        blotterPagination: { pageNo: 0, lastPage: false },
        fmIdDetailMapping: {},
        blotterGridEvent: { api: mockApi },
      },
    });

    await triggerSearch("next")(mockDispatch, mockGetState);

    expect(queryGroupMessages).toHaveBeenCalledWith({
      filter: {},
      pagination: { pageNo: 1, pageSize: 1000 },
    });
  });
});