import { fireEvent, render, waitFor } from "@testing-library/react";

import { generateEmptyVostro } from "../../common/utils";
import { AdhocSSIHandlerFunction } from "./AdhocSSIHandler";
import VostroForm, { debounceSetFormFieldsValue, handleAutoPopulate, handleCoveredPayment } from "./form";

vi.mock("./AdhocSSIHandler", () => ({
  AdhocSSIHandlerFunction: vi.fn(),
}));


vi.mock("src/Root/import/ratancomponents", () => {
  return {
    CounterpartyDetailsV2: () => <></>,
    MuiDialog: ({ children }) => <>{children}</>,
    CustomForm: (props) => {
      return (
        <div {...props}>
          {props.children}
          <button
            data-testid="custom-form-submit-btn"
            onClick={() => props.onSubmit()}
          >
            submit
          </button>
          <button
            data-testid="custom-form-reject-btn"
            onClick={() => props.onReject()}
          >
            reject
          </button>
          <button
            data-testid="custom-form-change1-btn"
            onClick={() => props.onChange({ coveredPayment: "Y" }, {})}
          >
            change1
          </button>
          <button
            data-testid="custom-form-change2-btn"
            onClick={() => props.onChange({ swiftType: "MT103" }, {})}
          >
            change2
          </button>
          <button
            data-testid="custom-form-change3-btn"
            onClick={() => props.onChange({ swiftType: "MT202" }, {})}
          >
            change3
          </button>
          <button
            data-testid="custom-form-change4-btn"
            onClick={() =>
              props.onChange(
                { coveredPayment: "N", swiftType: "MT202" },
                {
                  receiversCorrespondentBic: "12345678",
                  swiftType: "MT103",
                  settlementMeans: "NOS",
                }
              )
            }
          >
            change4
          </button>
          <button
            data-testid="custom-form-change5-btn"
            onClick={() =>
              props.onChange(
                { coveredPayment: "N", swiftType: "MT103" },
                {
                  receiversCorrespondentBic: "12345678",
                  swiftType: "MT103",
                  settlementMeans: "NOS",
                }
              )
            }
          >
            change5
          </button>
          <button
            data-testid="custom-form-change6-btn"
            onClick={() => props.onChange({}, {})}
          >
            change6
          </button>
          <button
            data-testid="custom-form-change7-btn"
            onClick={() =>
              props.onChange(
                { coveredPayment: "Y" },
                {
                  receiversCorrespondentBic: "12345678",
                  swiftType: "MT202",
                  settlementMeans: "CLG",
                }
              )
            }
          >
            change7
          </button>
          <button
            data-testid="custom-form-change8-btn"
            onClick={() => props.onChange()}
          >
            change8
          </button>
        </div>
      );
    },
    CustomFormGroup: (props) => {
      return (
        <div {...props}>
          {props.children}
          <button
            data-testid="custom-form-populate-rules-valid-btn"
            onClick={() =>
              props.populateRules?.({
                rules: [{ field: "field1" }],
                updateRules: vi.fn(),
              })
            }
          >
            populate-rules-valid
          </button>
          <button
            data-testid="custom-form-populate-rules-empty-btn"
            onClick={() =>
              props.populateRules?.({
                rules: undefined,
                updateRules: vi.fn(),
              })
            }
          >
            populate-rules-empty
          </button>
          <button
            data-testid="custom-form-submit-btn"
            onClick={() => props.onSubmit()}
          >
            submit
          </button>
          <button
            data-testid="custom-form-reject-btn"
            onClick={() => props.onReject()}
          >
            reject
          </button>
          <button
            data-testid="custom-form-change1-btn"
            onClick={() => props.onChange({ coveredPayment: "Y" }, {})}
          >
            change1
          </button>
          <button
            data-testid="custom-form-change2-btn"
            onClick={() => props.onChange({ swiftType: "MT103" }, {})}
          >
            change2
          </button>
          <button
            data-testid="custom-form-change3-btn"
            onClick={() => props.onChange({ swiftType: "MT202" }, {})}
          >
            change3
          </button>
          <button
            data-testid="custom-form-change4-btn"
            onClick={() =>
              props.onChange(
                { coveredPayment: "N", swiftType: "MT202" },
                {
                  receiversCorrespondentBic: "12345678",
                  swiftType: "MT103",
                  settlementMeans: "NOS",
                }
              )
            }
          >
            change4
          </button>
          <button
            data-testid="custom-form-change5-btn"
            onClick={() =>
              props.onChange(
                { coveredPayment: "N", swiftType: "MT103" },
                {
                  receiversCorrespondentBic: "12345678",
                  swiftType: "MT103",
                  settlementMeans: "NOS",
                }
              )
            }
          >
            change5
          </button>
          <button
            data-testid="custom-form-change6-btn"
            onClick={() => props.onChange({}, {})}
          >
            change6
          </button>
          <button
            data-testid="custom-form-change7-btn"
            onClick={() =>
              props.onChange(
                { coveredPayment: "Y" },
                {
                  receiversCorrespondentBic: "12345678",
                  swiftType: "MT202",
                  settlementMeans: "CLG",
                }
              )
            }
          >
            change7
          </button>
          <button
            data-testid="custom-form-change8-btn"
            onClick={() => props.onChange()}
          >
            change8
          </button>
        </div>
      );
    },
  };
});

