import { dynamicDefaultFilter, operators, defaultFilter, judgeProduct, setSearchFilter, convertSettlemntDate, handleMultiFieldsQuery, replaceDefaultFilter } from './setDefaultFilter';
import tradesConfig from "../ratanstatic/ratanConfig/local/tradesConfig.json";
import tradesDetailsConfig from "../ratanstatic/ratanConfig/local/tradeDetailsConfig.json";
import tradesQuickSearchConfig from "../ratanstatic/ratanConfig/local/tradesQuickSearchConfig.json";
const PRODUCT_TYPE: string[] = tradesQuickSearchConfig.quickSearchItems[5].valueList?.map(item => item.value) || []
afterAll(() => {
  vi.clearAllMocks();
});

beforeEach(() => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {},
  writable: true,
})
});
test('operators', () => {
  expect(operators.BET({
    field: "Data_Flow.Data_Source_System",
    operator: "EQ",
    values: "Blade",
    label: "a",
  })).toEqual("(\\\"Data_Flow.Data_Source_System\\\" >= 'B' and \\\"Data_Flow.Data_Source_System\\\" <= 'l')");
  expect(operators.IN({
    field: "Data_Flow.Data_Source_System",
    operator: "IN",
    values: ["Blade", "x"],
    label: "a",
  })).toEqual("\\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'x')");
  expect(operators.NOTIN({
    field: "Data_Flow.Data_Source_System",
    operator: "NOTIN",
    values: ["Blade", "x"],
    label: "a",
  })).toEqual("\\\"Data_Flow.Data_Source_System\\\" NOT IN ('Blade', 'x')");
});


test('dynamicDefaultFilter', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      trades: {
        ...tradesConfig,
        ...tradesDetailsConfig,
        ...tradesQuickSearchConfig,
        defaultFilter: "\\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX')",
        productSource:{
          fxSource: {
            "Data_Flow.Data_Source_System": ["Blade", "S2BX", "CFETS"],
            "Instrument_Common.ISDA_Taxonomy": [
              "ForeignExchange:Spot",
              "ForeignExchange:Forward",
              "ForeignExchange:Swap",
              "ForeignExchange:VanillaOption",
              "ForeignExchange:SimpleExotic:Digital",
              "ForeignExchange:NDF"
            ]
          },
          scfSource: {
            "Data_Flow.Data_Source_System": ["Blade", "S2BX", "CFETS"],
            "Instrument_Common.Primary_Asset_Class": ["Cash"]
          },
        }
    }
  },
    writable: true,
});
  dynamicDefaultFilter([]);
  defaultFilter();
});
test('defaultFilter with no defaultFilter', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      trades: {
        ...tradesDetailsConfig,
        ...tradesQuickSearchConfig,
        productSource:{
          fxSource: {
            "Data_Flow.Data_Source_System": ["Blade", "S2BX", "CFETS"],
            "Instrument_Common.ISDA_Taxonomy": [
              "ForeignExchange:Spot",
              "ForeignExchange:Forward",
              "ForeignExchange:Swap",
              "ForeignExchange:VanillaOption",
              "ForeignExchange:SimpleExotic:Digital",
              "ForeignExchange:NDF"
            ]
          },
          scfSource: {
            "Data_Flow.Data_Source_System": ["Blade", "S2BX", "CFETS"],
            "Instrument_Common.Primary_Asset_Class": ["Cash"]
          },
        }
    }
  },
    writable: true,
});
  dynamicDefaultFilter([]);

  const data: Filter[] = [
    {
      field: "Data_Flow.Data_Source_System",
      operator: "EQ",
      values: "Blade",
      label: "a",
    },
  ]
  
  defaultFilter();
});

