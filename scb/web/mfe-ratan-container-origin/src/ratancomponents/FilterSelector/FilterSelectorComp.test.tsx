
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterSelectorComp, { handleCurrentView } from './filterSelectorComp';

jest.mock("../RatanFilterBuilder/ReactQueryBuilder", () => {
  return () => <div></div>
})

const mockRes = [
    {
        "rowKey": "87b6b862-4f7e-40ec-891e-eca18d73d62f",
        "name": "444",
        "body": [
            {
                "field": [
                    "Entity",
                    "Person",
                    "Coverage_Marketer_PSID"
                ],
                "operator": "EQ",
                "values": "4",
                "name": "TextInput"
            },
            {
                "field": [
                    "Instrument_Common",
                    "Contract_Code"
                ],
                "operator": "EQ",
                "values": "4",
                "name": "TextInput"
            }
        ],
        "creator": "1243644",
        "type": "TRADE_FILTER_BUILDER",
        "isPublic": false,
        "moduleOwner": null,
        "assignee": null,
        "assigneeList": null
    },
    {
        "rowKey": "d21217ab-3818-4354-9e6f-c6e372b9a5c6",
        "name": "judy_testv2_02",
        "body": [
            {
                "field": [
                    "Entity",
                    "Person",
                    "Coverage_Marketer_PSID"
                ],
                "operator": "EQ",
                "values": "123",
                "name": "TextInput"
            }
        ],
        "creator": "1243644",
        "type": "TRADE_FILTER_BUILDER",
        "isPublic": false,
        "moduleOwner": null,
        "assignee": null,
        "assigneeList": null
    },
    {
        "rowKey": "304f8f41-b787-4ac2-bdb4-1263b32e73f5",
        "name": "judy_v2_test",
        "body": [
            {
                "field": [
                    "Entity",
                    "Person",
                    "Coverage_Marketer_PSID"
                ],
                "operator": "EQ",
                "values": "123123123",
                "name": "TextInput"
            }
        ],
        "creator": "1243644",
        "type": "TRADE_FILTER_BUILDER",
        "isPublic": false,
        "moduleOwner": null,
        "assignee": null,
        "assigneeList": null
    },
    {
        "rowKey": "c83d7af1-3d50-433e-a046-26a091b655ef",
        "name": "test111",
        "body": [
            {
                "field": [
                    "Entity",
                    "Person",
                    "Coverage_Marketer_PSID"
                ],
                "operator": "EQ",
                "values": "1111",
                "name": "TextInput"
            }
        ],
        "creator": "1632093",
        "type": "TRADE_FILTER_BUILDER",
        "isPublic": false,
        "moduleOwner": "FMO_OPS_SUP",
        "assignee": null,
        "assigneeList": "FMO_OPS,FMO_MO,FMO_MO_SUP"
    }
];

jest.mock("../../ratanutils/http/api",()=>{
    const getFilterList= jest.fn(()=>Promise.resolve(mockRes))
    const getFilterDetails = jest.fn();
    const putUpdateFilter = jest.fn();
    const postSaveFilter = jest.fn();
    const deleteFilter = jest.fn();
    return {
        getFilterList,
        getFilterDetails,
        putUpdateFilter,
        postSaveFilter,
        deleteFilter
    }
  })
  
const props = {
    filterFieldType: "TRADE_FILTER_BUILDER",
    bodyDefaultValue: [
        {
            "field": [
                "Entity",
                "Person",
                "Coverage_Marketer_PSID"
            ],
            "operator": "EQ",
            "values": "",
            "name": "TextInput"
        },
        {
            "field": [
                "Instrument_Common",
                "Contract_Code"
            ],
            "operator": "EQ",
            "values": "",
            "name": "TextInput"
        }
    ],
    CASCADER_OPTIONS: [
        {
            "label": "-- Add Filter --",
            "value": ""
        },
        {
            "label": "Data Flow",
            "value": "Data_Flow",
            "children": [
                {
                    "label": "Data Publication Date Time",
                    "value": "Data_Publication_Date_Time",
                    "context": "CASHBALANCE_DATA,CASHFLOW_DATA,COLLATERAL_DATA,CONFIRMATION_DATA,FIXING_DATA,INSTRUMENT_DATA,LEGAL_AGREEMENT_DATA,MARKET_DATA,PORTFOLIO_DATA,PRETRADE_DATA,SETTLEMENT_INSTRUCTION_DATA,TRANSACTION_DATA,VALUATION_DATA",
                    "blotterContext": [
                        "CONFIRMATION_DATA",
                        "INSTRUMENT_DATA",
                        "COLLATERAL_DATA",
                        "CASHFLOW_DATA",
                    ],
                    "type": "datePicker",
                    "operatorsSupp": "==,!=",
                    "valueList": "",
                    "indexedTerm": "Data_Flow.Data_Publication_Date_Time"
                },
                {
                    "label": "Data Publication Id",
                    "value": "Data_Publication_Id",
                    "context": "CASHBALANCE_DATA,CASHFLOW_DATA,CONFIRMATION_DATA,FIXING_DATA,TRANSACTION_DATA",
                    "blotterContext": [
                        "CONFIRMATION_DATA",
                        "TRANSACTION_DATA",
                        "CASHFLOW_DATA"
                    ],
                    "type": "freeText",
                    "operatorsSupp": "==,!=",
                    "valueList": "",
                    "indexedTerm": "Data_Flow.Data_Publication_Id"
                },
            ]
        }
    ],
    FILTER_FIELDS: [
        {
            "indexedTerm": "Data_Flow.Data_Publication_Id",
            "businessTerm": "",
            "dataType": "String",
            "subSelection": "Trade",
            "context": "CONFIRMATION_DATA,TRANSACTION_DATA",
            "displayStyle": "freeText",
            "valueList": "",
            "operators": "EQ",
            "operatorsSupp": "==,!=",
            "detailsFixed": true,
            "dynamicList": false,
            "disabledView": false,
            "disabledFilter": false,
            "scope": "{\"disabledBlotter\":[],\"enabledQueryResult\":[],\"version\":\"v1.0.0\"}",
            "detailsGroup": "",
            "seq": 1,
            "blotterContext": [
                "CONFIRMATION_DATA",
                "TRANSACTION_DATA"
            ],
            "colDefs": {
                "hide": false,
                "pinned": "right",
                "lockPinned": true
            }
        }
    ],
};

