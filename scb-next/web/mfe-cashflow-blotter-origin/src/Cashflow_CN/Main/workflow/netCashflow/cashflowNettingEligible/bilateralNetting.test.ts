import { cashflowCanBeBilateralNetting,validateCCILGuaranteedNetting } from "./bilateralNetting";

describe('validateCCILGuaranteedNetting', () => {
  // Helper to create a base cashflow object without optional fields
  const createBaseCashflow = (): CNCashflow => ({
    Entity: undefined,
    Settlement_Method: undefined,
    Cashflow: undefined,
  });

  it('should return true when all conditions are met', () => {
    const validCashflow: CNCashflow = {
      Entity: {
        Counterparty_SCI_BIC_Net_Flag: 'N', // Not "Y" -> Passes condition 1
        Counterparty_SCI_FMID: '400021949', // Matches exactly -> Passes condition 5
      },
      Settlement_Method: 'CCIL', // Matches exactly -> Passes condition 2
      Cashflow: {
        Cashflow_State: 'WAITING', // Matches exactly -> Passes condition 3
        Cashflow_Sub_State_Type: 'Pending Netting', // One of the allowed values -> Passes condition 4
      },
    };

    const result = validateCCILGuaranteedNetting(validCashflow);
    expect(result).toBe(true);
  });

  it('should return false if Counterparty_SCI_BIC_Net_Flag is "Y"', () => {
    const invalidFlagFlow: CNCashflow = {
      ...createBaseCashflow(),
      Entity: {
        Counterparty_SCI_BIC_Net_Flag: 'Y', // Fails condition 1
        Counterparty_SCI_FMID: '400021949',
      },
      Settlement_Method: 'CCIL',
      Cashflow: {
        Cashflow_State: 'WAITING',
        Cashflow_Sub_State_Type: 'Pending Auto Netting',
      },
    };

    const result = validateCCILGuaranteedNetting(invalidFlagFlow);
    expect(result).toBe(false);
  });

  it('should return false if Settlement_Method is not "CCIL"', () => {
    const invalidMethodFlow: CNCashflow = {
      ...createBaseCashflow(),
      Entity: {
        Counterparty_SCI_BIC_Net_Flag: 'N',
        Counterparty_SCI_FMID: '400021949',
      },
      Settlement_Method: 'TELLER', // Not "CCIL" -> Fails condition 2
      Cashflow: {
        Cashflow_State: 'WAITING',
        Cashflow_Sub_State_Type: 'Pending Netting',
      },
    };

    const result = validateCCILGuaranteedNetting(invalidMethodFlow);
    expect(result).toBe(false);
  });

  it('should return false if Cashflow_State is not "WAITING"', () => {
    const invalidStateFlow: CNCashflow = {
      ...createBaseCashflow(),
      Entity: {
        Counterparty_SCI_BIC_Net_Flag: 'N',
        Counterparty_SCI_FMID: '400021949',
      },
      Settlement_Method: 'CCIL',
      Cashflow: {
        Cashflow_State: 'PROCESSED', // Not "WAITING" -> Fails condition 3
        Cashflow_Sub_State_Type: 'Pending Netting',
      },
    };

    const result = validateCCILGuaranteedNetting(invalidStateFlow);
    expect(result).toBe(false);
  });

  it('should return false if Cashflow_Sub_State_Type is neither "Pending Netting" nor "Pending Auto Netting"', () => {
    const invalidSubStateFlow: CNCashflow = {
      ...createBaseCashflow(),
      Entity: {
        Counterparty_SCI_BIC_Net_Flag: 'N',
        Counterparty_SCI_FMID: '400021949',
      },
      Settlement_Method: 'CCIL',
      Cashflow: {
        Cashflow_State: 'WAITING',
        Cashflow_Sub_State_Type: 'FINISHED', // Invalid sub-state -> Fails condition 4
      },
    };

    const result = validateCCILGuaranteedNetting(invalidSubStateFlow);
    expect(result).toBe(false);
  });

  it('should return false if Counterparty_SCI_FMID is not "400021949"', () => {
    const invalidFMIDFlow: CNCashflow = {
      ...createBaseCashflow(),
      Entity: {
        Counterparty_SCI_BIC_Net_Flag: 'N',
        Counterparty_SCI_FMID: '999999999', // Does not match -> Fails condition 5
      },
      Settlement_Method: 'CCIL',
      Cashflow: {
        Cashflow_State: 'WAITING',
        Cashflow_Sub_State_Type: 'Pending Auto Netting',
      },
    };

    const result = validateCCILGuaranteedNetting(invalidFMIDFlow);
    expect(result).toBe(false);
  });

  describe('handles missing optional properties', () => {
    it('should return false if the entire Entity is missing', () => {
      const noEntityFlow: CNCashflow = {
        ...createBaseCashflow(),
        Settlement_Method: 'CCIL',
        Cashflow: {
          Cashflow_State: 'WAITING',
          Cashflow_Sub_State_Type: 'Pending Netting',
        },
      };

      const result = validateCCILGuaranteedNetting(noEntityFlow);
      expect(result).toBe(false);
    });

    it('should return false if the entire Cashflow object is missing', () => {
      const noCashflowFlow: CNCashflow = {
        ...createBaseCashflow(),
        Entity: {
          Counterparty_SCI_BIC_Net_Flag: 'N',
          Counterparty_SCI_FMID: '400021949',
        },
        Settlement_Method: 'CCIL',
      };

      const result = validateCCILGuaranteedNetting(noCashflowFlow);
      expect(result).toBe(false);
    });

    it('should return false if Cashflow_Sub_State_Type is missing', () => {
      const missingSubStateFlow: CNCashflow = {
        ...createBaseCashflow(),
        Entity: {
          Counterparty_SCI_BIC_Net_Flag: 'N',
          Counterparty_SCI_FMID: '400021949',
        },
        Settlement_Method: 'CCIL',
        Cashflow: {
          Cashflow_State: 'WAITING',
          // Cashflow_Sub_State_Type is omitted -> .includes() will fail
        },
      };

      const result = validateCCILGuaranteedNetting(missingSubStateFlow);
      expect(result).toBe(false);
    });
  });
});