test('dynamicDefaultFilter with defaultFilter', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      trades: {
        ...tradesDetailsConfig,
        ...tradesQuickSearchConfig,
        productSource:{
          sourceA:{
            filedA: ['value1', 'value2'],
            fieldB: ['value3', 'value4'],
        },
        sourceB:{
          filedC: ['value1', 'value2'],
          fieldD: ['value3', 'value4'],
      },
      },
        defaultFilter: 'default_filter_string'
    }
  },
    writable: true,
});
const inputFilters = [
  {
    field: 'PRODUCT_TYPE',
    operator: 'IN',
    values: ['sourceA-filedA-value1', 'sourceA-filedB-value3']
  },
  {
    field: 'filedA',
    operator: 'EQ',
    values: ["filedA","filedB"],
  },
  {
    field: 'Murex_Trade_Id',
    operator: 'EQ',
    values: "test",
  },
  {
    field: 'otherField',
    operator: 'EQ',
    values: 'otherValue'
  }
];
  dynamicDefaultFilter(inputFilters);
});

test('dynamicDefaultFilter', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      trades: {
        ...tradesConfig,
        ...tradesDetailsConfig,
        ...tradesQuickSearchConfig,
        customSearchFilter: [
          {
            "field": "Entity.Person.Trader_PSID",
            "filterText": "(\\\"Entity.Person.Trader_PSID\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX')) or (\\\"Entity.Person.Trader_Source_System_Person_Id\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" = 'S2BX')",
            "combineField": "Entity.Person.Trader_Source_System_Person_Id"
          }
        ],
      }
    },
    writable: true
  });

  dynamicDefaultFilter([]);
  defaultFilter();
  const data: Filter[] = [
    {
      field: "Data_Flow.Data_Source_System",
      operator: "EQ",
      values: "Blade",
      label: "a",
    },
    {
      field: "Trade_Id",
      operator: "IN",
      values: ["a", "b"],
      label: "a",
    },
    {
      field: "Trade_Id",
      operator: "LIKE",
      values: "a",
      label: "a",
    },
    {
      field: "PRODUCT_TYPE",
      operator: "EQ",
      values: [...PRODUCT_TYPE],
      label: "a",
    },
    {
      field: "Data_Flow.Data_Sender",
      operator: "EQ",
      values: ["BCSSTELLA"],
      label: "a",
    },
    {
      field: "Data_Flow.Data_Sender",
      operator: "EQ",
      values: ["BCSSTELLA"],
      label: "a",
    },
    {
      field: "Instrument_Common.Source_System_Instrument_Sub_Type",
      operator: "EQ",
      values: [
        "OTC Option",
        "Accumulator Swap",
        "Equity Swap"
      ],
      label: "a",
    },
    {
      field: "Instrument_Common.Source_System_Instrument_Sub_Type",
      operator: "EQ",
      values: [
        "OTC Option",
        "Accumulator Swap",
        "Equity Swap"
      ],
      label: "a",
    },
    {
      field: "Instrument_Common.Source_System_Instrument_Sub_Type",
      operator: "EQ",
      values: ["OTC Option"],
      label: "a",
    },
    {
      field: "Entity.Person.Trader_PSID",
      operator: "EQ",
      values: "testPSID",
      label: "test",
    },
  ]
  dynamicDefaultFilter(data);
  setSearchFilter([], "(\"Data_Flow.Data_Source_System\" IN ('Blade', 'S2BX') and \"Instrument_Common.ISDA_Taxonomy\" IN ('ForeignExchange:Spot', 'ForeignExchange:Forward', 'ForeignExchange:Swap', 'ForeignExchange:VanillaOption', 'ForeignExchange:SimpleExotic:Digital', 'ForeignExchange:NDF')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.Primary_Asset_Class\" = 'Cash') or (\"Data_Flow.Data_Sender\" = 'BCSSTELLA' and \"Instrument_Common.Source_System_Instrument_Sub_Type\" IN ('OTC Option', 'Accumulator Swap', 'Equity Swap')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:IRSwap:FixedFloat', 'InterestRate:IRSwap:FloatFloat', 'InterestRate:IRSwap:OIS')) or (\"Data_Flow.Data_Source_System\" IN ('Blade', 'CFETS') and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:CrossCurrency:Basis', 'InterestRate:CrossCurrency:FixedFloat', 'InterestRate:CrossCurrency:FixedFixed', 'InterestRate:LoanDeposit')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" = 'InterestRate:LoanDeposit')")
  setSearchFilter([{
    field: "PRODUCT_TYPE",
    operator: "EQ",
    values: [...PRODUCT_TYPE],
    label: "a",
  }], "(\"Data_Flow.Data_Source_System\" IN ('Blade', 'S2BX') and \"Instrument_Common.ISDA_Taxonomy\" IN ('ForeignExchange:Spot', 'ForeignExchange:Forward', 'ForeignExchange:Swap', 'ForeignExchange:VanillaOption', 'ForeignExchange:SimpleExotic:Digital', 'ForeignExchange:NDF')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.Primary_Asset_Class\" = 'Cash') or (\"Data_Flow.Data_Sender\" = 'BCSSTELLA' and \"Instrument_Common.Source_System_Instrument_Sub_Type\" IN ('OTC Option', 'Accumulator Swap', 'Equity Swap')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:IRSwap:FixedFloat', 'InterestRate:IRSwap:FloatFloat', 'InterestRate:IRSwap:OIS')) or (\"Data_Flow.Data_Source_System\" IN ('Blade', 'CFETS') and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:CrossCurrency:Basis', 'InterestRate:CrossCurrency:FixedFloat', 'InterestRate:CrossCurrency:FixedFixed', 'InterestRate:LoanDeposit')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" = 'InterestRate:LoanDeposit')")
  setSearchFilter([{ "field": "Trade_Id", "operator": "IN", "values": ["3796461156"] }], "(\"Data_Flow.Data_Source_System\" IN ('Blade', 'S2BX') and \"Instrument_Common.ISDA_Taxonomy\" IN ('ForeignExchange:Spot', 'ForeignExchange:Forward', 'ForeignExchange:Swap', 'ForeignExchange:VanillaOption', 'ForeignExchange:SimpleExotic:Digital', 'ForeignExchange:NDF')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.Primary_Asset_Class\" = 'Cash') or (\"Data_Flow.Data_Sender\" = 'BCSSTELLA' and \"Instrument_Common.Source_System_Instrument_Sub_Type\" IN ('OTC Option', 'Accumulator Swap', 'Equity Swap')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:IRSwap:FixedFloat', 'InterestRate:IRSwap:FloatFloat', 'InterestRate:IRSwap:OIS')) or (\"Data_Flow.Data_Source_System\" IN ('Blade', 'CFETS') and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:CrossCurrency:Basis', 'InterestRate:CrossCurrency:FixedFloat', 'InterestRate:CrossCurrency:FixedFixed', 'InterestRate:LoanDeposit')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" = 'InterestRate:LoanDeposit')")
  setSearchFilter([{ "field": "Trade_Id", "operator": "IN", "values": ["3796461156"] }, { "field": "Entity.Counterparty_Name", "operator": "EQ", "values": "SNAME 10075222" }], "(\"Data_Flow.Data_Source_System\" IN ('Blade', 'S2BX') and \"Instrument_Common.ISDA_Taxonomy\" IN ('ForeignExchange:Spot', 'ForeignExchange:Forward', 'ForeignExchange:Swap', 'ForeignExchange:VanillaOption', 'ForeignExchange:SimpleExotic:Digital', 'ForeignExchange:NDF')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.Primary_Asset_Class\" = 'Cash') or (\"Data_Flow.Data_Sender\" = 'BCSSTELLA' and \"Instrument_Common.Source_System_Instrument_Sub_Type\" IN ('OTC Option', 'Accumulator Swap', 'Equity Swap')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:IRSwap:FixedFloat', 'InterestRate:IRSwap:FloatFloat', 'InterestRate:IRSwap:OIS')) or (\"Data_Flow.Data_Source_System\" IN ('Blade', 'CFETS') and \"Instrument_Common.ISDA_Taxonomy\" IN ('InterestRate:CrossCurrency:Basis', 'InterestRate:CrossCurrency:FixedFloat', 'InterestRate:CrossCurrency:FixedFixed', 'InterestRate:LoanDeposit')) or (\"Data_Flow.Data_Source_System\" = 'Blade' and \"Instrument_Common.ISDA_Taxonomy\" = 'InterestRate:LoanDeposit')")
  setSearchFilter([{ "field": "Cashflow.Cashflow_State", "operator": "NOTIN", "values": ["NETTED", "DEAD"] }], undefined, true);
  setSearchFilter([{ "field": "PRODUCT_TYPE", "operator": "EQ", "values": ["fxSource-Instrument_Common.ISDA_Taxonomy-ForeignExchange:Forward"] }], undefined, true);
  setSearchFilter([{ "field": "SETTLEMENT_DATE", "operator": "BET", "values": ["2023-12-11", "2023-12-22"] }], undefined, true);
  // expect(result5).toBe("searchFilter: \"(\\\"Settlement_Date\\\" >= '2023-12-11' and \\\"Settlement_Date\\\" <= '2023-12-22' or \\\"Swap_Instrument.Forward_Future_Instrument.Near_Leg.Settlement_Date\\\" >= '2023-12-11' and \\\"Swap_Instrument.Forward_Future_Instrument.Near_Leg.Settlement_Date\\\" <= '2023-12-22')\"");
  setSearchFilter([], undefined, false);
  // expect(result6).toBe("searchFilter: \"\"");
  setSearchFilter([], undefined, true);
  // expect(result7).toBe("searchFilter: \"\"");
  setSearchFilter(data,"\\\"testDefault\\\" >= '2023-12-11'", true);
  judgeProduct({
    field: "PRODUCT_TYPE",
    operator: "EQ",
    values: ["fxSource-Instrument_Common.ISDA_Taxonomy-ForeignExchange:Forward"],
    label: "a",
  });
  convertSettlemntDate({
    field: "SETTLEMENT_DATE",
    operator: "BET",
    values: ["2023-12-11", "2023-12-22"],
    label: "a",
  });
});

