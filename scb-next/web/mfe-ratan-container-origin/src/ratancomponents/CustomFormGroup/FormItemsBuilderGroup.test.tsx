import React from "react";
import { render, screen } from "@testing-library/react";
import FormItemsBuilderGroup from "./FormItemsBuilderGroup";
import { NewItem } from "../CustomForm/FormItemComponents";
import { getIsRequired, getRules } from "../CustomForm/item/ItemsUtils";

vi.mock("../CustomForm/FormItemComponents", () => {
  const MockNewItem = vi.fn((props) => (
    <div data-testid={`new-item-${props.field || "no-field"}`} />
  ));
  return {
    __esModule: true,
    NewItem: MockNewItem,
  };
});

vi.mock("../CustomForm/item/ItemsUtils", () => ({
  __esModule: true,
  getIsRequired: vi.fn((value) => Boolean(value)),
  getRules: vi.fn((rules, isRequired) => [
    { name: "fromGetRules", rules, isRequired },
  ]),
}));

describe("FormItemsBuilderGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders group titles, child group titles, and items", () => {
    const props = {
      enable: { submiting: false, ruleError: false },
      editable: true,
      error: {},
      isRequiredObj: {},
      newFormConfig: [
        {
          title: "Group A",
          row: [
            {
              itemConfig: [{ field: "field1", col: 8 }],
            },
          ],
          childGroup: [
            {
              title: "Child A",
              row: [
                {
                  itemConfig: [{ field: "field2", col: 12 }],
                },
              ],
            },
          ],
        },
        {
          title: "Group B",
          row: [
            {
              childGroup: [
                {
                  title: "Child B",
                  row: [
                    {
                      itemConfig: [{ field: "field3" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      customValidateStatus: {},
      messageApi: {},
      customRules: [],
      rulesObj: {},
      data: {},
      form: {},
      onUpdate: vi.fn(),
    };

    render(<FormItemsBuilderGroup {...props} />);

    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText("Group B")).toBeInTheDocument();
    expect(screen.getByText("Child A")).toBeInTheDocument();
    expect(screen.getByText("Child B")).toBeInTheDocument();
    expect(screen.getByTestId("new-item-field1")).toBeInTheDocument();
    expect(screen.getByTestId("new-item-field2")).toBeInTheDocument();
    expect(screen.getByTestId("new-item-field3")).toBeInTheDocument();
  });

  it("passes required, disabled, rules, and validate status to NewItem", () => {
    const customRules = [{ name: "customRule" }];
    const itemRules = [{ name: "itemRule" }];
    const props = {
      enable: { submiting: true, ruleError: false },
      editable: true,
      error: { any: true },
      isRequiredObj: { field1: true },
      newFormConfig: [
        {
          row: [
            {
              itemConfig: [
                {
                  field: "field1",
                  isRequired: false,
                  itemRules,
                  disabled: false,
                },
              ],
            },
          ],
        },
      ],
      customValidateStatus: {
        field1: { validateStatus: "error", help: "Required" },
      },
      messageApi: {},
      customRules,
      rulesObj: { field1: [{ name: "rulesObj" }] },
      data: { field1: "value" },
      form: { setFieldsValue: vi.fn() },
      onUpdate: vi.fn(),
    };

    render(<FormItemsBuilderGroup {...props} />);

    expect(getIsRequired).toHaveBeenCalledWith(true);
    expect(getRules).toHaveBeenCalledWith([{ name: "rulesObj" }], true);

    const newItemMock = NewItem as vi.Mock;
    const call = newItemMock.mock.calls[0][0];

    expect(call.disabled).toBe(false);
    expect(call.rules).toEqual([
      ...customRules,
      { name: "fromGetRules", rules: [{ name: "rulesObj" }], isRequired: true },
      ...itemRules,
    ]);
    expect(call.validateStatus).toBe("error");
    expect(call.help).toBe("Required");
  });
});
