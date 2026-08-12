import {
  render,
  fireEvent,
  screen,
  waitFor,
  findByTestId,
  act,
} from "@testing-library/react";
import * as _ from "lodash";

import userEvent from "@testing-library/user-event";
import { HandleHoliday } from "./index";

import { queryHolidy } from "../../ratanutils/http/api";
import holidayDB from '../../ratanutils/holidayDB';

afterAll(() => {
  vi.useRealTimers();
});

vi.mock("../../ratancomponents/Loading", () => {
  const Loading = () => <section data-testid="loading" />;
  return {
    Loading,
  };
});

vi.mock('../../ratanutils/holidayDB', () => {
  return {
    default: {
      add: vi.fn(),
      get: vi.fn(() => Promise.resolve(undefined)),
    },
  };
})

vi.mock('../../ratanutils/http/api', () => {
  return {
    queryHolidy: vi.fn(() => Promise.resolve([
      { eventDate: "2023-01-01", currencyCode: "5", eventName: "name" },
    ]))
  }
})

describe("HandleHoliday component", () => {
  it("render with holiday Settings", async () => {
    const promise = Promise.resolve("name");
    const defaultData = {};
    _.set(defaultData, "Cashflow.Payment_Date", "2023-01-01T00:11:22C");
    _.set(defaultData, "Cashflow.Payment_Currency", "5");
    const { getByTestId } = render(
      <HandleHoliday value={""} data={defaultData} field={""} />
    );
    await act(async () => {
      await promise;
    });
    expect(holidayDB.get).toBeCalled();
    expect(getByTestId("loading")).toBeInTheDocument();
  });

  it("render without Settings", async () => {
    vi.useFakeTimers();
    const promise = Promise.resolve(undefined);
    const defaultData = {};
    _.set(defaultData, "Cashflow.Payment_Date", "2023-01-01T00:11:22C");
    _.set(defaultData, "Cashflow.Payment_Currency", "5");
    const { getByTestId } = render(
      <HandleHoliday value={""} data={defaultData} field={""} />
    );
    await act(async () => {
      await promise;
    });
    expect(getByTestId("loading")).toBeInTheDocument();
    vi.advanceTimersByTime(1000);
    expect(queryHolidy).toBeCalled();
  });
});
