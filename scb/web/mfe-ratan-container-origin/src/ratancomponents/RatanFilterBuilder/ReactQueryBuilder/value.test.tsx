import { generateGetValueEditorType, getDefaultValue } from "./value";

afterAll(() => {
  jest.clearAllMocks();
});

describe("value component", () => {
  it("text type", async () => {
    const fields = [
      {
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
    ];
    const generateGetValueEditorTypeFunc = generateGetValueEditorType(fields);
    const getValueEditorType = generateGetValueEditorTypeFunc(
      "Action_Type",
      "in"
    );
    expect(getValueEditorType).toEqual("multiselect");

    const getValueEditorType1 = generateGetValueEditorTypeFunc(
      "Action_Type",
      "="
    );
    expect(getValueEditorType1).toEqual(null);
  });
  it("number type", async () => {
    const fields = [
      {
        name: "Cash_Financial_Instrument.Exchanged_Currency2_Payment_Amount",
        label: "Cash_Financial_Instrument.Exchanged_Currency2_Payment_Amount",
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
          indexedTerm:
            "Cash_Financial_Instrument.Exchanged_Currency2_Payment_Amount",
          businessTerm: "",
          dataType: "number",
          subSelection: "Cash_Financial_Instrument",
          context: "TRANSACTION_DATA",
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
          seq: 227,
          blotterContext: ["TRANSACTION_DATA"],
        },
      },
    ];
    const generateGetValueEditorTypeFunc = generateGetValueEditorType(fields);
    const getValueEditorType = generateGetValueEditorTypeFunc(
      "Cash_Financial_Instrument.Exchanged_Currency2_Payment_Amount",
      "in"
    );
    expect(getValueEditorType).toEqual("multipleinputnumber");

    const getValueEditorType1 = generateGetValueEditorTypeFunc(
      "Cash_Financial_Instrument.Exchanged_Currency2_Payment_Amount",
      "<="
    );
    expect(getValueEditorType1).toEqual(null);
  });
  it("date type", async () => {
    const fields = [
      {
        name: "Option_Instrument.Effective_Date",
        label: "Option_Instrument.Effective_Date",
        inputType: "date",
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
          indexedTerm: "Option_Instrument.Effective_Date",
          businessTerm: "",
          dataType: "date",
          subSelection: "Option_Instrument",
          context: "TRANSACTION_DATA",
          displayStyle: "datePicker",
          valueList: [],
          operators: "BET",
          operatorsSupp: "==,!=",
          detailsFixed: false,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 295,
          blotterContext: ["TRANSACTION_DATA"],
          colDefs: {},
        },
      },
    ];
    const generateGetValueEditorTypeFunc = generateGetValueEditorType(fields);
    const getValueEditorType = generateGetValueEditorTypeFunc(
      "Option_Instrument.Effective_Date",
      "in"
    );
    expect(getValueEditorType).toEqual("multipledatepicker");

    const getValueEditorType1 = generateGetValueEditorTypeFunc(
      "Option_Instrument.Effective_Date",
      ">"
    );
    expect(getValueEditorType1).toEqual(null);
  });
  it("boolean type", async () => {
    const fields = [
      {
        name: "Are_Both_Parties_On_Venue",
        label: "Are_Both_Parties_On_Venue",
        inputType: "boolean",
        values: [
          {
            label: "false",
            title: "false",
            value: "false",
            name: "false",
          },
          {
            label: "true",
            title: "true",
            value: "true",
            name: "true",
          },
        ],
        operators: [
          {
            name: "=",
            label: "=",
          },
        ],
        config: {
          indexedTerm: "Are_Both_Parties_On_Venue",
          businessTerm: "",
          dataType: "boolean",
          subSelection: "Trade",
          context: "TRANSACTION_DATA",
          displayStyle: "dropdown",
          valueList: [
            {
              label: "false",
              title: "false",
              value: "false",
              name: "false",
            },
            {
              label: "true",
              title: "true",
              value: "true",
              name: "true",
            },
          ],
          operators: "EQ",
          operatorsSupp: "==,!=",
          detailsFixed: false,
          dynamicList: false,
          disabledView: false,
          disabledFilter: false,
          disabledPages: "",
          detailsGroup: "",
          seq: 121,
          blotterContext: ["TRANSACTION_DATA"],
        },
      },
    ];
    const generateGetValueEditorTypeFunc = generateGetValueEditorType(fields);
    const getValueEditorType = generateGetValueEditorTypeFunc(
      "Are_Both_Parties_On_Venue",
      "="
    );
    expect(getValueEditorType).toEqual("radio");
  });
});