test("handleMultiFieldsQuery value is array",()=>{
  const data: Filter[] = [
    {
      field: "Trade_Id",
      operator: "LIKE",
      values: "a",
    },
    {
      field: "PRODUCT_TAXONOMY",
      operator: "EQ",
      values: ["Field1/_/Value1", "Field2/_/Value2", "Field2/_/Value3"],
    },
  ];
  const expectedRes = [
    {
      field: "Trade_Id",
      operator: "LIKE",
      values: "a"
    },
    {
      field: "Field1",
      operator: "IN",
      values: ["Value1"]
    },
    {
      field: "Field2",
      operator: "IN",
      values: ["Value2", "Value3"]
    },
  ];
  expect(handleMultiFieldsQuery(data)).toEqual(expectedRes);
});
test("handleMultiFieldsQuery value is string",()=>{
  const data = [
    {
      field: "PRODUCT_TAXONOMY",
      operator: "IN",
      values: "Field1/_/Value1"
    },
    {
      field: "Trade_Id",
      operator: "LIKE",
      values: "Field2/_/Value2",
    },
  ];

  const expectedRes = [
    {
      field: "Field1",
      operator: "EQ",
      values: "Value1"
    },
    {
      field: "Trade_Id",
      operator: "LIKE",
      values: "Field2/_/Value2",
    },
  ];
  expect(handleMultiFieldsQuery(data)).toEqual(expectedRes);
});

