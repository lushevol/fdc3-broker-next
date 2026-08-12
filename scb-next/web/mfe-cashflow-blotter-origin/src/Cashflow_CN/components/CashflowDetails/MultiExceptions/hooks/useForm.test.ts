import dayjs from "dayjs";
import { mockFormInstance } from "src/test/mockUtils/antd-form";
import { fn, renderHook } from "src/test/test-utils";

import { ExceptionCategory, MultiExceptionsNames } from "../common/interface";
import { affirmationSubmitFormRawDataType } from "../components/Affirmation/interface";
import useForm, {
  coverAffirmation,
  coverBackvalue,
  coverNostroData,
  coverVostroData,
  doubleValidation,
  handleFormSubmitable,
  handleSubmitFormData,
  precheckVostroDataBeforeSubmit,
  submitForm,
} from "./useForm";
import * as useFormModule from "./useForm";

const createValidForm = (data: Record<string, any> = {}) => ({
  validateFields: fn(),
  getFieldsError: fn(() => []),
  getFieldsValue: fn(() => data),
});

describe('useForm', () => {
  it("submitForm returns invalid when form is missing", async () => {
    const formRef = {
      current: {
        getForm: fn(() => null),
      },
    } as any;

    const res = await submitForm(MultiExceptionsNames.Vostro, formRef);
    expect(res.isValid).toBe(false);
    expect(res.data).toEqual({});
  });

  it("submitForm handles validateFields error", async () => {
    const mockForm = {
      validateFields: vi.fn(() => {
        throw new Error("boom");
      }),
      getFieldsError: vi.fn(() => []),
      getFieldsValue: vi.fn(() => ({ field: "value" })),
    };
    const formRef = {
      current: {
        getForm: fn(() => mockForm),
        clearValidateStatus: fn(),
      },
    } as any;

    const res = await submitForm(MultiExceptionsNames.Vostro, formRef);
    expect(mockForm.validateFields).toHaveBeenCalled();
    expect(res.isValid).toBe(true);
    expect(res.data).toEqual({ field: "value" });
  });

  it("submitForm skips validation when skipValidate is true", async () => {
    const mockForm = {
      validateFields: vi.fn(),
      getFieldsError: vi.fn(() => []),
      getFieldsValue: vi.fn(() => ({})),
    };
    const formRef = {
      current: {
        getForm: fn(() => mockForm),
        clearValidateStatus: fn(),
      },
    } as any;

    await submitForm(MultiExceptionsNames.Vostro, formRef, true);
    expect(mockForm.validateFields).not.toHaveBeenCalled();
  });
  it("precheckVostroDataBeforeSubmit", () => {
    const mockGetForm = fn(() => mockFormInstance());
    const mockFormRef = {
      current: {
        getForm: mockGetForm,
        setValidateStatus: fn(),
        clearValidateStatus: fn(),
      }
    }
    precheckVostroDataBeforeSubmit(mockFormRef);
    expect(mockGetForm).toHaveBeenCalled();
  });
  it("coverVostroData", () => {
    const res = coverVostroData({
      isThirdPartyPayment: "",
      coveredPayment: "",
      orderingCustomerFields: "test",
      beneficiaryFields: "test",
    });

    expect(res.orderingCustomerFields).toBeUndefined();
    expect(res.beneficiaryFields).toBeUndefined();
    expect(res.isThirdPartyPayment).toBe("N");
    expect(res.coveredPayment).toBe("N");
  });
  it("coverNostroData", () => {
    const res = coverNostroData({
      noticeToReceive: "",
    });

    expect(res.noticeToReceive).toBe("N");
  });
  it("coverAffirmation", () => {
    const res = coverAffirmation({
      affirmedBy: "test_id",
      phone_email: "test_pn",
      affirmedAt: dayjs(),
    });

    expect(typeof res.affirmedAt).toBe("string");

    expect(coverAffirmation({
      affirmedBy: "test_id",
      phone_email: "test_pn",
      affirmedAt: "test_dt",
    } as unknown as affirmationSubmitFormRawDataType).affirmedAt).toBe("test_dt");
  });
  it("coverBackvalue", () => {
    const res = coverBackvalue({
      swiftPaymentDate: dayjs(),
    });

    expect(typeof res.swiftPaymentDate).toBe("string");
  });

  it("coverBackvalue formats when instanceof dayjs is true", () => {
    const mockDate = {
      format: fn(() => "2020-01-01"),
    } as any;
    Object.setPrototypeOf(mockDate, (dayjs as any).prototype);

    const res = coverBackvalue({
      swiftPaymentDate: mockDate,
    });

    expect(res.swiftPaymentDate).toBe("2020-01-01");
  });
  it("handleSubmitFormData", () => {
    const res = handleSubmitFormData(MultiExceptionsNames.Affirmation, {
      affirmedAt: dayjs(),
    });

    expect(typeof res.affirmedAt).toBe("string");
  });

  it("handleSubmitFormData covers backvalue branch", () => {
    const res = handleSubmitFormData(MultiExceptionsNames.Backvalue, {
      swiftPaymentDate: dayjs(),
    });
    expect(typeof res.swiftPaymentDate).toBe("string");
  });

  it("handleSubmitFormData returns data for unknown name", () => {
    const data = { a: 1 };
    expect(handleSubmitFormData("Unknown" as any, data)).toBe(data);
  });

  it("doubleValidation marks affirmation invalid without affirmedAt", () => {
    const res = doubleValidation({
      name: MultiExceptionsNames.Affirmation,
      isValid: true,
      data: { affirmedBy: "user" },
    });
    expect(res.isValid).toBe(false);
  });
  it("useForm - formNameRefMap", () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.formNameRefMap(MultiExceptionsNames.Vostro)).toBeDefined();
    expect(result.current.formNameRefMap(MultiExceptionsNames.Nostro)).toBeDefined();
    expect(result.current.formNameRefMap(MultiExceptionsNames.Affirmation)).toBeDefined();
    expect(result.current.formNameRefMap(MultiExceptionsNames.Backvalue)).toBeDefined();
    expect(result.current.formNameRefMap(MultiExceptionsNames.Comment)).toBeDefined();
  });
  it("useForm - setFormValidateStatus", () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.setFormValidateStatus([
      {
        type: "form",
        section: MultiExceptionsNames.Vostro,
        field: "test_field",
        errorType: "error",
        errorMsg: "error message",
      },
      {
        type: "message",
        section: MultiExceptionsNames.Vostro,
        field: "test_field",
        errorType: "error",
      },
    ])).toBeUndefined();
  });

  it("useForm - setFormValidateStatus handles existing section", () => {
    const { result } = renderHook(() => useForm());
    const setValidateStatus = fn();
    // @ts-ignore
    result.current.vostroFormRef.current = {
      setValidateStatus,
    };

    result.current.setFormValidateStatus([
      {
        type: "form",
        section: MultiExceptionsNames.Vostro,
        field: "field_a",
        errorType: "error",
        errorMsg: "error message",
      },
      {
        type: "form",
        section: MultiExceptionsNames.Vostro,
        field: "field_b",
        errorType: "error",
      },
    ]);

    expect(setValidateStatus).toHaveBeenCalled();
  });

  it("useForm - setFormValidateStatus applies to section", () => {
    const { result } = renderHook(() => useForm());
    const setValidateStatus = fn();
    // @ts-ignore
    result.current.vostroFormRef.current = {
      setValidateStatus,
    };

    result.current.setFormValidateStatus([
      {
        type: "form",
        section: MultiExceptionsNames.Vostro,
        field: "test_field",
        errorType: "error",
        errorMsg: "error message",
      },
    ]);

    expect(setValidateStatus).toHaveBeenCalled();
  });
  it("useForm - clearFormValidateStatus", () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.clearFormValidateStatus()).toBeUndefined();
    expect(result.current.clearFormValidateStatus(MultiExceptionsNames.Vostro)).toBeUndefined();
  });
  it("useForm - onResetFormValidationStatus", () => {
    const { result } = renderHook(() => useForm());
    expect(result.current.onResetFormValidationStatus(MultiExceptionsNames.Vostro, {})).toBeUndefined();
    expect(result.current.onResetFormValidationStatus(MultiExceptionsNames.Nostro, {})).toBeUndefined();
  });

  it("useForm - allFormsSubmit sets invalid when submitForm rejects", async () => {
    const submitSpy = jest
      .spyOn(useFormModule, "submitForm")
      .mockImplementationOnce(() => Promise.reject(new Error("fail")) as any);

    const { result } = renderHook(() => useForm());
    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: {},
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.valid).toBe(false);
    submitSpy.mockRestore();
  });

  it("useForm - allFormsSubmit handles thrown getForm", async () => {
    const { result } = renderHook(() => useForm());
    // @ts-ignore
    result.current.commentsFormRef.current = {
      getForm: () => {
        throw new Error("fail");
      },
      clearValidateStatus: fn(),
    };

    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: {},
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.valid).toBe(false);
  });
});

