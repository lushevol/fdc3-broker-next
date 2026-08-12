import {
  getConfigurableFields,
  conversionJson,
  conversionColDef,
  conversionDQSLRequest,
  conversionGroup,
  conversionViewOptions,
  conversionCascaderOptions,
  conversionGraphqlErrorField,
  conversionGroupNoneRepeatId,
  sortBusinessFields,
  handleCombineData,
  getDisplayFields,
  getRealVersionOfTrade,
  getRealIdOfTrade,
  getRealIdOfParentTrade,
  getTrader,
  getBookingMarketer,
  getCoverageMarketer,
  getExecutionMarketer,
  setCustomFields,
  convertArray
} from './conversion';

const columnDef = [
  {
    headerName: 'Test Field',
    field: 'field',
    hide: false,
  },
];

const json = [
  {
    Trade_Id: '1',
    Trade_Version: '2',
    fieldA: 'a',
    fieldB: {
      fieldC: 'c',
      fieldD: {
        fieldE: ['e', 'f'],
      },
    },
    Versions: [
      {
        Trade_Id: '1',
        Trade_Version: '1',
      },
      {
        Trade_Id: '1',
        Trade_Version: '0',
      },
    ],
  },
  {
    Trade_Id: '2',
    fieldA: 'a',
    fieldB: {
      fieldC: 'c',
      fieldD: {
        fieldE: 'e',
      },
      fieldF: [
        {
          fieldG: 'g',
        },
      ],
    },
  },
];

const json2 = [json];

const businessFields = [
  {
    indexedTerm: 'Trade_Id',
    businessTerm: 'Trade ID',
    dataType: 'String',
    subSelection: 'Trade',
    context: 'CASHFLOW_DATA,COLLATERAL_DATA,CONFIRMATION_DATA,TRANSACTION_DATA',
    blotterContext: ['CASHFLOW_DATA', 'COLLATERAL_DATA', 'CONFIRMATION_DATA', 'TRANSACTION_DATA'],
    displayStyle: 'freeText',
    valueList: '',
    operators: 'EQ',
    operatorsSupp: '==,!=',
    detailsFixed: true,
    dynamicList: false,
    disabledView: false,
    disabledFilter: false,
    detailsGroup: '',
    seq: 23,
  },
  {
    indexedTerm: 'Cashflow.Netting_Id',
    businessTerm: '',
    dataType: 'String',
    subSelection: 'Cashflow',
    context: 'CASHFLOW_DATA',
    blotterContext: ['CASHFLOW_DATA'],
    displayStyle: 'freeText',
    valueList: '',
    operators: 'EQ',
    operatorsSupp: '==,!=',
    detailsFixed: false,
    dynamicList: false,
    disabledView: false,
    disabledFilter: false,
    detailsGroup: '',
    seq: 15,
  },
  {
    indexedTerm: 'Forward_Future_Instrument.b.c.d.e.f',
    businessTerm: '',
    dataType: 'String',
    subSelection: 'Cashflow',
    context: 'CASHFLOW_DATA',
    blotterContext: ['CASHFLOW_DATA'],
    displayStyle: 'freeText',
    valueList: '',
    operators: 'EQ',
    operatorsSupp: '==,!=',
    detailsFixed: false,
    dynamicList: false,
    disabledView: false,
    disabledFilter: false,
    detailsGroup: '',
    seq: 16,
    colDefs: {
      hide: true,
    },
  },
  {
    indexedTerm: 'Entity.Person.Trader_PSID',
    businessTerm: '',
    dataType: 'String',
    subSelection: 'Cashflow',
    context: 'CASHFLOW_DATA',
    blotterContext: ['CASHFLOW_DATA'],
    displayStyle: 'freeText',
    valueList: '',
    operators: 'EQ',
    operatorsSupp: '==,!=',
    detailsFixed: false,
    dynamicList: false,
    disabledView: false,
    disabledFilter: false,
    detailsGroup: '',
    seq: 17,
    colDefs: {
      hide: true,
    },
  },
];

