import { renderHook } from "@testing-library/react"
import { useValidation } from "./validationRules";
import { getValidationRules } from "../../ratanutils/http/api";
import { act } from "react-dom/test-utils";

vi.mock("../../ratanutils/http/api", () => {
  const getValidationRules = vi.fn();
  const getValidationRulesFromRuleService = vi.fn();
  return {
    __esModule: "true",
    getValidationRules,
    getValidationRulesFromRuleService,
  }
})
vi.mock("./validation/MandatoryOnRulesTracer", () => {
  return {
    __esModule: true,
    default: vi.fn()
  }
})

describe("ValidationRules", () => {
  it("hook test", async () => {
    vi.useFakeTimers();
    const promise = Promise.resolve([
      {
        field: "TEST_RULE_1", 
        rules: [
          {
            name: "MandatoryOn",
            value: {
              fields: [
                "TEST"
              ]
            }
          },
          {
            name: "ValueBind",
          },
          {
            name: "RegExp",
            value: "RegExp_VALUE",
            errorMsg: "RegExp_Error_Msg"
          },
          {
            name: "LaterOrOn",
          },
          {
            name: "EalierOrOn",
          },
        ]
      }
    ])
    vi.mocked(getValidationRules).mockImplementation(() => {
      return promise
    })
    const btnSet = vi.fn();
    const onFormChange = vi.fn();
    const { result, rerender } = renderHook(() => useValidation({
      entity: "TEST",
      form: {},
      editable: true,
      btnSet,
      onFormChange,
      isCashflowSettlementCN: false,
      validationRules: [
        { field: "TEST_RUlE_DEFAULT", operator: "=", values: "test" }
      ]
    }));
    await promise;
    result.current.resetValidation();
    result.current.forceRefreshValidation({ "swiftType": "test" });
    vi.advanceTimersByTime(10);
    rerender();
  });
  it("hook test", async () => {
    const promise = Promise.resolve(null)
    vi.mocked(getValidationRules).mockImplementation(() => {
      return promise
    })
    const btnSet = vi.fn();
    const onFormChange = vi.fn();
    vi.useFakeTimers();
    const { result, rerender } = renderHook(() => useValidation({
      entity: "TEST",
      form: {},
      editable: true,
      btnSet,
      onFormChange,
      isCashflowSettlementCN: false,
      validationRules: []
    }));
    await promise;
    result.current.resetValidation();
    result.current.forceRefreshValidation({ "swiftType": "test" });
    vi.advanceTimersByTime(10);
    rerender();
    const rulesObj = result.current.rulesObj["TEST_RULE_1"]
    rulesObj.forEach(obj =>{
      if(typeof obj == "function") {
        obj("TEST");
      }
    })
  });

  it("usevalidation populate",async ()=>{
        const mockRules = [
      {
        field: "testField",
        rules: [{ name: "RegExp", value: "^\\d+$", errorMsg: "数字" }],
      },
    ];
    vi.mocked(getValidationRules).mockResolvedValue(mockRules);

    const populateRules = vi.fn();
    const btnSet = vi.fn();

    await act(async () => {
      renderHook(() =>
        useValidation({
          entity: "test",
          form: {},
          editable: true,
          btnSet,
          populateRules,
          validationRules: [],
        })
      );
    });

    // 等待异步
    expect(populateRules).toHaveBeenCalled();
    const params = populateRules.mock.calls[0][0];
    expect(params.rules).toEqual(mockRules);
    expect(typeof params.updateRules).toBe("function");
  })

  it("should call populateRules when rules already exist",async ()=>{
           const mockRules = [
      {
        field: "testField",
        rules: [{ name: "RegExp", value: "^\\d+$", errorMsg: "number" }],
      },
    ];
    // first time return null and then return mockRules
    vi.mocked(getValidationRules).mockResolvedValueOnce([]).mockResolvedValueOnce(mockRules);

    const populateRules = vi.fn();
    const btnSet = vi.fn();

    // first time return null
    const { rerender } = renderHook(() =>
      useValidation({
        entity: "test",
        form: {},
        editable: true,
        btnSet,
        populateRules,
        validationRules: [],
      })
    );

    // manual set rules and return rules
    await act(async () => {
      rerender();
    });
    expect(populateRules).toHaveBeenCalled();
  });
})