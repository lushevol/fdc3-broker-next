import { fireEvent, render, screen } from "@testing-library/react";
import "../../ratanstatic";
import { conversionCascaderOptions } from "../../ratanutils/conversion";
import FilterSelectorComp from "./filterSelectorComp";
import useController from "./useController";
import transaction_data from './transaction_data.json';
import React from "react";
import { handleNullValue } from "./FilterBuilderNext";
import ratanConfig from "../../ratanstatic";

afterAll(() => {
  vi.clearAllMocks();
});

let FILTER_FIELDS;
let CASCADER_OPTIONS;
beforeEach(() => {
  FILTER_FIELDS = transaction_data;
  CASCADER_OPTIONS = conversionCascaderOptions(FILTER_FIELDS);
});

vi.mock('../../ratanutils/http/api', () => {
  const res1 = async () => Promise.resolve([]);
  return {
    getFilterList: res1,
    getFilterDetails: res1,
    putUpdateFilter: res1,
    postSaveFilter: res1,
    deleteFilter: res1,
  };
});

vi.mock("../RatanFilterBuilder/ReactQueryBuilder", () => {
  return { default: () => <div></div> }
})

const filterFieldType = 'TRADE_FILTER_BUILDER';
const bodyDefaultValue = [
  { field: ['EVENT', 'Trade_Event.Event_Id'], operator: 'EQ', values: '444', name: 'TextInput' },
];
const defaultState = {
  temporaryFilter: {
    body: [
      { field: ['Entity', 'Person', 'Coverage_Marketer_PSID'], operator: 'EQ', values: '', name: 'TextInput' },
      { field: ['Instrument_Common', 'Contract_Code'], operator: 'EQ', values: '', name: 'TextInput' },
      { field: ['Trade_Id'], operator: 'EQ', values: '', name: 'TextInput' },
      {
        field: ['Forward_Future_Instrument', 'FX_Leg', 'Near_Leg', 'Exchanged_Currency1_Receiver_Party_Reference'],
        operator: 'EQ',
        values: '',
        name: 'TextInput',
      },
      {
        field: ['A', 'B', 'C', 'D', 'E'],
        operator: 'EQ',
        values: '',
        name: 'TextInput',
      },
    ],
  },
  filterList: {
    TRADE_FILTER_BUILDER: [
      {
        type: 'TRADE_FILTER_BUILDER',
        name: 'Test1',
      },
    ],
  },
};
const searchFunction = vi.fn((filter, callback) => callback && callback(true));
const switchSearch = 'filterSelector';

const Comp = (props) => {
  const {
    openBuilder, setOpenBuilder,
    isLoading, setIsLoading,
    messageApi, messageContextHolder,
    state, dispatch,
    filterList, currentFilter,
    setFilterFields,
    delFilter,
    search,
    clear,
    changeFilter,
    close,
  } = useController(props);


  React.useEffect(() => {
    setOpenBuilder([{
      body: [{ field: ['Entity', 'Person', 'Coverage_Marketer_PSID'], operator: 'EQ', values: '', name: 'TextInput' }],
      isPublic: "true",
      name: "1233333",
      owner: "1243644",
      rowKey: "cca6454b-2df4-4a2f-b116-3d792347cb21",
      type: "TRADE_FILTER_BUILDER"
    }]);
    changeFilter("dummy");
    dispatch({
      type: "UPDATE_FILTERS", data: [{
        field: ['A', 'B', 'C', 'DD', 'F'],
        operator: 'EQ',
        values: '',
        name: 'TextInput',
      }]
    });
    dispatch({ type: "UPDATE_CURRENT_FILTER", data: null });
    dispatch({ type: "RESET_TEMPORARY_FILTER" });
    //search();
    clear(true);
    clear(false);
    //delFilter();
    close();
  }, [])

  return (
    <FilterSelectorComp {...props} />
  )
}

describe("FilterSelector component", () => {
  // ADO timeout error
  it("create new", async () => {
   const {getByText, findByTestId,debug, getByTestId } = render(<Comp
      filterFieldType={filterFieldType}
      bodyDefaultValue={defaultState.temporaryFilter.body}
      initState={defaultState}
      CASCADER_OPTIONS={CASCADER_OPTIONS}
      FILTER_FIELDS={FILTER_FIELDS}
      searchFunction={searchFunction}
      switchSearch={switchSearch}
    />);
    expect(screen).toBeDefined();
    findByTestId('clearBtn');
    findByTestId('filtersCreate');
    fireEvent.click(getByTestId('filtersCreate'))
    findByTestId('filterNameInput')
  });

  it("should be in the document", () => {
    render(<Comp
      filterFieldType={filterFieldType}
      bodyDefaultValue={bodyDefaultValue}
      CASCADER_OPTIONS={CASCADER_OPTIONS}
      FILTER_FIELDS={FILTER_FIELDS}
      searchFunction={searchFunction}
      switchSearch={switchSearch}
    />);
    expect(screen).toBeDefined();
  });

  it("should be in the document 2", () => {
    ratanConfig.enableFeatureForPage ??= {};
    ratanConfig.enableFeatureForPage.Filter_Builder_Next = ['TRADE_FILTER_BUILDER'];
    render(<Comp
      filterFieldType={filterFieldType}
      bodyDefaultValue={bodyDefaultValue}
      CASCADER_OPTIONS={CASCADER_OPTIONS}
      FILTER_FIELDS={FILTER_FIELDS}
      searchFunction={searchFunction}
      switchSearch={switchSearch}
    />);
    expect(screen).toBeDefined();

    const searchBtn = screen.getByText('Search');
    fireEvent.click(searchBtn);
  })

  it("handleNullValue", () => {
    const newQuery = {
      rules: [
        {
          field: "xx",
          value: ""
        }
      ]
    }
    const rawFields = [
      {
        indexedTerm: "xx",
        datatType: "number"
      }
    ]
    const result = handleNullValue(newQuery, rawFields);
    expect(JSON.stringify(result)).toEqual("{\"rules\":[{\"field\":\"xx\",\"value\":\"\",\"operator\":\"null\"}]}")
  })
});