const rowDetails = {
  errors: [
    {
      message: 'TEST',
      localtions: [],
      extensions: {
        classification: 'DataFetchingException',
      },
      path: ['Confirmation.Confirmation_Workflow_Status'],
    },
  ],
  data: {
    trades: {
      pageInfo: {
        totalHits: 1,
        pageNo: 1,
        pageSize: 50,
        lastPage: false,
      },
      results: [
        {
          Trade_Id: '2240679015',
          Trade_Version: null,
          Confirmation: null,
          Entity: {
            Person: null,
            Counterparty_Classification_Segment: 'S',
          },
        },
      ],
    },
  },
};
test('getConfigurableFields', () => {
  const result = JSON.stringify(getConfigurableFields(columnDef));
  expect(result).toEqual(
    '[{"headerName":"Test Field","field":"field","hide":false}]'
  );
});

test('conversionJson', () => {
  const result = JSON.stringify(conversionJson(json));
  expect(result).toEqual('{"Trade_Id":"2","Trade_Version":"0","fieldA":"a","fieldC":"c","fieldE":"e","fieldG":"g"}');
  const result2 = JSON.stringify(conversionJson(json2));
  expect(result2).toEqual('[{"Trade_Id":"2","Trade_Version":"0","fieldA":"a","fieldC":"c","fieldE":"e","fieldG":"g"}]');
  expect(conversionJson("a")).toEqual("a");
  expect(conversionJson(1)).toEqual(1);
});

test('conversionColDef', () => {
  const result = JSON.stringify(conversionColDef(businessFields));
  expect(result).toEqual(
    "[{\"headerName\":\"Select\",\"headerCheckboxSelection\":true,\"headerCheckboxSelectionFilteredOnly\":true,\"checkboxSelection\":true,\"sortable\":false,\"filter\":false,\"menuTabs\":[],\"resizable\":false,\"maxWidth\":42,\"minWidth\":42,\"hide\":false,\"pinned\":\"left\",\"lockPosition\":true},{\"headerName\":\"Trade ID\",\"headerTooltip\":\"Trade ID\",\"enableRowGroup\":true,\"field\":\"Trade_Id\",\"hide\":true},{\"headerName\":\"Netting Id\",\"headerTooltip\":\"Netting Id\",\"enableRowGroup\":true,\"field\":\"Cashflow.Netting_Id\",\"hide\":true},{\"headerName\":\"f\",\"headerTooltip\":\"f\",\"field\":\"Forward_Future_Instrument.b.c.d.e.f\",\"hide\":true,\"enableRowGroup\":true},{\"headerName\":\"Trader PSID\",\"headerTooltip\":\"Trader PSID\",\"field\":\"Entity.Person.Trader_PSID\",\"hide\":true,\"enableRowGroup\":true}]"  );
});

test('conversionDQSLRequest', () => {
  const result = JSON.stringify(conversionDQSLRequest({ businessFields, isAllFields: true }));
  expect(result).toEqual('"Trade_Id,Cashflow{Netting_Id},Forward_Future_Instrument{ALL_FIELDS},Entity{Person{Trader_PSID}}"');

  const result2 = JSON.stringify(conversionDQSLRequest({ businessFields, isAllFields: false }));
  expect(result2).toEqual('"Trade_Id,Cashflow{Netting_Id},Forward_Future_Instrument{b{c{d{e{f}}}}},Entity{Person{Trader_Source_System_Person_Id,Trader_PSID}}"');

  const fields = [{
    indexedTerm: 'Pending_Trade_Review',
    businessTerm: '',
    dataType: 'String',
    subSelection: 'Trade',
    context: 'RATAN_DATA,TRANSACTION_DATA',
    blotterContext: ['RATAN_DATA', 'TRANSACTION_DATA'],
    displayStyle: 'freeText',
    valueList: '',
    operators: 'EQ',
    operatorsSupp: '==,!=,<IN>',
    detailsFixed: false,
    dynamicList: false,
    disabledView: false,
    disabledFilter: false,
    detailsGroup: '',
    seq: 157,
  }];

  const result3 = JSON.stringify(conversionDQSLRequest({ businessFields: fields, isAllFields: true }));
  expect(result3).toEqual('\"\"');
});