it("precheckVostroDataBeforeSubmit - sets empty strings for missing fields", () => {
  const mockSetFieldValue = fn();
  const mockGetFieldValue = fn((field: string) => {
    if (field === "beneficiaryBic") return undefined;
    if (field === "beneficiaryName") return undefined;
  });
  const mockGetForm = fn(() => ({
    getFieldValue: mockGetFieldValue,
    setFieldValue: mockSetFieldValue,
  }));
  const mockFormRef = {
    current: {
      getForm: mockGetForm,
    },
  };

  // @ts-ignore
  precheckVostroDataBeforeSubmit(mockFormRef);

  expect(mockGetForm).toHaveBeenCalled();
  expect(mockGetFieldValue).toHaveBeenCalledWith("beneficiaryBic");
  expect(mockGetFieldValue).toHaveBeenCalledWith("beneficiaryName");
  expect(mockSetFieldValue).toHaveBeenCalledWith("beneficiaryBic", "");
  expect(mockSetFieldValue).toHaveBeenCalledWith("beneficiaryName", "");
});

it("precheckVostroDataBeforeSubmit - does not overwrite existing values", () => {
  const mockSetFieldValue = fn();
  const mockGetFieldValue = fn((field: string) => {
    if (field === "beneficiaryBic") return "existingBic";
    if (field === "beneficiaryName") return "existingName";
  });
  const mockGetForm = fn(() => ({
    getFieldValue: mockGetFieldValue,
    setFieldValue: mockSetFieldValue,
  }));
  const mockFormRef = {
    current: {
      getForm: mockGetForm,
    },
  };

  // @ts-ignore
  precheckVostroDataBeforeSubmit(mockFormRef);

  expect(mockGetForm).toHaveBeenCalled();
  expect(mockGetFieldValue).toHaveBeenCalledWith("beneficiaryBic");
  expect(mockGetFieldValue).toHaveBeenCalledWith("beneficiaryName");
  expect(mockSetFieldValue).not.toHaveBeenCalledWith("beneficiaryBic", "");
  expect(mockSetFieldValue).not.toHaveBeenCalledWith("beneficiaryName", "");
});

