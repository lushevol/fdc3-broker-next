export const isSameCashflow = (source: CNCashflow, target: CNCashflow) => {
  return source?.Cashflow?.Cashflow_Id === target?.Cashflow?.Cashflow_Id;
};

export const isCashflowUpdated = (source: CNCashflow, target: CNCashflow) => {
  const {
    Cashflow_Version: Source_Cashflow_Version = 0,
    Cashflow_Minor_Version: Source_Cashflow_Minor_Version = 0,
    Cashflow_Business_Version: Source_Cashflow_Business_Version = 0,
  } = source.Cashflow ?? {};
  const {
    Cashflow_Version = 0,
    Cashflow_Minor_Version = 0,
    Cashflow_Business_Version = 0,
  } = target.Cashflow ?? {};
  return (
    Cashflow_Version > Source_Cashflow_Version ||
    Cashflow_Minor_Version > Source_Cashflow_Minor_Version ||
    Cashflow_Business_Version > Source_Cashflow_Business_Version
  );
};

export const isCashflow = (data: any) => {
  return !!data?.Cashflow?.Cashflow_Id;
};
