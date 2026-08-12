import {
  convertAdvancedSearch2Filters,
  convertCounterPartySearch2Filter,
  convertQuickFilter2Filters} from "./utils";

afterAll(() => {
  jest.clearAllMocks();
});

jest.mock("src/Root/import/ratancomponents", () => {
  return {
    hydrate: jest.fn(() => {
      return {
        rules: [
          {
            field: "Country",
            value: "CHINA",
            operator: "=",
          },
          {
            field: "Entity.Counterparty_Client_Type",
            value: "BANK",
            operator: "=",
          },
          {
            field: "Cashflow.Cashflow_State",
            value: "PROJECTED",
            operator: "=",
          },
        ],
        combinator: "and",
      };
    }),
  };
});

describe("Utils component", () => {
  it("convertAdvancedSearch2Filters", async () => {
    const advancedSearch = {
      appliedFilter: {
        rowKey: "DEFAULT_CREATING_FILTER_KEY",
        name: "",
        body: '{"rules":[{"field":"Country","value":"CHINA","operator":"="},{"field":"Entity.Counterparty_Client_Type","value":"BANK","operator":"="},{"field":"Cashflow.Cashflow_State","value":"PROJECTED","operator":"="}],"combinator":"and"}',
        owner: "1639796",
        creator: "1639796",
        type: "STRATEGIC_CASHFLOW_DASHBORD_FILTER_BUILDER",
        isPublic: false,
        moduleOwner: "",
        assignee: "",
        assigneeList: "",
        updateFlag: "",
      },
    };
    const filters = convertAdvancedSearch2Filters(advancedSearch);
    expect(filters[0]).toHaveProperty('operator','IN');
    expect(filters[1]).toHaveProperty('operator','EQ');

    const nullFliters = convertAdvancedSearch2Filters({appliedFilter:null});
    expect(nullFliters).toEqual([]);
  });
  it("convertQuickFilter2Filters", async () => {
    const quickSearch = {
      Country: ["CHINA"],
      "Entity.Booking_Entity_SCI_FMID": ["id1", "id2"]
    };
    const filters = convertQuickFilter2Filters(quickSearch);
    expect(filters[0]).toHaveProperty('operator','IN');
    expect(filters[1]).toHaveProperty('operator','IN');
  });
});
describe("convertCounterPartySearch2Filter", () => {
  it("should convert counterparty search input to filter", () => {
    const cpInput = "10036642, 400899993";
    const expectedFilter = {
      field: "Entity.Counterparty_SCI_FMID",
      operator: "IN",
      values: ["10036642", "400899993"],
    };

    const result = convertCounterPartySearch2Filter(cpInput);

    expect(result).toEqual(expectedFilter);
  });

  it("should convert counterparty search input with codes to filter", () => {
    const cpInput = "SCB SHANGH*SHA, SCB CN CHO*CHO";
    const expectedFilter = {
      field: "Entity.Counterparty_SCI_FMCODE",
      operator: "IN",
      values: ["SCB SHANGH*SHA", "SCB CN CHO*CHO"],
    };

    const result = convertCounterPartySearch2Filter(cpInput);

    expect(result).toEqual(expectedFilter);
  });
});