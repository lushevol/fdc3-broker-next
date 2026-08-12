import cascaderBuilder, { getPaths } from './cascaderBuilder';
import type { RatanFieldConfigInCascader } from "../type";

describe('cascader builder function', () => {
  it('should return an array with indexedTerm split by FIELD_SEPERATOR when subSelection is undefined', () => {
    const mockFiledConfig = {
        "indexedTerm": "Action_By_Id",
        "businessTerm": "",
        "dataType": "text",
        "subSelection": "Trade",
        "context": "TRANSACTION_DATA",
        "displayStyle": "freeText",
        "valueList": [],
        "operators": "EQ",
        "operatorsSupp": "==,!=",
        "detailsFixed": false,
        "dynamicList": false,
        "disabledView": true,
        "disabledFilter": true,
        "scope": "{\"disabledBlotter\":[\"TRADE_BLOTTER\",\"CASHFLOW_BLOTTER\"],\"enabledQueryResult\":[],\"fieldTags\":[],\"displayName\":\"\",\"version\":\"v1.1.0\"}",
        "detailsGroup": "",
        "seq": 3327,
        "blotterContext": [
            "TRANSACTION_DATA"
        ],
        "disabled": false
    } as RatanFieldConfigInCascader;
    const paths = getPaths(mockFiledConfig);
    expect(paths).toEqual(['Trade', 'Action_By_Id']);
  });
  it('cascader should generate correct', () => {
    const mockFiledConfig = [{
        "indexedTerm": "Action_By_Id",
        "businessTerm": "",
        "dataType": "text",
        "subSelection": "Trade",
        "context": "TRANSACTION_DATA",
        "displayStyle": "freeText",
        "valueList": [],
        "operators": "EQ",
        "operatorsSupp": "==,!=",
        "detailsFixed": false,
        "dynamicList": false,
        "disabledView": true,
        "disabledFilter": true,
        "scope": "{\"disabledBlotter\":[\"TRADE_BLOTTER\",\"CASHFLOW_BLOTTER\"],\"enabledQueryResult\":[],\"fieldTags\":[],\"displayName\":\"\",\"version\":\"v1.1.0\"}",
        "detailsGroup": "",
        "seq": 3327,
        "blotterContext": [
            "TRANSACTION_DATA"
        ],
        "disabled": false
    } as RatanFieldConfigInCascader] as RatanFieldConfigInCascader[];
    const paths = cascaderBuilder(mockFiledConfig);
    const mockResult = [

    ]
    expect(paths).toEqual([
        {
            children:[
            {
            "indexedTerm": "Action_By_Id",
            "businessTerm": "",
            "children": [],
            "dataType": "text",
            "subSelection": "Trade",
            "context": "TRANSACTION_DATA",
            "displayStyle": "freeText",
            "valueList": [],
            "value": "Action_By_Id",
            "operators": "EQ",
            "operatorsSupp": "==,!=",
            "detailsFixed": false,
            "dynamicList": false,
            "label": "Action By Id",
            "disabledView": true,
            "disabledFilter": true,
            "scope": "{\"disabledBlotter\":[\"TRADE_BLOTTER\",\"CASHFLOW_BLOTTER\"],\"enabledQueryResult\":[],\"fieldTags\":[],\"displayName\":\"\",\"version\":\"v1.1.0\"}",
            "detailsGroup": "",
            "seq": 3327,
            "blotterContext": [
                "TRANSACTION_DATA"
            ],
            "disabled": false
            }
            ],
            disabled: false,
            label: 'Trade',
            value: 'Trade',
            
        } 
    ]);
  });
});