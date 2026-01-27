import type { Context } from 'openfin-fdc3';

export interface FMPTPViewTrade extends Context {
  type: 'scb.fmptp.trade';
  id: {
    tradeId: string;
  };
}
