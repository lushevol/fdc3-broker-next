import { getFilters, getFilter, saveFilter, removeFilter, reducer, defaultState } from "./store";
import { getFilterList, getFilterDetails, putUpdateFilter, postSaveFilter, deleteFilter } from "../../ratanutils/http/api";
import { getUser } from "../../ratanutils/authenticator";
import { getEnable } from "../../ratanutils/componentEnabling";

jest.mock("../../ratanutils/http/api");
jest.mock("../../ratanutils/authenticator");
jest.mock("../../ratanutils/componentEnabling");

describe("store.ts", () => {
  describe("getFilters", () => {
    it("should fetch and sort filters", async () => {
      const mockFilters = [
        { name: "B", body: "{}" },
        { name: "A", body: "{}" },
      ];
      (getFilterList as jest.Mock).mockResolvedValue(mockFilters);
      (getUser as jest.Mock).mockReturnValue({ id: "123", role: "admin" });
      (getEnable as jest.Mock).mockReturnValue(true);

      const result = await getFilters("testType");

      expect(getFilterList).toHaveBeenCalledWith({
        type: "testType",
        creator: "123",
        assignee: "admin",
        moduleOwner: "admin",
        searchAll: true,
      });
      expect(result.testType).toEqual([
        { name: "A", body: {} },
        { name: "B", body: {} },
      ]);

      (getEnable as jest.Mock).mockReturnValue(true);
      const result2 = await getFilters("testType");
    });

    it("should fetch and sort filters", async () => {
      const mockFilters = [
        { name: "A", body: "{}" },
        { body: "{}" },
        { name: "B", body: "{}" },
      ];
      (getFilterList as jest.Mock).mockResolvedValue(mockFilters);
      (getUser as jest.Mock).mockReturnValue({ id: "123", role: "admin" });
      (getEnable as jest.Mock).mockReturnValue(false);

      const result = await getFilters("testType");

      expect(getFilterList).toHaveBeenCalledWith({
        type: "testType",
        owner: "123",
        searchAll: true,
      });
      expect(result.testType).toEqual([
        { body: {} },
        { name: "A", body: {} },
        { name: "B", body: {} },
      ]);

    });
  });

  describe("getFilter", () => {
    it("should fetch filter details and parse body", async () => {
      const mockFilter = { body: '{"key":"value"}' };
      (getFilterDetails as jest.Mock).mockResolvedValue(mockFilter);

      const result = await getFilter("rowKey123", "testType");

      expect(getFilterDetails).toHaveBeenCalledWith("rowKey123", "testType");
      expect(result.body).toEqual({ key: "value" });
    });
  });

  describe("saveFilter", () => {
    it("should save a new filter", async () => {
      (postSaveFilter as jest.Mock).mockResolvedValue({});
      (getUser as jest.Mock).mockReturnValue({ id: "123" });
      (getEnable as jest.Mock).mockReturnValue(false);

      const params = {
        rowKey: false,
        name: "Test Filter",
        assigneeList: ["user1"],
        moduleOwner: "owner1",
        body: { key: "value" },
        filterFieldType: "testType",
      };

      await saveFilter(params);

      expect(postSaveFilter).toHaveBeenCalledWith({
        name: "Test Filter",
        owner: "123",
        body: JSON.stringify({ key: "value" }),
        type: "testType",
        isPublic: false,
      });
    });

    it("should save a new filter, rowKey existed", async () => {
      (putUpdateFilter as jest.Mock).mockResolvedValue({});
      (getUser as jest.Mock).mockReturnValue({ id: "123" });
      (getEnable as jest.Mock).mockReturnValue(true);

      const params = {
        rowKey: "test",
        name: "Test Filter",
        assigneeList: ["user1"],
        moduleOwner: "owner1",
        body: { key: "value" },
        filterFieldType: "testType",
      };

      await saveFilter(params);

      expect(putUpdateFilter).toHaveBeenCalledWith("test", {
        assigneeList: ["user1"],
        name: "Test Filter",
        creator: "123",
        body: JSON.stringify({ key: "value" }),
        type: "testType",
        moduleOwner: "owner1",
        isPublic: false,
      });
    });

    
  });

  describe("removeFilter", () => {
    it("should remove a filter", async () => {
      (deleteFilter as jest.Mock).mockResolvedValue({});
      (getUser as jest.Mock).mockReturnValue({ id: "123" });
      (getEnable as jest.Mock).mockReturnValue(false);

      await removeFilter({ rowKey: "rowKey123", moduleOwner: "owner1" }, "testType");

      expect(deleteFilter).toHaveBeenCalledWith("rowKey123", "testType");

      (getEnable as jest.Mock).mockReturnValue(true);
      await removeFilter({ rowKey: "rowKey123", moduleOwner: "owner1" }, "testType");
      expect(deleteFilter).toHaveBeenCalledWith({ rowKey: "rowKey123",creator:"123", moduleOwner: "owner1" }, "testType");
    });
  });

  describe("reducer", () => {
    it("should update filters", () => {
      const action = { type: "UPDATE_FILTERS", data: { testType: [] } };
      const newState = reducer(defaultState, action);

      expect(newState.filterList).toEqual({ testType: [] });
    });

    it("should update current filter", () => {
      const action = { type: "UPDATE_CURRENT_FILTER", data: { name: "Test Filter" } };
      const newState = reducer(defaultState, action);

      expect(newState.currentFilter).toEqual({ name: "Test Filter" });
      expect(newState.temporaryFilter).toEqual({ name: "Test Filter" });

      const action2 = { type: "UPDATE_CURRENT_FILTER" };
      const newState2 = reducer(defaultState, action2);
      expect(newState2.temporaryFilter).toEqual({});
    });

    it("should update temp filter", () => {
      const action = { type: "UPDATE_TEMPORARY_FILTER", data: { name: "Test Filter" } };
      const newState = reducer(defaultState, action);

      expect(newState.temporaryFilter).toEqual({ name: "Test Filter" });
    });

    it("should reset temporary filter", () => {
      const action = { type: "RESET_TEMPORARY_FILTER" };
      const state = { ...defaultState, bodyDefaultValue: { key: "default" } };
      const newState = reducer(state, action);

      expect(newState.temporaryFilter).toEqual({ body: { key: "default" } });
    });

    it("should add a filter", () => {
      const action = { type: "ADD_FILTER", data: { type: "testType", name: "New Filter" } };
      const state = { ...defaultState, filterList: { testType: [] } };
      const newState = reducer(state, action);

      expect(newState.filterList.testType).toEqual([{ type: "testType", name: "New Filter" }]);
    });

    it("should change a filter", () => {
      const action = { type: "CHANGE_FILTER", data: { type: "testType", rowKey:"rowKey123", name: "New Filter" } };

      const state = { ...defaultState, filterList: { testType: [{
        rowKey: "rowKey123", type: "testType", name: "Old Filter"
      }] } };
      const newState = reducer(state, action);

      expect(newState.filterList.testType).toEqual([{ type: "testType",   rowKey: "rowKey123", name: "New Filter" }]);

      const action2 = { type: "CHANGE_FILTER", data: { type: "testType", rowKey:"rowKey", name: "New Filter" } };

      const newState2 = reducer(state, action2);
      expect(newState.filterList.testType).toEqual([{ type: "testType",   rowKey: "rowKey123", name: "New Filter" }]);

    });

    it("should remove a filter", () => {
      const action = { type: "REMOVE_FILTER", data: { filterFieldType: "testType", rowKey: "rowKey123" } };
      const state = { ...defaultState, filterList: { testType: [{ rowKey: "rowKey123" }] } };
      const newState = reducer(state, action);

      expect(newState.filterList.testType).toEqual([]);

      const action2 = { type: "NONE", data: { filterFieldType: "testType", rowKey: "rowKey123" } };
      const newState2 = reducer({}, action2);
      expect(newState2).toEqual({})
    });
  });
});