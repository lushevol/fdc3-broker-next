import { render } from "@testing-library/react";
import { generateFieldsCascaderOptions, CustomValueEditor } from "./Components";
import CascaderBuilder from "../../RatanOne/mocks/CascaderBuilder.json";

afterAll(() => {
  vi.clearAllMocks();
});

describe("component", () => {
  const props = {
    testID: "value-editor",
    field: "Action_Type",
    handleOnChange: vi.fn(),
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
    title: "Value",
    value: "",
    valueSource: "value",
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
    listsAsArrays: true,
    parseNumbers: true,
    separator: null,
    className: "rule-value",
    level: 1,
    path: [2],
    disabled: false,
    validation: null,
    schema: {},
    rule: {
      field: "Action_Type",
      operator: "=",
      value: "",
      id: "f94cdc78-548e-4b5c-9435-f61808148696",
    },
  };
  it("generateFieldsCascaderOptions", async () => {
    const props = {
      fields: CascaderBuilder,
      disableFields: [],
    };
    const newFieldsCascaderOptions = generateFieldsCascaderOptions(
      props.fields,
      props.disableFields
    );
    expect(newFieldsCascaderOptions).toHaveLength(15);
  });
  it("CustomValueEditor", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"text"}
        inputType={"text"}
      />
    );
    expect(
      getByTestId("customAntDValueEditor-autoComplete")
    ).toBeInTheDocument();

    render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"text"}
        inputType={"select"}
        value={[]}
      />
    );
    expect(getByTestId("customAntDValueEditor-Input")).toBeInTheDocument();

    render(
      <CustomValueEditor
        {...props}
        operator={"empty"}
        type={"text"}
        inputType={"text"}
      />
    );
    expect(screen).toBeDefined;
  });
  it("CustomValueEditor1", async () => {
    const { getAllByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"between"}
        type={"text"}
        inputType={"time"}
      />
    );
    expect(getAllByTestId("time-picker")[0]).toBeInTheDocument();
  });
  it("CustomValueEditor2", async () => {
    const { getAllByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"between"}
        type={"text"}
        inputType={"text"}
      />
    );
    expect(getAllByTestId("text-input")[0]).toBeInTheDocument();
  });
  it("CustomValueEditor3", async () => {
    const { getAllByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"between"}
        type={"select"}
        inputType={"text"}
      />
    );
    expect(getAllByTestId("custom-value-selector")[0]).toBeInTheDocument();
  });
    it("CustomValueEditor4", async () => {
    const { getAllByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"multiselect"}
        inputType={"text"}
      />
    );
    expect(getAllByTestId("custom-value-selector")[0]).toBeInTheDocument();
  });
      it("CustomValueEditor5", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"textarea"}
        inputType={"text"}
      />
    );
    expect(getByTestId("textarea-input")).toBeInTheDocument();
  });
  it("CustomValueEditor6", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"switch"}
        inputType={"text"}
      />
    );
    expect(getByTestId("switch-type")).toBeInTheDocument();
  });
    it("CustomValueEditor7", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"checkbox"}
        inputType={"text"}
      />
    );
    expect(getByTestId("checkbox-type")).toBeInTheDocument();
  });
    it("CustomValueEditor8", async () => {
    const { getAllByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"radio"}
        inputType={"text"}
      />
    );
    expect(getAllByTestId("radio-type")[0]).toBeInTheDocument();
  });

        it("CustomValueEditor9", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"multipleinputnumber"}
        inputType={"text"}
      />
    );
    expect(getByTestId("multiple-input-number")).toBeInTheDocument();
  });
          it("CustomValueEditor10", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"multipledatepicker"}
        inputType={"text"}
      />
    );
    expect(getByTestId("multiple-date-picker-text")).toBeInTheDocument();
  });
  it("CustomValueEditor11", async () => {
    const { getAllByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"between"}
        type={"date"}
        inputType={"datetime-local"}
      />
    );
    expect(getAllByTestId("datePicker-rangePicker")).toHaveLength(2);
  });
    it("CustomValueEditor12", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"between"}
        type={"date"}
        inputType={"time"}
      />
    );
    expect(getByTestId("datePicker-timePicker")).toBeInTheDocument();
  });
  it("CustomValueEditor13", async () => {
    const { getByTestId } = render(
      <CustomValueEditor
        {...props}
        operator={"="}
        type={"date"}
        inputType={"datetime-local"}
      />
    );
    expect(getByTestId("datetime-local")).toBeInTheDocument();
  });
  it("CustomValueEditor14 with enableFn", async () => {
    const newProps = {
      testID: "value-editor",
      field: "split(Action_Type,|,2)",
      handleOnChange: vi.fn(),
      enableFn: true,
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
          dataType: "datetime-local",
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
      title: "Value",
      value: "",
      valueSource: "value",
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
      listsAsArrays: true,
      parseNumbers: true,
      separator: null,
      className: "rule-value",
      level: 1,
      path: [2],
      disabled: false,
      validation: null,
      schema: {
        fieldMap:{
          Action_Type:{
            config:{
            indexedTerm: "Action_Type",
            businessTerm: "",
            dataType: "datetime-local",
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
          }},
        }
      },
      rule: {
        field: "Action_Type",
        operator: "=",
        value: "",
        id: "f94cdc78-548e-4b5c-9435-f61808148696",
      },
    };
    const mockFunctionConfig = [{
      displayName: "Split",
      description: "Case: FieldA(value is \"AAA_BBB\") using Split(\"_\",1) \nResult is \"AAA\"",
      functionName: "split",
      parameters: [
        {
          "paramType": "TEXT",
          "renderComp": "FunInput",
          "defaultValue": ""
        },
        {
          "paramType": "NUMBER",
          "renderComp": "FunInputNumber",
          "defaultValue": ""
        }
      ],
      methodReturnType: [
        {
          paramType: "TEXT",
          renderComp: "FunInput",
          defaultValue: ""
        }
      ],
      supportTargetObjectClass: [
        "TEXT"
      ]
    }];
    const { getByTestId } = render(
      <CustomValueEditor
        {...newProps}
        operator={"between"}
        type={"date"}
        inputType={"datetime-local"}
        functionConfig= {mockFunctionConfig}
      />
    );
    expect(getByTestId("customAntDValueEditor-autoComplete")).toBeInTheDocument();
  });

});