test('conversionGroup', () => {
  const result = JSON.stringify(conversionGroup(json));
  expect(result).toEqual(
    '{"addTradeList":[{"Trade_Id":"1","Trade_Version":"2","fieldA":"a","fieldB":{"fieldC":"c","fieldD":{"fieldE":["e","f"]}},"Versions":[{"Trade_Id":"1","Trade_Version":"1","group":["1","1-1-index0"],"id":"1-1-index0"},{"Trade_Id":"1","Trade_Version":"0","group":["1","1-0-index1"],"id":"1-0-index1"}],"group":["1"],"id":"1"},{"Trade_Id":"1","Trade_Version":"1","group":["1","1-1-index0"],"id":"1-1-index0"},{"Trade_Id":"1","Trade_Version":"0","group":["1","1-0-index1"],"id":"1-0-index1"},{"Trade_Id":"2","fieldA":"a","fieldB":{"fieldC":"c","fieldD":{"fieldE":"e"},"fieldF":[{"fieldG":"g"}]},"group":["2"],"id":"2"}],"addTradeListIds":["1","2"]}'
  );

  const data = [
    {
      Trade_Id: '1',
      Versions: [
        {
          Trade_Id: '1',
          Trade_Version: '1',
        },
      ],
      Physical_Status:null
    },
  ];
  const result2 = JSON.stringify(conversionGroup(data));
  expect(result2).toEqual(
    '{"addTradeList":[{"Trade_Id":"1","Versions":[{"Trade_Id":"1","Trade_Version":"1","group":["1","1-1-index0"],"id":"1-1-index0"}],"Physical_Status":"","group":["1"],"id":"1"},{"Trade_Id":"1","Trade_Version":"1","group":["1","1-1-index0"],"id":"1-1-index0"}],"addTradeListIds":["1"]}'
  );
});

test('conversionViewOptions', () => {
  const result = JSON.stringify(conversionViewOptions(businessFields, false));
  expect(result).toEqual('{}');
});

test('conversionCascaderOptions', () => {
  const result = JSON.stringify(conversionCascaderOptions(businessFields, 'trade'));
  expect(result).toEqual(
    '[{\"label\":\"-- Add Filter --\",\"value\":\"\"},{\"label\":\"Cashflow\",\"value\":\"Cashflow\",\"children\":[{\"label\":\"Netting Id\",\"value\":\"Netting_Id\",\"context\":\"CASHFLOW_DATA\",\"blotterContext\":[\"CASHFLOW_DATA\"],\"type\":\"freeText\",\"operatorsSupp\":\"==,!=\",\"valueList\":\"\",\"indexedTerm\":\"Cashflow.Netting_Id\"}]},{\"label\":\"Entity\",\"value\":\"Entity\",\"children\":[{\"label\":\"Person\",\"value\":\"Person\",\"children\":[{\"label\":\"Trader PSID\",\"value\":\"Trader_PSID\",\"context\":\"CASHFLOW_DATA\",\"blotterContext\":[\"CASHFLOW_DATA\"],\"type\":\"freeText\",\"operatorsSupp\":\"==,!=\",\"valueList\":\"\",\"indexedTerm\":\"Entity.Person.Trader_PSID\"}]}]},{\"label\":\"Forward Future Instrument\",\"value\":\"Forward_Future_Instrument\",\"children\":[{\"label\":\"b\",\"value\":\"b\",\"children\":[{\"label\":\"c\",\"value\":\"c\",\"children\":[{\"label\":\"d\",\"value\":\"d\",\"children\":[{\"label\":\"e.f\",\"value\":\"e.f\",\"context\":\"CASHFLOW_DATA\",\"blotterContext\":[\"CASHFLOW_DATA\"],\"type\":\"freeText\",\"operatorsSupp\":\"==,!=\",\"valueList\":\"\",\"indexedTerm\":\"Forward_Future_Instrument.b.c.d.e.f\"}]}]}]}]},{\"label\":\"Trade Detail\",\"value\":\"TRADEDETAIL\",\"children\":[{\"label\":\"Trade ID\",\"value\":\"Trade_Id\",\"context\":\"CASHFLOW_DATA,COLLATERAL_DATA,CONFIRMATION_DATA,TRANSACTION_DATA\",\"blotterContext\":[\"CASHFLOW_DATA\",\"COLLATERAL_DATA\",\"CONFIRMATION_DATA\",\"TRANSACTION_DATA\"],\"type\":\"freeText\",\"operatorsSupp\":\"==,!=\",\"valueList\":\"\",\"indexedTerm\":\"Trade_Id\"}]}]'
  );

  const config = [
    {
      indexedTerm: "BCS_Parent_Trade_Id",
      businessTerm: "",
      dataType: "String",
      subSelection: "Trade",
      context: "CASHFLOW_DATA",
      displayStyle: "freeText",
      valueList: "",
      operators: "EQ",
      operatorsSupp: "==,!=",
      detailsFixed: false,
      blotterContext: [
        "CASHFLOW_DATA"
      ],
    },
    {
      indexedTerm: "BCS_Parent_Trade_Id",
      businessTerm: "",
      dataType: "String",
      subSelection: "Trade",
      context: "OTHER_DATA",
      displayStyle: "freeText",
      valueList: "",
      operators: "EQ",
      operatorsSupp: "==,!=",
      detailsFixed: false,
      blotterContext: [
        "CASHFLOW_DATA"
      ],
    },
  ];

  const result2 = conversionCascaderOptions(config);
  expect(result2).toEqual([
      {
          "label": "-- Add Filter --",
          "value": ""
      },
      {
          "label": "Cashflow Detail",
          "value": "CASHFLOWDETAIL",
          "children": [
              {
                  "label": "BCS Parent Trade Id",
                  "value": "BCS_Parent_Trade_Id",
                  "context": "CASHFLOW_DATA",
                  "blotterContext": [
                      "CASHFLOW_DATA"
                  ],
                  "type": "freeText",
                  "operatorsSupp": "==,!=",
                  "valueList": "",
                  "indexedTerm": "BCS_Parent_Trade_Id"
              }
          ]
      },
      {
          "label": "Trade Detail",
          "value": "TRADEDETAIL",
          "children": []
      }
  ]);
});