it("precheckVostroDataBeforeSubmit - does nothing if form is null", () => {
  const mockFormRef = {
    current: {
      getForm: fn(() => null),
    },
  };

  // @ts-ignore
  precheckVostroDataBeforeSubmit(mockFormRef);

  expect(mockFormRef.current.getForm).toHaveBeenCalled();
});

it("precheckVostroDataBeforeSubmit - handles missing formRef gracefully", () => {
  const mockFormRef = {
    current: null,
  };

  expect(() => precheckVostroDataBeforeSubmit(mockFormRef)).not.toThrow();
});

describe("handleFormSubmitable", () => {
  const mockVostroFormRef = {
    current: {
      getForm: vi.fn(() => ({
        getFieldsValue: vi.fn(() => ({})),
      })),
    },
  };

  it("should return correct values when rejecting", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{}],
      [MultiExceptionsNames.Nostro]: [{}],
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      true, // isReject
      false, // isAdhocing
      false, // isFixingMissingNostro
      false, // vostroCanEmptyWhenFixingMissingNostro
      // @ts-ignore
      mockVostroFormRef
    );

    expect(result.shouldGetFormData[MultiExceptionsNames.Vostro]).toBe(true);
    expect(result.shouldGetFormData[MultiExceptionsNames.Nostro]).toBe(true);
    expect(result.shouldGetFormData_SkipValid[MultiExceptionsNames.Vostro]).toBe(true);
    expect(result.shouldGetFormData_SkipValid[MultiExceptionsNames.Nostro]).toBe(true);
  });

  it("should handle missing nostro exception with empty vostro data", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{ 

        Exception_Code: "Missing Nostro",
        Exception_Category: "SSI",
        Exception_Type: "BUSINESS",
        Status: "INACTIVE",
       }],
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      false, // isReject
      false, // isAdhocing
      true, // isFixingMissingNostro
      true, // vostroCanEmptyWhenFixingMissingNostro
      // @ts-ignore
      mockVostroFormRef
    );

    expect(result.shouldGetFormData[MultiExceptionsNames.Vostro]).toBe(true);
    expect(result.shouldGetFormData_SkipValid[MultiExceptionsNames.Vostro]).toBe(true);
  });

  it("should set skip valid when missing nostro and empty data", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        {
          Exception_Code: "Missing Nostro",
          Exception_Category: ExceptionCategory.SSI,
        },
      ],
    };
    const getFieldsValue = vi.fn(() => ({}));
    const getForm = vi.fn(() => ({
      getFieldsValue,
    }));
    const mockVostroFormRefEmpty = {
      current: {
        getForm,
      },
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      false,
      false,
      true,
      true,
      // @ts-ignore
      mockVostroFormRefEmpty
    );

    expect(result.shouldGetFormData[MultiExceptionsNames.Vostro]).toBe(true);
    expect(result.shouldGetFormData_SkipValid[MultiExceptionsNames.Vostro]).toBe(true);
    expect(getForm).toHaveBeenCalled();
    expect(getFieldsValue).toHaveBeenCalled();
  });

  it("should handle missing nostro exception with non-empty vostro data", () => {
    const mockVostroFormRefWithData = {
      current: {
        getForm: vi.fn(() => ({
          getFieldsValue: vi.fn(() => ({ field: "value" })),
        })),
      },
    };

    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{ 
        Exception_Code: "Missing Nostro",
        Exception_Category: ExceptionCategory.SSI,
        Exception_Type: "BUSINESS",
        Status: "INACTIVE", }],
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      false, // isReject
      false, // isAdhocing
      true, // isFixingMissingNostro
      true, // vostroCanEmptyWhenFixingMissingNostro
      // @ts-ignore
      mockVostroFormRefWithData
    );

    expect(result.shouldGetFormData[MultiExceptionsNames.Vostro]).toBe(true);
    expect(result.shouldGetFormData_SkipValid[MultiExceptionsNames.Vostro]).toBe(false);
  });

  it("should not read form data when missing nostro flag is false", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        {
          Exception_Code: "Missing Nostro",
          Exception_Category: ExceptionCategory.SSI,
        },
      ],
    };
    const getForm = vi.fn();
    const mockVostroFormRefNoRead = {
      current: {
        getForm,
      },
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      false,
      false,
      true,
      false,
      // @ts-ignore
      mockVostroFormRefNoRead
    );

    expect(result.shouldGetFormData[MultiExceptionsNames.Vostro]).toBe(true);
    expect(getForm).not.toHaveBeenCalled();
  });

  it("should handle SSI good stamping exception", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{ 
        Exception_Code: "Per SSI Adhoc",
        Exception_Category: ExceptionCategory.SSI,
        Exception_Type: "BUSINESS",
        Status: "INACTIVE",
       }],
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      false, // isReject
      true, // isAdhocing
      false, // isFixingMissingNostro
      false, // vostroCanEmptyWhenFixingMissingNostro
      // @ts-ignore
      mockVostroFormRef
    );

    expect(result.shouldGetFormData[MultiExceptionsNames.Vostro]).toBe(true);
    expect(result.shouldGetFormData_SkipValid[MultiExceptionsNames.Vostro]).toBe(false);
  });

  it("should skip vostro form when adhoc is false for good stamping", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [
        {
          Exception_Code: "Per SSI Adhoc",
          Exception_Category: ExceptionCategory.SSI,
          Status: "INACTIVE",
        },
      ],
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      false,
      false,
      false,
      false,
      // @ts-ignore
      mockVostroFormRef
    );

    expect(result.shouldGetFormData[MultiExceptionsNames.Vostro]).toBe(false);
  });

  it("should skip validation for all forms when rejecting", () => {
    const classifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{}],
      [MultiExceptionsNames.Nostro]: [{}],
      [MultiExceptionsNames.Affirmation]: [{}],
      [MultiExceptionsNames.Backvalue]: [{}],
    };

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      true, // isReject
      false, // isAdhocing
      false, // isFixingMissingNostro
      false, // vostroCanEmptyWhenFixingMissingNostro
      // @ts-ignore
      mockVostroFormRef
    );

    Object.keys(result.shouldGetFormData_SkipValid).forEach((key) => {
      expect(result.shouldGetFormData_SkipValid[key]).toBe(true);
    });
  });

  it("should return empty results when no exceptions are provided", () => {
    const classifiedCommonExceptions = {};

    const result = handleFormSubmitable(
      classifiedCommonExceptions,
      false, // isReject
      false, // isAdhocing
      false, // isFixingMissingNostro
      false, // vostroCanEmptyWhenFixingMissingNostro
      // @ts-ignore
      mockVostroFormRef
    );

    expect(result.shouldGetFormData).toEqual({});
    expect(result.shouldGetFormData_SkipValid).toEqual({});
  });
});
describe("coverVostroData", () => {
  it("should set 'isThirdPartyPayment' to 'N' if not provided", () => {
    const input = {};
    const result = coverVostroData(input);
    expect(result.isThirdPartyPayment).toBe("N");
  });

  it("should set 'coveredPayment' to 'N' if not provided", () => {
    const input = {};
    const result = coverVostroData(input);
    expect(result.coveredPayment).toBe("N");
  });

  it("should not overwrite 'isThirdPartyPayment' if already provided", () => {
    const input = { isThirdPartyPayment: "Y" };
    const result = coverVostroData(input);
    expect(result.isThirdPartyPayment).toBe("Y");
  });

  it("should not overwrite 'coveredPayment' if already provided", () => {
    const input = { coveredPayment: "Y" };
    const result = coverVostroData(input);
    expect(result.coveredPayment).toBe("Y");
  });

  it("should delete 'orderingCustomerFields' if present", () => {
    const input = { orderingCustomerFields: "some value" };
    const result = coverVostroData(input);
    expect(result.orderingCustomerFields).toBeUndefined();
  });

  it("should delete 'beneficiaryFields' if present", () => {
    const input = { beneficiaryFields: "some value" };
    const result = coverVostroData(input);
    expect(result.beneficiaryFields).toBeUndefined();
  });

  it("should handle an empty input object", () => {
    const input = {};
    const result = coverVostroData(input);
    expect(result).toEqual({
      isThirdPartyPayment: "N",
      coveredPayment: "N",
    });
  });

  it("should handle an input object with unrelated fields", () => {
    const input = { unrelatedField: "value" };
    const result = coverVostroData(input);
    expect(result).toEqual({
      unrelatedField: "value",
      isThirdPartyPayment: "N",
      coveredPayment: "N",
    });
  });

  it("should handle an input object with all fields provided", () => {
    const input = {
      isThirdPartyPayment: "Y",
      coveredPayment: "Y",
      orderingCustomerFields: "some value",
      beneficiaryFields: "some value",
    };
    const result = coverVostroData(input);
    expect(result).toEqual({
      isThirdPartyPayment: "Y",
      coveredPayment: "Y",
    });
  });

  it("should delete entity and tradingCurrency fields", () => {
    const input = {
      entity: "test-entity",
      tradingCurrency: "USD",
      isThirdPartyPayment: "Y",
      coveredPayment: "Y",
    };
    const result = coverVostroData(input);
    expect(result.entity).toBeUndefined();
    expect(result.tradingCurrency).toBeUndefined();
  });

  it("should not modify the input object directly", () => {
    const input = { isThirdPartyPayment: "Y" };
    const inputCopy = { ...input, coveredPayment: "N", };
    coverVostroData(input);
    expect(input).toEqual(inputCopy);
  });
});

