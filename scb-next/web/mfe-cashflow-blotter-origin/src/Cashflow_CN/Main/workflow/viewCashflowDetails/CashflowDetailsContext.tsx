import { createContext, useContext } from "react";
interface CashflowDetailsContextProps {
  opensearch: boolean;
}
export const CashflowDetailsContext =
  createContext<CashflowDetailsContextProps>({
    opensearch: false,
  });

export const useCashflowDetailsContext = () =>
  useContext(CashflowDetailsContext);