test('conversionGraphqlErrorField', () => {
  const result = conversionGraphqlErrorField(rowDetails);
  expect(result.data.trades.results[0]).toHaveProperty('Confirmation.Confirmation_Workflow_Status', '<ERROR>');
});

test('conversionGroupNoneRepeatId', () => {
  const data = [{
    "Trade_Lake_Trade_Major_Version": 2,
    "Entity": {
        "Counterparty_SCI_FMID": "400058430",
        "Counterparty_Country_ISO_Code": "SG",
        "Counterparty_Long_Name": "STANDARD CHARTERED BANK",
        "Counterparty_SCI_LEID": "11090155",
        "Booking_Entity_Name": "EGYPT",
        "Counterparty_Name": ""
    },
    "Cash_Financial_Instrument": {
        "Exchanged_Currency2_Receiver_Party_Reference": null,
        "Exchanged_Currency1_Receiver_Party_Reference": null,
        "Exchanged_Currency1_Payment_Amount_Currency": null,
        "Exchanged_Currency2_Payment_Amount_Currency": null,
        "Exchanged_Currency2_Payer_Party_Reference": null,
        "Exchanged_Currency1_Payer_Party_Reference": null
    },
    "Trade_Id": "3784248359",
    "Instrument_Common": {
        "Instrument_Description_Of_Underlier": null,
        "Source_System_Instrument_Sub_Type": null,
        "Instrument_Full_Name": null,
        "ISDA_Taxonomy": "ForeignExchange:Forward",
        "Primary_Asset_Class": "ForeignExchange"
    },
    "Forward_Future_Instrument": {
        "Exchanged_Currency2_Payer_Party_Reference": "party2",
        "Exchanged_Currency2_Receiver_Party_Reference": "party1",
        "Exchanged_Currency1_Payment_Amount_Currency": "EUR",
        "Exchanged_Currency1_Payer_Party_Reference": "party1",
        "Exchanged_Currency1_Receiver_Party_Reference": "party2",
        "Exchanged_Currency2_Payment_Amount_Currency": "USD"
    },
    "Data_Flow": {
        "Data_Publication_Id": "STELLA.1678872171162.RATANONE_6da22740-76c9-4845-ad3e-cbe7bf1b8717",
        "Data_Source_System": "S2BX",
        "Data_Sender": "STELLA"
    },
    "Trade_Version": null,
    "TP_System_Last_Updated_Date_Time": "2023-03-15T09:22:49Z",
    "Trade_Event": {
        "Event_Version": "1",
        "Event_Id": "8b9fc069-7a8e-4bf3-82c2-89d827100a3e",
        "Business_Event_Type": "Expiry"
    },
    "Trade_Lake_Trade_Minor_Version": 1,
    "Trade_Date": "2022-11-30T00:00:00Z",
    "Action_Type": "Affirmed",
    "Settlement_Type": null,
    "Package_Id": null,
    "Trade_Lake_Latest_Event_Date_Time": "2023-03-15T09:22:51Z",
    "Trade_State": "AFFIRMED",
    "Settlement_Date": "2022-12-23T00:00:00Z",
    "Physical_Status": null,
    "Tracking_Version": "2",
    "group": [
        "3784248359"
    ],
    "id": "3784248359-0",
    "MTM": "-48.83"
  }]
  const result = conversionGroupNoneRepeatId(data)

  expect(JSON.stringify(result.addTradeList)).toEqual(JSON.stringify(data))
  expect(result.addTradeListIds).toEqual(["3784248359-0"])
})