jest.mock('./useController', () => ({
  __esModule: true,
  default: (props) => ({
    openBuilder: [],
    setOpenBuilder: jest.fn(),
    isLoading: false,
    messageApi: {},
    messageContextHolder: null,
    state: {
      temporaryFilter: {
        rowKey: 'd23fsdf',
        name: 'test-filter',
        body: {}
      }
    },
    dispatch: jest.fn(),
    filterList: {[props.filterFieldType]: mockRes},
    currentFilter: null,
    clear: jest.fn(),
    changeFilter: jest.fn(() => {
      props.onSelectName()
    }),
    close: jest.fn(),
  }),
}));

describe('FilterSelectorComp', () => {
  const defaultProps = {
    name: 'test',
    filterFieldType: props.filterFieldType,
    variableConfig: {
        date: ["DATE_VAR"]
    },
    CASCADER_OPTIONS: props.CASCADER_OPTIONS,
    FILTER_FIELDS: props.FILTER_FIELDS,
    customHandleOperators: jest.fn(),
    onSelectName: jest.fn(),
    setNameList: jest.fn(),
    searchFunction: jest.fn(),
    onSavedFilter: jest.fn(),
    onClose: jest.fn(),
    isCashflowSettlementCN: false,
    bodyDefaultValue: {},
    switchSearch: 'test-search',
    onClosedFilter: jest.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
        <FilterSelectorComp {...defaultProps} {...props} />
    );
  };

  it('should render without crashing', async () => {
    renderComponent();
    expect(await screen.findByTestId('selectFilter')).toBeInTheDocument();
  });


  it('should render create/modify button', () => {
    renderComponent();
    const createButton = screen.getByTestId('filtersCreate');
    expect(createButton).toBeInTheDocument();
    expect(createButton).toBeEnabled();
  });

  it('should enable clear button when filter is selected', () => {
    renderComponent({
      currentFilter: { rowKey: 'testKey', name: 'testFilter' },
    });
    const clearButton = screen.getByTestId('clearBtn');
    expect(clearButton).toBeEnabled();
  });

  it('should disable clear button when no filter is selected', async () => {
    renderComponent();
    const select = await screen.findByTestId('selectFilter');
    fireEvent.mouseDown(select.firstElementChild as Element);
    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByRole('option')[0]);
    expect(defaultProps.onSelectName).toBeCalled();
  })
});

describe('handleCurrentView', () => {
    it('should not call clear or onSelectName when currentFilter is null', () => {
      const clear = jest.fn();
      const onSelectName = jest.fn();
  
      handleCurrentView(null, 'testName', clear, onSelectName);
  
      expect(clear).not.toHaveBeenCalled();
      expect(onSelectName).not.toHaveBeenCalled();
    });
  
    it('should call clear when currentFilter.name is empty', () => {
      const clear = jest.fn();
      const onSelectName = jest.fn();
  
      handleCurrentView({ name: '' }, 'testName', clear, onSelectName);
  
      expect(clear).toHaveBeenCalledWith(false);
      expect(onSelectName).toHaveBeenCalled();
    });
  
    it('should not call onSelectName when currentFilter.name is the same as name', () => {
      const clear = jest.fn();
      const onSelectName = jest.fn();
  
      handleCurrentView({ name: 'testName' }, 'testName', clear, onSelectName);
  
      expect(clear).not.toHaveBeenCalled();
      expect(onSelectName).not.toHaveBeenCalled();
    });
  
    it('should call onSelectName when currentFilter.name is different from name', () => {
      const clear = jest.fn();
      const onSelectName = jest.fn();
  
      handleCurrentView({ name: 'differentName' }, 'testName', clear, onSelectName);
  
      expect(clear).not.toHaveBeenCalled();
      expect(onSelectName).toHaveBeenCalledWith('differentName');
    });
  });