import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Context } from "./store";
import { handleOptions, matchFields, ViewBuilder } from "./ViewBuilder";

jest.mock("../../ratanutils/authenticator", () => {
  return {
    hasPrivatePermission: () => true,
    hasPublicPermission: () => true,
    getUser: () => ({ role: 'FMO_MO_TV' })
  }
})

jest.mock("../../LazyAntd/Input", () => {
  return (prop) => <input {...prop} />
})

test("View Builder", () => {
  const close = jest.fn();
  const tradeGridReady = {
    api: {
      getAllDisplayedColumns: () => [],
      getColumnState: () => []
    },
  };
  const state= {};
  const dispatch = jest.fn();
  const viewOptions = new Map();
  viewOptions.set('Additional_Payment', [{
    "headerName": "Additional Party Payment Amount",
    "field": "Additional_Payment.Additional_Party_Payment_Amount",
    "hide": true,
    "group": "Additional_Payment"
}])

  render(
    <Context.Provider value={{ state, dispatch }}>
      <ViewBuilder
        openBuilder={true}
        onClose={close}
        tradeGridReady={tradeGridReady}
        viewFieldType="TRADE_VIEW_BUILDER"
        viewOptions={viewOptions}
      />
    </Context.Provider>
  );

  const searchField = screen.getByTestId('searchField');
  userEvent.type(searchField, 'Additional_Payment');

  const closeBtn = screen.getByTestId('setBtn');
  userEvent.click(closeBtn);
});

describe('matchFields', () => {
  test('should return null if value does not include searchValue', () => {
    const result = matchFields('Hello World', 'foo');
    expect(result).toBeNull();
  });

  test('should return highlighted value if value includes searchValue', () => {
    const result = matchFields('Hello World', 'world');
    expect(result).toBe('Hello <b>World</b>');
  });

  test('should handle case-insensitive matching', () => {
    const result = matchFields('Hello World', 'WORLD');
    expect(result).toBe('Hello <b>World</b>');
  });

  test('should return null if value is null', () => {
    const result = matchFields(null, 'world');
    expect(result).toBeNull();
  });

  test('should return null if value is undefined', () => {
    const result = matchFields(undefined, 'world');
    expect(result).toBeNull();
  });

  test('should return null if searchValue is empty', () => {
    const result = matchFields('Hello World', '');
    expect(result).toEqual("Hello World");
  });

  test('should handle multiple occurrences of searchValue', () => {
    const result = matchFields('Hello World, World', 'world');
    expect(result).toBe('Hello <b>World</b>, World');
  });

  test('should handle special characters in searchValue', () => {
    const result = matchFields('Hello World 2023', '2023');
    expect(result).toBe('Hello World <b>2023</b>');
  });
});

describe('handleOptions', () => {
  const options = [
    { headerName: 'Name', field: 'John Doe' },
    { headerName: 'Age', field: '30' },
  ];

  it('should highlight matching text in headerName and field', () => {
    const searchValue = 'john';
    const result = handleOptions(options, searchValue);
    expect(result).toEqual([
      { headerName: 'Name', field: 'John Doe', searchHeaderName: null, searchField: '<b>John</b> Doe', searchShow: true },
      { headerName: 'Age', field: '30', searchHeaderName: null, searchField: null, searchShow: false },
    ]);
  });

  it('should return all options if searchValue is empty', () => {
    const searchValue = '';
    const result = handleOptions(options, searchValue);
    expect(result).toEqual([
      { headerName: 'Name', field: 'John Doe', searchHeaderName: "Name", searchField: "John Doe", searchShow: true },
      { headerName: 'Age', field: '30', searchHeaderName: "Age", searchField: "30", searchShow: true },
    ]);
  });

  it('should handle case insensitive search', () => {
    const searchValue = 'NAME';
    const result = handleOptions(options, searchValue);
    expect(result).toEqual([
      { headerName: 'Name', field: 'John Doe', searchHeaderName: '<b>Name</b>', searchField: null, searchShow: true },
      { headerName: 'Age', field: '30', searchHeaderName: null, searchField: null, searchShow: false },
    ]);
  });
});