describe("coverNostroData", () => {
  it("should set 'noticeToReceive' to 'N' if not provided", () => {
    const input = {};
    const result = coverNostroData(input);
    expect(result.noticeToReceive).toBe("N");
  });

  it("should not overwrite 'noticeToReceive' if already provided", () => {
    const input = { noticeToReceive: "Y" };
    const result = coverNostroData(input);
    expect(result.noticeToReceive).toBe("Y");
  });

  it("should handle an empty input object", () => {
    const input = {};
    const result = coverNostroData(input);
    expect(result).toEqual({ noticeToReceive: "N" });
  });

  it("should handle an input object with unrelated fields", () => {
    const input = { unrelatedField: "value" };
    const result = coverNostroData(input);
    expect(result).toEqual({
      unrelatedField: "value",
      noticeToReceive: "N",
    });
  });

  it("should handle an input object with all fields provided", () => {
    const input = { noticeToReceive: "Y", unrelatedField: "value" };
    const result = coverNostroData(input);
    expect(result).toEqual({
      noticeToReceive: "Y",
      unrelatedField: "value",
    });
  });

  it("should clear dedicatedPortfolio for DEFAULT nostroType", () => {
    const input = { nostroType: "DEFAULT", dedicatedPortfolio: "ABC" };
    const result = coverNostroData(input);
    expect(result.dedicatedPortfolio).toBeNull();
  });

  it("should not modify the input object directly", () => {
    const input = { noticeToReceive: "Y" };
    const inputCopy = { ...input };
    coverNostroData(input);
    expect(input).toEqual(inputCopy);
  });

  it.skip("should handle null or undefined input gracefully", () => {
    const result = coverNostroData(null as unknown as PlainObject);
    expect(result).toEqual({ noticeToReceive: "N" });

    const resultUndefined = coverNostroData(undefined as unknown as PlainObject);
    expect(resultUndefined).toEqual({ noticeToReceive: "N" });
  });

  it("should handle input with invalid data types", () => {
    const input = { noticeToReceive: 123 as unknown as string };
    const result = coverNostroData(input);
    expect(result.noticeToReceive).toBe(123);
  });
});