test('conversionGroupNoneRepeatId - versions', () => {
  const data = [{
    "Trade_Lake_Trade_Major_Version": 2,
    "Entity": {
        "Counterparty_SCI_FMID": "400058430",
        "Counterparty_Country_ISO_Code": "SG",
        "Counterparty_Long_Name": "STANDARD CHARTERED BANK",
        "Counterparty_SCI_LEID": "11090155",
        "Booking_Entity_Name": "EGYPT",
        "Counterparty_Name": ""
    },
    "Cash_Financial_Instrument": {
        "Exchanged_Currency2_Receiver_Party_Reference": null,
        "Exchanged_Currency1_Receiver_Party_Reference": null,
        "Exchanged_Currency1_Payment_Amount_Currency": null,
        "Exchanged_Currency2_Payment_Amount_Currency": null,
        "Exchanged_Currency2_Payer_Party_Reference": null,
        "Exchanged_Currency1_Payer_Party_Reference": null
    },
    "Trade_Id": "3784248359",
    "Instrument_Common": {
        "Instrument_Description_Of_Underlier": null,
        "Source_System_Instrument_Sub_Type": null,
        "Instrument_Full_Name": null,
        "ISDA_Taxonomy": "ForeignExchange:Forward",
        "Primary_Asset_Class": "ForeignExchange"
    },
    "Forward_Future_Instrument": {
        "Exchanged_Currency2_Payer_Party_Reference": "party2",
        "Exchanged_Currency2_Receiver_Party_Reference": "party1",
        "Exchanged_Currency1_Payment_Amount_Currency": "EUR",
        "Exchanged_Currency1_Payer_Party_Reference": "party1",
        "Exchanged_Currency1_Receiver_Party_Reference": "party2",
        "Exchanged_Currency2_Payment_Amount_Currency": "USD"
    },
    "Data_Flow": {
        "Data_Publication_Id": "STELLA.1678872171162.RATANONE_6da22740-76c9-4845-ad3e-cbe7bf1b8717",
        "Data_Source_System": "S2BX",
        "Data_Sender": "STELLA"
    },
    "Trade_Version": null,
    "TP_System_Last_Updated_Date_Time": "2023-03-15T09:22:49Z",
    "Trade_Event": {
        "Event_Version": "1",
        "Event_Id": "8b9fc069-7a8e-4bf3-82c2-89d827100a3e",
        "Business_Event_Type": "Expiry"
    },
    "Trade_Lake_Trade_Minor_Version": 1,
    "Trade_Date": "2022-11-30T00:00:00Z",
    "Action_Type": "Affirmed",
    "Settlement_Type": null,
    "Package_Id": null,
    "Trade_Lake_Latest_Event_Date_Time": "2023-03-15T09:22:51Z",
    "Trade_State": "AFFIRMED",
    "Settlement_Date": "2022-12-23T00:00:00Z",
    "Physical_Status": "Dead",
    "Tracking_Version": "2",
    "group": [
        "3784248359"
    ],
    "id": "3784248359-0",
    "MTM": "-48.83",
    "Versions": [
      {
        Trade_Id: "123",
        Tracking_Version: "1",
      }
    ],
  }]
  const result = conversionGroupNoneRepeatId(data)

  expect(result.addTradeListIds).toEqual(["3784248359-0"])
})

