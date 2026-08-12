import { fireEvent, render, screen } from "@testing-library/react";
import "../../ratanstatic";
import { conversionCascaderOptions } from "../../ratanutils/conversion";
import { FilterItem, filterArr } from "./FilterItem";
import transaction_data from './transaction_data.json';

afterAll(() => {
  vi.clearAllMocks();
});
let FILTER_FIELDS;
let CASCADER_OPTIONS;
beforeEach(() => {
  FILTER_FIELDS = transaction_data;
  CASCADER_OPTIONS = conversionCascaderOptions(FILTER_FIELDS);
});

const onChange = vi.fn();
const onRemove = vi.fn();

describe("FilterItem component", () => {
  it("should be in the document", () => {
    filterArr({ children: ["a"] }, { children: ["b"] });
    filterArr({ children: ["a"] }, {});
    filterArr({}, { children: ["b"] });
    filterArr({}, {});
    const filterValue = { "field": ["Action_Type"], "operator": "EQ", "values": "", "name": "TextInput" };
    render(
      <FilterItem
        filterValue={filterValue}
        index={0}
        onChange={onChange}
        onRemove={onRemove}
        CASCADER_OPTIONS={CASCADER_OPTIONS}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    expect(screen).toBeDefined();
  });
  it("should be in the document", async () => {
    const filterValue = {
      field: ['Trade_Event', 'Cash_Settlement_Currency'],
      values: ['CSC_1', 'CSC_2'],
      operator: 'LIKE',
      operatorType: 'freeText',
      name: 'TextInput',
    };
    render(
      <FilterItem
        filterValue={filterValue}
        index={0}
        onChange={onChange}
        onRemove={onRemove}
        CASCADER_OPTIONS={CASCADER_OPTIONS}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    expect(screen).toBeDefined();
    const element1 = await screen.findByTestId('fieldCascaderTrade_Event.Cash_Settlement_Currency');
    expect(element1).toBeInTheDocument();

    const fieldCascader = screen.getByTestId('fieldCascaderTrade_Event.Cash_Settlement_Currency').firstChild;
    if (fieldCascader) {
      fireEvent.mouseDown(fieldCascader);

      const fieldValue1 = await screen.findByText('Cash Settlement Amount');
      fireEvent.click(fieldValue1);
      expect(onChange).toBeCalled();
      const input = await screen.findByTestId('textInputTrade_Event.Cash_Settlement_Currency');
      fireEvent.change(input, { target: { value: '8' } });
      fireEvent.blur(input);
      expect(onChange).toBeCalledWith({ values: '8' }, 0);
    }

    const input = await screen.findAllByRole("combobox")
    fireEvent.keyPress(input[0], { target: { value: '8' } });
    fireEvent.change(input[0], { target: { value: '8' } });
    fireEvent.keyUp(input[0], { target: { value: '8' }, code: '8' });
    fireEvent.blur(input[0]);

    const btn = screen.getByTestId('removeItemBtnTrade_Event.Cash_Settlement_Currency');
    fireEvent.click(btn);
    expect(onRemove).toBeCalled();

  });
  it("should be in the document", () => {
    const filterValue = { "field": ["Swap_Instrument", "Return_Leg", "Basket_Constituent_Substitution_Flag"], "operator": "EQ", "values": "", "name": "TextInput" };
    render(
      <FilterItem
        filterValue={filterValue}
        index={0}
        onChange={onChange}
        onRemove={onRemove}
        CASCADER_OPTIONS={CASCADER_OPTIONS}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    const filterValue = { "field": ["Swap_Instrument", "Return_Leg", "Cash_Financial_Instrument", "Basket_Underliers_Net_Price"], "operator": "EQ", "values": "", "name": "TextInput" };
    render(
      <FilterItem
        filterValue={filterValue}
        index={0}
        onChange={onChange}
        onRemove={onRemove}
        CASCADER_OPTIONS={CASCADER_OPTIONS}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    expect(screen).toBeDefined();
  });

  it("should be in the document", () => {
    const filterValue = { "field": ["Swap_Instrument", "Return_Leg", "Cash_Financial_Instrument", "Basket_Underliers_Net_Price", "USD"], "operator": "EQ", "values": "", "name": "TextInput" };
    render(
      <FilterItem
        filterValue={filterValue}
        index={0}
        onChange={onChange}
        onRemove={onRemove}
        CASCADER_OPTIONS={CASCADER_OPTIONS}
        FILTER_FIELDS={FILTER_FIELDS}
      />
    );
    expect(screen).toBeDefined();
  });
})
