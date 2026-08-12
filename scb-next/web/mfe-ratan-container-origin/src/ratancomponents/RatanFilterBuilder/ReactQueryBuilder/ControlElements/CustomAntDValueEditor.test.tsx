import { render } from "@testing-library/react";
import dayjs from "dayjs";
import { CustomAntDValueEditor, handelDateValue, handleInputOnChange } from "./CustomAntDValueEditor";

afterAll(() => {
  vi.clearAllMocks();
});

describe("CustomAntDValueEditor component", () => {
  it("should be in the document", async () => {
    const props = {
      fieldData: {
        name: "Action_Type",
        label: "Action_Type",
        inputType: "text",
        values: [
          {
            label: "Undo",
            title: "Undo",
            value: "Undo",
            name: "Undo",
          },
          {
            label: "Update",
            title: "Update",
            value: "Update",
            name: "Update",
          },
        ],
        operators: [
          {
            name: "=",
            label: "=",
          },
          {
            name: "!=",
            label: "!=",
          },
          {
            name: "contains",
            label: "contains",
          },
          {
            name: "in",
            label: "in",
          },
          {
            name: "notIn",
            label: "not in",
          },
        ],
        config: {
          indexedTerm: "Action_Type",
          businessTerm: "",
          dataType: "text",
          subSelection: "Trade",
          context: "TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList: [
            {
              label: "Undo",
              title: "Undo",
              value: "Undo",
              name: "Undo",
            },
            {
              label: "Update",
              title: "Update",
              value: "Update",
              name: "Update",
            },
          ],
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: true,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 143,
          blotterContext: ["TRANSACTION_DATA"],
        },
      },
      options: "=",
      value: "200",
      handleOnChange: vi.fn(),
      title: "title",
      className: "",
      inputType: "text",
      listsAsArrays: true,
      disabled: false,
      field: "Action_Type",
      skipHook: true,
      path: [0],
      level: 1,
      operator: "=",
      valueSource: "field",
      rule: {
        field: "Action_Type",
        operator: "=",
        value: "",
        id: "6b81da16-5ea5-4126-9f53-ee9013a5de46",
      },
      values: [
        {
          label: "Undo",
          title: "Undo",
          value: "Undo",
          name: "Undo",
        },
        {
          label: "Update",
          title: "Update",
          value: "Update",
          name: "Update",
        },
      ],
      parseNumbers: true,
    };
    const { getByTestId } = render(<CustomAntDValueEditor {...props} />);
    const autoComplete = getByTestId("customAntDValueEditor-autoComplete");
    expect(autoComplete).toBeDefined();
  });
  it("should be in the document", async () => {
    const props = {
      fieldData: {
        name: "Cashflow.Payment_Amount",
        label: "Cashflow.Payment_Amount",
        inputType: "number",
        values: [],
        operators: [
          {
            name: "=",
            label: "=",
          },
          {
            name: "!=",
            label: "!=",
          },
          {
            name: "<",
            label: "<",
          },
          {
            name: ">",
            label: ">",
          },
          {
            name: "<=",
            label: "<=",
          },
          {
            name: ">=",
            label: ">=",
          },
          {
            name: "in",
            label: "in",
          },
          {
            name: "notIn",
            label: "not in",
          },
          {
            name: "between",
            label: "between",
          },
        ],
        config: {
          indexedTerm: "Cashflow.Payment_Amount",
          businessTerm: "Amount",
          dataType: "number",
          subSelection: "Cashflow",
          context: "CASHFLOW_DATA",
          displayStyle: "freeText",
          valueList: [],
          operators: "EQ",
          operatorsSupp: "==,!=,<IN>",
          detailsFixed: false,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 16,
          blotterContext: ["CASHFLOW_DATA"],
          index: 13,
          colDefs: {
            width: 120,
            hide: false,
          },
        },
      },
      options: "in",
      value: "200",
      handleOnChange: vi.fn(),
      title: "title",
      className: "",
      inputType: "text",
      listsAsArrays: true,
      disabled: false,
      field: "Action_Type",
      skipHook: true,
      path: [0],
      level: 1,
      operator: "=",
      valueSource: "field",
      rule: {
        field: "Action_Type",
        operator: "=",
        value: "",
        id: "6b81da16-5ea5-4126-9f53-ee9013a5de46",
      },
      values: [
        {
          label: "Undo",
          title: "Undo",
          value: "Undo",
          name: "Undo",
        },
        {
          label: "Update",
          title: "Update",
          value: "Update",
          name: "Update",
        },
      ],
      parseNumbers: true,
    };
    const { getByTestId } = render(<CustomAntDValueEditor {...props} />);
    const autoComplete = getByTestId("customAntDValueEditor-autoComplete");
    expect(autoComplete).toBeDefined();
  });

  it("handelDateValue", () => {
    const result1 = handelDateValue([dayjs("2019-04-03T06:00:00.000Z"), dayjs("2019-04-04T06:00:00.000Z")], "YYYY-MM-DD", true);
    expect(result1).toEqual(["2019-04-03", "2019-04-04"]);

    const result2 = handelDateValue([dayjs("2019-04-03T06:00:00.000Z"), dayjs("2019-04-04T06:00:00.000Z")], "YYYY-MM-DD", false);
    expect(result2).toEqual("2019-04-03,2019-04-04");

    const result3 = handelDateValue([null, null], "YYYY-MM-DD", false);
    expect(result3).toEqual(",");
  });

  describe("handleInputOnChange", () => {
    const handleOnChange = vi.fn();

    it("should handle value within range", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("15", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("15");
    });

    it("should handle value below minimum", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("5", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("10");
    });

    it("should handle value above maximum", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("25", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("20");
    });

    it("should handle value when no range is specified", () => {
      const compObj = {};
      handleInputOnChange("15", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("15");
    });

    it("should handle non-numeric input", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("abc", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("10");
    });

    it("should handle empty input", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("");
    });

    it("should handle negative numbers", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("-15", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("10");
    });

    it("should handle decimal numbers", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("15.5", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("15");
    });

    it("should handle numbers with leading zeros", () => {
      const compObj = { enumValues: "10-20" };
      handleInputOnChange("015", compObj, handleOnChange);
      expect(handleOnChange).toHaveBeenCalledWith("15");
    });
  });
});