test('sortBusinessFields', () => {
  const data = ['abc', 'bcd', { index: 1, data: "test" }, { index: 2, data: "test2" }]
  const result = sortBusinessFields(data);
  expect(result).toEqual([{ index: 1, data: "test" }, { index: 2, data: "test2" }, "abc", "bcd"])
  
  const data2 = [
    { index: 2 },
    { index: 1 },
    { index: 3 },
    { index: 0 },
  ];
  const result2 = sortBusinessFields(data2);
  expect(result2).toEqual([
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 0 },
  ]);
})

const tradeDetailsRowData =[
  {
    "id": "Entity.Person.Trader_Source_System_Person_Id",
    "key": "Trader",
    "version": "1596136",
    "group": "PERSON"
  }
]
const tradeResult = {
  Entity: {
    Person: {
      Trader_PSID: 'test',
      Trader_Source_System_Person_Id: '1596136'
    }
  }
}
test('handleCombineData', () => {
  const result = handleCombineData(tradeDetailsRowData, tradeResult);
  expect(result).toMatchSnapshot();
})
test('handleCombineData with data not match config combineField', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      trades: {
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
  const result = handleCombineData(tradeDetailsRowData, tradeResult);
  expect(result).toMatchSnapshot();
})

test('handleCombineData with data not match config combineField', () => {
  Object.defineProperty(window, 'ratanConfig', {
    value: {
      trades: {
        customSearchFilter: [
          {
            "field": "Entity.Person.Trader_Source_System_Person_Id",
            "filterText": "(\\\"Entity.Person.Trader_PSID\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX')) or (\\\"Entity.Person.Trader_Source_System_Person_Id\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" = 'S2BX')",
            "combineField": "Entity.Person.Trader_Source_System_Person_Id",
          }
        ],
      }
    },
    writable: true
  });
  const result = handleCombineData(tradeDetailsRowData, tradeResult);
  expect(result).toMatchSnapshot();
})

test("getDisplayFields", () => {
  expect(getDisplayFields([{ field: "test" }, { colDef: { field: "test2" } }])).toEqual("test,test2");

  const columns = [
    {
      field: 'field1',
    },
    {
      colDef: {
        field: 'field2',
      },
    },
    {
      colDef: {
        field: '',
        showRowGroup: 'field3',
      },
    },
  ];

  const result = getDisplayFields(columns);
  expect(result).toEqual(
    'field1,field2,field3'
  );
});

test("getRealVersionOfTrade", () => {
  expect(getRealVersionOfTrade({ Tracking_Version: 1 })).toEqual("1");
});

test("getRealIdOfTrade", () => {
  expect(getRealIdOfTrade({ Trade_Id: "BCS_something", BCS_Trade_Id: "bcs_test" })).toEqual("bcs_test");
  expect(getRealIdOfTrade({ Trade_Id: "test", BCS_Trade_Id: "bcs_test" })).toEqual("test");
});

test("getRealIdOfParentTrade", () => {
  expect(getRealIdOfParentTrade({ Parent_Trade_Id: "BCS_something", BCS_Parent_Trade_Id: "bcs_test" })).toEqual("bcs_test");
  expect(getRealIdOfParentTrade({ Parent_Trade_Id: "test", BCS_Parent_Trade_Id: "bcs_test" })).toEqual("test");
});