describe("MultiExceptions component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render MultiExceptions correctly", async () => {
    const onTriggerAction = vi.fn();
    const setVostroFormFieldsValue = vi.fn();
    const counterPartyDetails = {
      fmEntity: {
        fmAccount: {
          fmId: "400594382",
          fmLongName: "LNAME 117327912267893627182930179763",
        },
        fmSysContact: [
          {
            addrLine: null,
            mediumUsage: null,
            mediumCode: null,
          },
        ],
        legalEntity: {
          registeredAddress: {
            line1: "Registered Line 1",
            line2: "Registered Line 2",
            city: "Registered City",
            country: "Registered Country",
            postCode: "Registered Post Code",
          }
        }
      },
    };
    const ref = {
      current: {
        forceRefreshValidation: vi.fn(),
        getForm: vi.fn(),
        setValidateStatus: vi.fn(),
        clearValidateStatus: vi.fn(),
        setFormConfig: vi.fn(),
        valuesChange: vi.fn(),
      },
    };

    const { getByTestId } = render(
      <VostroForm
        data={generateEmptyVostro()}
        disable
        actions={["Edit"]}
        onTriggerAction={onTriggerAction}
        setVostroFormFieldsValue={setVostroFormFieldsValue}
        counterPartyDetails={counterPartyDetails.fmEntity}
        ref={ref}
      />
    );
    fireEvent.click(getByTestId("custom-form-change1-btn"));
    fireEvent.click(getByTestId("custom-form-change2-btn"));
    fireEvent.click(getByTestId("custom-form-change3-btn"));
    fireEvent.click(getByTestId("custom-form-change4-btn"));
    fireEvent.click(getByTestId("custom-form-change5-btn"));
    fireEvent.click(getByTestId("custom-form-change6-btn"));
    fireEvent.click(getByTestId("custom-form-change7-btn"));
  });

  it("should trigger action button click callback", () => {
    const onTriggerAction = vi.fn();
    const { getByText } = render(
      <VostroForm
        data={generateEmptyVostro()}
        disable
        actions={["Edit"]}
        onTriggerAction={onTriggerAction}
        setVostroFormFieldsValue={vi.fn()}
        counterPartyDetails={{}}
      />
    );

    fireEvent.click(getByText("Edit"));
    expect(onTriggerAction).toHaveBeenCalledWith("Edit");
  });

  it("should not render edit action button when disable is false", () => {
    const { queryByText } = render(
      <VostroForm
        data={generateEmptyVostro()}
        disable={false}
        actions={["Edit"]}
        onTriggerAction={vi.fn()}
        setVostroFormFieldsValue={vi.fn()}
        counterPartyDetails={{}}
      />
    );

    expect(queryByText("Edit")).toBeNull();
  });

  it("should return null when data is undefined", () => {
    const { container } = render(
      <VostroForm
        data={undefined as any}
        disable={false}
        actions={["Edit"]}
        onTriggerAction={vi.fn()}
        setVostroFormFieldsValue={vi.fn()}
        counterPartyDetails={{}}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should invoke AdhocSSIHandlerFunction when populateRules sets valid rules", async () => {
    const ref = {
      current: {
        valuesChange: vi.fn(),
      },
    };

    const { getByTestId } = render(
      <VostroForm
        data={generateEmptyVostro()}
        disable={false}
        actions={["Edit"]}
        onTriggerAction={vi.fn()}
        setVostroFormFieldsValue={vi.fn()}
        counterPartyDetails={{}}
        cashflowDetails={{} as any}
        nostroDetailsData={{} as any}
        ref={ref as any}
      />
    );

    fireEvent.click(getByTestId("custom-form-change4-btn"));
    fireEvent.click(getByTestId("custom-form-populate-rules-valid-btn"));

    await waitFor(() => {
      expect(AdhocSSIHandlerFunction).toHaveBeenCalled();
    });
  });

  it("should return early when rules are missing in ruleContext", async () => {
    const { getByTestId } = render(
      <VostroForm
        data={generateEmptyVostro()}
        disable={false}
        actions={["Edit"]}
        onTriggerAction={vi.fn()}
        setVostroFormFieldsValue={vi.fn()}
        counterPartyDetails={{}}
        cashflowDetails={{} as any}
        nostroDetailsData={{} as any}
      />
    );

    fireEvent.click(getByTestId("custom-form-populate-rules-empty-btn"));

    await waitFor(() => {
      expect(AdhocSSIHandlerFunction).not.toHaveBeenCalled();
    });
  });

  it("should trigger valuesChange through ref on non-empty onChange", () => {
    const valuesChange = vi.fn();
    const ref = {
      current: {
        valuesChange,
      },
    };

    const { getByTestId } = render(
      <VostroForm
        data={generateEmptyVostro()}
        disable={false}
        actions={["Edit"]}
        onTriggerAction={vi.fn()}
        setVostroFormFieldsValue={vi.fn()}
        counterPartyDetails={{
          fmAccount: { fmId: "1", fmLongName: "NAME" },
          fmSysContact: [],
        }}
        ref={ref as any}
      />
    );

    fireEvent.click(getByTestId("custom-form-change4-btn"));
    expect(valuesChange).toHaveBeenCalled();
  });

  it("should handle onChange call with default parameters", () => {
    const { getByTestId } = render(
      <VostroForm
        data={generateEmptyVostro()}
        disable={false}
        actions={["Edit"]}
        onTriggerAction={vi.fn()}
        setVostroFormFieldsValue={vi.fn()}
        counterPartyDetails={{}}
      />
    );

    fireEvent.click(getByTestId("custom-form-change8-btn"));
  });
});
describe("debounceSetFormFieldsValue", () => {
  vi.useFakeTimers();

  it("should call set function with the provided fieldsValue after debounce delay", () => {
    const mockSet = vi.fn();
    const fieldsValue = { key: "value" };

    debounceSetFormFieldsValue(mockSet, fieldsValue);
    expect(mockSet).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(mockSet).toHaveBeenCalledWith(fieldsValue);
  });

  it("should not call set function if debounce time has not passed", () => {
    const mockSet = vi.fn();
    const fieldsValue = { key: "value" };

    debounceSetFormFieldsValue(mockSet, fieldsValue);
    vi.advanceTimersByTime(300);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it("should call set function only once if called multiple times within debounce delay", () => {
    const mockSet = vi.fn();
    const fieldsValue1 = { key: "value1" };
    const fieldsValue2 = { key: "value2" };

    debounceSetFormFieldsValue(mockSet, fieldsValue1);
    debounceSetFormFieldsValue(mockSet, fieldsValue2);

    vi.advanceTimersByTime(500);
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith(fieldsValue2);
  });

  it("should handle empty fieldsValue gracefully", () => {
    const mockSet = vi.fn();

    debounceSetFormFieldsValue(mockSet, {});
    vi.advanceTimersByTime(500);
    expect(mockSet).toHaveBeenCalledWith({});
  });

  it("should handle null fieldsValue gracefully", () => {
    const mockSet = vi.fn();

    debounceSetFormFieldsValue(mockSet, null);
    vi.advanceTimersByTime(500);
    expect(mockSet).toHaveBeenCalledWith(null);
  });

  it("should handle undefined fieldsValue gracefully", () => {
    const mockSet = vi.fn();

    debounceSetFormFieldsValue(mockSet, undefined);
    vi.advanceTimersByTime(500);
    expect(mockSet).toHaveBeenCalledWith(undefined);
  });

  it("should not throw error if set function is not provided", () => {
    expect(() => {
      debounceSetFormFieldsValue(undefined, { key: "value" });
      vi.advanceTimersByTime(500);
    }).toThrow();
  });
});

describe("handleCoveredPayment", () => {
  const mockSetVostroFormFieldsValue = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should set coveredPayment to 'Y' when settlementMeans is 'NOS', swiftType is 'MT103', and receiversCorrespondentBic is valid", () => {
    const changes = { coveredPayment: "N" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT103",
      receiversCorrespondentBic: "ABCDEFGH",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "Y",
    });
  });

  it("should set coveredPayment to 'N' when settlementMeans is 'NOS', swiftType is 'MT103', and receiversCorrespondentBic is invalid", () => {
    const changes = { coveredPayment: "N" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT103",
      receiversCorrespondentBic: "",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "N",
    });
  });

  it("should set coveredPayment to 'N' when settlementMeans is not 'NOS'", () => {
    const changes = { coveredPayment: "N" };
    const formData = {
      settlementMeans: "CLG",
      swiftType: "MT103",
      receiversCorrespondentBic: "ABCDEFGH",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "N",
    });
  });

  it("should set coveredPayment to 'N' when swiftType is not 'MT103'", () => {
    const changes = { coveredPayment: "N" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT202",
      receiversCorrespondentBic: "ABCDEFGH",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "N",
    });
  });

  it("should set coveredPayment to 'N' when receiversCorrespondentBic is invalid", () => {
    const changes = { coveredPayment: "N" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT103",
      receiversCorrespondentBic: "INVALID",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "N",
    });
  });

  it("should set coveredPayment to 'Y' when changes include swiftType and bic is present", () => {
    const changes = { swiftType: "MT103" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT103",
      receiversCorrespondentBic: "ABCDEFGH",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "Y",
    });
  });

  it("should set coveredPayment to 'N' when coveredPayment is 'Y' and swiftType is not 'MT103'", () => {
    const changes = { coveredPayment: "Y" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT202",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "N",
    });
  });

  it("should set coveredPayment to 'N' when coveredPayment is 'Y' and settlementMeans is not 'NOS'", () => {
    const changes = { coveredPayment: "Y" };
    const formData = {
      settlementMeans: "CLG",
      swiftType: "MT103",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      coveredPayment: "N",
    });
  });

  it("should not call setVostroFormFieldsValue when coveredPayment is 'Y' and swiftType is 'MT103' and settlementMeans is 'NOS'", () => {
    const changes = { coveredPayment: "Y" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT103",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).not.toHaveBeenCalled();
  });

  it("should not call setVostroFormFieldsValue if formData is empty", () => {
    const changes = { coveredPayment: "N" };
    const formData = {};

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({ "coveredPayment": "N" });
  });

  it("should not call setVostroFormFieldsValue if changes do not affect coveredPayment", () => {
    const changes = { unrelatedField: "value" };
    const formData = {
      settlementMeans: "NOS",
      swiftType: "MT103",
      receiversCorrespondentBic: "ABCDEFGH",
    };

    handleCoveredPayment(changes, formData, mockSetVostroFormFieldsValue);

    vi.advanceTimersByTime(500);
    expect(mockSetVostroFormFieldsValue).not.toHaveBeenCalled();
  });
});

