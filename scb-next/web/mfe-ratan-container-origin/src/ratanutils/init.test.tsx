import React from "react";
import { render, screen } from "@testing-library/react";
import ratanConfig from "../ratanstatic";
import { CommonUtil } from "../Root/import";
const { getSessionStorage, getLocalStorage, isDate, formatDate, formatDateToISO } = CommonUtil;
Object.defineProperty(window, 'ratanConfig', {
  value: { ...ratanConfig },
  writable: true
});
import * as init from './init';
const { useParentData, handleTime } = init;

test('useParentData', () => {
  const Comp = () => {
    const { isInitComplete } = useParentData();
    return <div>{isInitComplete}</div>
  }
  render(<Comp />)
  expect(screen).toBeDefined();
});

test('sortAsAlphabeticalOrder', () => {
  const data1 = [
    { indexedTerm: 'Cashflow.NSTP_Reason', businessTerm: '', dataType: 'String' },
    { indexedTerm: 'Cashflow.Is_Amended_Post_Settlement', businessTerm: '', dataType: 'String' },
    { indexedTerm: 'Cashflow.Payment_Type', businessTerm: '', dataType: 'String', subSelection: 'Cashflow' },
    { indexedTerm: 'Trade_Id', businessTerm: 'Trade ID', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Parent_Trade_Id', businessTerm: '', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Trade_State', businessTerm: 'Trade State', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Settlement_Method', businessTerm: '', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Delivery_Method', businessTerm: '', dataType: 'String', subSelection: 'Trade' },
  ];
  const data2 = [
    { indexedTerm: 'Cashflow.Is_Amended_Post_Settlement', businessTerm: '', dataType: 'String' },
    { indexedTerm: 'Cashflow.NSTP_Reason', businessTerm: '', dataType: 'String' },
    { indexedTerm: 'Cashflow.Payment_Type', businessTerm: '', dataType: 'String', subSelection: 'Cashflow' },
    { indexedTerm: 'Delivery_Method', businessTerm: '', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Parent_Trade_Id', businessTerm: '', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Settlement_Method', businessTerm: '', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Trade_Id', businessTerm: 'Trade ID', dataType: 'String', subSelection: 'Trade' },
    { indexedTerm: 'Trade_State', businessTerm: 'Trade State', dataType: 'String', subSelection: 'Trade' },
  ];
  expect(init.sortAsAlphabeticalOrder(data1)).toEqual(data2);
  expect(init.sortAsAlphabeticalOrder(undefined)).toEqual(undefined);
});

test('compareArrayLength', () => {
  init.compareArrayLength([], []);
  init.compareArrayLength(["1"], ["2"]);
});

test('replaceField', () => {
  init.replaceField([], "");
  init.replaceField(["a"], "x");
  init.replaceField(["a", "b"], "x");
  init.replaceField(["a", "b", "c"], "x");
  init.replaceField(["a", "b", "c", "d"], "x");
  init.replaceField(["a", "b", "c", "d", "e"], "x");
  init.replaceField(["a", "b", "c", "d", "e", "f"], "x");
});

test('mergeFields', () => {
  let currentFields: any = {
    fields: [{ "indexedTerm": "Action_Type", "businessTerm": "", "dataType": "String", "subSelection": "Trade", "context": "TRANSACTION_DATA", "displayStyle": "dropdown", "valueList": "[\'Undo\',\'Update\']", "operators": "EQ", "operatorsSupp": "==,!=", "detailsFixed": true, "dynamicList": false, "disabledView": false, "disabledFilter": false, "detailsGroup": "", "seq": 143 }]
  };
  let customFields: any = {
    fields: [{ "indexedTerm": "Action_Type", "businessTerm": "", "dataType": "String", "subSelection": "Trade", "context": "TRANSACTION_DATA", "displayStyle": "dropdown", "valueList": "[\'Undo\',\'Update\']", "operators": "EQ", "operatorsSupp": "==,!=", "detailsFixed": true, "dynamicList": false, "disabledView": false, "disabledFilter": false, "detailsGroup": "", "seq": 143 }]
  };
  init.mergeFields(currentFields, customFields, true);
  init.mergeFields(undefined, customFields, false);
});

test('mergeFields', () => {
  let currentFields: any = {
    fields: [{ "indexedTerm": "Action_Type", "businessTerm": "", "dataType": "DateTime", "subSelection": "Trade", "context": "TRANSACTION_DATA", "displayStyle": "dropdown", "valueList": "[\'Undo\',\'Update\']", "operators": "EQ", "operatorsSupp": "==,!=", "detailsFixed": true, "dynamicList": false, "disabledView": false, "disabledFilter": false, "detailsGroup": "", "seq": 143 }]
  };
  let customFields: any = {
    fields: [{ "indexedTerm": "Action_Type", "businessTerm": "", "dataType": "DateTime", "subSelection": "Trade", "context": "TRANSACTION_DATA", "displayStyle": "dropdown", "valueList": "[\'Undo\',\'Update\']", "operators": "EQ", "operatorsSupp": "==,!=", "detailsFixed": true, "dynamicList": false, "disabledView": false, "disabledFilter": false, "detailsGroup": "", "seq": 143 }]
  };
  init.mergeFields(currentFields, customFields, true);
});

test('getCommaSeparatedFormat', () => {
  expect(init.getCommaSeparatedFormat()).toEqual(undefined);
  init.getCommaSeparatedFormat({ data: { key: "Total At Risk (USD)" } });
  init.getCommaSeparatedFormat({ data: { key: "Trigger Price" } });
  init.getCommaSeparatedFormat({ data: { key: "a" } });
});

const fields =
`[{"indexedTerm":"Action_Type","businessTerm":"","dataType":"String","subSelection":"Trade","context":"CONFIRMATION_DATA,TRANSACTION_DATA","displayStyle":"dropdown","valueList":"['Book','Update','Cancel','Revive ','Send','EconAffirm','Affirm','EconConfirm','Confirm','Nonconfirm','Hold','SendForValidation','Validate']","operators":"EQ","operatorsSupp":"==,!=","detailsFixed":true,"dynamicList":false,"disabledView":false,"disabledFilter":false,"scope":"{\\"disabledBlotter\\":[],\\"enabledQueryResult\\":[],\\"version\\":\\"v1.0.0\\"}","detailsGroup":"","seq":1,"blotterContext":["CONFIRMATION_DATA","TRANSACTION_DATA"]}]`
const businessFieldsTrade = `{"version":{"fields":"v_29.1.13","fieldsConfig":"v1.4.22"},"fields":${fields}}`;
const emptyBusinessFieldsTrade = `{"version":{"fields":"v_29.1.13","fieldsConfig":"v1.4.22"},"fields":[]}`;


test('getBusinessFieldsFromCache - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsTrade', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('trade');
  expect(result.tradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('getBusinessFieldsFromCache - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsTrade', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('trade');
  expect(result.tradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('getBusinessFieldsFromCache - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsTrade', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('ruleTrade');
  expect(result.tradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflow getBusinessFieldsFromCache - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsCashflow', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('cashflow');
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflow getBusinessFieldsFromCache - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsCashflow', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('cashflow');
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflowCN getBusinessFieldsFromCache - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsCashflowCN', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('cashflowCN');
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflowCN getBusinessFieldsFromCache - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsCashflowCN', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('cashflowCN');
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('rule getBusinessFieldsFromCache - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsCashflow', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('rule');
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('rule getBusinessFieldsFromCache - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsCashflow', emptyBusinessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCache('rule');
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('x getBusinessFieldsFromCache - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsCashflow', businessFieldsTrade);
  await init.getBusinessFieldsFromCache('x');
});

test('getBusinessFieldsFromCacheNext - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsTrade', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCacheNext({ source: 'trade', flag: 'MO_RULE' });
  expect(result.tradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('getBusinessFieldsFromCacheNext - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsTrade', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCacheNext({ source: 'trade', flag: 'MO_RULE' });
  expect(result.tradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflow getBusinessFieldsFromCacheNext - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsCashflow', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCacheNext({ source: 'cashflow', flag: 'NETING_RULE' });
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflow getBusinessFieldsFromCacheNext - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsCashflow', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCacheNext({ source: 'cashflow', flag: 'NETING_RULE' });
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflowCN getBusinessFieldsFromCacheNext - has getLocalStorage() data', async () => {
  getLocalStorage().setItem('businessFieldsCashflowCN', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCacheNext({ source: 'cashflowCN', flag: 'NETING_RULE' });
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('cashflowCN getBusinessFieldsFromCacheNext - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsCashflowCN', businessFieldsTrade);
  const result: any = await init.getBusinessFieldsFromCacheNext({ source: 'cashflowCN', flag: 'NETING_RULE' });
  expect(result.cashflowAndTradeFields[0].indexedTerm).toEqual('Action_Type');
});

test('x getBusinessFieldsFromCache - has getSessionStorage() data', async () => {
  getSessionStorage().setItem('businessFieldsCashflow', businessFieldsTrade);
  await init.getBusinessFieldsFromCache('x');
});

test('getCommaSeparatedFormat', () => {
  const result = init.getCommaSeparatedFormat();
  expect(result).toEqual(undefined);
  const result2 = init.getCommaSeparatedFormat({ data: { key: 'Total At Risk (USD)' }, value: '' });
  expect(result2).toEqual('');
  const result3 = init.getCommaSeparatedFormat({ data: { key: 'Price' }, value: '' });
  expect(result3).toEqual('');
});

test('getParent', () => {
  const result: any = init.getParent();
  expect(result).toEqual({});
});

describe('handleTime', () => {
  it('should return null if value is "null"', () => {
    expect(handleTime({ value: "null" })).toBeNull();
  });

  it('should return formatted date if value is a date and SET_TIME_TYPE is "LOCAL"', () => {
    const mockDate = '2023-10-05';
    const mockFormattedDate = '2023-10-05';

    expect(handleTime({ value: mockDate })).toBe(mockFormattedDate);
  });
});