test("getTrader", () => {
  expect(getTrader({ data: { Entity: { Person: { Trader_PSID: "1" } } }})).toEqual("1");
  expect(getTrader({ data: { Entity: { Person: { Trader_Source_System_Person_Id: "2" } } }})).toEqual("2");
  expect(getTrader({ data: { Entity: { Person: { Trader_PSID: "1", Trader_Source_System_Person_Id: "2" } } }})).toEqual("1");

  expect(getCoverageMarketer({ data: { Entity: { Person: { Coverage_Marketer_PSID: "1" } } }})).toEqual("1");
  expect(getCoverageMarketer({ data: { Entity: { Person: { Coverage_Marketer_Source_System_Person_Id: "2" } } }})).toEqual("2");
  expect(getCoverageMarketer({ data: { Entity: { Person: { Coverage_Marketer_PSID: "1", Coverage_Marketer_Source_System_Person_Id: "2" } } }})).toEqual("1");

  expect(getBookingMarketer({ data: { Entity: { Person: { Booking_Marketer_PSID: "1" } } }})).toEqual("1");
  expect(getBookingMarketer({ data: { Entity: { Person: { Booking_Marketer_Source_System_Person_Id: "2" } } }})).toEqual("2");
  expect(getBookingMarketer({ data: { Entity: { Person: { Booking_Marketer_PSID: "1", Booking_Marketer_Source_System_Person_Id: "2" } } }})).toEqual("1");
  
  expect(getExecutionMarketer({ data: { Entity: { Person: { Execution_Marketer_PSID: "1" } } }})).toEqual("1");
  expect(getExecutionMarketer({ data: { Entity: { Person: { Execution_Marketer_Source_System_Person_Id: "2" } } }})).toEqual("2");
  expect(getExecutionMarketer({ data: { Entity: { Person: { Execution_Marketer_PSID: "1", Execution_Marketer_Source_System_Person_Id: "2" } } }})).toEqual("1");
});

describe('setCustomFields', () => {
  it('should return an empty object if config is empty', () => {
    const config = {};
    const colDefsMapping = {};
    const result = setCustomFields(config, colDefsMapping);
    expect(result).toEqual({});
  });

  it('should return the same config if there are no colDefs', () => {
    const config = { field1: { someProp: 'value' } };
    const colDefsMapping = {};
    const result = setCustomFields(config, colDefsMapping);
    expect(result).toEqual(config);
  });

  it('should update colDefs if the value is a string and exists in colDefsMapping', () => {
    const config = { field1: { colDefs: { key1: 'value1' } } };
    const colDefsMapping = { key1: { value1: 'newValue1' } };
    const result = setCustomFields(config, colDefsMapping);
    expect(result).toEqual({ field1: { colDefs: { key1: 'newValue1' } } });
  });

  it('should not update colDefs if the value is a string and does not exist in colDefsMapping', () => {
    const config = { field1: { colDefs: { key1: 'value1' } } };
    const colDefsMapping = { key1: { value2: 'newValue2' } };
    const result = setCustomFields(config, colDefsMapping);
    expect(result).toEqual(config);
  });

  it('should update colDefs if the value is a object and exists handleFunction type', () => {
    const config = { field1: { colDefs: { key1: {handleFunction: ''} } } };
    const colDefsMapping = { key1: { value2: 'newValue2' } };
    const result = setCustomFields(config, colDefsMapping);
    expect(result).toEqual(config);
  });

  it('should update colDefs if the value is a object and does not exists handleFunction type', () => {
    const config = { field1: { colDefs: { key1: {} } } };
    const colDefsMapping = { key1: { value2: 'newValue2' } };
    const result = setCustomFields(config, colDefsMapping);
    expect(result).toEqual(config);
  });
});

test('convertArray', () => {
  const config = [
    {
      indexedTerm: 'Trade_Id',
      disabledPages: ['page1', 'page2'],
    },
    {
      indexedTerm: 'Cashflow.Netting_Id',
      disabledFilter: ['filter1', 'filter2'],
    },
    {
      indexedTerm: 'Entity.Person.Trader_PSID',
    },
  ];
  const workspace = 'page1';
  const result = convertArray(config, workspace);
  expect(result.length).toEqual(2);
})