describe('judgeProduct', () => {
  it('judgeProduct - Success', () => {
    Object.defineProperty(window, 'ratanConfig', {
      value: {
        trades: {
          productSource:{
            sourceA:{
              filedA: ['value1', 'value2'],
              fieldB: ['value3', 'value4'],
            },
          },
          defaultFilter: 'default_filter_string'
      }
    },
      writable: true,
  });
    const filter = {
      field: 'PRODUCT_TYPE',
      operator: 'IN',
      values: ['sourceA-filedA', 'sourceA-filedB-value3'],
      label: 'a',
    };
    const result = judgeProduct(filter);
    expect(result).toEqual(
      "(\\\"filedA\\\" IN ('value1', 'value2') and \\\"fieldB\\\" IN ('value3', 'value4') and \\\"filedB\\\" IN ('value3'))"
    );
  });
  
  it('judgeProduct - Multiple Products', () => {
    const filter = {
      field: 'PRODUCT_TYPE',
      operator: 'IN',
      values: ['sourceA-filedA-value1', 'sourceB-filedC-value2'],
      label: 'a',
    };
  
    const result = judgeProduct(filter);
  
    expect(result).toEqual(
      "((\\\"filedA\\\" IN ('value1')) or (\\\"filedC\\\" IN ('value2')))"
    );
  })
})