describe("cashflowCanBeBilateralNetting", () => {
  const baseCashflow = {
    Settlement_Method: "WIRE",
    Cashflow: {
      Cashflow_State: "WAITING",
      Splitting_Id: undefined,
    },
    Entity: {
      Counterparty_SCI_BIC_Net_Flag: "N",
      Counterparty_SCI_FMID: "400021948",
    },
  };
  it("should return true for generic netting when all conditions are met", () => {
    expect(
      cashflowCanBeBilateralNetting({
        ...baseCashflow,
        Cashflow: { ...baseCashflow.Cashflow, Splitting_Id: "" },
      })
    ).toBe(true);
    expect(
      cashflowCanBeBilateralNetting({
        ...baseCashflow,
        Cashflow: { ...baseCashflow.Cashflow, Splitting_Id: undefined },
      })
    ).toBe(true);
    expect(
      cashflowCanBeBilateralNetting({
        ...baseCashflow,
        Cashflow: { ...baseCashflow.Cashflow, Splitting_Id: null },
      })
    ).toBe(true);
  });
  it("should return false for CCIL guaranteed netting if Splitting_Id is not empty", () => {
    expect(
      cashflowCanBeBilateralNetting({
        Settlement_Method: "CCIL",
        Cashflow: {
          Cashflow_State: "WAITING",
          Cashflow_Sub_State_Type: "Pending Netting",
          Splitting_Id: "NOT_EMPTY",
        },
        Entity: {
          Counterparty_SCI_BIC_Net_Flag: "N",
          Counterparty_SCI_FMID: "400021949",
        },
      })
    ).toBe(false);
  });


});

