import { NostroFormDetails } from "../Nostro/interface";
import { VostroFormDetails } from "./interface";
import { AdhocSSIHandler, AdhocSSIHandlerFunction, AdhocSSIHandlerProps } from "./AdhocSSIHandler";

describe("AdhocSSIHandler", () => {
  it("updates eligible form targets and ignores NULL targets", () => {
    const context: AdhocSSIHandlerProps<any> = {
    layoutTitle: "Test Layout",
    nostroDetailsData: {
      settlementMeans: "Test Means",
      settlementAccount: "Test Account"
    } as NostroFormDetails,
    currentVostroData: {

    } as VostroFormDetails,
    cashflowDetails: {
      someDetail: "Detail Value"
    },
    rules: [
      {
        name: "MandatoryOn",
        field: "test",
        operator: "=",
        value: "testValue"
      }
    ]
  };
    const hdl = new AdhocSSIHandler(context, ["Test"]);
    const res = hdl.updateFormTargetFields().buildValidateRule().toResult();
    expect(res.vostorFormValue).toEqual({
      settlementMeans: "Test Means",
      settlementAccount: "Test Account"
    });
    const hdl2 = new AdhocSSIHandler(context, ["NULL"]);
    const res2 = hdl2.updateFormTargetFields().buildValidateRule().toResult();
    expect(res2.vostorFormValue).not.toBeDefined();
  });
})

describe("AdhocSSIHandler - buildValidateRule", () => {
  it("reset with rules MandatoryOn", () => {
    const context: AdhocSSIHandlerProps<any> = {
      layoutTitle: "Test Layout",
      nostroDetailsData: {
        settlementMeans: "Test Means",
        settlementAccount: "Test Account"
      } as NostroFormDetails,
      currentVostroData: {

      } as VostroFormDetails,
      cashflowDetails: {
        cashflow: {
          Cashflow: {
            Pay_Receive_Indicator: "Receive",
            Payment_Currency: "USD"
          }
        }
      },
      rules: [{
        rules: [
          {
            name: "MandatoryOn",
            field: "test",
            operator: "=",
            value: "testValue"
          }
        ]
      }]
    };
    const hdl = new AdhocSSIHandler(context, ["Test"]);
    const re1 = hdl.buildValidateRule().toResult();
    expect(re1.newRules[0].rules).toStrictEqual([{
      name: "AllowEmpty",
      field: "test",
      operator: "=",
      value: "testValue"
    }]);
  });

  it("reset with original rules no MandatoryOn and add rules name as AllowEmpty", () => {
    const context: AdhocSSIHandlerProps<any> = {
      layoutTitle: "Test Layout",
      currentVostroData: {
        ssiType: ""
      } as VostroFormDetails,
      originalVostroData: {
        ssiType: "Test Type"
      } as VostroFormDetails,
      nostroDetailsData: {
        settlementMeans: "Test Means",
        settlementAccount: "Test Account"
      } as NostroFormDetails,
      cashflowDetails: {
        cashflow: {
          Cashflow: {
            Pay_Receive_Indicator: "Receive",
            Payment_Currency: "USD"
          }
        }
      },
      rules: [{
        rules: [
          {
            name: "others",
            field: "test",
            operator: "=",
            value: "testValue"
          }
        ]
      }]
    };
    const hdl = new AdhocSSIHandler(context, ["Test"]);
    const re1 = hdl.buildValidateRule().toResult();
    expect(re1.newRules[0].rules).toStrictEqual([{
      name: "others",
      field: "test",
      operator: "=",
      value: "testValue"
    },
    {
      name: "AllowEmpty"
    }]);
  });

})

describe("AdhocSSIHandlerFunction", () => {
  const mockUpdateRules = vi.fn();
  const mockSetVostroFormFieldsValue = vi.fn();

  const baseContext = {
    layoutTitle: "Adhoc SSI",
    nostroDetailsData: {
      settlementMeans: "NOS",
      settlementAccount: "123456",
    } as NostroFormDetails,
    currentVostroData: {

    } as VostroFormDetails,
    cashflowDetails: {
      cashflow: {
        Cashflow: {
          Pay_Receive_Indicator: "Receive",
          Payment_Currency: "USD",
        },
      },
    },
    rules: [
      {
        field: "testField",
        rules: [{ name: "MandatoryOn" }],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update rules and set form fields value when eligible", () => {
    AdhocSSIHandlerFunction(baseContext, {
      updateRules: mockUpdateRules,
      setVostroFormFieldsValue: mockSetVostroFormFieldsValue,
    });

    // rules should be reset (MandatoryOn -> AllowEmpty)
    expect(mockUpdateRules).toHaveBeenCalledWith([
      {
        field: "testField",
        rules: [{ name: "AllowEmpty" }],
      },
    ]);
    // form fields should be set
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      settlementMeans: "NOS",
      settlementAccount: "123456",
    });
  });

  it("should not set form fields value if nostroDetailsData is missing", () => {
    const context = { ...baseContext, nostroDetailsData: undefined };
    AdhocSSIHandlerFunction(context, {
      updateRules: mockUpdateRules,
      setVostroFormFieldsValue: mockSetVostroFormFieldsValue,
    });
    expect(mockSetVostroFormFieldsValue).not.toHaveBeenCalled();
    expect(mockUpdateRules).toHaveBeenCalled();
  });

  it("should not reset rules if not eligible by layoutTitle", () => {
    const context = { ...baseContext, layoutTitle: "Other Title" };
    AdhocSSIHandlerFunction(context, {
      updateRules: mockUpdateRules,
      setVostroFormFieldsValue: mockSetVostroFormFieldsValue,
    });
    // rules should not be changed
    expect(mockUpdateRules).toHaveBeenCalledWith(baseContext.rules);
  });

  it("should not reset rules if isPassValidationReceiptSI returns false", () => {
    const context = {
      ...baseContext,
      cashflowDetails: {
        cashflow: {
          Cashflow: {
            Pay_Receive_Indicator: "Pay",
            Payment_Currency: "USD",
          },
        },
      },
    };
    AdhocSSIHandlerFunction(context, {
      updateRules: mockUpdateRules,
      setVostroFormFieldsValue: mockSetVostroFormFieldsValue,
    });
    expect(mockUpdateRules).toHaveBeenCalledWith(baseContext.rules);
  });

  
  it("should return true when settlementMethod is UTIL", () => {
    const context: AdhocSSIHandlerProps<any> = {
      layoutTitle: "Test Layout",
      cashflowDetails: {
        cashflow: {
          Settlement_Method: "UTIL",
        },
      },
      nostroDetailsData: {} as NostroFormDetails,
      currentVostroData: {} as VostroFormDetails,
      rules: [],
    };
    const handler = new AdhocSSIHandler(context, []);
    expect(handler.isPassValidationReceiptSI()).toBe(true);
  });
});
