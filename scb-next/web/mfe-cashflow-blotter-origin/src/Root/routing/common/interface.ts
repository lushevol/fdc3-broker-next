export interface CashflowParametersProps {
  cashflowId?: string;
  filters?: Filter[];
}

export interface TileProps {
  children?: React.ReactNode;
  tile: string;
  parameters?: CashflowParametersProps;
}
