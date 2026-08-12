import { cashflowCanBeCCILNetting } from "./ccilNetting";

describe("cashflowCanBeCCILNetting", () => {
  const baseCashflow = {
    Settlement_Method: "CCIL",
    Cashflow: {
      Cashflow_State: "WAITING",
      Cashflow_Sub_State_Type: "Pending Netting",
      Splitting_Id: undefined,
    },
    Entity: {
      Counterparty_SCI_BIC_Net_Flag: "N",
      Counterparty_SCI_FMID: "400021948",
      Booking_Entity_SCI_FMID: "400021948",
    },
  };

  it("should return true when all conditions are met and Splitting_Id is empty", () => {
    expect(cashflowCanBeCCILNetting({ ...baseCashflow, Cashflow: { ...baseCashflow.Cashflow, Splitting_Id: "" } })).toBe(true);
    expect(cashflowCanBeCCILNetting({ ...baseCashflow, Cashflow: { ...baseCashflow.Cashflow, Splitting_Id: undefined } })).toBe(true);
    expect(cashflowCanBeCCILNetting({ ...baseCashflow, Cashflow: { ...baseCashflow.Cashflow, Splitting_Id: null } })).toBe(true);
  });

  it("should return false if Counterparty_SCI_BIC_Net_Flag is Y", () => {
    expect(
      cashflowCanBeCCILNetting({
        ...baseCashflow,
        Entity: { ...baseCashflow.Entity, Counterparty_SCI_BIC_Net_Flag: "Y" },
      })
    ).toBe(false);
  });

  it("should return false if Settlement_Method is not CCIL", () => {
    expect(
      cashflowCanBeCCILNetting({
        ...baseCashflow,
        Settlement_Method: "OTHER",
      })
    ).toBe(false);
  });

  it("should return false if Cashflow_State is not WAITING", () => {
    expect(
      cashflowCanBeCCILNetting({
        ...baseCashflow,
        Cashflow: { ...baseCashflow.Cashflow, Cashflow_State: "OTHER" },
      })
    ).toBe(false);
  });

  it("should return false if Cashflow_Sub_State_Type is not eligible", () => {
    expect(
      cashflowCanBeCCILNetting({
        ...baseCashflow,
        Cashflow: { ...baseCashflow.Cashflow, Cashflow_Sub_State_Type: "Other" },
      })
    ).toBe(false);
  });

  it("should return false if Counterparty_SCI_FMID is 400021949", () => {
    expect(
      cashflowCanBeCCILNetting({
        ...baseCashflow,
        Entity: { ...baseCashflow.Entity, Counterparty_SCI_FMID: "400021949" },
      })
    ).toBe(false);
  });

  it("should return false if Splitting_Id is not empty", () => {
    expect(
      cashflowCanBeCCILNetting({
        ...baseCashflow,
        Cashflow: { ...baseCashflow.Cashflow, Splitting_Id: "NOT_EMPTY" },
      })
    ).toBe(false);
  });
});