test('should return searchFilter without custom filters', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      trades: {
        customSearchFilter: [
          {
            "field": "Entity.Person.Trader_PSID",
            "filterText": "(\\\"Entity.Person.Trader_PSID\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX', 'CFETS', 'Murex')) or (\\\"Entity.Person.Trader_Source_System_Person_Id\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" = 'S2BX')",
            "combineField": "Entity.Person.Trader_Source_System_Person_Id"
          },
          {
            "field": "Entity.Person.Execution_Marketer_PSID",
            "filterText": "(\\\"Entity.Person.Execution_Marketer_PSID\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX', 'CFETS', 'Murex')) or (\\\"Entity.Person.Execution_Marketer_Source_System_Person_Id\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" = 'S2BX')",
            "combineField": "Entity.Person.Execution_Marketer_Source_System_Person_Id"
          },
        ],
      }
    },
    writable: true
  });

  const filters = [
    {
      field: 'Data_Flow.Data_Source_System',
      operator: 'EQ',
      values: 'Blade',
      label: 'a',
    },
    {
      field: 'Entity.Person.Trader_PSID',
      operator: 'EQ',
      values: 'Murex',
      label: 'PSID',
    },
    {
      field: 'Entity.Person.Execution_Marketer_PSID',
      operator: 'LIKE',
      values: 'a',
      label: 'a',
    },
  ];

  const expected = "searchFilter: \"((\\\"Entity.Person.Trader_PSID\\\" = 'Murex' and \\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX', 'CFETS', 'Murex')) or (\\\"Entity.Person.Trader_Source_System_Person_Id\\\" = 'Murex' and \\\"Data_Flow.Data_Source_System\\\" = 'S2BX')) and ((\\\"Entity.Person.Execution_Marketer_PSID\\\" = 'a' and \\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX', 'CFETS', 'Murex')) or (\\\"Entity.Person.Execution_Marketer_Source_System_Person_Id\\\" = 'a' and \\\"Data_Flow.Data_Source_System\\\" = 'S2BX')) and \\\"Data_Flow.Data_Source_System\\\" = 'Blade'\"";
  const result = setSearchFilter(filters);
  expect(result).toEqual(expected);
});

test('replaceDefaultFilter with IN operator', () => {
  const newFilter: Filter[] = [
    {
      field: "Data_Flow.Data_Source_System",
      operator: "IN",
      values: ["Blade", "S2BX"],
      label: "a",
    },
  ];
  const defaultFilterStr = "\\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX')";
  const result = replaceDefaultFilter(newFilter, defaultFilterStr);
  expect(result).toEqual("\\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX')");
});

describe('dynamicDefaultFilter', () => {
  it('should handle data with PRODUCT_TYPE field', () => {
    Object.defineProperty(window, 'ratanConfig', {
      value: {
        trades: {
          productSource:{
            sourceA:{
              filedA: ['value1', 'value2'],
              fieldB: ['value3', 'value4'],
            },
          },
          defaultFilter: 'default_filter_string'
        }
      },
    });

    const data = [
      {
        field: 'PRODUCT_TYPE',
        operator: 'IN',
        values: ['sourceA-filedA-value1', 'sourceA-filedB-value2','sourceA-filedA-',]
      }
    ];
    dynamicDefaultFilter(data);
  });
  it('should handle data with productconfig value eq data invalue', () => {
    Object.defineProperty(window, 'ratanConfig', {
      value: {
        trades: {
          productSource:{
            sourceA:{
              filedA: ['value1', 'value2'],
              fieldB: ['value3', 'value4'],
            },
            sourceB:{
              filedC: 'value5',
            },
          },
          defaultFilter: 'default_filter_string'
        }
      },
    });

    const data = [
      {
        field: 'filedA',
        operator: 'EQ',
        values: ['value1', 'value2']
      },
      {
        field: 'filedB',
        operator: 'EQ',
        values: ['value3', 'value4']
      },
      {
        field: 'filedC',
        operator: 'EQ',
        values: 'value5'
      },
    ];
    dynamicDefaultFilter(data);
  });
})