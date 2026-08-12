import { fireEvent,render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import _get from "lodash/get";

import { AmountItem } from "./AmountItem";

vi.mock("Import/ratancomponents", () => {
  const DynamickFieldLabel = (props) => {
    const { children, onChange } = props;
    return (
      <section>
        <input
          data-testid="mockLabel"
          onChange={(e) => {
            const v = JSON.parse(e.target.value);
            onChange(v);
          }}
        />
        {children}
      </section>
    );
  };

  return {
    DynamickFieldLabel,
  };
});

describe("AmountItem component", () => {
  it("EQ should be in the document", () => {
    const filter = {
      "Cashflow.Payment_Currency": "0",
    };
    const onResult = vi.fn();
    const { getByTestId } = render(
      <AmountItem filter={filter} onResult={onResult} />
    );
    expect(getByTestId("amountValueEQ")).toBeInTheDocument();
    expect(onResult).toHaveBeenCalled();
    expect(_get(onResult, "mock.lastCall[0]")).toStrictEqual({
      isOk: true,
      msg: null,
    });
    userEvent.type(getByTestId("amountValueEQ"), "1");
    expect(_get(onResult, "mock.lastCall[0].msg")).toStrictEqual([
      {
        field: "Cashflow.Payment_Amount",
        operator: "EQ",
        values: "1",
      },
    ]);
  });

  it("GTE should be in the document", () => {
    const filter = {
      "Cashflow.Payment_Currency": "0",
    };
    const onResult = vi.fn();
    const { getByTestId } = render(
      <AmountItem filter={filter} onResult={onResult} />
    );
    fireEvent.change(getByTestId("mockLabel"), {
      target: { value: '{ "field": "GTE" }' },
    });
    expect(getByTestId("amountValueLaterOrBefore")).toBeInTheDocument();
    userEvent.type(getByTestId("amountValueLaterOrBefore"), "1");
    expect(_get(onResult, "mock.lastCall[0].msg")).toStrictEqual([
      {
        field: "Cashflow.Payment_Amount",
        operator: "GTE",
        values: "1",
      },
    ]);
  });

  it("LTE should be in the document", () => {
    const filter = {
      "Cashflow.Payment_Currency": "0",
    };
    const onResult = vi.fn();
    const { getByTestId } = render(
      <AmountItem filter={filter} onResult={onResult} />
    );
    fireEvent.change(getByTestId("mockLabel"), {
      target: { value: '{ "field": "LTE" }' },
    });
    expect(getByTestId("amountValueLaterOrBefore")).toBeInTheDocument();
    userEvent.type(getByTestId("amountValueLaterOrBefore"), "100");
    expect(_get(onResult, "mock.lastCall[0].msg")).toStrictEqual([
      {
        field: "Cashflow.Payment_Amount",
        operator: "LTE",
        values: "100",
      },
    ]);
  });

  it("No Currency", () => {
    const filter = {};
    const onResult = vi.fn();
    const { getByTestId } = render(
      <AmountItem filter={filter} onResult={onResult} />
    );
    expect(getByTestId("amountValueEQ")).toBeInTheDocument();

    userEvent.type(getByTestId("amountValueEQ"), "100");
    expect(_get(onResult, "mock.lastCall[0]")).toStrictEqual({
      isOk: false,
      msg: "Please select a currency!",
    });
  });

  it("BET should be in the document", () => {
    const filter = {
      "Cashflow.Payment_Currency": "0",
    };
    const onResult = vi.fn();
    const { getByTestId } = render(
      <AmountItem filter={filter} onResult={onResult} />
    );
    fireEvent.change(getByTestId("mockLabel"), {
      target: { value: '{ "field": "BET" }' },
    });
    expect(getByTestId("amountStart")).toBeInTheDocument();
    expect(getByTestId("amountEnd")).toBeInTheDocument();
    userEvent.type(getByTestId("amountStart"), "1");
    userEvent.type(getByTestId("amountEnd"), "1");
    expect(_get(onResult, "mock.lastCall[0]")).toStrictEqual({
      isOk: false,
      msg: "The maximum amount should be greater than the minimum amount!",
    });
    userEvent.type(getByTestId("amountEnd"), "2");
    expect(_get(onResult, "mock.lastCall[0].msg")).toStrictEqual([
      {
        field: "Cashflow.Payment_Amount",
        operator: "BET",
        values: ["1", "12"],
      },
    ]);
  });
});