describe("handleAutoPopulate", () => {
  const mockSetVostroFormFieldsValue = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should populate fields correctly for swiftType 'MT103' with valid counterPartyDetails", () => {
    const changes = { swiftType: "MT103" };
    const counterPartyDetails = {
      fmAccount: {
        fmId: "123456789",
        fmLongName: "Test Long Name",
      },
      legalEntity: {
        registeredAddress: {
          line1: "Registered Line 1",
          line2: "Registered Line 2",
          city: "Registered City",
          country: "Registered Country",
          postCode: "Registered Post Code",
          countryCode: "RC",
        }
      }
    };
    const forceRefreshAfterAutoPopulate = vi.fn();


    handleAutoPopulate(changes, counterPartyDetails, mockSetVostroFormFieldsValue, forceRefreshAfterAutoPopulate);

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      ssiType: "Primary",
      beneficiaryBic: "",
      beneficiaryAddress: "Registered Line 1 Registered Line 2 Registered City",
      beneficiaryCity: "Registered Country",
      charges: "OUR",
      beneficiaryAddress1: "Registered Line 1",
      beneficiaryAddress2: "Registered Line 2",
      beneficiaryCityName: "Registered City",
      beneficiaryCountryIsoCode: "RC",
      beneficiaryPostCode: "Registered Post Code",

      beneficiaryName: "Test Long Name",
      orderCustomerName: "Test Long Name",
      orderCustomerAddress: "Registered Line 1 Registered Line 2 Registered City",
      orderCustomerCity: "Registered Country",
      orderCustomerAccount: "123456789",
      orderCustomerAddress1: "Registered Line 1",
      orderCustomerAddress2: "Registered Line 2",
      orderCustomerCityName: "Registered City",
      orderCustomerCountryIsoCode: "RC",
      orderCustomerPostCode: "Registered Post Code",
    });
  });

  it("should set ISO country fields from registeredAddress.countryCode for swiftType 'MT103'", () => {
    const changes = { swiftType: "MT103" };
    const counterPartyDetails = {
      fmAccount: {
        fmId: "123456789",
        fmLongName: "Test Long Name",
      },
      legalEntity: {
        registeredAddress: {
          line1: "Registered Line 1",
          line2: "Registered Line 2",
          city: "Registered City",
          country: "United States",
          postCode: "12345",
          countryCode: "US",
        },
      },
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(
      changes,
      counterPartyDetails,
      mockSetVostroFormFieldsValue,
      forceRefreshAfterAutoPopulate
    );

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith(
      expect.objectContaining({
        beneficiaryCountryIsoCode: "US",
        orderCustomerCountryIsoCode: "US",
        beneficiaryPostCode: "12345",
        orderCustomerPostCode: "12345",
      })
    );
  });

  it("should default ISO country fields to empty when registeredAddress.countryCode is missing", () => {
    const changes = { swiftType: "MT103" };
    const counterPartyDetails = {
      fmAccount: {
        fmId: "123456789",
        fmLongName: "Test Long Name",
      },
      legalEntity: {
        registeredAddress: {
          line1: "Registered Line 1",
          line2: "Registered Line 2",
          city: "Registered City",
          country: "United States",
          postCode: "12345",
        },
      },
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(
      changes,
      counterPartyDetails,
      mockSetVostroFormFieldsValue,
      forceRefreshAfterAutoPopulate
    );

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith(
      expect.objectContaining({
        beneficiaryCountryIsoCode: "",
        orderCustomerCountryIsoCode: "",
      })
    );
  });

  it("should truncate beneficiaryName if it exceeds MAX_NAME_SIZE for swiftType 'MT103'", () => {
    const changes = { swiftType: "MT103" };
    const counterPartyDetails = {
      fmAccount: {
        fmId: "123456789",
        fmLongName: "A".repeat(40),
      },
      legalEntity: {
        registeredAddress: {
          line1: "Registered Line 1",
          line2: "Registered Line 2",
          city: "Registered City",
          country: "Registered Country",
          postCode: "Registered Post Code",
          countryCode: "RC",
        }
      }
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(changes, counterPartyDetails, mockSetVostroFormFieldsValue, forceRefreshAfterAutoPopulate);

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      ssiType: "Primary",
      beneficiaryBic: "",
      beneficiaryAddress: "Registered Line 1 Registered Line 2 Registered City",
      beneficiaryCity: "Registered Country",
      charges: "OUR",
      beneficiaryName: "A".repeat(35),
      beneficiaryName2: "A".repeat(5),
      orderCustomerName: "A".repeat(40),
      orderCustomerAddress: "Registered Line 1 Registered Line 2 Registered City",
      orderCustomerCity: "Registered Country",
      orderCustomerAccount: "123456789",

      beneficiaryAddress1: "Registered Line 1",
      beneficiaryAddress2: "Registered Line 2",
      beneficiaryCityName: "Registered City",
      beneficiaryCountryIsoCode: "RC",
      beneficiaryPostCode: "Registered Post Code",
      orderCustomerAddress1: "Registered Line 1",
      orderCustomerAddress2: "Registered Line 2",
      orderCustomerCityName: "Registered City",
      orderCustomerCountryIsoCode: "RC",
      orderCustomerPostCode: "Registered Post Code",
    });
  });

  it("should populate fields correctly for swiftType 'MT202' with valid counterPartyDetails", () => {
    const changes = { swiftType: "MT202" };
    const counterPartyDetails = {
      fmSysContact: [
        {
          mediumCode: "SWIFT",
          mediumUsage: "MAIN",
          addrLine: "SWIFT123",
        },
      ],
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(changes, counterPartyDetails, mockSetVostroFormFieldsValue, forceRefreshAfterAutoPopulate);

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      ssiType: "Primary",
      beneficiaryBic: "SWIFT123",
      beneficiaryAddress: "",
      beneficiaryCity: "",
      charges: "",
      beneficiaryName: "",
      beneficiaryName2: "",
      orderCustomerName: "",
      orderCustomerAddress: "",
      orderCustomerCity: "",
      orderCustomerAccount: "",
      beneficiaryAddress1: "",
      beneficiaryAddress2: "",
      beneficiaryCityName: "",
      beneficiaryCountryIsoCode: "",
      beneficiaryPostCode: "",
      orderCustomerAddress1: "",
      orderCustomerAddress2: "",
      orderCustomerCityName: "",
      orderCustomerCountryIsoCode: "",
      orderCustomerPostCode: "",
    });
  });

  it("should not call setVostroFormFieldsValue if counterPartyDetails is undefined", () => {
    const changes = { swiftType: "MT103" };
    const forceRefreshAfterAutoPopulate = vi.fn();


    handleAutoPopulate(changes, undefined, mockSetVostroFormFieldsValue, forceRefreshAfterAutoPopulate);

    expect(mockSetVostroFormFieldsValue).not.toHaveBeenCalled();
  });

  it("should not call setVostroFormFieldsValue if changes do not include swiftType", () => {
    const changes = { unrelatedField: "value" };
    const counterPartyDetails = {
      fmAccount: {
        fmId: "123456789",
        fmLongName: "Test Long Name",
      },
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(changes, counterPartyDetails, mockSetVostroFormFieldsValue, forceRefreshAfterAutoPopulate);

    expect(mockSetVostroFormFieldsValue).not.toHaveBeenCalled();
  });

  it("should handle missing registeredAddress gracefully for swiftType 'MT103'", () => {
    const changes = { swiftType: "MT103" };
    const counterPartyDetails = {
      fmAccount: {
        fmId: "123456789",
        fmLongName: "Test Long Name",
      },
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(changes, counterPartyDetails, mockSetVostroFormFieldsValue, forceRefreshAfterAutoPopulate);

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      ssiType: "Primary",
      beneficiaryBic: "",
      beneficiaryAddress: "  ",
      beneficiaryCity: "",
      charges: "OUR",
      beneficiaryName: "Test Long Name",
      orderCustomerName: "Test Long Name",
      orderCustomerAddress: "  ",
      orderCustomerCity: "",
      orderCustomerAccount: "123456789",
      beneficiaryAddress1: "",
      beneficiaryAddress2: "",
      beneficiaryCityName: "",
      beneficiaryCountryIsoCode: "",
      beneficiaryPostCode: "",
      orderCustomerAddress1: "",
      orderCustomerAddress2: "",
      orderCustomerCityName: "",
      orderCustomerCountryIsoCode: "",
      orderCustomerPostCode: "",
    });
  });

  it("should handle missing fmSysContact gracefully for swiftType 'MT202'", () => {
    const changes = { swiftType: "MT202" };
    const counterPartyDetails = {};

    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(changes, counterPartyDetails, mockSetVostroFormFieldsValue, forceRefreshAfterAutoPopulate);

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      ssiType: "Primary",
      beneficiaryBic: undefined,
      beneficiaryAddress: "",
      beneficiaryCity: "",
      charges: "",
      beneficiaryName: "",
      beneficiaryName2: "",
      orderCustomerName: "",
      orderCustomerAddress: "",
      orderCustomerCity: "",
      orderCustomerAccount: "",
      beneficiaryAddress1: "",
      beneficiaryAddress2: "",
      beneficiaryCityName: "",
      beneficiaryCountryIsoCode: "",
      beneficiaryPostCode: "",
      orderCustomerAddress1: "",
      orderCustomerAddress2: "",
      orderCustomerCityName: "",
      orderCustomerCountryIsoCode: "",
      orderCustomerPostCode: "",
    });
  });

  it("should handle legalEntity without registeredAddress for swiftType 'MT103'", () => {
    const changes = { swiftType: "MT103" };
    const counterPartyDetails = {
      fmAccount: {
        fmId: "123456789",
        fmLongName: "Test Long Name",
      },
      legalEntity: {}, // registeredAddress missing
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(
      changes,
      counterPartyDetails,
      mockSetVostroFormFieldsValue,
      forceRefreshAfterAutoPopulate
    );

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      ssiType: "Primary",
      beneficiaryBic: "",
      beneficiaryAddress: "  ",
      beneficiaryCity: "",
      charges: "OUR",
      beneficiaryName: "Test Long Name",
      orderCustomerName: "Test Long Name",
      orderCustomerAddress: "  ",
      orderCustomerCity: "",
      orderCustomerAccount: "123456789",
      beneficiaryAddress1: "",
      beneficiaryAddress2: "",
      beneficiaryCityName: "",
      beneficiaryCountryIsoCode: "",
      beneficiaryPostCode: "",
      orderCustomerAddress1: "",
      orderCustomerAddress2: "",
      orderCustomerCityName: "",
      orderCustomerCountryIsoCode: "",
      orderCustomerPostCode: "",
    });
  });

  it("should handle missing fmAccount for swiftType 'MT103'", () => {
    const changes = { swiftType: "MT103" };
    const counterPartyDetails = {
      legalEntity: {
        registeredAddress: {
          line1: "Registered Line 1",
          line2: "Registered Line 2",
          city: "Registered City",
          country: "Registered Country",
          countryCode: "RC",
          postCode: "12345",
        },
      },
    };
    const forceRefreshAfterAutoPopulate = vi.fn();

    handleAutoPopulate(
      changes,
      counterPartyDetails,
      mockSetVostroFormFieldsValue,
      forceRefreshAfterAutoPopulate
    );

    expect(mockSetVostroFormFieldsValue).toHaveBeenCalledWith({
      ssiType: "Primary",
      beneficiaryBic: "",
      beneficiaryAddress: "Registered Line 1 Registered Line 2 Registered City",
      beneficiaryCity: "Registered Country",
      charges: "OUR",
      beneficiaryName: "",
      orderCustomerName: "",
      orderCustomerAddress: "Registered Line 1 Registered Line 2 Registered City",
      orderCustomerCity: "Registered Country",
      orderCustomerAccount: "",
      beneficiaryAddress1: "Registered Line 1",
      beneficiaryAddress2: "Registered Line 2",
      beneficiaryCityName: "Registered City",
      beneficiaryCountryIsoCode: "RC",
      beneficiaryPostCode: "12345",
      orderCustomerAddress1: "Registered Line 1",
      orderCustomerAddress2: "Registered Line 2",
      orderCustomerCityName: "Registered City",
      orderCustomerCountryIsoCode: "RC",
      orderCustomerPostCode: "12345",
    });
  });
});