describe("useForm - allFormsSubmit", () => {
  it("should handle empty classifiedCommonExceptions", async () => {
    const { result } = renderHook(() => useForm());
    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: {},
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.valid).toBe(false);
    expect(submitResult.data).toEqual({
      "comment": {},
    });

    expect(result.current.formNameRefMap("test")).toBeUndefined();
  });

  it("should handle missing Vostro form gracefully", async () => {
    const mockClassifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{}],
    };

    const { result } = renderHook(() => useForm());
    // @ts-ignore
    result.current.vostroFormRef.current = null;

    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: mockClassifiedCommonExceptions,
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.valid).toBe(false);
    expect(submitResult.data).toEqual({
      "comment": {},
      "nostro": {
        "noticeToReceive": "N",
      },
      "vostro": {
        "coveredPayment": "N",
        "isThirdPartyPayment": "N",
      },
    });
  });

  it("should handle isReject flag correctly", async () => {
    const mockClassifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{}],
    };

    const { result } = renderHook(() => useForm());
    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: mockClassifiedCommonExceptions,
      isReject: true,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.valid).toBe(false);
    expect(submitResult.data).toEqual({
      "comment": {},
      "nostro": {
        "noticeToReceive": "N",
      },
      "vostro": {
        "coveredPayment": "N",
        "isThirdPartyPayment": "N",
      },
    });
  });

  it("should handle isFixingMissingNostro flag correctly", async () => {
    const mockClassifiedCommonExceptions = {
      [MultiExceptionsNames.Vostro]: [{ Exception_Type: "MissingNostro" }],
    };

    const { result } = renderHook(() => useForm());
    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: mockClassifiedCommonExceptions,
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: true,
      vostroCanEmptyWhenFixingMissingNostro: true,
    });

    expect(submitResult.valid).toBe(false);
    expect(submitResult.data).toEqual({
      "comment": {},
      "nostro": {
        "noticeToReceive": "N",
      },
      "vostro": {
        "coveredPayment": "N",
        "isThirdPartyPayment": "N",
      },
    });
  });

  it("should include backvalue and affirmation forms", async () => {
    const mockClassifiedCommonExceptions = {
      [MultiExceptionsNames.Backvalue]: [{}],
      [MultiExceptionsNames.Affirmation]: [{}],
    };

    const { result } = renderHook(() => useForm());
    // @ts-ignore
    result.current.backvalueFormRef.current = {
      getForm: fn(() => createValidForm({ swiftPaymentDate: "2020-01-01" })),
      clearValidateStatus: fn(),
    };
    // @ts-ignore
    result.current.affirmationFormRef.current = {
      getForm: fn(() => createValidForm({ affirmedAt: "2020-01-01T00:00:00" })),
      clearValidateStatus: fn(),
    };

    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: mockClassifiedCommonExceptions,
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.data[MultiExceptionsNames.Backvalue]).toBeDefined();
    expect(submitResult.data[MultiExceptionsNames.Affirmation]).toBeDefined();
  });

  it("should include nostro only branch", async () => {
    const mockClassifiedCommonExceptions = {
      [MultiExceptionsNames.Nostro]: [{}],
    };

    const { result } = renderHook(() => useForm());
    // @ts-ignore
    result.current.nostroFormRef.current = {
      getForm: fn(() => createValidForm({ noticeToReceive: "N" })),
      clearValidateStatus: fn(),
    };

    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: mockClassifiedCommonExceptions,
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.data.nostro).toBeDefined();
  });

  it("should set valid false when submitForm throws", async () => {
    const { result } = renderHook(() => useForm());
    // @ts-ignore
    result.current.commentsFormRef.current = {
      getForm: fn(() => ({
        validateFields: fn(),
        getFieldsError: () => {
          throw new Error("fail");
        },
        getFieldsValue: fn(() => ({})),
      })),
      clearValidateStatus: fn(),
    };

    const submitResult = await result.current.allFormsSubmit({
      classifiedCommonExceptions: {},
      isReject: false,
      isAdhocing: false,
      isFixingMissingNostro: false,
      vostroCanEmptyWhenFixingMissingNostro: false,
    });

    expect(submitResult.valid).toBe(false);
  });

  it("submitForm sets isValid=false when field errors present", async () => {
    const mockForm = {
      validateFields: vi.fn(),
      getFieldsError: vi.fn(() => [{ errors: ["err"] }]),
      getFieldsValue: vi.fn(() => ({ field: "value" })),
    };
    const formRef = {
      current: {
        getForm: () => mockForm,
        clearValidateStatus: vi.fn(),
      },
    } as any;

    const res = await submitForm(MultiExceptionsNames.Vostro, formRef);
    expect(res.isValid).toBe(false);
    expect(res.data).toEqual({ field: "value" });
  });
});