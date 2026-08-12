import { mockCashflow1, mockCashflow2 } from "src/Cashflow_CN/test/mockData/cashflow";
import { fn } from "src/test/test-utils";

import CashflowNotificationPool from "./CashflowNotificationPool";

beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
});

describe('CashflowNotificationPool', () => {
  it("CashflowNotificationPool", () => {
    const pool = new CashflowNotificationPool();
    const subscriber = fn();
    pool.subscribe(subscriber);
    pool.add(mockCashflow1);
    pool.add([mockCashflow2]);
    vi.advanceTimersByTime(6000);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
  it("should remove outdated data from the pool", () => {
    const pool = new CashflowNotificationPool();
    const subscriber = fn();
    pool.subscribe(subscriber);
    pool.add(mockCashflow1);
    pool.add(mockCashflow2);
    vi.advanceTimersByTime(6000);
    expect(pool['pool']).toEqual([]);
  });

  it("should unsubscribe a listener", () => {
    const pool = new CashflowNotificationPool();
    const subscriber = fn();
    pool.subscribe(subscriber);
    pool.unsubscribe(subscriber);
    pool.add(mockCashflow1);
    vi.advanceTimersByTime(6000);
    expect(subscriber).not.toHaveBeenCalled();
  });

  it("should unsubscribe all listeners", () => {
    const pool = new CashflowNotificationPool();
    const subscriber1 = fn();
    const subscriber2 = fn();
    pool.subscribe(subscriber1);
    pool.subscribe(subscriber2);
    pool.unsubscribeAll();
    pool.add(mockCashflow1);
    vi.advanceTimersByTime(6000);
    expect(subscriber1).not.toHaveBeenCalled();
    expect(subscriber2).not.toHaveBeenCalled();
  });

  it("should start and stop the pool", () => {
    const pool = new CashflowNotificationPool();
    const subscriber = fn();
    pool.subscribe(subscriber);
    pool.add(mockCashflow1);
    pool.stop();
    vi.advanceTimersByTime(6000);
    expect(subscriber).not.toHaveBeenCalled();
    pool.start();
    vi.advanceTimersByTime(6000);
    expect(subscriber).toHaveBeenCalledTimes(1);
  });
});